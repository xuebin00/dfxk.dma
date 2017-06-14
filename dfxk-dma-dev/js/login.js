;(function(){
	var loginBtn = $('.j-login');
    var cookieName = 'dman_login_dman_name'; //cookie的名称
    var cookieValue = common.getCookie(cookieName);
    // common.userInfo();
    //如果cookie存在则跳转到main页
    /*if (cookieValue && cookieValue != 'null'){
        window.location.href = common._urlFile+'firstPageBoard.html';
    }*/
    if(localStorage.getItem('username')&&localStorage.getItem('username') != 0){
        $('input[name=username]').val(localStorage.getItem('username'));
        $('input[name=password]').val(localStorage.getItem('password'));
    }
    function slogin(){
        common.loading('show');
        $.ajax({
            type: "POST",
            url: common._url+'appapi/login',
            dataType:'jsonp',
            data: $("#j-login").serialize(),
            success: function(data){
                common.loading('hide');
                if(data.code==200){
                    if(!$('.check').hasClass('check0')){
                        if(!localStorage.getItem('username') || localStorage.getItem('username') != $('input[name=username]').val()){
                            localStorage.setItem('username',$('input[name=username]').val());
                            localStorage.setItem('password',$('input[name=password]').val());
                        }
                    }else{
                        localStorage.setItem('username',0);
                        localStorage.setItem('password',0);
                    }
                    if(!plus.webview.getWebviewById('common')){
                        var commonPage = plus.webview.create('common.html','common',{top:"0",bottom:"0",zindex:1})
                        var indexPage = plus.webview.create('firstPageBoard.html','index',{top:"51px",bottom:"51px",zindex:5})
                            commonPage.show();
                            indexPage.show();
                    }else{
                        plus.webview.getWebviewById('common').show();
                        plus.webview.getWebviewById('index').show();
                        plus.webview.getWebviewById('index').evalJS('common.initIndexPage()');
                        plus.webview.getWebviewById('common').evalJS('common.loadWebview()');
                    }
                    var cView = plus.webview.currentWebview();
                    cView.close();
                }else{
                    reloadCode();
                    common.pop(data.msg);
                }
            },
            error : function() {
                alert("异常！");
            }
        });
        common.jsonpError();
 	}
    document.addEventListener("plusready",function(){
        loginBtn.on('click',function(){
            var accoundDom = $('input[name=password]').val(),
            passwordDom = $('input[name=password]').val(),
            captcha = $('input[name=captcha]').val();
            // console.log(accoundDom,passwordDom);
            if(!accoundDom || !passwordDom){
                common.pop('请正确输入账号或密码');
                return;
            }
            if(!captcha){
                common.pop('请输入验证码');
                return;
            }
            slogin();
            // console.log($("#j-login").serialize());
            //如果当前用户选中了记住密码则将cookie的过期时间设置成7天
            if (!$(".choose").hasClass('check0')){
                common.setCookie(cookieName, cookieValue, 7)
            } else {
                common.setCookie(cookieName, cookieValue, 0.1)
            }
        });
    },false);
	$(".m-mber_password").on('click',function(){
		$(this).children('.check').toggleClass('check0');
	});
    $('.recode,#imgCode').click(function(){
        reloadCode();
    })
    function reloadCode(){
        $('#imgCode').attr('src','http://dma.phpleague.cn/captcha.html');
    }
    function webviewInfo(){
        common.userInfo(function(){
            if(!plus.webview.getWebviewById('common')){
                var commonPage = plus.webview.create('common.html','common',{top:"0",bottom:"0",zindex:1})
                var indexPage = plus.webview.create('firstPageBoard.html','index',{top:"51px",bottom:"51px",zindex:5})
                    commonPage.show();
                    indexPage.show();
            }else{
                plus.webview.getWebviewById('common').show()
                plus.webview.getWebviewById('index').show()
            }
        })
    }
    if(window.plus){
        webviewInfo();
    }else{
        document.addEventListener("plusready",webviewInfo,false);
    }
})();
