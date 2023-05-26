<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { getCameraList, getUserLD } from '@/api/index'
import { showFailToast, showToast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const userId = ref('')
const checkbox = ref(true)
const listData = reactive({
  data: [],
})
const query = ref({})
// 跳转视频播放页
const openVedio = async (val) => {
  userId.value = localStorage.getItem('userId') || getAbility() // 判断从哪跳转进来的 如果正常走的home页进来的 就是代表本地是有userId的 否则在请求一遍
  const { code } = await getUserLD({ userid: userId.value })
  // 把获取的数去放在数组里
  const data = [val.resCode]
  // 根据客户端接口返回布尔值，判断走哪一步，false的话执行原逻辑 跳转页面播放
  em.ready(function () {
    if (em.checkJsApi('yushiDataList') && code === 200) {
      em.invoke('yushiDataList', {
        //传摄像头数据
        datalist: JSON.stringify(data),

        success: function (argument) {
          //不做处理
        },
      })
    } else {
      router.push({
        name: 'Vedio',
        query: {
          resCode: val.resCode,
        },
      })
    }
  })
}
const isLoading = ref(false)
const getDepartments = async () => {
  isLoading.value = true
  let obj = {}
  // 上级页面一样  需要做判断路径接收的参数
  if (query.value.id) {
    obj = {
      id: query.value.id,
      type: query.value.type,
      token: localStorage.getItem('token'),
    }
  } else {
    obj = {
      parameter: query.value.parameter,
      token: localStorage.getItem('token'),
    }
  }

  const res = await getCameraList(obj)
  isLoading.value = false
  if (res.code === 200) {
    listData.data = res.data
  } else {
    showFailToast(res.message)
  }
}
// 多选处理
const checkedArr = ref([])
const operation = async () => {
  if (checkbox.value) {
    if (checkedArr.value.length === 0) {
      showToast('请选择监控设备')
      return
    }
    // 获取code值 判断是否为领导
    userId.value = localStorage.getItem('userId') || getAbility() // 判断从哪跳转进来的 如果正常走的home页进来的 就是代表本地是有userId的 否则在请求一遍
    const { code } = await getUserLD({ userid: userId.value })
    console.log(code)
    em.ready(function () {
      if (em.checkJsApi('yushiDataList') && code === 200) {
        em.invoke('yushiDataList', {
          //传摄像头数据
          datalist: JSON.stringify(checkedArr.value),

          success: function (argument) {
            //不做处理
          },
        })
      } else {
        //走现在的逻辑
        router.push({
          name: 'Vedio',
          query: {
            resCode: checkedArr.value.toString(),
          },
        })
      }
    })
  } else {
    checkbox.value = true
  }
}
// 如果当前页面不是从home页进来的 说明本地还没有ueseid 那么要获取一遍
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
onMounted(() => {
  // 不论是从自己的页面还是从其他的页面进来都是接受一个对象 只有包含id的才是自己的页面跳转的
  if (route.query.id || route.query.parameter) {
    query.value = route.query
    getDepartments()
  }
})
</script>

<template>
  <div class="app-container">
    <!-- <TopMenu menuTitle="视频列表"> -->
    <van-pull-refresh v-if="listData.data.length > 0" v-model="isLoading" @refresh="getDepartments">
      <van-checkbox-group max="4" v-model="checkedArr">
        <div v-for="(item, index) in listData.data" :key="index" class="card-item">
          <div class="flex">
            <van-checkbox v-show="checkbox" :name="item.resCode" />
            <span>{{ item.resName }}</span>
          </div>
          <img src="@/assets/img/jiankong.png" @click.stop="openVedio(item)" />
        </div>
      </van-checkbox-group>
    </van-pull-refresh>
    <van-empty v-else description="暂无内容" />
    <div class="operation" @click="operation">
      {{ checkbox ? '确认' : '多选' }}
    </div>
    <!-- </TopMenu> -->
  </div>
</template>

<style scoped>
.operation {
  position: absolute;
  top: 50vh;
  right: 10px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  background-color: #6eaef4;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.flex {
  display: flex;
}

.flex span {
  margin-left: 10px;
}

.card-btn {
  display: flex;
}

.card-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 10px 0 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
}

.card-item img {
  width: 20px;
  height: 23px;
  margin-right: 20px;
}

.card-item span {
  font-weight: 600;
}

:deep(.van-tabs__line) {
  background-color: #6eaef4;
}

:deep(.van-tab) {
  font-size: 16px;
}

:deep(.van-tab--active) {
  font-weight: 600;
}

:deep(.van-pull-refresh) {
  height: calc(100vh - 70px);
  overflow-y: scroll;
}

:deep(.van-button) {
  width: 50px;
}
</style>
