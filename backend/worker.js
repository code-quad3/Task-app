const {Worker} = require('bullmq');
const Tasks = require('./models/Tasks');
const {sendRemainderEmail} =  require('./sendRemainder');
const redis = require('./redisConfig');
const worker = new Worker('taskReminder',async(job)=>{
const {taskId, userEmail} =job.data;
try{
const task = await Tasks.findById(taskId);
if(!task){
    console.log('[Worker] Task not found');
    return;
}

if(task.completed){
    console.log("Tasks already completed no remainder sent");
    return;
}

await sendRemainderEmail(userEmail,task);
console.log("remainder is sent sucessfully");
} catch(err){
 console.log('failed to process job');

}
},{ connection: redis}

);

worker.on('completed',(job)=>{
console.log(`job id ${job.id} is processed `)
})
worker.on('failed',(job,err)=>{
    console.log(`Job failed ${job.id} failed: ${err.message}`);
}) 
