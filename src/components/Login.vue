<template>
  <div class="login_container">
    <div class="login_box" :style="{ height: height + 'px'}">
      <div class="title-container">
        <h3 class="title"><span class="loginText" @click="clickLogin">登录</span>
        <span class="registerText" @click="clickRegister">注册</span></h3>
      </div>
      <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef"
      :style="{ display: this.click === 'login' ? '' : 'none' }">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login_btn" type="primary" :loading="loading" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
      <el-form class="register_form" :model="registerForm" :rules="registerFormRules" ref="registerFormRef"
      :style="{ display: this.click === 'register' ? '' : 'none' }" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerForm.password">
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="registerForm.realname">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone">
          <el-input v-model="registerForm.telephone">
          </el-input>
        </el-form-item>
        <el-form-item label="注册类型">
          <el-radio v-model="registerForm.roleId" label="1">用户</el-radio>
          <el-radio v-model="registerForm.roleId" label="2">商家</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button class="register_btn" type="primary" :loading="registerLoading" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data () {
    // 验证姓名的校验规则
    var checkRealname = (rule, value, cb) => {
      const reg = /[\u4e00-\u9fa5]{2,5}/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('请输入2到5个中文字符'))
    }
    // 验证手机号的校验规则
    var checkMobile = (rule, value, cb) => {
      const reg = /0?(13|14|15|17|18)[0-9]{9}/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      click: 'login',
      height: '300',
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      registerForm: {
        roleId: '1'
      },
      registerFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: checkRealname, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      loading: false,
      registerLoading: false
    }
  },
  methods: {
    clickLogin() {
      this.click = 'login'
      this.height = '300'
    },
    clickRegister() {
      this.click = 'register'
      this.height = '500'
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        this.loading = true
        const { data: res } = await this.$http.post('user/login', this.loginForm)
        if (res.status !== 200) {
          return this.$message.error(res.message)
        } else {
          this.$message.success('登录成功')
          // 将token保存到sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          // 保存用户信息
          window.sessionStorage.setItem('user', [JSON.stringify(res.data.user)])

          this.$router.push('/home')
        }
        this.loading = false
      })
    },
    register() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return false
        this.registerLoading = true
        const { data: res } = await this.$http.post('user/register', qs.stringify(this.registerForm))
        if (res.status !== 200) {
          this.$message.error(res.message)
        } else {
          this.registerLoading = false
          this.$message.success(res.message)
        }
        this.registerLoading = false
        this.registerForm = {}
        this.clickLogin()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    height: 300px;
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.title-container {
  position: relative;
  .title {
    font-size: 26px;
    color: #2b4b6b;
    margin: 30px auto 40px auto;
    text-align: center;
    font-weight: bold;
    width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      cursor: pointer;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}

.register_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}

.login_btn {
  width: 100%;
}

.register_btn {
  width: 70%;
}
</style>
