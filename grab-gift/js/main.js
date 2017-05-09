
//baseUrl = baseUrl || 'http://interaction.9zhiad.com';
//yayaH5Url = yayaH5Url || 'http://h5.9zhiad.com';

const tv_sns_url = baseUrl + '/tv/sns'; // 获取 TV 投票数
const program_sns_url = baseUrl + '/program/sns'; // 获取节目投票数
const program_snses_url = baseUrl + '/program/snses'; // 根据节目 ID 获取节目投票数
const tv_vote_url = baseUrl + '/tv/vote'; // TV 票数加一
const program_vote_url = baseUrl + '/programe/vote'; // 节目票数加一

$(function(){
    // initial page
    initPage();

    // close popup box
    $('a.btn, .popup-box-wrapper').on('tap', function(e) {
        e.stopPropagation();
    });

    // close popup box
    $('a.btn-close').on('click', function() {
        $(this).parents('.popup-box-wrapper').hide();
    });
});

/**
 * initial page
 *
 */
function initPage() {
	var session = '';
	
	if (redpack_key == 1) { // 后台配整点抢红包,1-显示,0-不显示
		$('#giftList').show();
		 initActive();
	} else {
		$('#giftList').remove();
	}
    //playAnimation();
	
    // 吉时送大礼
    // initGiftArea(redpack_key, isover_key, infoList);
    // 活动大作战
    initActivityArea(active_key, listParty, '');
    // 跨年盛宴
    initTvStations(program_key, isover_key, tvList, programList, programRanking);
    // 晚会专栏
    initDynamicArea(listInfoParty);
}

/**
 * 页面初始化
 * 
 */
function initActive(){
	var href = location.href;
	var session = '123';

	// 已登录, 判断当前时间段有没有抢过红包
	// var url = baseUrl + '/h5/interaction/hit/check';
	// var params = {
	//	session : session,
	//	udid : href.getUrlParamVal('udid')
	// };
	// $.post(url,params,function(data){
	//	if(data.type == 'success'){
			if(currTime < endTime){// 未结束d
				if(canHit){ // 能抢
					$('#grabEedCountDownList').html('').hide(); // 倒计时
					//点按钮播放动画
					$('#partyAreaDownBtn').html('<input type="button" value="点我抢大礼" id="partyAreaDownButton" onclick="'+ (!session?'clientCheckLogin()':'playAnimation()') +'" class="partyAreaDownButton">');
				}else{ // 不能参与
					if(nextTime != 0){ // 有下一场
						if(!session){ // 未登录
							$('#grabEedCountDownList').html('').hide();
							$('#partyAreaDownBtn').html('<input type="button" value="点我抢大礼" id="partyAreaDownButton" onclick="clientCheckLogin()" class="partyAreaDownButton">')
						}else{ // 已登录
							$('#grabEedCountDownList').html(downTimeTags({msg:(currTime < startTime ? '距离惊喜开启还有' : '下一波大礼即将来袭')})).show(); // 倒计时
							//点按钮播放动画
							$('#partyAreaDownBtn').html('').removeClass('box-vm').hide();//按钮
						}
						initGrabRed('#grabEedCountDown');
					}else{ // 活动已结束
						$('#partyAreaDownBtn').remove();
						$('#grabEedCountDownList').html('<div class="countDownTip" id="countDownTip">客官，本场活动已经打烊了，去首页寻找其他精彩活动吧。</div>').show()
						.find('.countDownTip').css({'padding':'20px 20px 0','text-align':'left'});
					}
				}
			}else{ // 已结束
				$('#partyAreaDownBtn').remove();
				$('#grabEedCountDownList').html('<div class="countDownTip" id="countDownTip">客官，本场活动已经打烊了，去首页寻找其他精彩活动吧。</div>').show()
				.find('.countDownTip').css({'padding':'20px 20px 0','text-align':'left'});
			}
	//	}
	// },'json');
}

/**
 * 倒计时标签
 * 
 */
function downTimeTags(data){
	var data = data || {};
	var tags = '';
	tags +=	'<div class="countDownTip" id="countDownTip">'+data.msg+'</div>'
		+	'<div class="grabEedCountDown box-vm" id="grabEedCountDown"></div>'
		+	'<div class="grabEedCountDownTip box-vm">'
		+		'<span>天</span>'
		+		'<span>小时</span>'
		+		'<span>分</span>'
		+		'<span>秒</span>'
		+	'</div>';
	return tags;
}

/**
 * 倒计时
 * 
 */
function initGrabRed(elem){ 
	$(elem).show();
	$(elem).timeCountDown({
		currentTime: (new Date(currTime)).format('yyyy-MM-dd hh:mm:ss'),
		startTime: (new Date(startTime)).format('yyyy-MM-dd hh:mm:ss'),
		endTime: (new Date(endTime)).format('yyyy-MM-dd hh:mm:ss'),
		activeStart:function(elem){ // 活动未开始
		},
		activeCurrent:function(elem,sTime){  // 活动正在进行
			clearInterval(sTime);
			$('#grabEedCountDownList').html('').hide(); // 倒计时
			//点按钮播放动画
			$('#partyAreaDownBtn').show().addClass('box-vm').html('<input type="button" value="点我抢大礼" id="partyAreaDownButton" onclick="playAnimation()" class="partyAreaDownButton">');
		},
		activeFinish:function(elem){ // 活动结束
			$('#partyAreaDownBtn').remove();
			$('#grabEedCountDownList').html('<div class="countDownTip" id="countDownTip">客官，本场活动已经打烊了，去首页寻找其他精彩活动吧。</div>').show()
			.find('.countDownTip').css({'padding':'20px 20px 0','text-align':'left'});
		}
	});
}


