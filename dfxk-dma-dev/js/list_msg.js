$(function(){
	$(".msgTop li").click(function(){
        var $index=$(this).index();
        $(this).addClass("selected").siblings().removeClass("selected");
        $(this).parent().parent().siblings().each(function(index,item){
            index === $index ? $(item).addClass("block") : $(item).removeClass("block");
        })
    })
    $('.goback').click(function(){
		if(history.length == 1){
			var cView = plus.webview.currentWebview();
			cView.close();
		}
	})
    getdata();
    function getdata(){
    	common.userInfo(function(data){
    		var msg1_dom = $('.msgTop ul li:eq(0)').children('span');
    		var msg2_dom = $('.msgTop ul li:eq(1)').children('span');
    		var msg1 = data.data.mission.unread;
    		var msg2 = data.data.system.unread;
    		if(msg1>0){
    			msg1_dom.show();
    			msg1_dom.html(msg1)
    		}else{
    			msg1_dom.hide();
    		}
    		if(msg2>0){
    			msg2_dom.show();
    			msg2_dom.html(msg2);
    		}else{
    			msg2_dom.hide();
    		}
			var missionHtml = '';
			var systemHtml = '';
			var mission = data.data.mission.msgList;
			var system = data.data.system.msgList;
			var unreadIds = [];
			for(var el in mission){
				var isreadKey = mission[el]['isread']?'bell':'bell bell-new';
				missionHtml += '<li>'+
							'<div class="msgList-t">'+
								'<span class="'+isreadKey+'">'+mission[el]['title']+'</span>'+
								'<span class="date">'+mission[el]['time']+'</span>'+
							'</div>'+
							'<p class="msgList-m">'+mission[el]['describe']+'</p>'+
						'</li>';
				if(!mission[el]['isread']){
					unreadIds.push(mission[el]['noticeId']);
				}
			}
			$('.j-mission').html(missionHtml);
			for(var el in system){
				var isreadKey = system[el]['isread']?'bell':'bell bell-new';
				systemHtml += '<li>'+
							'<div class="msgList-t">'+
								'<span class="'+isreadKey+'">'+system[el]['time']+'</span>'+
							'</div>'+
							'<p class="msgList-m">'+system[el]['describe']+'</p>'+
						'</li>';
				if(!system[el]['isread']){
					unreadIds.push(system[el]['noticeId']);
				}
			}
			$('.j-system').html(systemHtml);
			$.ajax({
				type: "post",
				url: common._url+"appapi/userMessageRead",
				dataType: 'jsonp',
				data:{
					'noticeId':unreadIds
				},
				cache: false,
				jsonp: 'callback',
				success: function(res) {
				}
			});
			common.jsonpError();
    	});
    }
})
