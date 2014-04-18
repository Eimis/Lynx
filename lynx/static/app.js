

// Django stuff
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }
          }
        }
        return cookieValue;
      }
      var csrftoken = getCookie('csrftoken');

      function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
    (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
      }
      $.ajaxSetup({
        beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        }
      });

// My JS:

/** for the future:
$(document).ready(function(){
  $("textarea").mouseenter(function(){
    $("textarea").fadeTo("fast", 0.6)
  })
  $("textarea").mouseleave(function(){
    $("textarea").fadeTo("fast", 1)
  })
});**/

// update (submit) existing topic / lecture:
$(document).ready(function(event){

  $(".mygt").click(function(){
        serializedData = $("form").serialize(); // to simple Jquery string object
        $.ajax({
          url: "/app/",
          type: "post",
          data: serializedData,
          success: console.log("Updated!")
        })
        event.preventDefault();
      });
});


/*!
  SerializeJSON jQuery plugin.
  https://github.com/marioizquierdo/jquery.serializeJSON
  version 1.1.1 (Feb 16, 2014)

  Copyright (c) 2012 Mario Izquierdo
  Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
  and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
  */
  (function ($) {
    "use strict";

    $.fn.serializeJSON = function () {
      var obj, formAsArray;
      obj = {};
      formAsArray = this.serializeArray();

      $.each(formAsArray, function (i, input) {
        var name, value, keys;
        name = input.name;
        value = input.value;

      // Split the input name in programatically readable keys
      // name = "foo"              => keys = ['foo']
      // name = "[foo]"            => keys = ['foo']
      // name = "foo[inn][bar]"    => keys = ['foo', 'inn', 'bar']
      // name = "foo[inn][arr][0]" => keys = ['foo', 'inn', 'arr', '0']
      // name = "arr[][val]"       => keys = ['arr', '', 'val']
      keys = $.map(name.split('['), function (key) {
        var last;
        last = key[key.length - 1];
        return last === ']' ? key.substring(0, key.length - 1) : key;
      });
      if (keys[0] === '') { keys.shift(); } // "[foo][inn]" should be same as "foo[inn]"

      // Set value in the object using the keys
      $.deepSet(obj, keys, value);
    });
      return obj;
    };

  // Auxiliar function to check if a variable is an Object
  var isObject = function (obj) {
    return obj === Object(obj);
  };

  // Auxiliar function to check if a variable is a valid Array index
  var isValidArrayIndex = function(val){
    return /^[0-9]+$/.test(String(val));
  };

  /**
  Access the object in a deep key and assigns the value:

  // Examples:
  deepSet(obj, ['foo'], v)                //=> obj['foo'] = v
  deepSet(obj, ['foo', 'inn'], v)         //=> obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
  deepSet(obj, ['foo', 'inn', 'inn'], v)  //=> obj['foo']['inn']['inn'] = v
  deepSet(obj, ['0'], v)                  //=> obj[0] = v // obj may be an Array
  deepSet(obj, [''], v)                   //=> obj.push(v) // assume obj as array, and add a new value to the end
  deepSet(obj, ['arr', '0'], v)           //=> obj['arr']['0'] = v // obj['arr'] is created as Array if needed
  deepSet(obj, ['arr', ''], v)            //=> obj['arr'].push(v)
  deepSet(obj, ['foo', 'arr', '0'], v)    //=> obj['foo']['arr'][0] = v // obj['foo'] is created as object and obj['foo']['arr'] as a Array, if needed
  deepSet(obj, ['arr', '0', 'foo'], v)    //=> obj['arr']['0']['foo'] = v // obj['foo'] is created as object and obj['foo']['arr'] as a Array and obj['foo']['arr'][0] as object, if needed

  // Complex example with array empty index,
  // it creates a new element, unless there is a nested non repeated key, so it assigns to the last element object:
  var arr = []
  deepSet(arr, [''], v)                   //=> arr === [v]
  deepSet(arr, ['', 'foo'], v)            //=> arr === [v, {foo: v}]
  deepSet(arr, ['', 'bar'], v)            //=> arr === [v, {foo: v, bar: v}]
  deepSet(arr, ['', 'bar'], v)            //=> arr === [v, {foo: v, bar: v}, {bar: v}]
  */
  $.deepSet = function (obj, keys, value) {
    var key, nextKey, tail, objectOrArray, lastKey, lastElement;

    if (!keys || keys.length === 0) { throw new Error("ArgumentError: keys param expected to be an array with least one key"); }
    key = keys[0];

    if (keys.length == 1) { // only one key, then it's not a deepSet, just assign the value.
      if (key === '') {
        obj.push(value); // empty key is used to add values to the array
      } else {
        obj[key] = value; // other keys can be used as array indexes or object keys
      }

    } else { // more keys menas a deepSet. Apply recursively

      nextKey = keys[1];

      // Empty key is used to add values to the array => merge next keys in the object element.
      if (key === '') {
        lastKey = obj.length - 1;
        lastElement = obj[obj.length - 1];
        if (isObject(lastElement) && !lastElement[nextKey]) { // if nextKey is a new attribute in the last object element then set the new value in there.
          key = lastKey;
        } else { // if the array does not have an object as last element, create one.
          obj.push({});
          key = lastKey + 1;
        }
      }

      // obj[key] defaults to Object or Array, depending on the next key
      if (obj[key] === undefined) {
        if (nextKey === '' || isValidArrayIndex(nextKey)) { // if is '', 1, 2, 3 ... then use an Array
          obj[key] = [];
        } else { // if is something else, use an Object
          obj[key] = {};
        }
      }

      // Recursively access the inner Object
      tail = keys.slice(1);
      $.deepSet(obj[key], tail, value);
    }

  };

}(jQuery));


