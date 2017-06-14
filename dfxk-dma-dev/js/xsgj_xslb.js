$( function () {

	var htmlinit = true;
	//解决移动端click事件延迟
	var winH = $( window ).innerHeight();
	FastClick.attach( document.body );

	var time1 = $( "#beginTime" ).val(),
		time2 = $( "#endTime" ).val(),
		page = $( "#current_page" ).val();

	//今日
	var Today = getDay();

	//清楚 默认选中 快捷方法
	//调用滚动条
	window.onload = function () {
		$( '.wrapper' ).navbarscroll();
	}
	//导航的点击
	$( '.ft_nav ul' ).on( 'click', ".tab_but", function () {
		htmlinit = false;
		page = 1;
		$( this ).addClass( 'ft_default' ).siblings().removeClass( 'ft_default' );
		$( "#conlist" ).empty();
		$( '#shortcut_li li' ).removeClass( "act" );
		input_empty();
		if ( $( '.ft_nav .ft_default' ).text() == "今天" ) {
			clearstyle();
			time2 = time1 = Today;
			$( "#beginTime" ).val( Today );
			$( "#endTime" ).val( Today );
			Ajax();
		} else if ( $( '.ft_nav .ft_default' ).text() == "本周" ) {
			clearstyle();
			time1 = getWeekStartDate();
			time2 = getDay();
			$( "#beginTime" ).val( getWeekStartDate() );
			$( "#endTime" ).val( getDay() );
			Ajax();
		} else {
			return;
		}
	} );

	//清空筛选数据
	function input_empty() {
		$( "#LZ" ).attr( "value", "" );
		$( "#BChannelId" ).attr( "value", "" );
		$( "#BLevelId" ).attr( "value", "" );
		$( "#BSeriesclassId" ).attr( "value", "" );
		$( "#BLevelId" ).attr( "value", "" );
		$( "#urlKey" ).attr( "value", "" );
		arrchannel.length = 0;
		arrseriesclass.length = 0;

	}

	//快捷按钮 点击 筛选

	$( '#shortcut_li' ).on( "click", "li", function () {
		$( "#conlist" ).empty();
		htmlinit = false;
		page = 1;
		$( this ).addClass( "act" ).siblings( "li" ).removeClass( "act" );

		$( "#LZ" ).val( $( this ).attr( "data" ) );
		time_if();
	} )

	//快捷日期筛选  日期判断
	function time_if() {
		if ( $( '.ft_nav .ft_default' ).text() == "今天" ) {
			time2 = time1 = Today;
			Ajax();
		} else if ( $( '.ft_nav .ft_default' ).text() == "本周" ) {
			time1 = getWeekStartDate();
			time2 = getDay();
			Ajax();
		} else {

			Ajax( "more" );
		}
	}
	window.time_if = time_if;
	//查看更多  
	$( ".zhanwei_tab" ).on( "click", function () {
		if ( $( this ).attr( "data-if" ) == "false" ) {
			var n = Math.ceil( $( "#total" ).val() / $( "#per_page" ).val() );
			page++;
			if ( page >= n ) {
				$( this ).attr( "data-if", "true" ).html( "暂无更多数据" );
			}
			time_if();
		}

	} )

	//更多筛选的点击

	$( ".ft_menu" ).click( function () {
		//控制弹出层是从上面滑下来的
		$( "#content" ).height( winH + "px" );
		$( ".mean_slide_box" ).height( winH + "px" );
		if ( $( this ).find( "img" ).hasClass( "tranform180" ) ) {
			$( this ).find( "img" ).removeClass( "tranform180" );
		} else {
			$( this ).find( "img" ).addClass( "tranform180" );
		}
		$( ".mean_slide_box" ).slideToggle();
	} )

	//控制线索状态的箭头的上下转动
	$( ".tit_wrap_det" ).on( "click", function () {
		if ( $( this ).find( "img" ).hasClass( "tranform180" ) ) {
			$( this ).find( "img" ).removeClass( "tranform180" );

			$( this ).parent( ".tit_wrap" ).siblings( ".gn_module" ).find( "ul" ).css( "height", ".88rem" );
		} else {
			$( this ).find( "img" ).addClass( "tranform180" );
			$( this ).parent( ".tit_wrap" ).siblings( ".gn_module" ).find( "ul" ).css( "height", "auto" );

		}
	} )

	//单选  点击 赋值 添加 样式
	$( "#states,#level" ).on( "click", " li", function () {
		if ( !$( this ).find( "p" ).hasClass( "active" ) ) {
			$( this ).parents( ".xszt" ).find( ".tit_sel" ).html( $( this ).find( "p" ).html() ).css( "color", "#FF422E" );
			$( this ).find( "p" ).addClass( "active" ).parent().siblings( "li" ).find( "p" ).removeClass( "active" );
		} else {
			$( this ).parents( ".xszt" ).find( ".tit_sel" ).html( "全部" ).css( "color", "#878785" );
			$( this ).find( "p" ).removeClass( "active" )
		}
	} )
	//多选 点击 赋值 添加样式
	$( "#channel,#seriesclass" ).on( "click", " li", function () {
		if ( !$( this ).find( "p" ).hasClass( "active" ) ) {
			$( this ).parents( ".xszt" ).find( ".tit_sel" ).html( "多选" ).css( "color", "#FF422E" );
			$( this ).find( "p" ).addClass( "active" );
		} else {
			$( this ).find( "p" ).removeClass( "active" )
			if ( !$( this ).parent().find( "p" ).hasClass( "active" ) ) {
				$( this ).parents( ".xszt" ).find( ".tit_sel" ).html( "全部" ).css( "color", "#878785" );
			}
		}
	} )

	//清空 更多筛选 样式
	function clearstyle() {
		$( ".mean_slide_box" ).find( "*" ).removeClass( "li_md active" );
		$( ".tit_sel" ).text( "全部" ).css( "color", "#878785" );
	}

	//调用时间控件
	var calendar1 = new LCalendar();
	//开始最大时间
	function maxdate() {

		var time2 = $( "#demo2" ).val();
		if ( time2 != '' ) {
			return time2;
		} else {
			return new Date().getFullYear() + '-' + ( new Date().getMonth() + 1 ) + '-' + new Date().getDate();
		}
	}

	//结束 最小时间
	function endMinDate() {
		var time1 = $( "#demo1" ).val();
		if ( time1 != '' ) {
			return time1;
		} else {
			return new Date().getFullYear() + '-' + ( new Date().getMonth() - 3 ) + '-' + new Date().getDate()
		}
	}
	calendar1.init( {
		'trigger': '#demo1', //标签id
		'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
		'minDate': '2000-01-01', //最小日期
		'maxDate': maxdate() //最大日期
	} );

	var calendar2 = new LCalendar();
	calendar2.init( {
		'trigger': '#demo2', //标签id
		'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
		'minDate': '2000-01-01', //最小日期
		'maxDate': new Date().getFullYear() + '-' + ( new Date().getMonth() + 1 ) + '-' + new Date().getDate() //最大日期
	} );

	var arrchannel = [],
		arrLi = '',
		channel = '',
		states = '',
		seriesclass = '',
		arrseriesclass = [],
		level = '';

	//点击提交筛选参数
	$( ".yjm-btn" ).on( "click", function () {
		if ( $( this ).attr( "data" ) == "off" ) {
			$( this ).attr( "data", "on" );
			page = 1;
			input_empty();
			$( "#conlist" ).empty(); //清空列表内容
			common.loading( "show" );
			channel = $( "#channel" );
			var dataArr = [];

			var time1 = $( "#demo1" ).val();
			var time2 = $( "#demo2" ).val();
			if ( time1 == '' ) {
				time1 = Today;
			} else {
				time1 = $( "#demo1" ).val();
			}

			if ( time2 == '' ) {
				time2 = Today;
			} else {
				time2 = $( "#demo2" ).val();
			}
			$( "#beginTime" ).val( time1 );
			$( "#endTime" ).val( time2 );

			if ( time2 < time1 ) {
				common.pop( '起始时间不正确' );
				common.loading( "" );
				$( ".yjm-btn" ).attr( "data", 'off' );
				return;
			}

			dataArr = {
				page: page, //当前页
				beginTime: time1, //开始时间
				endTime: time2 //结束时间
			};
			for ( var i = 0; i < channel.find( ".active" ).length; i++ ) {
				arrLi = channel.find( " .active" ).eq( i ).attr( "data" );
				arrchannel.push( arrLi );
			}
			var arrchannelstr = arrchannel.join( '&' );
			objVal = init( '?' + arrchannelstr, 2 );
			$.extend( dataArr, objVal );

			$( "#BChannelId" ).val( arrchannel ); //渠道

			seriesclass = $( "#seriesclass" );
			for ( var i = 0; i < seriesclass.find( ".active" ).length; i++ ) {
				arrLi = seriesclass.find( ".active" ).eq( i ).attr( "data" );
				arrseriesclass.push( arrLi );
			}

			var arrseriesstr = arrseriesclass.join( '&' );
			objVal = init( '?' + arrseriesstr, 2 );
			$.extend( dataArr, objVal );
			$( "#BSeriesclassId" ).val( arrseriesclass ); //车系

			//线索
			states = [ $( "#states .active" ).attr( "data" ) ];

			objVal = init( '?' + states, 2 );
			$.extend( dataArr, objVal );

			$( "#LZ" ).val( $( "#states .active" ).attr( "data" ) );

			level = [ $( "#level" ).find( ".active" ).attr( "data" ) ];
			objVal = init( '?' + level, 2 );
			$.extend( dataArr, objVal );
			//线索级别
			$( "#BLevelId" ).val( $( "#level" ).find( ".active" ).attr( "data" ) );
			$.ajax( {
				type: "get",
				url: common._url + "appapi/caller",
				data: dataArr,
				dataType: "jsonp",
				success: function ( data ) {
					common.loading( "" );
					appedlist( data );
				}
			} );
			common.jsonpError();

		}

	} )

	init( url, 1 )

	initdata( init( url, 1 ) );

	function initdata( data ) {

		$( "#beginTime" ).val( data.beginTime );
		$( "#endTime" ).val( data.endTime );
		$( "#LZ" ).val( data.LZ );
		$( "#BLevelId" ).val( data.BLevelId );
		$( "#BChannelId" ).val( data.BChannelId );
	}

	//线索修改完毕后退时回调方法

	function Ajax( w ) {
		common.loading( "show" );
		var clearfix_li = [ $( "#LZ" ).val() ],
			BChannelId = [ $( "#BChannelId" ).val() ],
			beginTime = $( "#beginTime" ).val(),
			endTime = $( "#endTime" ).val(),
			BSeriesclassId = [ $( "#BSeriesclassId" ).val() ],
			BLevelId = [ $( "#BLevelId" ).val() ],
			url = init( $( "#urlKey" ).val(), 1 ),
			dataArr = {
				page: page, //当前页
				beginTime: time1, //开始时间
				endTime: time2 //结束时间
			};
		dataArr = $.extend( {}, dataArr, url );
		//添加 线索
		if ( w == "more" ) {
			//添加 线索
			if ( clearfix_li != '' ) {
				objVal = init( '?' + clearfix_li, 2 );
				dataArr = $.extend( {}, dataArr, objVal );
			} else {
				delete dataArr.LZ;
			}

			//添加渠道
			if ( BChannelId != '' ) {
				var BChannelIdstr = BChannelId.join( '&' ).split( "," ).join( "&" );
				objVal = init( '?' + BChannelIdstr, 2 );
				dataArr = $.extend( {}, dataArr, objVal );
			} else {
				delete dataArr.BChannelId;
			}
			//添加开始时间
			if ( beginTime != '' ) {

				dataArr.beginTime = beginTime;
			} else {
				delete dataArr.beginTime;
			}
			//添加结束时间
			if ( endTime != '' ) {
				dataArr.endTime = endTime;
			} else {
				delete dataArr.endTime;
			}
			//添加车系
			if ( BSeriesclassId != '' ) {
				var BSeriesclassstr = BSeriesclassId.join( '&' ).split( "," ).join( "&" );
				objVal = init( '?' + BSeriesclassstr, 2 );
				dataArr = $.extend( {}, dataArr, objVal );
			} else {
				delete dataArr.BSeriesclassId;
			}
			//线索级别
			if ( BLevelId != '' ) {

				objVal = init( '?' + BLevelId, 2 );
				dataArr = $.extend( {}, dataArr, objVal );
			} else {
				delete dataArr.BLevelId;
			}

		} else {

			if ( clearfix_li != '' ) {

				objVal = init( '?' + clearfix_li, 2 );

				$.extend( dataArr, objVal );

			} else {
				delete dataArr.LZ;
			}

		}
		$.ajax( {
			type: "get",
			url: common._url + "appapi/caller",
			async: true,
			dataType: 'jsonp',
			data: dataArr,
			success: function ( data ) {
				common.loading( "" );
				if ( data.code != 200 ) {
					return false;
				}
				appedlist( data );
			}
		} );
		common.jsonpError();
	}

	window.time_if = time_if;
} );

