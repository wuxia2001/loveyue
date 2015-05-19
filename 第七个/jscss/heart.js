(function ($) {

		    function Vector(x, y) {
			this.x = x;
			this.y = y;
		    };
		    Vector.prototype = {
			rotate: function (theta) {
			    var x = this.x;
			    var y = this.y;
			    this.x = Math.cos(theta) * x - Math.sin(theta) * y;
			    this.y = Math.sin(theta) * x + Math.cos(theta) * y;
			    return this;
			},
			mult: function (f) {
			    this.x *= f;
			    this.y *= f;
			    return this;
			},
			clone: function () {
			    return new Vector(this.x, this.y);
			},
			length: function () {
			    return Math.sqrt(this.x * this.x + this.y * this.y);
			},
			subtract: function (v) {
			    this.x -= v.x;
			    this.y -= v.y;
			    return this;
			},
			set: function (x, y) {
			    this.x = x;
			    this.y = y;
			    return this;
			}
		    };

		    function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
			this.stretchA = stretchA;
			this.stretchB = stretchB;
			this.startAngle = startAngle;
			this.angle = angle;
			this.bloom = bloom;
			this.growFactor = growFactor;
			this.r = 1;
			this.isfinished = false;
		    }
		    Petal.prototype = {
			draw: function () {
			    var ctx = this.bloom.garden.ctx;
			    var v1, v2, v3, v4;
			    v1 = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
			    v2 = v1.clone().rotate(Garden.degrad(this.angle));
			    v3 = v1.clone().mult(this.stretchA); //.rotate(this.tanAngleA);
			    v4 = v2.clone().mult(this.stretchB); //.rotate(this.tanAngleB);
			    ctx.strokeStyle = this.bloom.c;
			    ctx.beginPath();
			    ctx.moveTo(v1.x, v1.y);
			    ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
			    ctx.stroke();
			},
			render: function () {
			    if (this.r <= this.bloom.r) {
			        this.r += this.growFactor; // / 10;
			        this.draw();
			    } else {
			        this.isfinished = true;
			    }
			}
		    }
		    function Bloom(p, r, c, pc, garden) {
			this.p = p;
			this.r = r;
			this.c = c;
			this.pc = pc;
			this.petals = [];
			this.garden = garden;
			this.init();
			this.garden.addBloom(this);
		    }
		    Bloom.prototype = {
			draw: function () {
			    var p, isfinished = true;
			    this.garden.ctx.save();
			    this.garden.ctx.translate(this.p.x, this.p.y);
			    for (var i = 0; i < this.petals.length; i++) {
			        p = this.petals[i];
			        p.render();
			        isfinished *= p.isfinished;
			    }
			    this.garden.ctx.restore();
			    if (isfinished == true) {
			        this.garden.removeBloom(this);
			    }
			},
			init: function () {
			    var angle = 360 / this.pc;
			    var startAngle = Garden.randomInt(0, 90);
			    for (var i = 0; i < this.pc; i++) {
			        this.petals.push(new Petal(Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), startAngle + i * angle, angle, Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max), this));
			    }
			}
		    }

		    function Garden(ctx, element) {
			this.blooms = [];
			this.element = element;
			this.ctx = ctx;
		    }
		    Garden.prototype = {
			render: function () {
			    for (var i = 0; i < this.blooms.length; i++) {
			        this.blooms[i].draw();
			    }
			},
			addBloom: function (b) {
			    this.blooms.push(b);
			},
			removeBloom: function (b) {
			    var bloom;
			    for (var i = 0; i < this.blooms.length; i++) {
			        bloom = this.blooms[i];
			        if (bloom === b) {
			            this.blooms.splice(i, 1);
			            return this;
			        }
			    }
			},
			createRandomBloom: function (x, y, Size) {
				//Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max),
			    this.createBloom(x, y, 
			    		Size,
			    		Garden.randomrgba(Garden.options.color.min, Garden.options.color.max, Garden.options.color.opacity), 
			    		Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max));
			},
			createBloom: function (x, y, r, c, pc) {
			    new Bloom(new Vector(x, y), r, c, pc, this);
			},
			clear: function () {
			    this.blooms = [];
			    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
			}
		    }

		    Garden.options = {
			petalCount: {
			    min: 9,
			    max: 13
			},
			petalStretch: {
			    min: 0.9,
			    max: 3
			},
			growFactor: {
			    min: 0.1,
			    max: 1
			},
			bloomRadius: {
			    min: 5,
			    max: 10
			},
			density: 50,
			growSpeed: 1000 / 30,
			color: {
			    min: 0,
			    max: 90,
			    opacity: 0.05
			},
			tanAngle: 90
		    };
		    Garden.random = function (min, max) {
		    	return Math.random() * (max - min) + min;
		    };
		    Garden.randomInt = function (min, max) {
		    	return Math.floor(Math.random() * (max - min + 1)) + min;
		    };
		    Garden.circle = 2 * Math.PI;
		    Garden.degrad = function (angle) {
		    	return Garden.circle / 360 * angle;
		    };
		    Garden.raddeg = function (angle) {
		    	return angle / Garden.circle * 360;
		    };
		    Garden.rgba = function (r, g, b, a) {
		    	return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		    };
		    Garden.randomrgba = function (min, max, a) {
		    	//return Garden.rgba(Math.round(Garden.random(250, 255)), Math.round(Garden.random(200, 210)), Math.round(Garden.random(200, 210)), 0.05);//紫色
		    	return Garden.rgba(Math.round(Garden.random(180, 250)), Math.round(Garden.random(80, 255)), Math.round(Garden.random(50, 180)), 0.15);//橙色,粉红,紫色
		    };

		    $(function () {

			$window = $(window);

			// garden
			var gardenCtx, gardenCanvas, $garden, garden;

			// saveCanvas
			var saveCtx, saveCanvas;

			// setup save
			saveCanvas = $("#garden")[0];
			saveCanvas.width = $window.width();
			saveCanvas.height = $window.height();
			saveCtx = saveCanvas.getContext("2d");
			saveCtx.globalCompositeOperation = "lighter";

			// setup garden
			$garden = $("#garden");
			gardenCanvas = $garden[0];
			gardenCanvas.width = $window.width();
			gardenCanvas.height = $window.height() - 20;
			gardenCtx = gardenCanvas.getContext("2d");
			gardenCtx.globalCompositeOperation = "lighter";
			garden = new Garden(gardenCtx, gardenCanvas);

			// renderLoop
			setInterval(function () {
			    garden.render();
			}, Garden.options.growSpeed);

			//---------------------------------------------------------------
			//Draw My Picture
			var r = 18;
			var flag = 0;
			var time, temp = 800;
			var radian = Math.PI;//弧度
			var radianDecrement = Math.PI / 370 * 2;;//弧度增量
			var heartX, heartY;
			var LX = 700, LY = 370;
			var URowX = LX, URowY = LY;
			var DRowX = LX, DRowY = LY;
			var LRollX = LX, LRollY = LY;
			var RRollX = LX, RRollY = LY;
			
			for(var i=0;i<350;i++){
				time = 30*(i + temp);
				setTimeout(drawHeart, time);
			}
			
 
			
			for(var j = 0; j < 20; j++){
				//setTimeout(drawRect_URow, 60 * j + 35000);
			}
			
			for(var j = 0; j < 21; j++){
				//setTimeout(drawRect_DRow, 60 * j + 20 * 65 + 36000);
			}
			
			for(var j = 0; j < 5; j++){
				//setTimeout(drawRect_LRoll, 60 * j + 20 * 65 + 37000);
			}
			
			for(var j = 0; j < 5; j++){
				//setTimeout(drawRect_RRoll, 60 * j + 20 * 65 + 38000);
			}
			
			function drawRect_URow(){
				garden.createRandomBloom(URowX, URowY, 12);
				URowX = URowX + 25;
			}
			
			function drawRect_DRow(){
				garden.createRandomBloom(DRowX, DRowY + 185, 12);
				DRowX = DRowX + 25;
			}
			
			function drawRect_LRoll(){
				garden.createRandomBloom(LRollX, LRollY, 12);
				LRollY = LRollY + 25;
			}
			
			function drawRect_RRoll(){
				garden.createRandomBloom(RRollX + 500, RRollY, 12);
				RRollY = RRollY + 25;
			}
			
			function drawHeart(){
				flag++;
				heartX = getX(radian);
				heartY = getY(radian);
				radian += radianDecrement;
				if(flag < 31){
					if(flag%8==0){
						garden.createRandomBloom(heartX, heartY, 12);
					}
				}else if(flag % 4 == 0){
					if(radian>Math.PI+300*radianDecrement)
						garden.createRandomBloom(heartX, heartY, 56 - (5.51) *(radian));
					else if(!(radian<=Math.PI+205*radianDecrement&&radian>=Math.PI+180*radianDecrement))//只是让变得好看
						garden.createRandomBloom(heartX, heartY, 12);
				}
			}

			function getX(t) {//由弧度得到 X 坐标
				return 305+r*(16*Math.pow(Math.sin(t),3));
			}
			 
			function getY(t) {//由弧度得到 Y 坐标
				return 295-r*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
			}
			//---------------------------------------------------------------
		    });
		})(jQuery);