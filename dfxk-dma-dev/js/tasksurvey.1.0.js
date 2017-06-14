;(function($){
	var time = new Date(),
		years = time.getFullYear();
		mounth = time.getMonth()+1,
		today = time.getDate();
	mounth = mounth<10?'0'+mounth:mounth;
	today = today<10?'0'+today:today;
	var groupId,
		fatherName = '全国',
		view = {
		'temp':function(data){
			return ['<div class="g_consh" id="xs_content">',
				'<p class="district_title">'+data.title+'</p>',
				'<div class="g_total"><span>总线索量</span>',
					'<p id="zxsl" class="g_sl">'+data.CueQuantityCount+'</p>',
				'</div>',
				'<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">转化率'+view.math(data.TaskQuantityCount,data.CueQuantityCount)+'</span></div>',
				'<div class="g_total g_total_f marginTop0"><span>总任务量</span>',
					'<p id="yxxsl">'+data.TaskQuantityCount+'</p>',
				'</div>',
				'<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">转化率'+view.math(data.AssignedCount,data.TaskQuantityCount)+'</span></div>',
				'<div class="g_total g_total_e marginTop0"><span>已分配量</span>',
					'<p id="yyddl">'+data.AssignedCount+'</p>',
				'</div>',
				'<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">转化率'+view.math(data.FollowUpTasksCount,data.AssignedCount)+'</span></div>',
				'<div class="g_total g_total_d marginTop0"><span>已跟进量</span>',
					'<p id="ddcjl">'+data.FollowUpTasksCount+'</p>',
				'</div>',
			'</div>',].join('');
		},
		pushHtml:function(firstData,list){
			firstData.title = fatherName;
			list.unshift(firstData);
			var html = '';
			for(var el in list){
				html += view.temp(list[el]);
			}
			$('#yjzb_content').html(html);
		},
		math:function(num,total){
			num = parseFloat(num); 
			total = parseFloat(total); 
			if (isNaN(num) || isNaN(total)) { 
			return "-"; 
			} 
			return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%"); 
		}
	}
	function getDate(data,callback){
		common.loading('show');
		$.ajax({
			type: "post",
			url: common._url+"appapi/TaskProfile",
			data:data,
			dataType: 'jsonp',
			cache: false,
			jsonp: 'callback',
			success: function(res) {
				common.loading('hide');
				if(res.code == 200){
					if(callback){
						callback(res);
					}
				}
			}
		})
		common.jsonpError();
	}
	var dataReload = function(timeRange){
		getDate(timeRange,function(res){
			var data = res.data;
			groupId = res.userInfo.userInfo.groupId;
			if(groupId == 28){
				fatherName = res.userInfo.userInfo.fatherName;
			}
			view.pushHtml(data.Map,data.NextList);
		});
	}
	dataReload({
		beginTime:weekTimeFilter(new Date())['initDate'],
		endTime:weekTimeFilter(new Date())['finalDate']
	});
	$('.m_nav').on('click','.tab_btn',function(){
		$(this).addClass('tishi').siblings().removeClass('tishi');
		var index = $(this).index();
		if(index == 2){
			$(".mean_slide_box").slideToggle();
			
		}else{
			$(".mean_slide_box").slideUp();
			if(index == 0){
				dataReload({
					beginTime:years + '-' + mounth + '-' + today,
					endTime:years + '-' + mounth + '-' + today,
				});
			}else if(index == 1){
				dataReload({
					beginTime:weekTimeFilter(new Date())['initDate'],
					endTime:weekTimeFilter(new Date())['finalDate']
				});
			}
		}
	})
	$('#resetting').click(function() {
		$('#demo1').val('');
		$('#demo2').val('');
	})
	$('#sure').click(function(){
		if(common.filterA($('#demo1').val())<=common.filterA($('#demo2').val())){
			dataReload({
				beginTime:$('#demo1').val(),
				endTime:$('#demo2').val()
			});
			$(".mean_slide_box").slideUp();
		}else{
			common.pop('请选择结束时间大于开始时间')
		}
	})
	var calendar1 = new LCalendar();
	calendar1.init({
		'trigger': '#demo1', //标签id
		'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
		'minDate': 2000 + '-' + 1 + '-' + 1, //最小日期
		'maxDate': years + '-' + (mounth) + '-' + today //最大日期
	});
	var calendar2 = new LCalendar();
	calendar2.init({
		'trigger': '#demo2', //标签id
		'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
		'minDate': 2000 + '-' + 1 + '-' + 1, //最小日期
		'maxDate': years + '-' + (mounth) + '-' + today //最大日期
	});
})(window.jQuery);