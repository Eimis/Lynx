$(document).ready(function(){

    $('.usernameInput').focus(function(){  
        $(this).parent().prev().addClass('fa-envelope-white'); /* login box focus */
    })

    $('.passwordInput').focus(function(){  
        $(this).prev().addClass('fa-envelope-white');
    })

     // hide boxes
    $(".regwrap").children().hide();
    $(".fogwrap").children().hide();



    $(".fa-plus-circle").click(function(){
    	$(".logwrap").children().fadeOut("fast", function(){
    		$(".regwrap").children().fadeIn("fast")
    	});
    })

    $(".fa-arrow-circle-right").click(function(){
    	$(".regwrap").children().fadeOut("fast", function(){
                $(".logwrap").children().fadeIn("fast");
            
    	});
    })





    $('.button').click(function () {
        $('.logForm').submit();
    });

    $('.regButton').click(function () {
        $('.regForm').submit();
    });


    

});