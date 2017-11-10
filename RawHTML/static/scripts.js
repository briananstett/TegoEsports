$( document ).ready(function() {
    
    $( ".cross" ).hide();
    $( ".menu" ).hide();
    $( ".hamburger" ).click(function() {
    $(".hamburger").css("pointer-events", "none");
    $( ".menu" ).slideToggle( "slow", function() {
    $(".cross").css("pointer-events", "auto");
    $( ".hamburger" ).hide();
    $( ".cross" ).show();
    });
    });
    
    $( ".cross" ).click(function() {
    $(".cross").css("pointer-events", "none");
    $( ".menu" ).slideToggle( "slow", function() {
    $( ".cross" ).hide();
    $( ".hamburger" ).show();
    $(".hamburger").css("pointer-events", "auto");
    });
    });
    });

  

   
    // $(".hamburger").css("pointer-events", "none");
    // $(".cross").css("pointer-events", "auto");
    // $(".hamburger").css("pointer-events", "auto");


    // $(".hamburger").prop("disabled", true);
    // $(".hamburger").prop("disabled", false);
    // $(".cross").prop("disabled", true);
    // $(".cross").prop("disabled", false);