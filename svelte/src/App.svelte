<script lang="ts">
  import { io } from "socket.io-client";
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  const chromeVersion = window.navigator.userAgent.match(/Chrome\/([^ ]+)/)[1];
  const chromeMajorVersion = parseInt(chromeVersion.split(".")[0]);

  if (!window["caspar"] && chromeMajorVersion > 90) {
    document.querySelector("body").style.backgroundColor = "black";
    console.log("Changing background color to black.");
  }

  let src: string;
  let firstRow: HTMLElement;
  let secondRow: HTMLElement;
  let maxWidth = 1000;

  let socket: any;

  onMount(() => {
    socket = io(`ws://localhost:${window.location.port}`);

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
      src = "/images/name_strap_2L.png";
      firstRow.style.top = "920px";
    } else {
      src = "/images/name_strap_1L.png";
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

  function scaleElement(element: HTMLElement, maxWidth: number) {
    const width = element.offsetWidth;
    const scale = width > maxWidth ? maxWidth / width : 1;
    element.style.transform = `scale(${scale})`;
    element.style.webkitTransform = `scale(${scale})`;
  }
</script>

<main>
  <div id="lower-third">
    <img id="background" {src} alt="" />
    <div bind:this={firstRow} id="row-1" class="title" />
    <div bind:this={secondRow} id="row-2" class="title" />
  </div>
</main>

<style>
</style>
