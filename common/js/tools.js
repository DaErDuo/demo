/**
 * Created by Sean on 2016/10/10.
 */
/**
 * detect platform
 *
 * @return {String} platform
 * */
function detectPlatform(){
    var platform = '';
    var browser = {
        versions: function() {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1 ,
                wx: u.indexOf('MicroMessenger') > -1 ,
                wb: u.indexOf('Weibo') > -1
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) { // ios执行的方法
        platform = 'ios';
    } else if (browser.versions.android) { // android执行的方法
        platform = 'android';
    } else {
        platform = 'pc';
    }

    return platform;
}

/**
 * loading Toast
 *
 * @param txt
 */
function loadingToast(txt) {
    var loadingToast = $('#loadingToast');
    console.log('loadingToast.length = ' + loadingToast.length);

    if (loadingToast.length == 0) {
        $('body').append(
            '<div id="loadingToast" class="loading_toast">' +
            '<div class="mask_transparent"></div>' +
            '<div class="toast">' +
            '<div class="loading">' +
            '<div class="loading_leaf loading_leaf_0"></div>' +
            '<div class="loading_leaf loading_leaf_1"></div>' +
            '<div class="loading_leaf loading_leaf_2"></div>' +
            '<div class="loading_leaf loading_leaf_3"></div>' +
            '<div class="loading_leaf loading_leaf_4"></div>' +
            '<div class="loading_leaf loading_leaf_5"></div>' +
            '<div class="loading_leaf loading_leaf_6"></div>' +
            '<div class="loading_leaf loading_leaf_7"></div>' +
            '<div class="loading_leaf loading_leaf_8"></div>' +
            '<div class="loading_leaf loading_leaf_9"></div>' +
            '<div class="loading_leaf loading_leaf_10"></div>' +
            '<div class="loading_leaf loading_leaf_11"></div>' +
            '</div>' + (txt ? '<p class="toast_content">' + txt + '</p>' : '') +
            '</div>' +
            '</div>'
        );

        if (!txt) {
            $('.toast').css({'width' : '5.6em', 'min-height' : '5.6em', 'margin-left' : '-2.8em'});
            $('.loading').css('top', '50%');
        }
    } else {
        loadingToast.remove();
    }

}

/**
 * 只有在webview或者网页版的情况下有用
 * 提示信息显示下屏幕下方
 * msg 提示文字     ,
 * prompt 提示框对象     ,
 * position显示的位置   值为center显示在中间,值为bottom显示在底部
 * delay默认为2s
 */

function promptMsg(msg,position,flag){
    var flag = flag || 'true';
    var prompt_st = null;
    if(flag == 'true'){
        clearTimeout(prompt_st);
        $('#promptMsg').remove();
    }else{
        if($('#promptMsg').length) return;
    }
    var tags = '<div id="promptMsg"></div>';
    $('body').append(tags);
    var prompt = $('#promptMsg');
    var obj = arguments[3] || {};

    var w_width = window.innerWidth || document.documentElement.clientWidth,
        screen_height = window.innerHeight || document.body.clientHeight,
        prompt = prompt;
    prompt.css({
        'position':'fixed',
        'padding':'8px 20px',
        'max-width':'60%',
        'display':'none',
        'z-index':obj.zIndex || '5000',
        'opacity':'0',
        'background':obj.background || '#000',
        'background-size':obj.backgroundSize || '100% 100%',
        'color':obj.color || '#fff',
        'font-size':'14px',
        'line-height':obj.lineHeight || '18px',
        'border-radius':'8px',
        'background-repeat':'no-repeat'
    });

    var prompt_top = 0;
    switch(position){
        case 'center':
            prompt_top = (screen_height-prompt.outerHeight())/2;
            break;
        case 'bottom':
            prompt_top = (screen_height - prompt.outerHeight() - 60);
            break;
        default:
            break;
    }

    prompt.html(msg).css({'top':prompt_top + 'px' ,'left':(w_width - prompt.innerWidth()) / 2 + 'px'}).show().animate({
        opacity:'1'
    },500);
    prompt_st = setTimeout(function(){
        prompt.animate({opacity:'0'},500,function(){
            $(this).remove();
            clearTimeout(prompt_st);
        });
    },obj.delay || 3000);
}

/**
 * Returns a random integer between min (included) and max (included)
 *
 * @param min(included)
 * @param max(included)
 * @return number
 * */
function getRandomIntInclusive (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get GIF url from <img> src and replace it
 *
 * */
function showGif(){
    $('img').each(function(){
        var old_src = $(this).prop('src');

        if (old_src.includes('?gifUrl='))
            $(this).prop('src', old_src.substring(old_src.indexOf('gifUrl') + 7)); // 'gifUrl='.length = 7
    });
}