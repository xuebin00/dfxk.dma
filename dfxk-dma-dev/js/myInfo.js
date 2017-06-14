;(function(){
	my = {
		index:function(){
			var roledata = {
				'32':'电销员',
				'26':'直销员',
				'33':'管理员',
				'28':'管理员'
			}
			// data = common.userInfo();
			common.userInfo(function(data){
				data = data.userInfo.userInfo;
				if($('.g-my').length > 0){
					var dom = $('.m-member .info'),
						uNameDom = dom.children('.info_t'),
						storeDom = dom.children('.info_c'),
						uLoginDom = dom.children('.info_b');
						uNameDom.html(data.trueName);
						storeDom.html(data.fatherName);
						uLoginDom.html('登录名：'+data.login);
				}else if($('.g-myInfo').length > 0){
					var dom = $('.g-myInfo ul'),
						uPicDom = dom.children('li:eq(0)').find('img'),
						uNameDom = dom.children('li:eq(1)').children('span'),
						sexDom = dom.children('li:eq(2)').children('span'),
						mobileDom = dom.children('li:eq(3)').children('span'),
						roleDom = dom.children('li:eq(4)').children('span');
						uPicDom.attr('src',data.head_pic?data.head_pic:common._urlFile+'images/touxiang.jpg');
						uNameDom.html(data.trueName);
						sexDom.html(data.sex? '男' :'女');
						mobileDom.html(data.mobile);
						roleDom.html(data.fatherName+'&nbsp;/&nbsp;'+roledata[data.groupId]);
				}
			})
		}
	}
	if($('.sign-out').length>0){
		$('.sign-out').click(function(){
			common.loading('show');
			$.ajax({
				type: "post",
				url: common._url+"appapi/logout",
				dataType: 'jsonp',
				cache: false,
				jsonp: 'callback',
				success: function(res) {
					common.loading('hide');
					//消息
					if(res.code == 200){
						// window.location.href = common._urlFile+'login.html'
						var cView = plus.webview.currentWebview();
                        cView.close();
						var embed=null;
						embed = plus.webview.create('login.html','login',{top:"0",bottom:"0",zindex:10});
						// plus.webview.currentWebview().append( embed );
						embed.show();
					}
				},
				error:function(){
					common.loading('hide');
				}
			})
			common.jsonpError();
		})
	}
	$('.goback').click(function(){
		if(location.href.indexOf('my.html')>0){
			var cView = plus.webview.currentWebview();
			cView.close();
		}
	})
	my.index();
})();