require('dotenv').config();
const port = process.env.PORT || 8686;
const express = require('express');
const app = express();
const path = require('path');
puppeteer = require('puppeteer-extra');
AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());



app.get('/test', function (req, res) {
    return res.json({
        success: true
    })
})

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/getPanda', async function (req, res) {
    const url = req.query.url;
    if (url) {
        let browser;
        try {
            browser = await puppeteer.launch(
                {
                    headless: true,
                    args: [
                        "--no-sandbox",
                        "--disabled-setupid-sandbox",
                    ],
                }
            );
            const page = await browser.newPage();

            await page.goto(url, {
                waitUntil: 'load',
                timeout: 0
            });

            try {
                await page.waitForSelector('#novelArticle2', { timeout: 9000 });
            } catch (error) {
                if (page.url().includes('/login')) {
                    return res.json({
                        success: false,
                        needLogin: true
                    });
                }
                console.log("need captcha");
                const elementHandle = await page.waitForSelector('iframe', { timeout: 8000 });
                const frame = await elementHandle.contentFrame();
                var captcha = await frame.waitForSelector('.mark', { timeout: 8000 });
                await captcha.evaluate(b => b.click());
                await page.waitForSelector('#novelArticle2');


            }

            let html = await page.$eval('html', element => element.innerHTML);

            while (content.includes('Please wait for page data to load')) {
                 html = await page.$eval('#novelArticle2', element => element.innerHTML);
            }


            await browser.close();

            return res.json({ success: true, html: html, needLogin: false })


        } catch (error) {
            console.log(error)
            return res.json({ success: false })
        } finally {
            if (browser) {
                await browser.close();
            }
            if (browser && browser._process && browser._process.pid) {
                try {
                    process.kill(browser._process.pid, 'SIGTERM');
                } catch (error) {

                }
            }
        }
    } else {
        return res.json({ success: false, msg: 'URL NOT FOUND !' })
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

