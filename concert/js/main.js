/**
 * Created by sean on 2017/5/4.
 */
new Swiper('#timeLine', {
    //centeredSlides: true,
    slidesPerView: 'auto',
    //spaceBetween: 10,
    freeMode: true
});

var dynamicInfoList = $('#dynamicInfo').find('.dynamic-info-item');
if (dynamicInfoList.size() == 1) {
    new Swiper('#dynamicInfo', {
        direction: 'vertical',
        touchEventsTarget: '.swiper-container',
        followFinger: false,
        touchMoveStopPropagation: true
    });
} else {
    new Swiper('#dynamicInfo', {
        direction: 'vertical',
        touchEventsTarget: '.swiper-container',
        onlyExternal: true,
        followFinger: false,
        touchMoveStopPropagation: true,
        loop: true,
        //onAutoplay: function(swiper){
        //    console.log(swiper.width);
        //},
        autoplay: 4000
    });
}

new Swiper('#starVideo', {
    loop: true,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    spaceBetween: 10,
    preloadImages: false,
    lazyLoading: true
});

new Swiper('#reviewVideo', {
    //centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 10,
    freeMode: true,
    preloadImages: false,
    lazyLoading: true
});

$(function(){
    var length = 0, topMargin = 0, zoomFactor = 0,
        screenWidth = $(window).width(),
        $img = $('.sky-carousel .sky-carousel-container li img');

    if (screenWidth <= 333) {
        length = 144;
        topMargin = 20;
        zoomFactor = 0.56;
        $img.css({'width': length + 'px', 'height': length + 'px'});
    } else if (screenWidth > 333 && screenWidth < 360) {
        length = 168;
        $img.css({'width': length + 'px', 'height': length + 'px'});
    } else if (screenWidth > 379 && screenWidth <= 414) {
        length = 200;
        topMargin = 40;
        zoomFactor = 0.56;
        $img.css({'width': length + 'px', 'height': length + 'px'});
    } else {
        length = 180;
        topMargin = 30;
        zoomFactor = 0.54;
        $img.css({'width': length + 'px', 'height': length + 'px'});
    }
    //console.log('screenWidth = ' + screenWidth);

    var skyCarousel = $('.sky-carousel').carousel({
        itemWidth: length,
        itemHeight: length,
        distance: 6,
        startIndex: 'auto',
        enableMouseWheel: false,
        //autoSlideshow: true,
        //autoSlideshowDelay: 3600,
        //loop: true,
        selectedItemDistance: 0,
        selectedItemZoomFactor: 1,
        unselectedItemZoomFactor: zoomFactor || 0.56,
        unselectedItemAlpha: 1,
        motionStartDistance: 200,
        topMargin: topMargin,
        slideSpeed: 0.2,
        showPreloader: true,
        navigationButtonsVisible: false,
        gradientOverlayVisible: false,
        selectByClick: false
    });

    //skyCarousel.select(3, 5);
    skyCarousel.on('itemSelected.sc', function(evt) {
        //console.log(evt.item.index(), 'itemSelected');

        initStarLineup();
    });
    //skyCarousel.on('closestItemChanged.sc', function(evt) {
    //    console.log(evt.item.index(), 'closestItemChanged');
    //});
    //skyCarousel.on("selectionAnimationStart.sc", function(e){
    //    console.log(e.item.index(), "selectionAnimationStart");
    //});
    //skyCarousel.on("selectionAnimationEnd.sc", function(e){
    //    console.log(e.item.index(), "selectionAnimationEnd");
    //});

    // 初始化明星阵容样式
    initStarLineup();

    // 多行文本省略号
    $('.dynamic-info-item').dotdotdot({watch: 'window'});
    $('#starVideo').find("p").dotdotdot({watch: 'window'});

    // 初始化时间轴
    var item_w = 66, item_last_w = 46, init_offset_x = item_w * 2;
    var offset_x = 0,
        $timeLine = $('.time-line'),
        item_wrap_w = $timeLine.width(),
        //init_offset_x = item_wrap_w / 2,
        item_active_offset_x = $timeLine.find('li.active').position().left,
        item_last_offset_x   = $timeLine.find('li:last-child').position().left,
        item_last_third_offset_x   = $timeLine.find('li:last-child').prev().prev().position().left;

    //console.log(item_wrap_w, item_active_offset_x, item_last_offset_x, item_last_third_offset_x);

    if (item_active_offset_x > init_offset_x) {
        if (item_active_offset_x < item_last_third_offset_x) {
            offset_x = item_active_offset_x - init_offset_x;
        } else {
            offset_x = item_last_third_offset_x - (item_wrap_w - item_w * 2 - item_last_w);
        }

        //console.log('offset_x = ' + offset_x);

        //$timeLine.css({"transform": "translate3d(" + (-offset_x) + "px, 0px, 0px)"});

        $('.time-line').animate({
            'opacity': offset_x
        }, {
            step: function (now, fx) {
                $(this).css({"transform": "translate3d(" + (-now) + "px, 0px, 0px)"});
            },
            duration: 600,
            easing: 'swing',
            queue: false,
            complete: function () {}
        });
    }
});

// 初始化明星阵容样式
function initStarLineup (){
    var $skyCarousel = $('.sky-carousel-container'),
        star_selected = $skyCarousel.find('li.sc-selected');
    $skyCarousel.find('li').css('visibility', 'hidden');
    star_selected.css('visibility', 'visible');
    star_selected.prev().css('visibility', 'visible');
    star_selected.next().css('visibility', 'visible');
}