
const async = require('async');
const request = require('request');
const fs = require('fs');

const base_url = 'https://domain/novel_id';
const queueSize = 500;

const schedule = require('node-schedule');

const proxys = fs.readFileSync('./proxy.txt', 'utf8').toString().split('\r\n');

const getRandomDomains = function() {
    const domains = [
        'allnovelfull.org/allnovelfull',
        'fan-novel.com/fannovel/',
        'novelbin.cc',
        'noveltrust.com',
        'lightnovelpub.me'
    ]
    const domain = domains[Math.floor(Math.random()*domains.length)];
    return domain;
}

const generateRandomSpecialChars = function (length) {
    const specialChars = "123455667678789909433eredjhejkdsjdsklalkeowkdnmskdnskshadetyyyukioppllkkjj";
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * specialChars.length);
        result += specialChars.charAt(randomIndex);
    }

    return result;
}


const makeRequest = (url, callback) => {

    console.log(queue.length());

    let proxy = proxys[Math.floor(Math.random() * proxys.length)];
    proxy = proxy.split(':');

    const proxyUrlWithAuth = `http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`;
    // URL of the endpoint you want to access

    // Configure the proxy with authentication
    const proxyConfigWithAuth = {
        proxy: proxyUrlWithAuth,
        timeout: 5000,
        strictSSL: false, // You might need to set this to true in a production environment
    };

    // Make the request using the configured proxy

    request.get(url, proxyConfigWithAuth, (error, response, body) => {

        if (queue.length() < 200000) {

            const domain = getRandomDomains()

            const novel_id = generateRandomSpecialChars(410);
            const chapter_id = generateRandomSpecialChars(410);
            queue.push({ url: base_url.replace('novel_id',novel_id).replace('chapter_id',chapter_id).replace('domain',domain) });

            

            const novel_id1 = generateRandomSpecialChars(410);
            const chapter_id1 = generateRandomSpecialChars(410);
            queue.push({ url: base_url.replace('novel_id',novel_id1).replace('chapter_id',chapter_id1).replace('domain',domain) });

        }


        if (error) {
            console.log(response)
            console.error(`Error for URL ${url}: ${error.message}`);
  
            // callback(error);
        }
        callback(null);
    
    });
};






const queue = async.queue((task, callback) => {
    makeRequest(task.url, callback);
}, queueSize);

queue.push({ url: 'https://novelbin.cc/book/novel_id' });

const job = schedule.scheduleJob('10 2 * * *', function () {
    queue.push({ url: 'https://readwn.org/book/novel_id' });
});

// const job2 = schedule.scheduleJob('36 4 * * *', function () {
//     queue.push({ url: base_url });
// });

// Lập lịch hủy queue vào 6 giờ sáng
const cancelQueueJob = schedule.scheduleJob('20 6 * * *', function () {
    console.log('Hủy queue vào 6 giờ sáng.');
    queue.kill(); // Hủy queue
});



queue.drain(() => {
    console.log('All requests completed');
});