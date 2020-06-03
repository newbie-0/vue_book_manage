<template>
  <div>
    <el-card>
     <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入关键字" v-model="input">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-form id="form" action='http://127.0.0.1:8848/collect/download' method="get">
            <el-form-item>
              <el-input name="userId" v-model="user.id" :style = "{ display: 'none'}"></el-input>
              <el-button type="primary" @click="exportExcel">Excel导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table :data="collects" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="book.name" label="书籍名称" >
        </el-table-column>
        <el-table-column label="图片" width="100px">
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
        <el-table-column prop="book.intro" label="介绍" >
        </el-table-column>
        <el-table-column prop="book.price" label="价格" >
        </el-table-column>
        <el-table-column prop="time" label="收藏时间" >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="90px">
          <template slot-scope="scope">
          <el-button @click="toReview(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="toDelete(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: '',
      collects: [],
      input: ''
    }
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.user = user
    this.loadCollects()
  },
  methods: {
    async loadCollects() {
      const { data: res } = await this.$http.get('collect/findByUserId', { params: { userId: this.user.id } })
      this.collects = res.data
    },
    toReview(record) {
      this.$router.push({ path: '/book/info', query: record.book })
    },
    toDelete(id) {
      this.$confirm('此操作将永久删除该收藏, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('collect/deleteById', { params: { id } }).then(response => {
          this.loadCollects()
          this.$message.success(response.data.message)
        })
      })
    },
    search() {
      this.$http.get('collect/findCollectLike', { params: { keyword: this.input } }).then(res => {
        this.collects = res.data.data
      })
    },
    exportExcel() {
      var form = document.getElementById('form')
      form.submit()
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}
</style>
