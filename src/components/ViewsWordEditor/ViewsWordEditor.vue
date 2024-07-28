<!--
  Description: 显示作业要求的组件，由写作页面发起。
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
  <div class="view-word-editor">
    <el-dialog
        v-model="alertVisible"
        center
        align-center
        width="60%"
        class="full-modal"
        @close="handleClose"
    >
      <template v-if="props.docxInfo.docxUrl">
        <iframe
            :src="`https://view.officeapps.live.com/op/view.aspx?src=${props.docxInfo.docxUrl}`"
            :title="docxInfo.docxTitle"
            style="width: 100%; height: 75vh;"
        ></iframe>
      </template>
      <template v-else>
        <div style="width: 100%; height: 75vh; font-size: 20px;">
          暂无描述文件
        </div>
      </template>

      <template #footer>
        <div class="button-right">
          <el-button color="#597d3b" @click="handleClose">取消</el-button>
          <el-button color="#597d3b" type="primary" @click="handleClose">OK</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import './index.scss';

const props = defineProps({
  alert: Object,
  docxInfo: Object,
});

let alertVisible = ref(props.alert.open);

watch(
    () => props.alert.open,
    (newVal) => {
      alertVisible.value = newVal;
    }
);

const handleClose = () => {
  alertVisible.value = false;
  if (props.alert.onCancel) {
    props.alert.onCancel();
  }
};
</script>

<script lang="ts">
  export default {
    name: "ViewsWordEditor"
  }
</script>