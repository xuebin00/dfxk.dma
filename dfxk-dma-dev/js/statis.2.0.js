;(function(){
	common.userInfo();
	//调用时间控件
	var pageStart = 1;
	var time = new Date();
	var years = time.getFullYear();
	var mounth = time.getMonth()+1;
	var today = time.getDate();
	var calendar1 = new LCalendar();
	mounth = mounth<10?'0'+mounth:mounth;
	today = today<10?'0'+today:today;
	var getKey = {
		'mounthDate':function(){//当前月日期
			var mdate = [
				years+'-'+mounth+'-01',
				years+'-'+mounth+'-'+today,
			];
			return mdate;
		},
		'qudao':function(){//当前渠道
			var box = $('.j-qudao');
			var key;
			box.children('li').each(function(){
				var $this = $(this);
				if($this.hasClass('cur')){
					key = $this.children('a').attr('data-type');
				}
			})
			return key;
		}
	}
	// 给日期补零
	function filterZero(f_date){
		var f_arr = f_date.split('-');
		var f_mounth = parseInt(f_arr[1]).length<2?'0'+f_arr[1]:f_arr[1];
		var f_day = parseInt(f_arr[2]).length<2?'0'+f_arr[2]:f_arr[2];
		f_date = f_date[0]+'-'+f_mounth+'-'+f_day;
		return f_date;
	}
	// //console.log(getKey.qudao())
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
	
	//初始化日期框
	var beginInput = $('#demo1');
	var endInput = $('#demo2');
	beginInput.val(getKey.mounthDate()[0]);
	endInput.val(getKey.mounthDate()[1]);
	beginInput.attr('placeholder',getKey.mounthDate()[0]);
	endInput.attr('placeholder',getKey.mounthDate()[1]);
	//检索
	$('.searchBtn').click(function(){
		getDataInit();
	})
	//选项卡切换
	$('.j-qudao').on('click','a',function(e){
		var $this = $(this);
		if($this.parent('li').hasClass('cur')){
			return;
		}
		$this.parent('li').addClass('cur').end().parent('li').siblings().removeClass('cur');
		getDataInit();
	});
	//请求数据统一入口
	function getDataInit(){
		var beginTime = $('#demo1').val();
		var endTime = $('#demo2').val();
		var areaId = $('select[name=land]').val();
		var qudao = getKey.qudao();
		if(qudao == 'getArea' && areaId > 0){
			qudao = 'getDelear';
		}
		if(common.filterA(beginTime)<=common.filterA(endTime)){
			getdata({
				'datatype':qudao,//按渠道统计
				'beginTime':beginTime,
				'endTime':endTime,
				'areaId':areaId//全国
			})
		}else{
			common.pop('请选择结束时间大于开始时间')
		}
	}
	//初始化数据
	getDataInit();
	//请求数据
	function getdata(data){
		var piaDataPlant = function(tit,data){
			var ndata = {};
			var len = tit.length;
			for(var i= 0;i< len;i++){
				var arr = [];
				for(var el in data){
					var o = {};
					o.value = data[el][tit[i][0]];
					o.name = data[el]['title'];
					arr.push(o);
				}
				ndata[tit[i][0]] = arr;
			}
			//console.log(ndata)
			return ndata;
		}
		//过滤值为0的数据
		function isEmptyObject(e) {  
		    var t;  
		    for (t in e)  
		        return !1;  
		    return !0  
		}
		function filterZero(data){
			var ndata = {};
			for(var el in data){
				var len = data[el].length;
				var nowArr = [];
				var key = 0;
				for(var i=0;i<len;i++){
					if(data[el][i].value>0){
						nowArr[key] = {};
						nowArr[key]['name'] = data[el][i].name;
						nowArr[key]['value'] = data[el][i].value;
						key++;
					}
				}
				// console.log(isEmptyObject(nowArr));
				ndata[el] = isEmptyObject(nowArr)?0:nowArr;
			}
			return ndata;
		}
		common.loading('show');
		$.ajax({
			type: "post",
			url: common._url+"appapi/statistics",
			dataType: 'jsonp',
			data: data,
			cache: false,
			jsonp: 'callback',
			// jsonpCallback:'islogin',
			success: function(res) {
				if(pageStart){
					var landInput = $('select[name=land]');
					var landData = res.data.AreaList.data;
					for(var el in landData){
						landInput.append('<option value="'+landData[el]['id']+'">'+landData[el]['title']+'</option>')
					}
					pageStart = 0;
				}
				var tit = [
					['conversion','转化率'],
					['total','总线索量'],
					['effective','有效线索量'],
					['toshop','到店线索量'],
					['deal','成交线索量'],
				]
				var piaData = piaDataPlant(tit,res.data.ObjList.data);
				if(data.datatype == 'getActivity' || data.datatype == 'getArea' || data.datatype == 'getDelear'){
					table.viewTable(res.data.ObjList.data);
				}else{
					chartInit(piaData,tit);
				}
				common.loading('hide');
			}
		})
		common.jsonpError();

		// 调试
		/*var res = tongji;
		if(pageStart){
			var landInput = $('select[name=land]');
			var landData = res.data.AreaList.data;
			for(var el in landData){
				landInput.append('<option value="'+landData[el]['id']+'">'+landData[el]['title']+'</option>')
			}
			pageStart = 0;
		}
		var tit = [
			['conversion','转化率'],
			['total','总线索量'],
			['effective','有效线索量'],
			['deal','成交线索量'],
			['toshop','到店线索量'],
		]
		var piaData = piaDataPlant(tit,res.data.ObjList.data);
		chartInit(piaData,tit);*/
		// 调试
	}
	//图表统计
	function chartInit(piaData,piaTit){
		// 基于准备好的dom，初始化echarts图表
		// 柱状图
		var pillarName = [];
		var pillarVal = [];
		for(var el in piaData.conversion){
			pillarName.push(piaData.conversion[el]['name']);
			pillarVal.push(piaData.conversion[el]['value']);
		}
		//console.log(pillarVal)
		//console.log(pillarName)
		//console.log('当前选项卡：'+getKey.qudao())
		var chartBox = $('.chart');
		var leftVal = '3%';
		var boxHeight = (el*30)+100;
		chartBox.html('');
		if(piaData.total == 0){
			chartBox.append('<div style="font-size:.26rem;text-align:center;padding:.3rem 0;">此期间无数据,请修改查询时间</div>');
			return;
		}else{
			/*if(getKey.qudao() == 'getActivity' || getKey.qudao() == 'getArea'){
				chartBox.append('<div id="pillar" style="height:'+(boxHeight)+'px;width:95%;margin:0 auto;"></div>');
				
			}else{
				chartBox.append('<div id="pillar" style="height:'+boxHeight+'px;width:95%;margin:0 auto;"></div>')
			}*/
			chartBox.append('<div id="pillar" style="height:'+boxHeight+'px;width:95%;margin:0 auto;"></div>')
			var myChart = echarts.init(document.getElementById('pillar'));
			var option = {
				grid: {
					left:leftVal,
					top:'10%',
					borderWidth: 0,
					y: 20,
					containLabel: true
				},
				xAxis: [{
					type: 'value',
					show: false
				}],
				yAxis: [{
						type: 'category',
						// data: ["广告", "其他", "微信", "官网", "汽车之家", "天猫", "爱卡汽车"],
						data: pillarName,
					}
				],
				tooltip : {
			        trigger: 'item',
			        formatter: "转化率 : {c}% "
			    },
				series: [{
					"type": "bar",
					"itemStyle": {
						"normal": {
							color: function(params) {
								// build a color map as your need.
								var colorList = [
									'#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
									'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
									'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
								];
								return colorList[params.dataIndex]
							},
							label: {
								show: false,
								position:'right'
							}
						}
					},
					// "data": ["0.0000000", "0.0000000", "0.0000000", "0.0000000", "0.0000000", "0.0000000", "0.0000000"],
					"data": pillarVal,
				}],
				
			};
			// 为echarts对象加载数据
			myChart.setOption(option);
		}
		//饼图
		// //console.log(piaData)
		var len = piaTit.length;
		for(var i=0;i<len;i++){
			var name = piaTit[i][0];
			if(name != 'conversion'){
				pieInit(piaTit[i][0]);
			}
		}
		function pieInit(name){
			chartBox.append('<div id="'+name+'" style="height:380px;width:100%"></div>');
			var pie = echarts.init(document.getElementById(name));
			var titname = [];
			var len = piaData[piaTit[i][0]].length;
			for(var el=0;el<len;el++){
				titname.push(piaData[piaTit[i][0]][el]['name']);
			}
			var option = {
				title : {
			        text: piaTit[i][1],
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{b}<br/> {c} ({d}%)"
			    },
			    /*legend: {
			        orient: 'vertical',
			        x: '20px',
			        y: '40px',
			        data: titname
			    },*/
			    // calculable : true,
				series: [{
					name: '访问来源',
					type: 'pie',
					radius: '60%',
					center: ['50%', '52%'],
					data: piaData[piaTit[i][0]]
					/*data: [
						{ value: 0, name: '直接访问' },
						{ value: 0, name: '邮件营销' },
						{ value: 0, name: '联盟广告' },
						{ value: 0, name: '视频广告' },
						{ value: 0, name: '搜索引擎' }
					]*/
				}]
			};
			// 为echarts对象加载数据
			pie.setOption(option);
		}
	}
	//表格统计
	var table = {
		viewTable:function(data){
			var _this = this;
			var chartBox = $('.chart');
			chartBox.html('');
			function table(name){
				var titleList = '',
					bodyList = '',
					len = data.length;
				for(var s=0;s<len;s++){
					titleList += '<div class="row">'+data[s]['title']+'</div>';
					bodyList += '<div class="row clearfix">'+
									'<div class="cell">'+data[s]['conversion']+'%</div>'+
									'<div class="cell">'+data[s]['total']+'</div>'+
									'<div class="cell">'+data[s]['effective']+'</div>'+
									'<div class="cell">'+data[s]['toshop']+'</div>'+
									'<div class="cell">'+data[s]['deal']+'</div>'+
								'</div>';
				}
				var html = ['<div class="m-table" id="tableBox">',
					'<!--<div class="fixedTit fixed clearfix">',
						'<div class="m-line">',
							'<div class="row nav">经销商</div>',
						'</div>',
						'<div class="m-listBody">',
							'<div class="listBodys">',
								'<div class="row nav clearfix">',
									'<div class="cell">转化率</div>',
									'<div class="cell">总线索量</div>',
									'<div class="cell">有效线索量</div>',
									'<div class="cell">到店线索量</div>',
									'<div class="cell">成交线索量</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>-->',
					'<div class="tableBox clearfix">',
						'<div class="m-line">',
							'<div class="row nav">经销商</div>',
							titleList,
						'</div>',
						'<div class="m-listBody">',
							'<div class="listBodys">',
								'<div class="row nav clearfix">',
									'<div class="cell">转化率</div>',
									'<div class="cell">总线索量</div>',
									'<div class="cell">有效线索量</div>',
									'<div class="cell">到店线索量</div>',
									'<div class="cell">成交线索量</div>',
								'</div>',
								bodyList,
							'</div>',
						'</div>',
					'</div>',
				'</div>',].join('');
				chartBox.append(html);
			}
			table();
			_this.bindScroll();
		},
		bindScroll:function(){
			
		},
		unbindScroll:function(){

		}
	}
})();