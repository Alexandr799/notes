const puppeteer = require("puppeteer");
const path = require('path')

const makepdf = async (html, name) => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser'
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.emulateMediaType('screen');
  const pathname = path.join(__dirname, '..', 'pdf', `Заметка # ${name}.pdf`)
  await page.pdf({
    path: pathname,
    margin: { top: '30px', right: '30px', bottom: '30px', left: '30px' },
    printBackground: true,
    format: 'A4',
  });

  await browser.close();
  return pathname
};


module.exports = makepdf
