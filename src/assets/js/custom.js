$(function() {

var array = getColombiaHolidaysByYear(2021);
console.log("festivos");
console.log(array);
  $('#customDate').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901
  }, function(start, end, label) {
  });

  $('#customDate2').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901
  }, function(start, end, label) {
  });

  $('#customDate2').data('daterangepicker').setStartDate('12/05/2021');
  $('#customDate2').data('daterangepicker').setEndDate('12/05/2021');
});

