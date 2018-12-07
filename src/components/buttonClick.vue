<template>
  <div>
    <h1>我是以components形式出现的I am a Counter Component. Edit me in dev mode.</h1>
    <p>Current count: {{count}}</p>
  </div>
  <!-- <div class="music">
    <audio src="../music/fire.mp3" preload="preload" loop="loop" hidden="hidden"></audio>
  </div> -->

</template>

<script>
export default {
  name: 'buttonClick',
  data () {
    return { count: 1 }
  },
  created () {
    this.handle = setInterval(() => {
      this.count++
    }, 1000)
  },
  destroyed () {
    clearInterval(this.handle)
  },
  // render:h=>(h)
}
</script>
<style scoped>
  h1{
    color:red;
  }
</style>
