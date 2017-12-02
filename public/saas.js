console.log("here");
$(function(){
    
    $(".srv_option_row_flexRow #dots").click(function () {
        
        $(this).parents(".srv_option_row_flexRow").next().slideToggle(); 
    });
})

$(document).ready(function(){
    $("#srv_add_button").click(function (){
        $("#srv_create_new").animate({width: 'toggle'}, function(){$(this).focus();});
    })
    $("#srv_create_next").click(function(){
        $("#srv_create_new").animate({width: 'toggle'}, function(){$(this).focus();});   
    })
})
