const request = require('request');

exports.getinventory = (appid, steamid, contextid, reqData) => {
    return new Promise((resolve, reject) => {
        if (typeof appid !== 'number') appid = 730;
        if (!contextid) contextid = 2;

        if (typeof contextid === 'string') contextid = parseInt(contextid);
        if (typeof reqData?.tradable !== "boolean") reqData.tradable = false;

        let headers;
        if (reqData.language != "en") {
            headers = { "Accept-Language": "ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7,be;q=0.6" }
        } else {
            headers = {}
        }
        request({
            uri: `/inventory/${steamid}/${appid}/${contextid}`,
            baseUrl: 'https://steamcommunity.com/',
            json: true,
            headers: headers
        }, (err, res, body) => {
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
            }
            if (items !== undefined) {
                for (var i = 0; i < items.length; i++) {
                    marketnames.push(items[i].market_hash_name);
                    assetids.push(assets[i].assetid);
                }
            } else if (items === undefined) return reject("Не удалось найти вещей по указанному appID");

            
            data.items = data.items.filter(item => item.tradable == "1");

            if (err) return reject(err);
            return resolve(data);
        });
    })

}