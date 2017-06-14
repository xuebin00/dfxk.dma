function loadPage(){
	location.reload();
}
function plusReady(){
	function openWebview(page,id,style){
		var view = plus.webview.getWebviewById(page);
		if(!view){
			plus.webview.open(page,id,style,'slide-in-right');
		}
	}
	function closeWebview(id){
		if(id){
			plus.webview.getWebviewById(id).close()
		}else{
			var cView = plus.webview.currentWebview();
			cView.close();
		}
	}
	function creationWebview(page,id,style){
		var embed=null;
		var view = plus.webview.getWebviewById(page);
		if(!view){
			embed=plus.webview.create(page,id,style);
			// plus.webview.currentWebview().append( embed );
		}
	}
	function showWebview(id,url){
		var page = plus.webview.getWebviewById(id);
		page.show();
		if(url){
			plus.webview.getWebviewById(id).loadURL(url);
		}
	}
	function hideWebview(id){
		var page = plus.webview.getWebviewById(id);
		page.hide();
	}
	var msgDom = $('.g-header .msg');
	if(msgDom.length>0){
		var clickOff = true;
		msgDom.click(function(){
			if(clickOff){
				clickOff = false;
				openWebview('messageList.html','msg',{zindex:9});
			}
			setTimeout(function(){
				clickOff = true;
			},3000)
		})
	}
	/*creationWebview('login.html','login',{top:"0",bottom:"0",zindex:10});
	creationWebview('firstPageBoard.html','index',{top:"51px",bottom:"51px",zindex:5});*/
	/*creationWebview('achievementStandard.html','zhibiao',{top:"51px",bottom:"51px",zindex:5});
	creationWebview('xs_liebiao.html','xiansuo',{top:"51px",bottom:"51px",zindex:5});
	creationWebview('statis.html','statis',{top:"51px",bottom:"51px",zindex:5});*/
	var navBarDom = $('.g-navBar');
	navBarDom.on('click','a',function(){
		// common.selectWebview()
		// common.openWebview('xs_xiangqing.html');
		// 加载新URL页面
		$(this).addClass('on');
		$(this).siblings().removeClass('on');
		var page = $(this).attr('data-page');
		var url = $(this).attr('data-url');

		/*hideWebview('index');
		hideWebview('zhibiao');
		hideWebview('xiansuo');
		hideWebview('statis');
		showWebview(page,url);*/
		plus.webview.getWebviewById('index').loadURL(url);
//							console.log(plus.webview.getWebviewById('index').getURL())
//							console.log('跳转地址：'+url)
		// plus.webview.getWebviewById('index').loadURL(url);
	})
	$.ajax({
		type: "post",
		url: common._url+"appapi/userMessage",
		dataType: 'jsonp',
		// data: data,
		cache: false,
		// crossDomain: true,
		jsonp: 'callback',
		// jsonpCallback:'islogin',
		success: function(res) {
			var loginPage = $('#j-login');
			//1、没有登录 2、当前页不是登录页面 跳转登录页面
			
			if(res.code == -1 && !loginPage.length>0){
				showWebview('login');
			//1、已登录 2、当前页为登录页面 跳转首页看板
			}else if(res.code == 200){
				showWebview('index');
			}
			//进到个人中心
			var groupId = res.userInfo.userInfo.groupId;
			var trueName = res.userInfo.userInfo.trueName;
			var roledata = {
				'32':'电销员&nbsp;'+trueName,
				'26':'直销员&nbsp;'+trueName,
				'33':'总部&nbsp;'+trueName,
				'28':trueName
			}
			var role = roledata[groupId];
			var myDom = $('.g-header .title2');
			if(myDom.length>0){
				/*myDom.attr('href',common._urlFile+'my.html');//个人中心*/
				var clickOff = true;
				$('.title2').click(function(){
					if(clickOff){
						clickOff = false;
						openWebview('my.html','my',{zindex:9});
					}
					setTimeout(function(){
						clickOff = true;
					},3000)
				})
				myDom.html(role);//个人中心
			}
			//消息
			if($('.g-header .msg').length>0 && res.data.unread>0){
				var msgDom = $('.g-header .msg em');
				msgDom.show();
				msgDom.text(res.data.unread);
			}
			//总部 首页看板
			var bar = $('.g-navBar');
			bar.append('<a href="javascript:;" data-url="firstPageBoard.html" data-page="index" class="on"><i class="i-common"></i><span>首页看板</span></a><a href="javascript:;" data-url="achievementStandard.html" data-page="zhibiao"><i class="i-common"></i><span>业绩指标</span></a>')
			if(groupId == 33){
				bar.addClass('four');
				bar.append('<a href="javascript:;" data-url="'+common._urlFile+'taskSurvey.html" class="gaikuang"  data-page="statis"><i class="i-common"></i><span>任务概况</span></a><a href="javascript:;" data-url="'+common._urlFile+'statis.html" class="tongji"  data-page="statis"><i class="i-common"></i><span>多维统计</span></a>');
			}else{
				bar.append('<a href="javascript:;" data-url="xs_liebiao.html" data-page="xiansuo"><i class="i-common"></i><span>线索跟进</span></a>');
			}
		}
	})
	common.jsonpError();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}