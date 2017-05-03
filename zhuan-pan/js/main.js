$(function(){
    // preload images
    //preloadImg([
        //'images/pic-bg-btn-press.png',
    //]);

    // button run on touch
    //$(".turnplate").rotate(720);
    //$('#run').on('tap', playGame);

    // button rules on touch
    $('#rules').on('tap', function(){
        var rules_offset_top = $('.rules').offset().top;
        $('html,body').animate({'scrollTop' : rules_offset_top}, 'slow');
    });

    // winner list scrolling
    new Swiper('.swiper-container', {
        direction: 'vertical',
        spaceBetween: 0,
        centeredSlides: true,
        touchEventsTarget: '.swiper-container',
        onlyExternal: true,
        followFinger: false,
        touchMoveStopPropagation: true,
        loop: true,
        autoplay: 3000
    });

    // popup box close onclick
    $("a.close").on('tap', function(){
        $(this).parents('.popup-wrapper').hide();
    });
});

// run touch end
var initAngle = 0;
function playGame() {
    var self = $(this);

    var i = 0, light = $('#cjPlate').find('.light');
    var marqueeTimer = window.setInterval(function(){
        if (i % 2 == 0) {
            light.addClass('light-active');
        } else {
            light.removeClass('light-active');
        }
        i++;
    }, 300);

    var randomNum = getRandomIntInclusive(0, 5);
    console.log(randomNum);
    $(".turnplate").rotate({
        duration: 12000,
        //duration: 7200,
        angle: initAngle,
        center: ["50%", "50%"],
        animateTo: 60 + 360 * 21 - 60 * randomNum,
        easing: $.easing.easeOutCirc,
        //animateTo: 60 + 360 * 23 - 60 * randomNum,
        //easing: $.easing.easeOutBack,
        //animateTo: 60 + 360 * 23 - 60 * randomNum,
        //easing: $.easing.easeInOutSine,
        callback: function() {
            clearInterval(marqueeTimer);
            initAngle = 60 - 60 * randomNum;
            console.log('initAngle = ' + initAngle);

            setTimeout(function(){
                $('#winning').show();
                $(self).on('tap', playGame);
            }, 1000);
        }
    });
    $(this).off('tap', playGame);
}

function preloadImg(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}