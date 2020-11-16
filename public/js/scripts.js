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

var i =1;
$('.add').click(function(){
  var add_id = $(this).attr('id');
  console.log("add_id:",add_id);

  $('#modal_field'+add_id).find('#dynamic_table'+i).remove();

  i++;
  let html = '<table id="dynamic_table'+i+'"><tr id="comments'+i+'" class="comments'+i+'"><td><textarea name="comments" class="form-control comments note" placeholder="Comments Here"></textarea></td>';
  html += '<td><button type="button" name="remove_comment" id="'+i+'" class="btn btn-danger btn_remove">X</button></td>';
  html += '<td><button type="submit" id="'+i+'" class="btn btn-info btn_save">&#10003;</button></td>';
  html += '<tr><td><input type="file" class="filer btn btn-warning" name="image" id="image'+i+'" style="width:199px;"></td></tr></table>';
  $('#modal_field'+add_id).append(html);
  autosize(document.getElementsByClassName("note"));

  $(".comments"+i)[0].scrollIntoView({
    behavior: "smooth", // or "auto" or "instant"
    block: "center" // or "end"
  });

});

$(document).on('click','.btn_remove',function(){
  let remove_id = $(this).attr('id');
  $('#dynamic_table'+remove_id).remove();
});

$(document).on('click','.btn_save',function(){
  $('#loading').show();
  var button_id = $(this).attr('id');
  var table_id = $(this).parents('.modal_field').attr('id');
  var comments_data = $('#'+table_id).find('#comments'+button_id).find('.comments').val();
  var returnval = false;
  var data_comments = {comments: comments_data};
  var form_data = $('#'+table_id).parents("form.comments_form").serialize();

  var file_data = $('#image'+button_id).prop('files')[0];
  var fd = new FormData();
  fd.append('file', file_data);
if(document.getElementById('image'+button_id).files.length == 0)
{
      $('#'+table_id).append('<tr><td><input type="hidden" class="image_status" name="image_status" id="image_status" value="pass"></td></tr>');
      console.log('$("#image_status").val():::::',$("#image_status").val());
}
else {
  $('#'+table_id).append('<tr><td><input type="hidden" class="image_status" name="image_status" id="image_status" value="passelse"></td></tr>');
  console.log('$("#image_status").val():::::',$("#image_status").val());
}

  if(comments_data == "Skip This Condition"){
    alert("Please Fill The COmments!");
    $('#loading').hide();
    return false;
  }
  else {
     $('#loading').hide();
   }
});
