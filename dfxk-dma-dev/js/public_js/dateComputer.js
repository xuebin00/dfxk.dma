//var timeobj = timeFilter(myDate);

function getLocalTime(now) {
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var date = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	month = month<10?'0'+month:month;
	date = date<10?'0'+date:date;
	return year + "-" + month + "-" + date;
}
//点击本周的按钮发起请求并返回一个对象包括两个属性，周一的日期和今天的日期
function weekTimeFilter (myDate) {
			var finalData = getLocalTime(myDate);
		
			var initData = thisWeekDateFilter (myDate);
			
			var obj = {};
			obj.finalDate = finalData;
			
			obj.initDate = initData;
			
			return obj;
		}
//点击本月的按钮发起请求并返回一个对象包括两个属性，本月1号的日期和今天的日期
function monthTimeFilter(myDate) {
			
			var finalData = getLocalTime(myDate);
			
			var initData = getLocalTime(new Date(myDate.setDate(1)));
			
			var obj={};
			
			obj.finalDate = finalData;
			
			obj.initDate = initData;
			
			return obj;
}

function  thisMonthDateFilter (myData) {
			myData.setDate(1); 
			return myData.toLocaleDateString();
}

function thisWeekDateFilter (dd) {
    var curday = dd.getDay();  
    console.log(dd.getDay(),curday)
    if(curday == 0){
    	curday = 7;
    }
	var  now  =  new  Date();
	var  mubiaodate  =  new  Date(now.getTime()  -  (curday-1) *  24  *  3600  *  1000);
	var ddd = getLocalTime(mubiaodate);
	return ddd;
}
//将"2017/4/19"转成"2017-4-19"
function  replacegang(s) {
	s = s.replace(/\//g,'-');
	return s;
}