<template>
  <div class="course-content">
    <div class="course-header">
      <span class="course-header-title">{{ props.title }}</span>
    </div>
    <div class="course-content-container">
      <div class="course-content-title">
        <el-button :icon="Refresh" circle @click="doRefresh" style="margin: 0 10px 0 30px"></el-button>
        <el-input v-model="courseName" placeholder="请输入课程名称" clearable class="search-input" style="width: 180px; margin-right: 10px"/>
        <el-button @click="handleSearch" color="#597D3B">
          <el-icon style="margin-right: 3px" ><Search/></el-icon>
          查询
        </el-button>
      </div>
      <div class="course-items-container">
        <el-card v-for="item in getCoursesSlice(0, 5)" :key="item.courseId" class="course-item active" @click="handleClick(item.courseId)">
          <div style="width: 200px; height: 120px">
            <img :src="item.courseImages[0]" :alt="item.courseName" class="course-item-img">
          </div>
          <div class="course-item-content">
            <div style="font-weight: bold">{{item.courseName}}</div>
            <div>{{item.description}}</div>
            <div>{{item.teacherIds.join("\n")}}</div>
          </div>
        </el-card>

        <template v-if="getCoursesSlice(0, 5).length < 5">
          <el-card v-for="item in 5 - getCoursesSlice(0, 5).length" :key="item" class="course-item-hidden">
          </el-card>
        </template>

      </div>
      <div class="course-items-container">
        <el-card v-for="item in getCoursesSlice(5, 10)" :key="item.courseId" class="course-item active" @click="handleClick(item.courseId)">
          <div style="width: 200px; height: 120px">
            <img :src="item.courseImages[0]" :alt="item.courseName" class="course-item-img">
          </div>
          <div class="course-item-content">
            <div style="font-weight: bold">{{item.courseName}}</div>
            <div>{{item.description}}</div>
            <div>{{item.teacherIds.join("\n")}}</div>
          </div>
        </el-card>

        <template v-if="getCoursesSlice(5, 10).length < 5">
          <el-card v-for="item in 5 - getCoursesSlice(5, 10).length" :key="item" class="course-item-hidden">
          </el-card>
        </template>
      </div>

      <el-pagination
          small
          style="font-size: 16px;margin-top: 10px;margin-left: 450px"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNow"
          :page-size="queryInfo.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageInfo.total">
      </el-pagination>

    </div>
  </div>
</template>

<script lang="ts" setup>
import './MoreCourse.scss'
import {defineProps, inject, onMounted, reactive, ref} from "vue";
import useApis from "@/apis";
import type {CourseQuery} from "@/types/query";
import router from "@/router";
import {useStore} from "@/store";
import {Refresh, Search} from "@element-plus/icons-vue";

const apis = useApis()
const store = useStore()
const doRefresh:Function = inject("reload")
const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';
let courseName = ref('')

const props = defineProps<{
  title: string;
  type: 'all' | 'my'
}>()

const queryInfo = reactive({
  pageNow: 1,
  pageSize: 10,
})

let pageInfo = reactive({
  total: 0,
  courseData: []
})

let pageInfo2Show = reactive({
  total: 0,
  courseData: []
})

const query = reactive<CourseQuery>({
  courseId:null,
  teacherId:null,
  studentId:null,
  courseName:null,
  semester:null,
})

const handleSearch = () => {
  if(props.type == 'all'){
    Object.assign(query, {
      courseId:null,
      teacherId:null,
      studentId:null,
      courseName:courseName.value,
      semester:null,
    })
    fetchAllCourse()
  } else {
    if(role == 'student'){
      Object.assign(query, {
        courseId:null,
        teacherId:null,
        studentId:store.user.id,
        courseName:courseName.value,
        semester:null,
      })
      fetchAllCourse()
    }else {
      Object.assign(query, {
        courseId:null,
        teacherId:store.user.id,
        studentId:null,
        courseName:courseName.value,
        semester:null,
      })
      fetchAllCourse()
    }
  }
}

const courseNameFilter = () => {
  Object.assign(pageInfo2Show, {
    total: 0,
    courseData: []
  })
  for(let i = 0; i < pageInfo.total; i++){
    if(pageInfo.courseData[i].courseName.includes(courseName.value)){
      pageInfo2Show.courseData.push(pageInfo.courseData[i])
      pageInfo2Show.total++;
    }
  }
}

// 处理课程卡片的点击事件
const handleClick = (value:number) => {
  router.push(`/home/courseDetail/${value}`)
}

const handleCurrentChange =(index:number)=>{
  queryInfo.pageNow=index;
  fetchData();
}

const fetchData = () => {
  if(props.type === 'all'){
    fetchAllCourse()
  } else if(props.type === 'my'){
    fetchCourseByUserId()
  }else{
    alert("获取课程失败")
  }
}

const fetchAllCourse = () => {
  apis.getAllCourse(query, queryInfo.pageNow, queryInfo.pageSize)
      .then((res: any) => {
        console.log(res)
        pageInfo.courseData = res.data.data.records
        pageInfo.total = res.data.data.total
        Object.assign(pageInfo2Show, pageInfo)
      })
      .catch((err: any) => {
        console.error("错误信息",err);
      })
      .finally(() => {});
}

const fetchCourseByUserId = () => {
  if(role === 'student'){
    apis.getCourseByStudentId(store.user.id, queryInfo.pageNow, queryInfo.pageSize)
        .then((res: any) => {
          console.log(res)
          pageInfo.courseData = res.data.data.records
          pageInfo.total = res.data.data.total
          Object.assign(pageInfo2Show, pageInfo)
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {});
  } else if(role === "teachers"){
    apis.getCourseByTeacherId(store.user.id, queryInfo.pageNow, queryInfo.pageSize)
        .then((res: any) => {
          console.log(res.data.data)
          pageInfo.courseData = res.data.data.records
          pageInfo.total = res.data.data.total
          Object.assign(pageInfo2Show, pageInfo)
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {});
  }
}

//只获取前五个课程
const getCoursesSlice = (start:number, end:number) => {
  return pageInfo2Show.courseData.slice(start, end)
}

onMounted(()=>{
  fetchData()
})
</script>

<script lang="ts">
export default {
  name: "AllCourse"
}
</script>
