const omit = (obj, uselessKeys) =>{
    console.log('要移除的属性是',uselessKeys)
    uselessKeys.forEach(e => {
        delete obj[e]
    });
  }
  let obj={
      'a':1,
      'b':12
  }
    omit(obj,['a','b'])
  console.log(obj)