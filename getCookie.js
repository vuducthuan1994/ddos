const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginProxy = require('puppeteer-extra-plugin-proxy');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

// puppeteerExtra.use(pluginProxy());
puppeteerExtra.use(pluginStealth());

const test = async function() {
    const proxy = 'http://user49157:XHR1HlPdQu@23.157.216.21:49157'; 
    const browser = await puppeteerExtra.launch({
        "headless": false,
        args: [
            // '--window-size=1920,1080',
            // '--disable-dev-profile',
            // '--no-sandbox',
            // '--disable-web-security',
            `--proxy-server=${proxy}` // Set proxy server
        ]
    });
    const page = await browser.newPage();

    try {
        await page.goto('https://novellive.com/');
    } catch (error) {
        console.error('Error navigating to the page:', error.message);
    } finally {
        // // Close the browser
        // await browser.close();
    }
}
// test();