/**
 * 拆红包拆红包按钮, 拆红包
 * 
 */
function openRedEnvelope(elem){ 
	var disabled = $(elem).attr('disabled');
	$(elem).addClass('opening').html('<p>正在努力拆盒中<i class="dot dot1">.</i><i class="dot dot2">.</i><i class="dot dot3">.</i></p>');
	if(disabled == 'disabled'){
		return;
	}
	//var href = location.href;
	//var session = clientGetSession() || href.getUrlParamVal('session');
	//
	//$(elem).attr('disabled','disabled'); // 禁点
	//var url = baseUrl + '/h5/interaction/praise/hit',
	//	paras = {
	//		session : session,
	//		udid : clientGetUdid() || href.getUrlParamVal('udid')
	//	};
	//$.ajax({
	//	type:'post',
	//	dataType : 'json',
	//	url : url,
	//	data : paras,
	//	success : function(data){
	//		$('#giftSurprise').hide();
	//		if(data.type == 'success'){ // 拆到礼物
	//			if(data.praiseInfo){ // 抢到了礼物
                    setTimeout(function(){
                        $('#giftSurprise').hide();
                        $('#winningPopup').show();
                        $('#winPrize').attr('src', 'images/pic-prize-1.png');
                        $('#prizeName').html('定制水杯');
                    }, 2000);
				//}else{ // 未抢到礼物
				//	$('#errorPopup').show();
				//}
				// 显示到计时
				//if(praiseHit){
				//	if(nextTime != 0){ // 有下一场的情况
				//		//$('#currentTime').val((new Date(data.praiseHit.nowTime)).format('yyyy-MM-dd hh:mm:ss'));
				//		//$('#partyStartTime').val((new Date(data.praiseHit.nextTime)).format('yyyy-MM-dd hh:mm:ss'));
				//		//$('#partEndTime').val((new Date(data.praiseHit.endTime)).format('yyyy-MM-dd hh:mm:ss'));
				//
				//		$('#grabEedCountDownList').html(downTimeTags({msg:'下一波大礼即将来袭'})).show(); // 倒计时
				//		//点按钮播放动画
				//		$('#partyAreaDownBtn').html('').removeClass('box-vm').hide();
				//
				//		initGrabRed('#grabEedCountDown');
				//	}else{ // 没有下一场的情况
				//		$('#partyAreaDownBtn').remove();
				//		$('#grabEedCountDownList').html('<div class="countDownTip" id="countDownTip">客官，本场活动已经打烊了，去首页寻找其他精彩活动吧。</div>').show()
				//		.find('.countDownTip').css({'padding':'20px 20px 0','text-align':'left'});
				//	}
				//}
	//		}else{
	//			if(data.jump == 'to_login'){ // session失效 , 跳登录
	//				clientCheckLogin();
	//			}else{
	//				$('#errorPopup').show();
	//			}
	//		}
	//		$(elem).attr('disabled','');
	//		$(elem).removeClass('opening').html('<img src="images/pic-chai.png" alt="Chai">');
	//	},
	//	error : function(data){
	//		$(elem).attr('disabled','');
	//		$(elem).removeClass('opening').html('<img src="images/pic-chai.png" alt="Chai">');
	//	}
	//});
}

/**
 * 点击立即领取 ,判断登录 , 已登录跳转我的奖品列表
 * 
 */
function receive(){
    $('#winningPopup').hide();
	//var href = location.href;
	//var session = clientGetSession() || href.getUrlParamVal('session');
	//
	//var udid = clientGetUdid() || href.getUrlParamVal('udid') ;
	//var url = yayaH5Url + '/h5/yaya/praise/mywin2?session='+session;
	//if(!session){
	//	clientCheckLogin();
	//}else{
	//	location.href = url;
	//}
}

/**
 * initial gift area
 *
 * @param flag
 * @param state
 * @param gifts
 *
 */
