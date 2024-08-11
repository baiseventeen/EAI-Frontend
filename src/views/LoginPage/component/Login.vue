<!--
  Description: 登录组件，登录界面的登录输入框
  Author: BaiQi
  Created Date: 2024-6-28
-->
<template>
  <div class="login-style">
    <div class="box-vessel">
      <div class="vessel-title">
        {{ isCode ? '邮箱登录' : '账号登录' }}
      </div>
      <el-form
          :model="data"
          :rules="rules"
          ref="form"
          label-width="0"
      >
        <el-form-item :prop="isCode ? 'email' : 'officialNumber'">
          <el-input
              v-model="data.officialNumber"
              :placeholder="isCode ? '请输入邮箱' : '请输入账号'"
          />
        </el-form-item>
        <el-form-item :prop="isCode ? 'code' : 'password'">
          <template v-if="isCode">
            <el-input
                v-model="data.code"
                placeholder="请输入验证码"
            >
              <template #append>
                <el-button
                    :class="isStart? '' : 'code-button-active'"
                    @click="getCode"
                    :disabled="isStart"
                >
                  {{ isStart ? countdown : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </template>
          <template v-else>
            <el-input
                v-model="data.password"
                placeholder="请输入密码"
                show-password
            />
          </template>
        </el-form-item>
        <div class="forget">忘记密码？</div>
        <el-form-item>
          <el-button class="login-button" @click="handleLogin">用户登录</el-button>
        </el-form-item>
        <div class="sign" @click="onClickSign">去注册？</div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive,defineProps } from 'vue';
  import { useStore } from '@/store';
  import useApis from '@/apis';
  import router from "@/router";
  import { useCountdown } from '@/hooks/useCountdown';
  import "./index.scss"
  import { ElMessage } from 'element-plus';


  interface LoginProps {
    // 是否是手机号登录
    isCode?: boolean
    // 获取验证码
    onCode?: () => void
    // 提交
    onSubmit?: (data: { password: string, username: string }) => void
  }

  const props = defineProps({
    isCode: {
      type: Boolean,
      default: false,
    },
    onCode: {
      type: Function,
      default: null,
    },
    onSubmit: {
      type: Function,
      default: null,
    },
  });

  const store = useStore();
  const apis = useApis();
  const { start, isStart, countdown } = useCountdown();

  const data = reactive({
    officialNumber: '',
    password: '',
    code: '',
  });

  const rules = reactive({
    officialNumber: [
      { required: true, message: props.isCode ? '邮箱不能为空' : '账号不能为空', trigger: 'blur' },
    ],
    password: [
      { required: true, message: props.isCode ? '验证码不能为空' : '密码不能为空', trigger: 'blur' },
    ],
  });

  // TODO：获取验证码方法未实现
  const getCode = () => {
    start();
    props.onCode?.();
    console.log('获取验证码');
  };

  let assignmentId = ref(1)
  const handleLogin = () => {
    apis.login({
      officialNumber: data.officialNumber,
      password: data.password
    }).then((_res:any) => {
      console.log(_res);
      const data = _res.data.data
      if (_res.data.code === 200) {
        store.setUser(data);
        store.setToken(data?.token)
        localStorage.setItem('Authorization', data?.token);
        localStorage.setItem('User', data);
        // router.push("/")
        router.push(`/home`)
      } else {
        console.log("登陆失败")
      }
    }).catch((_err:any) => {
      console.log("登陆失败", _err)
    })
  };

  const onClickSign = () => {
    // router.push('/sign');
    console.log("注册")
  };

</script>

<script lang="ts">
export default {
  name: "Login"
}
</script>
