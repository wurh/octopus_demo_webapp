let check = {
    isEmpty: function(val){
        return val.length === 0;
    },
    isEmail: function(val){
        let patt = /^[a-zA-Z0-9_\.-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org|site|online|live|co|in|global|me|biz|news|link|email|work|website|shop|world|io|info|club|store|tech|xyz|social|us|pub|desi|)$/g;
        return patt.test(val.toLowerCase());
    },
    password: function(val){
        return (val.length >=6 && val.length <= 20);
    },
    isSamePassword(val1,val2){
        return val1 === val2;
    },
    // 验证是否是前后空格
    isTowSideBlank(val){
        let reg = /^\s+|\s+$/g;
        return reg.test(val);
    }
    
}
export default check;