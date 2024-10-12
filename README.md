# flappy-bird

This is an example of a game developed on the Ton chain using the Cocos game engine.

## Features

* Using Cocos game engine
* ​​TON Connect UI to connect wallet
* On-chain transactions
* Sharing on Telegram Mini APP
* Payment
* Using [game-engines-sdk](https://github.com/ton-org/game-engines-sdk)
* Using [cocos-telegram-miniapps extension](https://github.com/CocosTechLabs/cocos-telegram-miniapps)

## Demo Telegram APP
https://t.me/cocos_demo_bot/game


## Screenshots

![game screenshots](./image/game_screenshots.png)

## Get started
### client 
Import using cocos creator 3.8.3
Build option configuration
    `Target Environments` > 0.5

Install client dependencies:
```shell
cd client
npm install
```

### cocos-telegram-miniapps extension
Install extension dependencies and build:

```shell
cd client/extensions/cocos-telegram-miniapps
npm install
npm run build
```

### server
1. Copy `server/env_example` to `server/.env`
2. Open [BotFather](https://t.me/BotFather), run `/newbot` command and fill your new bot token to `TELEGRAM_BOT_TOKEN` variable.
3. Fill `MNEMONIC` variable with your test wallet seed phrase. You can create one using [assets-sdk](https://github.com/ton-community/assets-sdk) by running `assets-cli setup-env`.
4. Install dependencies and run the server:
```shell
cd server
npm install
npm run start
```
## License

[MIT](./LICENSE)
