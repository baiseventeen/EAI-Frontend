<!--
  Description: 我的作业界面
  Author: BaiQi
  Created Date: 2024-7-3
-->
<template>
  <el-card class="correct-assignment-card-contain" shadow="never">
    <el-button text @click="handleBack"><el-icon><ArrowLeft/></el-icon>返回</el-button>

    <div class="title">
      <span>所属作业：{{ assignmentInfo.assignmentName }}</span>
    </div>

    <div class="input-group">
      <el-button :icon="Refresh" circle @click="doRefresh"></el-button>
      <el-select
          v-model="status"
          placeholder="状态"
          size="default"
          style="width: 150px; margin-left: 10px;"
          @change="handleStatusChange"
      >
        <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>

    <el-table :data="pageInfo.tableData" style="width: 100%;" height="100%" :row-style="{height: '30px'}" v-if="status == ''">
      <template #empty>
        暂无作业
      </template>
      <el-table-column type="index"/>
      <el-table-column prop="statusName" label="状态" sortable/>
      <el-table-column prop="studentName" label="学生姓名"/>
      <el-table-column prop="score" label="得分" sortable/>
      <el-table-column prop="remark" label="评价"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleCorrect(scope.row.assignmentId)" style="margin-right: 0; margin-left: 0;padding-left: 10px; padding-right: 10px" color="#597D3B">
            <el-icon style="margin-right: 3px"><ZoomIn/></el-icon>
            批改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="getSlice(queryInfo.pageNow, queryInfo.pageSize)" style="width: 100%;" height="100%" :row-style="{height: '30px'}" v-if="status != ''">
      <template #empty>
        暂无作业
      </template>
      <el-table-column type="index"/>
      <el-table-column prop="statusName" label="状态" sortable/>
      <el-table-column prop="studentName" label="学生姓名"/>
      <el-table-column prop="score" label="得分" sortable/>
      <el-table-column prop="remark" label="评价"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleCorrect(scope.row.assignmentId)" style="margin-right: 0; margin-left: 0;padding-left: 10px; padding-right: 10px" color="#597D3B">
            <el-icon style="margin-right: 3px"><ZoomIn/></el-icon>
            批改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        small
        style="font-size: 16px;margin-top: 10px;margin-left: 450px"
        :page-sizes="[5, 10, 15]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="queryInfo.pageNow"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
    </el-pagination>
  </el-card>
</template>

<script lang="ts" setup>
import {Refresh, ZoomIn, ArrowLeft, Search} from "@element-plus/icons-vue";
  import {inject, onMounted, reactive, ref} from "vue";
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import type {AssignmentVO, CourseVO, engagementVO, IAssignment} from "@/types/vo";
  import router from "@/router";
  import {useRoute} from "vue-router";
  import "./CorrectAssignmentPage.scss"
  import {AssignmentCompletionStatus, AssignmentStatus} from "@/types/enums";
  import type {EngagementQuery} from "@/types/query";
import * as process from "node:process";
import {useFormatDate} from "@/hooks/useFormatDate";

  const apis = useApis()
  const store = useStore()
  const route = useRoute()
  const doRefresh:Function = inject("reload")
  const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

  let assignmentInfo = reactive<AssignmentVO>({} as IAssignment)

  let pageInfo = reactive<{
    tableData: any[],
    total: number
  }>({
    tableData: [],
    total: 0,
  })

  const queryInfo = reactive({
    pageNow: 1,
    pageSize: 10,
  })

  const handleBack = () => {
    router.replace({
      path:`/home/myCorrect/assignment`,
      query: {
        courseId: assignmentInfo.courseId,
      }
    });
  }

  const handleCorrect = (assignmentId:number) => {
    // router.push(`/home/myCorrect/assignment/${assignmentId}`)
    alert("TODO：跳转到批改页面")
  }

  const handleCurrentChange = (pageNum: number) => {
    queryInfo.pageNow=pageNum;
    fetchData();
  }
  const handleSizeChange = (pageSize: number) => {
    queryInfo.pageSize = pageSize
    fetchData()
  }

  /*
  前端实现按状态查询
  所有符合状态的作业
   */
  let pageInfo2Status = reactive<{
    tableData: any[],
    total: number
  }>({
    tableData: [],
    total: 0,
  })

  let total = ref(0); // 记录总数
  const handleStatusChange = (value: AssignmentCompletionStatus) => {
    apis.getEngagementByAssignmentId(+route.params.assignmentId, 1, total.value)
        .then((res:any) => {
          Object.assign(pageInfo2Status, {
            total: res.data.data ? res.data.data.total:0,
            tableData: res.data.data ? res.data.data.records:[]
          })
          process2Status()
          processData(pageInfo)
        })
        .catch((err:any) => {
          console.log("错误信息", err)
        })
  }

  const process2Status = () => {
    Object.assign(pageInfo, {
      tableData: [],
      total: 0,
    })
    for(let i = 0; i < pageInfo2Status.tableData.length; i++){
      if(pageInfo2Status.tableData[i].status == status.value){
        pageInfo.tableData.push(pageInfo2Status.tableData[i])
        pageInfo.total++;
      }
    }
  }

  const getSlice = (pages:number, size:number) => {
    return pageInfo.tableData.slice((pages-1)*size, pages*size-1)
  }

  const fetchAssignmentInfo = () => {
    apis.getAssignmentById(+route.params.assignmentId)
        .then((res:any) => {
          Object.assign(assignmentInfo, {
            ...res.data.data
          })
          console.log("assignment", assignmentInfo)
        })
        .catch((err:any) => {
          console.log("错误信息", err)
        })
  }

  const fetchData = () => {
    apis.getEngagementByAssignmentId(+route.params.assignmentId, queryInfo.pageNow, queryInfo.pageSize)
        .then((res:any) => {
          pageInfo.total = res.data.data ? parseInt(res.data.data.total):0
          pageInfo.tableData = res.data.data ? res.data.data.records:[]
          processData(pageInfo)
          console.log(pageInfo.tableData)
          total.value = res.data.data ? parseInt(res.data.data.total):0
        })
        .catch((err:any) => {
          console.log("错误信息", err)
        })
  }

  async function processData(data:any){
    for(let i = 0; i < data.tableData.length; i++){
      apis.findUserById(data.tableData[i].studentId)
          .then((res:any)=>{
            data.tableData[i].studentName = res.data.data.records[0].name
          })
      for(let j = 0; j < statusOptions.length; j++){
        if(data.tableData[i].status == statusOptions[j].value){
          data.tableData[i].statusName = statusOptions[j].label
          break;
        }
      }
    }
  }

  onMounted(() => {
    // fetchHomeworkListByUserId()
    fetchAssignmentInfo()
    fetchData()
    console.log(route.query)
  })

  let status = ref('')
  const statusOptions = [
    {
      value: AssignmentCompletionStatus.NOT_EDITED,
      label: "待完成"
    },
    {
      value: AssignmentCompletionStatus.NOT_SUBMITTED,
      label: "未提交"
    },
    {
      value: AssignmentCompletionStatus.SUBMITTED,
      label: "已提交"
    },
    {
      value: AssignmentCompletionStatus.NOT_DONE,
      label: "未完成"
    },
    {
      value: AssignmentCompletionStatus.PUBLISHED,
      label: "已批改"
    },
    {
      value: AssignmentCompletionStatus.NOT_CORRECTED,
      label: "未批改"
    },
    {
      value: AssignmentCompletionStatus.CORRECTED,
      label: "已批改未发布"
    },
  ]

</script>

<script lang="ts">
export default {
  name: "AssignmentPage"
}
</script>
