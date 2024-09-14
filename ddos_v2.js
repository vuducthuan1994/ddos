
const async = require('async');
const request = require('request');

const base_url = 'https://allnovelupdatess.com/';
const queueSize = 100;
const schedule = require('node-schedule');
const cheerio = require('cheerio');

const makeRequest = (url, callback) => {

    console.log(queue.length())

    request.get(url, { forever: true,timeout: 10000 }, (error, response, body) => {
        if (error) {
            console.error(`Error for URL ${url}: ${error.message}`);
            callback(error);
        } else {
           console.log(`Received response for URL ${url}`);
            if (response && response.body) {
                const $ = cheerio.load(response.body);
                const listItems = $('a');
                for (const element of listItems) {

                    if ($(element).attr('href')) {
                        let new_url = ($(element).attr('href').includes('.com') || $(element).attr('href').includes('.net') || $(element).attr('href').includes('.cc')) ? $(element).attr('href') : null;
            
                        if(new_url && new_url.includes('allnovelupdates.com')) {
                            new_url = new_url.replace('allnovelupdates.com','allnovelupdatess.com')
                            if (
                                !new_url.includes('#') &&
                                !new_url.includes('png') &&
                                !new_url.includes('jpg') &&
                                !new_url.includes('javascript') &&
                                new_url.includes('/book/') &&
                                new_url.includes('chapter')     
                            ) {
                                if (queue.length() < 100000) {
                                    for(let i = 0; i< 5000 ; i ++) {
                                        queue.push({ url: new_url + '?source=goooglebot' });
                                        queue.push({ url: new_url + '?source=goooglebot' });
                                        queue.push({ url: new_url + '?source=goooglebot' });
                                        queue.push({ url: new_url + '?source=goooglebot' });
                                        queue.push({ url: new_url + '?source=goooglebot' });
                                    }
               
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



// const job = schedule.scheduleJob('* * * * *', function () {
//     queue.push({ url: base_url });
//     // queue.push({ url: 'https://readynovel.com' });
// });


const queue = async.queue((task, callback) => {
    makeRequest(task.url, callback);
}, queueSize);


// queue.push({ url: 'https://readynovel.com' });

// const job = schedule.scheduleJob('36 3 * * *', function () {
//     queue.push({ url: base_url });
// });

// const job2 = schedule.scheduleJob('36 4 * * *', function () {
//     queue.push({ url: base_url });
// });

// Lập lịch hủy queue vào 6 giờ sáng
setInterval(async () => {
    
}, 1); // Gửi truy vấn mỗi 1ms

const cancelQueueJob = schedule.scheduleJob('10 9 * * *', function () {
    console.log('Hủy queue vào 6 giờ sáng.');
    queue.kill(); // Hủy queue
});
//https://allnovelupdatess.com/ajax/get-list-chapter?novel_id=all-rounder-artist


queue.drain(() => {
    console.log('All requests completed');
});