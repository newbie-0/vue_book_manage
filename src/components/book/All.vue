<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="text" @click="getAllBooks">全部</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="text" @click="getBooks1">已上架</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="text" @click="getBooks2">未上架</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="text" @click="getBooks3">待审核</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="text" @click="getBooks4">未通过</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAddBook">书籍添加</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="batchDelete">批量删除</el-button>
        </el-col>
      </el-row>
      <el-table :data="books" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="id" label="编号" >
        </el-table-column>
        <el-table-column label="图片" >
          <template slot-scope="scope">
            <el-image :src="scope.row.image" min-width="80" height="100">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" >
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" >
        </el-table-column>
        <el-table-column prop="inventory" label="库存" >
        </el-table-column>
        <el-table-column prop="sale" label="销量" >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="toReview(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="putaway(scope.row.id)" :style="{ display: scope.row.status === '未上架'? '': 'none'}">上架</el-button>
            <el-button type="text" size="small" @click="soldout(scope.row.id)" :style="{ display: scope.row.status === '已上架'? '': 'none'}">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data() {
    return {
      books: [],
      ids: [],
      userId: ''
    }
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.userId = user.id
    this.getAllBooks()
  },
  methods: {
    getAllBooks() {
      this.getBooks(this.userId)
    },
    async getBooks(userId, status) {
      const { data: res } = await this.$http.get('book/findByUserIdAndStatus', { params: { userId, status } })
      this.books = res.data
    },
    getBooks1() {
      this.getBooks(this.userId, '已上架')
    },
    getBooks2() {
      this.getBooks(this.userId, '未上架')
    },
    getBooks3() {
      this.getBooks(this.userId, '待审核')
    },
    getBooks4() {
      this.getBooks(this.userId, '未通过')
    },
    toAddBook() {
      this.$router.push({ path: '/book/add' })
    },
    toEdit(record) {
      this.$router.push({ path: '/book/add', query: record })
    },
    toReview(record) {
      this.$router.push({ path: '/book/info', query: record })
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    batchDelete() {
      this.$confirm('此操作将永久删除这些书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('book/batchDelete', this.ids).then(response => {
          this.getAllBooks()
          this.$message.success(response.data.message)
        })
      })
    },
    putaway(id) {
      this.$http.put('book/putaway', qs.stringify({ id })).then(res => {
        this.getAllBooks()
        this.$message.success(res.data.message)
      })
    },
    soldout(id) {
      this.$http.put('book/soldOut', qs.stringify({ id })).then(res => {
        this.getAllBooks()
        this.$message.success(res.data.message)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  left: 50px;
  .el-button {
    font-size: 16px;
  }
}

.el-table {
  margin: 25px 0;
}
</style>