// Lynx app js:

//remove static topic - edit existing static summary - internl


$(document).ready(function(){



  $('.topic_pk').hide()
  $('.summary_pk').hide()

  // saving static Topics
  $(".topicTextarea").bindWithDelay("keypress keydown", function(){
    var domain = $(document).find('.domain').text()
    var subject = $(document).find('.subjectName').text()
    var topicTextarea = $(this)
    serializedData = topicTextarea.serialize();
    var topicPk = parseInt(topicTextarea.parents('.wtf').find('.topic_pk').text())
    $.ajax({
    url: domain + 'app/save_topic/' + subject + '/' + topicPk + '/',
    type: "post",
    data: serializedData,
    csrfmiddlewaretoken:'{{ csrf_token }}',
    success: console.log('Saved static topic')
  })
    }, 1000, true);

  // saving static Summaries
  $(".summaryTextarea").bindWithDelay("keypress keydown", function(){
    var domain = $(document).find('.domain').text()
    var subject = $(document).find('.subjectName').text()
    var summaryTextarea = $(this)
    serializedData = summaryTextarea.serialize();
    var summaryPk = parseInt(summaryTextarea.parents('.summary').find('.summary_pk').text())
    console.log(summaryPk)
    $.ajax({
    url: domain + 'app/save_summary/' + subject + '/' + summaryPk + '/',
    type: "post",
    data: serializedData,
    csrfmiddlewaretoken:'{{ csrf_token }}',
    success: console.log('Saved static summary')
  })
    }, 1000, true);







  $(document).on('click', '.buttons', function(e){
    e.preventDefault();
  })

  // get topic count of Subject
  var subject = $(document).find('.subjectName').text()
  var domain = $(document).find('.domain').text()
  $.ajax({
    url: domain + 'app/' + subject + '/topic_count',
    type: "get",
    success: function(responseData) {
      var topicCount = responseData.topicCount;
      $(".topicCount").html("Topics: " + topicCount)
    }
  })

  $(function() {
   $('a[rel=tipsy]').tipsy({fade: true, gravity: 'n'});
 });

  $('.removeTopic').first().attr('title', "You can't remove initial topic")
  $('.removeTopic').first().tipsy();
  $('.share').tipsy({gravity: 'ne'});
  $('.export').tipsy({gravity: 'ne'});
  $('.removeTopic').first().parent().attr('href', '#');



  $(document).on('click', '.addNew', function(event){ // TODO - increment Topics number at the top / laikas
    event.preventDefault();
    var button = $(this);
    var token = document.getElementById('csrf_token').value;
    var domain = $(document).find('.domain').text()
    var subject = $(document).find('.subjectName').text()
    var lastSummaryPk = $('.buttons:last').find('a').attr('href').match(/(\d+)/)[1];
    dynamicSummaryPk = parseInt(lastSummaryPk) + 1
    //alert(subject);
    $.ajax({
      url: domain + 'app/' + subject + '/new_dynamic',
      type: "get",
      success: function(responseData) {
        var dynamic_topic_id = responseData.dynamic_topic_id;
        var dynamic_summary_id = responseData.dynamic_summary_id;
        var subject = $(document).find('.subjectName').text()
        var topicCount = responseData.topicCount;
        var topicDate = responseData.serialized_datetime;
        var topic = "<form>" + token + "<div class='dynamic'><div class='topic'><div class='expanding-wrapper' style='position:relative'><div class ='topic_pk'>" + dynamic_topic_id + "</div><textarea class='topicTextarea dynExpanding dynamicTopic' cols='40' id='animated' name='Topic' rows='1' style='margin: 0px; box-sizing: border-box; width: 100%; position: absolute; top: 0px; left: 0px; height: 100%; resize: none;'>New topic</textarea><pre class='expanding-clone' style='margin: 0px; box-sizing: border-box; width: 100%; display: none; border-width: 8px 0px 0px; border-style: solid; visibility: hidden; min-height: 50px; white-space: pre-wrap; line-height: 35.71428680419922px; text-decoration: none; letter-spacing: 0px; font-size: 25px; font-family: Arimo; font-style: normal; font-weight: 400; text-transform: none; text-align: center; direction: ltr; word-spacing: 0px; word-wrap: break-word; word-break: normal; padding: 2px; max-height: none;'><span>History topic 3</span><br></pre></div><input id='id_form-2-id' name='form-2-id' type='hidden' value='19'><div class='buttons'><a href='/app/remove_summary/" + dynamic_summary_id + "'><div class='custom_button white removeSummary removeDynamicSummary'><i class='fa fa-times deleteSubjectIcon'></i>Remove just this summary</div></a><a href='/app/remove_topic/" + subject + "/" + dynamic_topic_id + " '><div class='custom_button white removeTopic dynamicTopicButton' title='Remove topic'><i class='fa fa-times deleteSubjectIcon'></i>Remove topic</div></a></div></div>"
        var summary = "<div class='summaryContainer'><div class='summaryWrap'><p class='topicDate'>" + topicDate + "</p><!--<input type='submit' value='Submit' class='mygt' /><a href='/app/remove_topic/19'><p class='remove_topic'>Remove topic</p></a>--><br><div class='summary'><div class='expanding-wrapper' style='position:relative'><div class='summary_pk'>" + dynamic_summary_id + "</div><textarea class='summaryTextarea dynExpanding dynamicSummary' cols='40' id='animated' name='Summary' rows='1' style='margin: 0px; box-sizing: border-box; width: 100%; position: absolute; top: 0px; left: 0px; height: 100%; resize: none;'>New summary</textarea><pre class='expanding-clone' style='margin: 0px; box-sizing: border-box; width: 100%; display: block; border: 0px solid; visibility: hidden; min-height: 41px; white-space: pre-wrap; line-height: 37px; text-decoration: none; letter-spacing: 0px; font-size: 18px; font-family: Actor; font-style: normal; font-weight: 400; text-transform: none; text-align: start; direction: ltr; word-spacing: 0px; word-wrap: break-word; word-break: normal; padding: 2px 18px; max-height: none;'><span>History summary 3</span><br></pre></div><input id='id_form-2-id' name='form-2-id' type='hidden' value='19'></div><br></div></div>" + "</div></form>"


        $('<div class="hiddenDiv" style="display:none">' + topic + summary + '</div>').appendTo('.editor').slideDown("slow");

        $(".dynExpanding").expanding();

        $(".topicCount").html("Topics: " + topicCount)

        $('.topic_pk').hide()
        $('.summary_pk').hide()

        // saving dynamic Summaries
        var dynamicSummary = $(document).find('.dynamicSummary:last')

        dynamicSummary.bindWithDelay("keypress keydown", function(){

          var domain = $(document).find('.domain').text()
          var subject = $(document).find('.subjectName').text()
          serializedData = dynamicSummary.serialize();
          var summaryPk = parseInt(dynamicSummary.parents('.summary').find('.summary_pk').text())
          console.log(summaryPk)

          $.ajax({
            url: domain + 'app/save_summary/' + subject + '/' + summaryPk + '/',
            type: "post",
            data: serializedData,
            csrfmiddlewaretoken:'{{ csrf_token }}',
            success: console.log('Saved dynamic summary')
          })
        }, 500, true);

         // saving dynamic Topics
        var dynamicTopic = $(document).find('.dynamicTopic:last')

        dynamicTopic.bindWithDelay("keypress keydown", function(){

          var domain = $(document).find('.domain').text()
          var subject = $(document).find('.subjectName').text()
          serializedData = dynamicTopic.serialize();
          var topicPk = parseInt(dynamicTopic.parents('.topic').find('.topic_pk').text())
          console.log(topicPk)

          $.ajax({
            url: domain + 'app/save_topic/' + subject + '/' + topicPk + '/',
            type: "post",
            data: serializedData,
            csrfmiddlewaretoken:'{{ csrf_token }}',
            success: console.log('Saved dynamic topic')
          })
        }, 500, true);

      } // end success
    }) // end ajax



})


    //removing dynamic summaries:
    $(document).on('click', '.removeDynamicSummary', function(event){
      var button = $(this)
      var link = $(button).parent().attr("href") // TODO: mygtukas gi bus kitur
      $.ajax({
        url: link,
        type: "get",
        success: console.log('Removed dynamic summary')
      })
      event.preventDefault();
      var $txtarea = $(this).parents(".topic").next().find('textarea');
      var content = "Start summarizing lecture here . . .";
      $txtarea.val(content);
      $txtarea.effect("highlight", {color: "rgba(66, 139, 202, 0.4"}, 1500);
    })


    // Removing dynamic topics:
    $("html").on('click', '.dynamicTopicButton', function(event){
      var $removeButton = $(this) //remove_summary button
      var link = $($removeButton).parent().attr("href")
      $.ajax({
        url: link,
        type: "get",
        success: function(responseData) {
          var topicCount = responseData.topicCount;
          $(".topicCount").html("Topics: " + topicCount)
          $(".topicCount").html("Topics: " + topicCount)
        }
      })
      event.preventDefault();

      if ($removeButton.parents('.hiddenDiv').prev().is('form')){ // if static
        var $txtarea = $removeButton.parents(".hiddenDiv").find('.summaryTextarea').val();
        var $prevtxtarea = $removeButton.parents('.editor').find('.static').find('.summaryTextarea:last');
        $prevtxtarea.val($prevtxtarea.val() + "\n" + $txtarea).change().effect("highlight", {color: "rgba(66, 139, 202, 0.4"}, 1500);
         $(this).parents('.hiddenDiv').fadeOut("slow", function() { $(this).remove(); });  

       }
      else{ // if dynamic
        var $txtarea = $removeButton.parents(".hiddenDiv").find('.summaryTextarea').val();
        var $prevtxtarea = $removeButton.parents('.hiddenDiv').prev().find('.summaryTextarea');
        //alert($prevtxtarea.val()); // before
        $prevtxtarea.val($prevtxtarea.val() + "\n" + $txtarea).change().effect("highlight", {color: "rgba(66, 139, 202, 0.4"}, 1500);
          $(this).parents('.hiddenDiv').fadeOut("slow", function() { $(this).remove(); });

        }



      });



    // Removing static topics:
    $(".removeTopic").click(function(event){
      var $removeButton = $(this)
      var link = $($removeButton).parent().attr("href")
      $.ajax({
        url: link,
        type: "get",
        success: function(responseData) {
          var topicCount = responseData.topicCount;
          $(".topicCount").html("Topics: " + topicCount)
        }
      })
      event.preventDefault();

      var $txtarea = $(this).parents(".topic").next().find('textarea').val();
      var $prevtxtarea = $(this).parents('form').prev().find('.summaryTextarea');

      //alert($prevtxtarea.val()); // val be4 change

      $prevtxtarea.val($prevtxtarea.val() + "\n" + $txtarea).change().effect("highlight", {color: "rgba(66, 139, 202, 0.4"}, 1500);

      //alert($prevtxtarea.val()); // val after change
      
      $(this).parents('.topic').next().fadeOut("slow", function() { $(this).hide(); }); //remove
      $(this).parents('.topic').fadeOut("slow", function() { $(this).hide(); }); //remove

    });


    $('.removeTopic').first().off('click'); // initial Topic



    // Removing static summaries:
    $(".removeSummary").click(function(event){
      event.preventDefault();
      var $removeButton = $(this) //remove_summary button
      var link = $($removeButton).parent().attr("href") // TODO: mygtukas gi bus kitur
      $.ajax({
        url: link,
        type: "get",
        success: console.log("Removed summary!")
      })
      event.preventDefault();
      var $txtarea = $(this).parents(".topic").next().find('textarea');
      var content = "Start summarizing lecture here . . .";
      $txtarea.val(content);
      $txtarea.effect("highlight", {color: "rgba(66, 139, 202, 0.4"}, 1500);
    })

  });

