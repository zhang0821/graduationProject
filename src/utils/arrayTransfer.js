export default(jsonData)=>{
    // let data=JSON.parse(jsonData)
    let data=jsonData

    let arr=[]
    for(let i=0;i<data.length;i++){
        let obj={}
        for(let j=0;j<data[i].length;j++){
            for(let item in data[i][j]){
                if(!(item in obj) ){
                    obj[item]=data[i][j][item]
                    if(data[i][j].type !== 'tem_hum' && data[i][j].type !== 'air'){
                        obj[data[i][j].type]='正常'
                        if(data[i][j].online == 0){
                            obj[data[i][j].type]='离线'
                        }
                        if(data[i][j].status == 0){
                            obj[data[i][j].type]='异常'                            
                        }
                    }
                } 
            }
        }
        arr.push(obj)
    }
    return JSON.stringify(arr)
}