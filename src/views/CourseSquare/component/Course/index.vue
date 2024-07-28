<!--
  Description: 课程广场课程卡片展示组件，一行展示五个课程
  Author: BaiQi
  Created Date: 2024-6-30
-->
<template>
  <div class="course-content">
    <div class="course-header">
      <div class="header-title">
      {{ props.title }}
      </div>
      <el-button class="header-more" link @click="handleMore">
        更多>>
      </el-button>
    </div>
    <div class="course-items-container">
      <el-card v-for="item in getCoursesSlice()" :key="item.courseId" class="course-item active" @click="handleClick(item.courseId)">
        <div style="width: 200px; height: 120px">
          <img :src="item.courseImages[0]" :alt="item.courseName" class="course-item-img">
        </div>
        <div class="course-item-content">
          <div style="font-weight: bold">{{item.courseName}}</div>
          <div>{{item.description}}</div>
          <div>{{item.teacherIds.join("\n")}}</div>
        </div>
      </el-card>
      <template v-if="getCoursesSlice().length < 5">

        <el-card v-for="item in 5 - getCoursesSlice().length" :key="item" class="course-item">
          <template #header>
            <template v-if="props.type === 'all'">
              敬请期待
            </template>
            <template v-if="props.type === 'my'">
              暂无课程
            </template>
          </template>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {defineProps, onMounted, reactive, ref} from 'vue';
  import './index.scss'
  import useApis from "@/apis";
  import router from "@/router";
  import type {CourseQuery} from "@/types/query";
  import {useStore} from "@/store";

  const apis = useApis()
  const store = useStore()
  const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

  const props = defineProps<{
    title:string,
    type: 'all' | 'my'
  }>()

  // 课程数据
  const courses = reactive({
    course: [
      {
        courseId: 5,
        courseName: '英文论文写作',
        description: '',
        teacherIds: [],
        courseImages: [],
        targetGrade: null,
        startTime: new Date(),
        endTime: new Date(),
      },
      {
        courseId: 7,
        courseName: '数学分析',
        description: '',
        teacherIds: [],
        courseImages: [],
        targetGrade: null,
        startTime: new Date(),
        endTime: new Date(),
      },
      {
        courseId: 8,
        courseName: '线性代数',
        description: '',
        teacherIds: [],
        courseImages: [],
        targetGrade: null,
        startTime: new Date(),
        endTime: new Date(),
      },
      // {
      //   courseId: 4,
      //   courseName: '计算机科学',
      //   description: '',
      //   teacherIds: [],
      //   courseImages: [],
      //   targetGrade: null,
      //   startTime: new Date(),
      //   endTime: new Date(),
      // },
      // {
      //   courseId: 5,
      //   courseName: '物理学基础',
      //   description: '',
      //   teacherIds: [],
      //   courseImages: [],
      //   targetGrade: null,
      //   startTime: new Date(),
      //   endTime: new Date(),
      // },
      // {
      //   courseId: 6,
      //   courseName: '化学基础',
      //   description: '',
      //   teacherIds: [],
      //   courseImages: [],
      //   targetGrade: null,
      //   startTime: new Date(),
      //   endTime: new Date(),
      // },
      // 可以根据需要添加更多课程对象
    ],
  })

  //只获取前五个课程
  const getCoursesSlice = () => {
    return courses.course.slice(0, 5)
  }

  const handleMore = () => {
    router.push({
      name: 'moreCourse',
      query: {
        title: props.title,
        type: props.type
      }
    })
  }

  // 处理课程卡片的点击事件
  const handleClick = (value:number) => {
    router.push(`/home/courseDetail/${value}`)
  }

  const query = reactive<CourseQuery>({
    courseId:null,
    teacherId:null,
    studentId:null,
    courseName:null,
    semester:null,
  })

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
    apis.getAllCourse(query, 0, 10)
        .then((res: any) => {
          courses.course = res.data.data.records
          processCourses()
        })
        .catch((err: any) => {
          console.error("错误信息",err);
        })
        .finally(() => {});
  }

  const fetchCourseByUserId = () => {
    if(role === 'student'){
      apis.getCourseByStudentId(store.user.id)
          .then((res: any) => {
            courses.course = res.data.data.records
            processCourses()
          })
          .catch((err: any) => {
            console.error(err);
          })
          .finally(() => {});
    } else if(role === "teachers"){
      apis.getCourseByTeacherId(store.user.id)
          .then((res: any) => {
            courses.course = res.data.data.records
            processCourses()
          })
          .catch((err: any) => {
            console.error(err);
          })
          .finally(() => {});
    }
  }

  /*
  用于显示教师姓名
   */
  const processCourses = () => {
    for(let i:number = 0; i < courses.course.length; i++){
      for(let j = 0; j < courses.course[i].teacherIds.length; j++){
        apis.findUserById(courses.course[i].teacherIds[j])
            .then((res:any) => {
              courses.course[i].teacherIds[j] = res.data.data.records[0].name
            })
            .catch((err:any) => {
              console.log("错误信息",err)
            })
      }
    }
  }

  onMounted(()=>{
    fetchData()
  })


</script>

<script lang="ts">
export default {
  name: "Course"
}
</script>
