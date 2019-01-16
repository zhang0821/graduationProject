//登录

<template>
    <div>
        <div class="login" id="login" v-if="showLogin==1">
            <a href="javascript:;" class="log-close"><i class="icons close"></i></a>
            <div class="log-bg">
                <div class="log-cloud cloud1"></div>
                <div class="log-cloud cloud2"></div>
                <div class="log-cloud cloud3"></div>
                <div class="log-cloud cloud4"></div>

                <div class="log-logo">环境监测系统</div>
                <div class="log-text">@阶跃物联</div>
            </div>
            <div class="log-email">
                <input type="text" placeholder="Email" :class="'log-input' + (account==''?' log-input-empty':'')" v-model="account"><input type="password" placeholder="Password" :class="'log-input' + (password==''?' log-input-empty':'')"  v-model="password">
                <a href="javascript:;" class="log-btn" @click="login">登录</a>
                <a href="javascript:;" class="reg-btn" @click="()=>{this.showLogin=0}">注册</a>
            </div>
            <Loading v-if="isLoging" marginTop="-30%"></Loading>
        </div>


        <div class="login regist" id="login" v-if="showLogin == 0">
            <a href="javascript:;" class="log-close"><i class="icons close"></i></a>
            <div class="log-bg regist">
                <div class="log-cloud cloud1"></div>
                <div class="log-cloud cloud2"></div>
                <div class="log-cloud cloud3"></div>
                <div class="log-cloud cloud4"></div>

                <div class="log-logo">新用户注册</div>
            </div>

            <div class="log-email" v-if="registSuccess==0">
                <input type="text" placeholder="输入注册名" :class="'log-input' + (inputAct==''?' log-input-empty':'')" v-model="inputAct">
                <input type="password" placeholder="输入密码" :class="'log-input' + (inputPWD==''?' log-input-empty':'')"  v-model="inputPWD">
                <input type="password" placeholder="再次输入密码" :class="'log-input' + (inputPWDagain==''?' log-input-empty':'')"  v-model="inputPWDagain">
                <input type="password" placeholder="输入手机号" class='log-input'  v-model="inputTel">
                <input type="password" placeholder="输入邮箱" class='log-input'  v-model="inputEmail">

                <p v-if="inputError!=null" class="inputError">{{inputError}}</p>

                <a href="javascript:;" class="reg-btn" @click="regist">提交注册信息</a>
            </div>
            
            <div v-if="registSuccess">
                <div  class="registSuccess">注册成功</div>
                <a href="javascript:;" class="reg-btn" @click="goDesign">进入配置页面</a>
            
            </div>
            <Loading v-if="isLoging" marginTop="-30%"></Loading>
        </div>
</div>


</template>

<script>
import Loading from '../components/showItems/Loading.vue'
import { setTimeout } from 'timers';
export default {
  name: 'Login',
  data(){
  	return {
        showLogin:0,
        isLoging: false,
  		account: 'admin',
        password: '123456',
        
        inputAct:'',
        inputPWD:'',
        inputPWDagain:'',
        inputTel:'',
        inputEmail:'',
        inputError:null,
        registSuccess:0

  	}
  },
  components:{
    Loading
  },
  created() {
      this.account='test',
      this.password="123456"
  },
  methods:{

  	//登录逻辑
  	login(){
  		if(this.account!='' && this.password!=''){
  			this.toLogin();
  		}
      },
      /**登录请求 */
  	toLogin(){
  		let loginParam = {
  			login_username: this.account,
  			login_password:this.password
  		}

        this.isLoging = true;
  		//请求后端,比如:
  		this.$http.post('/login', {loginParam}).then((response) => {
            if(response.data == "2"){
                this.isLoging = false;
                this.$router.push({
                    name:'Main',
                    params:{
                        usr:this.account
                    }
                })
            }else{
                this.isLoging = false;
                this.account=null;
                this.password=null
            }
	    }, (response) => {
            this.isLoging = false;
            this.account=null;
            this.password=null
	    });
  	
  	   
      },

    /**上传注册信息至服务器 */
    regist(){
        if(this.inputAct ==''){
            this.inputError='请输入用户名'
            return
        }
        if(this.inputPWD == '' || this.inputPWDagain == ''){
            this.inputError = '请输入密码'
            return
        }

        if(this.inputPWD != this.inputPWDagain){
            this.inputError = '两次密码输入不同'
            this.inputPWD=''
            this.inputPWDagain=''
            return
        }
        this.toRegist();
    },
    toRegist(){
        let info={
            'userName':this.inputAct,
            'hash':this.inputPWDagain
        }
        this.isLoging = true; 
        this.$http.post('/regist', {'data':info}).then((response) => {
            this.registSuccess=1
            this.isLoging=false
            
        }).catch(err=>{
            this.isLoging=false
            this.inputError='注册失败'
        })  

    },
    /**跳转到设计页面 */
    goDesign(){
    this.$router.push({
            name:'Design',
            params:{
            usr:this.inputAct
            }
        })
    },
  }
}
</script>


