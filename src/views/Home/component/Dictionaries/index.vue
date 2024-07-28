<!--
  Description: 写作界面左下角，字典组件
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
  <div :class="$style.dictionaries">
    <div :class="$style['dic-box-title']">字典</div>
    <div :class="$style['box-dialog']">
      <el-input
          v-model="content"
          placeholder="请输入搜索内容"
      >
<!--        <template #prefix>-->
<!--          <LanguageIcon :currentLanguage="currentLanguage"></LanguageIcon>-->
<!--        </template>-->
        <template #suffix>
          <el-button @click="search" style="width: 40px; border: none" v-loading="loading">
            <el-icon v-if="!loading" >
              <Search />
            </el-icon>
          </el-button>
        </template>
      </el-input>
      <!--TODO 字典展示-->
      <div>{{ res }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import {ref} from "vue";
  import LanguageIcon from "@/components/languageIcon/languageIcon.vue";
  import {Search} from '@element-plus/icons-vue';

  const apis = useApis()
  const store = useStore()
  const currentLanguage = ref('zh')
  const content = ref('')
  const res = ref('')
  const loading = ref(false)


  const chinesePattern = new RegExp("[\u4E00-\u9FA5]+");
  const englishPattern = new RegExp("[A-Za-z]+");

  const search = () => {
    loading.value = true
    apis.requestDictionary({
      q: content.value,
      from: 'auto',
      to: chinesePattern.test(content.value) ? 'zh-cn' : 'en'
    }, 1, store.user.id)
        .then((response:any) => {
          console.log('requestDictionary', response)
          res.value = response.data.data
          loading.value = false
        })
  }


</script>

<script lang="ts">
export default {
  name: "Dictionaries"
}
</script>

<style module>
@import "index.scss";
</style>
