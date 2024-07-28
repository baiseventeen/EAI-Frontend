<!--
  Description: 我的作业界面
  Author: BaiQi
  Created Date: 2024-7-3
-->
<template>
  <el-card style="margin: 10px auto 0;height: 100%; width: 80%" shadow="never">
    <el-button :icon="Refresh" circle @click="doRefresh"></el-button>
    <el-select
        v-model="state"
        placeholder="状态"
        size="default"
        style="width: 150px; margin-left: 10px;"
    >
      <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-input v-model="assignmentName" placeholder="请输入作业名称" clearable style="width: 180px;"/>
    <el-button @click="handleSearch" color="#597D3B">
      <el-icon style="margin-right: 3px" ><Search/></el-icon>
      查询
    </el-button>

    <el-table :data="pageInfo.tableData" style="width: 100%" height="100%">
      <template #empty>
        暂无作业
      </template>
      <el-table-column type="index"/>
      <el-table-column prop="assignmentName" label="课程名称"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column prop="endTime" label="截止时间" sortable/>
      <el-table-column prop="status" label="状态" sortable/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleShowDetail(scope.row.assignmentId)" style="margin-right: 0; margin-left: 0;padding-left: 10px; padding-right: 10px" color="#597D3B">
            <el-icon style="margin-right: 3px"><ZoomIn/></el-icon>
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        small
        style="font-size: 16px;margin-top: 10px;margin-left: 450px"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[5, 10, 15]"
        :current-page="pageInfo.pages"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
    </el-pagination>
  </el-card>
</template>

<script lang="ts" setup>
  import {Refresh, ZoomIn, Search} from "@element-plus/icons-vue";
  import {inject, onMounted, reactive, ref} from "vue";
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import type {CourseVO, IAssignment} from "@/types/vo";
  import router from "@/router";
  import {AssignmentStatus} from "@/types/enums";
  import {useFormatDate} from "@/hooks/useFormatDate";

  const apis = useApis()
  const store = useStore()
  const doRefresh:Function = inject("reload")
  const {formatDate} = useFormatDate()
  const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

  // 获取的所有作业
  let homeworkList = reactive<{
    tableData: IAssignment[]
  }>({
    tableData: []
  })

  // 符合查询条件的作业
  let processedHomeworkList = reactive<{
    tableData: IAssignment[],
  }>({
    tableData: [],
  })

  // 最终展示的作业
  let pageInfo = reactive<{
    tableData: IAssignment[],
    size: number, // 分页大小
    pages: number, // 总页数
    total: number
  }>({
    tableData: [],
    size: 10,
    pages: 1,
    total: null,
  })

  const handleShowDetail = (assignmentId:number) => {
    router.push(`/home/homeworkDetail/${assignmentId}`)

  }

  const handleCurrentChange = (pageNum: number) => {
    Object.assign(pageInfo, {
      tableData: getSlice(pageNum, pageInfo.size),
      size: pageInfo.size,
      pages: pageNum,
      total: processedHomeworkList.tableData.length,
    })
  }
  const handleSizeChange = (pageSize: number) => {
    Object.assign(pageInfo, {
      tableData: getSlice(1, pageSize),
      size: pageSize,
      pages: 1,
      total: processedHomeworkList.tableData.length,
    })
  }


  const fetchData = () => {
    if (role === 'student') {
      apis.getCourseByStudentId(store.user.id)
          .then((res: any) => {
            // 获取课程总数
            let total = res.data.data.total;
            apis.getCourseByStudentId(store.user.id,1,total)
                .then((res: any) => {
                  let data:CourseVO[] = res.data.data.records
                  for(let i = 0; i < data.length; i++){
                    fetchHomeworkListByCourseId(data[i].courseId)
                  }
                })
          })
    } else if (role === "teachers") {
      apis.getCourseByTeacherId(store.user.id)
          .then((res: any) => {
            // 获取课程总数
            let total = res.data.data.total;
            apis.getCourseByTeacherId(store.user.id,1,total)
                .then((res: any) => {
                  let data:CourseVO[] = res.data.data.records
                  for(let i = 0; i < data.length; i++){
                    fetchHomeworkListByCourseId(data[i].courseId)
                  }
                })
          })
    }
  }

  const fetchHomeworkListByCourseId = (courseId:number) => {
    apis.getAssignmentByCourseId(courseId)
        .then((res: any) => {
          let total = res.data.data.total
          apis.getAssignmentByCourseId(courseId, 1, total)
              .then((res: any) => {
                let data = res.data.data.records
                for(let i = 0; i < data.length; i++) {
                  data[i].endTime = formatDate(data[i].endTime)
                  homeworkList.tableData.push(data[i])
                }
                processedHomeworkList.tableData = homeworkList.tableData
                Object.assign(pageInfo, {
                  tableData: getSlice(pageInfo.pages, pageInfo.size),
                  size: pageInfo.size,
                  pages: pageInfo.pages,
                  total: processedHomeworkList.tableData.length,
                })
              })
        })
  }

  const handleSearch = () => {
    processedHomeworkList.tableData = []
    for(let i = 0; i < homeworkList.tableData.length; i++){
      let assignmentItem = homeworkList.tableData[i]
      let input = true;
      if(state.value != null && state.value != assignmentItem.status) input = false;
      if(assignmentName.value != '' && !assignmentItem.assignmentName.includes(assignmentName.value)) input = false;
      if(input) processedHomeworkList.tableData.push(assignmentItem);
      Object.assign(pageInfo, {
        tableData: getSlice(pageInfo.pages, pageInfo.size),
        size: pageInfo.size,
        pages: pageInfo.pages,
        total: processedHomeworkList.tableData.length,
      })
    }
  }

  //用于分页展示，截取数据
  const getSlice = (page: number, size: number) => {
    return processedHomeworkList.tableData.slice((page-1)*size, page*size)
  }

  onMounted(() => {
    fetchData()
    console.log(homeworkList)
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

  let assignmentName = ref('')

</script>

<script lang="ts">
export default {
  name: "HomeworkPage"
}
</script>
