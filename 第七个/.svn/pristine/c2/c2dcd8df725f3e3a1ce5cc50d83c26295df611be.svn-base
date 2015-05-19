var x,y;		//鼠标当前在页面上的位置
var step=10;	//字符显示间距，为了好看，step=0则字符显示没有间距
var message="Thanks for watching!";		//跟随鼠标要显示的字符串
message=message.split("");	//将字符串分割为字符数组

var xpos=new Array()		//存储每个字符的x位置的数组
for (i=0;i<message.length;i++) {
	xpos[i]=-50;
}
var ypos=new Array()		//存储每个字符的y位置的数组
for (i=0;i<message.length;i++) {
	ypos[i]=-50;
}

for (i=0;i<message.length;i++) {  //动态生成显示每个字符span标记,
	//使用span来标记字符，是为了方便使用CSS，并可以自由的绝对定位
	document.write("<span id='span"+i+"' class='spanstyle'>");
	document.write(message[i]);
	document.write("</span>");
}

if (document.layers){
	document.captureEvents(Event.MOUSEMOVE);
}

function handlerMM(e){ //从事件得到鼠标光标在页面上的位置
	e=e||window.event;
	x = (document.layers) ? e.pageX : document.body.scrollLeft+e.clientX-220;
	y = (document.layers) ? e.pageY : document.body.scrollTop+e.clientY-35;
}

function makesnake() {  //重定位每个字符的位置
	if (document.all) { //如果是IE
		for (i=message.length-1; i>=1; i--) {
			xpos[i]=xpos[i-1]+step;  //从尾向头确定字符的位置，每个字符为前一个字符“历史”水平坐标+step间隔，
            //这样随着光标移动事件，就能得到一个动态的波浪状的显示效果
			ypos[i]=ypos[i-1];  //垂直坐标为前一字符的历史“垂直”坐标，后一个字符跟踪前一个字符运动
		}
		xpos[0]=x+step //第一个字符的坐标位置紧跟鼠标光标
		ypos[0]=y
		//上面的算法将保证，如果鼠标光标移动到新位置，则连续调用makenake将会使这些字符一个接一个的移动的新位置
		// 该算法显示字符串就有点象人类的游行队伍一样， 
	
		for (i=0; i<=message.length-1; i++) {
			var thisspan = eval("span"+(i)+".style");  //妙用eval根据字符串得到该字符串表示的对象
			thisspan.posLeft=xpos[i];
			thisspan.posTop=ypos[i];
		}
	}
	else{
		for (i=message.length-1; i>=1; i--) {
			xpos[i]=xpos[i-1]+step;
			ypos[i]=ypos[i-1];
		}
		xpos[0]=x+step;
		ypos[0]=y;
		for (i=0; i<=message.length-1; i++) {
			var thisspan = document.getElementById("span"+i).style;
			thisspan.left=xpos[i];
			thisspan.top=ypos[i];
		}
	}
	var timer=setTimeout("makesnake()",10)  //设置10毫秒的定时器来连续调用makesnake(),时刻刷新显示字符串的位置。
}
document.onmousemove = handlerMM;