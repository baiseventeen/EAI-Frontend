<!--
  Description: 写作界面右侧，侧边栏组件。
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
  <div :class="rootClassName">
    <div class="slider-icons" @click="toggleShrink">
      <el-icon v-if="isShrink"><Expand/></el-icon>
      <el-icon v-if="!isShrink"><Fold/></el-icon>
    </div>
    <div class="slider-item-box">
      <!--折叠-->
      <template v-if="isShrink">
        <div class="slider-item" @click="toggleShrink">描述</div>
        <div v-if="data.assignment.descriptionFile" class="slider-item" @click="toggleShrink">要求</div>
        <div v-if="data.assignment.attachments" class="slider-item" @click="toggleShrink">附件</div>
        <div class="slider-item" @click="toggleShrink">批改</div>
      </template>
      <!--展开-->
      <template v-else>
        <!--作业名称-->
        <div>{{data.assignment.assignmentName}}</div>
        <!--作业描述-->
        <ExpandableParagraph :text="data.assignment.description" />
        <!--下载按钮-->
        <div class="down">
          <el-link type="primary">下载</el-link>
        </div>
        <!--要求文件和附件-->
        <template v-if="data.assignment.descriptionFile || data.assignment.attachments">
          <div>范文、介绍</div>
          <div class="slider-tag">
            <template v-if="data.assignment.descriptionFile">
              <div class="slider-tag-item" @click="openEditor(data.assignment.descriptionFile, data.assignment.assignmentName)">作业要求</div>
            </template>
            <template v-if="data.assignment.attachments">
              <div v-for="(item, index) in data.assignment.attachments" :key="index" class="slider-tag-item" @click="openEditor(item, '附件' + index)">附件{{ index }}</div>
            </template>
          </div>
        </template>
        <div class="edit-box-header">
          智能批改修改意见
          <el-button @click="handleCorrect">智能批改</el-button>
        </div>
        <div class="capacity-item">
<!--          <el-spin :spinning="loading" style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;">-->
            <div v-if="!loading" class="remark">{{ aiRemark }}</div>
<!--          </el-spin>-->
<!--          <div class='remark'>{{aiRemark}}</div>-->
        </div>
      </template>
    </div>
    <ViewsWordEditor v-if="data.assignment.descriptionFile" :alert="alertProps" :docxInfo="docxInfo"></ViewsWordEditor>
  </div>
</template>

<script lang="ts" setup>
import {defineProps, onMounted, reactive, ref, watch, watchEffect} from 'vue'
  import "./index.scss"
  import type {IAssignment} from "@/types/vo";
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import {Expand, Fold} from "@element-plus/icons-vue"
  import ExpandableParagraph from "@/views/Home/component/Silder/component/ExpandableParagraph.vue";
import ViewsWordEditor from "@/components/ViewsWordEditor/ViewsWordEditor.vue";
import {useRoute} from "vue-router";

  interface ISliderProps {
    dialogueId: string;
  }

  interface IPreviewProps {
    url: string;
    title: string;
  }

  const apis = useApis()
  const store = useStore()
  const props = defineProps<ISliderProps>()

  let isShrink = ref(false)
  let aiRemark = ref("")
  let loading = ref(false)
  let open= ref(false)
  let expanded = ref(false)

  // 获得路由中的assignmentId
  const route = useRoute()
  const assignmentId = Number(route.params.assignmentId)

  let data = reactive<{
    assignment: IAssignment,
    currentPreview: IPreviewProps
  }>({
    assignment: {} as IAssignment,
    currentPreview: {} as IPreviewProps
  })

  const alertProps = reactive({
    open: open.value,
    onOk: () => (open.value = false),
    onCancel: () => (open.value = false),
  });

  const docxInfo = reactive({
    docxUrl: data.currentPreview.url,
    docxTitle: data.currentPreview.title,
  });

  let rootClassName = ref(`slider-content ${isShrink.value ? "shrink" : ""}`);

  const toggleShrink = () => {
    isShrink.value = !isShrink.value;
    rootClassName.value = `slider-content ${isShrink.value ? "shrink" : ""}`
  };

  // 获取作业信息
  const fetchData = () => {
    apis.getAssignmentById(assignmentId).then((res: any) => {
      data.assignment = res.data.data;
      console.log(res.data.data, "获取作业信息")
    });
  };

  // 请求批改
  const handleCorrect = () => {
    loading.value = true;
    apis.rewrite(assignmentId, store.user.id)
        .then((res: any) => {
          aiRemark.value = res.data.data.content;
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {
          loading.value = false;
        });
  };

  const openEditor = (url: string, title: string) => {
    open.value = true;
    data.currentPreview.url = url;
    data.currentPreview.title = title;
    Object.assign(alertProps, {
      open: open.value,
      // onOk: () => (open.value = false),
      onCancel: () => {
        open.value = false
        Object.assign(alertProps,{
          open: open.value,
          onOk: () => (open.value = false),
          onCancel: () => (open.value = false),
        })
        Object.assign(docxInfo, {
          docxUrl: data.currentPreview.url,
          docxTitle: data.currentPreview.title,
        })
      },
    })
    Object.assign(docxInfo, {
      docxUrl: data.currentPreview.url,
      docxTitle: data.currentPreview.title,
    })
  };

  onMounted(() => {
    fetchData();
  });
</script>

<script lang="ts">
export default {
  name: "Slider"
}
</script>
