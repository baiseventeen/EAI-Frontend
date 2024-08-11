<!--
  Description: onlyoffice组件
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
    <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://139.196.252.184:8082/"
        :config="config"
        @events_onDocumentReady="onDocumentReady"
        @onLoadComponentError="onLoadComponentError"
        @events_onDocumentStateChange="onDocumentStateChange"
        v-if="props.documentKey && props.documentTitle && props.documentUrl"
    ></DocumentEditor>
</template>

<script lang="ts" setup>
  import "./WordEditor.module.scss"
  import {ref, watch, onMounted, defineProps, reactive} from 'vue';
  import { ElMessage } from 'element-plus';
  import { DocumentEditor } from '@onlyoffice/document-editor-vue'

  interface IProps {
    onValueChange?: (state: boolean) => void;
    documentKey: string;
    documentTitle: string;
    documentUrl: string;
    userId: number;
    username: string;
  }

  const props = defineProps<IProps>()

  const documentServerUrl = 'http://139.196.252.184:8082/';

  // OnlyOffice编辑器配置
  let config = reactive({
    width: '100%',
    height: '100%',
    type: 'desktop',
    documentType: 'word',
    document: {
      fileType: 'docx',
      key: props.documentKey,
      title: props.documentTitle,
      url: props.documentUrl,
      permissions: {
        chat: false,
        comment: false,
        copy: true,
        deleteCommentAuthorOnly: false,
        download: false,
        edit: true,
        editCommentAuthorOnly: false,
        fillForms: false,
        modifyContentControl: false,
        print: false,
        protect: false,
        review: false,
      },
    },
    editorConfig: {
      lang: 'zh-CN',
      //不要用localhost和127.0.0.1访问，用局域网IP访问
      //TODO:项目部署要改
      callbackUrl: 'http://192.168.137.1:8080/api/onlyoffice/callback',
      customization: {
        autosave: false,
        comments: false,
        compactHeader: true,
        compactToolbar: false,
        compatibleFeatures: false,
        forceSave: true,
        help: false,
        hideRightMenu: true,
        hideRulers: true,
        macros: false,
        mentionShare: false,
        mobileForceView: false,
        plugins: false,
        toolbarHideFileName: true,
        toolbarNoTabs: false,
        uiTheme: 'theme-light',
      },
      user: {
        id: props.userId.toString(),
        name: props.username,
      },
    },
  });

  // 监听 props 中的变化，更新 config
  watch(
    () => [props.documentKey, props.documentTitle, props.documentUrl, props.userId, props.username],
    () => {
      config = {
        ...config,
        document: {
          ...config.document,
          key: props.documentKey,
          title: props.documentTitle,
          url: props.documentUrl,
        },
        editorConfig: {
          ...config.editorConfig,
          user: {
            id: props.userId.toString(),
            name: props.username,
          },
        },
      };
    }
  );

  // 监听 OnlyOffice组件中的文档准备事件
  const onDocumentReady = (event: any) => {
    console.log('Document is loaded');
  };

  // 监听 OnlyOffice组件中的加载组件错误事件
  const onLoadComponentError = (errorCode: number, errorDescription: string) => {
    switch (errorCode) {
      case -1:// Unknown error loading component
        console.log(errorDescription);
        break;
      case -2:// Error load DocsAPI from http://documentserver/
        console.log(errorDescription);
        break;
      case -3:// DocsAPI is not defined
        console.log(errorDescription);
        break;
    }
  };

  // 监听 OnlyOffice组件中的文档状态变化事件
  const onDocumentStateChange = (event: any) => {
    console.log("监听 OnlyOffice组件中的文档状态变化事件", event.data)
    props.onValueChange?.(event.data);
  };
</script>

<script lang="ts">
export default {
  name: "WordEditor"
}
</script>