/** 
 * 获取本周、本季度、本月、上月的开端日期、停止日期 
 */
var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += ( nowYear < 2000 ) ? 1900 : 0; // 

//格局化日期：yyyy-MM-dd 
function formatDate( date ) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();

	if ( mymonth < 10 ) {
		mymonth = "0" + mymonth;
	}
	if ( myweekday < 10 ) {
		myweekday = "0" + myweekday;
	}
	return ( myyear + "-" + mymonth + "-" + myweekday );
}

//获得本周的开端日期 
function getWeekStartDate() {
	/*var weekStartDate = new Date( nowYear, nowMonth, nowDay - nowDayOfWeek + 1 );
	return formatDate( weekStartDate );*/
	return weekTimeFilter(new Date())['initDate'];
}
//获得本周的停止日期 
function getWeekEndDate() {
	/*var weekEndDate = new Date( nowYear, nowMonth, nowDay + ( 6 - nowDayOfWeek ) + 1 );
	return formatDate( weekEndDate );*/
	return weekTimeFilter(new Date())['finalDate'];
}

function getDay() {
	return formatDate( new Date( nowYear, nowMonth, nowDay ) );
}

function get_Date( tm ) {
	var d = new Date( tm * 1000 ); //根据时间戳生成的时间对象 
	var date = ( d.getFullYear() ) + "-" +
		( d.getMonth() + 1 ) + "-" +
		( d.getDate() ) + " " +
		( d.getHours() ) + ':' +
		( d.getMinutes() );
	return date;
}

