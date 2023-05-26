<script setup>
import popupImage from "@/components/PopupImage/index.vue"
import { ref, onMounted, reactive } from 'vue'
import { showFailToast } from 'vant'
import { Image as VanImage } from 'vant';
import { useRoute, useRouter } from 'vue-router'
import { getEvolveList } from '@/api/index.js'
import { nextTick } from 'vue';
const route = useRoute()
const router = useRouter()
const active = ref(0)
const userId = localStorage.getItem('userId')
const content = ref('')
const query = ref({})
const arrList = reactive({
  data: [],
})
// 弹出框 - 图片
const imgShow = ref(false);
const imgShowSrc = ref('');
const imgShowType = ref(1);
const showPopup = (type, src) => {
  console.log(type,src)
  imgShowSrc.value = src;
  imgShowType.value = type;
  nextTick(()=>{
    imgShow.value = true;
  })
};
const evolveList = reactive({
  data: [],
})
// const getDetail = async (val) => {
//   const res = await getDetailById(val)
//   if (res.code === 200) {
//     arrList.data = res.data
//     for (let i in arrList.data) {
//       if (i === '现场描述') {
//         content.value = arrList.data[i]
//         delete arrList.data[i]
//       }
//     }
//   }
// }
// 事件进展

const getEvolve = async () => {
  let obj = {}
  if (query.value.id) {
    obj = {
      id: query.value.id,
      type: query.value.type,
      isRead: query.value.isRead,
      userid: userId,
      // userid: 897,
    }
  } else {
    obj = {
      parameter: query.value.parameter,
    }
  }
  const res = await getEvolveList(obj)
  if (res.code === 200) {
    evolveList.data = res.data.disposalLogVOS;
    progressDataProcessing();
    arrList.data = res.data.eventDataInfoVOS
    content.value = res.data.title
  } else {
    showFailToast(res.message)
  }
}
// 事件进展数据处理
const progressDataProcessing = () => {
  console.log('事件进展---------res----disposalLogVOS--->', evolveList.data);
  let processedData = evolveList.data.map((item, i) => {
    if (item.oper_label) {
      item.oper_label = item.oper_label.replaceAll('"', '').replaceAll('</br>', '\n');
      const ind = item.oper_label.search(/https?:\/\//g);
      if (ind > -1) {
        item.image = item.oper_label.slice(ind);
        item.oper_label = item.oper_label.slice(0, ind);
      }
    }
    if (item.image && typeof item.image === 'string') {
      const regMedia = /(jpg|jpeg|png|mp4|avi|wmv|mov|mp3)/;
      const regImg = /(jpg|jpeg|png)/; // 图片正则
      const regVideo = /(mp4|avi|wmv|mov)/; // 图片正则
      const regAudio = /(mp3)/; // 音频正则

      const arr = item.image.split(regMedia);

      let mediaArr = {
        imgList: [],
        videoList: [],
        audioList: [],
      };
      arr.forEach((item, index) => {
        if (regImg.test(item)) {
          const src = arr[index - 1] + arr[index];
          mediaArr.imgList.push(src);
        }
        if (regVideo.test(item)) {
          const src = arr[index - 1] + arr[index];
          mediaArr.videoList.push(src);
        }
        if (regAudio.test(item)) {
          const src = arr[index - 1] + arr[index];
          mediaArr.audioList.push(src);
        }
      });
      item.image = mediaArr;
    }
    return item;
  });
  console.log('cc-------------------->', processedData)
  evolveList.data = processedData
}

const goMonitorList = () => {
  let obj = {}
  // 点击视频按钮也是如此 需要判断是不是有id
  if (query.value.id) {
    obj = {
      id: query.value.id,
      type: query.value.type,
    }
  } else {
    obj = {
      parameter: query.value.parameter,
    }
  }
  router.push({
    name: 'VedioList',
    query: obj,
  })
}
// 图片点击事件
const show = ref(false)
const srcImage = ref("")
const showImage = (val)=>{
  show.value=!show.value
  srcImage.value = val
}
onMounted(async () => {
  if (route.query.id) {
    query.value = route.query
    // const obj = {
    //   id: query.value.id,
    //   type: query.value.type,
    //   isRead: query.value.isRead,
    //   userid: userId,
    // }
    // await getDetail(obj)
    await getEvolve()
  } else {
    // 因为部署到手机端所以要从别的页面点击进来 没有id就执行这个方法
    query.value = route.query
    await getEvolve()
  }
})
</script>

<template>
  <div class="app-container">
    <!-- <TopMenu> -->
    <van-tabs v-model:active="active">
      <van-tab title="基本信息">
        <van-cell-group inset>
          <van-cell>
            <template #title>
              <span class="cell-title">现场描述</span>
            </template>
            <template #label>
              <span class="cell-label">{{ content }}</span>
            </template>
          </van-cell>
          <van-cell v-for="(item, index) in arrList.data" :key="index" :title="item.attr_label"
                    :border="false" >
            <div v-if="item.attr_label==='图片'"><van-image fit='contain center' :src='item.value' @click='showImage(item.value)'/></div>
            <div v-else>{{item.attr_label}}</div>

          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="事件进展">
        <van-steps direction="vertical" :active="-1">
          <van-step v-for="(item, index) in evolveList.data" :key="index">
            <h3>{{ item.oper_date }}</h3>
            <!-- 后端返回数据包含换行标签</br> 故使用 v-html 解析 -->

            <div class="card" v-html="item.oper_label"></div>
            <div :key="index" class="ku-img-list" v-if="item.image">
              <van-row gutter="10">
                <van-col span="8" v-for="(items, index) in item.image.imgList" key="index">
                  <div class="ku-img-item" @click="showPopup('1', items)">
                    <van-image width="100" height="100" :src="items"  fit="contain" />
                  </div>
                </van-col>
                <van-col span="8"  v-for="(items, index) in item.image.audioList" key="index">
                  <div class="ku-img-item" @click="showPopup('2', items)">
                    <van-icon size="30" name="service" />
                  </div>
                </van-col>
                <van-col span="8"  v-for="(items, index) in item.image.videoList" key="index">
                  <div class="ku-img-item" @click="showPopup('3', items)">
                    <van-icon size="30" name="video-o" />
                  </div>
                </van-col>
              </van-row>

            </div>
            <!-- 图片弹出框 -->
            <van-popup v-model:show="imgShow" transition-appear='true' closeable close-icon="close" 
              :overlay-style="{ background: 'rgba(0, 0, 0, 0.3)' }" lock-scroll='false' round>
              <van-image v-if="imgShowType == 1" width="100%" height="auto" :src="imgShowSrc" fit="contain" />
              <AudioPlay  v-if="imgShowType == 2" :src="imgShowSrc" ></AudioPlay>
              <!-- <video v-if="imgShowType == 3" :src="imgShowSrc" ref="videoRef"></video> -->
              <VideoPlay  v-if="imgShowType == 3" :src="imgShowSrc"></VideoPlay>




            </van-popup>

          </van-step>
        </van-steps>
      </van-tab>
      <popupImage v-model='show' :image-src='srcImage'/>
    </van-tabs>
    <div class="tabbar">
      <img src="@/assets/img/jiankong.png" @click="goMonitorList" />
      <span>现场监控</span>
    </div>
    <!-- </TopMenu> -->
  </div>
</template>
<style lang="less">
.ku-img-list {
  .ku-img-item {
    text-align: center;
    display: inline-block;
    border: 1px solid #999;
    margin-bottom: 10px;
    border-radius: 1.6vw;
    width: 100%;
    height: 100px;
    line-height: 100px;
    overflow: hidden;
    .van-icon{
      position: relative;
      top: 10px;
    }
    .van-image {
      img {
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
    }
    audio,video{width: 100%;}

  }
}

.van-popup {
  .van-image {
    img {
      vertical-align: top;
      max-width: 100%;
    }
  }
}
</style>
<style lang="less" scoped>
.tabbar {
  position: fixed;
  width: 100%;
  height: 80px;
  bottom: 0;
  text-align: center;
  background-color: #fff;

  img {
    position: relative;
    top: 5px;
    width: 30px;
    height: 35px;
  }

  span {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.card {
  color: #333;
  font-size: 16px;
  padding: 15px 10px;
  background-color: #fff;
  border-radius: 15px;
  white-space: pre-wrap; // 解析返回的数据是否空白、换行符
}

.photoSmallSize {
  width: 30px;
  height: 40px;
  border: #1989fa 1px solid;
}

.photoBigSize {
  width: 100%;
}

.popupStyle {
  background: rgba(0, 0, 0, 0.54);
}

:deep(.van-step__circle-container) {
  top: 35px;
}

:deep(.van-steps) {
  background-color: #f5f5f5;
}

.cell-title {
  font-size: 16px;
  font-weight: 600;
}

.cell-label {
  font-size: 14px;
  color: #333;
}

:deep(.van-tab__text) {
  font-size: 18px;
}

:deep(.van-tabs__wrap) {
  height: 50px;
}

:deep(.van-cell-group) {
  height: calc(100vh - 150px);
  overflow-y: scroll;
  margin: 10px;
}

:deep(.van-steps) {
  height: calc(100vh - 130px); // 原210px
  overflow-y: scroll;
}

:deep(.van-tabs) {
  position: fixed;
  width: 100%;
}
</style>
