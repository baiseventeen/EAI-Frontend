<!--
  Description: 课程详情页面
  Author: BaiQi
  Created Date: 2024-7-1
-->
<template>
  <div class="course-details">
    <div class="course-details-info">
      <div>
        <img  class="course-details-image" :src="dataForm.courseImages?.length > 0 ? dataForm.courseImages[0] : null" :alt="dataForm.courseName">
      </div>
      <div class="course-details-text">
        <div class="title">
          {{dataForm.courseName}}
        </div>
        <div class="item">
          任课老师:{{dataForm.teacherIds?.join(",")}}
        </div>
        <div class="item">
          目标学生:{{dataForm.targetGrade}}
        </div>
        <div class="item">
          起止时间:{{new Date(Date.parse(dataForm.startTime)).toLocaleString()}} - {{new Date(Date.parse(dataForm.endTime)).toLocaleString()}}
        </div>
        <div>
          <template v-if="showCode && role == 'student'">
            <el-input v-model="enrollCode" placeholder="输入邀请码" type="text" style="width: 150px;margin-right: 20px"></el-input>
            <el-button color="#597d3b" @click="enroll">加入课程</el-button>
          </template>
          <template v-if="showEdit && role == 'teachers'">
            <el-button color="#597d3b" @click="visible = true">编辑课程</el-button>
          </template>
        </div>
      </div>
    </div>
    <div class="course-tabs">
      <el-tabs v-model="activeTab" >
        <el-tab-pane v-for="item in items" :name="item.key" :label="item.label">
          <template v-if="activeTab == '课程简介'">
            <div>
              {{dataForm.description}}
            </div>
          </template>
          <template v-else>
            <CourseHomeworkTable :disabled="isDisabled()" :columns="columns" :tableData="homeworkList" :role="role" :courseId="dataForm.courseId" :isShowNewHomework="showEdit && role == 'teachers'"/>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <el-dialog v-model="visible" title="编辑课程">
    <el-form :model="newCourseInfo">
<!--      <el-form-item label="课程图片">-->
      <el-form-item label="课程名称">
        <el-input v-model="newCourseInfo.courseName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="面向年级">
        <el-input v-model="newCourseInfo.targetGrade" placeholder="请输入年级"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="newCourseInfo.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="课程图片">
        <el-input v-model="newCourseInfo.courseImages[0]" placeholder="请输入图片链接"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="newCourseInfo.startTime" type="datetime" placeholder="截止时间" style="width: 180px"/>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker v-model="newCourseInfo.endTime" type="datetime" placeholder="截止时间" style="width: 180px"/>
      </el-form-item>
      <el-form-item label="选课码">
        <el-input v-model="newCourseInfo.enrollCode" placeholder="请输入选课码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import {ElTabs, ElTabPane, ElTable, ElTableColumn, ElAvatar, ElMessage, ElNotification} from 'element-plus';
import './index.scss'
import type {CourseVO, IAssignment, IAssignmentTableColumn, IAssignmentTableItem} from "@/types/vo";
import {useRoute} from "vue-router";
import useApis from "@/apis";
import CourseHomeworkTable from "@/views/CourseSquare/component/CourseDetails/component/CourseHomeworkTable.vue";
import type {AssignmentQuery} from "@/types/query";
import {useStore} from "@/store";
import type {CourseUpdateDTO, EnrollDTO} from "@/types/dto";
import {useFormatDate} from "@/hooks/useFormatDate";

const apis = useApis()
const store = useStore()
const route = useRoute()
const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

const courseId = +route.params.courseId

let showCode = ref(true)
let enrollCode = ref(null)
let showEdit = ref(false)
let visible = ref(false)

// 用于展示课程信息
let dataForm = reactive<CourseVO>({
  courseId: null,
  courseName: '',
  teacherIds: [],
  courseImages: [''],
  targetGrade: '',
  startTime: '',
  endTime: '',
  createTime: '',
  description: '',
})

let newCourseInfo = reactive<CourseUpdateDTO>({
  courseName: '',
  teacherIds: [],
  courseImages: [''],
  targetGrade: '',
  startTime: '',
  endTime: '',
  description: '',
  enrollCode: '',
})

//用于查询课程包含的作业
let query = reactive<AssignmentQuery>({
  assignmentId:null,
  teacherId:null,
  courseId:courseId,
  assignmentName:null,
  status:null,
})

const activeTab = ref('课程简介');
const items = ref([
  { label: '课程简介', key: '课程简介'},
  { label: '作业列表', key: '作业列表'},
]);

