<!--
  Description: 主页面布局
  Author: BaiQi
  Created Date: 2024-6-30
-->
<script setup>

import Header from "../Header/Header.vue";
import Role from '@/views/Home/Role.vue'
</script>

<template>
  <div class="wrapper">
    <el-container style="height: max-content;">
      <el-header height="40px" style="padding: 0;" class="fixed-header">
        <Header></Header>
      </el-header>
    </el-container>
    <el-container>
      <el-main style="height: 100%;;padding: 0 0 0 0;margin-top: 40px">
        <Role></Role>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.fixed-header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000; /* 确保 header 在内容之上 */
  padding: 0;
  height: 40px;
}
</style>