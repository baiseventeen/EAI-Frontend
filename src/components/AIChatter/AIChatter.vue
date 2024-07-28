<!--
  Description: AI对话组件。
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
  <div :class="$style.container">
    <!--大语言模型选择器-->
    <div :class="$style.header">
      <div :class="$style['model-selector']">
        <el-dropdown trigger="click" @command="handleCommand">
        <span style="font-size: 16px">
          {{ data.model }}<el-icon ><arrow-down/></el-icon>
        </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="model in modelOptions" :command="model">{{ model }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 消息区域，采用ChatGPT的交互模式 -->
    <div :class="$style['message-box']" ref="containerTopRef">
      <div
          v-for="(item, index) in data.messages"
          :key="index"
          :class="$style.item"
      >
        <div>
          <!--展示头像-->
          <el-avatar
              :size="32"
              :shape="'circle'"
              :src="index % 2 === 0 ? store.user.userAvatar : ''"
          >
            {{ index % 2 === 0 ? store.user.name.charAt(0) : data.model.charAt(0) }}
          </el-avatar>
        </div>
        <div style="margin-left: 15px">
          <!--名字-->
          <div style="margin-bottom: 2px">{{ index % 2 === 0 ? 'You' : data.model }}</div>
          <!--内容-->
          <div :class="$style.content">{{ item.content }}</div>
        </div>
      </div>
      <div ref="messagesEndRef" />
    </div>

    <!-- 对话框区域，用于AI提问和提示词模版展现 -->
    <div :class="$style['question-box']">
      <div :class="$style['input-group']">
        <el-input
            v-model="data.questionContent"
            ref="inputRef"
            :placeholder="`Message ${data.model} ...`"
        >
        </el-input>
        <el-button
            :disabled="data.questionContent === ''"
            @click="handleSendQuestion"
            style="width: 40px; border: none"
            v-loading="data.loading"
        >
          <el-icon><Top/></el-icon>
        </el-button>
        <el-dropdown @command="handleMenuClick">
          <el-button type="text" style="width: 40px;">
            <el-icon><ArrowDown/></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  v-for="(template, index) in questionTemplates"
                  :key="index"
                  :command="index"
              >
                {{ template }}
              </el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import "./AIChatter.module.scss";
  import type {IDialogue} from "@/types/dialogue.ts";
  import {useStore} from "@/store";
  import useApis from "@/apis";
  import {onMounted, reactive, ref, defineProps, watch, onUnmounted} from "vue";
  import {ArrowDown, Top} from '@element-plus/icons-vue'

  const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="fill: rgba(0, 0, 0, 0)"/>
      `

  interface IProps {
    dialogueId: string;
    messages: IDialogue[]
  }

  const props = defineProps<{
    dialogueId: string,
    messages: IDialogue[]
  }>()

  const apis = useApis()
  const store = useStore()

  const modelOptions = ["ChatGPT", "ChatGLM3", "QWen14B"]
  const questionTemplates = [
    "xxx是什么意思？",
    "英文如何描述xxx",
    "请用英文描述一个场景或一个观点：xxx",
    // 更多问题模板...
  ];

  const inputRef = ref(null);
  const messagesEndRef = ref(null);
  const containerTopRef = ref(null);

  let data = reactive<{
    model: string;
    questionContent: string;
    messages: IDialogue[];
    loading: boolean;
    loadedPage: number;
    pageSize: number;
  }>({
    model: modelOptions[0],
    questionContent: '',
    messages: [],
    loading: false,
    loadedPage: 0,
    pageSize: 20,
  });

  // 加载聊天记录，并滚动至最后
  onMounted(() => {
    if (props.messages) data.messages = props.messages;
    scrollToEnd();
  });

  const scrollToEnd = () => {
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
  };

  watch(() => props.messages, (newMessages:any) => {
    if (newMessages)
      data.messages = newMessages;
    scrollToEnd();
  });

  watch(() => data.messages, () => {
    scrollToEnd();
  });

  onMounted(() => {
    const handleScroll = () => {
      if (containerTopRef.value) {
        const { top } = containerTopRef.value.getBoundingClientRect() // 获取目标组件的位置
        const reachedTop = top >= 0;// 检查组件是否到达顶部

        // 确保，不重复加载数据
        if (reachedTop && !data.loading) {
          console.log("触顶了");
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  });

  const handleSendQuestion = () => {
    data.loading = true;

    let requestBody:IDialogue[] = data.messages
    requestBody.push({
      role: 'user',
      content: data.questionContent
    })

    apis.requestAI(props.dialogueId, data.model, requestBody)
        .then((_res:any) => {
          const resDialogue = _res.data.data;
          console.log(resDialogue);
          data.messages.push(resDialogue);
        })
        .catch((_err:any) => {
          console.log(_err);
        })
        .finally(() => {
          data.questionContent = '';
          data.loading = false;
          scrollToEnd();
        });
  };

  const handleCommand = (command:string) => {
    data.model = command
  }

  // 选择模板问题
  const handleMenuClick = (key:any) => {
    data.questionContent = questionTemplates[key];
    inputRef.value.focus();// 设置焦点自动回到Input
  };

</script>

<script lang="ts">
  export default {
    name: "AIChatter"
  }
</script>

<style module>
@import './AIChatter.module.scss';
</style>