<style lang="scss" scoped>
.login{position: fixed; overflow: hidden;left: 50%; margin-left: -250px; top:50%; margin-top: -350px; width: 500px; min-height: 555px; z-index: 10; right: 140px; background: #fff;-webkit-border-radius: 5px;
-moz-border-radius: 5px;
-ms-border-radius: 5px;
-o-border-radius: 5px;
border-radius: 5px; -webkit-box-shadow:  0px 3px 16px -5px #070707; box-shadow:  0px 3px 16px -5px #070707}
.log-close{display: block; position: absolute; top:12px; right: 12px; opacity: 1;}
.log-close:hover .icons{transform: rotate(180deg);}
.log-close .icons{opacity: 1; transition: all .3s}
.log-cloud{background-image: url(../assets/login-cloud.png); width: 63px ;height: 40px; position: absolute; z-index: 1}
.login .cloud1{top:21px; left: -30px; transform: scale(.6); animation: cloud1 20s linear infinite;}
.login .cloud2{top:87px; right: 20px; animation: cloud2 19s linear infinite;}
.login .cloud3{top:160px; left: 5px;transform: scale(.8);animation: cloud3 21s linear infinite;}
.login .cloud4{top:150px; left: -40px;transform: scale(.4);animation: cloud4 19s linear infinite;}
.log-bg{background: url(../assets/login-bg.jpg); width: 100%; height: 312px; overflow: hidden;}
.regist{
    .log-bg{
        height: 130px;
    }
    .log-logo{
        margin-top:20px;
    }
}
.registSuccess{
    color: #1fcab3;
    margin-top: 100px;
    font-size: 30px;
    text-align: center;
}
.inputError{
    color: #f88787;
    text-align: center;

}
.log-logo{height: 80px; margin: 120px auto 25px; text-align: center; color: #1fcab3; font-weight: bold; font-size: 40px;}
.log-text{color: #57d4c3; font-size: 13px; text-align: center; margin: 0 auto;}
.log-logo,.log-text{z-index: 2}
.icons{background:url(../assets/icons.png) no-repeat; display: inline-block;}
.close{height:16px;width:16px;background-position:-13px 0;}
.login-email{height:17px;width:29px;background-position:-117px 0;}

.log-btns{padding: 15px 0; margin: 0 auto;}
.log-btn{width:402px; display: block; text-align: left; line-height: 50px;margin:0 auto 15px; height:50px; color:#fff; font-size:13px;-webkit-border-radius: 5px; background-color: #3B5999;
-moz-border-radius: 5px;
-ms-border-radius: 5px;
-o-border-radius: 5px;
border-radius: 5px;
position: relative;}
.log-btn.tw{background-color: #13B4E9}
.log-btn.email{background-color: #50E3CE}
.log-btn:hover,.log-btn:focus{color: #fff; opacity: .8;}

.log-email{text-align: center; margin-top: 20px;}
.log-email .log-btn{background-color: #50E3CE;text-align: center;}
.log-input-empty{border: 1px solid #f37474 !important;}
.isloading{background: #d6d6d6}
.log-btn .icons{margin-left: 30px; vertical-align: middle;}
.log-btn .text{left: 95px; line-height: 50px; text-align: left; position: absolute;}

.reg-btn{
    color: #50e3ce;
    display: block;
    margin: 0 auto 20px;

}
.log-input{width: 370px;overflow: hidden; padding: 0 15px;font-size: 13px; border: 1px solid #EBEBEB; margin:0 auto 15px; height: 48px; line-height: 48px; -webkit-border-radius: 5px;
-moz-border-radius: 5px;
-ms-border-radius: 5px;
-o-border-radius: 5px;
border-radius: 5px;}
.log-input.warn{border: 1px solid #f88787}

 @-webkit-keyframes cloud1 {  
    0%{left: 200px}  
    100%{left:-130px;} 
}
@keyframes cloud1{
    0%{left: 200px}  
    100%{left:-130px;} 
}

 @-webkit-keyframes cloud2 {  
    0%{left:500px;}  
    100%{left:-90px;} 
}
@keyframes cloud2{
    0%{left:500px;}  
    100%{left:-90px;} 
}

@-webkit-keyframes cloud3 {  
    0%{left:620px;}  
    100%{left:-70px;} 
}
@keyframes cloud3{
    0%{left:620px;}  
    100%{left:-70px;} 
}@-webkit-keyframes cloud4 {  
    0%{left:100px;}  
    100%{left:-70px;} 
}
@keyframes cloud4{
    0%{left:100px;}  
    100%{left:-70px;} 
}

</style>