function initGiftArea(flag, state, gifts) {
    if (flag == 1 && state == 1 && gifts.length > 1) {
        var giftList_html = '', giftList = $('#giftList');
        giftList_html += '<div class="block-head"><img src="images/pic-bg-title.png" alt="Title"><span>吉时送大礼</span></div>';
        giftList_html += '<div class="block-body sky-carousel">';
        giftList_html += '<div class="sky-carousel-wrapper">';
        giftList_html += '<ul class="sky-carousel-container" id="sky-carousel-container"></ul>';
        giftList_html += '</div>';
        giftList_html += '<a class="btn btn-rules" href="javascript: void(0);"><img src="images/icon-question-mark.png" alt="Question Mark">活动规则</a>';
        giftList_html += '</div>';
        giftList.html(giftList_html);

        if (gifts && gifts.length > 0) {
            var giftList_li = '';
            for (var i = 0; i < gifts.length; i++) {
                var partyStarTime = gifts[i].partyStartTime,
                	partyEndTime = gifts[i].partyEndTime,
                	expiryDate = gifts[i].partyEndTime,
                    currentDate  = gifts[i].currentDate,
                    partyStartDate = new Date(partyStarTime);

                giftList_li += '<li partyid="'+ gifts[i].id +'"><a href="javascript: void(0);">'
                			+		'<input type="hidden" class="currentTime" value="'+ currentDate +'">'
                			+		'<input type="hidden" class="partyStartTime" value="'+ partyStarTime +'">'
                			+		'<input type="hidden" class="partEndTime" value="'+ partyEndTime +'">'
                			+		'<img src="images/pic-gift-small.png">'
                			+		'<div class="redTimeDown box-vm">'
                			+			'<div>'
                			+				'<span class="countDownTip"></span>'
                			+				'<div class="grabEedCountDown"></div>'
                			+			'</div>'
                			+		'</div>'
        					+	'</a></li>';
            }
            giftList.find('ul.sky-carousel-container').html(giftList_li);
            
            initGrabRed('#sky-carousel-container');
            //skyCarousel(skyCarousel_startIndex);
        }

        $('a.btn-rules').on('tap', function(){ $('#rulesPopup').show(); });
    }
}

/**
 * initial activity area
 *
 * @param flag (0: hide; 1: show)
 * @param activities
 *
 */
function initActivityArea(flag, activities, session) {
    if (flag == 1) {
        var activity_html = '', activity = $('#activity');
        activity_html += '<div class="block-head"><img src="images/pic-bg-title.png" alt="Title"><span>活动大作战</span></div>';
        activity_html += '<div class="block-body activity-swiper" id="activityList"><ul class="activity-wrap swiper-wrapper"></ul></div>';
        activity.html(activity_html);

        if (activities && activities.length > 0) {
            var activity_li = '';
            for (var i = 0, len = activities.length; i < len; i++) {  //1-活动 3-应援 2-资讯
                if (activities[i].contentType == 3) { // 应援
                    activity_li += '<li class="swiper-slide">';
                    activity_li += '<a href="javascript: toClient(8, \'' + returnEmpty(activities[i].contentId) + '\')">';
                    activity_li += '<img src="' + returnEmpty(activities[i].titleImage) + '">';
                    activity_li += '</a>';
                    activity_li += '</li>';
                } else if(activities[i].contentType == 1){ // 活动
                    activity_li += '<li class="swiper-slide">';
                    activity_li += '<a href="' + returnEmpty(activities[i].contentUrl) + (returnEmpty(activities[i].contentUrl).indexOf('?') == -1 ? '?' : '&') + 'interactId=' + returnEmpty(activities[i].contentId) + '&session=' + session + '">';
                    activity_li += '<img src="' + returnEmpty(activities[i].titleImage) + '">';
                    activity_li += '</a>';
                    activity_li += '</li>';
                } else { // 资讯
                	activity_li += '<li class="swiper-slide">';
                    activity_li += '<a href="javascript: toClient(2, \'' + returnEmpty(activities[i].contentId) + '\')">';
                    activity_li += '<img src="' + returnEmpty(activities[i].titleImage) + '">';
                    activity_li += '</a>';
                    activity_li += '</li>';
                }
            }
            activity.find('ul.activity-wrap').html(activity_li);

            var $activityList = $('#activityList'),
                $swiperSlide  = $activityList.find('.swiper-wrapper .swiper-slide'),
                swiperSlide_h = 0,
                swiperContainer_h = 0,
                activitySwiper = null,
                imgCount = 0;

            $swiperSlide.find('a img').load(function() {
                swiperSlide_h = $(this).height();

                imgCount++;
                if (imgCount <= 4) {
                    swiperContainer_h += swiperSlide_h;
                }

                //console.log(imgCount + ' swiperSlide_h = ' + swiperSlide_h + ' swiperContainer_h = ' + swiperContainer_h + ' activities_length = ' + activities.length);
                if (imgCount == activities.length) {
                    $swiperSlide.height(swiperSlide_h);

                    if (activities.length <= 4) {
                        $activityList.css('overflow', 'hidden').height(swiperContainer_h + 12 * (activities.length - 1));

                        activitySwiper = new Swiper('#activityList', {
                            direction: 'vertical',
                            autoHeight: false,
                            spaceBetween: 12,
                            slidesPerView: activities.length,
                            onlyExternal: true
                        });
                        activitySwiper.updateClasses();
                    } else {
                        $activityList.css('overflow', 'hidden').height(swiperContainer_h + 12 * (4 - 1));

                        activitySwiper = new Swiper('#activityList', {
                            direction: 'vertical',
                            spaceBetween: 12,
                            slidesPerView: 4,
                            onlyExternal: true,
                            loop: true,
                            autoplay: 5000
                        });
                        activitySwiper.updateClasses();
                    }
                    var liWidth = $('#activityList li:first').width();
                    var liHeight = $('#activityList li:first').height();
                    $('#activityList img').css({'width':liWidth+'px','height':liHeight+'px'});
                }
            });
        }
    }
}

