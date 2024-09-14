
const async = require('async');
const request = require('request');

const base_url = 'https://webnovelupdates.com/';
const queueSize = 1600;

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
                        const new_url = $(element).attr('href').includes('novellive.org') ? $(element).attr('href') :  base_url + $(element).attr('href');
                        // console.log(new_url)
                        // console.log(url)
                        if (
                         
                            !$(element).attr('href').includes('#') &&
                            !$(element).attr('href').includes('png') &&
                            !$(element).attr('href').includes('jpg') &&
                            !$(element).attr('href').includes('javascript') 
                            // $(element).attr('href').includes('/book/') &&
                            // !$(element).attr('href').includes('chapter')
                            
                            ) {
                            if (queue.length() < 200000) {
                               const count_access = processedUrlsMap.get(new_url) ? processedUrlsMap.get(new_url) : 0;
                               if(count_access < 20000 ) {
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


queue.drain(() => {
    console.log('All requests completed');
});