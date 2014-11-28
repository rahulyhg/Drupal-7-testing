(function($){
  $(document).ready(function() {
    $('a.colorbox-load').click(function(event){
      var pid = $(this).parent('div').attr('id');
      localStorage.setItem('pid', pid);
    });
    console.log("js working before any div");

//   $('#mon-snack-1 a[rel="open_ajax"]').live('click', function(e){
//     // prevent default behaviour
//     e.preventDefault();

//    // var url = $(this).attr('href'); 

//     $.ajax({
//         type: 'GET',
//         url: 'http://192.168.2.17/cleanaddicts/testing-for-ajax',
//         dataType: 'html',
//         cache: true,
//         beforeSend: function() {
//             $('#cboxLoadedContent').empty();
//             $('#cboxLoadingGraphic').show();
//         },
//         complete: function() {
//             $('#cboxLoadingGraphic').hide();
//         },
//         success: function(data) {                  
//             $('#cboxLoadedContent').append(data);
//         }
//     });
// });

});

})(jQuery);