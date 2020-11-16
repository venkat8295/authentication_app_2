
$(document).ready(function(){
  $('#dob').datepicker({
      minDate: new Date(1900,1-1,1), maxDate: '-18Y',
      dateFormat: 'dd/mm/yy',
      defaultDate: new Date(1970,1-1,1),
      changeMonth: true,
      changeYear: true,
      yearRange: '-110:-18',
      beforeShow: function () {
          setTimeout(function () {
              $('.ui-datepicker').css('z-index', 99999999999999);
          }, 0);
      }
  });
  /*
  dateFormat: 'mm-dd-yy',
  changeMonth: true,
  changeYear: true,
  yearRange: '-115:-10',
  minDate: '-115y',
  maxDate: '-10y',
  */
  $("#mobile").on("blur", function(){
        var mobNum = $(this).val();
        var filter = /^\d*(?:\.\d{1,2})?$/;

          if (filter.test(mobNum)) {
            if(mobNum.length==10){
                  //alert("valid");
             } else {
                alert('Please put 10  digit mobile number')
                return false;
              }
            }
            else {
              alert('Not a valid number');
              return false;
           }

  });

});
