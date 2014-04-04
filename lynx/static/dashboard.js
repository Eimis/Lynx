$(document).ready(function(){

    


    $(".subjectsButton").click(function() {
        $(".subjects").toggle("slide", {direction: "up"});
    });

//    $(".small").click(function() {
//        $(this).children(".topics").toggle("slide", {direction: "up"});
//    });

    $(".new_subject_button").click(function() {
        $(".new_subject_form").submit();
    });

    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'popup';     
    
    //make username editable
    $('#username').editable({
    	type: 'text',
    	pk: 1,
    	url: '/post',
    	title: 'Enter username'
    });

    $('#username2').editable({
    	type: 'text',
    	pk: 2,
    	url: '/post',
    	title: 'Enter username'
    });
    
   	


})