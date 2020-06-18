var audio = new Audio();
var playPause = document.getElementById('play-pause');
var currentProgress = document.getElementById('current-progress');
var duration = document.getElementById('duration');
var songTitle = document.getElementById('song-title');
var backgroundImg = document.getElementById('background-image');
var songThumb = document.getElementById('player-thumb');
var stepBack = document.getElementById('step-back');
var stepForward = document.getElementById('step-forward');
let xhttp = new XMLHttpRequest();
xhttp.open('GET', 'https://5ee2489c8b27f30016094881.mockapi.io/music', true);
xhttp.send();
xhttp.onreadystatechange = function () {
  if (xhttp.readyState === 4) {
    window.response = JSON.parse(this.responseText);
    window.currentSong = 0;
    window.currentThumb = response[0].thumbnail;
    window.currentUrl = response[0].url;
    window.currentTitle = response[0].title;
    audio.src = currentUrl;
    songTitle.innerHTML = currentTitle;
    backgroundImg.src = currentThumb;
    songThumb.src = currentThumb;
    stepForward.addEventListener('click', function () {
      songForward();
    });
    stepBack.addEventListener('click', function () {
      songBackward();
    });
  }
};

function songBackward() {
  if (currentSong != 0) currentSong--;
  else currentSong = response.length - 1;
  var currentThumb = response[currentSong].thumbnail;
  var currentUrl = response[currentSong].url;
  var currentTitle = response[currentSong].title;
  audio.src = currentUrl;
  songTitle.innerHTML = currentTitle;
  backgroundImg.src = currentThumb;
  songThumb.src = currentThumb;
  if (audio.paused) {
    audio.play();
    playPause.src = './icons/pause-solid.svg';
  } else {
    audio.pause();
    playPause.src = './icons/play-solid.svg';
  }
}

function songForward() {
  if (currentSong < response.length - 1) currentSong++;
  else currentSong = 0;
  var currentThumb = response[currentSong].thumbnail;
  var currentUrl = response[currentSong].url;
  var currentTitle = response[currentSong].title;
  audio.src = currentUrl;
  songTitle.innerHTML = currentTitle;
  backgroundImg.src = currentThumb;
  songThumb.src = currentThumb;
  if (audio.paused) {
    audio.play();
    playPause.src = './icons/pause-solid.svg';
  } else {
    audio.pause();
    playPause.src = './icons/play-solid.svg';
  }
}

playPause.addEventListener('click', function () {
  if (audio.paused) {
    audio.play();
    playPause.src = './icons/pause-solid.svg';
  } else {
    audio.pause();
    playPause.src = './icons/play-solid.svg';
  }
});

function showDuration() {
  audio.addEventListener('timeupdate', function () {
    var playedPercentage = audio.currentTime / audio.duration;
    playedPercentage = playedPercentage * 100;

    currentProgress.style.width = playedPercentage + '%';
    let currentTime = audio.currentTime;
    let fullTime = audio.duration;
    if (isNaN(fullTime)) fullTime = 0;
    currentTime = Math.floor(currentTime);
    fullTime = Math.floor(fullTime);

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime - currentMin * 60);
    let fullMin = Math.floor(fullTime / 60);
    let fullSec = Math.floor(fullTime - fullMin * 60);
    if (currentMin < 10) currentMin = '0' + currentMin;
    if (currentSec < 10) currentSec = '0' + currentSec;
    if (fullMin < 10) fullMin = '0' + fullMin;
    if (fullSec < 10) fullSec = '0' + fullSec;
    duration.innerHTML =
      currentMin + ':' + currentSec + '/' + fullMin + ':' + fullSec;
  });
}
showDuration();
///////////////////////// Adding volume control

var speaker = document.getElementById('speaker');
speaker.addEventListener('click', function () {
  if (audio.muted) {
    audio.muted = false;
    speaker.src = './icons/volume-down-solid.svg';
  } else {
    audio.muted = true;
    speaker.src = './icons/volume-mute-solid.svg';
  }
});
var volMin = document.getElementById('vol-min');
volMin.addEventListener('click', function () {
  if (audio.muted) {
    audio.muted = false;
    speaker.src = './icons/volume-down-solid.svg';
  }
  let currentVol = audio.volume;
  currentVol = currentVol - 0.1;
  audio.volume = currentVol;
});

var volPlus = document.getElementById('vol-plus');
volPlus.addEventListener('click', function () {
  if (audio.muted) {
    audio.muted = false;
    speaker.src = './icons/volume-down-solid.svg';
  }
  let currentVol = audio.volume;
  currentVol = currentVol + 0.1;
  audio.volume = currentVol;
});

//////// adding seekable functionality
progressBar = document.getElementById('progress-bar');
progressBar.addEventListener('click', function (e) {
  let seekTo = e.offsetX / progressBar.offsetWidth;

  audio.currentTime = seekTo * audio.duration;
  currentProgress.style.width = seekTo * 100 + '%';
});

////////// audio ended then next
audio.addEventListener('ended', function () {
  songForward();
});

////// giving some click style for icons

var icons = document.getElementsByClassName('icon');
for (let i = 0; i < icons.length; i++) {
  icons[i].addEventListener('click', function () {
    icons[i].style.backgroundColor = '#00D2FF';
    setTimeout(() => {
      icons[i].style.backgroundColor = '#fff';
    }, 100);
  });
}

//////designing volume bar
var volBar = document.getElementById('vol-bar');
var volCurrProgress = document.getElementById('vol-curr-progress');
audio.addEventListener('volumechange', function () {
  let currentVol = audio.volume;
  let volBarWidth = volBar.offsetWidth;
  let myWidth = currentVol * volBarWidth;
  volCurrProgress.style.width = myWidth + 'px';
});
let currentVol = audio.volume;
let volBarWidth = volBar.offsetWidth;
let myWidth = currentVol * volBarWidth;
volCurrProgress.style.width = myWidth + 'px';
