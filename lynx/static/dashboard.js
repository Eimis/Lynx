$(document).ready(function(){

    $('.errors').hide()

  $('.pic').tipsy({gravity: 'n'});

    $(".subjectsButton").click(function() {
        $(".subjects").toggle("slide", {direction: "up"});
    });

    $(".small").next(".topics").hide()

    $(".small").click(function() {
        $(this).next(".topics").toggle("slide", {direction: "up"});
    });

    $(".subject_editable").click(function(e) { //no 'slide' when submitting 'editlive'
        e.stopPropagation();
    });

    $(".topics").click(function(e) { //no 'slide' when submitting 'editlive'
        e.stopPropagation();
    });


    //make username editable
    $('.subject_editable').editable({
        highlight: 'rgba(66, 139, 202, 0.6)',
        validate: function(value) {
            if($.trim(value) == '') {
                return 'This field is required';
            }
        }
    });

    $('.topicEditable').editable({
        highlight: 'rgba(66, 139, 202, 0.6)',
        validate: function(value) {
            if($.trim(value) == '') {
                return 'This field is required';
            }
        }
    });

    $('.edit').click(function(e){    
       e.stopPropagation();
       e.preventDefault()
     $(this).parents('tr').find('.topicEditable').editable('toggle');
    });


    $(".deleteSubjectIcon").click(function(e) { // remove subject
        var $deleteSubjectIcon = $(this);
        var link = $(this).prev().children("a").last().attr("href")
        var number = parseInt($(document).find('.subjectCount').text(), 10);


      e.stopPropagation(); /* do not slide down */
      $('#myModal2').modal('show');
      $('.removeSubject').click(function(event){
            event.preventDefault();
        
        $('#myModal2').modal('hide');
            $.ajax({
                url: link,
                type: "get",
                success: console.log("Removed subject from dashboard. Link: " + link)
            })

            $(function () {
            $deleteSubjectIcon.parents(".small").animate(
            {
                'margin-left':'1000px', duration: 1000, queue: false,
                            // to move it towards the right and, probably, off-screen.
                        },
                        function(){
                            $(this).slideUp('fast');
                            // once it's finished moving to the right, just 
                            // removes the the element from the display, you could use
                            // `remove()` instead, or whatever.
                        }
            );

            $deleteSubjectIcon.parents(".small").next('.topics').animate(
            {
                'margin-left':'1000px', duration: 1000, queue: false,
                            // to move it towards the right and, probably, off-screen.
                        },
                        function(){
                            $(this).slideUp('fast');
                            // once it's finished moving to the right, just 
                            // removes the the element from the display, you could use
                            // `remove()` instead, or whatever.
                        }
            );

        });

            $(".subjectCount").html(number - 1)
        })

    });

    $(".delete").click(function(e) { // remove topic
        e.stopPropagation(); /* do not slide down */
        $(this).parents("tr").fadeOut("slow");
        var link = $(this).parent().attr("href");
        $.ajax({
                url: link,
                type: "get",
                success: console.log("Removed topic from dashboard. Link: " + link)
            })
        e.preventDefault();
    });



    $(".small").on('click','button', function(e) { // no 'slide' when submitting 'editlive'
        e.stopPropagation();
        var newLink = $(this).parents(".small").find(".input-sm").val().toLowerCase().replace(/ /g, '-');;
        var domain = $(document).find(".errors").text()
        var oldLink = $(this).parents(".editable-popup").next().find("a");

        $(oldLink).attr("href", domain + "app/" + newLink)
        console.log("Replaced")
    });

    $(".small").on('click','.popover-title', function(e) { // no 'slide' when clicking 'editlive'
        e.stopPropagation();
    });

    $(".small").on('click','.input-sm', function(e) { // no 'slide' when clicking 'editlive'
        e.stopPropagation();
    });

    $(".table_topics").on('click','.input-large', function(e) { // no 'slide' when clicking 'editlive'
        e.stopPropagation();
    });

    $(".table_topics").on('click','div', function(e) { // no 'slide' when clicking 'editlive'
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

    
    

    $('#username2').editable({ //testing
    	type: 'text',
    	pk: 2,
    	url: '/post',
    });




    

// { highlight: 'rgba(66, 139, 202, 0.6)'}


})

