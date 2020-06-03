<template>
  <div>
    <el-card>
      <div class="btn">
        <el-button type="primary" @click="toUpdateInfo">修改信息</el-button>
      </div>
      <div class="user_info">
        <h1>Welcome! {{user.realname}}</h1>
        <p>电话号码：<span>{{user.telephone}}</span></p>
        <p>余额：<span>{{user.balance}}</span></p>
      </div>
      <el-image :src="user.userFace"></el-image>
    </el-card>
    <el-dialog title="更新用户信息" :visible.sync="infoDialog">
      <el-form :model="infoForm" label-width="80px" :rules="rules" ref="ref">
        <el-form-item label="用户名">
          <el-input v-model="infoForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="infoForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone">
          <el-input v-model="infoForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            ref="upload"
            action=""
            :http-request="upload"
            :limit="1"
            list-type="picture">
            <el-button size="small" type="primary">选取图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data() {
    // 验证手机号的校验规则
    var checkMobile = (rule, value, cb) => {
      const reg = /0?(13|14|15|17|18)[0-9]{9}/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      user: {},
      infoDialog: false,
      infoForm: {},
      rules: {
        password: [
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        telephone: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.user = user
  },
  methods: {
    toUpdateInfo() {
      this.infoForm = this.user
      this.infoDialog = true
    },
    upload(file) {
      const data = new FormData()
      data.append('file', file.file)
      this.$http.post('upload/image', data).then(res => {
        this.infoForm.userFace = res.data.data
      })
    },
    submitUpdateInfo() {
      this.$refs.ref.validate(async valid => {
        if (!valid) return false
        this.$http.put('user/update', qs.stringify(this.infoForm)).then(res => {
          // 保存用户信息
          window.sessionStorage.setItem('user', [JSON.stringify(res.data.data)])
          this.infoDialog = false
          this.$message.success(res.data.message)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  height: 520px;
}

.user_info {
  position: relative;
  top: 50px;
  left: 80px;
}

.el-image {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  right: 150px;
  top: 140px;
}

.btn {
  position: relative;
  top: 50px;
  left: 80px;
}

</style>
