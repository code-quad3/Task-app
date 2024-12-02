const redis = require('./redisConfig');
const {Queue} =require('bullmq');
const myQueue = new Queue('taskReminder',{connection: redis});

myQueue.on('completed', (job) => {
    console.log(`Job with ID ${job.id} has been completed successfully.`);
});

myQueue.on('failed', (job, err) => {
    console.error(`Job with ID ${job.id} failed. Error:`, err);
});

myQueue.on('waiting', (job) => {
    console.log(`Job with ID ${job.id} is waiting to be processed.`);
});
module.exports = myQueue;
