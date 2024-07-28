<!--
  Description: 课程详情页面的课程作业表格组件
  Author: BaiQi
  Created Date: 2024-7-1
-->
<template>
  <el-card>
    <template v-if="props.role == 'teachers'">
      <el-button color="#597d3b" @click="cleanNewAssignmentInfo(); changeDialog('add')" v-if="props.isShowNewHomework">新建作业</el-button>
    </template>
    <template v-if="props.tableData.length > 0">
      <el-table :data="props.tableData" stripe style="width: 100%" height="100%">
        <el-table-column
            v-for="column in props.columns"
            :prop="column.dataIndex"
            :label="column.title"
        >
        </el-table-column>
        <el-table-column label="详情">
          <template #default="scope">
            <el-button color="#888" circle @click="openEditor(scope.row.descriptionFile, scope.row.assignmentName)"/>
          </template>
        </el-table-column>
        <el-table-column :label="role == 'teachers'? '编辑':'写作'">
          <template #default="scope">
            <el-button color="#888" circle @click="handleFunctionButton(scope.row.assignmentId)" :disabled="props.disabled"/>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <div style="text-align: center;">暂无作业</div>
    </template>
  </el-card>

  <el-dialog v-model="dialogConfig.visible" :title="dialogConfig.title">
    <el-form :model="newAssignmentInfo">
      <!--      <el-form-item label="课程图片">-->
      <el-form-item label="作业名称">
        <el-input v-model="newAssignmentInfo.assignmentName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="作业描述">
        <el-input v-model="newAssignmentInfo.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="描述文件">
        <el-input v-model="newAssignmentInfo.descriptionFile" placeholder="请输入文件地址"></el-input>
      </el-form-item>
      <el-form-item label="课程图片">
        <el-input v-model="newAssignmentInfo.attachments[0]" placeholder="请输入图片链接"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="newAssignmentInfo.startTime" type="datetime" placeholder="截止时间" style="width: 180px"/>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker v-model="newAssignmentInfo.endTime" type="datetime" placeholder="截止时间" style="width: 180px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogConfig.visible = false; cleanNewAssignmentInfo()">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <ViewsWordEditor :alert="alertProps" :docxInfo="docxInfo"></ViewsWordEditor>
</template>


<script lang="ts" setup>
import {defineProps, inject, onMounted, reactive, ref} from 'vue';
  import type {AssignmentVO, IAssignmentTableColumn, IAssignmentTableItem} from "@/types/vo";
  import router from "@/router";
  import type {AssignmentDTO} from "@/types/dto";
  import useApis from "@/apis";
  import {ElNotification} from "element-plus";
  import {useFormatDate} from "@/hooks/useFormatDate";
  import assignment from "@/apis/assignment";
import ViewsWordEditor from "@/components/ViewsWordEditor/ViewsWordEditor.vue";

  const props = defineProps<{
    tableData: IAssignmentTableItem[],
    columns: IAssignmentTableColumn[],
    role: string,
    courseId: number,
    isShowNewHomework: boolean,
    disabled: boolean;
  }>()

  const apis = useApis()
  const doRefresh:Function = inject("reload")
  const {formatDate} = useFormatDate()

  const dialogConfig = reactive({
    type: "",
    visible: false,
    title: "",
    disable: false
  })

  const changeDialog = (type:string)=>{
    dialogConfig.visible=true;
    switch (type){
      case "add": {
        dialogConfig.type="add";
        dialogConfig.disable=false;
        dialogConfig.title="新增作业";
        break;
      }
      case "edit": {
        dialogConfig.type="edit";
        dialogConfig.disable=false;
        dialogConfig.title="编辑作业";
        break;
      }
    }
  }

  let open = ref(false)

  const alertProps = reactive({
    open: open.value,
    onOk: () => (open.value = false),
    onCancel: () => (open.value = false),
  });

  const docxInfo = reactive({
    docxUrl: null,
    docxTitle: null,
  });

const openEditor = (url: string, title: string) => {
  open.value = true;
  Object.assign(alertProps, {
    open: open.value,
    // onOk: () => (open.value = false),
    onCancel: () => {
      open.value = false
      Object.assign(alertProps,{
        open: open.value,
        onOk: () => (open.value = false),
        onCancel: () => (open.value = false),
      })
      Object.assign(docxInfo, {
        docxUrl: url,
        docxTitle: title,
      })
    },
  })
  Object.assign(docxInfo, {
    docxUrl: url,
    docxTitle: title,
  })
};

  let newAssignmentInfo = reactive<AssignmentDTO>({
    assignmentName: '',
    description: '',
    descriptionFile: '',
    attachments: [''],
    startTime: '',
    endTime: ''
  })

  const cleanNewAssignmentInfo = () => {
    Object.assign(newAssignmentInfo, {
      assignmentName: '',
      description: '',
      descriptionFile: '',
      attachments: [''],
      startTime: '',
      endTime: ''
    })
  }

  const setNewAssignmentInfo = (assignment: AssignmentVO) => {
    Object.assign(newAssignmentInfo, {
      assignmentName: assignment.assignmentName,
      description: assignment.description,
      descriptionFile: assignment.descriptionFile,
      attachments: assignment.attachments == null? ['']:assignment.attachments,
      startTime: assignment.startTime,
      endTime: assignment.endTime
    })
  }

  // 用于记录当前编辑的作业的id
  let IAssignmentId = ref(0)
  const handleFunctionButton = (assignmentId:number) => {
    if(props.role == 'student'){
      handleWriting(assignmentId)
    } else if(props.role == 'teachers'){
      apis.getAssignmentById(assignmentId)
          .then((res:any) => {
            setNewAssignmentInfo(res.data.data)
            IAssignmentId.value = res.data.data.assignmentId
          })
      changeDialog('edit')
    }
  }

  const handleWriting = (assignmentId:number) => {
    router.push(`/home/assignment/${assignmentId}/edit`);
    // Location.reload()
  }


  const handleSubmit = () => {
    newAssignmentInfo.endTime = formatDate(newAssignmentInfo.endTime);
    newAssignmentInfo.startTime = formatDate(newAssignmentInfo.startTime);
    if(dialogConfig.type === 'add'){
      apis.createAssignment(props.courseId, newAssignmentInfo)
          .then((res) => {
            if(res.data.code===200) {
              ElNotification({
                title: '新增成功',
                type: 'success',
              })
            }else {
              ElNotification({
                title: '新增失败',
                type: 'error',
              })
            }
            dialogConfig.visible = false
            cleanNewAssignmentInfo()

          })
          .catch((err) => {
            console.log(err)
          })
    } else if(dialogConfig.type === 'edit'){
      apis.updateAssignment(IAssignmentId.value, newAssignmentInfo)
          .then((res:any) => {
            if(res.data.code===200) {
              ElNotification({
                title: '修改成功',
                type: 'success',
              })
            }else {
              ElNotification({
                title: '修改失败',
                type: 'error',
              })
            }
            dialogConfig.visible = false
            cleanNewAssignmentInfo()
          })
          .catch((err) => {
            console.log(err)
          })
    }
    doRefresh();
  }

  onMounted(() => {
    console.log(props)
  })
</script>

<script lang="ts">
export default {
  name: "CourseHomeworkTable"
}
</script>
