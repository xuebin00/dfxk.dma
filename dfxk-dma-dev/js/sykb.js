$(function(){
//	common.userInfo();
	//页面首次加载时显示的数据
	var data;

	//首次加载本日的数据
	common.loading('show');
	$.ajax({
		type: "get",
		url:common._url+"appapi",
		data:{type:1},
		async: true,
		dataType:"jsonp",
		success: function(res) {
			common.loading('hide');
			//导航的渲染
			navRender(res);
			//首次加载内容
			navBoard(res);
//			DataFirstrender(res);
			dataRender(0);
		}
	});
	common.jsonpError();
	//定义一个变量来接收userInfo.groupid
	var groupid;
	//第一次数据渲染
	var response;
	function navRender(res) {
		response=res;
		if (res.userInfo.groupid==32) {//电销 角色的导航渲染
					//导航的渲染
					var navarr=[];
					navarr.push('<li class="ft_default borrig" style="width:49%">今天</li>');
					navarr.push('<li style="width:49%">本周</li>');
					$("#nav_box_content").html(navarr.join(''));
		}else if (res.userInfo.groupid==26) {//直销 角色的导航渲染
					var navarr=[];
					navarr.push('<li class="ft_default borrig" style="width:49%">今天</li>');
					navarr.push('<li style="width:49%">本周</li>');
					$("#nav_box_content").html(navarr.join(''));
		}else if (res.userInfo.groupid==33) {//总部 角色的导航渲染
					var navarr=[];
					navarr.push('<li class="ft_default borrig" style="width:33%">今天</li>');
					navarr.push('<li class="borrig" style="width:33%">本周</li>');
					navarr.push('<li style="width:33%">本月</li>');
					$("#nav_box_content").html(navarr.join(''));		
		}else if (res.userInfo.groupid==28) {//大区角色的导航渲染
					var navarr=[];
					navarr.push('<li class="ft_default borrig" style="width:33%">今天</li>');
					navarr.push('<li class="borrig" style="width:33%">本周</li>');
					navarr.push('<li style="width:33%">本月</li>');
					$("#nav_box_content").html(navarr.join(''));		
		}
	}
	function navBoard (res) {
		data = res.data.map;	
			groupid=res.userInfo.groupid;
			var arr;
			if (res.userInfo.groupid==32) {//电销 角色的首次渲染
				arr=["待办任务","邀约成功","超时任务","回访次数"];
				$('.success').html(arr[0]);
				$('.renshuDetail span').html(data.DoTheTask);
			
//					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+data.DoTheTask_list[obj].data.urlV+"&urlKey=&"+ data.DoTheTask_list[obj].data.urlKey+"")
				$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+'0'+"&urlKey=&"+data.DoTheTask_url);
				
				var arrnum=[data.DoTheTask,data.InviteSuccess,data.UntreatedQuantity,data.Visit];
				var items=[];
				for (var i = 0; i < arr.length; i++) {
					if (i==0) {
					items.push('<li class="shuzhi_detaild'+i+' displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
					
					}else{
					items.push('<li class="shuzhi_detaild'+i+' " data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
					}
				}	
				$(".shuzhi").html(items.join(''));
				
			}else if (res.userInfo.groupid==26) {//直销角色的首次渲染
				arr=["待办任务","超时任务","到店成交","回访次数"];
				$('.success').html(arr[0]);
				$('.renshuDetail span').html(data.DoTheTask);
				$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+'0'+"&urlKey=&"+data.DoTheTask_url);
				var arrnum=[data.DoTheTask,data.UntreatedQuantity,data.volume,data.Visit];
				var items=[];
				for (var i = 0; i < arr.length; i++) {
					if (i==0) {
					items.push('<li class="shuzhi_detailz'+i+' displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
					}else{
					items.push('<li class="shuzhi_detailz'+i+' " data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
					}
				}
				$(".shuzhi").html(items.join(''));
				
			}else if (res.userInfo.groupid==33) {//总部角色的首次数据渲染
				arr=["新增成交","新增线索","超时未处理","新增任务"];
				$('.success').html(arr[0]);
				$('.renshuDetail span').html(data.volume);
				var strDemo='<div class="renshu"><p class="renshuDetail"><span>'+ data.volume+'</span></p><p class="success">新增成交</p></div>'
				$('.a_wrap').html(strDemo);
				var arrnum=[data.volume,data.CueQuantity,data.UntreatedQuantity,data.TaskQuantity];
				var items=[];
				for (var i = 0; i < arr.length; i++) {
					if (i==0) {
					items.push('<li class="shuzhi_detailzb'+i+' displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
					
					}else{
					items.push('<li class="shuzhi_detailzb'+i+'" data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
					}
				}
				$(".shuzhi").html(items.join(''));
			}else if (res.userInfo.groupid==28) {//大区角色的首次数据渲染
				arr=["新增成交","新增线索","超时未处理","新增任务"];
				$('.success').html(arr[0]);
				$('.renshuDetail span').html(data.volume);
				var strDemo='<div class="renshu"><p class="renshuDetail"><span>'+ data.volume+'</span></p><p class="success">新增成交</p></div>'
				$('.a_wrap').html(strDemo);
				var arrnum=[data.volume,data.CueQuantity,data.UntreatedQuantity,data.TaskQuantity];
				var items=[];
				for (var i = 0; i < arr.length; i++) {
					if (i==0) {
					items.push('<li class="shuzhi_detail displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
					
					}else{
					items.push('<li class="shuzhi_detail " data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
					}
				}
				$(".shuzhi").html(items.join(''));
			}
	}
//	function DataFirstrender (res) {
//				data = res.data.map;	
//				
//				groupid=res.userInfo.groupid;
//				var arr;
//				var	tabitems=[];
//				if (res.userInfo.groupid==32) {//电销 角色的首次渲染
//					arr=["待办任务","邀约成功","超时任务","回访次数"];
//					$('.success').html(arr[0]);
//					$('.renshuDetail span').html(data.DoTheTask);
//				
////					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+data.DoTheTask_list[obj].data.urlV+"&urlKey=&"+ data.DoTheTask_list[obj].data.urlKey+"")
//					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+'0'+"&urlKey=&"+data.DoTheTask_url);
//					
//					var arrnum=[data.DoTheTask,data.InviteSuccess,data.UntreatedQuantity,data.Visit];
//					var items=[];
//					for (var i = 0; i < arr.length; i++) {
//						if (i==0) {
//						items.push('<li class="shuzhi_detaild'+i+' displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
//						
//						}else{
//						items.push('<li class="shuzhi_detaild'+i+' " data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
//						}
//						
//					}	
//					$(".shuzhi").html(items.join(''));
//					var arrimg=[""];
//					
//					
//					var	tabitems=[];
//					tabitems.push("<thead><tr><th>状态</th><th>数量</th></tr></thead>");
//					tabitems.push("<tbody>")
//					
//					for (obj in data.DoTheTask_list) {
//
//						tabitems.push("<tr><td>");
//						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+data.DoTheTask_list[obj].data.urlV+"&urlKey=&"+ data.DoTheTask_list[obj].data.urlKey+"'>"+data.DoTheTask_list[obj].title+"</a>")
//						tabitems.push("</td><td>")
//						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+data.DoTheTask_list[obj].data.urlV+"&urlKey=&"+ data.DoTheTask_list[obj].data.urlKey+"'>"+data.DoTheTask_list[obj].data.count+"</a>")
//						tabitems.push("</td></tr>");
//					}
//					tabitems.push("</tbody>");
//				}else if (res.userInfo.groupid==26) {//直销角色的首次渲染
//					arr=["待办任务","超时任务","到店成交","回访次数"];
//					$('.success').html(arr[0]);
//					$('.renshuDetail span').html(data.DoTheTask);
//					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+'0'+"&urlKey=&"+data.DoTheTask_url);
//					var arrnum=[data.DoTheTask,data.UntreatedQuantity,data.volume,data.Visit];
//					var items=[];
//					for (var i = 0; i < arr.length; i++) {
//						if (i==0) {
//						items.push('<li class="shuzhi_detailz'+i+' displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
//						}else{
//						items.push('<li class="shuzhi_detailz'+i+' " data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
//						}
//					}
//					$(".shuzhi").html(items.join(''));
//					tabitems.push("<thead><tr><th>级别</th><th>数量</th></tr></thead>");
//					tabitems.push("<tbody>")
//					for (obj in data.DoTheTask_list) {
//						
//						tabitems.push("<tr><td>");
//						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+data.DoTheTask_list[obj].urlV+"&urlKey=&"+data.DoTheTask_list[obj].urlKey+"'>"+data.DoTheTask_list[obj].title+"</a>")
//						tabitems.push("</td><td>")
//						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+data.DoTheTask_list[obj].urlV+"&urlKey=&"+data.DoTheTask_list[obj].urlKey+"'>"+data.DoTheTask_list[obj].count+"</a>")
//						tabitems.push("</td></tr>");
//					}
//				}else if (res.userInfo.groupid==33) {//总部角色的首次数据渲染
//					arr=["新增成交","新增线索","超时未处理","新增任务"];
//					$('.success').html(arr[0]);
//					$('.renshuDetail span').html(data.volume);
//					
//					var strDemo='<div class="renshu"><p class="renshuDetail"><span>'+ data.volume+'</span></p><p class="success">新增成交</p></div>'
//					$('.a_wrap').html(strDemo);
//					var arrnum=[data.volume,data.CueQuantity,data.UntreatedQuantity,data.TaskQuantity];
//					var items=[];
//					for (var i = 0; i < arr.length; i++) {
//						if (i==0) {
//						items.push('<li class="shuzhi_detailzb'+i+' displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
//						
//						}else{
//						items.push('<li class="shuzhi_detailzb'+i+'" data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
//						}
//					}
//					$(".shuzhi").html(items.join(''));
//					
//				
//					tabitems.push("<thead><tr><th>区域</th><th>成交量</th></tr></thead>");
//					tabitems.push("<tbody>")
//					for (obj in data.volume_list) {
//						tabitems.push("<tr><td>");
//						tabitems.push(data.volume_list[obj].title)
//						tabitems.push("</td><td>")
//						tabitems.push(data.volume_list[obj].count)
//						tabitems.push("</td></tr>");
//					}
//					tabitems.push("</tbody>");
//				}else if (res.userInfo.groupid==28) {//大区角色的首次数据渲染
//					arr=["新增成交","新增线索","超时未处理","新增任务"];
//					$('.success').html(arr[0]);
//					$('.renshuDetail span').html(data.volume);
//					var strDemo='<div class="renshu"><p class="renshuDetail"><span>'+ data.volume+'</span></p><p class="success">新增成交</p></div>'
//					$('.a_wrap').html(strDemo);
//					var arrnum=[data.volume,data.CueQuantity,data.UntreatedQuantity,data.TaskQuantity];
//					var items=[];
//					for (var i = 0; i < arr.length; i++) {
//						if (i==0) {
//						items.push('<li class="shuzhi_detail displayNone" data-id="'+arr[i]+'">'+ arrnum[i]+'</li>')
//						
//						}else{
//						items.push('<li class="shuzhi_detail " data-id="'+arr[i]+'">'+arrnum[i]+'</li>')
//						}
//					}
//					$(".shuzhi").html(items.join(''));
//					
//				
//					tabitems.push("<thead><tr><th>区域</th><th>成交量</th></tr></thead>");
//					tabitems.push("<tbody>")
//					for (obj in data.volume_list) {
//						tabitems.push("<tr><td>");
//						tabitems.push(data.volume_list[obj].title)
//						tabitems.push("</td><td>")
//						tabitems.push(data.volume_list[obj].count)
//						tabitems.push("</td></tr>");
//					}
//					tabitems.push("</tbody>");
//				}
//				//公共的banner渲染
//				$(".box").html(tabitems.join(''));
//	}

	//导航的选择效果
	$("#nav_box_content").on("click", "li", function() {
		$(this).addClass("ft_default").siblings().removeClass("ft_default");
		//判断是本周的页面还是本日的或者本月的页面
		common.loading('show');
	    $.ajax({
			type: "get",
			_url:'http://dma.dfsk.com.cn/',
			url: common._url+"appapi?"+"type="+($(this).index()+1),
			async: true,
			dataType:"jsonp",
			success: function(res) {
				response=res;
				common.loading('hide');
				navBoard(response);
				dataRender (0);
		    }
		});
		common.jsonpError();
	})
	//banner图中的切换选择效果
	$(".shuzhi ").on("click",'li',function() {
		//banner内的内容渲染
		$(this).addClass("displayNone").siblings().removeClass("displayNone");
			
        $(this).parents(".banner_detail").find(".renshuDetail").find("span").html($(this).html());
        
		$(this).parents(".banner_detail").find(".success").html($(this).attr("data-id"));
		
		//banner外的内容渲染
		var index = $(this).index();
		dataRender(index);	
	})
	
	//除了第一次以外渲染数据的方法
	function dataRender (index) {
		if (groupid=='32') {
			//电销员的数据渲染
			if (index=='0') {
					//待办任务
					$('.renshuDetail span').html(data.DoTheTask);
					
					arr=["待办任务","邀约成功","超时任务","回访次数"];
					$('.success').html(arr[0]);
					$('.renshuDetail span').html(data.DoTheTask);
					
					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+'0'+"&urlKey="+data.DoTheTask_url);
					
					var	tabitems=[];
					tabitems.push("<thead><tr><th>状态</th><th>数量</th></tr></thead>");
					tabitems.push("<tbody>")
					
					for (obj in data.DoTheTask_list) {
						tabitems.push("<tr><td>");
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.DoTheTask_list[obj].data.urlV+"&urlKey=&"+ encodeURI(data.DoTheTask_list[obj].data.urlKey)+"'>"+data.DoTheTask_list[obj].title+"</a>")
						tabitems.push("</td><td>")
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.DoTheTask_list[obj].data.urlV+"&urlKey=&"+ encodeURI(data.DoTheTask_list[obj].data.urlKey)+"'>"+data.DoTheTask_list[obj].data.count+"</a>")
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");
					checkPaiming();
					$(".box").html(tabitems.join(''));
			} else if(index=='1'){
				//邀约成功
					$('.renshuDetail span').html(data.InviteSuccess);
					var	tabitems=[];
					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+'0'+"&urlKey=&"+data.InviteSuccess_url);
					
					tabitems.push("<thead><tr><th>意向车系</th><th>数量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.InviteSuccess_list) {

						tabitems.push("<tr><td>");
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.InviteSuccess_list[obj].urlV+"&urlKey=&"+ data.InviteSuccess_list[obj].urlKey+"'>"+data.InviteSuccess_list[obj].title+"</a>")
						tabitems.push("</td><td>")
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.InviteSuccess_list[obj].urlV+"&urlKey=&"+ data.InviteSuccess_list[obj].urlKey+"'>"+data.InviteSuccess_list[obj].count+"</a>")
						tabitems.push("</td></tr>");


						
					}
					tabitems.push("</tbody>");	
					checkPaiming();
					$(".box").html(tabitems.join(''));
			} else if (index=='2') {
			
				//超时未处理量
					$('.renshuDetail span').html(data.UntreatedQuantity);
					
					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+'0'+"&urlKey=&"+data.UntreatedQuantity_url);

					var	tabitems=[];
					tabitems.push("<thead><tr><th>状态</th><th>超时数量</th></tr></thead>");
					tabitems.push("<tbody>")
//					tabitems.push("<tr><a href='#'><td>超时未处理量</td><td>"+data.UntreatedQuantity+"</td></a></tr>");
					
					for (obj in data.UntreatedQuantity_list) {
//						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?urlV="+data.UntreatedQuantity_list[obj].data.urlV+"&urlKey='"+ data.UntreatedQuantity_list[obj].data.urlKey+">"+data.UntreatedQuantity_list[obj].title+"</a>")
						tabitems.push("<tr><td>");
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.UntreatedQuantity_list[obj].data.urlV+"&urlKey=&"+ data.UntreatedQuantity_list[obj].data.urlKey+"'>"+data.UntreatedQuantity_list[obj].title+"</a>")
						tabitems.push("</td><td>")
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.UntreatedQuantity_list[obj].data.urlV+"&urlKey=&"+ data.UntreatedQuantity_list[obj].data.urlKey+"'>"+data.UntreatedQuantity_list[obj].data.count+"</a>")
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");	
					checkPaiming();
					$(".box").html(tabitems.join(''));
			}else if(index=='3'){
				//回访总次数
					$('.renshuDetail span').html(data.Visit);
					var	tabitems=[];
					$(".sykb_tit").attr("href","javascript:void(0);");
					tabitems.push("<thead><tr><th>渠道</th><th>回访数量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.Visit_list) {
						tabitems.push("<tr><td>");
						tabitems.push(data.Visit_list[obj].title)		
						tabitems.push("</td><td>")
						tabitems.push(data.Visit_list[obj].count)
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");	
					$(".myPM_wrap").removeClass("displayNone");
					$(".box").html(tabitems.join(''));
			}
		} else if(groupid=='26'){
			//直销员的数据渲染
			if (index=='0') {
					//待办任务
					$('.renshuDetail span').html(data.DoTheTask);
					
					var	tabitems=[];
//					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+res.data.type+"&urlV="+'0'+"&urlKey="+data.DoTheTask_url);
					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+'0'+"&urlKey=&"+data.DoTheTask_url);
					
					tabitems.push("<thead><tr><th>级别</th><th>数量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.DoTheTask_list) {
//						console.log(data.DoTheTask_list[obj]);
						tabitems.push("<tr><td>");
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.DoTheTask_list[obj].urlV+"&urlKey=&"+data.DoTheTask_list[obj].urlKey+"'>"+data.DoTheTask_list[obj].title+"</a>")
						tabitems.push("</td><td>")
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.DoTheTask_list[obj].urlV+"&urlKey=&"+data.DoTheTask_list[obj].urlKey+"'>"+data.DoTheTask_list[obj].count+"</a>")
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");
			} else if(index=='1'){
				//超时未处理量
					$('.renshuDetail span').html(data.UntreatedQuantity);
					
					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+'0'+"&urlKey=&"+data.UntreatedQuantity_url);
					
					var	tabitems=[];
					
					tabitems.push("<thead><tr><th>状态</th><th>超时数量</th></tr></thead>");
					tabitems.push("<tbody>");
//					tabitems.push("<tr><td>超时未处理量</td><td>"+data.UntreatedQuantity+"</td></tr>");
					
					for (obj in data.UntreatedQuantity_list) {
					
//						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?urlV="+data.UntreatedQuantity_list[obj].data.urlV+"&urlKey='"+ data.UntreatedQuantity_list[obj].data.urlKey+">"+data.UntreatedQuantity_list[obj].title+"</a>")
						tabitems.push("<tr><td>");
						
						if (data.UntreatedQuantity_list[obj].title) {
							tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.UntreatedQuantity_list[obj].urlV+"&urlKey=&"+ data.UntreatedQuantity_list[obj].urlKey+"'>"+data.UntreatedQuantity_list[obj].title+"</a>")
						} else{
							tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.UntreatedQuantity_list[obj].urlV+"&urlKey=&"+ data.UntreatedQuantity_list[obj].urlKey+"'>"+'未知'+"</a>")
						}
						
						tabitems.push("</td><td>")
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.UntreatedQuantity_list[obj].urlV+"&urlKey=&"+ data.UntreatedQuantity_list[obj].urlKey+"'>"+data.UntreatedQuantity_list[obj].count+"</a>")
						tabitems.push("</td></tr>");
					}
					
					
					tabitems.push("</tbody>");				
			} else if (index=='2') {
				//到店成交
					$('.renshuDetail span').html(data.volume);
					$(".sykb_tit").attr("href",common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+'0'+"&urlKey="+data.volume_url);
					var	tabitems=[];
					tabitems.push("<thead><tr><th>车系</th><th>数量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.volume_list) {
						
						tabitems.push("<tr><td>");
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.volume_list[obj].urlV+"&urlKey="+ data.volume_list[obj].urlKey+"'>"+data.volume_list[obj].title+"</a>")
						tabitems.push("</td><td>")
						tabitems.push("<a style='display:block' href='"+common._urlFile+"xs_liebiao.html?type="+response.data.type+"&urlV="+data.volume_list[obj].urlV+"&urlKey="+ data.volume_list[obj].urlKey+"'>"+data.volume_list[obj].count+"</a>")
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");				
					
			}else if(index=='3'){
				//回访总次数
					$('.renshuDetail span').html(data.Visit);
					var	tabitems=[];
					$(".sykb_tit").attr("href","javascript:void(0);");
					tabitems.push("<thead><tr><th>渠道</th><th>回访数量</th></tr></thead>");
					tabitems.push("<tbody>")
//					tabitems.push("<tr><td>回访总次数</td><td>"+data.Visit+"</td></tr>");
					for (obj in data.Visit_list) {
						tabitems.push("<tr><td>");
						tabitems.push(data.Visit_list[obj].title)
						tabitems.push("</td><td>")
						tabitems.push(data.Visit_list[obj].count)
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");				
			}
		
		} else if(groupid=='33') {
			//总部的数据渲染
			if (index=='0') {
					//新增成交
					$('.renshuDetail span').html(data.volume);
					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th><th>成交量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.volume_list) {
						tabitems.push("<tr><td>");
						tabitems.push(data.volume_list[obj].title)
						tabitems.push("</td><td>")
						tabitems.push(data.volume_list[obj].count)
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");
			} else if(index=='1'){
				//新增线索
					$('.renshuDetail span').html(data.CueQuantity);
					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th><th>新增线索量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.CueQuantity_list) {
						tabitems.push("<tr><td>");
						tabitems.push(data.CueQuantity_list[obj].title)
						tabitems.push("</td><td>")
						tabitems.push(data.CueQuantity_list[obj].count)
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");
			} else if (index=='2') {
				//超时未处理量
					$('.renshuDetail span').html(data.UntreatedQuantity);
					var len = data.UntreatedQuantity_list.length;
					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th>");
					for (obj in data.UntreatedQuantity_list) {
							tabitems.push("<th>"+data.UntreatedQuantity_list[obj].title+"</th>");
					}
					tabitems.push("</tr></thead>>");
					tabitems.push("<tbody>");
					if(len>0){
						var UntreatedQuantity_list=data.UntreatedQuantity_list[len-1];
						for (obj in UntreatedQuantity_list.data) {
							tabitems.push("<tr><td>");
							tabitems.push(UntreatedQuantity_list.data[obj].title)
							tabitems.push("</td>")
							
							for(var i=0;i<len;i++){
								tabitems.push("<td>");
								tabitems.push(data.UntreatedQuantity_list[i].data[obj].count)
								tabitems.push("</td>")
							}
							tabitems.push("</tr>")
						}
					}
					tabitems.push("</tbody>");	
			}else if(index=='3'){
				//新增任务
					$('.renshuDetail span').html(data.TaskQuantity);
					var len = data.TaskQuantity_list.length;
					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th>");
					for (obj in data.TaskQuantity_list) {
							tabitems.push("<th>"+data.TaskQuantity_list[obj].title+"</th>");
					}
					tabitems.push("</tr></thead>>");
					tabitems.push("<tbody>");
					if(len>0){
						var TaskQuantity_list=data.TaskQuantity_list[len-1];
						for (obj in TaskQuantity_list.data) {
							tabitems.push("<tr><td>");
							tabitems.push(TaskQuantity_list.data[obj].title)
							tabitems.push("</td>")
					
							for(var i=0;i<len;i++){
								tabitems.push("<td>");
								tabitems.push(data.TaskQuantity_list[i].data[obj].count)
								tabitems.push("</td>")
								
							}
							tabitems.push("</tr>")
						}
					}
					tabitems.push("</tbody>");	
			}
		} else if(groupid=='28') {
			//大区的数据渲染
			if (index=='0') {
					//新增成交
					$('.renshuDetail span').html(data.volume);
					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th><th>成交量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.volume_list) {
						tabitems.push("<tr><td>");
						tabitems.push(data.volume_list[obj].title)
						tabitems.push("</td><td>")
						tabitems.push(data.volume_list[obj].count)
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");
			} else if(index=='1'){
				//新增线索
					$('.renshuDetail span').html(data.CueQuantity);
					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th><th>成交量</th></tr></thead>");
					tabitems.push("<tbody>")
					for (obj in data.CueQuantity_list) {
						tabitems.push("<tr><td>");
						tabitems.push(data.CueQuantity_list[obj].title)
						tabitems.push("</td><td>")
						tabitems.push(data.CueQuantity_list[obj].count)
						tabitems.push("</td></tr>");
					}
					tabitems.push("</tbody>");
			} else if (index=='2') {
				//超时未处理量
					$('.renshuDetail span').html(data.UntreatedQuantity);
					var len = data.UntreatedQuantity_list.length;
					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th>");
					for (obj in data.UntreatedQuantity_list) {
							tabitems.push("<th>"+data.UntreatedQuantity_list[obj].title+"</th>");
					}
					tabitems.push("</tr></thead>>");
					tabitems.push("<tbody>");
					if(len>0){
						var UntreatedQuantity_list=data.UntreatedQuantity_list[len-1];
						for (obj in UntreatedQuantity_list.data) {
							tabitems.push("<tr><td>");
							tabitems.push(UntreatedQuantity_list.data[obj].title)
							tabitems.push("</td>")
							
							for(var i=0;i<len;i++){
								tabitems.push("<td>");
								tabitems.push(data.UntreatedQuantity_list[i].data[obj].count)
								tabitems.push("</td>")
							}
							tabitems.push("</tr>")
						}
					}
					tabitems.push("</tbody>");	
			}else if(index=='3'){
				//新增任务
					$('.renshuDetail span').html(data.TaskQuantity);
					var len = data.TaskQuantity_list.length;

					var	tabitems=[];
					tabitems.push("<thead><tr><th>区域</th>");
					for (obj in data.TaskQuantity_list) {
							tabitems.push("<th>"+data.TaskQuantity_list[obj].title+"</th>");
					}
					tabitems.push("</tr></thead>>");
					tabitems.push("<tbody>");
					if(len>0){
						var TaskQuantity_list=data.TaskQuantity_list[len-1];
						for (obj in TaskQuantity_list.data) {
							tabitems.push("<tr><td>");
							tabitems.push(TaskQuantity_list.data[obj].title)
							tabitems.push("</td>")
							console.log()
							for(var i=0;i<len;i++){
								tabitems.push("<td>");
								tabitems.push(data.UntreatedQuantity_list[i].data[obj].count)
								tabitems.push("</td>")
								
							}
							tabitems.push("</tr>")
						}
					}
					tabitems.push("</tbody>");	
			}
		}
		$(".box").html(tabitems.join(''));	
	}
	
	//检测是否含有 我的排名的类名
	function checkPaiming () {
			$(".myPM_wrap").addClass("displayNone")
	}
})