/**
 * initial tv stations
 *
 * @param flag (0: hide; 1: show)
 * @param state (0: preheating; 1: start; 2: end)
 * @param tvStations
 * @param programList
 * @param programRanking
 *
 */
function initTvStations(flag, state, tvStations, programList, programRanking) {
    var $tvPKtv = $('#tvPKtv');
    if (flag == 1 && tvStations.length == 2) {
        var stations_html = '';
        stations_html += '<div class="block-head"><img src="images/pic-bg-title.png" alt="Title"><span>跨年盛宴</span></div>';
        stations_html += '<div class="block-body block-tv-station">';
        stations_html += '<div class="image-wrap tv-vs-tv"><img src="images/pic-tv-vs.png" alt="VS"></div>';
        stations_html += '<ul class="tv-station-wrapper">';
        stations_html += '<li class="tv-station tv-station-left" data-tv-id="' + returnEmpty(tvStations[0].id) + '"><div class="tv-logo-wrap"><img src="images/pic-tv-HuNan.png" alt="TV"><p>' + returnEmpty(tvStations[0].tvName) + '</p></div></li>';
        stations_html += '<li class="tv-station tv-station-right" data-tv-id="' + returnEmpty(tvStations[1].id) + '"><div class="tv-logo-wrap"><img src="images/pic-tv-ZheJiang.png" alt="TV"><p>' + returnEmpty(tvStations[1].tvName) + '</p></div></li>';
        stations_html += '</ul>';
        stations_html += '<div class="tv-station-pk">';
        stations_html += '<div class="popularity-value" id="tvsVote"><p id="voteANum" data-tv-id="' + returnEmpty(tvStations[0].id) + '">' + returnEmpty(tvStations[0].praiseNum) + '</p><p>人气值</p><p id="voteBNum" data-tv-id="' + returnEmpty(tvStations[1].id) + '">' + returnEmpty(tvStations[1].praiseNum) + '</p></div>';
        stations_html += '<div class="progress-bar"><div id="progress"></div></div>';
        stations_html += '</div>';
        stations_html += '</div>';
        $tvPKtv.html(stations_html);

        if ((tvStations[0].praiseNum + tvStations[1].praiseNum) == 0) {
            $('#progress').width('50%');
        } else {
            $('#progress').width(tvStations[0].praiseNum / (tvStations[0].praiseNum + tvStations[1].praiseNum) * 100 + '%');
        }
        // getTvsVote(); // 异步请求获取 TV 票数

        if (state == 0) { // 预热
            $tvPKtv.find('.tv-station-pk').append('<div class="btn-wrap"><a id="voteA" class="btn btn-yellow" href="javascript: void(0);">支持</a><a id="voteB" class="btn btn-blue" href="javascript: void(0);">支持</a></div>');

            $('#voteA').on('tap', voteA);
            $('#voteB').on('tap', voteB);
        }
        if (state == 1) { // 开始
            showProgramList($tvPKtv.find('.block-tv-station'), programList);
        }
        if (state == 2) { // 结束
            showProgramRanking($tvPKtv.find('.block-tv-station'), programRanking);
        }
    }

    // show program list
    function showProgramList(elem, list) {
        if (list && list.length > 0) {
            var tvShowCard_html = '';
            tvShowCard_html += '<div class="tv-show-card">';
            tvShowCard_html += '<ul class="show-card-wrapper show-card-left"></ul>';
            tvShowCard_html += '<ul class="show-card-wrapper show-card-right"></ul>';
            //tvShowCard_html += '<div class="time-line"></div>';
            tvShowCard_html += '</div>';
            tvShowCard_html += '<a class="btn btn-show-more" href="show-list.html">查看完整节目单</a>';
            elem.append(tvShowCard_html);

            var programIds = '';
            for (var i = 0; i < list.length; i++) {
                var showCard_html = '',
                    // currentTime = +new Date(),
                    currentTime = 1483095600000,
                    startTime = Number(list[i].startTime),
                    endTime   = i < (list.length -1) ? Number(list[i + 1].startTime) : Number(list[i].startTime) + 5 * 3600 * 1000,
                    starName = returnEmpty(list[i].sysStarNames) + ',' + returnEmpty(list[i].starNames);
                // 节目 ids
                programIds += list[i].id + (i == (list.length -1) ? '' : ',');

                showCard_html += '<li class="show-card" data-start-time="' + returnEmpty(list[i].startTime) + '" data-star-ids="' + returnEmpty(list[i].sysStarIds) + '" data-star-names="' + returnEmpty(list[i].sysStarNames) + '">';
                showCard_html += '<div class="card-timer"></div>';
                showCard_html += '<span class="time">' + (new Date(startTime)).format('hh:mm') + ' 播出</span>';
                if (list[i].pariseNum > 5000) {
                    showCard_html += '<p class="image-wrap"><img src="images/pic-label-hot.png" alt="Hot"></p>';
                }
                showCard_html += '<p class="title">' + returnEmpty(list[i].programName) + '</p>';
                showCard_html += '<p class="stars">' + formatStarNames(starName) + '</p>';
                showCard_html += '<a class="btn btn-zan btn-zan-yellow" href="javascript: void(0);" data-tv-id="' + returnEmpty(list[i].tvId) + '" data-program-id="' + returnEmpty(list[i].id) + '"><span class="thumb"></span><span class="num" id="program-' + returnEmpty(list[i].id) + '">' + returnEmpty(list[i].pariseNum) + '</span></a>';
                showCard_html += '</li>';

                if (currentTime <= endTime) {
                    if (list[i].tvId == elem.find('.tv-station-left').data('tvId')) {
                        elem.find('.show-card-left').append(showCard_html);
                    }
                    if (list[i].tvId == elem.find('.tv-station-right').data('tvId')) {
                        elem.find('.show-card-right').append(showCard_html);
                    }
                }
            }
            $('.show-card-wrapper').find('li:nth-child(1), li:nth-child(2)').css({display: 'list-item', opacity: 1});

            //var $timeLine = $('.time-line');
            //$timeLine.height($timeLine.height() - 15);

            // init program timer
            initProgramTimer($('.show-card-left'));
            initProgramTimer($('.show-card-right'));

            // show program popup
            elem.find('.show-card-wrapper .show-card').on('tap', function(){
                showProgramPopup($(this).find('p.title').text(), $(this).data('starIds'), $(this).data('starNames'));
            });

            // zan
            $('a.btn-zan').on('tap', voteProgramCard);

            // initial programs vote
            // getProgramsVoteByIds(programIds);
        }
    }

    // show program ranking
    function showProgramRanking(elem, list) {
        if (list && list.length > 0) {
            var showList_html = '', $showList = $('#showList'), programIds = '';

            showList_html += '<ul class="show-list">';
            for (var i = 0; i < list.length; i++) {
                var starsName = returnEmpty(list[i].sysStarNames) + ',' + returnEmpty(list[i].starNames);
                programIds += list[i].id + (i == (list.length -1) ? '' : ',');

                showList_html += '<li>';
                showList_html += '<div class="serial-no">' + (i + 1) + '<div></div></div>';
                showList_html += '<div class="txt">';
                if (list[i].tvId == elem.find('.tv-station-left').data('tvId')) {
                    showList_html += '<p class="show-name"><i class="clr-left">[' + elem.find('.tv-station-left p').text() + ']</i>' + returnEmpty(list[i].programName) + '</p>';
                }
                if (list[i].tvId == elem.find('.tv-station-right').data('tvId')) {
                    showList_html += '<p class="show-name"><i class="clr-right">[' + elem.find('.tv-station-right p').text() + ']</i>' + returnEmpty(list[i].programName) + '</p>';
                }
                showList_html += '<p class="show-stars">' + formatStarNames(starsName) + '</p>';
                showList_html += '</div>';
                showList_html += '<div class="popularity"><p id="program-' + list[i].id + '" class="num" data-program-id="' + list[i].id + '">' + returnEmpty(list[i].pariseNum) + '</p><p>人气</p></div>';
                showList_html += '</li>';
            }
            showList_html += '</ul>';
            $showList.html(showList_html);

            $showList.find('.show-list .serial-no').each(function(){
                var hh = $(this).height();

                $(this).css({'line-height': hh + 'px'});
                $(this).find('div').css({'border-top-width': hh / 2 + 'px', 'border-bottom-width': hh / 2 + 'px'});
            });
            // initial programs vote
            // getProgramsVoteByIds(programIds);
        }
    }

    // vote A
    function voteA() {
        var that = $(this),
            tvId = $('#voteANum').data('tvId');

        tvVotePlusPlus(tvId);
        that.addClass('btn-yellow-active').text('已支持').off('tap', voteA);
        setTimeout(function() {
            that.removeClass('btn-yellow-active').text('支持').on('tap', voteA);
        }, 5000);
        // voteTV(tvId); // 后台 TV 票数加一
    }

    // vote B
    function voteB() {
        var that = $(this),
            tvId = $('#voteANum').data('tvId');;

        tvVotePlusPlus(tvId);
        that.addClass('btn-blue-active').text('已支持').off('tap', voteB);
        setTimeout(function() {
            that.removeClass('btn-blue-active').text('支持').on('tap', voteB);
        }, 5000);
        // voteTV(tvId); // 后台 TV 票数加一
    }

    // vote program
    function voteProgramCard() {
        var that = $(this),
            voteNum = Number(that.find('span.num').text()) + 1;

        that.find('span.num').text(voteNum);
        tvVotePlusPlus(that.data('tvId')); // TV 票数加一
        that.addClass('btn-zan-active').off('tap', voteProgramCard);
        setTimeout(function() {
            that.removeClass('btn-zan-active').on('tap', voteProgramCard);
        }, 5000);
        // voteProgram($(this).data('tvId'), $(this).data('programId')); // 后台节目票数加一
    }

    // tv vote plus plus
    function tvVotePlusPlus(tvId) {
        if (tvId) {
            var $voteANum = $('#voteANum'), voteANum = Number($voteANum.text()),
                $voteBNum = $('#voteBNum'), voteBNum = Number($voteBNum.text());
            if (tvId == $voteANum.data('tvId')) {
                voteANum++;
                $voteANum.text(voteANum);
            }
            if (tvId == $voteBNum.data('tvId')) {
                voteBNum++;
                $voteBNum.text(voteBNum);
            }
            $('#progress').width(voteANum / (voteANum + voteBNum) * 100 + '%');
        }
    }

    // show program popup
    function showProgramPopup(title, ids, names) {
        var idsStr   = ids + '',
            namesStr = names + '',
            $programPopup = $('#programPopup');

        if ($.trim(idsStr) != '' && $.trim(names) != '') {
            var idsArr   = idsStr.indexOf(',') != -1 ? idsStr.split(',') : new Array(idsStr),
                namesArr = namesStr.indexOf(',') != -1 ? namesStr.split(',') : new Array(namesStr);

            var li_html = '';
            for (var i = 0; i < idsArr.length; i++) {
                li_html += '<li>' + namesArr[i] + '<a class="btn btn-to-star-home" href="javascript: void(0);">去看 Ta</a></li>';
            }

            $programPopup.find('.show-name').text(title);
            $programPopup.find('.star-list').html(li_html);
            $programPopup.show();
        }
    }

    // initProgramTimer
    function initProgramTimer(elem) {
        var $lis = $(elem).find('li'),
            lis_length = $lis.length;

        $lis.each(function(i) {
            var idx = $(this).index(),
                // current_time = +new Date() ,
                current_time = 1483181990000,
                start_time = $(this).data('startTime'),
                end_time = 0;

            if (i < lis_length - 1) { // 下一个节目的开始时间为当前节目的开始时间
                end_time = $($lis.get(i + 1)).data('startTime');
            } else { // 最后一个节目的结束时间为当前时间加五小时
                end_time = Number(new Date(start_time).getTime()) + 5 * 3600 * 1000;
            }

            //var programId = $(this).find('.btn-zan').data('programId');
            //console.log('program-' + $(this).find('.btn-zan').data('programId') + ': current_time = '+ (new Date(current_time)).format('yyyy-MM-dd hh:mm:ss')
            //    + ', start_time = ' + (new Date(start_time)).format('yyyy-MM-dd hh:mm:ss')
            //    + ', end_time = ' + (new Date(end_time)).format('yyyy-MM-dd hh:mm:ss'));

            // program timer
            $(this).find('.card-timer').timeCountDown({
                currentTime: (new Date(current_time)).format('yyyy-MM-dd hh:mm:ss'),
                startTime: (new Date(start_time)).format('yyyy-MM-dd hh:mm:ss'),
                endTime: (new Date(end_time)).format('yyyy-MM-dd hh:mm:ss'),

                activeStart: function() { // 节目未开始
                    //console.log(programId + ' 节目未开始');
                },
                activeCurrent: function(ele) { // 节目正在进行
                    //console.log(programId + ' 节目正在进行');

                    timeTagAnimation($(ele).siblings('span.time'), '当前节目');
                },
                activeFinish: function(ele, timer) { // 节目结束
                    //console.log(programId + ' 节目结束');
                    clearInterval(timer);

                    if (idx != lis_length - 1) {  // 非最后一个
                        $(ele).parents('li.show-card').css('margin-bottom', '50px').slideUp(900, function() {
                            if (idx < lis_length - 2) {
                                //$($lis.get(idx + 2)).css({'display': 'list-item', 'opacity': .3, 'margin-bottom': 0});
                                setTimeout(function(){
                                    $($lis.get(idx + 2)).css({'display': 'list-item', 'opacity': 1});
                                }, 600);
                            }
                            $(ele).parents('li.show-card').remove();
                        });
                    } else { // 最后一个节目
                        timeTagAnimation($(ele).siblings('span.time'), '已结束');
                    }
                },
                method: function() {}
            });
        });

        // time tag animation
        function timeTagAnimation(element, txt) {
            element.css('opacity', .4);
            setTimeout(function(){
                element.css('opacity', 1).text(txt);
            }, 900);
        }
    }
}

