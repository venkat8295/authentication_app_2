$('.view').click(function(){
  var id = $(this).attr('data-attr');
  var main_data = $('#dynamic_field'+id).html();
  console.log("main_data::::",main_data);
  $.dialog({
    title: 'Comments!',
    content: '<form class="form-signin comments_form">'+main_data+'</form>',
    //autoClose: 'cancelAction|2000',
    backgroundDismiss: true,
    boxWidth: '30%',
    boxHeight: '200px',
    useBootstrap: false,
    closeIcon: true,
    animation: 'scale',
    //closeIcon: true,
    type: 'blue',
    onContentReady: function(){
    }
    /*,
    buttons: {
      submit:{
        text: 'Test It',
        btnClass: 'btn-blue',
        action: function(){
  $.alert("Worked!");
        }
      }
    }*/
  });
});

/*
$('.add').click(function(){
  var id = $(this).attr('id');
  var main_data = $('#dynamic_field'+id).html();
  console.log("main_data::::",main_data);
  console.log("id::::",id);
  $.dialog({
    title: 'Comments! &nbsp <button type="click" class="btn btn-success adder" id="adder" name="adder">+</button>',
    content:  '<form class="form-signin comments_form" action="/users/dashboard" method="POST" id="comments_form'+id+'" enctype="multipart/form-data">'+main_data+'</form>',
    //autoClose: 'cancelAction|2000',
    backgroundDismiss: true,
    boxWidth: '40%',
    boxHeight: '200px',
    useBootstrap: false,
    closeIcon: true,
    animation: 'scale',
    //closeIcon: true,
    type: 'blue',
    onContentReady: function(){

      var button_id="";
      var i =1;
      var x;
      $('.adder').click(function(){
        //var add_id = $(this).attr('id');
        //x = $('#dynamic_field'+id).detach();
        var add_id = id;
        //console.log("add_id:",add_id);
        i++;
        let html = '</br><tr id="comments'+i+'"><td><textarea name="comments" class="form-control comments note" placeholder="Comments Here"></textarea></td>';
        html += '<td><button type="button" name="remove_comment" id="'+i+'" class="btn btn-danger btn_remove">X</button></td>';
        html += '<td><button type="submit" id="'+i+'" class="btn btn-info btn_save">&#10003;</button></td>';
        html += '<tr><td><input type="file" class="filer btn btn-warning" name="image" id="image'+i+'" style="width:199px;"></td></tr>';
        $('.dynamic_field'+add_id).append(html);
        autosize(document.getElementsByClassName("note"));
      });

      $('.jconfirm-closeIcon').click(function(){
        //$.alert("Worked!");
        //$("comments_form"+id).prepend(x);
      });

    },
    buttons: {
      text: 'Auto Close',
      cancelAction: function () {
        $.alert("Worked!");
      }
    }
  });
});
*/
