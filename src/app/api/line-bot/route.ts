import {NextResponse} from "next/server";
import { messagingApi } from "@line/bot-sdk";
import http from 'http';

const lineBotClient = new messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_BOT_CHANNEL_ACCESS_TOKEN
})

export async function POST(req: Request) {
    const data = await req.json() // WebHookデータ
    for (const event of data.events) {
        const { message, replyToken } = event
        const host = process.env.HOST || 'localhost';
        const port = process.env.PORT;
        const url = `http://${host}:${port}`;
        const ngrokUrl = await getNgrokUrl();

        await lineBotClient.replyMessage({
          replyToken: replyToken,
          messages: [
            {
                type: 'text',
                text: [
                    `LINE Bot が動かない場合は`,
                    `[1] 環境変数の設定の確認`,
                    `[2] ngrok の再起動`,
                    `[3] LINE Bot の再起動\nを行ってください`
                ].join('\n')
            },
            {
                type: 'text',
                text: [
                    `ngrok のリンク: ${ngrokUrl}`,
                    `Next.js のリンク: ${url}`,
                    `LIFF アプリのリンク: https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`
                ].join('\n')
            },
            (message.type === 'text' ?
                { type: 'text', text: `「${message.text}」が入力されました` } :
                { type: 'text', text: 'メッセージ以外が入力されました' })
          ]
        });
    }
    return NextResponse.json({ ok: true })
}

const getNgrokUrl = () => {
    return new Promise((resolve, reject) => {
        http.get('http://localhost:4040/api/tunnels', (resp) => {
            let data = '';

            // Receive data
            resp.on('data', (chunk) => {
            data += chunk;
            });

            // Process data on end
            resp.on('end', () => {
            try {
                const tunnels = JSON.parse(data).tunnels;
                const publicUrl = tunnels.find(tunnel => tunnel.proto === 'https').public_url;
                resolve(publicUrl);
            } catch (error) {
                reject(new Error('Failed to parse ngrok URL'));
            }
            });
        }).on("error", (err) => {
            reject(new Error("Error: " + err.message));
        });
    });
}
