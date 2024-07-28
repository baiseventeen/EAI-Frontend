<!--
  Description: 课程广场走马灯组件
  Author: BaiQi
  Created Date: 2024-6-30
-->
<template>
  <div class="carousel-banner">
    <el-carousel :interval="4000" type="card" >
      <el-carousel-item class="carousel-items" v-for="item in pictureItems" :key="item.id">
        <img class="carousel-image" :src="item.src" :alt="item.alt"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
  import {reactive} from "vue";
  import './index.scss'

  const pictureItems = reactive([
    {
      id: 1,
      src:"https://oimagec5.ydstatic.com/image?id=-6825419190637093228&product=xue",
      alt:""
    },
    {
      id: 2,
      src:"https://oimagea7.ydstatic.com/image?id=6277590164074153542&product=xue",
      alt:""
    },
    {
      id: 3,
      src:"https://oimageb4.ydstatic.com/image?id=2909276266566708157&product=xue",
      alt:""
    },
    {
      id: 4,
      src:"https://oimagea4.ydstatic.com/image?id=-5223116784561408160&product=xue",
      alt:""
    },
    {
      id: 7,
      src:"https://ts1.cn.mm.bing.net/th/id/R-C.b560e47c90e405b1a86175664b585e48?rik=mV4YsdwHAwpxnQ&riu=http%3a%2f%2fp6.itc.cn%2fq_70%2fimages03%2f20201025%2f498e8932fb724cff93141bb889fd3156.jpeg&ehk=CiqXxYrG292FftMNzIbGKWsVRy2K8Sg35uShW2HNXSs%3d&risl=&pid=ImgRaw&r=0",
      alt:""
    },
  ])
</script>

<script lang="ts">
export default {
  name: "Banner"
}
</script>
