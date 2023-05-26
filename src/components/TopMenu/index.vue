<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  menuTitle: {
    type: String,
    default: '事件处置',
  },
  isBack: {
    type: Boolean,
    default: true,
  },
})
const router = useRouter()
const backRoute = () => {
  router.go(-1)
}
const $myemit = defineEmits(['search'])
const searchValue = ref('')
const clickSearch = () => {
  $myemit('search', searchValue.value)
}
</script>

<template>
  <div class="menu-form">
    <div class="title">
      <span v-show="props.isBack" @click="backRoute"><van-icon name="arrow-left" /></span>
      {{ props.menuTitle }}
    </div>
    <van-search v-if="props.isSearch" v-model="searchValue" placeholder="搜索" @search="clickSearch" />
    <div class="menu-body">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.menu-form {
  position: fixed;
  width: 100vw;
  height: 120px;
  background-color: #6eaef4;

  .title {
    position: absolute;
    top: 20px;
    padding: 10px;
    color: #fff;
    font-size: 16px;
  }

  .van-search {
    position: relative;
    top: 60px;
    background-color: #6eaef4;
  }

  .menu-body {
    position: absolute;
    width: 100vw;
    height: calc(100vh - 70px);
    top: 70px;
    overflow-y: scroll;
    background-color: #F5F5F5;
  }
}
</style>
