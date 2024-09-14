
const async = require('async');
const request = require('request');
const fs = require('fs');

const base_url = 'https://allnovelupdates.com/favicon.ico';
const queueSize = 50;

const processedUrlsMap = new Map();
const schedule = require('node-schedule');

const proxys = fs.readFileSync('./proxy.txt', 'utf8').toString().split('\r\n');

const cheerio = require('cheerio');
   // if (url.includes('novellive.org')) {
    //     config['proxy'] = 'http://gZfqtV:Uf9TmQ@45.129.207.139:8000';
    //     config['strictSSL'] = false;
    //     config['headers'] = {
    //         'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36`,
    //         'Cookie': `_ga=GA1.1.1454164657.1721807582; cto_bidid=Yvrs7l91TmFCTGFsZTVxY2dyZTlWUlZoenNHVDN3cDRMZXR2V09zbmhSZ2ZNUVMyN0EwVCUyRmZ3cGE5OXM1bGhiR2Q3ZjFVc0ltUmpBJTJCYm1CZzRvRmYwSlh6QVVBZVNqaDRyU1o0NGklMkJZMTZzZ29JTSUzRA; cto_bundle=JKsgo19BbUxma0U2STYlMkY2b2tQJTJGdWx6eXRyVFRieFBuTDJDWUtKNXFHOEI2UUNLRURMJTJCS09FVEglMkI0MjNJeW9BcEZlMUxMS1F5NjBTOUcyZ1p5Q2JOalJHJTJGNm5QRGpOdkZnSlJPU054bU5JJTJCdE5QRiUyRndmSkpUTlVuQ05wckxYYWk2Z0pNQUtCZExjeVlhWE16c3FiY3ZPcHlXTDkxdnFsNWQlMkZMZEtqcXRrR2ZkcE9OTHZGemVpME12WSUyQkRxVSUyRk8lMkYlMkZ1WUlVV1ZaUmElMkZ2b1hJOTZSJTJGcnBBdG5FUSUzRCUzRA; _csrf=LTTGDEBqSw9Ag0ZTFn2GmYha; cf_clearance=Mnz4vbizgD1iq3VLe.JA5fRMUKoRcjcE98_F7nT6Pns-1723746148-1.0.1.1-PFkeKP3G5YowLmTdCnZODBzzMp5Armdvb3EahHJguccQPIxd0RQieEVocUkuWZhHx5KkBQRCjYLYDsFTOIc0Kw; _ga_GFW242RQ9C=GS1.1.1723746147.15.1.1723746208.0.0.0`
    //     }
    // }

const makeRequest = (url, callback) => {

    console.log(queue.length());

    let proxy = proxys[Math.floor(Math.random() * proxys.length)];
    proxy = proxy.split(':');


    // Replace with your actual proxy URL, username, and password
    const proxyUrlWithAuth = `http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`;
    // URL of the endpoint you want to access

    // Configure the proxy with authentication
    const proxyConfigWithAuth = {
        proxy: proxyUrlWithAuth,
        strictSSL: false, // You might need to set this to true in a production environment
    };

    // Make the request using the configured proxy
    
    request.get(url,proxyConfigWithAuth, (error, response, body) => {
        if (error) {
            console.error(`Error for URL ${url}: ${error.message}`);
            callback(error);
        } else {
            console.log(`Received response for URL ${url}`);
            if (response && response.body) {
                const $ = cheerio.load(response.body);
                const listItems = $('a');
                for (const element of listItems) {
                    console.log($(element).attr('href'))
                    if($(element).attr('href')) {
                        const new_url = $(element).attr('href').includes('novellive-com') ? $(element).attr('href') :  base_url + $(element).attr('href');
                        // console.log(new_url)
                        // console.log(url)
                        if (
                         
                            !$(element).attr('href').includes('#') &&
                            !$(element).attr('href').includes('png') &&
                            !$(element).attr('href').includes('jpg') &&
                            !$(element).attr('href').includes('javascript') &&
                            $(element).attr('href').includes('/book/') &&
                            $(element).attr('href').includes('chapter')
                            
                            ) {
                            if (queue.length() < 200000) {
                               const count_access = processedUrlsMap.get(new_url) ? processedUrlsMap.get(new_url) : 0;
                               if(count_access < 2 ) {
                                    processedUrlsMap.set(new_url,count_access + 1);
                                    queue.push({ url: new_url });
                               }
                            }
                        }
                    }
                
                }
            }
            callback(null, response.body);
        }
    });
};






const queue = async.queue((task, callback) => {
    makeRequest(task.url, callback);
}, queueSize);

queue.push({ url: base_url });
// const job = schedule.scheduleJob('36 3 * * *', function () {
//     queue.push({ url: base_url });
// });

// const job2 = schedule.scheduleJob('36 4 * * *', function () {
//     queue.push({ url: base_url });
// });

// Lập lịch hủy queue vào 6 giờ sáng
const cancelQueueJob = schedule.scheduleJob('10 7 * * *', function () {
    console.log('Hủy queue vào 6 giờ sáng.');
    queue.kill(); // Hủy queue
});



queue.drain(() => {
    console.log('All requests completed');
});