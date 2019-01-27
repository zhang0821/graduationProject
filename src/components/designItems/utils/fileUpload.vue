<template>
    <section>
        <!-- <p>上传页面报警铃声</p> -->
        <!-- <form action="fileLoad" method="post" enctype="multipart/form-data">
                <input type="file" name="fileUpload">
                <input type="submit" value="上传文件">
        </form> -->
        <div v-if="loading">
            <vue-clip :options="options" style="background:#fff;" 
                        :on-added-file="addedFile" 
                        :on-removed-file="removedFile"
                        :on-queue-complete="queueCompleted" >

                <template slot="clip-uploader-action">
                    <div>
                        <div class="dz-message" >
                            <p v-if="type=='img'">上传PNG格式背景图片</p>
                            <p v-else>上传MP3格式报警铃声</p>
                        </div>
                    </div>
                </template>

                <!-- <template slot="clip-uploader-body" slot-scope="params">
                    <div class="fileCon">
                        <p>上传文件放置区域</p>
                        <div v-for="file in params.files">
                            <img v-bind:src="file.dataUrl" />
                            {{ file.name }} {{ file.status }}
                        </div>
                    </div>
                    
                </template> -->

            </vue-clip>
        </div>
        <div v-else>
            <p>上传成功</p>
        </div>
        
    </section>
</template>

<script>
import { setTimeout } from 'timers';
import { mapMutations } from 'vuex';

export default {
    data(){
        return{
            loading:true,
            options: {
                // url: '/config/fileLoad?index='+this.tabindex+'&usr='+this.$store.state.dataTrans.username,
                // url: '/config/fileLoad/'+this.type+'?index=0&usr=zhang',
                paramName: 'file',
                acceptedFiles: ['image/*', 'audio/*'].join(','), //video/*
                accept:(file, done)=>{
                        // if (file.size > (1024 * 1024)) {
                        //     console.log('文件要小于1M!')
                        //     done('文件要小于1M!')
                        //     return
                        // }

                        console.log('添加的图片文件类型',file.type)

                        if (this.type=='img' ) {//&& file.type == 'image/*'
                            console.log('添加图片文件')
                            done()
                            this.updateMediaStas({type:'img',val:this.tabindex})

                        }else if(this.type=='media'  ){ //&& file.type == 'audio/*'
                            console.log('添加音频文件')
                            done()
                            this.updateMediaStas({type:'media',val:true})
                        }
                        else{
                            console.log('文件格式不正确!')
                            return
                        }
                        // if(file.width < 800 || file.height <400){
                        //     console.log('图片尺寸不符')
                        //     return
                        // }
                    }

            },
            files:[]
        }
    },
    props:['tabindex','fileDone','type'],
    created(){
        console.log('传参键入的参数是：',this.type)
        if(this.type == 'media'){
            this.options.url='/config/fileLoad/media?usr='+this.$store.state.dataTrans.username
        }else{
            this.options.url='/config/fileLoad/img?index='+this.tabindex+'&usr='+this.$store.state.dataTrans.username
        }
    },
    methods:{
        ...mapMutations({
            updateMediaStas:'designStore/updateLayoutState'
        }),
        addedFile(file){
            this.files.push(file)
            console.log('目前接收到的文件有',this.files)
        },
        removedFile (file) {
        // this
        // .$http
        // .post(`delete/${file.customAttributes.id}`)
        // .then(console.log)
        // .catch(console.error)
      },
      queueCompleted(){
          this.loading=false
          console.log('即将关闭对话框')
          setTimeout(() => {
            this.fileDone()              
          }, 3000);
      }
    }
}
</script>

<style lang="scss" scoped>
.dz-message{
    width:100%;height:80px;border:1px solid red;
    padding:10px;
}

.fileCon{
    width:100%;border:1px solid #fff;padding:0 10px;
}
</style>

