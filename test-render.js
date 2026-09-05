import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  const content = await page.content();
  if (content.includes('id="root"')) {
     const rootHtml = await page.$eval('#root', el => el.innerHTML);
     console.log('Root HTML length:', rootHtml.length);
  }
  await browser.close();
})();