/**
 * initial dynamic area
 *
 * @param dynamicList
 *
 */
function initDynamicArea(dynamicList) {
    if (dynamicList && dynamicList.length > 0) {
        var dynamicList_html = '',
            dynamicList_li = '',
            dynamicType = '',
            $dynamicList = $('#dynamicList');

        dynamicList_html += '<div class="block-head"><img src="images/pic-bg-title.png" alt="Title"><span>跨年专栏</span></div>';
        dynamicList_html += '<div class="block-body block-dynamic-list"></div>';
        $dynamicList.html(dynamicList_html);

        for(var i = 0, len = dynamicList.length; i < len; i++){ // infoType：  1-资讯 , 0-视频 , 3-专题
            if (dynamicList[i].infoType == 0) { // 视频
                dynamicList_li += '<a class="dynamic-item dynamic-item-vl" href="javascript: toClient(1, \'' + dynamicList[i].id + '\');">';
                dynamicList_li += '<div class="item-image"><img src="' + dynamicList[i].titleImage + '"></div>';
                dynamicList_li += '<div class="item-title"><p>' + dynamicList[i].title + '</p></div>';
                dynamicList_li += '</a>';
            } else {
                dynamicType = dynamicList[i].infoType == 3 ? '9' : '2'; // infoType = 3 时为专题

                if (dynamicList[i].titleLayout == 1) { // 左图右文
                    dynamicList_li += '<a class="dynamic-item dynamic-item-pl" href="javascript: toClient(' + dynamicType + ', \'' + dynamicList[i].id + '\');">';
                    dynamicList_li += '<div class="item-image"><img src="' + dynamicList[i].titleImage + '"></div>';
                    dynamicList_li += '<div class="item-title"><p>' + dynamicList[i].title + '</p></div>';
                    dynamicList_li += '</a>';
                }
                if (dynamicList[i].titleLayout == 5) { // 上文下图
                    dynamicList_li += '<a class="dynamic-item dynamic-item-pd" href="javascript: toClient(' + dynamicType + ', \'' + dynamicList[i].id + '\');">';
                    dynamicList_li += '<div class="item-title"><p>' + dynamicList[i].title + '</p></div>';
                    dynamicList_li += '<div class="item-image"><img src="' + dynamicList[i].titleImage + '"></div>';
                    dynamicList_li += '</a>';
                }
            }
        }
        $dynamicList.find('.block-dynamic-list').html(dynamicList_li);

        if ($dynamicList.find('.dynamic-item').length >= 6) {
            $dynamicList.find('.block-dynamic-list').append('<a class="btn btn-show-more" href="info-list.html?v=' + (+new Date()) + '">查看更多</a>');
        }
    }
}

