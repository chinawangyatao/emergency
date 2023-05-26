<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import flvjs from 'flv.js'
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  height: {
    type: [String, Number],
    default: '200',
  },
})
const flvPlayer = ref('')
onMounted(() => {
  nextTick(() => {
    if (flvjs.isSupported() && props.url) {
      const videoElement = document.getElementById(props.id)
      flvPlayer.value = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: props.url,
      })
      flvPlayer.value.attachMediaElement(videoElement)
      flvPlayer.value.load()
      flvPlayer.value.play()
    }
  })
})
// 离开当前页面时销毁定时器,并关闭视频播放
onUnmounted(() => {
  flvPlayer.value.pause()
})
</script>

<template>
  <div class="video-class">
    <!-- 阻止点击屏幕导致暂停 -->
    <video
      controlsList="nodownload noplaybackrate"
      disablepictureinpicture
      :style="`height: ${props.height}px`"
      class="videoElement"
      controls
      :id="props.id"
      @click.prevent="() => {}"
    ></video>
  </div>
</template>

<style scoped lang="less">
//播放按钮
video::-webkit-media-controls-play-button {
  display: none;
}

//进度条
video::-webkit-media-controls-timeline {
  display: none;
}

//观看的当前时间
video::-webkit-media-controls-current-time-display {
  display: none;
}

//剩余时间
video::-webkit-media-controls-time-remaining-display {
  display: none;
}

//音量按钮
video::-webkit-media-controls-mute-button {
  display: none;
}

// 画中画
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}

//音量的控制条
video::-webkit-media-controls-volume-slider {
  display: none;
}

.video-class {
  position: relative;
  width: calc(100% - 10px);
  margin: 5px 0;
  margin-left: 5px;
  border-radius: 5px;
  background-color: #fff;
}

:deep(.d-player-wrap) {
  border-radius: 5px;
}

.videoElement {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
</style>
