;(function(){
	var common = {
		_url:'http://dma.phpleague.cn/',//测试
		mobileCode:0,
		// _url:'http://dma.dfsk.com.cn/',	//线上
		share_url:'http://dma.phpleague.cn/share/index.html?code=',
		_urlFile:'./',
		init:function(){
			//升级app
			document.addEventListener('plusready',function(){
		        // plus.webview.open('copy.html','copy',{zindex:20});
		        plus.runtime.getProperty(plus.runtime.appid,function(inf){
		            wgtVer=inf.version;
		            var u = navigator.userAgent;
		            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		            var app = isiOS?1:2;
		            common.mobileCode = app;
		            isVersion(app,wgtVer);
		        });
		    },false);
		    function isVersion(app,wgtVer){
		    	var html = '<style type="text/css">.loadDownPage{position: fixed;top:0;left: 0;bottom: 0;right: 0;display: block;width: 100%;height: 100%;background: #fff;z-index: 999;}.my_dition{margin-top:2.7rem;}</style>'+
					'<div class="loadDownPage">'+
						'<div class="g-header">'+
							'<a class="goback" href="javascript:;"><i class="i-common"></i></a>'+
							'<div class="title">版本信息</div>'+
						'</div>'+
						'<div id="content">'+
							'<div class="my_dition">'+
								'<span class="my_logo">'+
									'<img src="images/public_img/dfxk_logo2.png"/>'+
								'</span>'+
								'<p class="my_num"></p>'+
								'<div class="my_info">'+
									'<span class="my_new"></span>'+
									'<p class="my_no">为不影响信息同步请前往下载更新最新版本</p>'+
								'</div>'+
								'<a href="javascript:;" class="my_download">前往下载</a>'+
							'</div>'+
						'</div>'+
					'</div>';
		        $.ajax({
		            type: "get",
		            url: common._url+'appapi/upgrade',
		            dataType:'jsonp',
		            data: {
		                TerminalType:app,
		                version:wgtVer
		            },
		            jsonp: 'callback',
		            success: function(data){
		            	if(location.href.indexOf('copy.html')>0){
		            		$('body').append(html);
		            		$('.loadDownPage').find('.my_num').html('V'+wgtVer);//当前版本号
		            		$('.goback').attr('href','javascript:history.go(-1);')
		            	}
		                if(data.data.updateType == 1 || data.data.updateType == 2){
		                	$('body').append(html);
		                    if(data.data.updateType == 2){
		                        $('.loadDownPage .g-header').hide()
		                    }else{
		                    	if($('.goback').length>0){
							        $('.goback').click(function(){
							            $('.loadDownPage').hide();
							        })
							    }
		                    }
		                    $('.loadDownPage').find('.my_num').html('V'+wgtVer);//当前版本号
		                    $('.loadDownPage').find('.my_new').html('版本已更新至V'+data.data.version);//最新版本号
		                    $('.my_download').click(function(){
		                        if(app == 1){
		                            window.location = "https://itunes.apple.com/cn/app/id1233108789";
		                        }else{
		                            window.location = data.data.url;
		                        }
		                    })
		                }else{
		                	$('.my_no').html('当前已经是最新版本');
		                }
		                
		            }
		        });
		    }
			// 我的
			var myPage = $('.g-my');
			if(myPage.length>0){
				myPage.find('.m-member a').attr('href',common._urlFile+'myUserinfo.html');//个人信息
				myPage.find('.m-help li:eq(0) a').attr('href',common._urlFile+'messageList.html');//消息中心
				myPage.find('.m-help li:eq(2) a').attr('href',common._urlFile+'copy.html');//更新升级
			}
			// 测试
			/*console.log(common.getCookie('dman_login_dman_name'));
			var loginCookie = common.getCookie('dman_login_dman_name');
			if(!loginCookie || loginCookie == 'null'){
				if(window.location.href.indexOf('login.html')>0) return;
				console.log('未登录')
				window.location.href = common._urlFile+'login.html';
			}*/
			var backNum = 0;
			document.addEventListener('plusready', function(){
				function testUrl(val){
					var a=false;
					var urldata = [
						'login.html',
						'firstPageBoard.html',
						'xs_liebiao.html',
						'statis.html',
						'achievementStandard.html',
						'taskSurvey.html',
					]
					var len = urldata.length;
					for(var s=0;s<len;s++){
						if(val.indexOf(urldata[s])>0){
							a = true;
						}
					}
					return a;
				}
				var urldata = new RegExp("W3School|asdasd")
				plus.key.addEventListener('backbutton',function(event){
					if(testUrl(location.href)){
						if(backNum < 1){
							plus.nativeUI.toast( "再按一次返回退出程序");
	    					backNum++;
	    					setTimeout(function(){
	    						backNum = 0;
	    					},3000)
						}else{
							plus.runtime.quit();
						}
					}else if(location.href.indexOf('my.html')>0 || location.href.indexOf('messageList.html')>0 || location.href.indexOf('xs_xiangqing.html')>0 || location.href.indexOf('share.html')>0){
						plus.webview.currentWebview().close();
					}else{
						history.go(-1);
					}

				}, false);
			})
		},
		loading:function(state){
			$('.g-loading').remove();
			if(state == 'show'){
				$('body').append('<div class="g-loading"></div>');
			}
		},
		pop:function(txt){
			if($('.box_shadow').length>0){$('.box_shadow').remove()}
			var html = '<div class="box_shadow" style="display: block;">'+
					'<div class="box_main">'+
						'<p class="main_top">提示</p>'+
						'<span class="">'+txt+'</span>'+
						'<a href="javascript:;" class="btn">好的</a>'+
					'</div>'+
				'</div>';
			$('body').append(html);
			$('.box_shadow .box_main .btn').click(function(){$('.box_shadow').remove()});
		},
		userInfo:function(callback){
			$.ajax({
				type: "post",
				url: common._url+"appapi/userMessage",
				dataType: 'jsonp',
				cache: false,
				jsonp: 'callback',
				success: function(res) {
					if(res.code == 200){
						var groupId = res.userInfo.userInfo.groupId;
						// 我的 帮助
						var myPage = $('.g-my');
						if(myPage.length>0){
							if(groupId == 32){//电销
								myPage.find('.m-help li:eq(1) a').attr('href',common._urlFile+'dx-help.html');//帮助
							}else if(groupId == 26){//直销
								myPage.find('.m-help li:eq(1) a').attr('href',common._urlFile+'zx-help.html');//帮助
							}else if(groupId == 33 || groupId == 28){
								myPage.find('.m-help li:eq(1) a').attr('href',common._urlFile+'zb-help.html');//
							}
						}
						if(callback){
							callback(res);
						}
					}
				}
			})
			common.jsonpError();
			
		},
		jsonpError:function(){
			// ie 8+, chrome and some other browsers
			var head = document.head || $('head')[0] || document.documentElement; // code from jquery
			var script = $(head).find('script')[0];
			script.onerror = function(evt) {
				common.loading('hide');
				common.pop('网络错误');
				// do some clean

				// delete script node
				if (script.parentNode) {
					script.parentNode.removeChild(script);
				}
				// delete jsonCallback global function
				var src = script.src || '';
				var idx = src.indexOf('callback=');
				if (idx != -1) {
					var idx2 = src.indexOf('&');
					if (idx2 == -1) {
						idx2 = src.length;
					}
					var jsonCallback = src.substring(idx + 9, idx2);
					delete window[jsonCallback];
				}
			};
		},
		/**
	     *
	     * @param name cookie的名称
	     * @param val  cookie的值
	     * @param dat  cookie的过期时间
	     */
		setCookie:function(name, val, dat){
			var exp = new Date();
	        exp.setTime(exp.getTime() + dat * 24 * 60 * 60 *1000);
	        document.cookie = name + '=' + val + ';path=/;expires=' + exp.toGMTString();
		},
		getCookie:function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	        //表示以^|开头...‘=’号后的0个或无穷多个字符，以‘;’结尾
	        if(arr=document.cookie.match(reg))
	            return (unescape(arr[2]));
	        else {
	            return null;
	        }
		},
		loadWebview:function(){
			setTimeout(function(){
				location.reload();
			},500)
		},
		initIndexPage:function(){
			window.location.href = 'firstPageBoard.html';
		},
		navBarState:function(){
			var navBarDom = $('.g-navBar');
			navBarDom.find('a').removeClass('on');
			navBarDom.find('a:last').addClass('on');
		},
		filterA:function(str){
			// var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
			var pattern = new RegExp("[-]");
	        var specialStr = "";    
	        for(var i=0;i<str.length;i++)    
	        {    
	             specialStr += str.substr(i, 1).replace(pattern, '');     
	        }    
	        return specialStr;
		},
		paimingSkip:function(val){
			var view = plus.webview.getWebviewById('share');
			if(!view){
				plus.webview.open('share.html?type='+val,'share',{zindex:9},'slide-in-right');
			}
		},
		//获取url参数
		request:function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		}
	}
	window.common = common;
	common.init();
})();