/**
 * to client
 *
 * @param type 类型（1-视频;2-资讯;3-直播;4-明星;5-晒图(预留);6-公益(预留);7-商城(预留);8-应援(预留);9-专题）
 * @param id 明星 id 或 资讯 id
 *
 */
function toClient(type, id) {
    // clientWebGotoNative({ type: type, id: id});
}

/**
 * get current time
 *
 * @param ajaxUrl
 *
 */
function getCurrentTime(ajaxUrl) {
    var currentTime = 0;
    $.ajax(ajaxUrl, {
        type: 'get',
        async: false,
        data: {},
        dataType: 'text',
        success: function(data) {
            currentTime = data;
            console.log(data);
        }
    });

    return currentTime;
}

/**
 * get tvs vote number
 *
 */
function getTvsVote() {
    $.get(tv_sns_url, {}, function(data){
        if (data) {
            //console.log('getTvsVote: ' + JSON.stringify(data));

            for(var k in data) {
                if (data.hasOwnProperty(k))
                    $('#tvsVote').find('p[data-tv-id="' + k + '"]').text(data[k]);
            }
            var voteANum = Number($('#voteANum').text()),
                voteBNum = Number($('#voteBNum').text());
            $('#progress').width(voteANum / (voteANum + voteBNum) * 100 + '%');
        } else {
            promptMsg('获取信息失败', 'center');
        }
    }, 'json');
}

