$(document).ready(function() {
  $('#open-menu').on('click', function() {
       $('.overlay').addClass('open');
  });   
  $('.closed-menu').on('click', function() {
    $('.overlay').removeClass('open');
  });
});