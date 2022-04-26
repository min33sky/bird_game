console.log('Script Loaded');

const startButton = document.querySelector('.startBtn');
const gameMessage = document.querySelector('.gameMessage');
const score = document.querySelector('.score');
const gameArea = document.querySelector('.gameArea');

startButton.addEventListener('click', start);
gameMessage.addEventListener('click', start);
document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOff);

const keys = {};
const player = {
  x: 0,
  y: 0,
  speed: 2,
  score: 0,
  inplay: false,
};

const pipe = {
  startPos: 0,
  spaceBetweenRow: 0, // 기둥과 기둥 사이 간격
  spaceBetweenCol: 0,
  pipeCount: 0,
};

function start() {
  player.inplay = true;
  player.score = 0;
  gameArea.innerHTML = '';
  const bird = document.createElement('div');
  const wing = document.createElement('div');
  wing.pos = 15;
  wing.style.top = wing.pos + 'px';

  startButton.classList.add('hide');
  gameMessage.classList.add('hide');
  bird.setAttribute('class', 'bird');
  wing.setAttribute('class', 'wing');
  bird.appendChild(wing);
  gameArea.appendChild(bird);
  player.x = bird.offsetLeft;
  player.y = bird.offsetTop;

  //* 파이프 설정
  pipe.startPos = 0;
  pipe.spaceBetweenRow = 400; // 파이프 좌우 간격
  pipe.pipeCount = Math.floor(gameArea.offsetWidth / pipe.spaceBetweenRow); // 파이프 총 개수

  for (let i = 0; i < pipe.pipeCount; i++) {
    makePipe(pipe.startPos * pipe.spaceBetweenRow);
    pipe.startPos += 1;
  }

  window.requestAnimationFrame(playGame);
}

function movePipes(bird) {
  const pipes = document.querySelectorAll('.pipe');
  let counter = 0; // 지나간 파이프 수 (지나간 파이프 수 만큼 파이프 새로 생성)
  pipes.forEach((item) => {
    item.x -= player.speed;
    item.style.left = item.x + 'px';
    if (item.x < 0) {
      item.parentElement.removeChild(item);
      counter++;
    }

    if (isColide(item, bird)) {
      gameOver(bird);
    }
  });

  // 위아래 파이프가 같이 사라지므로 2로 나눠준다
  for (let i = 0; i < counter / 2; i++) {
    makePipe(0);
  }
}

function isColide(pipe, bird) {
  const pipeRect = pipe.getBoundingClientRect();
  const birdRect = bird.getBoundingClientRect();

  return (
    pipeRect.bottom > birdRect.top &&
    pipeRect.top < birdRect.bottom &&
    pipeRect.left < birdRect.right &&
    pipeRect.right > birdRect.left
  );
}

function makePipe(pipePos) {
  let totalWidth = gameArea.offsetWidth;
  let totalHeight = gameArea.offsetHeight;
  let pipeUp = document.createElement('div');
  let pipeDown = document.createElement('div');

  //* 상단 파이프 만들기
  pipeUp.classList.add('pipe');
  pipeUp.height = Math.floor(Math.random() * 350);
  pipeUp.style.height = pipeUp.height + 'px';
  pipeUp.style.left = totalWidth + pipePos + 'px'; // 화면 밖에서부터 시작
  pipeUp.x = totalWidth + pipePos;
  pipeUp.style.top = '0px';
  pipeUp.style.backgroundColor = 'red';

  gameArea.appendChild(pipeUp);

  // 상하 파이프 간격
  pipe.spaceBetweenCol = Math.floor(Math.random() * 250) + 150; // 150 ~ 399

  //* 하단 파이프 만들기
  pipeDown.classList.add('pipe');
  pipeDown.style.height = totalHeight - pipeUp.height - pipe.spaceBetweenCol + 'px';
  pipeDown.style.left = totalWidth + pipePos + 'px';
  pipeDown.x = totalWidth + pipePos;
  pipeDown.style.bottom = '0px';
  pipeDown.style.backgroundColor = 'black';

  gameArea.appendChild(pipeDown);
}

function playGame() {
  if (!player.inplay) return;

  let bird = document.querySelector('.bird');
  let wing = document.querySelector('.wing');

  movePipes(bird);

  let move = false; // 날개 움직임

  if ((keys.ArrowUp || keys.Space) && player.y > 0) {
    player.y -= player.speed * 5;
    move = true;
  }
  if (keys.ArrowDown && player.y < gameArea.offsetHeight - bird.offsetHeight) {
    player.y += player.speed;
    move = true;
  }
  if (keys.ArrowLeft && player.x > 0) {
    player.x -= player.speed;
    move = true;
  }
  if (keys.ArrowRight && player.x < gameArea.offsetWidth - bird.offsetWidth) {
    player.x += player.speed;
    move = true;
  }

  // 중력 적용하기
  player.y = player.y + player.speed * 2;

  // 날개 움직이기
  if (move) {
    wing.pos = wing.pos === 25 ? 15 : 25;
    wing.style.top = wing.pos + 'px';
  }

  console.log('zzz: ', player.x);
  // 새 움직이기
  bird.style.left = player.x + 'px';
  bird.style.top = player.y + 'px';

  player.score += 1;

  score.textContent = `점수: ${player.score}`;

  if (player.y > gameArea.offsetHeight - bird.offsetHeight) {
    gameOver(bird);
  }

  window.requestAnimationFrame(playGame);
}

function gameOver(bird) {
  player.inplay = false;
  bird.setAttribute('style', 'transform:rotate(180deg)');
  gameMessage.classList.remove('hide');
  startButton.classList.remove('hide');
  gameMessage.textContent = `게임 오버 [점수: ${player.score}점]`;
}

function pressOn(e) {
  keys[e.code] = true;
}

function pressOff(e) {
  keys[e.code] = false;
}
