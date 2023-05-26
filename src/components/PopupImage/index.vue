<script setup>
import { defineProps, defineEmits} from 'vue'

const props = defineProps({
  imageSrc: {
    type: String
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <van-popup
    v-model:show="props.modelValue"
    :transition-appear="true"
    closeable
    close-icon="close"
    :overlay-style="{ background: 'rgba(0, 0, 0, 0.3)' }"
    round
    @click-overlay="emit('update:modelValue', $event.target.value)"
    @click-close-icon="emit('update:modelValue', $event.target.value)"
  >
    <van-image class="photoBigSize" fit="fill" :src="imageSrc" />
  </van-popup>
</template>

<style scoped lang="less">
/* 添加你的样式代码 */
</style>
