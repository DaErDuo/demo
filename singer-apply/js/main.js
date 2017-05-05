// fill info page
var $fillInfoForm = $('#fillInfoForm');
var $province = $('#province');
var $city = $('#city');
var $area = $('#area');

// init page data
getOptions($province, '100000', 'province');

// select sex
$('input[name="sex"]').on('click', function() {
    $(this).parent().addClass('ipt-sex-checked');
    $(this).parent().siblings('.ipt-sex-wrap').removeClass('ipt-sex-checked');
});

// province change
$province.change(function() {
    var id = $(this).val();
    if (id == 0) {
        $city.html('<option value="0">城市</option>');
        $area.html('<option value="0">地区</option>');
        $('#provinceName').val('');
        $('#cityName').val('');
        $('#areaName').val('');
    } else {
        getOptions($city, id, 'city');
        $area.html('<option value="0">地区</option>');
        $('#provinceName').val($(this).find('option:selected').text());
    }
});

// city change
$city.change(function() {
    var id = $(this).val();
    if (id == 0) {
        $area.html('<option value="0">地区</option>');
        $('#cityName').val('');
        $('#areaName').val('');
    } else {
        getOptions($area, id, 'area');
        $('#cityName').val($(this).find('option:selected').text());
    }
});

// area change
$area.change(function() {
    var id = $(this).val();
    if (id == 0) {
        $('#areaName').val('');
    } else {
        $('#areaName').val($(this).find('option:selected').text());
    }
});

// submit form
$('#submitBtn').on('click', function() {
    var self = $(this);
    if ($fillInfoForm.valid()) {
        var $platformName = $('#platformName');
        var $roomNum = $('#roomNum');
        var $halfImage = $('#halfImage');
        var $wholeImage = $('#wholeImage');
        var $videoUrl = $('#videoUrl');

        // validate province, city, area
        if ($province.val() != 0) {
            if ($city.val() == 0) {
                promptMsg('请选择城市', 'center');
                return;
            }
            if ($area.val() == 0) {
                promptMsg('请选择地区', 'center');
                return;
            }
        }
        // validate platformName
        if ($.trim($roomNum.val()) != ''
            && $.trim($platformName.val()) == '') {
            promptMsg('请填写直播平台名称', 'center');
            return;
        }
        // validate roomNum
        if ($.trim($platformName.val()) != ''
            && $.trim($roomNum.val()) == '') {
            promptMsg('请填写直播房间号', 'center');
            return;
        }
        // validate participating regions and platform
        if ($province.val() == 0
            && $city.val() == 0
            && $area.val() == 0
            && $.trim($platformName.val()) == '') {
            promptMsg('请选择参赛地区或填写直播平台', 'center');
            return;
        }
        // validate halfImage
        if ($halfImage.val() == '') {
            promptMsg('请上传半身照', 'center');
            return;
        }
        // validate photo and video url
        if ($wholeImage.val() == ''
            && $videoUrl.val() == '') {
            promptMsg('请上传全身照或填写才艺视频链接', 'center');
            return;
        }

        // show loading
        loadingToast('正在提交...');

        // submit form
        setTimeout(function () {
            $.ajax({
                type: "post",
                url: ajax.drawUrl("/router?method=jz.enroll.singer.save"),
                // beforeSend: function(x, o) {
                //     ajax.beforeAjax(x, o, ["platformName"]);
                // },
                beforeSend: ajax.beforeAjax,
                data: $fillInfoForm.serialize(),
                dataType: "json",
                success: function(data) {
                    // remove loading
                    loadingToast();

                    // console.log('json = ' + JSON.stringify(data));
                    if (data.code && data.code == 1) {
                        location.replace('submit-success.html');
                    } else {
                        promptMsg('提交失败，请稍后再试~', 'center');
                    }
                },
                error: function(){
                    promptMsg('系统异常，请稍后再试~', 'center');
                }
            });
        }, 900);
        // self.off('click');
    }
});

