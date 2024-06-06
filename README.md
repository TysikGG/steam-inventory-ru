# Получение инвентарей Steam на Node.js
Простая библиотека для получения Steam-инвентарей.
Без необходимости использования API-ключа.

**Установка**
```js
npm i steam-inventory-ru
```

**Импорт**
```js
const steaminventory = require('steam-inventory-ru');
```

## Методы
```js
steaminventory.getinventory(appid, steamid, contextid, reqData);
```
- appid: Это [appid](https://steamdb.info/apps/) игры, для которой вы запрашиваете инвентарь.
- steamid: Это [steam64](https://steamid.io/lookup/) ID пользователя, чей инвентарь вы запрашиваете.
- contextid: Данное значение является ID игры. Для игр от Valve оно зачастую 2.
- data: Дополнительные данные для запроса:
- reqData.tradable: Если true - возвращает только те предметы, которые можно обменять
- reqData.language: Поддерживает 2 языка: ru, en. Стандартное значение: en
- reqData.price: Добавлять ли в свойство price цену для каждого предмета (поддерживается только CS).
#### Данные
- data.raw: Raw-информация с сервера
- data.items: Вся информация о вещах (иконки, имена и прочее)
- data.marketnames: Имена вещей, возвращаемые в качестве JS-обьекта.
- data.assets: Вся информация об ассетах.
- data.assetids: Вся информация об ID ассетов.
## Примеры

### Получение списка вещей
```js
const steaminventory = require('steam-inventory-ru');
const steamid = '76561199009885328';
steaminventory.getinventory(730, steamid, '2', {tradeable: true, language: "en"}).then(data => {
    console.log(data.marketnames);
}).catch(err => console.log(err));

```
**Вывод**
```js
[ 'Sealed Graffiti | NaCl (Shark White)',
  'Glove Case',
  'Gamma 2 Case',
  'Chroma 2 Case',
  'И много других имён...']
```

### Получение конкретных данных о вещах
```js
const steaminventory = require('steam-inventory-ru');
const steamid = '76561199009885328';
steaminventory.getinventory(730, steamid, '2', true).then(data => {
    console.log(data.raw); // Выводит имя каждой вещи в инвентаре
}).catch(err => console.log(err));
```
**Вывод**
```js
{ appid: 730,
       classid: '1989274437',
       instanceid: '302028390',
       currency: 0,
       background_color: '',
       icon_url: 'IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdB2ozio1RrlIWFK3Uf'
       ...
```
