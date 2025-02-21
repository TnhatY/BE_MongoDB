import { createClient } from 'redis';

const client = createClient({
    url: 'redis://127.0.0.1:6379'
});

client.on('error', (err) => console.error('Redis Error:', err));

await client.connect();  // Phải dùng await vì connect() là async

console.log('Connected to Redis');

// Kiểm tra Redis hoạt động không
const pong = await client.ping();
console.log(pong); // "PONG"

export default client;
