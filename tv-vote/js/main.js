$(function(){
    initPage();
});

/**
 * initial page 初始化页面
 *
 */
function initPage() {
    $('#starVote').data('voteTime', 0);

    // 显示领先标签
    showLeadingTag();

    // 初始化页面票数
    $('.num-wrap').each(function() {
        $(this).html(turnNumToImage($(this).data('voteNum')));
    });

    // 支持 team A
    var li_width = $('.star-list li').width();
    $('.btn-red').on('tap', function() {
        var $supportBtn = $('#supportBtn'),
            teamState = $('#starVote').data('teamState'),
            offset_x = li_width - 58 + 10,
            li_red_w = li_width + offset_x + 10;
//	    console.log('A teamState = ' + teamState + ', li_width = ' + li_width + ', offset_x = ' + offset_x + ', li_red_w = ' + li_red_w);

        if (teamState == 'AOpened') {
            closeTeamA(li_width);
        }
        if (teamState == 'closed') {
            openTeamA(li_red_w, offset_x);
        }
        if (teamState == 'BOpened') {
            closeTeamB(li_width);
            openTeamA(li_red_w, offset_x);
        }
        if (!$supportBtn.hasClass('active')) {
            $supportBtn.addClass('active');
        }
    });

    // 支持 team B
    $('.btn-blue').on('tap', function() {
        var $supportBtn = $('#supportBtn'),
            teamState = $('#starVote').data('teamState'),
            offset_x = li_width - 58 + 10,
            li_blue_w = li_width + offset_x + 10;
//	    console.log('B teamState = ' + teamState + ', li_width = ' + li_width + ', offset_x = ' + offset_x + ', li_blue_w = ' + li_blue_w);

        if (teamState == 'BOpened') {
            closeTeamB(li_width);
        }
        if (teamState == 'closed') {
            openTeamB(li_blue_w, offset_x);
        }
        if (teamState == 'AOpened') {
            closeTeamA(li_width);
            openTeamB(li_blue_w, offset_x);
        }
        if (!$supportBtn.hasClass('active')) {
            $supportBtn.addClass('active');
        }
    });

    // 投票
    $('.btn-star').on('tap', doVote);
    //$('.btn-star').on('touchmove', function(e){
    //    e.preventDefault();
    //})
}


/**
 * do vote 投票
 *
 */
function doVote() {
    var animateTime = 600,
        that = $(this),
        $starVote = $('#starVote'),
        $numWrap = that.parents('li').find('.num-wrap'),
        intervalTime = Number($starVote.data('intervalTime')),
        voteNum = Number($numWrap.data('voteNum')),
        $team = $('#' + that.data('team')),
        teamVoteNum = Number($team.data('voteNum')),
        current_time = +new Date(),
        last_vote_time = $starVote.data('voteTime');

    // 点击太快提示
    if (last_vote_time != 0 && current_time - last_vote_time < intervalTime){
        promptMsg('亲~你的投票速度已经超过博尔特了，稍微歇歇吧', 'center');
        return;
    } else {
        $starVote.data('voteTime', current_time);
    }

    // 总票数加一
    teamVoteNum++;
    $team.data('voteNum', teamVoteNum);
    $team.html(turnNumToImage(teamVoteNum));
    // 显示领先标签
    showLeadingTag();

    //console.log('voteNum = ' + voteNum + ' teamVoteNum = ' + teamVoteNum);
    // 曲线运动动画
    var starParabola = new Parabola({
        el: that.find('span'),
        curvature: -.001,
        duration: animateTime,
        targetEl: $numWrap.find('i:last-child'),
        callback: function() {
            // 票数加一
            voteNum++;
            $numWrap.data('voteNum', voteNum);
            $numWrap.html(turnNumToImage(voteNum));
            //votePlusPlus(that.data('tvId'), that.data('teamId'), that.data('starId'));

            // 定时器:五秒钟
            setTimeout(function() {
                that.find('span').rotate('0deg').scale(1).css({'display': 'inline-block', 'opacity': 1});
                that.removeClass('btn-star-voted').on('touchstart', doVote);
            }, 5000);

            // 淡出效果
            that.find('span').fadeOut(500, function(){
                starParabola.reset();
                starParabola = null;
            });
        }
    });
    starParabola.start();

    // 旋转缩小动画
    that.find('span').scale(1).animate({rotate: '1080deg', scale: '.3'}, animateTime);
    that.addClass('btn-star-voted').off('touchstart', doVote);
}

/**
 * show leading tag 显示领先标签
 *
 */
function showLeadingTag() {
    var voteNumA = $('#teamA').data('voteNum');
    var voteNumB = $('#teamB').data('voteNum');

    if (voteNumA > voteNumB) {
        $('.team-red').addClass('team-red-active');
        $('.team-blue').removeClass('team-blue-active');
    }
    else if (voteNumA == voteNumB) {
        $('.team-red').removeClass('team-red-active');
        $('.team-blue').removeClass('team-blue-active');
    }
    else {
        $('.team-red').removeClass('team-red-active');
        $('.team-blue').addClass('team-blue-active');
    }
}

