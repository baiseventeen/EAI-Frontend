<!--
  Description: 权限控制
  Author: BaiQi
  Created Date: 2024-6-30
-->
<template>
  <div class="home-container">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script lang="ts" setup>
  import './role.scss'
  import {useStore} from "@/store";
  import emitter from "@/utils/emitter";
  import {nextTick, onUnmounted, provide, ref} from "vue";
  import router from "@/router";

  const store = useStore()
  const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

  // 整体用于刷新数据
  const isRouterAlive = ref(true);
  const reload = ()=>{
    isRouterAlive.value = false;
    // console.log("刷新前")
    nextTick(()=>{
      isRouterAlive.value = true;
      // console.log("刷新后")
    });
  };
  provide("reload",reload);

  /*
  路由变换
   */
  const changePage = (value: string) => {
    // console.log(role)
    if(role == 'student'){
      // console.log("学生")
      switch (value){
        case 'CourseSquare':
          router.push("/home/courseSquare");
          break;
        case 'MyCourse':
          router.push("/home/myCourse");
          break;
        case 'MyWork':
          router.push("/home/myHomework");
          break;
      }
      // changePage.value = value
    } else if(role == 'teachers'){
      switch (value){
        case 'CourseSquare':
          router.push("/home/courseSquare");
          break;
        case 'MyCourse':
          router.push("/home/myCourse");
          break;
        case 'MyWork':
          router.push("/home/myCorrect/course");
          break;
      }
    }
  }
  //绑定路由变更事件
  emitter.on("change-page", (value:string)=> {
    changePage(value)
  })
  //解绑事件
  onUnmounted(()=>{
    emitter.off('change-page')
  })
</script>

<script lang="ts">
export default {
  name: "Role"
}
</script>
