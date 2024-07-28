<!--
  Description: 我的课程页面
  Author: BaiQi
  Created Date: 2024-7-2
-->
<template>
  <el-card style="margin: 10px auto 0;height: 100%; width: 80%" shadow="never">
    <el-button :icon="Refresh" circle @click="doRefresh"></el-button>
    <template v-if="role == 'teachers'">
      <el-button @click="visible = !visible" color="#597d3b">新增课程</el-button>
    </template>
    <el-input v-model="courseName" placeholder="请输入课程名称" clearable style="width: 180px; margin: 0 10px 0 10px ;"/>
    <el-button color="#597D3B" @click="handleSearch">
      <el-icon style="margin-right: 3px"><Search/></el-icon>
      查询
    </el-button>

    <el-table :data="pageInfo.records" style="width: 100%" height="100%">
      <template #empty>
        暂无课程
      </template>
      <el-table-column type="index"/>
      <el-table-column prop="courseName" label="课程名称"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column prop="endTime" label="截止时间" sortable/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleShowDetail(scope.row.courseId)" style="margin-right: 0; margin-left: 0;padding-left: 10px; padding-right: 10px" color="#597D3B">
            <el-icon style="margin-right: 3px" ><ZoomIn/></el-icon>
            详情
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

  <el-dialog v-model="visible" title="新增课程">
    <el-form :model="newCourse">
      <el-form-item label="课程名称">
        <el-input v-model="newCourse.courseName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="面向年级">
        <el-input v-model="newCourse.targetGrade" placeholder="请输入年级"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="newCourse.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="选课码">
        <el-input v-model="newCourse.enrollCode" placeholder="请输入选课码"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="newCourse.startTime" type="datetime" placeholder="截止时间" style="width: 180px"/>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker v-model="newCourse.endTime" type="datetime" placeholder="截止时间" style="width: 180px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import useApis from "@/apis";
  import {useStore} from "@/store";
  import {inject, onMounted, reactive, ref} from "vue";
  import type {CourseVO} from "@/types/vo";
  import {Refresh, Search, ZoomIn} from "@element-plus/icons-vue";
  import router from "@/router";
  import type {CourseDTO} from "@/types/dto";
  import {ElNotification} from "element-plus";
  import type {CourseQuery} from "@/types/query";
  import {useFormatDate} from "@/hooks/useFormatDate";

  const apis = useApis()
  const store = useStore()
  const doRefresh:Function = inject("reload")
  const {formatDate} = useFormatDate()
  const role:'teachers' | 'student' = store.user.role === 'STUDENT' ?   'student':'teachers';

  let visible = ref(false)

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

  let newCourse = reactive<CourseDTO>({
    courseName: "",
    teacherIds: [store.user.id],
    courseImages: [],
    targetGrade: "",
    startTime: "",
    endTime: "",
    description: "",
    enrollCode: ""
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
    if (role === 'student') {
      Object.assign(query, {
        courseId: null,
        teacherId: null,
        studentId: store.user.id,
        courseName: courseName.value,
        semester: null,
      })
    } else if(role === 'teachers'){
      Object.assign(query, {
        courseId: null,
        teacherId: store.user.id,
        studentId: null,
        courseName: courseName.value,
        semester: null,
      })
    }
    apis.getAllCourse(query, queryInfo.pageNow, queryInfo.pageSize)
        .then((res: any) => {
          let data = res.data.data
          console.log(data)
          Object.assign(pageInfo, {...data})
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {
        });
  }

  const handleSubmit = () => {
    newCourse.endTime = formatDate(newCourse.endTime)
    newCourse.startTime = formatDate(newCourse.startTime)
    apis.createCourse(newCourse)
        .then((res:any) => {
          if(res.data.code===200) {
            ElNotification({
              title: '添加成功',
              type: 'success',
            })
          }else {
            console.log(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    visible.value = false
  }

  const handleShowDetail = (value:number) => {
    // router.push(`/home/courseDetail/${value}`)
    router.replace(`/home/courseDetail/${value}`);
    // location.reload()
  }

  const fetchData = () => {
    if (role === 'student') {
      Object.assign(query, {
        courseId:null,
        teacherId:null,
        studentId:store.user.id,
        courseName:null,
        semester:null,
      })
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
    } else if (role === "teachers") {
      Object.assign(query, {
        courseId:null,
        teacherId:store.user.id,
        studentId:null,
        courseName:null,
        semester:null,
      })
      apis.getAllCourse(query, queryInfo.pageNow, queryInfo.pageSize)
          .then((res: any) => {
            let data = res.data.data
            console.log(data)
            Object.assign(pageInfo, {...data})
            processData()
          })
          .catch((err: any) => {
            console.error(err);
          })
          .finally(() => {
          });
    }
  }

  const processData = () => {
    for(let i = 0; i < pageInfo.records.length; i++){
      pageInfo.records[i].endTime = formatDate(pageInfo.records[i].endTime)
    }
  }

  const handleCurrentChange =(index:number)=>{
    queryInfo.pageNow=index;
    fetchData();
  }
  const handleSizeChange = (pageSize: number) => {
    queryInfo.pageSize = pageSize
    fetchData()
  }


  onMounted(() => {
    fetchData()
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
