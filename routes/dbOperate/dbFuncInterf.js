const promise = require('bluebird'); // or any other Promise/A+ compatible library;
const initOptions = {
        promiseLib: promise // overriding the default (ES6 Promise);
    }


const pgp = require('pg-promise')(initOptions)
const config={
    database    : "loraserver",
    user     : "postgres",
    port     : 5432,
    password : "dbpassword",
    host     : "10.149.72.156"
}

const monitor = require('pg-monitor');
    monitor.attach(initOptions);// attach to all query events;

var db=pgp(config) // 一个数据库实例

var loginAuthentication =function(userName,pwd){
    return new Promise((resolve,reject)=>{
        db.task(t => {
            // execute a chain of queries against the task context, and return the result:
            return t.one('SELECT count(*) FROM room_info WHERE room_id = $1', userName, a => +a.count)
                    .then(count => {
                        if(count > 0) {
                            return t.any('SELECT * FROM room_sensor WHERE type = $1', pwd)
                                .then(logs => {
                                    return {count, logs};
                                })
                        }
                        return {count};
                    });    
        })
        .then(data => {
            console.log("这是数据库操作返回数据",data)
            resolve(data)
            // success, data = either {count} or {count, logs}
        })
        .catch(error => {
            // failed    
        })
    })
    
}
module.exports = loginAuthentication