function appedlist( data ) {
	common.loading( '' );
	var userInfo = data.userInfo;
	var data = data.data;
	//初始化列表
	var conlist = '',
		list_data = data.list.list.data;
	//总条数
	$( "#total" ).val( data.list.list.total );
	//当前页数
	$( "#current_page" ).val( data.list.list.current_page );
	//每页显示条数
	$( "#per_page" ).val( data.list.list.per_page );
	var series_text = '';
	var _page = 0;

	for ( var i in list_data ) {
		var marktime = '',
			lz = '',
			level = '未知',
			series = '',
			clueId = '';

		var marktitle = '';
		var mackname = '';

		switch ( list_data[ i ].LZ ) {
			case 4099:
			case 9996:
			case 5040:
			case 4005:
			case 4025:
			case 4030:
			case 4040:
			case 5020:
			case 5030:
			case 5035:
				series_text = '查看详情';
				break;
			default:
				series_text = '立即跟进';
				break;
		}

		if ( userInfo.groupid == 32 ) {
			switch ( list_data[ i ].LZ ) {
				case 4010:
					mackname = '预计到店时间';
					break;
				case 4099:
				case 9998:
					series_text = '查看详情';
					mackname = '客户留资时间';
					break;
				case 4020:
				case 4002:
				case 4021:
					mackname = '待跟进时间';
					break;
				default:
					mackname = '客户留资时间';
					break;
			}

			if ( list_data[ i ].marktime != '' && ( list_data[ i ].LZ == 4010 || list_data[ i ].LZ == 4020 || list_data[ i ].LZ == 4021 || list_data[ i ].LZ == 4002 || list_data[ i ].LZ == 4001 ) ) {
				marktime = "<p class='xs_sty_time'>" + mackname + "：<span>" + get_Date( list_data[ i ].marktime ) + "</span >";

			} else {

				marktime = "<p class='xs_sty_time'>" + mackname + "：<span>" + list_data[ i ].createTime + "</span >";
			}

		} else if ( userInfo.groupid == 26 ) {
			switch ( list_data[ i ].LZ ) {
				case 5010:
				case 5011:
				case 5015:
					mackname = '待跟进时间';
					break;
				case 4099:
				case 9998:
					series_text = '立即跟进';
					mackname = '客户留资时间';
					break;
				case 5014:
					mackname = '预计到店时间';
					break;
				default:
					mackname = '客户留资时间';
					break;
			}

			if ( list_data[ i ].marktime != '' && ( list_data[ i ].LZ == 5014 || list_data[ i ].LZ == 5010 || list_data[ i ].LZ == 5011 || list_data[ i ].LZ == 5015 ) ) {
				marktime = "<p class='xs_sty_time'>" + mackname + "：<span>" + get_Date( list_data[ i ].marktime ) + "</span >";

			} else {

				marktime = "<p class='xs_sty_time'>" + mackname + "：<span>" + list_data[ i ].createTime + "</span >";
			}
		}

		var invalidation = '';
		//		if ( list_data[ i ].LZ == 5020 || list_data[ i ].LZ == 5030 ) {

		//			invalidation = "<div class='xs_foot colorBackgroudGray' user-data = 'off'><img class='xs_img_g' src='./images/public_img/whiteRjt.png' /> " + series_text + "</div>";

		//		} else {

		invalidation = "<div class='xs_foot' user-data = 'on'><img class='xs_img' src='./images/public_img/xs_foot_img.png' /> " + series_text + "</div>";
		//		}

		if ( list_data[ i ].BLevelId != 'null' && list_data[ i ].BLevelId != 0 ) {
			level = data.levelmap[ list_data[ i ].BLevelId ];

		}

		if ( list_data[ i ].LZ != 'null' ) {
			lz = data.statesAll[ list_data[ i ].LZ ];
			if ( typeof lz == 'undefined' ) {
				lz = '';
			}
		}
		//新改过的的车型名称
		if ( list_data[ i ].BSeriesId != 'null' ) {
			for ( var n in data.series ) {
				if ( n == list_data[ i ].BSeriesclassId ) {
					for ( var j in data.series[ n ] ) {
						if ( list_data[ i ].BSeriesId == data.series[ n ][ j ].id ) {
							series = data.series[ n ][ j ].title;
						}
					}
				}
			}
		}

		clueId = list_data[ i ].clueId;

		if ( !list_data[ i ].BName ) {
			list_data[ i ].BName = '';
		}

		if ( !series ) {
			series = '未知';
		}

		var BSex = list_data[ i ].BSex,
			BSeximg = '';
		if ( BSex == 0 ) {
			BSeximg = "<img  class = 'BSeximg' src='./images/public_img/sex_2.png'/>";
		} else if ( BSex == 1 ) {
			BSeximg = "<img  class = 'BSeximg' src='./images/public_img/sex_1.png'/>";

		}

		conlist += "<li class='a_href'><a href='javascript:;' data-clueId='" + clueId + "'><div class='xs_head'>\<p class = 'colorRed' >\
						<span> " + level + " </span>级\
						</p> " + lz + " </div><div class='xs_body'>\
						<p class='xs_body_tit'>" + BSeximg + list_data[ i ].BName + "</p>\
						<div class = 'xs_style' ><p class = 'xs_sty_tit' > " + series + " </p>\
						" + marktime + "\
						</div></div>\
						" + invalidation + "\
						<div class='zhanwei '></div></a></li>";

		_page++;
	}
	$( "#conlist" ).append( conlist );
	$( '.yjm-btn' ).attr( "data", "off" );
	$( ".mean_slide_box" ).slideUp();
	if ( _page < data.list.list.per_page ) {
		$( '.zhanwei_tab' ).html( "暂无更多数据" );
		$( ".zhanwei_tab" ).attr( "data-if", "true" );
	} else {
		$( '.zhanwei_tab' ).html( "点击加载更多" );
		$( ".zhanwei_tab" ).attr( "data-if", "false" );
	}
}
var clickOff = true;
$( '.xs_con_Detail' ).on( 'click', '.a_href', function () {
	var clueId = $( this ).find( 'a' ).attr( 'data-clueId' );
	var user_data = $( this ).find( ".xs_foot" ).attr( "user-data" );
	if ( user_data == 'on' && clickOff ) {
		clickOff = false;
		$( this ).addClass( "mark" );
		plus.webview.open( 'xs_xiangqing.html?clueId=' + clueId, 'xiansuoSet', {
			zindex: 9
		}, 'slide-in-right' );
	} else {
		return;
	}
	setTimeout( function () {
		clickOff = true;
	}, 3000 )
} )
//回调
function markcallback() {
	$( "#conlist" ).find( ".mark" ).fadeOut();
}