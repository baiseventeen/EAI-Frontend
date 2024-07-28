<template>
  <div class="homework-details">
    <div class="homework-details-title">
      作业详情
    </div>
    <div class="homework-details-info">
      <div class="homework-details-text">
        <div class="title">
          {{data.assignmentName}}
        </div>
        <div class="item">
          <span style="font-weight: 600">作业描述: </span>
          {{data.description}}
        </div>
        <div class="item">
          <span style="font-weight: 600">发布老师: </span>
          {{data.teacherId}}
        </div>
        <div class="item">
          <span style="font-weight: 600">截止日期: </span>
          {{new Date(Date.parse(data.endTime)).toLocaleString()}}
        </div>
        <div class="item">
          <el-link type="primary" @click="console.log('文件下载')">相关文件下载</el-link>
          <el-button color="#597d3b" size="large" style="margin-left: 660px" @click="handleWriting()">开始写作</el-button>
        </div>
      </div>
    </div>
    <div class="homework-details-title">
      评论区
    </div>
    <div class="homework-remark">
      <div>
        <el-skeleton style="width: 240px" animated >
          <template #template>
            <el-skeleton-item variant="circle" style="--el-skeleton-circle-size: 40px"></el-skeleton-item>
            <el-skeleton-item variant="text" style="height: 40px;width: 200px; margin-left: 30px"></el-skeleton-item>
          </template>
        </el-skeleton>
      </div>
      <div>
        <el-input type="textarea" style="width: 100%;margin: 20px 0"></el-input>
        <el-button color="#597d3b" size="large" style="float: right">发布</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useApis from "@/apis";
import {useRoute} from "vue-router";
import {onMounted, reactive} from "vue";
import type {IAssignment} from "@/types/vo";
import './homeworkDetail.scss'
import {useStore} from "@/store";
import router from "@/router";
import {ElMessage} from "element-plus";

const apis = useApis()
const store = useStore()
const route = useRoute()
const assignmentId = +route.params.assignmentId //string转number

let data = reactive<IAssignment>({
  assignmentId: null,
  assignmentName: "",
  description: "",
  descriptionFile: null,
  attachments: null,
  teacherId: null,
  courseId: null,
  startTime: "",
  endTime: "",
  createTime: "",
  status: ""
})

function handleWriting(){
  getEngagement()
  router.push(`/home/assignment/${assignmentId}/edit`)
}

async function getEngagement(){
  apis.getEngagement(store.user.id, assignmentId)
      .then((_res:any) => {
        console.log(_res)
        //还未参加作业，则先加入作业
        if(_res.data.data == null){
          apis.engageAssignment(assignmentId);
          ElMessage({
            message: '参加作业成功',
            type: 'success',
          })
        }
      }).catch((_err:any) => {
        console.log(_err)
      })
}


const fetchData = () => {
  apis.getAssignmentById(assignmentId)
      .then((res: any) => {
        Object.assign(data, res.data.data)
      })
}

onMounted(() => {
  fetchData()
})
</script>

<script lang="ts">
export default {
  name: "HomeworkDetail"
}
</script>
