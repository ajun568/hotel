<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
@import './common/common.less';
@import './common/btn.less';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

@font-face {
  font-family: 'iconfont';  /* project id 648136 */
  src: url('//at.alicdn.com/t/font_648136_m49o5ctnutprpb9.eot');
  src: url('//at.alicdn.com/t/font_648136_m49o5ctnutprpb9.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_648136_m49o5ctnutprpb9.woff') format('woff'),
  url('//at.alicdn.com/t/font_648136_m49o5ctnutprpb9.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_648136_m49o5ctnutprpb9.svg#iconfont') format('svg');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}


/*滚轮重置*/
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0.2);
    -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
}
</style>
