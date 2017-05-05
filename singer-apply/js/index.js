$(function () {
    var $cdTitleImg = $('#cdTitleImg');
    var $applyBtn = $('#applyBtn');
    var $applyBtnWrap = $('#applyBtnWrap');

    $('#countdown').timeCountDown({
        currentTime: (new Date()).format('yyyy-MM-dd hh:mm:ss'),
        startTime: '2017-03-01 00:00:01',
        endTime: '2017-05-31 23:59:59',

        activeStart: function() { // 活动未开始
            $cdTitleImg.prop('src', 'images/pic-txt-cd-before-start.png');
            $applyBtn.addClass('btn-disabled');
        },
        activeCurrent: function () { // 活动进行中
            $cdTitleImg.prop('src', 'images/pic-txt-cd-before-end.png');
            $applyBtn.removeClass('btn-disabled');

            // user apply
            $applyBtn.on('click', function() {
                $(this).prop('href', 'fill-info.html');
            });
        },
        activeFinish: function(ele, timer) { // 活动已结束
            clearInterval(timer);

            $cdTitleImg.prop('src', 'images/pic-txt-cd-ended.png');
            $applyBtnWrap.html('<p><span>请耐心等待海选结果</span></p>');
        }
    });
});

/**
 * 到计时
 */
(function($, window, document) {
    var CountDown = function(element, options){
        this.timeLength = options.timeLength || 4;
        this.element = element;
        this.sTime = null;
        this.currentTime = options.currentTime || '';
        this.startTime = options.startTime || '';
        this.endTime = options.endTime || '';
        this.methodTime = options.methodTime || 7000;
    };

    CountDown.prototype = {
        init: function(element, options) {
            this.activeStatus(element, this.currentTime, this.startTime, this.endTime, options);
        },
        tags: function(arrTime, timeLength) {
            if(arrTime.length > timeLength) return;
            else if (arrTime.length <= timeLength) {
                for(var i = 0 , len = timeLength - arrTime.length; i < len; i++) {
                    arrTime.unshift('00');
                }
            }

            var tags = '';
            // for(var i = 0 , len = arrTime.length; i < len ; i++) {
            //     tags += '<span class="numberTime vm">'+ arrTime[i] +'</span>';
            //
            //     if (i != len - 1) {
            //         if(i == 0) tags += '<span class="vm">天</span>';
            //         else tags += '<span class="vm">:</span>';
            //     }
            // }

            tags += '<div class="num">' + arrTime[0] + '<span>day</span></div>';
            tags += '<div class="mark"></div>';
            tags += '<div class="num">' + arrTime[1] + '<span>hour</span></div>';
            tags += '<div class="mark"></div>';
            tags += '<div class="num">' + arrTime[2] + '<span>minute</span></div>';
            tags += '<div class="mark"></div>';
            tags += '<div class="num">' + arrTime[3] + '<span>second</span></div>';

            return tags;
        },
        activeStatus: function(element, current, start, end, options) {
            current = current.replace(/-/g, '/');
            start = start.replace(/-/g, '/');
            end = end.replace(/-/g, '/');

            var currentTime = Date.parse(new Date(current)),
                startTime = Date.parse(new Date(start)),
                endTime = Date.parse(new Date(end)),
                self = this,
                timeSpan = 0,
                iText = 0,
                activeFlag = true,
                start_time = Date.parse(new Date());

            if (endTime >= currentTime) {
                if (startTime >= currentTime) { //活动未开始
                    timeSpan = startTime - currentTime;
                    activeFlag = false;
                    options.activeStart(element, self.sTime); //开始前
                } else if (currentTime > startTime && endTime >= currentTime) { //活动正在进行
                    timeSpan = endTime - currentTime;
                    options.activeCurrent(element, self.sTime); //正在进行
                }

                var arrTime = this.dateFormat(timeSpan);
                var tags = this.tags(arrTime, this.timeLength);
                this.element.html(tags);
                this.sTime = setInterval(function() {
                    iText = timeSpan + start_time - Date.parse(new Date());

                    arrTime = self.dateFormat(iText);

                    tags = self.tags(arrTime, self.timeLength);
                    self.element.html(tags);

                    if (!activeFlag && iText == self.methodTime) {
                        options.method(element); // 正在进行
                    }

                    if (iText <= 0 && !activeFlag) {
                        activeFlag = true;
                        timeSpan = endTime - currentTime + 1000;
                        iText = timeSpan + start_time - Date.parse(new Date());
                        options.activeCurrent(element, self.sTime); // 正在进行
                    } else if(iText <= 0 && activeFlag) {
                        clearInterval(self.sTime);
                        options.activeFinish(element, self.sTime); //结束
                    }
                }, 1000);
            } else { //活动已结束
                tags = this.tags(['00'], this.timeLength);
                this.element.html(tags);
                options.activeFinish(element, self.sTime); //结束
            }
        },
        dateFormat : function(timeSpan) {
            var totals = timeSpan / 1000,
                d = parseInt(totals / (24 * 3600)),
                h = parseInt((totals - d * 24 * 3600) / 3600),
                m = parseInt((totals - d * 24 * 3600 - h * 3600) / 60),
                s = totals - d * 24 * 3600 - h * 3600 - m * 60;

            d = (d >= 10) ? d : '0' + d;
            h = (h >= 10) ? h : '0' + h;
            m = (m >= 10) ? m : '0' + m;
            s = (s >= 10) ? s : '0' + s;

            return (d + ':' + h + ':' + m + ':' + s).split(':');
        }
    };

    $.fn.timeCountDown = function(options){
        var option = new CountDown(this, $.extend({}, $.fn.timeCountDown.defaults, options));
        var self = this;
        return this.each(function(){
            option.init(self,$.extend({}, $.fn.timeCountDown.defaults, options));
        });
    };
    $.fn.timeCountDown.defaults = {
        activeStart: function() {},
        activeCurrent: function() {},
        activeFinish: function() {},
        method: function() {}
    };
})(jQuery, window, document);