import puppeteer from "puppeteer";


const scrapeImages = async function(username) {

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.instagram.com/accounts/login');

    // Login form
    await page.screenshot({ path: 'screenshot-1.png' });

    await page.type('[name=username]', "fireship_dev");

    await page.type('[name=password]', "my-password");

    await page.screenshot({ path: 'screenshot-2.png' });

    await page.click('[type=submit]');

    // Social page

    await page.waitFor(5000);

    await page.goto(`https://www.instagram.com/${username}`);

    // waiting for javascript to render img tags
    await page.waitForSelector('img', { visible: true });

    await page.screenshot({ path: 'screenshot-3.png' });

    // Access page DOM
    const data = await page.evaluate(() => {
        const imgs = document.getElementsByTagName('img');

        const urls = imgs.map( img => img.src );

        return urls;

    });

    await browser.close();

    return data;

};

export default scrapeImages;