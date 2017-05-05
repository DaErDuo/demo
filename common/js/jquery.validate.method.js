/* 手机号校验*/
$.validator.addMethod("isPhoneNum", function(value, element) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(value);
});

/* 用户名*/
$.validator.addMethod("isUserName", function(value, element) {
    var pattern = /^[\u4e00-\u9fa5]{2,10}$/;
    return pattern.test(value);
});

/* 收货地址*/
$.validator.addMethod("isAddress", function(value, element) {
    var pattern = /^[A-Za-z_\.,\(\)\s\d\u4e00-\u9fa5]{1,50}$/g;
    return pattern.test(value);
});

/* 多选框 */
$.validator.addMethod("agreement", function(value, element) {
    if($(element).is(':checked')) return true;
    else return false;
});

/*密码*/
$.validator.addMethod("pwd", function(value, element) {
    var pattern = /^\w{6,20}$/;
    return pattern.test(value);
});

/*身份证*/
$.validator.addMethod("regIdCard", function(value, element) {
    var pattern = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return pattern.test(value);
});