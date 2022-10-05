const button1 = document.getElementById("button1"); //그리기 버튼
const button2 = document.getElementById("button2"); //지우기 버튼
const canvas = document.getElementById("canvas"); //캔버스
let ctx = canvas.getContext("2d"); //캔버스 컨텍스트
let t = 0; //매개변수 t
let arr = []; //x, y 좌표 배열
let p = [], _p = []; //조절점 좌표 배열
let loop; //루프
let isClick = false; //그리기 버튼을 눌렀는지

button1.addEventListener("click", (e) => {
  draw(arr); //draw 함수 호출
  isClick = true; //그리기 버튼 누름
});

button2.addEventListener("click", (e) => {
  isClick = false; //초기화
  ctx.clearRect(0, 0, 500, 500); //캔버스 전체를 지우기
  ctx.strokeStyle = "#000000"; //선 색
  ctx.lineWidth = 1; //선 너비
  /* 변수 초기화 */
  arr = [];
  t = 0;
  p = [];
  _p = [];
});

/* 참고; 배열 인덱스는 0부터 시작 */
canvas.addEventListener("click", (e) => { //클릭했을 때 호출
  if(isClick) return; //그리기 버튼을 눌렀으면 다시 안그려지게 무시

  arr.push([e.offsetX, e.offsetY]); //좌표를 배열에 넣기

  ctx.beginPath(); //그리기 시작
  ctx.arc(e.offsetX, e.offsetY, 5, 0, 2 * Math.PI); //클릭한 곳에 반지름이 5인 원 그리기
  if(arr.length > 1) { //배열의 길이가 1보다 크고 4보다 작을 때
    ctx.moveTo(arr[arr.length - 2][0], arr[arr.length - 2][1]); //(길이 - 2)번째 점부터
    ctx.lineTo(arr[arr.length - 1][0], arr[arr.length - 1][1]); //(길이 - 1)번째 점까지
  }
  ctx.stroke(); //그리기
  ctx.closePath(); //그리기 종료
});

draw = (arr) => { //배열을 매개변수로 받음
  ctx.strokeStyle = "#1DDB16"; //선 색
  ctx.lineWidth = 1.5; //선 너비
  ctx.beginPath(); //그리기 시작
  loop = setInterval(() => { //반복함수
    t = Number((t + 0.01).toFixed(2)); //부동소수점 오류때문에 t + 0.01을 한 뒤 소수점 둘째자리까지 반올림
    p = getInternalDivision(arr, t); //내분점 좌표를 p 배열에 저장
    if(_p.length == 0) { //복사한 배열의 길이가 0이라면 => 처음 반복했다면 
      ctx.moveTo(arr[0][0], arr[0][1]); //조절점 1 부터
    } else { //아니라면
      ctx.moveTo(_p[0][0], _p[0][1]); //바로 이전의 점부터
    }
    ctx.lineTo(p[0][0], p[0][1]); //내분점까지
    ctx.stroke(); //그리기
    _p = p; //내분점 좌표 복사
    if(t == 1) { //매개변수 t가 0부터 1까지 그려졌다면
      ctx.closePath(); //그리기 종료
      clearInterval(loop); //반복함수 종료
    }
  }, 10); //0.01초마다 반복
};

getInternalDivision = (arr, t) => { //배열과 t를 매개변수로 받음
  let _arr = []; //마지막에 리턴할 내분점 좌표 배열
  for(let i = 1; i < arr.length; i++) { //i가 1부터 arr 배열의 길이 - 1 까지 반복하면서 1씩 증가
    //내분점 좌표 배열의 i - 1번째에 조절점 (i - 1)과 조절점 (i)의 내분점 저장
    /*
      예시) 조절점이 3개라면 조절점 1과 조절점 2를 1 : 1 - t로 내분하는 점과
            조절점 2와 조절점 3을 1 : 1 - t로 내분하는 점을
            1 : 1 - t로 내분한 점이 내분점이 되는 것이다.
            아래에 나와있는 것이 내분점 공식을 적용한 것이다.
    */
    _arr[i - 1] = [(t * arr[i][0]) + ((1 - t) * arr[i - 1][0]), (t * arr[i][1]) + ((1 - t) * arr[i - 1][1])];
  }
  if(_arr.length == 1) { //내분점 좌표 배열의 길이가 1이라면
    return _arr; //내분점 좌표 리턴
  } else { //아니라면
    return getInternalDivision(_arr, t); //다시 반복 => 배열의 길이가 1이 될 때까지 반복됨.
  }
};
