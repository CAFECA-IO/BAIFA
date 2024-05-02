import type {NextApiRequest, NextApiResponse} from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = typeof req.query.url === 'string' ? req.query.url : '';

    // Info: get the last word from / of url (20240502 - Shirley)
    const urlArr = url.split('/');
    const lastWord = urlArr[urlArr.length - 1];

    // Info: 啟動一個新的瀏覽器實例 (20240502 - Shirley)
    const browser = await puppeteer.launch();

    // Info: 開啟一個新的頁面 (20240502 - Shirley)
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    // Info: 將頁面轉換為PDF (20240502 - Shirley)
    const pdf = await page.pdf({format: 'A4'});

    // Info: 關閉瀏覽器 (20240502 - Shirley)
    await browser.close();

    // Info: 設置回應頭部為PDF (20240502 - Shirley)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${lastWord}.pdf`);

    // Info: 發送PDF檔案到客戶端，並設置狀態碼200 (20240502 - Shirley)
    res.status(200).send(pdf);
  } catch (error) {
    // Info: 處理錯誤，並回傳相應的狀態碼 (20240502 - Shirley)
    res.status(500).json({message: 'Error generating PDF', error});
  }
}
