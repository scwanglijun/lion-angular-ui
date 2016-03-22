/**
 * Created by jovi on 1/12/16.
 */
$(function(){
    $('#dropdownMenu').click(function(){
        $('#dropdownContent').slideToggle();
    });
    $('.item').click(function(){
        $('#dropdownContent').slideUp('fast');
        var itemTxt = $(this).find('span').html();
        $('#dropdownMenu span').eq(0).html(itemTxt);
    });
});