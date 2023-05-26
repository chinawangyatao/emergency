<template>
    <div class="padding-top-30">
        <video controls ref="audioRef">
            <source :src="videoSrc" />
        </video>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
const props = defineProps(['src'])
const videoSrc = ref(props.src)
console.log('videoSrc------>',videoSrc)


</script>
<style lang="less">
.padding-top-30{padding-top: 30px;}
video{width: 375px;max-height: 400px;vertical-align: bottom;}
</style>