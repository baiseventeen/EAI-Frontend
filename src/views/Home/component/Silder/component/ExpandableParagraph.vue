<!--
  Description: 实现文字展开收缩效果的组件。
  Author: BaiQi
  Created Date: 2024-6-21
-->
<template>
  <div>
    <div
        :class="{'collapsed': !expanded, 'expanded': expanded}"
    >
      <span>{{ $props.text }}</span>
    </div>
    <el-button
        @click="toggle"
        type="text"
        class="toggle-button"
    >
      {{ expanded ? '收起' : '展开' }}
    </el-button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'ExpandableParagraph',
  props: {
    text: {
      type: String,
    },
  },
  setup(props) {
    const expanded = ref(false);

    const toggle = () => {
      expanded.value = !expanded.value;
    };

    return {
      expanded,
      toggle,
    };
  },
};
</script>

<style scoped>
.collapsed {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  max-height: 3em; /* Height for 2 lines of text */
}

.expanded {
  overflow: visible;
  max-height: none;
}

.toggle-button {
  margin-top: -5px;
  cursor: pointer;
}
</style>
