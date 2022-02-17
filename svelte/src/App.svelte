<script lang="ts">
  import { io } from "socket.io-client";
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  export let name: string;

  let chromeVersion = window.navigator.userAgent.match(/Chrome\/([^ ]+)/)[1];
  let chromeMajorVersion = parseInt(chromeVersion.split(".")[0]);

  if (!window["caspar"] && chromeMajorVersion > 90) {
    document.querySelector("body").style.backgroundColor = "black";
    console.log("Changing background color to black.");
  }

	let background;
  let firstRow;
  let secondRow; 
  let maxWidth = 1000;
  
	let socket;

  onMount(() => {
    background = document.querySelector("#background") as HTMLImageElement;
    firstRow = document.querySelector("#row-1") as HTMLElement;
    secondRow = document.querySelector("#row-2") as HTMLElement;

    socket = io(`ws://localhost:${8089}`);

    socket.on("server/title/add", onTitleAdd);
    socket.on("server/title/remove", onTitleRemove);

    sendHeartbeat();
    setInterval(sendHeartbeat, 3000);
  });

  function sendHeartbeat() {
    socket.emit("template/template/heartbeat", Date.now());
  }

  function onTitleAdd(data) {
    firstRow.textContent = data.firstRow;
    secondRow.textContent = data.secondRow.toUpperCase();

    if (data.secondRow.length > 0) {
      background.src = "/images/name_strap_2L.png";
      firstRow.style.top = "920px";
    } else {
      background.src = "/images/name_strap_1L.png";
      firstRow.style.top = "960px";
    }

    maxWidth = 510;
    scaleElement(firstRow, maxWidth);
    scaleElement(secondRow, maxWidth);

    gsap.fromTo("#lower-third", { opacity: 0 }, { opacity: 1, duration: 0.6 });
  }

  function onTitleRemove() {
    gsap.fromTo("#lower-third", { opacity: 1 }, { opacity: 0, duration: 0.6 });
  }

  function scaleElement(element, maxWidth) {
    let scale =
      element.offsetWidth > maxWidth ? maxWidth / element.offsetWidth : 1;
    element.style.transform = "scale(" + scale + ")";
    element.style.webkitTransform = "scale(" + scale + ")";
  }
</script>

<main>
  <h1>Hello, {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>

  <div id="lower-third">
    <img id="background" src="" alt="" />
    <div id="row-1" class="title" />
    <div id="row-2" class="title" />
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
