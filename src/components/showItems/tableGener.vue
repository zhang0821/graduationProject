<template>
        <div class="tableShow">
            <div v-if="design">
                <i class="addCol" @click="addCol">增加列</i>
            </div>
        
            <table>
                <caption v-if="design"><input type="text" v-model="basicInfo.title" placeholder="表格标题"></caption>
                <caption v-else>{{basicInfo.title}}</caption>


                <tr class="tableTr">
                    <th v-for="(col,index) in columList" :class="index == (columList.length-1) ?'addBtn' :''">
                        <input type="text" v-if="design" v-model="col.name" placeholder="输入列名称">
                        <i v-else>{{col.name}}</i>
                    </th>
                    <th v-if="design && columList.length>2" class="delCol" @click="delCol"></th>
                </tr>
                    
                <tbody v-if="!design">
                    <tr v-for='(data,index) in dataInfo'>
                        <td v-for="key in Object.keys(data)">{{key}}:{{data[key]}}({{columList[index].unit}})</td>
                    </tr>
                </tbody>
            </table>
        </div>
</template>
<script>
export default {
    name:"tableComp",
    data(){
        return{
            parseData:null,
        }
    },
    props:{
        design:{
            type:Boolean,
            default:true
        },
        columList:{
            type:Array,
            default:function(){
                return [
                    {
                        name:'clo1',
                        unit:'单位'
                    }
                ]
                
            }
        },
        dataInfo:{
            type:Array,
            default:function(){
                return [
                    {
                        col1:'默认'
                    }
                ]
                
            }
        },
        basicInfo:{
            type:Object,
            default:function(){
                return{
                    title:'默认'
                }
            }
        }
    },
    beforeCreate(){

    },
    created(){
        this.parseData=this.basicInfo
    },
    methods:{
        addCol(){
            let newCol={
                name:'默认',
                unit:null
            }
           this.columList.push(newCol)
        },
        delCol(){
             this.columList.pop()
        }
    }
}
</script>


<style lang="scss" scoped>
.tableShow{
    width:auto;
    overflow:scroll;
    width: 100%;
    height: auto;
    max-height: 100%;
    border: 1px solid #000;
    .addCol{
        display: inline-block;
        margin-left: 50%;
        padding: 5px 10px;
        color: #000;
        cursor: pointer;
    }
    table{
        width: 100%;
        text-align: center;
        color: #000;
        background: #699;
        border-collapse: collapse;
        border: 1px solid #000;
        caption{
            text-align: center;
        }
        th,td{
            // float: left;
            // width: 80px;
            padding: 5px 0;
            input{
                width: 80px;
            }
             &.delCol{
                 margin: 5px;
                width: 20px;
                height: 20px;
             }
        }
    }
    .tableTr{
        width: 100%;
        height: 30px;
        display: flex;
        th{
            text-align: center;
            &.delCol{
                width: 20px;
                height: 20px;
                border: 0;
                background:url('../../assets/delete.png') no-repeat center;
                cursor: pointer;
            }
        }
    }
}
</style>

