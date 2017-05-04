$(function(){
    // initial page
    initPage();
    preloadImg([
        'images/icon-btn-rules-press.png',
        'images/icon-btn-run-press.png'
    ]);

    // button run on touch
    $('#run').on('touchstart', run_touch_start).on('touchend', run_touch_end);

    // button rules on touch
    $('#rules').on('touchstart', function(e){
        e.preventDefault();
        $(this).css('background-image', 'url(images/icon-btn-rules-press.png)');
    }).on('touchend', function(){
        $(this).css('background-image', 'url(images/icon-btn-rules.png)');

        var rules_offset_top = $('.rules').offset().top;
        $('html,body').animate({'scrollTop' : rules_offset_top}, 'slow');
    });

    // winner list scrolling
    new Swiper('.swiper-container', {
        direction: 'vertical',
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        autoplay: 3000,
        //autoplayDisableOnInteraction: false,
        touchEventsTarget: '.swiper-container',
        onlyExternal: true,
        followFinger: false,
        touchMoveStopPropagation: true
    });

    //var scrolling = function() {
    //    var $parent = $('.winner-list ul');
    //    var $first  = $parent.find('li:first');
    //    var height  = $first.height();
    //
    //    $first.animate({
    //        height: 0,
    //        opacity: 0
    //    }, 'fast', 'linear', function() {
    //        $first.css({'height': height, 'opacity': 1}).appendTo($parent);
    //    });
    //};
    //setInterval(function(){scrolling();}, 3000);

    // popup box close onclick
    $("a.close").on('touchstart', function(){
        $(this).parents('.popup-wrapper').hide();
    });

});

/**
 * initial page
 * */
function initPage() {
    var plate = $('#cjPlate');
    for (var i = 0; i < 36; i++) {
        if (i < 9) {
            plate.append('<span style="top: 1px; left: ' + (i % 9 == 0 ? 12 : (34 * (i % 9) + 12)) + 'px;"></span>');
        } else if (i >= 9 && i < 18) {
            plate.append('<span style="right: 1px; top: ' + (i % 9 == 0 ? 12 : (34 * (i % 9) + 12)) + 'px;"></span>');
        } else if (i >= 18 && i < 27) {
            plate.append('<span style="bottom: 1px; left: ' + (i % 9 == 0 ? 12 : (34 * (i % 9) + 12)) + 'px;"></span>');
        } else if (i >= 27 && i < 36) {
            plate.append('<span style="left: 1px; top: ' + (i % 9 == 0 ? 12 : (34 * (i % 9) + 12)) + 'px;"></span>');
        }
    }
}

// run touch start
function run_touch_start() {
    window.event.preventDefault();

    $(this).find('img').prop('src', 'images/icon-btn-run-press.png');
}

// run touch end
function run_touch_end() {
    $(this).find('img').prop('src', 'images/icon-btn-run.png');

    playGame(this, 4, 3);
}

// play game
function playGame(element, startIndex, endIndex) {
    // marquee run
    var i = 0, cjPlate = $('#cjPlate');
    var marqueeTimer = window.setInterval(function(){
        if (i % 2 == 0) {
            cjPlate.find('span:nth-child(2n)').css('background', '#f39365');
            cjPlate.find('span:nth-child(2n+1)').css('background', '#ffed7a');
        } else {
            cjPlate.find('span:nth-child(2n)').css('background', '#ffed7a');
            cjPlate.find('span:nth-child(2n+1)').css('background', '#f39365');
        }
        i++;
    }, 200);

    var loopTimes = 14, stepCount = startIndex, totalStep = loopTimes * 8 + endIndex;

    run(150);
    function run(duration) {
        var gameTimer = setInterval(function(){
            //console.log('stepCount = ' + stepCount);
            $(element).off('touchstart', run_touch_start).off('touchend', run_touch_end);

            if (stepCount >= 16 && stepCount < 96) {
                clearInterval(gameTimer);
                run(50);
            }
            if (stepCount >= 96 && stepCount < totalStep) {
                clearInterval(gameTimer);
                run(200);
            }
            if (stepCount >= totalStep) {
                clearInterval(gameTimer);
                clearInterval(marqueeTimer);

                setTimeout(function(){
                    $('#winning').show();

                    $(element).on('touchstart', run_touch_start).on('touchend', run_touch_end);
                }, 400);
            }

            var idx   = stepCount % 8;
            var prize = cjPlate.children('ul').find('.prize' + idx);
            $(prize).addClass('active');
            $('.prize').not(prize).removeClass('active');

            stepCount++;
        }, duration);
    }
}

// images preload
function preloadImg(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}
