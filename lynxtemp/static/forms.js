



// add new forms for topics / summaries

$(document).ready(function() {
    $("#add").click(function() {
        var intId = $("#buildyourform div").length + 1;
        var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + intId + "\"/><br>");
        var topic = $( '<form action = "#" method = "POST" name="new_form" id="new_form">'+ document.getElementById('csrf_token').value +
                      '<textarea  name="name" maxlength="1000" cols="25" rows="6" id="new_form"></textarea>'+
                      '<br><input type="submit" value="Submit" class="newMygt" />');


        var summary = $('<form action = "#" method = "POST" name="new_form" id="new_form">'+ document.getElementById('csrf_token').value +
                        '<textarea  name="content" maxlength="1000" cols="25" rows="6" id="new_form"></textarea>'+
                        '<br><input type="submit" value="Submit" class="newMygt" />');
        

        (topic).appendTo(fieldWrapper).show('slow');
        (summary).appendTo(fieldWrapper).show('slow');
        $("#buildyourform").append(fieldWrapper);
    });
    
});

// csrf problemos nebera, bet reikia prevent default ir papostina data tik pagal mygtuka (1 / 2)
