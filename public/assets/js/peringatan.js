$(document).ready(function() {
    
    // Memberikan Skorsing
    $('.start-skorsing').datepicker({
        templates: {
            leftArrow: '<i class="fa fa-chevron-left"></i>',
            rightArrow: '<i class="fa fa-chevron-right"></i>'
        },
        format: "yyyy-mm-dd",
        // startDate: new Date(),
        startDate: moment().add(0, 'days').toDate(),
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true,
        disableTouchKeyboard: true,
        orientation: "bottom auto"
    });
    
    $('.end-skorsing').datepicker({
        templates: {
            leftArrow: '<i class="fa fa-chevron-left"></i>',
            rightArrow: '<i class="fa fa-chevron-right"></i>'
        },
        format: "yyyy-mm-dd",
        startDate: moment().add(0, 'days').toDate(),
        // endDate: '+2w',
        // datesDisabled: '+2w',
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true,
        disableTouchKeyboard: true,
        orientation: "bottom auto"
    
    });
    
    
    $('.start-skorsing').datepicker().on("changeDate", function () {
        var startDate = $('.start-skorsing').datepicker('getDate');
        var oneDayFromStartDate = moment(startDate).add(0, 'days').toDate();
        $('.end-skorsing').datepicker('setStartDate', oneDayFromStartDate);
        $('.end-skorsing').datepicker('setDate', oneDayFromStartDate);
    });
    
    $('.end-skorsing').datepicker().on("show", function () {
        var startDate = $('.start-skorsing').datepicker('getDate');
        $('.day.disabled').filter(function (index) {
        return $(this).text() === moment(startDate).format('D');
        }).addClass('active');
    });
    
})