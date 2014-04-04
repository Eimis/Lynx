$(document).ready(function(){

    
    $('.forgotButton').click(function () {
        $('.forgotForm').submit();
    });

    $('#id_email').focus(function(){  
    	$(this).parent().prev().addClass('fa-envelope-white'); /* login box focus */
    })

    $('#id_new_password1').focus(function(){  
    	$(this).parent().prev().addClass('fa-key-white'); /* login box focus */
    })

    $('#id_new_password2').focus(function(){  
    	$(this).prev().addClass('fa-key-white'); /* login box focus */
    })
    


});