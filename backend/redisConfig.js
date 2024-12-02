const Redis = require('ioredis');

console.log("Initializing Redis connection...");

const redis = new Redis({
    port: 6379,         
    host: "127.0.0.1",   
    maxRetriesPerRequest: null, // Ensures compatibility with BullMQ
});

// Attach event listeners to monitor Redis connection status
redis.on("connect", () => {
    console.log("[Redis] Connection established successfully.");
});

redis.on("ready", () => {
    console.log("[Redis] Client is ready for use.");
});

redis.on("error", (err) => {
    console.error("[Redis] Error occurred:", err.message);
});

redis.on("reconnecting", (delay) => {
    console.log(`[Redis] Attempting to reconnect after ${delay}ms...`);
});

redis.on("end", () => {
    console.log("[Redis] Connection closed.");
});

module.exports = redis;