/**
 * get programs vote number
 *
 */
function getProgramsVote() {
    $.get(program_sns_url, {}, function(data){
        if (data) {
            //console.log('getProgramsVote: ' + JSON.stringify(data));

            for (var k in data) {
                if (data.hasOwnProperty(k)) $('#program-' + k).text(data[k]);
            }
        } else {
            promptMsg('获取信息失败', 'center');
        }
    }, 'json');
}

/**
 * get programs vote number
 *
 * @param programIds
 *
 */
function getProgramsVoteByIds(programIds) {
    $.get(program_snses_url, {
        ids: programIds
    }, function(data){
        if (data) {
            //console.log('getProgramsVoteByIds: ' + JSON.stringify(data));
            for (var k in data) {
                if (data.hasOwnProperty(k)) $('#program-' + k).text(data[k]);
            }
        } else {
            promptMsg('获取信息失败', 'center');
        }
    }, 'json');
}

/**
 * vote tv
 *
 * @param id
 *
 */
function voteTV(id) {
    $.get(tv_vote_url, {
        tvId: id
    }, function(data){
        if (data && data.content && data.type == 'success') {
            console.log(data.content);
        }
    }, 'json');
}

/**
 * vote program
 *
 * @param tvId
 * @param programId
 *
 */
function voteProgram(tvId, programId) {
    $.get(program_vote_url, {
        tvId: tvId,
        programId: programId
    }, function(data){
        if (data && data.type && data.type == 'success') {
            console.log(data.content);
        } else {
            promptMsg('系统繁忙', 'center');
        }
    }, 'json');
}

/**
 * gift surprise tags
 *
 */
