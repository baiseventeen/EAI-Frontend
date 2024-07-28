<!--
  Description: 主页面Header布局
  Author: BaiQi
  Created Date: 2024-6-30
-->
<template>

  <el-row class="header">
    <!--产品图标与名称-->
    <el-col :span="2" class="header-icons">
      <div>
        Logo
      </div>
      <div>
        /name
      </div>
    </el-col>
    <!--选择菜单-->
    <el-col :span="10" class="header-menu">
      <el-menu mode="horizontal" :default-active="activePage" @select="handleSelect" class="menu">
        <template v-if="role == 'student'">
          <el-menu-item v-for="item in studentMenuItems" :index="item.key" class="header-menu-item">
            <div>
              {{ item.value }}
            </div>
          </el-menu-item>
        </template>
        <template v-else>
          <el-menu-item v-for="item in teacherMenuItems" :index="item.key" class="header-menu-item">
            <div>
              {{ item.value }}
            </div>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
    <!--用户头像和昵称-->
    <el-col :span="3" :offset="7">
      <el-dropdown @command="handleCommand" style="margin-top: 5px">
        <div class="header-userName">
          <!--如果是登录状态-->
          <template v-if="store.token !== ''">
            <!--用户有头像-->
            <template v-if="store.user.userAvatar !== ''">
            <el-avatar :size="32" :shape="'circle'" :src="store.user.userAvatar"/>
            </template>
            <!--用户没有头像-->
            <template v-else>
              <el-avatar :size="32" :shape="'circle'"> {{ store.user.name.charAt(0) }}</el-avatar>
            </template>
            <div class="nickName">
              {{store.user.name}}
            </div>
          </template>
          <!--如果是未登录状态-->
          <template v-else>
            <el-avatar :size="32" :shape="'circle'"> User</el-avatar>
            <div class="nickName">user</div>
          </template>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
<!--      <el-dropdown @command="handleCommand" style="position: absolute;top: 35%">-->
<!--        <span style="color: blue">-->
<!--            user-->
<!--            <el-icon class="el-icon&#45;&#45;right">-->
<!--              <arrow-down />-->
<!--            </el-icon>-->
<!--        </span>-->
<!--        <template #dropdown>-->
<!--          <el-dropdown-menu>-->
<!--            <el-dropdown-item command="logout">退出登录</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </template>-->
<!--      </el-dropdown>-->
    </el-col>
  </el-row>

</template>

<script setup lang="ts">
  import router from "../../router/index.js";
  import {getCurrentInstance, onMounted, ref} from "vue";
  import './index.scss'
  import {useStore} from "@/store";
  import emitter from "@/utils/emitter";
  import {useRoute} from "vue-router";

  const store = useStore()
  const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

  const studentMenuItems = [
    {
      value: "课程广场",
      key: "CourseSquare"
    },
    {
      value: "我的课程",
      key: "MyCourse"
    },
    {
      value: "我的作业",
      key: "MyWork"
    },
  ]
  const teacherMenuItems = [
    {
      value: "课程广场",
      key: "CourseSquare"
    },
    {
      value: "我的课程",
      key: "MyCourse"
    },
    {
      value: "我的批改",
      key: "MyWork"
    },
  ]

  const handleSelect = (index:string)=>{
    emitter.emit('change-page', index)
  }

  const handleCommand = (command:string)=>{
    if(command==="logout"){
      localStorage.clear()
      store.clear()
      router.push({path: "/login"})
    }
  }

  const route = useRoute()
  let activePage = ref('')
  //处理刷新页面时，菜单项和内容不匹配的问题
  onMounted(()=>{
    let path = route.path.split('/')[2].charAt(0).toUpperCase()+route.path.split('/')[2].slice(1)
    if(path === 'Assignment'){
      activePage.value = 'MyWork'
    }else {
      activePage.value = path
    }
  })
</script>

<script lang="ts">
  export default {
    name: "Layout"
  }
</script>
