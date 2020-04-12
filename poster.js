const mysql = require('mysql');
const config = require('./config.js');
const readline = require('readline');
const fs = require('fs');

let connection = mysql.createConnection(config);
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '|>',
}) 

let date = new Date();

let present = {
    year: date.getFullYear(),
    month: date.getUTCMonth() + 1,          //month range [0, 11]
    day: date.getDate(),
    week: date.getDay(),
    time: {
        hour: date.getHours(),
        minute: date.getMinutes()
    }
}

connection.connect(err => {
    if (err) throw err;
    console.log('连接成功');
    connection.query('select * from comment', (e, results) => {
        console.log(JSON.parse(results[0].time));
        process.exit(1);
    })
});
