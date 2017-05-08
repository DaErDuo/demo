$(function(){
	var pageNo = 0;
	appendDynamicList(pageNo);
	
	$(document).on('scroll',function(){
		var dh = $(this).height();
		var wh = window.innerHeight || document.body.clientHeight;
		var st = $(this).scrollTop();
		if(dh - wh - st == 0){
			pageNo++;
			appendDynamicList(pageNo);
		}	
	});
});

function appendDynamicList(idx) {
	$.get(baseUrl + '/h5/interaction/content/infolist', {
		pageNo: idx
	}, function(data){
		if (data && data.code == 1) {
			var dynamicList = data.listInfoParty;
			if (dynamicList && dynamicList.length > 0) {
	            var dynamicList_html = '',
	                dynamicList_li = '',
	                dynamicType = '',
	                $dynamicList = $('#dynamicList');

	            for(var i = 0; i < dynamicList.length; i++){
	                if (dynamicList[i].contentType == 1) { // 视频
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
	            $dynamicList.append(dynamicList_li);
	        }
		}
	}, 'json');
}

function toClient(type, id) {
    clientWebGotoNative({
    	type: type, 
    	id: id
    });
}