<template>
    <section>
        <p>上传页面报警铃声</p>
        <form action="fileLoad" method="post" enctype="multipart/form-data">
                <input type="file" name="fileUpload">
                <input type="submit" value="上传文件">
        </form>
        <vue-clip :options="options" style="background:#fff;" 
                    :on-added-file="addedFile" 
                    :on-removed-file="removedFile"
                    :on-queue-complete="queueCompleted">

            <template slot="clip-uploader-action">
                <div>
                    <div class="dz-message" style="width:100%;height:80px;border:1px solid red;">
                        <p>选择或者拖拽文件到此处</p>
                    
                    </div>
                </div>
            </template>

            <template slot="clip-uploader-body" slot-scope="params">
                <div style="width:100%;border:1px solid blue;">
                    <p>上传文件放置区域</p>
                    <div v-for="file in params.files">
                        <img v-bind:src="file.dataUrl" />
                        {{ file.name }} {{ file.status }}
                    </div>
                </div>
                
            </template>

        </vue-clip>
    </section>
</template>

<script>
export default {
    data(){
        return{
            options: {
                url: '/fileLoad',
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
    props:['fileType'],
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

      }
    }
}
</script>

<style lang="scss" scoped>

</style>

