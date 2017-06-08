$(function(){
    $('#searchBtn').click(function(){
        $('#searchResult').toggle();
    });

    $('#curTab').on('touchend', function(){
        $(this).addClass('active');
        $('#totTab').removeClass('active');
        $('#currentRank').show();
        $('#totalRank').hide();
    });

    $('#totTab').on('touchend', function(){
        $(this).addClass('active');
        $('#curTab').removeClass('active');
        $('#currentRank').hide();
        $('#totalRank').show();
    });

    $('#sptBtn').on('touchend', function(){
        $(this).css('background', '#999').off('touchend');
        $('#tips').show();
    });

    $('a.support').on('touchend', function(){
        $(this).css('background', '#999').off('touchend');
    });

    $('#curTab, #totTab, a.support').on('touchmove', function(e){
        e.preventDefault();
    });
});