/**
 * vote plus plus 后台票数加一
 *
 * @param {Number} tvId
 * @param {Number} teamId
 * @param {Number} starId
 */
function votePlusPlus(tvId, teamId, starId) {
    $.get('/h5/interaction/partyStar/vote', {
        'tvId': tvId,
        'teamId': teamId,
        'starId': starId
    }, function(data){
        if (data) {
            promptMsg(data.message, 'center');
        }
    }, 'json');
}

/**
 * to client 跳客户端原生界面
 *
 * @param {Number} type
 * @param {String} selfId
 */
function toClient(type, selfId) {
    clientWebGotoNative({
        type   : type,
        id     : selfId, // 明星 id 或 资讯 id
        title  : 'test',
        url    : '',
        liveKey: '',
        shareVo: {}
    });
}

/**
 * open team A 展开队A
 *
 * @param {Number} liGrowWith 列表增长后的宽度
 * @param {Number} offsetX 水平位移
 *
 */
function openTeamA(liGrowWith, offsetX) {
    $('.star-list-red li').animate({width: liGrowWith + 'px'}, {
        queue: false,
        duration: 900,
        complete: function() {
            $(this).find('.star').fadeIn(400).promise().then(function() {
                var $supportBtn = $('#supportBtn');
                if ($supportBtn.hasClass('active')) {
                    $supportBtn.removeClass('active');
                }
            });
        },
        progress: function() {
            $(this).css('overflow', 'visible');
        }
    });
    $('.star-list-blue li').animate({right: '-' + offsetX + 'px'}, 900);
    $('#starVote').data('teamState', 'AOpened');
}

/**
 * close team A 关闭队A
 *
 * @param {Number} liWidth 列表宽度
 *
 */
function closeTeamA(liWidth) {
    $('.star-list-red li .star').fadeOut(400);
    $('.star-list-red li').animate({width: liWidth + 'px'}, {
        queue: false,
        duration: 900,
        progress: function() {
            $(this).css('overflow', 'visible');
        }
    }).promise().then(function() {
        var $supportBtn = $('#supportBtn');
        if ($supportBtn.hasClass('active')) {
            $supportBtn.removeClass('active');
        }
    });
    $('.star-list-blue li').animate({right: 0}, 900);
    $('#starVote').data('teamState', 'closed');
}

/**
 * open team B 展开队B
 *
 * @param {Number} liGrowWith 列表增长后的宽度
 * @param {Number} offsetX 水平位移
 *
 */
function openTeamB(liGrowWith, offsetX) {
    $('.star-list-blue li').animate({'width': liGrowWith + 'px'}, {
        queue: false,
        duration: 900,
        complete: function() {
            $(this).find('.star').fadeIn(400).promise().then(function() {
                var $supportBtn = $('#supportBtn');
                if ($supportBtn.hasClass('active')) {
                    $supportBtn.removeClass('active');
                }
            });
        },
        progress: function() {
            $(this).css({'overflow': 'visible'});
        }
    });
    $('.star-list-red li').animate({left: '-' + offsetX + 'px'}, 900);
    $('#starVote').data('teamState', 'BOpened');
}

/**
 * close team B 关闭队B
 *
 * @param {Number} liWidth 列表宽度
 *
 */
function closeTeamB(liWidth) {
    $('.star-list-blue li .star').fadeOut(400);
    $('.star-list-blue li').animate({width: liWidth + 'px'}, {
        queue: false,
        duration: 900,
        progress: function() {
            $(this).css('overflow', 'visible');
        }
    }).promise().then(function() {
        var $supportBtn = $('#supportBtn');
        if ($supportBtn.hasClass('active')) {
            $supportBtn.removeClass('active');
        }
    });
    $('.star-list-red li').animate({left: 0}, 900);
    $('#starVote').data('teamState', 'closed');
}

/**
 * turn number to image 将数字转换成数字图片返回
 *
 * @param {Object} num
 * @return {Object} num or htmlTags
 */
function turnNumToImage(num) {
    var htmlTags = '';
    if (typeof num === 'number') num = '' + num;
    if (typeof num === 'string') {
        if (isNaN(num)) {
            return num;
        }
        else {
            var numArr = num.split('');
            for (var i = 0; i < numArr.length; i++) {
                htmlTags += '<i class="num-' + numArr[i] + '"></i>';
            }
            return htmlTags;
        }
    }
    else {
        return num;
    }
}

