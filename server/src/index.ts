import Fastify from 'fastify';
import cors from '@fastify/cors';
import fetch from 'node-fetch';
import { config } from './config';
import { processTelegramData } from './telegram';
import { z } from 'zod';
import { Address, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import TelegramBot from 'node-telegram-bot-api';

const playedRequest = z.object({
    tg_data: z.string(),
});

const refundRequest = z.object({
    tg_payment_charge_id: z.string(),
});


async function main() {
    let keyPair = await mnemonicToPrivateKey(config.MNEMONIC.split(' '));
    const publicKey = keyPair.publicKey.toString('hex');
    let workchain = 0; // Usually you need a workchain 0
    let wallet = WalletContractV4.create({ workchain, publicKey: Buffer.from(publicKey, 'hex') });

    const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

    bot.on('pre_checkout_query', async (msg) => {
        console.log(msg);
        await bot.answerPreCheckoutQuery(msg.id, true)
    })

    bot.on('successful_payment', (msg) => {
        console.log(msg);
    })

    const fastify = Fastify({
        logger: true
    });

    if (config.CORS_ENABLED) {
        fastify.register(cors, {
            origin: config.CORS_ORIGIN!,
        });
    }

    fastify.post('/played', async function handler(request, reply) {
        const req = playedRequest.parse(request.body);
        const telegramData = processTelegramData(req.tg_data, config.TELEGRAM_BOT_TOKEN!);
        return { ok: telegramData.ok }
    })

    fastify.post('/refund', async function handler(request, reply) {
        const req = refundRequest.parse(request.body);
        return { ok: true}
    })

    fastify.get('/config', async function handler(request, reply) {
        return {
            ok: true, tokenRecipient: wallet.address.toString({ testOnly: config.NETWORK === 'testnet' }), jettonMaster: "kQAcmdbPgT_m06SpZA0_60MbV7lgfww2yOoXS5vNoi8xBaB2"
        }
    })

    fastify.post('/create-stars-invoice', async function handler(request, reply) {
        // Craete 1 stars invoice link
        // Maybe you also need to handle pre_checkout_query https://core.telegram.org/bots/api#precheckoutquery
        try {
            const response = await fetch(`https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/createInvoiceLink`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "test game items",
                    description: "item description",
                    payload: "order payload",
                    currency: "XTR",
                    prices: [{
                        label: "product_label",
                        amount: "1"
                    }]
                }),
            });
            const result = await response.json();
            return { ok: true, invoiceLink: result.result }
        } catch (error) {
            console.error(error)
        }
        return { ok: false }
    })

    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

main();
