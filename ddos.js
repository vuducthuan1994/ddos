
const async = require('async');
const request = require('request');
const queueSize = 6000;
const { novel_ids } = require('./novel_ids')



const makeRequest = (url, callback) => {
    const config = {
        forever: true,
        timeout: 8000
    }
    request.get(url, config, (error, response, body) => {
        if (error) {
            console.error(`Error for URL : ${error.message}`);
            callback(error);
        } else {
            console.log(`Received response for ${url} `, (response.body.includes("Home") || response.body.includes("success")) ? true : false);
            callback(null, response.body);
        }
    });
};




const queue = async.queue((task, callback) => {
    makeRequest(task.url, callback);
}, queueSize);



setInterval(async () => {
    const novel_id = novel_ids[Math.floor(Math.random() * novel_ids.length)];
    if (queue.length() < 100000) {
        queue.push({ url: `https://novellive.net/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${new Date().getTime()}` });
        queue.push({ url: `https://novellive.com/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${new Date().getTime()}` });
        queue.push({ url: `https://lightnovelpub.me/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${new Date().getTime()}` });

        queue.push({ url: `https://allnovelupdatess.com/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${new Date().getTime()}` });
        queue.push({ url: `https://novellives.me/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${new Date().getTime()}` });
        queue.push({ url: `https://novellive.org/ajax/get-list-chapter?novel_id=${novel_id.novel_id}&novel_ids=${new Date().getTime()}` });
    }
}, 50);




queue.drain(() => {
    console.log('All requests completed');
});