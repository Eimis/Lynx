$(document).ready(function(){






    $(".subjectsButton").click(function() {
        $(".subjects").toggle("slide", {direction: "up"});
    });

    $(".small").children(".topics").hide()


    $(".small").click(function() {
        $(this).children(".topics").toggle("slide", {direction: "up"});
    });

    $(".username").click(function(e) { //no 'slide' when submitting 'editlive'
        e.stopPropagation();
    });

    $(".deleteSubjectIcon").click(function(e) { //no 'slide' when deleting 'subject'
        e.stopPropagation();
    });

    $(".deleteSubjectIcon").click(function(e) { //no 'slide' when deleting 'subject'
        $(this).parents(".small").animate(
                        {
                            'margin-left':'1000px'
                            // to move it towards the right and, probably, off-screen.
                        },1000,
                        function(){
                            $(this).slideUp('fast');
                            // once it's finished moving to the right, just 
                            // removes the the element from the display, you could use
                            // `remove()` instead, or whatever.
                        }
                        );
    });



    $(".small").on('click','button', function(e) { // no 'slide' when submitting 'editlive'
        e.stopPropagation();
    });

    
$('.new_subject_button').prop('disabled', true);

    $('.new_subject_form').blur(function()
    {
        if( !$(this).val() ) {
          $('.new_subject_button').prop('disabled', true);
        }
        else{
            $('.new_subject_button').prop('disabled', false);
        }
  });


    $(".new_subject_button").click(function() {
        $(".new_subject_form").submit();
    });

    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'popup'; 

    
    //make username editable
    $('.username').editable({
    	type: 'text',
    	pk: 1,
    	url: '/post',
    });

    $('#username2').editable({
    	type: 'text',
    	pk: 2,
    	url: '/post',
    });

    $('.edit').click(function(e){    
       e.stopPropagation();
       $('.topicEditable').editable('toggle');
});
    




})

