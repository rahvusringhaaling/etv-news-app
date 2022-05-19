<script lang="ts">
  import { onDestroy } from "svelte";

  let time = '';
  let date = '';

  const interval = setInterval(() => {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();

    const dayNumber = now.getDate();
    const dayName = now.toLocaleDateString('et', { weekday: 'long' });
    const monthName = now.toLocaleString('et', { month: 'long' });

    time = getFormattedTime(hours, minutes);
    date = `${dayName}, ${dayNumber}. ${monthName}`;
  }, 1000);

  function getFormattedTime(hours: number, minutes: number) {
    return `${padZeroes(hours)}:${padZeroes(minutes)}`
  }

  function padZeroes(n: number, maxLength = 2) {
    return String(n).padStart(maxLength, '0');
  }

  onDestroy(() => {
		clearInterval(interval);
	});
</script>

<main>
  <header>
    <div class="left">
      <div>logo</div>
      <div>
        <span class="time">{time}</span>
        <span class="date">{date}</span>
      </div>
    </div>
    <div class="right" />
  </header>
</main>

<style>
  header {
    display: flex;
  }

  header .left {
    display: flex;
    align-items: center;
    height: 168px;
    width: 1485px;

    color: #282828;
    background-color: #dddddd;
    font-size: 40px;
    font-family: "AvenirNextLTPro";
  }

  .left div:first-child {
    padding-left: 145px;
  }

  .left div:last-child {
    padding-left: 300px;
  }

  .time {
    font-weight: bold;
    margin-right: 30px;
  }

  header .right {
    width: 435px;
    height: 168px;
    background-color: #1d1d1d;
  }
</style>
