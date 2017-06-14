$(function() {

	var winH = $(window).innerHeight();
	//	common.userInfo();
	var obj = {}; //时间对象用来存放两个时间属性
	var myDate = new Date();
	var areaId;
	
	var flag = true;
	//顶部选项卡
	$('.m_nav').on("click", ".tab_btn", function() {

		$(this).addClass('tishi').siblings().removeClass('tishi');
		//解决选项卡切换时间蒙版的显示问题
		if($(this).attr("id") != 'othertime') {
			flag = true;
			$(".mean_slide_box").slideUp();
			$("body,html").height(winH + 60 + "px").css("overflow", "auto");
			$(".mean_slide_box").height(winH - 98 + "px").css("overflow-y", "hidden");
		};
		//		选项卡切换数据渲染	
		dataRender($(this).index());

	})
	//点击其他时间后的逻辑
	$("#othertime").click(function() {
		//		控制弹出层是从上面滑下来的
		myDate = new Date();
		var obj = monthTimeFilter(myDate);
		bulingobj(obj);
		$("#demo1").val(obj.initDate);
		$("#demo2").val(obj.finalDate);
		//			
		if(flag == true) {
			//				document.removeEventListener('touchmove',setDefault);
			$("body,html").height(winH - 60 + "px").css("overflow", "hidden");
			$(".mean_slide_box").height(winH - 98 + "px").css("overflow-y", "scroll");
			flag = false;

		} else if(flag == false) {
			//				document.addEventListener('touchmove',setDefault);
			$("body,html").height(winH + 60 + "px").css("overflow", "auto");
			$(".mean_slide_box").height(winH - 98 + "px").css("overflow-y", "hidden");
			flag = true;
		}

		$(".mean_slide_box").slideToggle();

	})
	//点击提交筛选参数
	$("#sure").on("click", function() {
		//如果选中的demo1的时间如果大于demo2的时间则对用户进行提示
		//							console.log(obj.initDate);
		//							
		//							console.log(obj.finalDate);
		obj.initDate = $("#demo1").val();
		obj.finalDate = $("#demo2").val();

		var arr1 = obj.initDate.split("-");
		var arr2 = obj.finalDate.split("-");

		if(arr1[0] - arr2[0] > 0) {

			common.pop("输入的结束时间，应大于开始时间")
	
			return false;
		} else if (arr1[0] - arr2[0]==0){
			 
			if(arr1[1] - arr2[1] > 0) {
				common.pop("输入的结束时间，应大于开始时间")
				
				return false
			} else if(arr1[1] == arr2[1]) {
				if(arr1[2] - arr2[2] > 0) {
					common.pop("输入的结束时间，应大于开始时间")
				
					return false;
				}
			}
			
			
		}
		//在这里无法使用调用方法这个实现，因为会导致弹出框弹回去
		//			timeTishi();

		//点击其他时间之后需要恢复滚动
		if(flag == false) {
			$("body,html").height(winH + 60 + "px").css("overflow", "auto");
			$(".mean_slide_box").height(winH - 98 + "px").css("overflow-y", "hidden");
			flag = true;
			//				document.addEventListener('touchmove',setDefault);
		}

		dataRenderAjax(obj);
		//再数据渲染完成后将时间框隐藏
		$(".mean_slide_box").slideToggle();

	})

	//清空文本框里面的值
	$("#resetting").on("click", function() {
		$("#demo1").val("");
		$("#demo2").val("");

	})

	//  进行数据渲染前参数的处理
	function dataRender(index) {
		//角色是电销或者直销的时候需要判断index
		if(index == '0') { //点击本周
			//	获得一个带有当前日期和本周一的日期的对象
			//  属性分别是obj.initData和obj.MondayData
			myDate = new Date();
			var obj = weekTimeFilter(myDate);
			bulingobj(obj);
		} else if(index == '1') { //点击本月
			//	获得一个带有当前日期和本周一的日期的对象
			//  属性分别是obj.initData和obj.MondayData
			myDate = new Date();
			var obj = monthTimeFilter(myDate);
			bulingobj(obj)

		} else return; //不写return就会执行数据请求了这里在单击其他时间时不要发送数据请求
		//  数据请求

		dataRenderAjax(obj);
		//调用时间控件
	}
	//补零函数，为月份和日期中没有0的添0
	function bulingobj(obj) {
		var arr1 = obj.initDate.split("-");
		var arr2 = obj.finalDate.split("-");
		//如果月份是小于两位的就补零

		var string1 = arr1[1].length;

		if(arr1[1].length < 2) {
			var arrstr1 = "0" + arr1[1];
			arr1.splice(1, 1, arrstr1);
		};
		//如果是日期小于两位就补零
		if(arr1[2].length < 2) {
			var arrstr2 = "0" + arr1[2];
			arr1.splice(2, 1, arrstr2);
		}
		//如果月份是小于两位的就补零
		if(arr2[1].length < 2) {
			var arrstr1 = "0" + arr2[1];
			arr2.splice(1, 1, arrstr1);
		};

		//如果是日期小于两位就补零
		if(arr2[2].length < 2) {
			var arrstr2 = "0" + arr2[2];
			arr2.splice(2, 1, arrstr2);
		}
		obj.initDate = arr1.join("-");
		obj.finalDate = arr2.join("-");

		return obj;
	}

	//参数处理结束之后开始进行数据的渲染
	function dataRenderAjax(obj) {
		common.loading('show');
		$.ajax({
			type: "get",
			url: common._url + "appapi/Performance",
			data: {
				beginTime: obj.initDate, //日期起始 	data(2017-04-14) 
				endTime: obj.finalDate, //日期结束	data(2017-04-30) 

			},
			async: false,
			dataType: "jsonp",
			success: function(res) {
				common.loading('hide');
				var data = res.data.Map;

				var items = [];

				//指示说明按钮的隐藏和显示
				$(".shuoming").removeClass("displayNone");
				$(".myPaiMing").removeClass("displayNone");
				if(res.userInfo.groupid == '26') { //	直销

					$(".m_nav").removeClass("displayNone");
					$(".dx_tb").addClass("displayNone");

					//							items.push('<div class="g_total g_total_e"><span>首次到店量</span><p id="yyddl"><b>'+data.ToShopCount+'</b></br><em>邀约到店率<i id="app_radio">'+data.ToShopCount_ratio+"%"+'</i></em></p></div>');
					//							items.push('<div class="g_total g_total_d"><span>到店成交量</span><p id="ddcjl"><b>'+data.volumeCount+'</b></br><em>到店成交率<i id="trade_radio">'+data.volumeCount_ratio+"%"+'</i></em></p></div>');
					items.push('<div class="g_total g_total_e"><span>首次到店量</span><p id="yyddl">' + data.ToShopCount + '</p></div>');
					//							items.push('<div class="center_radio">到店成交率<span id="app_radio">'+data.volumeCount_ratio+"%"+'</span></div>');
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">到店成交率' + data.volumeCount_ratio + '%</span></div>')
					items.push('<div class="g_total g_total_d marginTop0"><span>到店成交量</span><p id="ddcjl">' + data.volumeCount + '</p></div>')

					$("#xs_content").html(items.join(''));
					$(".myPaiMing").attr("onclick","common.paimingSkip(3)");
				} else if(res.userInfo.groupid == '32') { //电销
					$(".m_nav").removeClass("displayNone");
					$(".dx_tb").addClass("displayNone")

					//							items.push('<div class="g_total g_total_f">');
					//							items.push('<span>总线索量</span><p id="zxsl" class="g_sl">'+data.totalCount+'</p></div>');
					//							items.push('<div class="g_total g_total_f"><span>有效线索量</span><p id="yxxsl"><b>'+data.effectiveCount+'</b></br><em>有效线索率<i id="eff_radio">'+data.effectiveCount_ratio+"%"+'</i></em></p></div>')
					//							items.push('<div class="g_total g_total_e"><span>邀约到店量</span><p id="yyddl"><b>'+data.ToShopCount+'</b></br><em>邀约到店率<i id="app_radio">'+data.ToShopCount_ratio+"%"+'</i></em></p></div>');
					//							items.push('<div class="g_total g_total_d"><span>到店成交量</span><p id="ddcjl"><b>'+data.volumeCount+'</b></br><em>到店成交率<i id="trade_radio">'+data.volumeCount_ratio+"%"+'</i></em></p></div>');
					items.push('<div class="g_total"><span>总线索量</span><p id="zxsl" class="g_sl">' + data.totalCount + '</p></div>');
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">有效线索率' + data.effectiveCount_ratio + '%</span></div>');
					items.push('<div class="g_total g_total_f marginTop0"><span>有效线索量</span><p id="yxxsl">' + data.effectiveCount + '</p></div>');
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">邀约到店率' + data.ToShopCount_ratio + '%</span></div>');
					items.push('<div class="g_total g_total_e marginTop0"><span>邀约到店量</span><p id="yyddl">' + data.ToShopCount + '</p></div>');
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">到店成交率' + data.volumeCount_ratio + '%</span></div>')
					items.push('<div class="g_total g_total_d marginTop0"><span>到店成交量</span><p id="ddcjl">' + data.volumeCount + '</p></div>')

					$("#xs_content").html(items.join(''));
					//因为直销和电销不一样的界面渲染所以
					$(".dianxiao").removeClass("displayNone");
					$(".myPaiMing").attr("onclick","common.paimingSkip(2)");
				
				} else if(res.userInfo.groupid == '33') { //总部
					$(".dx_tb").removeClass("displayNone")
					$(".m-keyTime_wrap").removeClass("displayNone");
					var headitems = [];
					headitems.push('<div class="m-keyTime">')
					headitems.push('<div class="gn_module">')
					//第一个时间框
					headitems.push('<div class="marginTop10"><input class="wid20" id="demo1" type="text" readonly="" value=' + obj.initDate + ' /></div>')
					//左到右的箭头
					headitems.push('<span><img src="images/public_img/timerline.png" /></span>')
					//第二个时间框	
					headitems.push('<div><input class="wid20" id="demo2" type="text" readonly="" value=' + obj.finalDate + ' /></div>');
					headitems.push('</div>')
					//区域的渲染
					var areaLength = res.data.AreaList.data;
					headitems.push('<div class="addressRang">');
					headitems.push('<select name="land">')
					headitems.push('<option value="0">全国</option>')
					for(var i = 0; i < areaLength.length; i++) {
						headitems.push('<option value="' + areaLength[i].id + '">' + areaLength[i].title + '</option>')
					}
					headitems.push('</select>')

					headitems.push('</div>')

					//检索按钮
					headitems.push('<a href="javascript:;" class="searchBtn">检索</a>')

					$("#zongbu_nav").html(headitems.join(''));

					items.push('<div class="baoke_wrap">');
					//选择是否只显示保客的信息
					items.push('<p class="dx_tb"><img class="dx_biaoji" src="images/public_img/danxuananniu.png"/><span id="bk_content">仅显示保客数据</span></p>');
					items.push('<div class="g_consh" id="xs_content">');
					//							items.push('<div class="g_total g_total_d"><span>总留资量</span><p id="zlzl" class="g_sl">'+data.TotalLzCount+'</p></div>');
					//							items.push('<div class="g_total"><span>总线索量</span><p id="zxsl" class="g_sl"><b>'+data.totalCount+'</b></br><em>留转率<i id="eff_radio">'+data.totalCount_ratio+"%"+'</i></em></p></div>');
					//							items.push('<div class="g_total g_total_f"><span>有效线索量</span><p id="yxxsl"><b>'+data.effectiveCount+'</b></br><em>有效线索率<i id="eff_radio">'+ data.effectiveCount_ratio+"%"+'</i></em></p></div>');
					//							items.push('<div class="g_total g_total_e"><span>邀约到店量</span><p id="yyddl"><b>'+data.ToShopCount+'</b></br><em>邀约到店率<i id="app_radio">'+ data.ToShopCount_ratio+"%"+'</i></em></p></div>');
					//							items.push('<div class="g_total g_total_d"><span>到店成交量</span><p id="ddcjl"><b>'+data.volumeCount +'</b></br><em>到店成交率<i id="trade_radio">'+data.volumeCount_ratio +"%"+'</i></em></p></div>');
					//							items.push('<div class="g_total g_total_f"><span>总成交量</span><p id="zcjl">'+data.DealCount+'</p></div>');
					items.push('<div class="g_total g_total_d"><span>总留资量</span><p id="zlzl" class="g_sl">' + data.TotalLzCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">留转率' + data.totalCount_ratio + "%" + '</span></div>');
					items.push('<div class="g_total marginTop0"><span>总线索量</span><p id="zxsl" class="g_sl">' + data.totalCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">有效线索率' + data.effectiveCount_ratio + "%" + '</span></div>');
					items.push('<div class="g_total g_total_f marginTop0"><span>有效线索量</span><p id="yxxsl">' + data.effectiveCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">邀约到店率' + data.ToShopCount_ratio + "%" + '</span></div>');
					items.push('<div class="g_total g_total_e marginTop0"><span>邀约到店量</span><p id="yyddl">' + data.ToShopCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">到店成交率' + data.volumeCount_ratio + "%" + '</span></div>')
					items.push('<div class="g_total g_total_d marginTop0"><span>到店成交量</span><p id="ddcjl">' + data.volumeCount + '</p></div>')
					items.push('<div class="g_total g_total_f "><span>总成交量</span><p id="zcjl">' + data.DealCount + '</p></div>')

					items.push('<div class="g_total_extend boderNone" ><div class="radio_left"><p>转化率:<span id="tr_rad">' + data.Conversion + '</span>%</p><p>战败率:<span id="fig_rad">' + data.Defeat + '</span>%</p></div></div>');
					items.push('<div class="g_total_extend boderNone" >');
					items.push('<div class="radio_right">');
					var yjzb = ((data.volumeCount / data.DealCount) * 100).toFixed(2);
					var jgb = ((data.volumeCount / (data.DealCount - data.volumeCount)) * 100).toFixed(2);

					if(data.DealCount != '0' && data.volumeCount != 0) {
						items.push('<p class="wid100">DMC业绩占比&thinsp;：<span id="yjzb">' + yjzb + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ <span class="comput">' + data.DealCount + '</span></p>');
					} else {
						items.push('<p class="wid100">DMC业绩占比&thinsp;：<span id="yjzb">' + 0 + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ <span class="comput">' + data.DealCount + '</span></p>');
					}
					//							items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">'+ jgb+'</span>% = <span class="comput">'+data.volumeCount+'</span> ÷ (<span class="comput">'+(data.DealCount+'-'+data.volumeCount)+'</span>)</p>');

					if((data.DealCount - data.volumeCount) != '0') {
						items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">' + jgb + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ (<span class="comput">' + (data.DealCount + '-' + data.volumeCount) + '</span>)</p>');
					} else {
						items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">' + 0 + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ (<span class="comput">' + (data.DealCount + '-' + data.volumeCount) + '</span>)</p>');
					}
					items.push('</div>');
					items.push('</div>');
					items.push('</div></div>')
					$('#yjzb_content').html(items.join(''));
					//							调用一次时间的控件
					timeControl();
					$(".dianxiao").removeClass("displayNone");

				} else if(res.userInfo.groupid == '28') { //大区
					$(".dx_tb").removeClass("displayNone")
					$(".m-keyTime_wrap").removeClass("displayNone");
					var headitems = [];
					headitems.push('<div class="m-keyTime">')
					headitems.push('<div class="gn_module">')
					//第一个时间框
					headitems.push('<div class="marginTop10"><input class="wid20" id="demo1" type="text" readonly="" placeholder=' + obj.initDate + ' /></div>')
					//左到右的箭头
					headitems.push('<span><img src="images/public_img/timerline.png" /></span>')
					//第二个时间框	
					headitems.push('<div><input class="wid20" id="demo2" type="text" readonly="" placeholder=' + obj.finalDate + ' /></div>');
					headitems.push('</div>')
					//区域的渲染
					var areaLength = res.data.AreaList.data;
					headitems.push('<div class="addressRang">');
					headitems.push('<select name="land">')
					headitems.push('<option value="0">全国</option>')
					for(var i = 0; i < areaLength.length; i++) {
						headitems.push('<option value="' + areaLength[i].id + '">' + areaLength[i].title + '</option>')
					}
					headitems.push('</select>')

					headitems.push('</div>')

					//检索按钮
					headitems.push('<a href="javascript:;" class="searchBtn">检索</a>')

					$("#zongbu_nav").html(headitems.join(''));

					items.push('<div class="baoke_wrap">');
					//选择是否只显示保客的信息
					items.push('<p class="dx_tb"><img class="dx_biaoji" src="images/public_img/danxuananniu.png"/><span id="bk_content">仅显示保客数据</span></p>');
					items.push('<div class="g_consh" id="xs_content">');

					items.push('<div class="g_total g_total_d"><span>总留资量</span><p id="zlzl" class="g_sl">' + data.TotalLzCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">留转率' + data.totalCount_ratio + "%" + '</span></div>');
					items.push('<div class="g_total marginTop0"><span>总线索量</span><p id="zxsl" class="g_sl">' + data.totalCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">有效线索率' + data.effectiveCount_ratio + "%" + '</span></div>');
					items.push('<div class="g_total g_total_f marginTop0"><span>有效线索量</span><p id="yxxsl">' + data.effectiveCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">邀约到店率' + data.ToShopCount_ratio + "%" + '</span></div>');
					items.push('<div class="g_total g_total_e marginTop0"><span>邀约到店量</span><p id="yyddl">' + data.ToShopCount + '</p></div>')
					items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">到店成交率' + data.volumeCount_ratio + "%" + '</span></div>')
					items.push('<div class="g_total g_total_d marginTop0"><span>到店成交量</span><p id="ddcjl">' + data.volumeCount + '</p></div>')
					items.push('<div class="g_total g_total_f "><span>总成交量</span><p id="zcjl">' + data.DealCount + '</p></div>')

					items.push('<div class="g_total_extend boderNone" ><div class="radio_left"><p>转化率:<span id="tr_rad">' + data.Conversion + '</span>%</p><p>战败率:<span id="fig_rad">' + data.Defeat + '</span>%</p></div></div>');
					items.push('<div class="g_total_extend boderNone" >');
					items.push('<div class="radio_right">');
					var yjzb = ((data.volumeCount / data.DealCount) * 100).toFixed(2);
					var jgb = ((data.volumeCount / (data.DealCount - data.volumeCount)) * 100).toFixed(2);
					if(data.DealCount != '0') {
						items.push('<p class="wid100">DMC业绩占比&thinsp;：<span id="yjzb">' + yjzb + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ <span class="comput">' + data.DealCount + '</span></p>');
					} else {
						items.push('<p class="wid100">DMC业绩占比&thinsp;：<span id="yjzb">' + 0 + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ <span class="comput">' + data.DealCount + '</span></p>');
					}
					//							items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">'+ jgb+'</span>% = <span class="comput">'+data.volumeCount+'</span> ÷ (<span class="comput">'+(data.DealCount+'-'+data.volumeCount)+'</span>)</p>');

					if((data.DealCount - data.volumeCount) != '0') {
						items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">' + jgb + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ (<span class="comput">' + (data.DealCount + '-' + data.volumeCount) + '</span>)</p>');
					} else {
						items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">' + 0 + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ (<span class="comput">' + (data.DealCount + '-' + data.volumeCount) + '</span>)</p>');
					}

					items.push('</div>');
					items.push('</div>');
					items.push('</div></div>')
					$('#yjzb_content').html(items.join(''));
					//							调用一次时间的控件
					timeControl();
					$(".dianxiao").removeClass("displayNone");
				}

				//点击保客的单选按钮
				$(".dx_tb").on("click", function() {
					obj.initDate = $("#demo1").val();
					obj.finalDate = $("#demo2").val();
					areaId = $("select option:selected").val();
					if($(this).hasClass("duigou")) {
						$(this).removeClass("duigou");
						//显示全部信息
						$(this).find("img").attr("src", "images/public_img/danxuananniu.png");
						dataZBRender(-1);
					} else {
						$(this).addClass("duigou");
						//加上对勾就是只显示保客信息
						$(this).find("img").attr("src", "images/public_img/danxuanxuanzhong.png");
						dataZBRender(2);
					}
				})
				//点击检索后的进行数据渲染替换
				$('.searchBtn').on('click', function() {
					timeTishi();
					
					areaId = $("select option:selected").val();
					if($(".dx_tb").hasClass("duigou")) {
						//保客的数据请求
						dataZBRender(2);
					} else {
						//全部的数据请求
						dataZBRender(-1);
					}
				})
				//自执行一次避免请求数据不出现

				$('.searchBtn').click();

			}
		});
		common.jsonpError();

		//针对是否是保客的判断请求
		function dataZBRender(index) {
			common.loading('show');
			$.ajax({
				type: "get",
				url: common._url + "appapi/Performance",
				data: {
					beginTime: obj.initDate, //日期起始 	data(2017-04-14) 
					endTime: obj.finalDate, //日期结束	data(2017-04-30) 
					areaId: areaId, //地区ID		int		默认全国0
					BLyId: index //来源		int （2：保客,-1：全部）默认-1
				},
				async: false,
				dataType: "jsonp",
				success: function(res) {
					common.loading('hide');
					var data = res.data.Map;
					var sec_items = [];
					sec_items.push('<div class="g_total g_total_d"><span>总留资量</span><p id="zlzl" class="g_sl">' + data.TotalLzCount + '</p></div>')
					sec_items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">留转率' + data.totalCount_ratio + "%" + '</span></div>');
					sec_items.push('<div class="g_total marginTop0"><span>总线索量</span><p id="zxsl" class="g_sl">' + data.totalCount + '</p></div>')
					sec_items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">有效线索率' + data.effectiveCount_ratio + "%" + '</span></div>');
					sec_items.push('<div class="g_total g_total_f marginTop0"><span>有效线索量</span><p id="yxxsl">' + data.effectiveCount + '</p></div>')
					sec_items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">邀约到店率' + data.ToShopCount_ratio + "%" + '</span></div>');
					sec_items.push('<div class="g_total g_total_e marginTop0"><span>邀约到店量</span><p id="yyddl">' + data.ToShopCount + '</p></div>')
					sec_items.push('<div class="center_radio"><img class="yeji_logo" src="images/yeji_xiajiaotou.png"><span class="app_radio">到店成交率' + data.volumeCount_ratio + "%" + '</span></div>')
					sec_items.push('<div class="g_total g_total_d marginTop0"><span>到店成交量</span><p id="ddcjl">' + data.volumeCount + '</p></div>')

					if(index == -1) {
						sec_items.push('<div class="g_total g_total_f"><span>总成交量</span><p id="zcjl">' + data.DealCount + '</p></div>');
					}
					sec_items.push('<div class="g_total_extend boderNone" ><div class="radio_left"><p>转化率:<span id="tr_rad">' + data.Conversion + '</span>%</p><p>战败率:<span id="fig_rad">' + data.Defeat + '</span>%</p></div></div>');
					sec_items.push('<div class="g_total_extend boderNone" >');
					sec_items.push('<div class="radio_right">');
					var yjzb = ((data.volumeCount / data.DealCount) * 100).toFixed(2);
					var jgb = ((data.volumeCount / (data.DealCount - data.volumeCount)) * 100).toFixed(2);
					if(index == -1) {
						if(data.DealCount != '0') {
							sec_items.push('<p class="wid100">DMC业绩占比&thinsp;：<span id="yjzb">' + yjzb + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ <span class="comput">' + data.DealCount + '</span></p>');
						} else {
							sec_items.push('<p class="wid100">DMC业绩占比&thinsp;：<span id="yjzb">' + 0 + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ <span class="comput">' + data.DealCount + '</span></p>');
						}
					}

					//						items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">'+ jgb+'</span>% = <span class="comput">'+data.volumeCount+'</span> ÷ (<span class="comput">'+(data.DealCount+'-'+data.volumeCount)+'</span>)</p>');
					//						sec_items.push('<p class="wid100">DMC业绩占比&thinsp;：<span id="yjzb">'+yjzb +'</span>% = <span class="comput">'+data.volumeCount+'</span> ÷ <span class="comput">'+data.DealCount+'</span></p>');        

					if(index == -1) {
						//							sec_items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">'+ jgb+'</span>% = <span class="comput">'+data.volumeCount+'</span> ÷ (<span class="comput">'+(data.DealCount+'-'+data.volumeCount)+'</span>)</p>');
						if((data.DealCount - data.volumeCount) != '0') {
							sec_items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">' + jgb + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ (<span class="comput">' + (data.DealCount + '-' + data.volumeCount) + '</span>)</p>');
						} else {
							sec_items.push('<p class="wid100">DMC结构比 &nbsp;&nbsp;&nbsp;：<span id="jgb">' + 0 + '</span>% = <span class="comput">' + data.volumeCount + '</span> ÷ (<span class="comput">' + (data.DealCount + '-' + data.volumeCount) + '</span>)</p>');
						}
					}
					sec_items.push('</div>');
					sec_items.push('</div>');
					$('#xs_content').html(sec_items.join(''));
				}
			});
			common.jsonpError();
		}
		var time = new Date();
	//时间控件的调用函数
	function timeControl() {
		var calendar1 = new LCalendar();
		calendar1.init({
			'trigger': '#demo1', //标签id
			'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
			//				'minDate': new Date().getFullYear() + '-' + (new Date().getMonth() - 2) + '-' + 1, //最小日期
			'minDate': 2000 + '-' + 1 + '-' + 1, //最小日期
			'maxDate': time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() //最大日期
		});

		var calendar2 = new LCalendar();
		calendar2.init({
			'trigger': '#demo2', //标签id
			'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
			'minDate': 2000 + '-' + (new Date().getMonth() - 2) + '-' + 1, //最小日期
			'maxDate': time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() //最大日期
		});
	}
	//时间控件的执行
	timeControl();

	function timeTishi() {
		obj.initDate = $("#demo1").val();
		obj.finalDate = $("#demo2").val();

		var arr1 = obj.initDate.split("-");
		var arr2 = obj.finalDate.split("-");

		if(arr1[0] - arr2[0] > 0) {

			common.pop("输入的结束时间，应大于开始时间")
	
			return false;
		} else if (arr1[0] - arr2[0]==0){
			 
			if(arr1[1] - arr2[1] > 0) {
				common.pop("输入的结束时间，应大于开始时间")
	
				return false
			} else if(arr1[1] == arr2[1]) {
				if(arr1[2] - arr2[2] > 0) {
					common.pop("输入的结束时间，应大于开始时间")

					return false;
				}
			}
		}
	}
	}
	
	//		  $(".login-form").on("focus", "input", function(){
	//	      $(this).closest('.item').addClass('focus');
	//	    }).on("blur","input",function(){
	//	      $(this).closest('.item').removeClass('focus');
	//	    });

	//指示说明隐藏
	$(".shuoming").on("click", function() {
		$(".m_pop").slideDown();
	})
	//指示说明弹出
	$(".m_close ").on("click", function() {
		$(".m_pop").slideUp();
	})

	//进入页面首次自执行
	$(".m_nav li:eq(1)").click();

}())