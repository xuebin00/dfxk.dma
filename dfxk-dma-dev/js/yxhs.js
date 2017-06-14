$(function(){	
		var winH = $(window).height();
		var oList = $("#question_list");
		var aP = oList.find("p");
		var aUl = oList.find("ul");
		var onOff=true;
		var oldIndex;
		for(var i=0;i<aP.length;i++){
			aP[i].index=i;
			
			aP[i].onclick=function(){

				var Pid=this.index;
				//数据请求
				$.ajax({
					type: "get",
					url:"http://dma.phpleague.cn/appapi/"+"getwords?"+"id="+Pid,
					async: true,
					dataType:"jsonp",
					async: true,
					success: function(res) {
						common.loading('hide');
						//外部列表每一个xiang
						var detailArr=[];
						for (var i = 0; i < res.data.length; i++) {
//							console.log(res.data[i].title)
							detailArr.push("<li>"+res.data[i].title+"</li>")
						}
						$(".detail_question").eq(Pid).html(detailArr.join(""));
						
						
						//弹出框的的的弹出控制
						$(".detail_question li").on("click",function() {
							$(".detail_question li").css("color","black");
							//记录点击的是哪一个li
							var dindex=	$(this).index();
						//痛点和方法的数据渲染
							$(".tongdian").html("痛点:"+res.data[dindex].title);
							$(".fangfa").html("方法:"+res.data[dindex].desc);
							var arr=[];
							arr =res.data[dindex].con.split("@#$");
							var conArr=[];
							for (var i = 0; i < arr.length; i++) {
								if (arr[i].length==0) {
									continue;
								}
								conArr.push('<div class="innerContent_detail"><span>'+arr[i].substring(0,1)+'</span>'+arr[i].substring(2)+'</div>')
							
							}
							$("#innerContent_detail_wrap").html(conArr.join(''));
						
							
						//点击之后列表样式的变化	
							$(this).css("color","#0097D8");
							$("#head").addClass("displayNone");
							$(".innerHS").removeClass("displayNone");	
						})
					}
				});
				//点击大标题到时候要进行当前标题的筛选如果是当前标题就隐藏活展示，如果是其他标签就显示其他标签
				if(oldIndex!=this.index){
					onOff=true;
				}
				if(onOff){
					for(var i=0;i<aP.length;i++){
						aUl[i].style.display="none";
						aP[i].className="question";
					};
					this.className="active";
					aUl[this.index].style.display="block";
				}else{
					for(var i=0;i<aP.length;i++){
						aUl[i].style.display="none";
						aP[i].className="question";
					};
				}
				onOff=!onOff;
				oldIndex=this.index;
			}
		};
		//按钮后退隐藏弹出层的功能
		$("#inner_head .head_back").on("click",function() {
			//将弹出层去掉
			$(".innerHS").addClass("displayNone");
			//将隐藏的头部展示出来
			$("#head").removeClass("displayNone");
		})
		//打开纵向滚动条
		$("body,html").height(winH  + "px").css("overflow", "hidden");
		$(".innerHS").height(winH  + "px").css("overflow-y", "scroll");
})