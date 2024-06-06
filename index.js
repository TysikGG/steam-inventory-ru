const request = require('request');


exports.getinventory = async (appid, steamid, contextid, reqData) => {
    let pricesData;

    request('https://market.csgo.com/api/v2/prices/USD.json', function (error, response, body) {
        
        pricesData = JSON.parse(body)
        console.log(pricesData.items)
        function findPriceByMarketHashName(marketHashName) {
            const item = pricesData.items.find(item => item.market_hash_name === marketHashName);
            if (item) {
            return item.price;
            } else {
            return "-1";
            }
        }

        return new Promise((resolve, reject) => {
            if (typeof appid !== 'number') appid = 730;
            if (!contextid) contextid = 2;

            if (typeof contextid === 'string') contextid = parseInt(contextid);
            if (typeof reqData?.tradable !== "boolean") reqData.tradable = false;
            if (typeof reqData?.price !== "boolean") reqData.price = false;

            let headers;
            if (reqData.language != "en") headers = { "Accept-Language": "ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7,be;q=0.6" };
            else headers = {};

            request({
                uri: `/inventory/${steamid}/${appid}/${contextid}`,
                baseUrl: 'https://steamcommunity.com/',
                json: true,
                headers: headers
            }, async (err, res, body) => {
                if (!body) return reject(`Указанный SteamID не найден! Указанный ID: ${steamid}`);
                let items = body.descriptions;
                let assets = body.assets
                let marketnames = [];
                let assetids = [];
                let data = {
                    raw: body,
                    items: items,
                    marketnames: marketnames,
                    assets: assets,
                    assetids: assetids
                };

                if (items !== undefined) {
                    for (var i = 0; i < items.length; i++) {
                        if (reqData.price) items[i].price = findPriceByMarketHashName(items[i].market_hash_name)
                        marketnames.push(items[i].market_hash_name);
                        assetids.push(assets[i].assetid);

                        for (const category of items[i].tags) {
                            if (category.category == "Exterior") {
                                let qName;
                                if (category.internal_name == "WearCategory0") qName = {name: "FN", fullName: "Прямо с завода"};
                                if (category.internal_name == "WearCategory1") qName = {name: "MW", fullName: "Немного поношенное"};
                                if (category.internal_name == "WearCategory2") qName = {name: "FT", fullName: "Поношенное"};
                                if (category.internal_name == "WearCategory3") qName = {name: "WW", fullName: "После полевых испытаний"};
                                if (category.internal_name == "WearCategory4") qName = {name: "BS", fullName: "Закалённое в боях"};
                                console.log(qName)
                                items[i].quality = qName
                            } else if (category.category == "Rarity") {
                                let rarity;
                                if (category.internal_name == "Rarity_Default_Weapon" || category.internal_name == "Rarity_Default") rarity = {name: "default", fullName: "Стандартное"};
                                if (category.internal_name == "Rarity_Common_Weapon" || category.internal_name == "Rarity_Common") rarity = {name: "common", fullName: "Ширпотреб"};
                                if (category.internal_name == "Rarity_Uncommon_Weapon" || category.internal_name == "Rarity_Uncommon") rarity = {name: "uncommon", fullName: "Промышленное качество"};
                                if (category.internal_name == "Rarity_Rare_Weapon" || category.internal_name == "Rarity_Rare") rarity = {name: "rare", fullName: "Армейское качество"};
                                if (category.internal_name == "Rarity_Mythical_Weapon" || category.internal_name == "Rarity_Mythical") rarity = {name: "mythical", fullName: "Запрещенное"};
                                if (category.internal_name == "Rarity_Legendary_Weapon" || category.internal_name == "Rarity_Legendary") rarity = {name: "legendary", fullName: "Засекреченное"};
                                if (category.internal_name == "Rarity_Ancient_Weapon" || category.internal_name == "Rarity_Ancient") rarity = {name: "ancient", fullName: "Тайное"};
                                if (category.internal_name == "Rarity_Immortal_Weapon" || category.internal_name == "Rarity_Immortal") rarity = {name: "immortal", fullName: "Легендарное"};
                                if (category.internal_name == "Rarity_Unusual") rarity = {name: "unusual", fullName: "Необычное"};
                                else console.log(category.internal_name)
                                console.log(rarity)
                                items[i].rarity = rarity
                            }
                        }
                    }
                } else if (items === undefined) return reject("Не удалось найти вещей по указанному AppID!");

                
                data.items = data.items.filter(item => item.tradable == "1");

                if (err) return reject(err);
                return resolve(data);
            });
        })
    });
}