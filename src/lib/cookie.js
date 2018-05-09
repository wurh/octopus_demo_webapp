const cookie = (function () {
    let setCookie = (name, value, Days) => {
        let oDate = new Date();
        oDate.setDate(oDate.getDate() + (Days || 30));
        document.cookie = name + '=' + value + ';path=/;expires=' + oDate;
    }
    let getCookie = (name) => {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr[i].length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return arr2[1];
            }
            return '';
        }
    }
    let removeCookie = (name) => {
        setCookie(name, 1, -1);
    }
    return {
        setCookie: setCookie,
        getCookie: getCookie,
        removeCookie: removeCookie
    }
})()
export default cookie
