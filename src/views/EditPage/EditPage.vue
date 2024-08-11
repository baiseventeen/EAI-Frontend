<!--
  Description: 写作界面。
  Author: BaiQi
  Created Date: 2024-6-22
-->
<template>

  <div class="my-work">

    <div class="my-work-slider">
      <AIChatter :dialogueId="dataForm.dialogueId" :messages="dataForm.messages" />

      <Dictionaries />
    </div>
    <div class="my-work-input">
      <Edit :engagement="dataForm.engagement"/>
    </div>
    <Slider :dialogueId="dataForm.dialogueId"/>
  </div>
</template>

<script setup lang="ts">
  import AIChatter from "@/components/AIChatter/AIChatter.vue";
  import Dictionaries from "@/views/Home/component/Dictionaries/index.vue";
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import router from "@/router"
  import {onMounted, reactive, ref, watchEffect} from "vue";
  import type {engagementVO} from "@/types/vo";
  import type {IDialogue} from "@/types/dialogue.ts";
  import Edit from "@/views/Home/component/Edit/index.vue";
  import Slider from '@/views/Home/component/Silder/index.vue'
  import "./index.scss"
  import {useRoute} from 'vue-router'

  // 获得路由中的assignmentId
  const route = useRoute()
  const assignmentId = Number(route.params.assignmentId)

  const apis = useApis()
  const store = useStore()

  const dataForm = reactive<{
    messages: IDialogue[],
    dialogueId: string;
    engagement: engagementVO
  }>({
    messages: [],
    dialogueId: '',
    engagement: {} as engagementVO
  })

  // 获取数据
  async function fetchData(){
    await apis.getAIDialogues(assignmentId, store.user.id)
        .then((_res:any) => {
          const data = _res.data.data
          Object.assign(dataForm, {
            dialogueId: data?.dialogueId,
            //TODO:AI对话拿到的字符串
            messages: data?.messages.content,
            engagement: dataForm.engagement
          })
        })

    await apis.getEngagement(store.user.id, assignmentId)
        .then((_res:any) => {
          Object.assign(dataForm, {
            dialogueId: dataForm.dialogueId,
            messages: dataForm.messages,
            engagement: _res.data.data
          })
        }).catch((_err:any) => {
          router.push("/login")
        })
  }

  onMounted( () => {
    fetchData()
  })

</script>

<script lang="ts">
export default {
  name: "EditPage"
}
</script>

<!--<style module>-->
<!--//@import "CoursePage.scss";-->
<!--</style>-->