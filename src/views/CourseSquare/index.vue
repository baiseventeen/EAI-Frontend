<template>
  <div class="course">
    <Banner/>
    <Course title="课程广场" type="all"/>
    <Course title="我的课程" type="my"/>
  </div>
</template>

<script lang="ts" setup>
  import './index.scss'
  import Banner from "@/views/CourseSquare/component/Banner/Banner.vue";
  import Course from "./component/Course/index.vue"

</script>

<script lang="ts">
export default {
  name: "CourseSquare"
}
</script>
