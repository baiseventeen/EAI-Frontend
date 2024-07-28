<!--
  Description: 我的批改页面
  Author: BaiQi
  Created Date: 2024-7-25
-->
<template>
  <el-card class="course-card-contain" shadow="never">
    <div class="title">
      <span>课程列表</span>
    </div>

    <el-button :icon="Refresh" circle @click="doRefresh"></el-button>
    <el-input v-model="courseName" placeholder="请输入课程名称" clearable class="search-input"/>
    <el-button color="#597D3B" @click="handleSearch">
      <el-icon style="margin-right: 3px"><Search/></el-icon>
      查询
    </el-button>

    <el-table :data="pageInfo.records" style="width: 100%; max-height: 70vh" height="100%" :row-style="{height: '30px'}">
      <template #empty>
        暂无课程
      </template>
      <el-table-column type="index"/>
      <el-table-column prop="courseName" label="课程名称"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column prop="endTime" label="截止时间" sortable/>
<!--      <el-table-column prop="endTime" label="状态" sortable/>-->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleCorrect(scope.row.courseId, scope.row.courseName)" style="margin-right: 0; margin-left: 0;padding-left: 10px; padding-right: 10px" color="#597D3B">
            <el-icon style="margin-right: 3px" ><ZoomIn/></el-icon>
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
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import {inject, onMounted, reactive, ref} from "vue";
  import type {CourseVO} from "@/types/vo";
  import {Refresh, Search, ZoomIn} from "@element-plus/icons-vue";
  import router from "@/router";
  import type {CourseDTO} from "@/types/dto";
  import "./CoursePage.scss"
  import type {CourseQuery} from "@/types/query";
  import {useFormatDate} from "@/hooks/useFormatDate";

  const apis = useApis()
  const store = useStore()
  const doRefresh:Function = inject("reload")
  const {formatDate} = useFormatDate()

  const queryInfo = reactive({
    pageNow: 1,
    pageSize: 10,
  })

  let pageInfo = reactive<{
    records: CourseVO[],
    current: number,// 当前页码
    size: number, // 分页大小
    pages: number, // 总页数
    total: number
  }>({
    records: null,
    current: null,
    size: null,
    pages: null,
    total: null,
  })

  const query = reactive<CourseQuery>({
    courseId:null,
    teacherId:store.user.id,
    studentId:null,
    courseName:null,
    semester:null,
  })

  let courseName = ref('')
  const handleSearch = () => {
    Object.assign(query, {
      courseId:null,
      teacherId:store.user.id,
      studentId:null,
      courseName:courseName.value,
      semester:null,
    })
    fetchData(query)
  }

  /*
  路由跳转到作业界面
   */
  const handleCorrect = (courseId:number, courseName:string) => {
    router.replace({
      path:`/home/myCorrect/assignment`,
      query: {
        courseId: courseId,
      }
    });
    // location.reload()
  }

  const fetchData = (query: CourseQuery) => {
    apis.getAllCourse(query, queryInfo.pageNow, queryInfo.pageSize)
        .then((res: any) => {
          let data = res.data.data
          Object.assign(pageInfo, {...data})
          processData()
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {
        });
  }

  const processData = () => {
    for(let i = 0; i < pageInfo.records.length; i++){
      pageInfo.records[i].endTime = formatDate(pageInfo.records[i].endTime)
    }
  }

  const handleCurrentChange =(index:number)=>{
    queryInfo.pageNow=index;
    fetchData(query);
  }
  const handleSizeChange = (pageSize: number) => {
    queryInfo.pageSize = pageSize
    fetchData(query)
  }

  onMounted(() => {
    fetchData(query)
  })

  // TODO:状态选择
  let state = ref(null)
  const stateOptions = [
    {
      value: 0,
      label: "已结课"
    },
    {
      value: 1,
      label: "未结课"
    },
  ]
</script>

<script lang="ts">
export default {
  name: "CoursePage"
}
</script>
