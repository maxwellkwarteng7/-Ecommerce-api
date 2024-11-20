const redis = require('redis'); 
const client = redis.createClient({
    host: '127.0.0.1', // Default Redis host
    port: 6379,
}); 


client.on('connect' , () => console.log("redis connected"));
client.on('error', (error) => console.log('Redis Error : ', error)); 




module.exports = client; 