// form validation
$fillInfoForm.validate({
    rules: {
        name: {
            required: true,
            isEnOrZhName: true,
            rangelength: [0, 10]
        },
        sex: 'required',
        phone: {
            required: true,
            isPhoneNum: true,
            rangelength: [11, 11]
        },
        wechat: {
            required: true,
            isWechat: true,
            rangelength: [0, 30]
        },
        qq: {
            required: true,
            digits: true,
            rangelength: [0, 15]
        },
        platformName: {
            rangelength: [0, 30]
        },
        roomNum: {
            digits: true,
            rangelength: [0, 14]
        },
        videoUrl: {
            rangelength: [0, 500]
        }
    },
    messages: {
        name: {
            required: '姓名为必填哦，请填写后再提交',
            isEnOrZhName: '请输入正确有效的姓名',
            rangelength: '名字最长不能超过10个字'
        },
        sex: {
            required: '请选择性别'
        },
        phone: {
            required: '手机号为必填哦，请填写后再提交',
            isPhoneNum: '请输入正确有效的手机号码',
            rangelength: '请输入正确有效的手机号码'
        },
        wechat: {
            required: '微信号为必填哦，请填写后再提交',
            isWechat: '请输入正确有效的微信号',
            rangelength: '微信号最多不能超过 30 个字符'
        },
        qq: {
            required: 'QQ 号为必填哦，请填写后再提交',
            digits: '请输入正确的 QQ 号',
            rangelength: 'QQ 号最多不能超过 15 个字符'
        },
        platformName: {
            rangelength: '直播平台名称最多不能超过30个字符'
        },
        roomNum: {
            digits: '请输入正确的直播房间号',
            rangelength: '请输入正确的直播房间号'
        },
        videoUrl: {
            rangelength: '才艺视频链接最多不能超过 500 个字符'
        }
    },
    errorPlacement: function(error, element) {
        promptMsg(error[0], 'center', 'false');
    },
    onsubmit: true,
    onkeyup: false,
    focusInvalid: false
});

// 中、英文校验
$.validator.addMethod("isEnOrZhName", function(value, element) {
    var pattern = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    return pattern.test(value);
});
// 中、英文校验
$.validator.addMethod("isWechat", function(value, element) {
    var pattern = /^[0-9a-zA-Z_\-]+$/;
    return pattern.test(value);
});

/**
 * 获取省市区选项
 *
 * @param elem 下拉框对象
 * @param parentId 父级ID
 * @param flag 标识符(province, city, area)
 *
 */
function getOptions(elem, parentId, flag) {
    // if (parentId != '') {
    //     $.ajax({
    //         type: "get",
    //         url: ajax.drawUrl("/router?method=jz.enroll.singer.teenagers&parentId=" + parentId),
    //         beforeSend: ajax.beforeAjax,
    //         data: {},
    //         dataType: "json",
    //         success: function(json) {
    //             var items = json.list;
    //             if (items && items.length > 0) {
    //                 var optionGroup = '';
    //
    //                 switch (flag) {
    //                     case 'province': optionGroup += '<option value="0">省份</option>'; break;
    //                     case 'city': optionGroup += '<option value="0">城市</option>'; break;
    //                     case 'area': optionGroup += '<option value="0">地区</option>'; break;
    //                     default: optionGroup += '';
    //                 }
    //
    //                 for (var i = 0; i < items.length; i++) {
    //                     optionGroup += '<option value="' + items[i].id + '">' + items[i].name + '</option>'
    //                 }
    //
    //                 elem.html(optionGroup);
    //             }
    //         },
    //         error: function() {
    //             promptMsg('系统异常，请稍后再试~', 'center');
    //         }
    //     });
    // }
}

/**
 * QiNiu upload image
 * @pram data
 *
 */
