const axios = require('axios');
const async = require('async');

const makeRequest = (novelId, callback) => {
    const url = `https://allnovelupdates.com/ajax/get-list-chapter?novel_id=shadow-slave`;

    axios.get(url)
        .then(response => {
            console.log(`Received response for novel ID ${novelId}`);
            callback(null, response.data);
        })
        .catch(error => {
            console.error(`Error for novel ID ${novelId}: ${error.message}`);
            callback(error);
        });
};

const numRequests = 500000;

const queue = async.queue((task, callback) => {
    makeRequest(task.novelId, callback);
}, 3000);

for (let i = 1; i <= numRequests; i++) {
    queue.push({ novelId: 'god-of-fishing' });
}

queue.drain(() => {
    console.log('All requests completed');
});