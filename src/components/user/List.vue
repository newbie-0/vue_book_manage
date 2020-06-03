<template>
  <div>
    <el-card>
      <!--<el-button type="primary" @click="toAddUser">添加用户</el-button>-->
      <el-table :data="users" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="username" label="用户名" >
        </el-table-column>
        <el-table-column prop="realname" label="姓名" >
        </el-table-column>
        <el-table-column prop="realname" label="头像" >
          <template slot-scope="scope">
            <el-image :src="scope.row.userFace" min-width="80" height="100">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="电话号码" >
        </el-table-column>
        <el-table-column prop="balance" label="余额(元)" >
        </el-table-column>
        <el-table-column prop="role.name" label="角色" >
        </el-table-column>
        <el-table-column prop="status" label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="userStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="50">
          <template slot-scope="scope">
            <!--<el-button @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>-->
            <el-button @click="toDelete(scope.row.id)" type="text" size="small" v-if="scope.row.roleId !== 3">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="addForm" label-width="80px" ref="addFormRef" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="addForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone">
          <el-input v-model="addForm.telephone"></el-input>
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
        <el-form-item label="角色">
          <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option v-for="c in roles" :key="c.id" :label="c.name" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更新用户信息" :visible.sync="updateDialog">
      <el-form :model="updateForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="updateForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="updateForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="updateForm.telephone"></el-input>
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
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate">确 定</el-button>
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
      const reg = /^[0-9]{7,11}$/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      users: [],
      roles: [],
      addDialog: false,
      addForm: {},
      updateDialog: false,
      updateForm: [],
      userFace: '',
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadUsers()
    this.loadRoles()
  },
  methods: {
    async loadUsers() {
      const { data: res } = await this.$http.get('user/findAll')
      this.users = res.data
    },
    async loadRoles() {
      const { data: res } = await this.$http.get('role/findAll')
      this.roles = res.data
    },
    userStatusChange(record) {
      this.$http.put('user/updateStatus', qs.stringify({ id: record.id, status: record.status })).then(res => {
        this.$message.success(res.data.message)
      })
    },
    toAddUser() {
      this.addForm = {}
      this.addDialog = true
    },
    upload(file) {
      const data = new FormData()
      data.append('file', file.file)
      this.$http.post('upload/image', data).then(res => {
        this.userFace = res.data.data
      })
    },
    submitAdd() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return false
        this.addForm.userFace = this.userFace
        this.$http.post('user/save', qs.stringify(this.addForm)).then(res => {
          this.addDialog = false
          this.loadUsers()
          this.$message.success(res.data.message)
        })
      })
    },
    toEdit(record) {
      this.updateDialog = true
      this.updateForm = record
    },
    submitUpdate() {
      this.updateForm.userFace = this.userFace
      this.$http.put('user/update', qs.stringify(this.updateForm)).then(res => {
        this.updateDialog = false
        this.loadUsers()
        this.$message.success(res.data.message)
      })
    },
    toDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('user/deleteById', { params: { id } }).then(response => {
          this.loadUsers()
          if (response.data.status === 200) {
            this.$message.success(response.data.message)
          } else {
            this.$message.error(response.data.message)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}
</style>
