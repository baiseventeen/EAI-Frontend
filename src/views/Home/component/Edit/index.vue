<!--
  Description: 写作界面中间，主要的写作组件，内含onlyoffice
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
  <div class="edit">
<!--    <el-message :message="messageApi"></el-message>-->
    <div class="edit-box">
      <div>编辑区</div>
      <div class="edit-root">
        <WordEditor
            @value-change="handleValueChange"
            :document-key="engagement?.fileKey"
            :document-title="data.fileTitle"
            :document-url="engagement?.fileUrl"
            :user-id="store.user.id"
            :username="store.user.name"
        ></WordEditor>
      </div>
      <div class="button-right">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button type="primary" @click="handleStage">暂存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import "./index.scss";
  import type {engagementVO} from "@/types/vo";
  import {defineProps, onMounted, reactive} from 'vue'
  import router from '@/router'
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import {ElMessage} from "element-plus";
  import WordEditor from "@/components/WordEditor/WordEditor.vue";

  interface IEditProps {
    engagement: engagementVO
  }

  const props = defineProps<{
    engagement: engagementVO
  }>()

  const apis = useApis()
  const store = useStore()
  const messageApi = ElMessage;

  const data = reactive<{
    isModified: boolean,
    hasModified: boolean,
    isModalOpen: boolean,
    fileTitle: string,
  }>({
    isModified: false,
    hasModified: false,
    isModalOpen: false,
    fileTitle: '',
  });

  // 设置文件标题
  onMounted(() => {
    data.fileTitle = `${store.user.name}_作业.docx`;
  });

  // 成功操作的消息提示
  const success = (msg: string) => {
    messageApi.success(msg);
  };

  // 失败操作的消息提示
  const error = (msg: string) => {
    console.log('失败操作', msg);
    messageApi.error(msg);
  };

  // 处理内容修改事件
  // 用于检查，onlyoffice文本框是否被修改（同步的）
  const handleValueChange = (state: boolean) => {
    if (state) data.hasModified = true;
    data.isModified = state;
    // alert("1")
  };

  // 提交操作
  const handleSubmit = () => {
    // 内容已保存，且已经修改过，则可以点击提交
    if (!data.isModified && data.hasModified) {
      apis.engagementSubmit(store.user.id, props.engagement.assignmentId)
          .then((_res: any) => {
            console.log(_res);
            success(_res.data.data);
            router.push("/home/myHomework")
          })
          .catch((error: any) => {
            console.error('提交失败', error);
            error('提交失败');
          });
    } else if (data.isModified) {
      error('编辑内容未保存，请保存后提交！');
    } else if (!data.hasModified) {
      error('尚未编辑，不可提交！');
    } else {
      error('未知错误！');
    }
  };

  // 暂存操作
  const handleStage = () => {
    if (!data.isModified && data.hasModified) {
      apis.engagementStage(store.user.id, props.engagement.assignmentId)
          .then((_res: any) => {
            console.log(_res);
            success(_res.data.data);
          })
          .catch((error: any) => {
            console.error('暂存失败', error);
            error('暂存失败');
          });
    } else if (data.isModified) {
      error('编辑内容未保存，请保存后提交！');
    } else if (!data.hasModified) {
      error('尚未编辑，不可提交！');
    } else {
      error('未知错误！');
    }
  };
</script>

<script lang="ts">
export default {
  name: "Edit"
}
</script>

