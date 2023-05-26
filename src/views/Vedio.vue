<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { showFailToast } from 'vant'
import { useRoute } from 'vue-router'
import { getVedioToken, getVedio, stopKeeplive } from '@/api/index'
const token = ref('')
const route = useRoute()
const timer = ref(0)
const userId = ref('')
// 获取视频token，并保持连接
const getToken = async () => {
  const res = await getVedioToken({ userid: userId })
  if (res.code === 200) {
    token.value = res.data
  } else {
    showFailToast(res.message)
  }
}
// 保证连接状态
const keepaliveStatus = async (token) => {
  const res = await keepaliveVedio({
    tokenV2: token,
  })
  if (res.code === 200) {
  } else {
    showFailToast(res.message)
  }
}
const vedioUrl = ref([])
const activeTab = reactive({
  data: 1,
})
const setActive = (value) => {
  activeTab.data = value
}
// 获取视频链接
const getVedioUrl = async (obj) => {
  const res = await getVedio(obj)
  if (res.code === 200) {
    vedioUrl.value = res.data
    // 后端进行保活操作，暂不使用前端
    // keepaliveStatus(token.value)
    // 25秒执行一次，视频保持连接状态
    // timer.value = window.setInterval(() => {
    //   keepaliveStatus(token.value)
    // }, 25000)
  } else {
    showFailToast(res.message)
  }
}
onMounted(async () => {
  userId.value = localStorage.getItem('userId') || getAbility() // 判断从哪跳转进来的 如果正常走的home页进来的 就是代表本地是有userId的 否则在请求一遍
  await getToken()
  const { resCode } = route.query
  const obj = {
    tokenV2: token.value,
    streamNum: 0,
    resCode,
  }
  setActive(resCode.split(',').length > 2 ? 2 : 1)
  await getVedioUrl(obj)
})
const stopKeep = async () => {
  const obj = {
    channelCode: vedioUrl.value.map((item) => item.channelCode).toString(),
    tokenV2: token.value,
    userid: userId,
    isOpen: false,
  }
  await stopKeeplive(obj)
}
// 离开当前页面时销毁定时器,并关闭视频播放
onBeforeUnmount(() => {
  // window.clearInterval(timer.value)
  // 离开页面通知后端关闭保活操作
  stopKeep()
})
// 如果视频页面不是从home页进来的 说明本地还没有ueseid 那么要获取一遍
const getAbility = () => {
  em.ready(() => {
    // 执行接口调用
    em.getUserInfo({
      userId: '',
      success(argument) {
        userId.value = argument.userlist[0].id
      },
    })
  })
}
</script>

<template>
  <div class="app-container">
    <TopMenu menu-title="视频监控">
      <div class="tab-menu">
        <span :class="{ 'tab-active': activeTab.data === 1 }" @click="setActive(1)">画2</span>
        <span :class="{ 'tab-active': activeTab.data === 2 }" @click="setActive(2)">画4</span>
      </div>
      <div
        :class="activeTab.data === 2 ? 'video-wrap' : 'video-column'"
        :style="activeTab.data === 1 ? 'max-height: 420px; overflow: hidden;' : ''"
      >
        <div :class="activeTab.data === 2 ? 'video-item' : 'video-itm'" v-for="(item, index) in vedioUrl">
          <VedioLx
            :height="activeTab.data === 1 ? '200' : '100'"
            :key="index"
            :url="item.hlvURL"
            :id="item.channelCode"
          >
          </VedioLx>
        </div>
      </div>
    </TopMenu>
  </div>
</template>
<style scoped>
.video-wrap {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
}

.video-column {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
}

.video-itm {
  flex: 1;
}

.video-item {
  width: 50%;
}

.tab-menu {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.tab-menu span {
  display: inline-block;
  width: max-content;
  padding: 5px 20px;
  background-color: #fff;
  cursor: pointer;
}

.tab-menu span:nth-child(1) {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.tab-menu span:nth-child(2) {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.tab-active {
  background-color: #6eaef4 !important;
  color: #fff;
}
</style>
