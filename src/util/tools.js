let methods = {
    judeBrowsers() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if(userAgent.toLowerCase().indexOf("micromessenger") > -1){
            return "Weixin"
        }
        //判断是否Opera浏览器
        if (userAgent.indexOf("Opera") > -1) {
            return "Opera"
        }
        //判断是否Firefox浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } 
        //判断是否Chrome浏览器
        if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        }
        //判断是否Safari浏览器
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        }
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }
        if (userAgent.indexOf("Octopus-app") > -1) {
            return "Octopus-app";
        }
    },
    judeSystem(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        //android终端 
        if(userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1){
            return 'Android';
        }
        if(!!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            return 'Ios'
        }
    },
    getCookie: function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));

        if (arr != null) {
            return (arr[2]);
        } else {
            return "";
        }
    },
    setCookie: function(name, value, options) {
        options = options ? options : {};
        options.domain = options.domain ? options.domain : 'localhost';
        options.callback = options.callback || function() {}
        var Days = 30,
            Year = 5,
            exp = new Date();

        exp.setTime(exp.getTime() + Year * Days * 24 * 60 * 60 * 1000);

        var expires = options.session ? "" : exp.toGMTString();

        document.cookie = name + "=" + escape(value) + ";domain=" + options.domain + ";path=/;expires=" + expires;

        options.callback();
    }
}

export default methods;