const columns = ref<IAssignmentTableColumn[]>([
  {
    title: '作业id',
    dataIndex: 'assignmentId',
    key: 'assignmentId',
  },
  {
    title: '作业名称',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: '发布人',
    dataIndex: 'publisher',
    key: 'publisher',
  },
  {
    title: '截止日期',
    dataIndex: 'endDate',
    key: 'endDate',
  },
]);

// 用于展示课程所含的作业
let homeworkList = ref<IAssignmentTableItem[]>([]);

const getCourse = () => {
  // 获取课程信息
  apis.getCourseByCourseId(courseId)
      .then((res: any) => {
        let data = res.data.data.records[0]
        Object.assign(dataForm, {...data})
        getNewCourseInfo(dataForm)
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => {});
}

const getNewCourseInfo = (dataForm: CourseVO) => {
  Object.assign(newCourseInfo, {
    courseName: dataForm.courseName,
    teacherIds: dataForm.teacherIds,
    courseImages: dataForm.courseImages,
    targetGrade: dataForm.targetGrade,
    startTime: dataForm.startTime,
    endTime: dataForm.endTime,
    description: dataForm.description,
    enrollCode: ''
  })
}

const getHomeworkList = () => {
  apis.getAssignmentByQuery(query)
      .then((res: any) => {
        let data = res.data.data.records
        homeworkList.value = convertHomeworkList(data)
        // TODO
        for(let i = 0; i < data.length; i++){
          apis.findUserById(data[i].teacherId)
              .then((res: any) => {
                data[i].teacherId = res.data.data.records[0].name
              })
        }
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => {
      });
}

/*
  学生，是否显示选课码输入框选课
 */
const isShowCode = () => {
  apis.getCourseByStudentId(store.user.id)
    .then((res: any) => {
      let data = res.data.data.records
      for(let i = 0 ; i < data.length; i++){
        if(data[i].courseId == courseId){
          showCode.value = false;
          break;
        }
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {});
}

let enrollDTO = reactive<EnrollDTO>({
  studentId: null,
  courseId: courseId,
  enrollCode: enrollCode.value
})

/*
  学生，加入课程
 */
const enroll = () => {
  enrollDTO.enrollCode = enrollCode.value
  apis.enrollCourse(enrollDTO)
      .then((res:any) => {
        if(res.data.code == 400){
          ElMessage({
            message: '选课码错误',
            type: 'error',
          })
        }else {
          showCode.value = false
          ElMessage({
            message: '选课成功',
            type: 'success',
          })
        }
      })
}

/*
  教师，是否显示编辑课程按钮
 */
const isShowEdit = () => {
  apis.getCourseByTeacherId(store.user.id)
      .then((res: any) => {
        let data = res.data.data.records
        for(let i = 0 ; i < data.length; i++){
          if(data[i].courseId == courseId){
            showEdit.value = true;
            break;
          }
        }
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => {});
}

/*
  将后端传来的作业数据进行整形，便于前端展示
 */
const convertHomeworkList = (data:IAssignment[]) => {
  let newHomeworkList: IAssignmentTableItem[] = ([])
  for(let i = 0; i < data.length; i++){
    let item:IAssignmentTableItem = {
      desc: data[i].assignmentName,
      publisher: data[i].teacherId.toString(),
      startDate: formatDate(data[i].startTime),
      endDate: formatDate(data[i].endTime),
      assignmentId: data[i].assignmentId,
      descriptionFile: data[i].descriptionFile != null ? data[i].descriptionFile: null
    }
    newHomeworkList.push(item)
  }
  return newHomeworkList
}

/*
  时间格式转换方法
   */
function formatDate(date:string) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const handleSubmit = () => {
  newCourseInfo.endTime = formatDate(newCourseInfo.endTime)
  newCourseInfo.startTime = formatDate(newCourseInfo.startTime)
  apis.updateCourse(dataForm.courseId, newCourseInfo)
    .then((res:any) => {
      if(res.data.code===200) {
        ElNotification({
          title: '修改成功',
          type: 'success',
        })
        visible.value = false
      }else {
        ElNotification({
          title: '修改失败',
          type: 'error',
        })
        visible.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

function isDisabled(){
  if(role == "student") return showCode.value;
  if(role == "teachers") return !showEdit.value;
}

onMounted(() => {
  getCourse()
  getHomeworkList()
  if(role == 'student') isShowCode()
  if(role == 'teachers') isShowEdit()
})


</script>

<style scoped>
::v-deep .el-tabs__item {
  color:#597D3B;
  opacity: 1;
}

::v-deep .el-tabs__item:hover {
  cursor: pointer;
  opacity: 0.7;
}

/*去下划线 */
::v-deep .el-tabs__nav-wrap::after {
  position: static !important;
}

/* 下划线颜色 */
::v-deep .el-tabs__active-bar {
  background-color: #597D3B;
}
</style>

