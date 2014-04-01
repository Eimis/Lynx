$(document).ready(function(){

    $(".subjects").hide();
    $(".topics").hide();


    $(".subjectsButton").click(function() {
        $(".subjects").toggle("slide", {direction: "up"});
    });

    $(".small").click(function() {
        $(this).children(".topics").toggle("slide", {direction: "up"});
    });

})