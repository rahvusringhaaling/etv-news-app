window.play = function () {
  console.log('play()');
}

window.stop = function () {
  console.log('stop()');
}

window.next = function () {
  console.log('next()');
}

window.update = function (data) {
  console.log('update() ' + data);
}

window.onerror = function (msg) {
  console.log('error ' + msg);
}

window.onload = function () {
  var chromeVersion = window.navigator.userAgent.match(/Chrome\/([^ ]+)/)[1];
  var chromeMajorVersion = parseInt(chromeVersion.split('.')[0]);

  if (!window.caspar && chromeMajorVersion > 90) {
    document.querySelector('body').style.backgroundColor = 'black';
    console.log('Changing background color to black.');
  }

  var background = document.querySelector('#background');
  var firstRow = document.querySelector('#row-1');
  var secondRow = document.querySelector('#row-2');

  var maxWidth = 1000;

  socket.on('server/title/add', onTitleAdd);
  socket.on('server/title/remove', onTitleRemove);

  function sendHeartbeat() {
    socket.emit('template/template/heartbeat', Date.now());
  }

  sendHeartbeat();
  setInterval(sendHeartbeat, 3000);

  function onTitleAdd(data) {
    firstRow.innerText = data.firstRow;
    secondRow.innerText = data.secondRow.toUpperCase();

    if (data.secondRow.length > 0) {
      background.src = '/images/name_strap_2L.png'
      firstRow.style.top = '920px';
    } else {
      background.src = '/images/name_strap_1L.png'
      firstRow.style.top = '960px';
    }

    maxWidth = 510;
    scaleElement(firstRow, maxWidth);
    scaleElement(secondRow, maxWidth);

    gsap.fromTo('#lower-third', { opacity: 0 }, { opacity: 1, duration: 0.6 });
  }

  function onTitleRemove() {
    gsap.fromTo('#lower-third', { opacity: 1 }, { opacity: 0, duration: 0.6, });
  }

  function scaleElement(element, maxWidth) {
    var scale = element.offsetWidth > maxWidth ? maxWidth / element.offsetWidth : 1;
    element.style.transform = 'scale(' + scale + ')';
    element.style.webkitTransform = 'scale(' + scale + ')';;
  }
}