;
(function () {
    var _$ = function (_this) {
        return _this.constructor == jQuery ? _this : $(_this);
    };
    // 获取当前时间
    function now() {
        return +new Date();
    }

    // 转化为整数
    function toInteger(text) {
        text = parseInt(text);
        return isFinite(text) ? text : 0;
    }

    var Parabola = function (options) {
        this.initialize(options);
    };
    Parabola.prototype = {
        constructor: Parabola,
        /**
         * 初始化
         * @classDescription 初始化
         * @param {Object} options 插件配置 .
         */
        initialize: function (options) {
            this.options = this.options || this.getOptions(options);
            var ops = this.options;
            if (!this.options.el) {
                return;
            }
            this.$el = _$(ops.el);
            this.timerId = null;
            this.elOriginalLeft = toInteger(this.$el.position().left);
            this.elOriginalTop = toInteger(this.$el.position().top);
            // this.driftX X轴的偏移总量
            //this.driftY Y轴的偏移总量
            //console.log('this.elOriginalLeft = ' + this.elOriginalLeft, ' this.elOriginalTop = ' + this.elOriginalTop);
            if (ops.targetEl) {
                this.driftX = toInteger(_$(ops.targetEl).position().left) - this.elOriginalLeft - 25 + _$(ops.targetEl).width() / 2;
                this.driftY = toInteger(_$(ops.targetEl).position().top) - this.elOriginalTop - 25  + _$(ops.targetEl).height() / 2;
//                console.log('this.driftX = ' + this.driftX, ' this.driftY = ' + this.driftY);
            } else {
                this.driftX = ops.offset[0];
                this.driftY = ops.offset[1];
            }
            this.duration = ops.duration;
            // 处理公式常量
            this.curvature = ops.curvature;
            // 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
            //a=this.curvature
            /* 公式： y = a*x*x + b*x + c;
             */
            /*
             * 因为经过(0, 0), 因此c = 0
             * 于是：
             * y = a * x*x + b*x;
             * y1 = a * x1*x1 + b*x1;
             * y2 = a * x2*x2 + b*x2;
             * 利用第二个坐标：
             * b = (y2+ a*x2*x2) / x2
             */
            // 于是
            this.b = ( this.driftY - this.curvature * this.driftX * this.driftX ) / this.driftX;

            //自动开始
            if (ops.autostart) {
                this.start();
            }
        },
        /**
         * 初始化 配置参数 返回参数MAP
         * @param {Object} options 插件配置 .
         * @return {Object} 配置参数
         */
        getOptions: function (options) {
            if (typeof options !== "object") {
                options = {};
            }
            options = $.extend({}, defaultSetting, _$(options.el).data(), (this.options || {}), options);

            return options;
        },
        /**
         * 定位
         * @param {Number} x x坐标 .
         * @param {Object} y y坐标 .
         * @return {Object} this
         */
        domove: function (x, y) {

            this.$el.css({
                position: "absolute",
                left: this.elOriginalLeft + x,
                top: this.elOriginalTop + y
            });

            return this;
        },
        /**
         * 每一步执行
         * @param {Date} now 当前时间 .
         * @return {Object} this
         */
        step: function (now) {
            var ops = this.options;
            var x, y;
            if (now > this.end) {
                // 运行结束
                x = this.driftX;
                y = this.driftY;
                this.domove(x, y);
                this.stop();
                if (typeof ops.callback === 'function') {
                    ops.callback.call(this);
                }
            } else {
                //x 每一步的X轴的位置
                x = this.driftX * ((now - this.begin) / this.duration);
                //每一步的Y轴的位置y = a*x*x + b*x + c;   c==0;
                y = this.curvature * x * x + this.b * x;

                this.domove(x, y);
                if (typeof ops.stepCallback === 'function') {
                    ops.stepCallback.call(this,x,y);
                }
            }
            return this;
        },
        /**
         * 设置options
         *  @param {Object} options 当前时间 .
         */
        setOptions: function (options) {
            this.reset();
            if (typeof options !== "object") {
                options = {};
            }
            this.options = $.extend(this.options,options);
            this.initialize(this.options);
            return this;
        },
        /**
         * 开始
         */
        start: function () {
            var self = this;
            // 设置起止时间
            this.begin = now();
            this.end = this.begin + this.duration;
            if (this.driftX === 0 && this.driftY === 0) {
                // 原地踏步就别浪费性能了
                return;
            }
            /*timers.push(this);
             Timer.start();*/
            if (!!this.timerId) {
                clearInterval(this.timerId);
                this.stop();
            }
            this.timerId = setInterval(function () {
                var t = now();
                self.step(t);

            }, 13);
            return this;
        },
        /**
         * 重置
         */
        reset: function (x, y) {
            this.stop();
            x = x ? x : 0;
            y = y ? y : 0;
            this.domove(x, y);
            return this;
        },
        /**
         * 停止
         */
        stop: function () {
            if (!!this.timerId) {
                clearInterval(this.timerId);

            }
            return this;
        }
    };
    var defaultSetting = {
        el: null,
        //偏移位置
        offset: [0, 0],
        //终点元素，这时就会自动获取该元素的left、top，设置了这个参数，offset将失效
        targetEl: null,
        //运动的时间，默认500毫秒
        duration: 500,
        //抛物线曲率，就是弯曲的程度，越接近于0越像直线，默认0.001
        curvature: 0.001,
        //运动后执行的回调函数
        callback: null,
        // 是否自动开始，默认为false
        autostart: false,
        //运动过程中执行的回调函数
        stepCallback: null
    };
    window.Parabola = Parabola;
})();