const canvas = document.getElementById("canvas"); //캔버스
let ctx = canvas.getContext("2d"); //캔버스 컨텍스트
let isDrawing = false; //그리는 가능 여부(기본 false)
let x = 0; //x좌표
let y = 0; //y좌표
let p1_x, p1_y, p2_x, p2_y, p3_x, p3_y; //조절점 좌표들
let slope; //기울기 (1 = 양수, 0 = 0, -1 = 음수)
let isTrue = false; //타이머 체크(기본 false)
let timer; //타이머(그린 그림을 베지어 곡선으로 바꾸기 위한 것)

ctx.strokeStyle = "#FF0000"; //선 색
ctx.lineWidth = 1; //선 너비

canvas.addEventListener("mousedown", function (e) { //캔버스에서 마우스 왼쪽 버튼을 누른 상태
    x = e.offsetX; //x좌표 대입
    y = e.offsetY; //y좌표 대입
    if(!isDrawing) { //그리기가 허용됐다면
      //조절점 1, 2 좌표들 대입
      p1_x = x;
      p1_y = y;
      p2_x = x;
      p2_y = y;
    }
    isTrue = true; //타이머 체크
    timer = setTimeout(() => { //타이머
      if(timer) { //타이머가 존재하면
        clearTimeout(timer); //타이머 제거
      }
      if(isTrue) { //타이머 체크가 true이면
        //조절점 3 좌표 대입
        p3_x = x;
        p3_y = y;
        drawBezier(ctx, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y); //베지어 곡선 그리기
      }
    }, 2000); //2초 후에 실행되는
    isDrawing = true; //그리기 허용
});

canvas.addEventListener("mousemove", function (e) { //캔버스에서 마우스가 움직이는 상태
    if (isDrawing) { //그리기가 허용됐다면
        drawSign(ctx, x, y, e.offsetX, e.offsetY); //그린다
        //이후에 x, y좌표 바꾸기
        x = e.offsetX;
        y = e.offsetY;
        /* 참고; 캔버스는 (0, 0)이 왼쪽 상단이고 오른쪽으로 갈수록 x좌표가 커지고 아래쪽으로 갈수록 y좌표가 커진다. */
        if(slope != 0) { //기울기가 0이 아니라면
          if(p1_y >= p2_y) { //조절점 2가 조절점 1보다 위에 있거나 같은 높이라면(처음 실행한 경우)
            if(p2_y > y && isNaN(slope)) { //조절점 2가 현재 마우스 좌표보다 아래있고 기울기 값을 설정한 적이 없다면(처음 실행한 경우)
              slope = 1; //기울기 양수로 설정
            } else if(slope == 1 && p2_y <= y) { //또는 기울기가 양수이고 조절점 2가 현재 마우스 좌표보다 위에 있거나 같은 높이라면
              slope = 0; //기울기 0 => 극대(기울기가 양수이다가 이 이후에 기울기가 음수가 됨)
            }
          } else { //아니라면
            if(p2_y <= y && isNaN(slope)) { //조절점 2가 현재 마우스 좌표보다 위에 있고 기울기 값을 설정한 적이 없다면(처음 실행한 경우)
              slope = -1; //기울기 음수로 설정
            } else if(slope == -1 && p2_y >= y) { //또는 기울기가 음수이고 조절점 2가 현재 마우스 좌표보다 아래 있거나 같은 높이라면
              slope = 0; //기울기 0 => 극소(기울기가 음수이다가 이 이후에 기울기가 양수가 됨)
            }
          }
          //조절점 2 좌표 대입
          p2_x = x;
          p2_y = y;
          console.log("slope : " + slope); //기울기 값 모니터링
        }
    }
});

canvas.addEventListener("mouseup", function (e) { //캔버스에서 마우스 왼쪽 버튼을 뗀 상태
    if (isDrawing) { //그리기가 허용됐다면
        drawSign(ctx, x, y, e.offsetX, e.offsetY); //그린다.
        //x, y좌표 초기화
        x = 0;
        y = 0;
        isDrawing = false; //그리기 종료
    }
});

canvas.addEventListener("mouseleave", function (e) { //캔버스에서 마우스가 사라진 상태
  //x, y좌표 초기화
  x = 0;
  y = 0;
  isDrawing = false; //그리기 종료
});

function drawSign(ctx, x1, y1, x2, y2) { //매개변수(좌표들)
    if (ctx != null) { //컨텍스트가 존재한다면
        ctx.beginPath(); //그리기 시작
        ctx.moveTo(x1, y1); //이 점부터
        ctx.lineTo(x2, y2); //이 점까지
        ctx.stroke(); //그리기
        ctx.closePath(); //그리기 종료
    }
}

function drawBezier(ctx, x1, y1, x2, y2, x3, y3) { //매개변수(좌표들)
  if(ctx != null) { //컨텍스트가 존재한다면
    ctx.beginPath(); //그리기 시작
    ctx.moveTo(x1, y1); //조절점 1에서
    ctx.quadraticCurveTo(x2, y2, x3, y3); //조절점 2, 3 으로 베지어 곡선을
    ctx.stroke(); //그리기
    ctx.closePath(); //그리기 종료
  }
}
