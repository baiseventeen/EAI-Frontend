<!--
  Description: 我的作业界面
  Author: BaiQi
  Created Date: 2024-7-3
-->
<template>
  <el-card class="assignment-card-contain" shadow="never">

    <el-button class="back-button" text @click="router.push('/home/myCorrect/course')"><el-icon><ArrowLeft /></el-icon>返回</el-button>

    <div class="title">
      <span>所属课程：{{ courseInfo.courseName }}</span>
    </div>

    <div class="input-group">
      <el-button :icon="Refresh" circle @click="doRefresh"></el-button>
      <!--    <el-select-->
      <!--        v-model="state"-->
      <!--        placeholder="状态"-->
      <!--        size="default"-->
      <!--        style="width: 150px; margin-left: 10px;"-->
      <!--    >-->
      <!--      <el-option-->
      <!--          v-for="item in stateOptions"-->
      <!--          :key="item.value"-->
      <!--          :label="item.label"-->
      <!--          :value="item.value"-->
      <!--      />-->
      <!--    </el-select>-->
      <el-input class="search-input" v-model="assignmentNameToSearch" placeholder="请输入作业名称" clearable style="width: 180px;"/>
      <el-button @click="handleSearch" color="#597D3B">
        <el-icon style="margin-right: 3px" ><Search/></el-icon>
        查询
      </el-button>
    </div>

    <el-table stripe :data="pageInfo.tableData" style="width: 100%" height="100%">
      <template #empty>
        暂无作业
      </template>
      <el-table-column type="index"/>
      <el-table-column prop="assignmentName" label="作业名称"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column prop="endTime" label="截止时间" sortable/>
      <el-table-column prop="status" label="状态" sortable/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleCorrect(scope.row.assignmentId)" style="margin-right: 0; margin-left: 0;padding-left: 10px; padding-right: 10px" color="#597D3B">
            <el-icon style="margin-right: 3px"><ZoomIn/></el-icon>
            批改作业
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
  import {Refresh, ZoomIn, Search, ArrowLeft} from "@element-plus/icons-vue";
  import {inject, onMounted, reactive, ref} from "vue";
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import type {CourseVO, IAssignment} from "@/types/vo";
  import router from "@/router";
  import {useRoute} from "vue-router";
  import "./AssignmentPage.scss"
  import type {AssignmentQuery} from "@/types/query";
  import {AssignmentStatus} from "@/types/enums";
  import {useFormatDate} from "@/hooks/useFormatDate";

  const apis = useApis()
  const store = useStore()
  const route = useRoute()
  const doRefresh:Function = inject("reload")
  const {formatDate} = useFormatDate()
  const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

  // 最终展示的作业
  let pageInfo = reactive<{
    tableData: any,
    total: number
  }>({
    tableData: [],
    total: null,
  })

  let queryInfo = reactive({
    pageSize:10,
    pageNow:1,
  })

  let courseInfo = reactive<CourseVO>({} as CourseVO)

  let query = reactive<AssignmentQuery>({
    courseId: +route.query.courseId
  } as AssignmentQuery)

  const fetchCourseInfo = () => {
    apis.getCourseByCourseId(+route.query.courseId)
        .then((res:any) => {
          Object.assign(courseInfo, res.data.data.records[0])
        })
        .catch((err:any) => {
          console.log("错误信息", err)
        })
  }

  const handleCorrect = (assignmentId:number) => {
    router.push({
      path:`/home/myCorrect/assignment/${assignmentId}`
  })

  }

  const handleCurrentChange = (pageNum: number) => {
    queryInfo.pageNow = pageNum
    fetchData(query)
  }
  const handleSizeChange = (pageSize: number) => {
    queryInfo.pageSize = pageSize
    fetchData(query)
  }

  let assignmentNameToSearch = ref('')
  const handleSearch = () => {
    Object.assign(query, {
      courseId: courseInfo.courseId,
      assignmentName:assignmentNameToSearch
    })
    fetchData(query)
  }

  const fetchData = (query: AssignmentQuery) => {
    apis.getAssignmentByQuery(query, queryInfo.pageNow, queryInfo.pageSize)
        .then((res:any) => {
          console.log(res.data.data)
          pageInfo.tableData = res.data.data.records;
          pageInfo.total = res.data.data.total
          processData()
        })
        .catch((err:any) => {
          console.log("错误信息", err)
        })
  }

  const processData = () => {
    for (let i = 0; i < pageInfo.tableData.length; i++) {
      pageInfo.tableData[i].endTime = formatDate(pageInfo.tableData[i].endTime)
    }
  }

  onMounted(() => {
    fetchCourseInfo()
    fetchData(query)
  })

  let state = ref(null)
  const stateOptions = [
    {
      value: AssignmentStatus.NOT_STARTED,
      label: "未发布"
    },
    {
      value: AssignmentStatus.PROCEEDING,
      label: "进行中"
    },
    {
      value: AssignmentStatus.FINISHED,
      label: "已截止"
    },
  ]

</script>

<script lang="ts">
export default {
  name: "HomeworkPage"
}
</script>
