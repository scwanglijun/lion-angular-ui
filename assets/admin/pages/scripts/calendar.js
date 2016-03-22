var Calendar = function() {
	

    return {
        //main function to initiate the module
        init: function() {
            Calendar.initCalendar();
        },
        formatDate: function(d){
    		var ret=d.getFullYear()+"-"     
    		ret+=("00"+(d.getMonth()+1)).slice(-2)+"-"
    		ret+=("00"+d.getDate()).slice(-2)    
    		return ret;  

        },
        formatTime:function(d){
        	 var ret=("00"+d.getHours()).slice(-2)+":"     
        	 ret+=("00"+d.getMinutes()).slice(-2)
        	 return ret;
        },
        isElemOverDiv :function(draggedItem, dropArea) {
        	var a = $(draggedItem).offset;	
        	a.right = $(draggedItem).outerWidth + a.left;
        	a.bottom = $(draggedItem).outerHeight + a.top;
        	
        	var b = $(dropArea).offset;
        	a.right = $(dropArea).outerWidth + b.left;
        	a.bottom = $(dropArea).outerHeight + b.top;

        	// Compare
        	if (a.left >= b.left
        		&& a.top >= b.top
        		&& a.right <= b.right
        		&& a.bottom <= b.bottom) { return true; }
        	return false;
		},
        initCalendar: function() {

            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            if (Metronic.isRTL()) {
                if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        right: 'title, prev, next',
                        center: '',
                        left: 'agendaDay, agendaWeek, month, today'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        right: 'title',
                        center: '',
                        left: 'agendaDay, agendaWeek, month, today, prev,next'
                    };
                }
            } else {
                if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        left: 'title, prev, next',
                        center: '',
                        right: 'today,month,agendaWeek,agendaDay'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        left: 'title',
                        center: '',
                        right: 'prev,next,today,month,agendaWeek,agendaDay'
                    };
                }
            }
            
            $('#external-events div.external-event').each(function() {
                initDrag($(this));
            });
            
            $('#calendar').fullCalendar('destroy'); // destroy the calendar
            
            $('#calendar').fullCalendar({ //re-initialize the calendar
                header: h,
                dateFormat: 'yyyy-mm-dd',
                timeFormat:'H:mm',
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                today: ["今天"],
                defaultView: 'month', // change default view with available options from http://arshaw.com/fullcalendar/docs/views/Available_Views/ 
                buttonText: {
                	 today: '本月',
                	 month: '月',
                	 week: '周',
                	 day: '日'
                },
                editable:true,
                slotMinutes: 15,
                events: 'list.json',
                dayClick: function(date, allDay, jsEvent, view) {
                	$('#sysCalendarForm').reset();
                	$('.modal-footer span').hide();
                	var seldate = Calendar.formatDate(new Date(date));
                	$('#basic').modal();
                    $('#basic').find('.modal-header h4 span').text('新建事件');
                    $('#startDate').val(seldate);
                    $('#endDate').val(seldate);
                    return;
                },
                eventClick: function(calEvent, jsEvent, view) {
                	$('#sysCalendarForm').reset();
                	$('.modal-footer span').show();
                	$('#basic').modal();
                    $('#basic').find('.modal-header h4 span').text('编辑事件');
                    $('#id').val(calEvent.id);
                    $('#event').val(calEvent.title);
                    var startDate = Calendar.formatDate(new Date(calEvent.start._i));
                    var startTime = Calendar.formatTime(new Date(calEvent.start._i));
                    var endDate = Calendar.formatDate(new Date(calEvent.end._i));
                    var endTime = Calendar.formatTime(new Date(calEvent.end._i));
                    $('#startDate').val(startDate);
                    $('#starttimepicker').val(startTime);
                    $('#endDate').val(endDate);
                    $('#endtimepicker').val(endTime);
                    if(startTime != '00:00'){
                    	$('#isallday').attr('checked',false)
                    }
                    if($('#isallday').attr('checked')=='checked'){
             		   $("div[name='timepicker']").css('display','none');
             	   }else{
             		   $("div[name='timepicker']").css('display','block');
             	   }
                   return;
                }
            });

        }

    };

}();
