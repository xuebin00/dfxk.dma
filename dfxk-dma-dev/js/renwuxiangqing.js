$( function () {
	common.loading( "show" );

	var w_h = window.innerHeight;

	$( "#m_content" ).height( w_h - 101 + 'px' );
	$( ".mengban" ).height( w_h - 50 + 'px' );
	//意向车系  点击弹出弹窗
	$( ".chexing" ).on( 'click', function () {

		$( "#ft_mask" ).fadeIn( 300 );
		$( "#ft_slide_box" ).fadeIn( 300 );
		for ( var i = 0; i < $( "#seriesclass" ).find( "li" ).length; i++ ) {
			if ( $( this ).find( "input" ).attr( "data" ) == $( "#seriesclass" ).find( "span" ).eq( i ).attr( "data" ) ) {
				$( "#seriesclass" ).find( "span" ).eq( i ).addClass( "active" ).siblings().removeClass( "active" );
			}
		}
	} )

	//意向车型  点击弹出弹窗
	$( ".chexi" ).on( 'click', tanchuang )

	function tanchuang() {
		$( "#series" ).height( w_h - 90 + 'px' );

		$( "#ft_mask1" ).fadeIn( 300 );
		$( "#ft_slide_box1" ).fadeIn( 300 );
		for ( var i = 0; i < $( "#series" ).find( "li" ).length; i++ ) {
			if ( $( this ).find( "input" ).attr( "data" ) == $( "#series" ).find( "span" ).eq( i ).attr( "data" ) ) {
				$( "#series" ).find( "span" ).eq( i ).addClass( "active" ).siblings().removeClass( "active" );
			}

		}
	}

	//车系内容 点击  赋值
	$( "#seriesclass" ).on( "click", "li span", function () {
		var that = $( this );
		$( this ).addClass( "active" ).parents( "li" ).siblings().find( "span" ).removeClass( "active" );
		$( ".chexing" ).find( "input" ).val( $( this ).text() ).attr( "data", $( this ).attr( "data" ) );
		BSeriesId( that );
	} )
	// 车型内容 点击  赋值
	$( "#series" ).on( "click", "li span", function () {
		$( this ).addClass( "active" ).parents( "li" ).siblings().find( "span" ).removeClass( "active" );
		$( ".chexi" ).find( "input" ).val( $( this ).text() ).attr( "data", $( this ).attr( "data" ) );

	} )

	//点击关闭弹窗
	$( ".ft_slide_box" ).on( 'click', function () {
		$( ".ft_mask" ).fadeOut( 300 );
		$( ".ft_slide_box" ).fadeOut( 300 );
	} );

	//反馈弹框
	$( ".fankui" ).on( "click", function () {
		if ( $( this ).attr( "data_if" ) != 'off' ) {
			if ( !$( ".m_fankui" ).is( ":animated" ) ) {
				$( ".m_fankui" ).stop( 'true' ).slideToggle();
				$( ".mengban" ).stop( 'true' ).toggle();
				$( "#m_content" ).toggleClass( 'm_ovfl' );
			};
		} else {
			return;
		};

	} );

	//初始化获取 来源的参数值
	function getQueryString( name ) {
		var reg = new RegExp( '(^|&)' + name + '=([^&]*)(&|$)', 'i' );
		var r = window.location.search.substr( 1 ).match( reg );
		if ( r != null ) {
			return unescape( r[ 2 ] );
		}
		return null;
	};

	$( "#clueId" ).val( getQueryString( "clueId" ) );
	var clueId = $( "#clueId" ).val();
	$( ".lishi" ).attr( 'href', common._urlFile + 'xs_lishi.html?clueId=' + clueId );
	$( ".huashu" ).attr( 'href', common._urlFile + 'yingxiaohuashu.html' );
	common.loading( "show" ); // 初始化页面，遮罩层
	$.ajax( {
		type: "get",
		url: common._url + "appapi/callerInfo",
		data: {
			clueId: clueId
		},
		dataType: 'jsonp',
		async: true,
		success: function ( data ) {
			common.loading( "" );
			var group = data.userInfo.groupid;
			$( "#groupid" ).attr( "data", group );
			var userInfo = data.userInfo.userInfo;
			var data = data.data,
				first = data.first,
				clue = data.clue,
				operate = data.operate,
				length = Object.keys( operate ).length;

			//初始化数据加载
			var level = '',
				province = '',
				activity = '',
				media = '',
				seriesclass = '',
				series = '',
				states = '',
				slid_ = '';

			//直销人员列表
			var zxUserlist = data.zxUserlist;
			for ( var i in zxUserlist ) {
				$( "#groupid" ).val( JSON.stringify( data.zxUserlist ) ).attr( "zhixiao", i );
			}

			//标题
			$( ".title " ).text( data.states[ clue[ 'LZ' ] ] );
			//如果是已成交状态，只能预览不能修改
			if ( ( group == 32 && ( clue[ 'LZ' ] == 4099 || clue[ 'LZ' ] == 9998 ) ) || clue[ 'LZ' ] == 9998 || clue[ 'LZ' ] == 5040 || clue[ 'LZ' ] == 9996 || clue[ 'LZ' ] == 4005 || clue[ 'LZ' ] == 4025 || clue[ 'LZ' ] == 4030 || clue[ 'LZ' ] == 4040 || clue[ 'LZ' ] == 5020 || clue[ 'LZ' ] == 5030 || clue[ 'LZ' ] == 5035 ) {
				$( "#BName,#BEmail,#note" ).attr( 'readonly', 'readonly' );
				$( "#BLevelId" ).attr( 'disabled', 'disabled' );
				$( ".chexing,.chexi,#demo1,#zaicigenjinshijian" ).off( 'click' );
				$( "#Note" ).attr( 'readonly', 'readonly' );
				$( ".fankui" ).css( "background-color", "#CCCCCC" ).attr( "data_if", "off" );
				$( "#BXProvinceId,#BSex,#BLevelId" ).off( 'click' ).find( "input" ).attr( 'readonly', 'readonly' );
			} else {
				$( "#BXProvinceId" ).off( "click" );
			}
			console.log( group )
			console.log( clue[ 'LZ' ] )

			switch ( clue[ 'LZ' ] ) {
				case 5010:
				case 5011:
				case 5015:
				case 4020:
				case 4021:
					$( "#demo1" ).siblings( "span" ).text( '待跟进时间：' );
					break;
				case 5035:
				case 5020:
				case 5030:
				case 5040:
				case 4040:
				case 4030:
				case 9998:
				case 4005:
				case 4025:
				case 4001:
				case 4002:
					$( "#demo1" ).parents( "label" ).hide();
					$( "#demo1" ).siblings( "span" ).text( '客户留资时间：' );
					break;
				case 5014:
				case 4010:
					$( "#demo1" ).siblings( "span" ).text( '预计到店时间：' );
					break;
				default:
					$( "#demo1" ).parents( "label" ).show();
					$( "#demo1" ).siblings( "span" ).text( '客户留资时间：' );
					break;
			}

			if ( ( group == 32 && ( clue[ 'LZ' ] == 4099 || clue[ 'LZ' ] == 9998 || clue[ 'LZ' ] == 5001 ) ) || ( group == 26 && ( clue[ 'LZ' ] == 4099 || clue[ 'LZ' ] == 9998 || clue[ 'LZ' ] == 5001 ) ) ) {
				$( "#demo1" ).parents( "label" ).hide();
			}

			$( "#LZ" ).val( clue[ 'LZ' ] );

			//经销商名称
			$( "#jxs_name" ).val( clue[ 'BXDealerName' ] );

			//名称
			$( "#BName" ).val( clue[ 'BName' ] );
			//性别
			if ( clue[ 'BSex' ] == 1 ) {
				$( "#BSex" ).find( "input" ).val( "男" ).attr( "newsex", "1" );
			} else if ( clue[ 'BSex' ] == 0 ) {
				$( "#BSex" ).find( "input" ).val( "女" ).attr( "newsex", "0" );
			} else {
				$( "#BSex" ).find( "input" ).val( "未知" ).attr( "newsex", "-1" );
			}

			//电话
			$( "#BPhone" ).val( clue[ 'BPhone' ] )

			for ( var i in data.province ) {
				if ( i == clue[ 'BXProvinceId' ] ) {
					$( "#BXProvinceId" ).find( "input" ).val( data.province[ clue[ 'BXProvinceId' ] ] + ' ' ).attr( "user-newprovince", i );
				}
			}
			var BXProvinceId_ = $( "#BXProvinceId" ).find( "input" ).val();
			for ( var i in data.city ) {

				if ( i == clue[ 'BXProvinceId' ] ) {
					for ( var j in data.city[ i ] ) {
						if ( data.city[ i ][ j ].REGION_ID == clue[ 'BXCityId' ] ) {

							$( "#BXProvinceId" ).find( "input" ).val( BXProvinceId_ + data.city[ i ][ j ].REGION_NAME + '市' ).attr( "user-newcity", clue[ 'BXCityId' ] );
						}
					}
				}
			}

			$( "#city" ).val( JSON.stringify( data.city ) );
			$( "#cityId" ).val( clue[ 'BXCityId' ] );
			$( "#provincedata" ).val( JSON.stringify( data.province ) );
			$( "#ProvinceId" ).val( clue[ 'BXProvinceId' ] );

			//邮箱 email
			$( "#BEmail" ).val( clue[ 'BEmail' ] )
			//级别  level

			for ( var i in data.level ) {
				if ( data.level[ i ].id == clue[ 'BLevelId' ] ) {
					$( "#BLevelId" ).find( "input" ).val( data.level[ i ].note ).attr( "newlevel", data.level[ i ].id );
				}
			}
			$( "#leveldata" ).val( JSON.stringify( data.level ) );
			$( "#levelID" ).val( clue[ 'BLevelId' ] );
			//			$( "#BLevelId" ).html( level );
			//			$( "#BLevelId" ).find( "option[value='" + clue[ 'BLevelId' ] + "']" ).attr( "selected", "true" );
			//			

			//车系
			for ( var i in data.seriesclass ) {
				seriesclass += '<li><span data=' + i + '>' + data.seriesclass[ i ] + '</span></li>'
			}
			$( "#BSeriesclassId" ).val( data.seriesclass[ clue[ 'BSeriesclassId' ] ] ).attr( "data", clue[ 'BSeriesclassId' ] );
			$( "#seriesclass" ).html( seriesclass );

			//车型
			for ( var i in data.series ) {
				if ( i == clue[ 'BSeriesclassId' ] ) {
					for ( var j in data.series[ i ] ) {
						if ( data.series[ i ][ j ].id == clue[ 'BSeriesId' ] ) {

							$( "#BSeriesId" ).val( data.series[ i ][ j ].title ).attr( "data", data.series[ i ][ j ].id );
							series += '<li><span class="active" data=' + data.series[ i ][ j ].id + '>' + data.series[ i ][ j ].title + '</span></li>';
						} else {

							series += '<li><span data=' + data.series[ i ][ j ].id + '>' + data.series[ i ][ j ].title + '</span></li>';
						}
					}
				}
			}
			$( "#series" ).html( series );
			$( "#seriesdata" ).val( JSON.stringify( data.series ) );
			$( "#seriesID" ).val( clue[ 'BSeriesId' ] );

			//备注 note
			$( "#Note" ).val( clue[ 'Note' ] );
			//预计到店时间

			if ( clue[ 'marktime' ] ) {
				$( "#demo1" ).val( getLocalTime( clue[ 'marktime' ] ) );
			} else {
				$( "#demo1" ).val( '' );
			}
			//渠道

			var bchannl = data.channel[ clue[ 'BChannelId' ] ];
			var bchannldata = data.MultiChannel;
			var bchannllist = '';
			if ( bchannldata.length > 0 ) {
				for ( var i in bchannldata ) {
					for ( var j in data.channel ) {
						if ( bchannldata[ i ] == j ) {
							bchannllist += data.channel[ j ];
						}
					}
				}
				$( "#BChannelId" ).val( bchannl + '+' + bchannllist );
			} else {
				$( "#BChannelId" ).val( bchannl );
			}

			//方式
			$( "#BTypeId" ).val( data.type[ clue[ 'BTypeId' ] ] )
			//留资时间
			if ( clue[ 'createTime' ] ) {
				$( "#createTime" ).val( clue[ 'createTime' ] );
			} else {
				$( "#createTime" ).val( '' );

			}
			//活动
			for ( var i in data.activity ) {
				activity += '<option value="' + i + '">' + data.activity[ i ] + '</option>'
			}
			$( "#BActivityId" ).html( activity );
			$( "#BActivityId" ).find( "option[value='" + clue[ 'BActivityId' ] + "']" ).attr( "selected", "true" );

			//媒体
			for ( var i in data.media ) {
				media += '<option value="' + i + '">' + data.media[ i ] + '</option>'
			}
			$( "#BMediaId" ).html( media );
			$( "#BMediaId" ).find( "option[value='" + clue[ 'BMediaId' ] + "']" ).attr( "selected", "true" );

			//状态

			for ( var i in data.states ) {
				states += '<option value="' + i + '">' + data.states[ i ] + '</option>'
				if ( i == clue[ 'BSt' ] ) {
					$( ".title" ).text( data.states[ i ] );

				}
			}

			//直接拨打电话
			$( "#Tel" ).attr( "href", "tel:" + clue[ 'BPhone' ] );

			//滑动列表

			for ( var i in data.LZS ) {
				slid_ += '<li class="ch_fktc"><span data=' + i + '>' + data.LZS[ i ] + '</span></li>';
			}

			$( "#slid_" ).html( slid_ );

		}
	} );
	common.jsonpError();

	$( "#ch_submit" ).on( "click", function () {
		var BName = '', //称呼
			BEmail = ''; //邮箱
		var BSex = '', //性别
			BXProvinceId = '', //省id
			BXCityId = '', //市ID
			BLevelId = '', //线索级别
			BSeriesclassId = '', // 车系
			BSeriesId = '', //车型
			clueId = '', //线索ID			
			Note = '',
			demo1 = ''; //客户留言
		var lz = '', // 状态码
			note = '', //备注
			marktime = '', //下次时间
			LZ = ''; //状态码

		var newzhixiao = $( "#zhixiaoren" ).attr( "newzhixiao" );

		BEmail = $( "#BEmail" ).val(); //邮箱
		BName = $( "#BName" ).val(); //名称
		clueId = $( "#clueId" ).val(); //线索ID 		
		BSex = $( "#BSex" ).find( "input" ).attr( "newsex" ); //性别
		BXProvinceId = $( "#BXProvinceId" ).find( "input" ).attr( "user-newProvince" ); //地址
		BXCityId = $( "#BXProvinceId" ).find( "input" ).attr( "user-newcity" );
		BLevelId = $( "#BLevelId" ).find( "input" ).attr( "newlevel" ); //线索等级	Id
		BSeriesclassId = $( "#BSeriesclassId" ).attr( "data" ); //意向车系；
		BSeriesId = $( "#BSeriesId" ).attr( "data" ); //意向车型
		Note = $( "#Note" ).val(); //备注
		demo1 = $( "#demo1" ).val(); // 预计到店时间
		LZ = $( "#LZ" ).val(); //状态码

		lz = $( "#newlz" ).val(); //修改后的 线索id

		note = $( "#note" ).val();
		//		if ( lz == 5035 || lz == 5020 || lz == 4040 || lz == 4030 || lz == 4005 ) {
		//			marktime = '';
		//		} else {
		marktime = $( "#zaicigenjinshijian" ).val();

		//		}

		if ( groupid == 32 ) {
			groupid = $( "#groupid" ).attr( "data" );
		} else {
			groupid = '';

		}
		marktime= marktime.replace(/-/g,"/");
		
//		var thattime = Date.parse(new Date(marktime)) / 1000;
		var thattime = (new Date(marktime)).getTime()/1000;
		
		var thistime = Math.round( new Date() / 1000 );
		var zhixiaorenid = $( "#zhixiaoren" ).attr( 'newzhixiao' );
		var zhixiaorenif = $( ".zhixiaoren" ).attr( 'zhixiaorenif' );
		var shijainif = $( ".shijian" ).attr( "shijianif" );
		console.log( marktime )
		console.log( thattime )
		console.log( thistime )
		if ( thattime < thistime && shijainif == 'if' ) {
			common.pop( "输入内容请大于当前时间" );
			return;
		} else if ( !zhixiaorenid && zhixiaorenif == 'if' ) {
			common.pop( "请选择直销人员" );
			return;

		} else {
			$.ajax( {
				type: "get",
				url: common._url + "appapi/callerupdateInfo",
				async: true,
				dataType: "jsonp",
				data: {
					clueId: clueId,
					BName: BName,
					BSex: BSex,
					BXProvinceId: BXProvinceId,
					BXCityId: BXCityId,
					BLevelId: BLevelId,
					BSeriesclassId: BSeriesclassId,
					BSeriesId: BSeriesId,
					BEmail: BEmail,
					Note: Note

				},
				success: function ( data ) {
					common.loading( "" );
					$( ".m_fankui" ).stop( "true" ).slideToggle();
					$( ".mengban" ).stop( 'true' ).toggle();
					$( "#m_content" ).toggleClass( 'm_ovfl' );
					$( ".popup" ).fadeOut();
					$( ".popup" ).height( winH ).css( "overflow", "auto" );
				}
			} );
			common.jsonpError();

			$.ajax( {
				type: "get",
				url: common._url + "appapi/callerupdate",
				async: true,
				dataType: "jsonp",
				data: {
					clueId: clueId, //线索id
					Note: note, //备注
					LZ: lz, //修改后的 状态码
					marktime: marktime, // 下次时间
					BXZSalesId: newzhixiao //电销分配在给直销人员

				},
				success: function ( data ) {
					$( ".title" ).text( $( "#newlz" ).attr( "data" ) );
					$( ".popup" ).fadeOut();
					$( ".popup" ).height( winH ).css( "overflow", "auto" );
					plus.webview.getWebviewById( 'index' ).evalJS( 'markcallback()' );
					var cView = plus.webview.currentWebview();
					cView.close();
				}

			} );

			common.jsonpError();
		};
	} )

	//获取当前的时间 
	function get_Date() {
		var tm = Date.parse( new Date() ) / 1000;
		var d = new Date( tm * 1000 ); //根据时间戳生成的时间对象 
		var date = ( d.getFullYear() ) + "-" +
			( d.getMonth() + 1 ) + "-" +
			( d.getDate() ) + " " +
			( d.getHours() ) + ':' +
			( d.getMinutes() );
		return date;
	}

	function getLocalTime( nS ) {
		return new Date( parseInt( nS ) * 1000 ).toLocaleString().replace( /:\d{1,2}$/, ' ' );
	}

	//点击弹出 反馈弹窗
	//  详情 弹窗
	var winH = $( window ).innerHeight();
	$( "#slid_" ).on( "click", ".ch_fktc", function () {
		var thisdata = $( this ).find( "span" ).attr( 'data' );
		$( "#zaicigenjinshijian" ).val( get_Date() );
		var BSeriesId = $( "#BSeriesId" ).attr( "data" );
		var BName = '', //称呼
			BEmail = ''; //邮箱
		var R_name = '', //名称验证
			R_email = ''; //邮箱验证
		var states = '', //线索状态
			LZ = '';
		BEmail = $( "#BEmail" ).val(); //邮箱
		BName = $( "#BName" ).val(); //名称
		//正则验证
		R_name = /^[\u4E00-\u9FA5]{1,5}$/; //名字正则
		R_email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //邮箱正则
		if ( !R_name.test( BName ) ) {
			common.pop( "请输入姓名" );
			$( ".m_fankui" ).stop( "true" ).slideToggle( 100 );
			$( ".mengban" ).stop( 'true' ).toggle();
			$( "#m_content" ).toggleClass( 'm_ovfl' );

		} else if ( !R_email.test( BEmail ) && BEmail != '' ) {
			common.pop( "请核实你输入的邮箱地址" );
			$( ".m_fankui" ).stop( "true" ).slideToggle( 100 );
			$( ".mengban" ).stop( 'true' ).toggle();
			$( "#m_content" ).toggleClass( 'm_ovfl' );

		} else if ( !BSeriesId ) {
			common.pop( "请选择具体车型车型" );
			$( ".m_fankui" ).stop( "true" ).slideToggle( 100 );
			$( ".mengban" ).stop( 'true' ).toggle();
			$( "#m_content" ).toggleClass( 'm_ovfl' );

		} else {
			$( ".m_fankui" ).stop( "true" ).slideToggle();
			$( ".mengban" ).stop( 'true' ).toggle();
			$( "#m_content" ).toggleClass( 'm_ovfl' );

			var data_ = $( this ).find( "span" ).attr( "data" );

			if ( data_ == 5035 || data_ == 5020 || data_ == 5030 || data_ == 5040 || data_ == 4040 || data_ == 4030 || data_ == 4005 || data_ == 9998 || data_ == 4025 ) {
				$( ".shijian" ).hide().attr( "shijianif", '' );
			} else {

				$( ".shijian" ).show().attr( "shijianif", 'if' );

				if ( data_ == 5014 || data_ == 4010 ) {
					$( ".shijian" ).find( 'span' ).text( "计划到店时间：" );
				} else if ( data_ == 5015 ) {
					$( ".shijian" ).find( 'span' ).text( "下次到店时间：" );

				} else {
					$( ".shijian" ).find( 'span' ).text( "再次跟进时间：" );
				}
			}
			var groupid = $( "#groupid" ).attr( "data" );

			if ( groupid == 32 && data_ == 4099 ) {
				$( ".zhixiaoren" ).show().attr( "zhixiaorenif", 'if' );
				$( ".shijian" ).hide().attr( "shijianif", '' );

			} else {
				$( ".zhixiaoren" ).hide().attr( "zhixiaorenif", '' );

			}
			if ( groupid == 26 && ( data_ == 5040 || data_ == 99 || data_ == 9996 ) ) {
				$( ".shijian" ).hide().attr( "shijianif", '' );
			}

			$( "#popup" ).find( "p" ).text( $( this ).attr( "data-note" ) );

			$( ".popup" ).height( winH ).fadeIn( 200 );

			$( "#newlz" ).val( data_ ).attr( "data", $( this ).find( "span" ).text() );
		}
	} )

	$( "#get_back" ).on( "click", function () {
		$( ".m_fankui" ).stop( "true" ).slideToggle();
		$( ".mengban" ).stop( 'true' ).toggle();
		$( "#m_content" ).toggleClass( 'm_ovfl' );

		$( ".popup" ).fadeOut( 100 );

	} )

	$( ".mengban" ).on( "click", function () {
		$( ".m_fankui" ).stop( "true" ).slideToggle();
		$( ".mengban" ).stop( 'true' ).toggle();
		$( "#m_content" ).toggleClass( 'm_ovfl' );
	} )

	//城市 切换  

	function Province() {
		var provincedata = JSON.parse( $( "#provincedata" ).val() );
		var ProvinceId = $( "#ProvinceId" ).val();
		var Province = '';
		for ( var i in provincedata ) {
			if ( i == ProvinceId ) {
				Province += '<li><a href="javascript:;" class="j-item on" data-val="' + i + '">' + provincedata[ i ] + '</a></li>';

			} else {
				Province += '<li><a href="javascript:;" class="j-item" data-val="' + i + '">' + provincedata[ i ] + '</a></li>';
			}

		}
		$( "#html_ ul" ).html( Province );
	}

	function city( ind ) {
		var thisdata = m_body.find( "#html_ ul a" ).eq( ind ).attr( "data-val" );
		var citydata = JSON.parse( $( "#city" ).val() );
		var city = '';
		var cityId = $( "#cityId" ).val();
		for ( var i in citydata ) {
			if ( i == thisdata ) {
				for ( var j in citydata[ i ] ) {
					if ( citydata[ i ][ j ].REGION_ID == cityId ) {
						city += '<li><a href="javascript:;" class="j-item on" data-val="' + citydata[ i ][ j ].REGION_ID + '">' + citydata[ i ][ j ].REGION_NAME + '</a></li>';
					} else {
						city += '<li><a href="javascript:;" class="j-item" data-val="' + citydata[ i ][ j ].REGION_ID + '">' + citydata[ i ][ j ].REGION_NAME + '</a></li>';

					}
				}
			}
		}
		$( "#html_ ul" ).html( city );
	}

	//存 修好后的 省  id 市id
	var newProvince = '',
		newcity = '';
	var newProvincetext = '',
		newcitytext = '';

	//内容点击
	var m_body = $( ".m-selectBox " );
	m_body.on( "click", "#html_ ul a", function () {
		var ind = $( this ).parent( "li" ).index();
		m_body.find( '#html_ ul a' ).removeClass( "on" );
		$( this ).addClass( "on" );
		if ( m_body.find( '.selectNav a' ).eq( 1 ).hasClass( "on" ) ) {
			newcity = $( this ).attr( "data-val" );
			newcitytext = $( this ).text();
			$( ".confirm" ).removeClass( "disabled " );
		} else {
			$( ".selectNav" ).find( "a" ).removeClass( "on" ).eq( 1 ).addClass( "on" ).attr( "data_if", "off" );
			newProvince = $( this ).attr( "data-val" );
			newProvincetext = $( this ).text();
			city( ind );
		}
	} )

	//导航 tab
	m_body.on( "click", ".selectNav a", function () {
		if ( $( this ).index() == 0 && $( this ).siblings().attr( "data_if" ) == "off" ) {
			$( this ).addClass( "on" ).siblings( "a" ).removeClass( "on" );
			$( this ).siblings().attr( "data_if", "" );
			Province();
		} else if ( $( this ).index() == 1 && $( this ).attr( "data_if" ) == "off" ) {
			$( this ).addClass( "on" ).siblings( "a" ).removeClass( "on" );
			var inde = m_body.find( " li a.on" ).attr( "data-val" );

		}
	} );

	//
	m_body.on( "click", "#province_city", function () {
		if ( !$( this ).hasClass( "disabled" ) ) {
			$( ".m-selectBox" ).fadeOut( 300 );
			$( "#BXProvinceId" ).find( "input" ).attr( {
				"user-newProvince": newProvince,
				"user-newcity": newcity
			} ).val( newProvincetext + '  ' + newcitytext + '市' );
			$( this ).attr( "id", "" );
			$( ".content" ).remove();
		} else {
			return;
		}

	} )

	var html_ = '<div class="content">\
				<div class="m-head clearfix">\
					<div class="selectNav">\
						<a href="javascript:;" class="on">省份</a>\
						<a href="javascript:;">城市</a>\
					</div>\
					<a href="javascript:;" class="confirm disabled j-confirm">确定</a>\
				</div>\
				<div class="m-body">\
					<ul>\
					</ul>\
				</div>\
			</div>';

	$( "#BXProvinceId" ).on( "click", function () {
		$( ".m-selectBox" ).append( html_ );
		$( ".m-selectBox" ).find( ".m-body" ).attr( "id", "html_" );
		$( ".m-selectBox" ).find( ".confirm" ).attr( "id", "province_city" );
		Province();
		$( ".m-selectBox" ).fadeIn( 300 );
	} );
	m_body.on( "click", ".shadow", function () {
		$( ".m-selectBox" ).find( ".m-body" ).attr( "id", "" );
		$( ".m-selectBox" ).find( ".confirm" ).attr( "id", "" );
		$( ".m-selectBox" ).fadeOut( 300 );
		$( ".content" ).remove();
	} );

	//	性别 +

	var sexhtml_ = '<div class="content">\
				<div class="m-head clearfix">\
					<div class="selectNav">\
					</div>\
					<a href="javascript:;" class="confirm disabled j-confirm">确定</a>\
				</div>\
				<div class="m-body">\
					<ul>\
					<li><a href="javascript:;" class="j-item" data-val="1">男</a></li>\
					<li><a href="javascript:;" class="j-item" data-val="0">女</a></li>\
					<li><a href="javascript:;" class="j-item" data-val="-1">未知</a></li>\
					</ul>\
				</div>\
			</div>';

	var newsex = '',
		newsextext = '';

	$( "#BSex" ).on( "click", function () {
		var newsex = $( this ).find( "input" ).attr( "newsex" );
		$( ".m-selectBox" ).append( sexhtml_ );
		/*if(common.mobileCode == 2){
			$('.m-selectBox .content').css({
				'bottom':0
			});
		}*/
		$( ".m-selectBox" ).find( ".m-body" ).attr( "id", "sexhtml_" );
		$( ".m-selectBox" ).find( ".confirm" ).attr( "id", "BSex1" );
		$( ".m-selectBox" ).find( "a[data-val='" + newsex + "']" ).addClass( "on" );
		$( ".m-selectBox" ).fadeIn( 300 );
	} );

	m_body.on( "click", "#sexhtml_ ul a", function () {
		m_body.find( '#sexhtml_ ul a' ).removeClass( "on" );
		$( this ).addClass( "on" );
		newsex = $( this ).attr( "data-val" );
		newsextext = $( this ).text();
		$( ".confirm" ).removeClass( "disabled " );
	} );

	m_body.on( "click", "#BSex1", function () {
		if ( !$( this ).hasClass( "disabled" ) ) {
			$( ".m-selectBox" ).fadeOut( 300 );
			$( "#BSex" ).find( "input" ).attr( {
				"newsex": newsex
			} ).val( newsextext );
			$( this ).attr( "id", "" );
		} else {
			return;
		}
	} );

	var newleveltext = '',
		newlevelID = "";
	m_body.on( "click", "#levelhtml_ ul a", function () {
		m_body.find( '#levelhtml_ ul a' ).removeClass( "on" );
		$( this ).addClass( "on" );
		newlevelID = $( this ).attr( "data-val" );
		newleveltext = $( this ).text();
		$( ".confirm" ).removeClass( "disabled " );
		$( "#levelID" ).val( newlevelID );

	} );

	m_body.on( "click", "#newlevel", function () {
		if ( !$( this ).hasClass( "disabled" ) ) {
			$( ".m-selectBox" ).fadeOut( 300 );
			$( "#BLevelId" ).find( "input" ).attr( {
				"newlevel": newlevelID
			} ).val( newleveltext );
			$( this ).attr( "id", "" );
		} else {
			return;
		}
	} );
	var levelhtml_ = '<div class="content">\
				<div class="m-head clearfix">\
					<div class="selectNav">\
					</div>\
					<a href="javascript:;" class="confirm disabled j-confirm">确定</a>\
				</div>\
				<div class="m-body">\
					<ul>\
					</ul>\
				</div>\
			</div>';

	// 线索级别  单选提交
	$( "#BLevelId" ).on( "click", function () {
		var newlevel = $( this ).find( "input" ).attr( "newlevel" );
		$( ".m-selectBox" ).append( levelhtml_ );
		/*if(common.mobileCode == 2){
			$('.m-selectBox .content').css({
				'bottom':0
			});
		}*/
		$( ".m-selectBox" ).find( ".m-body" ).attr( "id", "levelhtml_" );
		leveldata();
		$( ".m-selectBox" ).find( ".confirm" ).attr( "id", "newlevel" );
		$( ".m-selectBox" ).find( "a[data-val='" + newlevel + "']" ).addClass( "on" );
		$( ".m-selectBox" ).fadeIn( 300 );
	} );

	function leveldata() {
		var leveldata = JSON.parse( $( "#leveldata" ).val() );
		var levelID = $( "#levelID" ).val();
		var levelli = '';
		for ( var i in leveldata ) {
			if ( i == levelID ) {
				levelli += '<li><a href="javascript:;" class="j-item on" data-val="' + leveldata[ i ].id + '">' + leveldata[ i ].note + '</a></li>';

			} else {
				levelli += '<li><a href="javascript:;" class="j-item" data-val="' + leveldata[ i ].id + '">' + leveldata[ i ].note + '</a></li>';
			}

		}
		$( "#levelhtml_ ul" ).html( levelli );
	}

	//车系修改以后, 修改车型列表

	function BSeriesId( that ) {
		var bseriesli = '';
		var bseriesdata = JSON.parse( $( "#seriesdata" ).val() );
		$( "#BSeriesId" ).val( "" ).attr( "data", "" );
		for ( var i in bseriesdata ) {
			if ( i == that.attr( "data" ) ) {
				for ( var j in bseriesdata[ i ] ) {
					bseriesli += '<li><span data=' + bseriesdata[ i ][ j ].id + '>' + bseriesdata[ i ][ j ].title + '</span></li>';

				}
			}
		}
		$( "#series" ).html( bseriesli );

	}

	function zhixiaoren( newuid ) {
		var zhixiaoren = JSON.parse( $( "#groupid" ).val() );
		var useruid = $( "#groupid" ).attr( "data" );
		var userli = '';
		for ( var i in zhixiaoren ) {
			userli += '<li><a href="javascript:;" class="j-item" data-val="' + i + '">' + zhixiaoren[ i ] + '</a></li>';
		}
		$( "#zhixiaoren ul" ).html( userli );
	}
	//电销指派直销人员

	$( ".zhixiaoren" ).on( "click", function () {
		var newuid = $( "#groupid" ).attr( "zhixiao" );
		$( ".m-selectBox" ).append( levelhtml_ );
		$( ".m-selectBox" ).find( ".m-body" ).attr( "id", "zhixiaoren" );
		zhixiaoren( newuid );
		$( ".m-selectBox" ).find( ".confirm" ).attr( "id", "newzhixaio" );
		$( ".m-selectBox" ).fadeIn( 300 );
	} );

	var newzhixiaotext = '',
		newzhixiaoid = "";
	m_body.on( "click", "#zhixiaoren ul a", function () {
		m_body.find( '#zhixiaoren ul a' ).removeClass( "on" );
		$( this ).addClass( "on" );
		newzhixiaoid = $( this ).attr( "data-val" );
		newzhixiaotext = $( this ).text();
		$( ".confirm" ).removeClass( "disabled " );
		$( "#groupid" ).attr( "zhixiao", newzhixiaoid );

	} );

	m_body.on( "click", "#newzhixaio", function () {
		if ( !$( this ).hasClass( "disabled" ) ) {
			$( ".m-selectBox" ).fadeOut( 300 );
			$( ".zhixiaoren" ).find( "input" ).attr( {
				"newzhixiao": newzhixiaoid
			} ).val( newzhixiaotext );
			$( this ).attr( "id", "" );
		} else {
			return;
		}
	} );

} )