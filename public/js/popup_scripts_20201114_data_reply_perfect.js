$('.view').click(function(){
  var id = $(this).attr('data-attr');
  var main_data = $('#div_field'+id).html();
  console.log("main_data::::",main_data);
  $.dialog({
    title: 'Comments!',
    content: '<form class="form-signin comments_form">'+main_data+'</form>',
    //autoClose: 'cancelAction|2000',
    backgroundDismiss: true,
    boxWidth: '35%',
    boxHeight: '200px',
    useBootstrap: false,
    closeIcon: true,
    animation: 'scale',
    //closeIcon: true,
    type: 'blue',
    onContentReady: function(){
    }
  });
});


// For reply

var button_reply_id="";
var j =1;
var mouse_id = "";
$('.reply_get').click(function(){
  let reply_id = $(this).attr('data-attr');
  mouse_id = reply_id;
  console.log("reply_id:",reply_id);

  $('#dynamic_field'+reply_id).find('#reply'+j).remove();
  $('#dynamic_field'+reply_id).find('#image_reply'+j).remove();

  var comments_name_hidden = $("#comments_name_hidden"+reply_id).val();
  console.log("comments_name_hidden:",comments_name_hidden);

  j++;
  let html = '<tr id="reply'+j+'" class="reply'+j+'"><td><textarea name="reply" class="form-control reply_textarea note" placeholder="Reply Here">@'+comments_name_hidden+'</textarea></td>';
  html += '<td><button type="button" name="remove_comment" id="reply_remove'+j+'" data-attr="'+j+'" class="btn btn-danger reply_remove">X</button></td>';
  html += '<td><button type="button" id="reply_save'+j+'" data-attr="'+j+'" class="btn btn-info reply_save">&#10003;</button></td></tr>';
  html += '<tr><td><input type="file" class="image_reply filer btn btn-warning" name="image_reply" id="image_reply'+j+'" style="width:199px;"></td></tr>';

  $('#tr'+reply_id).append(html);
  autosize(document.getElementsByClassName("note"));

  $("#image_reply"+j)[0].scrollIntoView({
    behavior: "smooth", // or "auto" or "instant"
    block: "center" // or "end"
  });

});

$(document).on('click','.reply_remove',function(){
  button_id = $(this).attr('data-attr');
  $('#reply'+button_id).remove();
  $('#image_reply'+button_id).remove();
});

$(document).on('click','.reply_save',function(){
  $('#loading').show();
  let button_id1 = $(this).attr('data-attr');
  let table_id1 = $(this).parents('.dynamic_field').attr('id');
  console.log("Button ID2",button_id1);
  console.log("table_id1:",table_id1);

  let comments_data1 = $('#'+table_id1).find('#reply'+button_id1).find('.reply_textarea').val();

  let returnval1 = false;
  console.log("comments_data1:",comments_data1);
  let data_comments1 = {comments: comments_data1};
  let form_data1 = $('#'+table_id1).parents("form.comments_form").serialize();
  let form_fetch = $('#'+table_id1).parents("form.comments_form").attr('id');

  console.log("button_id::::",button_id1);
  let file_data = $('#image_reply'+button_id1).prop('files')[0];
  let fd = new FormData();
  fd.append('file', file_data);

  if(comments_data1 == "Skip This Condition"){
    alert("Please Fill The COmments!");
    $('#loading').hide();
    return false;
  }
  else {

  let image_status = $("#image_status").val();
  let comments_name_hidden1 = $("#comments_name_hidden"+mouse_id).val();
  let comments_data_hidden1 = $("#comments_data_hidden"+mouse_id).val();
  let comments_image_name_hidden1 = $("#comments_image_name_hidden"+mouse_id).val();
  let comments_email_hidden1 = $("#comments_email_hidden"+mouse_id).val();
  let id_user1 = $('#'+form_fetch).find("input[name=id_user]").val();
  let username1 = $('#'+form_fetch).find("input[name=username]").val();
  let email1 = $('#'+form_fetch).find("input[name=email]").val();
  let username_comments1 = $('#'+form_fetch).find("input[name=username_comments]").val();
  let email_comments1 = $('#'+form_fetch).find("input[name=email_comments1]").val();
  let name1 = $('#'+form_fetch).find("input[name=name]").val();
  let desc1 = $('#'+form_fetch).find("input[name=desc]").val();
  let file_name1 = $('#'+form_fetch).find("input[name=file_name]").val();
  let reply = $('#'+form_fetch).find("textarea[name=reply]").val();
  let comments = true;
  let post_id_hidden = $("#post_id_hidden"+mouse_id).val();
  let comments_id_hidden = $("#comments_id_hidden"+mouse_id).val();

var data = {comments_data_hidden1:comments_data_hidden1,comments_name_hidden1:comments_name_hidden1,comments_image_name_hidden1:comments_image_name_hidden1,
  comments_email_hidden1:comments_email_hidden1,reply:reply,id_user1:id_user1,username1:username1,
  email1:email1,username_comments1:username_comments1,email_comments1:email_comments1,name1:name1,desc1:desc1,file_name1:file_name1,
  comments:comments,post_id_hidden:post_id_hidden,comments_id_hidden:comments_id_hidden};

  console.log("mouse_id:::",mouse_id);
  console.log("table_id1::::",table_id1);
  console.log("comments_image_hidden1:::",comments_data_hidden1);

  $.ajax({
    type: 'POST',
    async:false,
    url: '/users/dashboard',
    //data: JSON.stringify(data),
    data: JSON.stringify(data),
    //contentType: 'application/json; charset=utf-8',
    success: function(data){
      //do something with the data via front-end framework
      console.log("Comment Ajax Reply Success!");
      console.log("data",data.data);
      location.reload();
  },
  error: function(e) {
    console.log(e);
  },
  dataType: "json",
  contentType: "application/json"
  });
  return false;

  $('#loading').hide();

 }
});
