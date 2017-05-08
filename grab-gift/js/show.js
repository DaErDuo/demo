/**
 * Created by Sean on 2016/12/13.
 */
$(function(){
    initPage(tvList, programList);
});

function initPage(tvList, programList) {
    var $tvList = $('#tvList'), $leftList = $('#leftList'), $rightList = $('#rightList');
    if (tvList && tvList.length) {
        var tvList_html = '';
        tvList_html += '<ul>';
        for (var i = 0; i < tvList.length; i++) {
            tvList_html += '<li data-tv-id="' + tvList[i].id + '"><a class="tap-' + (i + 1) + '" href="javascript: void(0);">' + (tvList[i].tvName ? tvList[i].tvName : '') + '</a></li>';
        }
        tvList_html += '</ul>';
        $tvList.html(tvList_html);

        $tvList.find('ul li:first-child').addClass('active');
        $tvList.find('ul li').on('tap', function(){
            $(this).addClass('active');
            $tvList.find('ul li').not(this).removeClass('active');

            if ($(this).data('tvId') == $leftList.find('table').data('tvId')) {
                $leftList.show();
                $rightList.hide();
            }
            if ($(this).data('tvId') == $rightList.find('table').data('tvId')) {
                $rightList.show();
                $leftList.hide();
            }
        });
    }

    if (programList && programList.length > 0) {
        var table_html = '';
        table_html += '<table cellpadding="0" cellspacing="0" data-tv-id="">';
        table_html += '<thead>';
        table_html += '<tr><th width="12%">时间</th><th width="42%">节目</th><th width="23%">表演者</th><th width="23%">&nbsp;</th></tr>';
        table_html += '</thead>';
        table_html += '<tbody>';
        table_html += '</tbody>';
        table_html += '</table>';
        $leftList.html(table_html);
        $rightList.html(table_html);

        var left_tr_html = '', right_tr_html = '';
        for (var j = 0; j < programList.length; j++) {
            var startDate = new Date(programList[j].startTime),
                starNames = returnEmpty(programList[j].sysStarNames) + ',' + returnEmpty(programList[j].starNames),
                supportNum = returnEmpty(programList[j].pariseNum);

            if (programList[j].tvId == $tvList.find('li:nth-child(1)').data('tvId')) {
                left_tr_html  += '<tr><td>' + startDate.format('hh:mm') + '</td><td>' + returnEmpty(programList[j].programName) + '</td><td>' + formatStarNames(starNames) + '</td><td><a class="btn btn-zan"><span class="thumb"></span><span>' + (supportNum == 0 ? '支持' : supportNum) + '</span></a></td></tr>';
                $leftList.find('table').data('tvId', programList[j].tvId);
            }
            if (programList[j].tvId == $tvList.find('li:nth-child(2)').data('tvId')) {
                right_tr_html  += '<tr><td>' + startDate.format('hh:mm') + '</td><td>' + returnEmpty(programList[j].programName) + '</td><td>' + formatStarNames(starNames) + '</td><td><a class="btn btn-zan"><span class="thumb"></span><span>' + (supportNum == 0 ? '支持' : supportNum) + '</span></a></td></tr>';
                $rightList.find('table').data('tvId', programList[j].tvId);
            }
        }
        $leftList.find('table tbody').append(left_tr_html);
        $rightList.find('table tbody').append(right_tr_html);
        $rightList.hide();
    }
}

/**
 * date format
 *
 * @param f (eg: 'yyyy-MM-dd hh:mm:ss.S', 'yyyy年MM月dd日 hh小时mm分钟ss秒S毫秒')
 *
 */
Date.prototype.format = function(f) {
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S"  : this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(f))
        f = f.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if(new RegExp("(" + k + ")").test(f)) f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); return f;
};


/**
 * format stars name
 * replace ',' of string use ' '
 *
 * @param names
 *
 */
function formatStarNames(names) {
    return typeof names === 'string' ? names.split(',').join(' ') : names;
}

/**
 * return empty string or return zero
 *
 * @param obj
 *
 */
function returnEmpty(obj) {
    return obj ? obj : (typeof obj === 'number' ? 0 : '');
}