<template>
  <div>
    <el-card>
      <el-button type="text" @click="back">返回</el-button>

      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="所属分类">
            <el-select v-model="form.categoryId" placeholder="请选择所属分类">
                <el-option v-for="c in categorys" :key="c.id" :label="c.name" :value="c.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="书籍名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            ref="upload"
            action=""
            :http-request="upload"
            :limit="1"
            list-type="picture">
            <el-button size="small" type="primary">选取图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="form.inventory"></el-input>
        </el-form-item>
        <el-form-item label="关联书籍">
          <el-select v-model="ids" multiple placeholder="请选择关联书籍">
            <el-option v-for="item in books" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即更新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data() {
    return {
      form: {},
      categorys: [],
      books: [],
      ids: []
    }
  },
  created() {
    this.form = {}
    this.form = this.$route.query
    this.loadCategory()
    this.loadBooks()
    this.loadRelationBook()
  },
  methods: {
    back() {
      this.$router.push('/book/all')
    },
    async loadCategory() {
      const { data: res } = await this.$http.get('category/findAll')
      this.categorys = res.data
    },
    async loadBooks() {
      const { data: res } = await this.$http.get('book/findBookLike', { params: { status: '已上架' } })
      this.books = res.data.list
    },
    async loadRelationBook() {
      const { data: res } = await this.$http.get('book/findRelationBook', { params: { id: this.form.id } })
      res.data.map(book => {
        this.ids.push(book.id)
      })
    },
    onSubmit() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      this.form.userId = user.id
      this.$http.post('book/saveOrUpdate', qs.stringify(this.form)).then(response => {
        if (this.ids.length > 0) {
          this.$http.post('book/saveRelation', qs.stringify({ bookId: response.data.data, relationId: this.ids }))
          this.$message.success(response.data.message)
        }
        this.$router.push('/book/all')
      })
    },
    upload(file) {
      const data = new FormData()
      data.append('file', file.file)
      this.$http.post('upload/image', data).then(res => {
        this.form.image = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