function qiniuUpload(dt) {
    var dt = dt || {};
    var uploaderDefaults = {};

    var Qiniu = new QiniuJsSDK();
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', // 上传模式，依次退化
        browse_button: dt.uploadElem, // 上传选择的点选按钮，必需
        uptoken_func: function(file) {
            var name = file.name;
            var extname = name.substring(name.lastIndexOf('.') + 1);

            var token = '';
            $.ajax({
                type: "post",
                url: ajax.drawUrl("/router?method=jz.common.upload.token"),
                beforeSend: ajax.beforeAjax,
                dataType: "json",
                async:false,
                data:{ type: 4, extname: extname},
                success: function(data){
                    uploaderDefaults.key = data.list[0].key;
                    uploaderDefaults.url = data.url;
                    token = data.list[0].token;
                }
            });
            return token;
        },
        auto_start: true,
        get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的uptoken
        unique_names: false,
        domain: 'http://images.9zhiad.com/', // bucket域名，下载资源时用到，必需
        container: dt.container, // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: '10mb', // 最大文件体积限制
        max_retries: 0, // 上传失败最大重试次数
        multi_selection: false, // 设置一次只能选择一个文件
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后，处理相关的事情
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前，处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时，处理相关的事情
                $('#halfImageWrap').html('<span style="position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%; font-size: 1.125rem; line-height: 100px; text-align: center; background: rgba(0, 0, 0, .628)">' + file.percent + '%</span>')
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后，处理相关的事情
                // 其中info是文件上传成功后，服务端返回的json，形式如：
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 查看简单反馈
                // var domain = up.getOption('domain');
                // var res = parseJSON(info);
                // var sourceLink = domain +"/"+ res.key; 获取上传成功后的文件的Url

                $('#' + dt.uploadElem).html('<img src="'+ uploaderDefaults.url + JSON.parse(info).key +'">');
                $('#' + dt.hiddenIpt).val(uploaderDefaults.url + JSON.parse(info).key);
            },
            'Error': function(up, err, errTip) {
                //上传出错时，处理相关的事情
            },
            'UploadCompvare': function() {
                //队列文件处理完毕后，处理相关的事情
            },
            'Key': function(up, file) {
                return uploaderDefaults.key;
            }
        }
    });
}

function qiniuUpload1(dt) {
    var dt = dt || {};
    var uploaderDefaults = {};

    var Qiniu1 = new QiniuJsSDK();
    var uploader1 = Qiniu1.uploader({
        runtimes: 'html5,flash,html4', // 上传模式，依次退化
        browse_button: dt.uploadElem, // 上传选择的点选按钮，必需
        uptoken_func: function(file) {
            var name = file.name;
            var extname = name.substring(name.lastIndexOf('.') + 1);

            var token = '';
            $.ajax({
                type: "post",
                url: ajax.drawUrl("/router?method=jz.common.upload.token"),
                beforeSend: ajax.beforeAjax,
                dataType: "json",
                async:false,
                data:{ type: 4, extname: extname},
                success: function(data){
                    uploaderDefaults.key = data.list[0].key;
                    uploaderDefaults.url = data.url;
                    token = data.list[0].token;
                }
            });
            return token;
        },
        auto_start: true,
        get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的uptoken
        unique_names: false,
        domain: 'http://images.9zhiad.com/', // bucket域名，下载资源时用到，必需
        container: dt.container, // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: '10mb', // 最大文件体积限制
        max_retries: 0, // 上传失败最大重试次数
        multi_selection: false, // 设置一次只能选择一个文件
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后，处理相关的事情
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前，处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时，处理相关的事情
                $('#wholeImageWrap').html('<span style="position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%; font-size: 1.125rem; line-height: 100px; text-align: center; background: rgba(0, 0, 0, .628)">' + file.percent + '%</span>')
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后，处理相关的事情
                // 其中info是文件上传成功后，服务端返回的json，形式如：
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 查看简单反馈
                // var domain = up.getOption('domain');
                // var res = parseJSON(info);
                // var sourceLink = domain +"/"+ res.key; 获取上传成功后的文件的Url

                $('#' + dt.uploadElem).html('<img src="'+ uploaderDefaults.url + JSON.parse(info).key +'">');
                $('#' + dt.hiddenIpt).val(uploaderDefaults.url + JSON.parse(info).key);
            },
            'Error': function(up, err, errTip) {
                //上传出错时，处理相关的事情
            },
            'UploadCompvare': function() {
                //队列文件处理完毕后，处理相关的事情
            },
            'Key': function(up, file) {
                return uploaderDefaults.key;
            }
        }
    });
}

//upload image
qiniuUpload({uploadElem: 'halfImageWrap', container: 'halfImageContainer', hiddenIpt: 'halfImage'});
qiniuUpload1({uploadElem: 'wholeImageWrap', container: 'wholeImageContainer', hiddenIpt: 'wholeImage'});