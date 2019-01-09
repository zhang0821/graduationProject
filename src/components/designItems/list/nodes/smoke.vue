<template>
    <div>
        <div v-bind:class="[(state == 0)? normal : warn,sensor]"></div>
    </div>
</template>
<script>
export default {
    name: 'smoke',
    data(){
        return{
            state:0 //正常
        }
    }
}
</script>
<style lang="scss" scoped>
@keyframes twinkling{
    0%{
      opacity:0.1; /*透明度为0*/
    }
    50%{
       opacity: 0.5
    }
    70%{
       opacity: 0.7
    }
    90%{
       opacity: 0.9
    }
   100%{
      opacity:1; /*透明度为1*/
  
   }
  }
  .sensor{
      width: 20px;
        height: 20px;
        border-radius: 50% 50%;
        background: rgb(37, 33, 6);
  }
.normal{
    width: 30px;
    height: 30px;
    border-radius: 50% 50%;
    background: rgb(238, 203, 6);
}
.warn{
    animation: twinkling 1s infinite ease-in-out;
    border-color: red transparent transparent transparent;
    border-style: solid;
    border-top-width: 5px;
    border-right-width: 10px;
    border-left-width: 10px;
    height: 0;
    margin-top: 5px;
    margin-bottom: 3.21429px;
    width: 0;
}

.warn:before,.warn:after {
    border-color: red transparent transparent transparent;
    border-style: solid;
    border-top-width: 5px;
    border-right-width: 10px;
    border-left-width: 10px;
    content: '';
    display: block;
    height: 0;
    left: -10px;
    position: absolute;
    top: -5px;
    width: 0;
}
.warn:before{
    transform: rotate(70deg);
}
.warn:after {
    transform: rotate(-70deg);
}   
</style>
