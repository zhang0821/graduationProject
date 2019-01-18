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
                        :on-queue-complete="queueCompleted">

                <template slot="clip-uploader-action">
                    <div>
                        <div class="dz-message" >
                            <p>选择或者拖拽文件到此处</p>
                        
                        </div>
                    </div>
                </template>

                <template slot="clip-uploader-body" slot-scope="params">
                    <div class="fileCon">
                        <p>上传文件放置区域</p>
                        <div v-for="file in params.files">
                            <img v-bind:src="file.dataUrl" />
                            {{ file.name }} {{ file.status }}
                        </div>
                    </div>
                    
                </template>

            </vue-clip>
        </div>
        <div v-else>
            <p>上传成功</p>
        </div>
        
    </section>
</template>

<script>
import { setTimeout } from 'timers';

export default {
    data(){
        return{
            loading:true,
            options: {
                url: '/fileLoad:index='+this.tabindex,
                paramName: 'file',
                acceptedFiles: ['image/png', 'image/jpg', 'application/pdf'].join(','),
                accept:(file, done)=>{
                        // if (file.size > (1024 * 1024)) {
                        //     console.log('文件要小于1M!')
                        //     done('文件要小于1M!')
                        //     return
                        // }
                        if (file.type != "application/pdf") {
                            console.log('文件格式不正!')
                            done('文件格式不正')
                            return
                        }
                        done()
                    }

            },
            files:[]
        }
    },
    props:['tabindex','fileDone'],
    created(){
        console.log('传参键入的参数是：',this.tabindex)
    },
    methods:{
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
          console.log('文件传输完成')
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

