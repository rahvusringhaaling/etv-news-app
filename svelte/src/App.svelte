<script lang="ts">
  import { io } from "socket.io-client";
  import { onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import Content from "./components/Content/ContentContainer.svelte";
  import Right from "./components/Right/RightContainer.svelte";

  const chromeVersion = window.navigator.userAgent.match(/Chrome\/([^ ]+)/)[1];
  const chromeMajorVersion = parseInt(chromeVersion.split(".")[0]);

  if (!window["caspar"] && chromeMajorVersion > 90) {
    document.querySelector("body").style.backgroundColor = "black";
    console.log("Changing background color to black.");
  }

  let socket: any;

  onMount(() => {
    socket = io(`ws://localhost:${window.location.port}`);

    sendHeartbeat();
    setInterval(sendHeartbeat, 3000);
  });

  function sendHeartbeat() {
    socket.emit("template/template/heartbeat", Date.now());
  }
</script>

<main>
  <div class="root-container">
    <Header />
    <div class="bottom-container">
      <Content />
      <Right />
    </div>
  </div>
</main>

<style>
  .root-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
  }

  .bottom-container {
    display: flex;
  }
</style>
