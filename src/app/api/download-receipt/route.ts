import {NextResponse} from "next/server";
import path from "node:path";
import * as os from "node:os";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
    const { receiptUrl, receipt_number } = await req.json();

    // ユーザーのデフォルトダウンロードフォルダを取得
    const downloadPath = path.join(os.homedir(), "Downloads");

    // Puppeteerを起動（ヘッドレスモードをオフ）
    const browser = await puppeteer.launch({ headless: true });

    // 既存のページ（デフォルトのページ）を取得
    const pages = await browser.pages();
    const page = pages[0]; // 最初に開かれるデフォルトのページを使用

    // Chrome DevTools Protocol（CDP）を使用して、ダウンロードフォルダを設定
    const client = await page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
    });

    // 指定した領収書URLにアクセス
    await page.goto(receiptUrl, { waitUntil: "networkidle2" });

    // PDFとして保存
    const filePath = path.join(downloadPath, `receipt-${receipt_number}.pdf`);
    await page.pdf({ path: filePath, format: "A4" });

    // ブラウザを閉じる
    await browser.close();

    return NextResponse.json('');
}
