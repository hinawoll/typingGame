'use strict';

{
  let words = [];
  let word;
  let loc = 0;
  let rest;
  let startTime;
  let timeoutId;
  let isPlaying;
  let elapsedTime;
  let time;
  let scores = [];

  if (localStorage.getItem('scores') === null) {
    scores = [];
  } else {
    scores = JSON.parse(localStorage.getItem('scores'));
  }

  const saveScores = () => {
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  const target = document.getElementById('target');

  const reset = document.getElementById('reset');
  const restart = document.getElementById('restart');
  const finished = document.getElementById('finished');

  const timer = document.getElementById('timer');
  const restNum = document.getElementById('rest-num');

  const timerSwitch = document.getElementById('timerSwitch');
  const restSwitch = document.getElementById('restSwitch');

  const myScores = document.querySelector('.myScores');


  function showTopScore() {
    const topScore = document.getElementById('topScore');
    const minSeconds = Math.min(...scores.map(item => item.seconds));
    topScore.textContent = `--top score : ${minSeconds} seconds--`;
    if (scores.length == 0) {
      topScore.style = `opacity:0`;
    } else {
      topScore.style = `opacity:1`;
    }
  }

  function setWord() {//3
    word = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    target.textContent = word;
    loc = 0;
    reset.classList.add('appear');
    finished.style = `display:block;`
  }

  function countUp() {
    time = ((Date.now() - startTime + elapsedTime) / 1000).toFixed(2);
    timer.textContent = time;
    timeoutId = setTimeout(() => {
      countUp();
    }, 10);
  }

  function setButtonStateInitial() {
    finished.classList.remove('appear');
    result.classList.remove('appear');
    reset.classList.remove('appear');
    restart.classList.remove('appear');
    myScores.classList.remove('appear');
  }

  function setButtonStateFinished() {
    finished.classList.add('appear');
    result.classList.add('appear');
    restart.classList.add('appear');
    reset.classList.remove('appear');
  }


  function top() {
    words = [
      'red',
      'blue',
      'green',
      'yellow',
      'pink',
      'purple',
      'orange',
      'white',
      'black',
      'brown',
    ];
    elapsedTime = 0;
    setButtonStateInitial();
    isPlaying = false;
    timer.textContent = '0.00';
    rest = words.length;
    restNum.textContent = rest;
    target.textContent = 'Enter to start!';
    showTopScore();
  }

  function renderScore(score) {
    const dateLi = document.createElement('li');
    const secondsLi = document.createElement('li');

    document.getElementById('date').insertBefore(dateLi,document.getElementById('date').firstChild);
    document.getElementById('seconds').insertBefore(secondsLi,document.getElementById('seconds').firstChild);

    dateLi.textContent = score.date;
    secondsLi.textContent = score.seconds;
  }


  const renderScores = () => {
    scores.forEach((score) => {//scoresのそれぞれに対して
      renderScore(score);
    });
  };

  timerSwitch.addEventListener('click', () => {
    const timerTitle = document.querySelector('.t-switch .title');
    timerTitle.textContent = timerSwitch.checked ? 'OFF' : 'ON';
    timer.classList.toggle('remove');
  });

  restSwitch.addEventListener('click', () => {
    const restTitle = document.querySelector('.r-switch .title');
    restTitle.textContent = restSwitch.checked ? 'OFF' : 'ON';
    document.querySelector('.rest').classList.toggle('remove');
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (isPlaying === true) {//プレイ中ならenterしても何も起きない
        return;
      }
      setTimeout(() => {
        target.textContent = '3';
      }, 200);
      setTimeout(() => {
        target.textContent = '2';
      }, 1200);
      setTimeout(() => {
        target.textContent = '1';
      }, 2200);
      setTimeout(() => {
        isPlaying = true;
        startTime = Date.now();
        countUp();
        setWord();
      }, 3200);
    }
  });

  document.addEventListener('keydown', e => {//4
    if (e.key !== word[loc]) {
      return;
    }
    loc++
    target.textContent = '_'.repeat(loc) + word.substring(loc);

    if(loc === word.length){//5
      if (words.length === 0){//全部終了後

        const d = new Date();//new Date(): 現在の日時に関する特殊なデータを作ってくれる
        const score = {
          date: d.toLocaleString('en-GB'),
          seconds:Number(time).toFixed(2),
        };
        renderScore(score);
        scores.unshift(score);

        saveScores();

        myScores.classList.add('appear');

        const result = document.getElementById('result');
        target.textContent = '';
        result.textContent = `Your score is ${time} seconds!`;
        clearTimeout(timeoutId);
        setButtonStateFinished();
        showTopScore();
        rest = 0;
        restNum.textContent = rest;
        isPlaying = true;
        return;
      }
      setWord();
      rest--;
      restNum.textContent = rest;
    }
  });

  reset.addEventListener('click', () => {
    clearTimeout(timeoutId);
    elapsedTime += Date.now() - startTime;
    if (!confirm('Are you sure?')) {
      startTime = Date.now();
      countUp();
    }else {
      top();
    }
  });

  restart.addEventListener('click', () => {
    top();
    finished.style = `display:none;`
  });

  top();
  renderScores();


}
