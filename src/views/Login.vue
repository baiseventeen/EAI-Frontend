<!--
  Description: 临时登录界面，已弃用
  Author: BaiQi
  Created Date: 2024-6-22
-->
<template>
  <div>
    <el-button type="primary" @click="handleLogin">登录</el-button>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import useApis from "@/apis";
import {useStore} from "@/store";
import {ref} from "vue";

const apis = useApis()
const store = useStore()
const assignmentId = ref(1)

const handleLogin = () => {
  apis.login({
    officialNumber: '181250126',
    password: 'xiaosuniubi'
  }).then((_res:any) => {
    console.log(_res);
    const data = _res.data.data
    if (_res.data.code === 200) {
      store.setUser(data);
      store.setToken(data?.token)
      localStorage.setItem('Authorization', data?.token);
      localStorage.setItem('User', data);
      router.push(`/assignment/${assignmentId.value}/edit`)
    } else {
      console.log("登陆失败")
    }
  }).catch((_err:any) => {
    console.log("登陆失败1", _err)
  })
}
</script>

<script lang="ts">
export default {
  name: "Login"
}
</script>
