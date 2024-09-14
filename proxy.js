
const async = require('async');
const request = require('request');

const base_url = 'https://novellive.app/ajax/hot-novels?genre=ACTIO';
const queueSize = 1;

const processedUrlsMap = new Map();
const schedule = require('node-schedule');

const { novel_ids } = require('./novel_ids')


const fs = require('fs');
const proxys = fs.readFileSync('./proxy.txt', 'utf8').toString().split('\r\n');


const cookies = `cf_clearance=rCd35a1NY7PtDfoNQjUHZ19CdriG71.wdrNhGBt8srU-1703493856-0-2-14da6360.1035eebb.43db3c80-250.0.0; _csrf=9EHmMYQSAwCLBwRCbaarUKrR`;
const makeRequest = (url, callback) => {

    console.log(queue.length())

    // Replace with your actual proxy URL, username, and password

    //curl -x 23.157.216.21:49157 -U user49157:XHR1HlPdQu https://novellive.com/favicon.ico
    let proxy = proxys[Math.floor(Math.random() * proxys.length)];
    proxy = proxy.split(':');


    //  const proxyUrlWithAuth = `http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`;
    // URL of the endpoint you want to access

    //Configure the proxy with authentication
    const proxyConfigWithAuth = {
        // proxy: proxyUrlWithAuth,
        strictSSL: false, // You might need to set this to true in a production environment
        timeout: 3000,
        headers: {
            'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
            'Cookie':   cookies
        }
    };

    // Make the request using the configured proxy

    request.get(url, proxyConfigWithAuth, (error, response, body) => {
        console.log(response)
        if (error) {
            console.error(`Error for URL ${url}: ${error.message}`);
            queue.push({ url: base_url });

            callback(error);
        } else {
            console.log(`Received response for URL ${url}`);
            if (queue.length() < 200000) {
                queue.push({ url: base_url });

            }
            callback(null, response.body);
        }
    });
};






// const queue = async.queue((task, callback) => {
//     makeRequest(task.url, callback);
// }, queueSize);

// // queue.push({ url: base_url });

// // const job = schedule.scheduleJob('36 3 * * *', function () {
// //     queue.push({ url: base_url });
// // });

// // const job2 = schedule.scheduleJob('36 4 * * *', function () {
// //     queue.push({ url: base_url });
// // });

// // Lập lịch hủy queue vào 6 giờ sáng
// const cancelQueueJob = schedule.scheduleJob('10 7 * * *', function () {
//     console.log('Hủy queue vào 6 giờ sáng.');
//     queue.kill(); // Hủy queue
// });



// queue.drain(() => {
//     console.log('All requests completed');
// });