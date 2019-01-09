/**
 * 返回一个唯一标识符，组件被拖入后的id就是调用此方法获得
 */
var guid = function() { //获取随机ID，组件拖到预览视图后就会被设置个ID
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4()
}
export default guid
