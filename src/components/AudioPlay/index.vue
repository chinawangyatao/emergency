<template>
    <div class="padding-top-30">
        <audio controls ref="audioRef">
            <source :src="audioSrc" />
        </audio>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
const props = defineProps(['src'])
const audioSrc = ref(props.src)
console.log('audioSrc------>',audioSrc)


</script>
<style lang="less">
.padding-top-30{padding-top: 30px;}
</style>