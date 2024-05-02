import type {NextApiRequest, NextApiResponse} from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = typeof req.query.url === 'string' ? req.query.url : '';

    // get the last word from / of url
    const urlArr = url.split('/');
    const lastWord = urlArr[urlArr.length - 1];

    // 啟動一個新的瀏覽器實例
    const browser = await puppeteer.launch();

    // 開啟一個新的頁面
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    // 將頁面轉換為PDF
    const pdf = await page.pdf({format: 'A4'});

    // eslint-disable-next-line no-console
    console.log('pdf in report API:', pdf);

    // 關閉瀏覽器
    await browser.close();

    // 設置回應頭部為PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${lastWord}.pdf`);

    // 發送PDF檔案到客戶端，並設置狀態碼200
    res.status(200).send(pdf);
  } catch (error) {
    // 處理錯誤，並回傳相應的狀態碼
    res.status(500).json({message: 'Error generating PDF', error});
  }
}
