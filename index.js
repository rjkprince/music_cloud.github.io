$(function () {
  audio = new Audio();
  var playPause = $('#play-pause');
  var currentProgress = $('#current-progress');
  var duration = $('#duration');
  var songTitle = $('#song-title');
  var backgroundImg = $('#background-image');
  var songThumb = $('#player-thumb');
  var stepBack = $('#step-back');
  var stepForward = $('#step-forward');

  $.get('https://5ee2489c8b27f30016094881.mockapi.io/music', function (
    response
  ) {
    window.response = response;
    window.currentSong = 0;
    window.currentThumb = response[0].thumbnail;
    window.currentUrl = response[0].url;
    window.currentTitle = response[0].title;
    audio.src = currentUrl;

    songTitle.text(currentTitle);
    backgroundImg.attr('src', currentThumb);
    songThumb.attr('src', currentThumb);
    stepForward.click(function () {
      songForward();
    });
    stepBack.click(function () {
      songBackward();
    });
    generatePLaylist();
  });

  function songBackward() {
    if (currentSong != 0) currentSong--;
    else currentSong = response.length - 1;
    var currentThumb = response[currentSong].thumbnail;
    var currentUrl = response[currentSong].url;
    var currentTitle = response[currentSong].title;
    audio.src = currentUrl;

    songTitle.text(currentTitle);
    backgroundImg.attr('src', currentThumb);
    songThumb.attr('src', currentThumb);

    if (audio.paused) {
      audio.play();
      playPause.attr('src', './icons/pause-solid.svg');
    } else {
      audio.pause();
      playPause.attr('src', './icons/play-solid.svg');
    }
    $('.playlist-item').css({
      'background-color': 'rgba(255, 255, 255, 0.1)',
    });
    let myPlaylist = $('.playlist-item').eq(currentSong);
    myPlaylist.css({ 'background-color': '#d1e079' });
  }

  function songForward() {
    if (currentSong < response.length - 1) currentSong++;
    else currentSong = 0;
    var currentThumb = response[currentSong].thumbnail;
    var currentUrl = response[currentSong].url;
    var currentTitle = response[currentSong].title;
    audio.src = currentUrl;

    songTitle.text(currentTitle);
    backgroundImg.attr('src', currentThumb);
    songThumb.attr('src', currentThumb);

    if (audio.paused) {
      audio.play();
      playPause.attr('src', './icons/pause-solid.svg');
    } else {
      audio.pause();
      playPause.attr('src', './icons/play-solid.svg');
    }
    $('.playlist-item').css({
      'background-color': 'rgba(255, 255, 255, 0.1)',
    });
    let myPlaylist = $('.playlist-item').eq(currentSong);
    myPlaylist.css({ 'background-color': '#d1e079' });
  }
  playPause.click(function () {
    if (audio.paused) {
      audio.play();
      playPause.attr('src', './icons/pause-solid.svg');
    } else {
      audio.pause();
      playPause.attr('src', './icons/play-solid.svg');
    }
  });

  function showDuration() {
    audio.addEventListener('timeupdate', function () {
      var playedPercentage = audio.currentTime / audio.duration;
      playedPercentage = playedPercentage * 100;
      let str =
        'linear-gradient(to right, blueviolet 0%, blueviolet ' +
        playedPercentage +
        '%, #fff ' +
        playedPercentage +
        '%, white 100%)';
      $('#progress')[0].value = playedPercentage;
      $('#progress').css({ background: str });

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
      duration.text(
        currentMin + ':' + currentSec + '/' + fullMin + ':' + fullSec
      );
    });
  }
  showDuration();
  ///////////////////////// Adding volume control

  var speaker = $('#speaker');
  speaker.click(function () {
    if (audio.muted) {
      audio.muted = false;

      speaker.attr('src', './icons/volume-down-solid.svg');
    } else {
      audio.muted = true;
      speaker.attr('src', './icons/volume-mute-solid.svg');
    }
  });

  var volMin = $('#vol-min');

  volMin.click(function () {
    if (audio.volume > 0.1) {
      if (audio.muted) {
        audio.muted = false;
        speaker.attr('src', './icons/volume-down-solid.svg');
      }
      let currentVol = audio.volume;
      currentVol = currentVol - 0.1;
      audio.volume = currentVol;
    }
  });

  var volPlus = $('#vol-plus');
  volPlus.click(function () {
    if (audio.volume < 1) {
      if (audio.muted) {
        audio.muted = false;
        speaker.attr('src', './icons/volume-down-solid.svg');
      }
      let currentVol = audio.volume;
      currentVol = currentVol + 0.1;
      audio.volume = currentVol;
    }
  });

  //////// adding seekable functionality
  $('#progress').on({
    input: function () {
      let str =
        'linear-gradient(to right, blueviolet 0%, blueviolet ' +
        this.value +
        '%, #fff ' +
        this.value +
        '%, white 100%)';
      $('#progress').css({
        background: str,
      });
      audio.currentTime = (this.value * audio.duration) / 100;
    },
  });

  ////////// audio ended then next
  audio.addEventListener('ended', function () {
    songForward();
  });

  ////// giving some click style for icons

  var icons = $('.icon');
  for (let i = 0; i < icons.length; i++) {
    icons[i].click(function () {
      icons[i].style.backgroundColor = '#00D2FF';
      setTimeout(() => {
        icons[i].style.backgroundColor = '#fff';
      }, 100);
    });
  }

  //////designing volume bar
  $('#curr-vol').on({
    input: function () {
      let str =
        'linear-gradient(to right, #fd019d 0%, #fd019d ' +
        this.value +
        '%, #fff ' +
        this.value +
        '%, white 100%)';
      $('#curr-vol').css({
        background: str,
      });
      let myval = this.value / 100;
      myval = myval.toFixed(1);
      audio.volume = myval;
    },
  });

  var volCurrProgress = $('#vol-curr-progress');
  audio.addEventListener('volumechange', function () {
    let currentVol = audio.volume;
    let str =
      'linear-gradient(to right, #fd019d 0%, #fd019d ' +
      currentVol * 100 +
      '%, #fff ' +
      currentVol * 100 +
      '%, white 100%)';
    $('#curr-vol').css({
      background: str,
    });
  });

  audio.pause();
  playPause.attr('src', './icons/play-solid.svg'); //audio was playing as soon as it was loading so did this

  /////////playlist arrow-style
  $('#playlist').on({
    mouseenter: function () {
      $('#arrow').css({ transform: 'rotateZ(-180deg)' });
    },
    mouseleave: function () {
      $('#arrow').css({ transform: 'rotateZ(0deg)' });
    },
  });

  ///////////generating playlist cards
  function generatePLaylist() {
    //   <div class="playlist-item">
    //   <h1 class="song-title">Attention</h1>
    //   <p class="song-duration">00:00</p>
    // </div>
    for (let i = 0; i < response.length; i++) {
      let playItem = $('<div>').addClass('playlist-item');
      let title = $('<h1>').addClass('song-title').text(response[i].title);
      let thumbnail = $('<img>')
        .addClass('playlist-thumb')
        .attr('src', response[i].thumbnail);
      playItem.append(title, thumbnail);
      playItem.attr('id', response[i].id);
      if (currentSong == i) {
        playItem.css({
          'background-color': '#d1e079',
        });
      }
      playItem.click(function () {
        currentSong = i;
        var currentThumb = response[currentSong].thumbnail;
        var currentUrl = response[currentSong].url;
        var currentTitle = response[currentSong].title;
        audio.src = currentUrl;
        $('.playlist-item').css({
          'background-color': 'rgba(255, 255, 255, 0.1)',
        });
        playItem.css({ 'background-color': '#d1e079' });

        songTitle.text(currentTitle);
        backgroundImg.attr('src', currentThumb);
        songThumb.attr('src', currentThumb);
        audio.play();
        playPause.attr('src', './icons/pause-solid.svg');
      });
      $('#playlist-items').append(playItem);
    }
  }
  $('#playlist').on({
    mouseleave: function () {
      document.getElementById('search-box').value = '';
      $('.playlist-item').removeClass('hidden');
    },
  });
  /////////////////sending new audio to backend
  function dataSend(data) {
    $.post(
      'https://5ee2489c8b27f30016094881.mockapi.io/music',
      data,
      function () {
        location.assign('./index.html');
      }
    );
  }
  $('#btn-send').click(function () {
    if (
      $('.song-input')[1].value != null &&
      $('.song-input')[1].value != '' &&
      $('.song-input')[0].value != null &&
      $('.song-input')[0].value != '' &&
      $('.song-input')[2].value != '' &&
      $('.song-input')[1].value != null
    ) {
      let data = {
        title: $('.song-input')[0].value,
        thumbnail: $('.song-input')[1].value,
        url: $('.song-input')[2].value,
      };
      dataSend(data);
    }
  });
  //////////////////enabling search box
  $('#search-box').on({
    input: function () {
      let myInput = $('#search-box')[0].value;
      myInput = myInput.toLowerCase();
      if (myInput != null) {
        for (let i = 0; i < response.length; i++) {
          if (response[i].title.toLowerCase().indexOf(myInput) == -1) {
            $('.playlist-item').eq(i).addClass('hidden');
          } else {
            $('.playlist-item').eq(i).removeClass('hidden');
          }
        }
      } else {
        $('.playlist-item').removeClass('hidden');
      }
    },
  });
  ////////adding mobile screen smaller playcard switch
  // $('#player-card').click(function () {
  //   if ($('#player-thumb').hasClass('hide')) {
  //     $('#player-thumb').removeClass('hide');
  //     $('#player-card').removeClass('changeHeight');
  //   } else {
  //     $('#player-thumb').addClass('hide');
  //     $('#player-card').addClass('changeHeight');
  //   }
  // });
});
