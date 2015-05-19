function move(){
        //获取移动的DIV对象
        var obj = document.getElementById("container");
        //设置样式定位属性，让div从当前文档流中拖出。
        //这样，他属于整个活动窗体。可以层叠。
        obj.style.position = "absolute";
        obj.style.opacity = 0;
        //动画计数器。
        var num = 0;
        //获得移动div，在整个活动区域的X坐标
        var left = 630;
        //获得移动div，在整个活动区域的Y坐标
        var top = 220;
        //使用定时器移动DIV
        var timer  =  setInterval(function(){ //移动的函数
          if(num==105){ //移动105次
            clearInterval(timer); 
          }
          //通过left样式属性设置。必须带单位
          obj.style.left = left + "px";
          //通过top样式属性设置，必须带单位
          obj.style.top = top - num * 2 + "px";
          //计数器加一
          obj.style.opacity =   num  / 140.0;
          num++;
        },190);
}
