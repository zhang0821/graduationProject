/**
 *
 * @Description 邮件发送 
 * 调用方法:sendMail('address','title', 'context');
 *
 */
 
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config')
 
smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    host:config.email.host,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));
 
/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, html) {
 
    smtpTransport.sendMail({
 
        from: config.email.user,
        to: recipient,
        subject: '监控系统报警信息通知',
        html: html
 
    }, function (error, response) {
        if (error) {
            console.log(error);
        }
        console.log('邮件发送成功')
    });
}
 
const http =require('http')
const qs = require('querystring')
const urlencode =require('urlencode')
var SendMessage=function(mobile,title,content){
    let reqCon ={  
        'accesskey':'nHUHX1BwbkElImuy',
        'secret':'hbIh0Euf8bLwOCEoaPsz6RERJ6zCt2gt',
        // 'templateId':,//选填
        'content' : urlencode(content), //必填参数。发送内容（1-500 个汉字）UTF-8编码
        'mobile' : mobile,   //必填参数。手机号码。多个以英文逗号隔开
        'sign' :'【实验室安全监测系统】',      //必填参数。用户签名。
        'scheduleSendTime':'' , //为空则立即发送
    } 
    const params=qs.stringify(reqCon)
    let url = "http://api.1cloudsp.com/api/v2/send?"+params  //提交的url地址

    http.get(url,function(data){
        var str="";
        data.on("data",function(chunk){
            str+=chunk;//监听数据响应，拼接数据片段
        })
        data.on("end",function(){ 
            console.log(str.toString())
        })
    })
}
module.exports = {
    sendMail,
    SendMessage
}
