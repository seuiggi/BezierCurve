var isDrawing = false;
var x = 0;
var y = 0;
var p1_x, p1_y, p2_x, p2_y, p3_x, p3_y;
var slope;
var isTrue = false;
var timer;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", function (e) {
    x = e.offsetX;
    y = e.offsetY;
    if(!isDrawing) {
      p1_x = x;
      p1_y = y;
      p2_x = x;
      p2_y = y;
    }
    isTrue = true;
    timer = setTimeout(() => {
      console.log(isTrue)
      if(timer) {
        clearTimeout(timer);
      }
      if(isTrue) {
        p3_x = x;
        p3_y = y;
        drawBezier(ctx, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y);
      }
    }, 2000);
    isDrawing = true;
});

canvas.addEventListener("mousemove", function (e) {
    if (isDrawing) {
        drawSign(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
        if(slope != 0) {
          if(p1_y >= p2_y) {
            if(p2_y > y && isNaN(slope)) {
              slope = 1;
            } else if(slope == 1 && p2_y <= y) {
              slope = 0;
            }
          } else {
            if(p2_y <= y && isNaN(slope)) {
              slope = -1;
            } else if(slope == -1 && p2_y >= y) {
              slope = 0;
            }
          }
          p2_x = x;
          p2_y = y;
          console.log("slope : " + slope);
        }
    }
});

canvas.addEventListener("mouseup", function (e) {
    if (isDrawing) {
        drawSign(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});

canvas.addEventListener("mouseleave", function (e) {
    x = 0;
    y = 0;
    isDrawing = false;
});

function drawSign(ctx, x1, y1, x2, y2) {
    if (ctx != null) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#1DDB16";
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

function drawBezier(ctx, x1, y1, x2, y2, x3, y3) {
  if(ctx != null) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(x2, y2, x3, y3);
    ctx.stroke();
    ctx.closePath();
  }
}