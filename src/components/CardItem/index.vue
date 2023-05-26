<script setup>
import { computed } from 'vue'
const props = defineProps({
  unread: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  status: {
    type: [Number, String],
    default: 1,
  },
  content: {
    type: String,
    default: '',
  },
  startTime: {
    type: String,
    default: '',
  },
  endTime: {
    type: String,
    default: '',
  },
  originName: {
    type: String,
    default: '',
  },
  grade: {
    type: String,
    default: null,
  },
})
const accidentName = computed(() => {
  switch (props.title) {
    case '1':
      return '事故'
    case '2':
      return '管制'
    case '4':
      return '施工'
  }
})
const getStatus = (val) => {
  switch (val) {
    case 1:
      return '处理中'
  }
}
</script>

<template>
  <div class="app-container">
    <van-cell :value="props.originName" center :border="false">
      <template #title>
        <span v-show="!unread" class="red"></span>
        <span v-if="!!grade" class="imgType">
          <img src="~@/assets/img/min.png" alt="" v-if="grade === '一般'" />
          <img src="~@/assets/img/big.png" alt="" v-else-if="grade === '较大'" />
          <img src="~@/assets/img/great.png" alt="" v-else-if="grade === '重大'" />
          <img src="~@/assets/img/large.png" alt="" v-else-if="grade === '特别重大'" />
        </span>
        {{ accidentName }} |
        <van-tag type="warning">{{ getStatus(props.status) }}</van-tag>
      </template>
    </van-cell>
    <div class="content">
      <p>{{ props.content }}</p>
    </div>
    <div class="time">
      {{ `${props.startTime || '无'} ~ ${props.endTime || '无'}` }}
    </div>
  </div>
</template>

<style scoped lang="less">
.app-container {
  width: calc(100vw - 30px);
  margin-bottom: 10px;
  margin-left: 10px;
  padding: 5px;
  background-color: #fff;
  border-radius: 3px;
  .content {
    display: flex;
    align-items: center;
  }
  .imgType {
    display: inline-block;
    width: 34px;
    // margin-right: 5px;
    position: relative;

    img {
      width: 100%;
      vertical-align: -4px;
    }
  }
  p {
    margin: 0;
    padding: 0 10px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    display: -webkit-box;
    /* 对象作为伸缩盒子模型显示 */
    -webkit-box-orient: vertical;
    /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp: 2;
    /* 显示的行数 */
    flex: 1;
  }

  .time {
    padding: 5px 15px;
    color: #999999;
    font-size: 13px;
    text-align: right;
  }

  :deep(.van-tag--warning) {
    background-color: #fdf5eb;
    color: #e9a44e;
  }

  .red {
    position: relative;
    bottom: 2px;
    display: inline-block;
    background-color: red;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>
