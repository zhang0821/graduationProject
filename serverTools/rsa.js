const  NodeRSA =require('node-rsa')
//密钥对S
const S_public_key_data = '-----BEGIN PUBLIC KEY----- ... -----END PUBLIC KEY-----'
const S_private_key_data = '-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----'

//密钥对C
const C_public_key_data = '-----BEGIN PUBLIC KEY----- ... -----END PUBLIC KEY-----'
const C_private_key_data = '-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----'


// let myRsa={
//     construction(signText,codeType){
//         this.SignText=signText //对私钥使用统一的加签文本
//         this.CodeType=codeType
//     },

//     //生成服务端的一堆公私钥，实现对客户端加密数据的解密，所有连接客户端均获得此公钥
//     S_public_key : new NodeRSA(S_public_key_data),
//     S_private_key : new NodeRSA(S_private_key_data),

//     //加签并加密,服务端

//     SEncrypt(){

//     }

//     //为每个连接的客户端生成他们的公私钥，在其刚登陆系统时，返回给他们进行存储
//     //服务端存储每个客户端的公钥，向其发送数据时使用它对数据进行加密，客户端用自己的私钥进行解密。
//     genNewKeyRSA(){
//         return {
//             c_public_key:new NodeRSA(C_public_key_data),
//             c_private_key:new NodeRSA(C_private_key_data)
//         }

//     },
    


// }

class myRsaBase{
    constructor(encodeBit=512){
        this.KEY=new NodeRSA({b:encodeBit})
    }
    //公钥
    getPublicKey(){
        return this.KEY.exportKey('public')
    }
    //私钥
    getPrivateKey(){
        return this.KEY.exportKey('private')
    }
    //公钥加签加密
    encryptData(info){
        return this.KEY.encrypt(info,'base64', 'utf8')

        // let sign=this.KEY.sign(info,'base64', 'utf8')//加签
        // console.log('数据加签后是',sign)
        // return this.KEY.encrypt(sign,'base64', )//加密
    }
    //私钥解密验签
    decryptData(encryptedInfo){
        return this.KEY.decrypt(encryptedInfo, 'utf8')

        // let info=this.KEY.decrypt(encryptedInfo,'utf8')
        // console.log('解密后的文本是:', info)//解密
        // let verify = this.KEY.verify('hello', info, 'utf8', 'base64')
        // console.log('验签结果是',verify)

    }


}
// let testRsa=new myRsa(512)
// console.log('创建的公钥是',testRsa.getPublicKey())
// console.log('创建的私钥是',testRsa.getPrivateKey())

// let afterData=testRsa.encryptData('hello')
// console.log('对数据进行加密',afterData)

// console.log('对数据进解密是',testRsa.decryptData(afterData))

class RSAserver{
    constructor(encodeBit=512){
        this.KEY=new NodeRSA({b:encodeBit})
    
        this.KEY.setOptions({encryptionScheme: 'pkcs1'})//修改此处，由于node端安装的RSA库默认使用pkcs1_oaep进行加密和解密，而浏览器端使用的而jsencrypt使用pkcs1
        // console.log(this.KEY)
    }
    //公钥
    getPublicKey(){
        return this.KEY.exportKey('public')
    }
    //私钥
    getPrivateKey(){
        return this.KEY.exportKey('private')
    }
                            //公钥加签加密
                            encryptData(info){
                                return this.KEY.encrypt(info,'base64', 'utf8')
                            }
    //私钥解密验签
    decryptData(encryptedInfo){
        return this.KEY.decrypt(encryptedInfo)
    }


}


class RSAclient{
    constructor(encodeBit=512){
        this.KEY=new NodeRSA({b:encodeBit})
        this.KEY.setOptions({encryptionScheme: 'pkcs1'})
    }
    //公钥，服务器保存，用于加密数据传给客户端
    getPublicKey(){
        return this.KEY.exportKey('public')
    }
    //私钥，发送给浏览器
    getPrivateKey(){
        return this.KEY.exportKey('private')
    }
    //公钥加签加密
    encryptData(info){
        return this.KEY.encrypt(info,'base64', 'utf8')
    }
                                        //私钥解密验签
                                        decryptData(encryptedInfo){
                                            return this.KEY.decrypt(encryptedInfo, 'utf8')
                                        }
}

module.exports = {
    RSAserver, //把公钥各所有连接客户端，客户端加密数据上传给服务端
    RSAclient
}
