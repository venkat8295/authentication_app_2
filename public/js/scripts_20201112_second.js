$('#loading').hide();
$(document).ready(function(){
  autosize(document.getElementsByClassName("note"));
});
$('#post_image_button').on('click',function(){
  $(".post_image").show(1000);
  $(".hide_post").show(1000);
});
$('.hide_post').click(function(){
  $('.post_image').hide(1000);
  $(".hide_post").hide(1000);
});

$('.append_commenter').append('.commenter');

var button_id="";
var i =1;
$('.add').click(function(){
  var add_id = $(this).attr('id');
  //console.log("add_id:",add_id);
  i++;
  let html = '</br><tr id="comments'+i+'"><td><textarea name="comments" class="form-control comments note" placeholder="Comments Here"></textarea></td>';
  html += '<td><button type="button" name="remove_comment" id="'+i+'" class="btn btn-danger btn_remove">X</button></td>';
  html += '<td><button type="submit" id="'+i+'" class="btn btn-info btn_save">&#10003;</button></td>';
  html += '<tr><td><input type="file" class="filer btn btn-warning" name="image" id="image'+i+'" style="width:199px;"></td></tr>';
  $('#dynamic_field'+add_id).append(html);
  autosize(document.getElementsByClassName("note"));
});

$(document).on('click','.btn_remove',function(){
  button_id = $(this).attr('id');
  $('#comments'+button_id).remove();
  $('#image'+button_id).remove();
});

$(document).on('click','.btn_save',function(){
  $('#loading').show();
  var button_id = $(this).attr('id');
  var table_id = $(this).parents('.dynamic_field').attr('id');
  //console.log("table_id:",table_id);
  var comments_data = $('#'+table_id).find('#comments'+button_id).find('.comments').val();
  var returnval = false;
  //console.log("comments_data:",comments_data);
  var data_comments = {comments: comments_data};
  var form_data = $('#'+table_id).parents("form.comments_form").serialize();

  var file_data = $('#image'+button_id).prop('files')[0];
  var fd = new FormData();
  fd.append('file', file_data);
if(document.getElementById('image'+button_id).files.length == 0)
{
  //alert("123");
      $('#'+table_id).append('<tr><td><input type="hidden" class="image_status" name="image_status" id="image_status" value="pass"></td></tr>');
      console.log('$("#image_status").val():::::',$("#image_status").val());
      //return false;
}
else {
  //alert("else");
  //return false;
  $('#'+table_id).append('<tr><td><input type="hidden" class="image_status" name="image_status" id="image_status" value="passelse"></td></tr>');
  console.log('$("#image_status").val():::::',$("#image_status").val());
}

  if(comments_data == "Skip This Condition"){
    alert("Please Fill The COmments!");
    $('#loading').hide();
    return false;
  }
  else {

  var image_status = $("#image_status").val();

  $.ajax({
    type: 'POST',
    async:false,
    url: '/users/dashboard',
    //data: JSON.stringify(data),
    data: {image_status:image_status,fd:fd},
    //contentType: 'application/json; charset=utf-8',
  /*  success: function(data){
      //do something with the data via front-end framework
      location.reload();
    }*/
  });
  return false;
  $(document)
    .ajaxStart(function () {
       //ajax request went so show the loading image
      //  $('#loading').show();
    })
  .ajaxStop(function () {
      //got response so hide the loading image
       //$('#loading').hide();
   });

     $('#loading').hide();

}
});
    //Attach the event handler to any element

  /*  var id_user = $('#'+table_id).find(".id_user").val();
    var username = $('#'+table_id).find(".username").val();
    var email = $('#'+table_id).find(".email").val();
    var username_comments = $('#'+table_id).find(".username_comments").val();
    var email_comments = $('#'+table_id).find(".email_comments").val();
    var name = $('#'+table_id).find(".name").val();
    var desc = $('#'+table_id).find(".desc").val();
    var file_name = $('#'+table_id).find(".file_name").val();
    var comments = $('#'+table_id).find(".note").val();

    var data = {id_user:id_user,username:username,email:email,username_comments:username_comments,email_comments:email_comments,name:name,desc:desc,file_name:file_name,comments:comments};
    //data.param1 = words[0];
*/


/*
var username = "";
$.getJSON( "username.json", function(result) {
  console.log( "success",result.username);
  username = result.username;
})
  .done(function(data) {
    console.log( "second success",data.username);
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );
  });

  console.log('username:',username);
var characterTemplate = $("#character-template").html();
var compiled_character_Template = Handlebars.compile(characterTemplate);
$('character-list-container').html(compiled_character_Template({name:username}));
console.log("compiled_character_template:",compiled_character_Template({name:username}));

    var item = $('form input');
    var todo = {item: item.val()};

    $.ajax({
      type: 'GET',
      url: '/users/dashboard',
      data: todo,
      success: function(data){
        //do something with the data via front-end framework
        location.reload();
      }
    });
*/
