<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getAccidentList, oneClickRead, getUser, getManageList } from '@/api/index'
import { showFailToast, showLoadingToast } from 'vant'
import { useRouter } from 'vue-router'
const router = useRouter()
const userId = ref('')
const value1 = ref(0)
const option1 = [
  { text: '全部', value: 0 },
  { text: '事故', value: 1 },
  { text: '管制', value: 2 },
  { text: '施工', value: 4 },
]
const value2 = ref('')
const option2 = ref([{ text: '全部', value: '' }])
const getManage = async () => {
  const res = await getManageList()
  if (res.code === 200) {
    let arr = res.data.map((item) => {
      return {
        text: item.label,
        value: item.label,
      }
    })
    option2.value = option2.value.concat(arr)
  }
}
const listData = reactive({
  data: [],
})
const isLoading = ref(false)
const getDepartments = async () => {
  isLoading.value = true
  const obj = {
    userid: userId.value,
    // userid: 897,
    type: value1.value,
    orgId: value2.value,
  }
  const res = await getAccidentList(obj)
  isLoading.value = false
  if (res.code === 200) {
    listData.data = res.data
  } else {
    showFailToast(res.message)
  }
}
const getAbility = () => {
  // 本地改使用
  // getDepartments()
  em.ready(() => {
    // 执行接口调用
    em.getUserInfo({
      userId: '',
      success(argument) {
        userId.value = argument.userlist[0].id
        getDepartments()
        localStorage.setItem('userId', userId.value)
      },
    })
  })
}
const themeVars = {
  dropdownMenuHeight: '30px',
}
const goDetail = (val) => {
  router.push({
    name: 'Detail',
    query: { id: val.id, type: val.accidentType, isRead: val.isRead },
  })
}
// 一键已读
const read = async () => {
  const obj = {
    userid: userId.value,
    type: value1.value,
  }
  const toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
    loadingType: 'spinner',
  })
  const res = await oneClickRead(obj)
  toast.close()
  if (res.code !== 200) {
    showFailToast(res.message)
  } else {
    // 点击一键已读刷新页面
    getDepartments()
  }
}
// 获取token
const getUserInfo = async () => {
  const res = await getUser()
  if (res.code === 200) {
    localStorage.setItem('token', res.data)
  }
}
onMounted(() => {
  getUserInfo()
  getAbility()
  getManage()
})
</script>

<template>
  <div class="app-container">
    <!-- <TopMenu :is-back="false"> -->
    <div class="tabbar">
      <van-dropdown-menu :theme-vars="themeVars">
        <van-dropdown-item v-model="value1" :options="option1" @change="getDepartments" />
      </van-dropdown-menu>
      <van-dropdown-menu :theme-vars="themeVars">
        <van-dropdown-item v-model="value2" :options="option2" @change="getDepartments" />
      </van-dropdown-menu>
      <van-button type="default" @click="read">一键设为已读</van-button>
    </div>
    <van-pull-refresh v-if="listData.data.length > 0" v-model="isLoading" @refresh="getDepartments">
      <CardItem
        v-for="(item, index) in listData.data"
        :key="item.id"
        :unread="item.isRead === '1'"
        :title="item.accidentType"
        :content="item.title"
        :origin-name="item.orgid"
        :start-time="item.startTime"
        :end-time="item.esEndTime"
        :grade="item.suddenLevel"
        :status="1"
        @click="goDetail(item)"
      >
      </CardItem>
    </van-pull-refresh>
    <van-empty v-else description="暂无内容" />
    <!-- </TopMenu> -->
  </div>
</template>

<style scoped>
.tabbar {
  display: flex;
  justify-content: space-between;
  height: 42px;
}

.card-btn {
  display: flex;
}

:deep(.van-pull-refresh) {
  height: calc(100vh - 42px);
  overflow-y: scroll;
}

:deep(.van-button--default) {
  width: max-content;
  padding: 5px;
  margin: 5px 10px;
  height: 30px;
  line-height: 30px;
  border: none;
}

:deep(.van-dropdown-menu__bar) {
  height: 30px;
  line-height: 30px;
  margin: 5px 10px;
  padding-right: 10px;
  border-radius: 2px;
}
</style>
