

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
$(document).ready(function(){
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


//Dynamically add new forms:

$(document).ready(function(){

    // auto height:
    jQuery('textarea').elastic();
    jQuery('textarea').trigger('update');

    // adding new forms
    $("#add").click(function() {
      var intId = $("#buildyourform div").length + 1;
      var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + intId + "\"/><br>");
        var $staticSummaryPk = $(this).parent().find('a').last().attr("href").match(/(\d+)/)[1]; // previous static Summary's PK
        var $dynamicSummaryPk = parseInt($staticSummaryPk, 10) + 1

        // Adding 2 new forms:
        var topic = $( '<form action = "#" method = "POST" name="new_topic" class="new_topic">'+ document.getElementById('csrf_token').value +
          '<textarea id ="1" name="name" maxlength="1000" cols="25" rows="6" id="new_form"></textarea>' +
          '<br>' + 
          '<input type="submit" value="Submit" class="newMygt" />' + 
          '</form>' +
          '<br>' +
          '<a href="/app/remove_topic/' + $dynamicSummaryPk + '">' + 
          '<p class="remove_dyn_topic">Remove dynamic topic</p>' + 
          '</a>'
          );


        var summary = $('<br>' + 
          '<form action = "#" method = "POST" name="new_summary" class="new_summary">'+ document.getElementById('csrf_token').value +
          '<textarea id="2" name="content" maxlength="1000" cols="25" rows="6" id="new_form" class="new_dyn_summary"></textarea>' + 
          '<br>' + 
          '<input type="submit" value="Submit" class="newMygt" />' + 
          '</form>' + 
          '<br>' + 
          '<a href="/app/remove_summary/' + $dynamicSummaryPk + '">' + 
          '<p class="remove_dyn_summary">Remove dynamic summary</p>' + 
          '</a>'
          );
        

        (topic).appendTo(fieldWrapper).show('slow'); // TODO
        (summary).appendTo(fieldWrapper).show('slow');
        $("#buildyourform").append(fieldWrapper);


      });

    // submitting the new forms via Ajax:
    $('#buildyourform').on('submit', 'form', function() {
      var $submittedForm = $(this);
      var $forms = $submittedForm.parents('.fieldwrapper').find('form');
      var serializedForm = $forms.serializeJSON();
      var json = JSON.stringify(serializedForm);
      event.preventDefault();
      $.ajax({
        url: "/app/new/",
        type: "post",
        data: json,
        contentType:"application/json; charset=utf-8", 
        success: console.log("Submitted!")
      })
    });

    // Removing static summaries:
    $(".remove_summary").click(function(){
      var $removeButton = $(this) //remove_summary button
      var link = $($removeButton).parent().attr("href") // TODO: mygtukas gi bus kitur
      $.ajax({
        url: link,
        type: "get",
        success: console.log("Removed summary!")
      })
      event.preventDefault();

      var $txtarea = $(this).parent().prevAll(".summary").find('textarea');
      var content = "The lecturer is talking about something else? You can start summarizing current topic here.";
      $txtarea.val(content);
    });

    // Removing dynamically summaries:
    $('#buildyourform').on('click', '.remove_dyn_summary', function() {
      var $removeButton = $(this) //remove_summary button
      var link = $($removeButton).parent().attr("href") // TODO: mygtukas gi bus kitur
      $.ajax({
        url: link,
        type: "get",
        success: console.log("Removed summary!")
      })
      event.preventDefault();
    });

    $(document).on('click','#buildyourform:last p.remove_dyn_summary', function() {
      var $txtarea = $(this).parent().prev().prev().children('textarea.new_dyn_summary'); // why?
      var content = "The lecturer is talking about something else? You can start summarizing current topic here.";
      $txtarea.val(content);
    });

    // Removing static topics:
    $(".remove_topic").click(function(){
      var $removeButton = $(this) //remove_summary button
      var link = $($removeButton).parent().attr("href") // TODO: mygtukas gi bus kitur
      $.ajax({
        url: link,
        type: "get",
        success: console.log("Removed topic!")
      })
      event.preventDefault();

      $(this).parent().prevAll(".topic:first").hide("slow")
      $(this).parent().nextAll(".summary:first").hide("slow")
    });

    
    

   
});