function giftSurpriseTags(){
	var tags = '';
	
	tags += '<div class="gift-surprise-wrap">'
        +       '<div class="gift-title"><img src="images/pic-title-2017.png" alt="2017"></div>'
		+	    '<div class="gift-wrapper">'
		+	        '<div class="image-wrap pic-gift-bg"><img src="images/pic-gift-bg.png" alt="Gift Background"></div>'
		+	        '<div class="image-wrap pic-gift"><img src="images/pic-gift.png" alt="Gift"></div>'
		+	        '<a id="openBtn" class="image-wrap" href="javascript: void(0);" onclick="openRedEnvelope(this)"><img src="images/pic-chai.png" alt="Chai"></a>'
		+	    '</div>'
		+	    '<div class="fireworks-wrapper">'
		+	        '<img class="fireworks1" src="images/pic-fireworks-1.png" alt="Fireworks">'
		+	        '<img class="fireworks2" src="images/pic-fireworks-2.png" alt="Fireworks">'
		+	        '<img class="fireworks3" src="images/pic-fireworks-3.png" alt="Fireworks">'
		+	        '<img class="fireworks4" src="images/pic-fireworks-4.png" alt="Fireworks">'
		+	        '<img class="fireworks5" src="images/pic-fireworks-5.png" alt="Fireworks">'
		+	    '</div>'
		+	    '<div class="rockets-wrapper">'
		+	        '<img class="rockets1" src="images/pic-rockets-1.png" alt="Rockets">'
		+	        '<img class="rockets2" src="images/pic-rockets-2.png" alt="Rockets">'
		+	        '<img class="rockets3" src="images/pic-rockets-3.png" alt="Rockets">'
		+	        '<img class="rockets4" src="images/pic-rockets-4.png" alt="Rockets">'
		+	        '<img class="rockets5" src="images/pic-rockets-5.png" alt="Rockets">'
		+	    '</div>'
		+	    '<div id="countdown" class="countdown-wrapper">'
		+	        '<div class="countdown-number" style="background-position-x: -' + ($(document).width() * .176 * 2) + 'px"></div>'
		+	        '<div class="image-wrap pic-buildings"><img src="images/pic-bg-buildings.png" alt="Buildings"></div>'
		+	        '<div class="image-wrap pic-light"><img src="images/pic-bg-light.png" alt="Light"></div>'
		+	    '</div>'
		+	    '<div class="ad-wrapper"><img src="images/pic-ad.png" alt="Ad"></div>'
		+	'</div>';
	return tags;
}

/**
 * gift animation
 *
 */
function playAnimation() {
	$('#giftSurprise').html(giftSurpriseTags()).show();
	
	var count = 2, $countdownNumber = $('.countdown-number');
    $('#countdown')
    		.animate({'bottom': '0'}, 400)
    		.animate({'bottom': '-5px'}, 160)
    		.animate({'bottom': '0'}, 160, function(){
    			
    	$countdownNumber.animate({opacity: 1}, 900, function(){
    			$(this).css('opacity', 0);
    		});
    	
		var countdown = setInterval(function(){
			count--;
			
			// countdown over
			if (count < 0) {
				clearInterval(countdown);
				
				$('.pic-light').animate({opacity: 1}, {
					duration: 1200,
					queue: false
				});
				$('.rockets1').animate({bottom: '40%'}, 600, function(){
					$(this).hide();
					$('.fireworks1').css({'visibility': 'visible'}).scale(.1).animate({rotate: '720deg', scale: '1'}, 720).fadeOut(280);
				});
				$('.rockets2').delay(80).animate({bottom: '58%'}, 920, function(){
					$(this).hide();
					$('.fireworks2').css({'visibility': 'visible'}).scale(.1).animate({rotate: '720deg', scale: '1'}, 720).fadeOut(280);
				});
				$('.rockets3').delay(120).animate({bottom: '58.4%'}, 920, function(){
					$(this).hide();
					$('.fireworks3').css({'visibility': 'visible'}).scale(.1).animate({rotate: '720deg', scale: '1'}, 720).fadeOut(280);
				});
				$('.rockets4').delay(520).animate({bottom: '68.5%'}, 920, function(){
					$(this).hide();
					$('.fireworks4').css({'visibility': 'visible'}).scale(.1).animate({rotate: '720deg', scale: '1'}, 720).fadeOut(280);
				});
				$('.rockets5').delay(680).animate({bottom: '75.2%'}, 920, function(){
					$(this).hide();
					$('.fireworks5').css({'visibility': 'visible'}).scale(.1).animate({rotate: '720deg', scale: '1'}, 720).fadeOut(280);
				});
				
				$('#countdown').delay(2500).fadeOut(600);
				$('.gift-title').delay(2900).animate({top: '8.4%'}, 500, 'swing');
				$('.gift-wrapper').delay(2900).animate({bottom: '35%'}, 500, 'swing');
				$('.ad-wrapper').delay(2900).animate({bottom: '10px'}, 500, 'swing');
			}
			
//			console.log('number_width = ' + $countdownNumber.width() + ' number_width * count = ' + $countdownNumber.width() * count);
			
			// countdown animation
			$countdownNumber
				.css('background-position-x', -($countdownNumber.width() * count) + 'px')
				.animate({opacity: 1}, 900, function(){
					$(this).css('opacity', 0);
				});
		}, 1000);
    });
}

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
            for(var i = 0 , len = arrTime.length; i < len ; i++) {
                tags += '<span class="numberTime vm">'+ arrTime[i] +'</span>';

                if (i != len - 1) {
                    if(i == 0) tags += '<span class="vm">天</span>';
                    else tags += '<span class="vm">:</span>';
                }
            }

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

/*
 * 调用分享
 */
function clientShare(){
	var data = { //分享参数
		type:'1',//1-图文,2-视频
		title:'有人在评论里@你',
		detail:'跨年准点抢红包，大礼全在你掌心，奖品再也跑不了',
		url:partyShareUrl || 'http://file.9zhiad.com/release/static/yaya/grab-gifts/share.html',
		img:partyShareImgUrl || 'http://images.9zhiad.com/9bc04c6c-d4b1-4ead-ab6f-26d34693f157.png',
		statistics:0,
		nativeShareBtn:1
	};
	clientShareOut(data);
}