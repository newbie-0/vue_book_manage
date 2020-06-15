<template>
  <div>
    <el-card>
     <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入关键字" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-form id="form" action='http://127.0.0.1:8848/shelf/download' method="get">
            <el-form-item>
              <el-input name="userId" v-model="user.id" :style = "{ display: 'none'}"></el-input>
              <el-button type="primary" @click="exportExcel">Excel导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table :data="shelfs" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="book.name" label="书籍名称" >
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <el-image :src="scope.row.book.image" min-width="40" height="60px">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="book.author" label="作者" >
        </el-table-column>
        <el-table-column prop="status" label="状态" >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120px">
          <template slot-scope="scope">
            <el-button @click="toRead(scope.row)" type="text" size="small">开始阅读</el-button>
            <el-button @click="toDelete(scope.row.id)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span class="info">该书籍还没有激活，是否激活？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="activate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: '',
      shelfs: [],
      input: '',
      dialogVisible: false,
      id: ''
    }
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.user = user
    this.loadShelfs()
  },
  methods: {
    async loadShelfs() {
      const { data: res } = await this.$http.get('shelf/findByUserId', { params: { userId: this.user.id } })
      this.shelfs = res.data
    },
    toDelete(id) {
      this.$http.delete('shelf/remove', { params: { id } }).then(res => {
        this.$message.success(res.data.message)
        this.loadShelfs()
      })
    },
    search() {
      this.$http.get('shelf/findShelfLike', { params: { userId: this.user.id, keyword: this.input } }).then(res => {
        this.shelfs = res.data.data
      })
    },
    exportExcel() {
      var form = document.getElementById('form')
      form.submit()
    },
    toRead(shelf) {
      if (shelf.status === '未激活') {
        this.id = shelf.id
        this.dialogVisible = true
      } else {
        this.$router.push('/shelf/content')
      }
    },
    activate() {
      this.$http.request(
        {
          url: 'shelf/alipay',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            id: this.id
          }
        }).then(result => {
        // 支付宝支付
        if (result.data.status === 200) {
          this.$router.push({ path: '/shelf/pay', query: { htmlData: result.data.data } })
        } else {
          this.$message.error(result.data.message)
        }
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}

.info {
  font-size: 16px;
  color: #000;
}
</style>
