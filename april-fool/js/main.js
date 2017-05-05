/**
 * Created by Administrator on 2017/5/5.
 */
$(function() {
    var tpGame = new TpGame($('#pageScene'), 40);
    tpGame.initScene();
});

function TpGame(elem, seconds) {
    var that = {};
    const roundTime = [5, 4, 3, 2];

    that.sceneId = getUrlParam('id'); // 场景 Id
    that.seconds = seconds; // 游戏总秒数
    that.timer = null; // 定时器
    that.count = 0; // 计数
    that.roundNo = 0; // 轮次
    that.isRoundOver = true; // 轮次是否结束
    that.isClickable = false; // 是否可点击按钮偷拍
    that.isSuccess = false; // 是否成功完成游戏

    that.scene = elem.find('#scene'); // 场景图
    that.focus = elem.find('#focus'); // 场景聚焦
    that.timerText = elem.find('#timer'); // 倒计时
    that.countText = elem.find('#count'); // 计数
    that.shutterBtn = elem.find('#shutterBtn'); // 相机快门
    that.popupBoxTips = elem.find('#popupBoxTips'); // 提示信息弹框
    that.popupBoxMsg = elem.find('#popupBoxMsg'); // 信息弹框

    // 初始化场景
    that.initScene = function() {
        var tipsTxt = [
            '两人抠脚的时候才可以偷拍哦，不抠脚的时候偷拍会被发现哦！点击下方“我知道了”，游戏开始！限定时间内，不偷拍也会被发现哦！',
            '两人激吻的时候才可以偷拍哦，不激吻的时候偷拍会被发现哦！点击下方“我知道了”，游戏开始！限定时间内，不偷拍也会被发现哦！',
            '两人摸屁股的时候才可以偷拍哦，不摸屁股的时候偷拍会被发现哦！点击下方“我知道了”，游戏开始！限定时间内，不偷拍也会被发现哦！',
            '两人摸胸的时候才可以偷拍哦，不摸胸的时候偷拍会被发现哦！点击下方“我知道了”，游戏开始！限定时间内，不偷拍也会被发现哦！'
        ];
        var $sceneBg = $('img#sceneBg');
        var $coupleNormal = $('img#coupleNormal');
        var $coupleClose = $('img#coupleClose');

        switch (that.sceneId) {
            case "0":
                $sceneBg.prop('src', 'images/scene/scene-restaurant.png');
                $coupleNormal.prop('src', 'images/scene/couple-restaurant-normal.png');
                $coupleClose.prop('src', 'images/scene/couple-restaurant-close.png');
                that.popupBoxTips.find('p.text').text(tipsTxt[0]);
                break;
            case "1":
                $sceneBg.prop('src', 'images/scene/scene-parking.png');
                $coupleNormal.prop('src', 'images/scene/couple-parking-normal.png');
                $coupleClose.prop('src', 'images/scene/couple-parking-close.png');
                that.popupBoxTips.find('p.text').text(tipsTxt[1]);
                break;
            case "2":
                $sceneBg.prop('src', 'images/scene/scene-hotel.png');
                $coupleNormal.prop('src', 'images/scene/couple-hotel-normal.png');
                $coupleClose.prop('src', 'images/scene/couple-hotel-close.png');
                that.popupBoxTips.find('p.text').text(tipsTxt[2]);
                break;
            default:
                $sceneBg.prop('src', 'images/scene/scene-studio.png');
                $coupleNormal.prop('src', 'images/scene/couple-studio-normal.png');
                $coupleClose.prop('src', 'images/scene/couple-studio-close.png');
                that.popupBoxTips.find('p.text').text(tipsTxt[3]);
                break;
        }

        that.popupBoxTips.show();
        that.popupBoxTips.find('#btnGotIt').on('touchstart', function() {
            that.popupBoxTips.remove();
            that.start(); // 游戏开始
        });
    };

    // 游戏倒计时
    that.countdown = function() {
        var total = that.seconds, tt = 0, startTime = +new Date();

        that.timer = setInterval(function() {
            tt = total - Math.floor((+new Date() - startTime) / 1000);

            if (tt < 0) {
                clearInterval(timer);

                if (that.count == 0) {
                    that.over(false); // 结束失败
                } else {
                    that.over(true); // 游戏成功
                }
            } else {
                that.timerText.text(tt);

                switch (that.roundNo) {
                    case 0: setTimeout(function(){that.roundPlay()}, 2000); break;
                    // case 1: setTimeout(function(){that.roundPlay()}, 2000); break;
                    // case 2: setTimeout(function(){that.roundPlay()}, 2000); break;
                    default: that.roundPlay(); break;
                }
            }
        }, 1000);
    };

    // 场景人物状态轮次切换
    that.roundPlay = function() {
        var imgCoupleNormal = elem.find('img#coupleNormal');
        var imgCoupleClose = elem.find('img#coupleClose');

        if (that.isRoundOver) {
            imgCoupleNormal.hide();
            imgCoupleClose.show();
            that.focus.addClass('focus');
            that.isClickable = true; // 可偷拍

            setTimeout(function() {
                imgCoupleNormal.show();
                imgCoupleClose.hide();
                that.focus.removeClass('focus');
                that.isClickable = false; // 不可偷拍

                setTimeout(function() {
                    that.roundNo++;
                    that.isRoundOver = true;
                    that.isClickable = true; // 不可偷拍
                    that.focus.addClass('focus');
                }, getRandomIntInclusive(2, 5) * 1000);
            }, getRandomIntInclusive(2, 5) * 1000);

            that.isRoundOver = false; // 轮次设为未结束状态
        }
    };

    // 游戏开始
    that.start = function() {
        that.countdown(); // 开始倒计时

        that.shutterBtn.on('touchstart', function() {
            if(!that.isClickable) { // 不可偷拍
                clearInterval(that.timer);
                that.over(false); // 游戏结束
            } else {
                that.count++;
                that.countText.text(that.count);
            }
            that.focus.addClass('focus-flash');
            $(this).addClass('btn-shutter-press');
        }).on('touchend', function() {
            that.focus.removeClass('focus-flash');
            $(this).removeClass('btn-shutter-press');
        });
    };

    // 游戏结束后，弹出提示，并跳转结果页
    that.over = function(isSuccess) {
        var successTxt = [
            '偶像包袱碎一地！W 小鲜肉和 B 小鲜肉火锅店抠脚，秒变抠脚大汉！',
            '假戏真做？L 姓男星与 W 姓女星竟然在停车场公然激吻！',
            'Y 姓男星与 L 姓女星酒店密会，互相撩骚！',
            'Z 姓女星和 Y 姓女星片场比胸大，谁的胸部更迷人？'
        ];
        var failureTxt = '哎哟妈呀，你被发现了! ';

        if (isSuccess) { // 成功
            that.popupBoxMsg.find('.box-head img').prop('src', 'images/pic-popup-stamp.png').addClass('image-stamp');
            that.popupBoxMsg.find('p.message').text(successTxt[that.sceneId]);

            // 3 秒后跳转填写姓名页面
            setTimeout(function(){
                location.replace('fill-name.html?count=' + that.count + '&random=' + getRandomIntInclusive(0, 2));
            }, 2000);
        } else { // 失败
            that.popupBoxMsg.find('.box-head img').prop('src', 'images/pic-popup-man-cry.png');
            that.popupBoxMsg.find('p.message').text(failureTxt);

            // 3 秒后跳转失败页面
            setTimeout(function(){
                location.replace('failure.html?random=' + getRandomIntInclusive(0, 2));
            }, 2000);
        }
        that.popupBoxMsg.show();
    };

    return that;
}