
const async = require('async');
const request = require('request');
const queueSize = 100;
const { novel_ids } = require('./novel_ids')



const makeRequest = (url, callback) => {
    const config = {
        forever: true,
        timeout: 5000
    }
    // if (url.includes('novellive.org')) {
    //     config['proxy'] = 'http://gZfqtV:Uf9TmQ@45.129.207.139:8000';
    //     config['strictSSL'] = false;
    //     config['headers'] = {
    //         'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36`,
    //         'Cookie': `_ga=GA1.1.1454164657.1721807582; cto_bidid=Yvrs7l91TmFCTGFsZTVxY2dyZTlWUlZoenNHVDN3cDRMZXR2V09zbmhSZ2ZNUVMyN0EwVCUyRmZ3cGE5OXM1bGhiR2Q3ZjFVc0ltUmpBJTJCYm1CZzRvRmYwSlh6QVVBZVNqaDRyU1o0NGklMkJZMTZzZ29JTSUzRA; cto_bundle=JKsgo19BbUxma0U2STYlMkY2b2tQJTJGdWx6eXRyVFRieFBuTDJDWUtKNXFHOEI2UUNLRURMJTJCS09FVEglMkI0MjNJeW9BcEZlMUxMS1F5NjBTOUcyZ1p5Q2JOalJHJTJGNm5QRGpOdkZnSlJPU054bU5JJTJCdE5QRiUyRndmSkpUTlVuQ05wckxYYWk2Z0pNQUtCZExjeVlhWE16c3FiY3ZPcHlXTDkxdnFsNWQlMkZMZEtqcXRrR2ZkcE9OTHZGemVpME12WSUyQkRxVSUyRk8lMkYlMkZ1WUlVV1ZaUmElMkZ2b1hJOTZSJTJGcnBBdG5FUSUzRCUzRA; _csrf=LTTGDEBqSw9Ag0ZTFn2GmYha; cf_clearance=Mnz4vbizgD1iq3VLe.JA5fRMUKoRcjcE98_F7nT6Pns-1723746148-1.0.1.1-PFkeKP3G5YowLmTdCnZODBzzMp5Armdvb3EahHJguccQPIxd0RQieEVocUkuWZhHx5KkBQRCjYLYDsFTOIc0Kw; _ga_GFW242RQ9C=GS1.1.1723746147.15.1.1723746208.0.0.0`
    //     }
    // }





    request.get(url, config, (error, response, body) => {
        if (error) {
            console.error(`Error for URL : ${error.message}`);
            callback(error);
        } else {
            console.log(`Received response for URL `, (response.body.includes("Home") || response.body.includes("success")) ? true : false);
            callback(null, response.body);
        }
    });
};




const queue = async.queue((task, callback) => {
    makeRequest(task.url, callback);
}, queueSize);



setInterval(async () => {
    const novel_id = novel_ids[Math.floor(Math.random() * novel_ids.length)];
    if (queue.length() < 3000) {
        queue.push({ url: `https://novellive.net/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${text+new Date().getTime()}` });
        queue.push({ url: `https://novellive.com/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${text+new Date().getTime()}` });
        queue.push({ url: `https://lightnovelpub.me/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${text+new Date().getTime()}` });
    }
}, 50);




queue.drain(() => {
    console.log('All requests completed');
});