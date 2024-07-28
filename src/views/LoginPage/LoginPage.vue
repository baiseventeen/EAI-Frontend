<!--
  Description: 登录页面
  Author: BaiQi
  Created Date: 2024-6-28
-->
<template>
  <div class="login-container">
    <div class="container-box">
      <div class="login-logo">
        <div class="logo-image">
          Logo
        </div>
      </div>
      <div class="login-box">
        <div class="box-content">
          <div class="box-tabs">
            <div
              :class="{ 'box-tabs-item': true, 'active': isOfficialNumber }"
              @click="isOfficialNumber = true">
              账号密码
            </div>
            <div
              :class="{ 'box-tabs-item': true, 'active': !isOfficialNumber }"
              @click="isOfficialNumber = false">
              邮箱验证码
            </div>
          </div>
          <Login :isCode="!isOfficialNumber"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import "./index.scss"
  import Login from "@/views/LoginPage/component/Login.vue";
  import {ref} from 'vue'
  
  let isOfficialNumber = ref(true)
  
</script>

<script lang="ts">
export default {
  name: "LoginPage"
}
</script>
