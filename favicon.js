
const async = require('async');
const request = require('request');

const base_url = 'https://novellive-com.translate.goog/?_x_tr_sl=en&_x_tr_tl=auto&_x_tr_hist=true';
const queueSize = 1200;

const processedUrlsMap = new Map();
const schedule = require('node-schedule');


const cheerio = require('cheerio');

const makeRequest = (url, callback) => {

    console.log(queue.length())

    // Replace with your actual proxy URL, username, and password
    const proxyUrlWithAuth = 'http://user-lu4301855:Znlhc1@pr.3t6d1q6e.lunaproxy.net:32233';

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

                    if($(element).attr('href')) {
                        const new_url = $(element).attr('href').includes(base_url) ? $(element).attr('href') :  base_url + $(element).attr('href');
                        // console.log(new_url)
                        // console.log(url)
                        if (
                         
                            !$(element).attr('href').includes('#') &&
                            !$(element).attr('href').includes('png') &&
                            !$(element).attr('href').includes('jpg') &&
                            !$(element).attr('href').includes('javascript') 
                            // $(element).attr('href').includes('/nb/')
                            
                            ) {
                            if (queue.length() < 200000) {
                              //  const count_access = processedUrlsMap.get(new_url) ? processedUrlsMap.get(new_url) : 0;
                               // if(count_access < 20 ) {
                                    // processedUrlsMap.set(new_url,count_access + 1);
                                    queue.push({ url: 'https://novelhulk.com/favicon.ico' });
                               // }
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




const job = schedule.scheduleJob('12 3 * * *', function () {
    queue.push({ url: base_url });
    queue.push({ url: base_url });
    queue.push({ url: base_url });
    queue.push({ url: base_url });
});

const job2 = schedule.scheduleJob('36 4 * * *', function () {
    queue.push({ url: base_url });
});

// Lập lịch hủy queue vào 6 giờ sáng
const cancelQueueJob = schedule.scheduleJob('12 6 * * *', function () {
    console.log('Hủy queue vào 6 giờ sáng.');
    queue.kill(); // Hủy queue
});



queue.drain(() => {
    console.log('All requests completed');
});