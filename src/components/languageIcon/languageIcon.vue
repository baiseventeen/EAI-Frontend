<!--
  Description: 中英文转换效果组件，在字典组件中。
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
  <div :class="$style['language-icon']" @click="onChange">
    <div class="text-icons.y">中</div>
      <Refresh />
    <div :class="['text-icons', language == 'en' ? 'z' : 'y']">英</div>
  </div>
</template>

<script lang="ts" setup>
  import {Refresh} from "@element-plus/icons-vue"
  import {defineProps, ref} from 'vue'

  const props = defineProps<{
    currentLanguage: string
  }>()

  let language = ref(props.currentLanguage)

  const onChange = () =>{
    console.log("点击了")
    language.value = language.value == 'zh' ? 'en' : 'zh'
    console.log(language.value)
  }
</script>

<script lang="ts">
export default {
  name: "LanguageIcon"
}
</script>

<style module>
@import "index.scss";
</style>
