var Paint = function () {
	this.snapshot;
	this.nb = false;
	this.type = "stylo"
	this.md = false;
	this.basePosx = 0;
	this.basePosy = 0;
	this.posx = 0;
	this.posy = 0;
	this.canvas = document.getElementById("paint");
	this.context = this.canvas.getContext('2d');
	this.context.lineCap = "round";

	this.down = function(evt){
		var mousePos = this.getMousePos(evt);
		this.basePosx = mousePos.x;
		this.basePosy = mousePos.y;
		if(this.type == "stylo"){
			if(this.md === false && this.nb == false){
				this.takeSnapshot();
				this.nb = true;
			}
			if(this.md === true && this.nb === true){
				this.nb = false;
			}
			if(this.nb === true){
				this.restoreSnapshot();
			}
			this.context.beginPath();
			this.context.moveTo(this.posx, this.posy);
	  		this.draw();
		}
		else if(this.type == "ligne"){
			this.takeSnapshot();
		}
		else if(this.type == "circle"){
			this.takeSnapshot();
		}
		else if(this.type == "rectangle"){
			this.takeSnapshot();
		}
		else if(this.type == "spray"){
			this.timeout = setTimeout(function drawSpray(){
  			paint.context.lineJoin = paint.context.lineCap = "round";
  			paint.context.fillStyle = document.getElementById("color").value;
  			//this.context.lineWidth = document.getElementById('largeur_pinceau').value;
  			for(var i = 50 + parseInt(document.getElementById('largeur_pinceau').value); i--;){
  				var angle = paint.getRandomFloat(0, Math.PI*2);
  				var radius = paint.getRandomFloat(0, document.getElementById('largeur_pinceau').value);
  				paint.context.fillRect(paint.posx + radius * Math.cos(angle),
  									paint.posy + radius * Math.sin(angle),
  									1, 1)
  			}
  			if(!paint.timeout) return;
  				paint.timeout = setTimeout(drawSpray, 50);
  			}, 50);
		}
	}

	this.toggledraw = function(){
		if(this.type == "spray"){
			clearTimeout(this.timeout)
		}
		this.md = false;
		this.canvas.style.cursor = "default";
	}

	this.getMousePos = function(evt){
		var rect = this.canvas.getBoundingClientRect();
		return{
			x : evt.clientX - rect.left,
			y : evt.clientY - rect.top
		};
	}

	this.draw = function(){
		//if(this.md){
			this.canvas.style.cursor="pointer";
			this.context.lineWidth = document.getElementById('largeur_pinceau').value;
			this.context.strokeStyle = document.getElementById("color").value;
	  		this.context.lineTo(this.posx, this.posy);
	  		this.context.stroke();
		//}
	}

	this.drawLine = function(){
		this.restoreSnapshot();
		this.canvas.style.cursor="pointer";
	  	this.context.lineWidth = document.getElementById('largeur_pinceau').value;
	  	this.context.strokeStyle = document.getElementById("color").value;
	  	this.context.beginPath();
	  	this.context.moveTo(this.basePosx, this.basePosy);
	  	this.context.lineTo(this.posx, this.posy);
	  	this.context.stroke();
  	}

  	this.drawCircle = function(){
  		this.restoreSnapshot();
  		this.canvas.style.cursor="pointer";
  		var radius = Math.sqrt(Math.pow((this.basePosx - this.posx), 2) + Math.pow((this.basePosy - this.posy), 2));
  		this.context.lineWidth = document.getElementById('largeur_pinceau').value;  		
  		this.context.beginPath();
  		this.context.arc(this.basePosx, this.basePosy, radius, 0, 2 * Math.PI, false);
  		if(document.getElementById('remplissage').checked){
  			this.context.fillStyle = document.getElementById("color").value;
  			this.context.fill();
  		}
  		else{
  			this.context.strokeStyle = document.getElementById("color").value;
  			this.context.stroke();
  		}
  	}

  	this.drawRectangle = function(){
  		this.restoreSnapshot();
  		this.canvas.style.cursor="pointer";
  		this.context.lineWidth = document.getElementById('largeur_pinceau').value;
  		this.context.beginPath();
  		if(document.getElementById('remplissage').checked){
  			this.context.fillStyle = document.getElementById("color").value;
  			this.context.fillRect(this.basePosx, this.basePosy, this.posx - this.basePosx, this.posy - this.basePosy);
  		}
  		else{
  			this.context.strokeStyle = document.getElementById("color").value;
  			this.context.strokeRect(this.basePosx, this.basePosy, this.posx - this.basePosx, this.posy - this.basePosy);
  		}
  	}

  	this.getRandomFloat = function(min, max){
  		return Math.random() * (max - min) + min;
  	}

  	this.erase = function(){
  		this.context.clearRect(this.posx, this.posy, document.getElementById('largeur_pinceau').value, document.getElementById('largeur_pinceau').value)
  	}

  	this.takeSnapshot = function(){
  		this.snapshot = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  	}

  	this.restoreSnapshot = function(){
  		this.context.putImageData(this.snapshot, 0, 0);
  	}
}

var paint = new Paint();
paint.canvas.addEventListener('mousedown', function(evt){
	paint.md = true;
	paint.down(evt);
});
paint.canvas.addEventListener('mouseup', function(){
	paint.toggledraw();
});
paint.canvas.addEventListener('mousemove',function(evt){
	var mousePos = paint.getMousePos(evt);
	paint.posx = mousePos.x;
	paint.posy = mousePos.y;
	if(paint.type == "stylo" && paint.md === true){
		paint.draw();
	}
	else if(paint.type == "ligne" && paint.md === true){
		paint.nb = false;
		paint.drawLine();
	}
	else if(paint.type == "circle" && paint.md === true){
		paint.nb = false;
		paint.drawCircle();
	}
	else if(paint.type == "rectangle" && paint.md === true){
		paint.nb = false;
		paint.drawRectangle();
	}
	else if(paint.type == "gomme" && paint.md === true){
		paint.nb = false;
		paint.erase();
	}
	else if(paint.type == "stylo" && paint.md === false){
		paint.down(evt);
	}
});
paint.canvas.addEventListener('mouseout', function(){
	if(paint.type == "stylo"){
		paint.restoreSnapshot();
	}
})

function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           	var img = new Image();
           	img.addEventListener("load", function() {
            	paint.context.drawImage(img, 0, 0);
           		paint.nb = false;
           	});
           img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

document.getElementById("fileUpload").addEventListener("change", readImage, false);

document.getElementById('ligne').addEventListener('click', function(){
	paint.type = 'ligne';
});
document.getElementById('stylo').addEventListener('click', function(){
	paint.type = 'stylo';
});
document.getElementById('circle').addEventListener('click', function(){
	paint.type = 'circle';
});
document.getElementById('rectangle').addEventListener('click', function(){
	paint.type = 'rectangle';
});
document.getElementById('gomme').addEventListener('click', function(){
	paint.type = 'gomme';
});
document.getElementById('spray').addEventListener('click', function(){
	paint.type = 'spray';
});

function download(){
	var download = document.getElementById("download");
	var image = document.getElementById("paint").toDataURL("image/png").replace("image/png", "image/octet-stream");
	download.setAttribute("href", image);
}
