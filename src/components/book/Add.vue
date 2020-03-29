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
        <el-form-item label="价格">
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
            :auto-upload="false">
            <el-button size="small" type="primary">选取图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="form.inventory"></el-input>
        </el-form-item>
        <el-form-item label="关联书籍">
          <el-cascader v-model="form.relations" @change="handleSelection" ref="cascader" :options="options" :props="props" :show-all-levels="false" clearable></el-cascader>
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
      options: [],
      props: {
        multiple: true,
        label: 'name',
        value: 'id',
        children: 'children'
      },
      ids: []
    }
  },
  created() {
    this.form = {}
    this.form = this.$route.query
    this.loadCategory()
    this.loadCategoryBook()
  },
  methods: {
    back() {
      this.$router.push('/book/all')
    },
    async loadCategory() {
      const { data: res } = await this.$http.get('category/findAll')
      this.categorys = res.data
    },
    async loadCategoryBook() {
      const { data: res } = await this.$http.get('category/cascadeBookFindAll')
      this.options = res.data
    },
    async loadRelationBook() {

    },
    handleSelection(value) {
      this.ids = []
      for (var i = 0; i < value.length; i++) {
        this.ids.push(value[i][1])
      }
    },
    onSubmit() {
      this.$refs.upload.submit()
    },
    // upload(file) {
    //   const user = JSON.parse(sessionStorage.getItem('user'))
    //   const data = new FormData()
    //   data.append('file', file.file)
    //   if (typeof this.form.id !== 'undefined') {
    //     data.append('id', this.form.id)
    //   }
    //   data.append('name', this.form.name)
    //   data.append('author', this.form.author)
    //   data.append('price', this.form.price)
    //   data.append('userId', user.id)
    //   data.append('categoryId', this.form.categoryId)
    //   data.append('intro', this.form.intro)
    //   data.append('inventory', this.form.inventory)
    //   this.$http.post('book/saveOrUpdate', data, {
    //     headers: { 'Content-Type': 'multipart/form-data' }
    //   }).then(res => {
    //     this.ids.map(id => {
    //       this.$http.post('book/saveRelation', qs.stringify({ bookId: res.data.data, relationId: id }))
    //     })
    //     this.$message.success(res.data.message)
    //     this.$router.push('/book/all')
    //   })
    // }
    upload(file) {
      const data = new FormData()
      data.append('file', file.file)
      this.$http.post('book/upload', data).then(res => {
        this.form.image = res.data.data
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.form.userId = user.id
        this.$http.post('book/saveOrUpdate', qs.stringify(this.form)).then(response => {
          // this.ids.map(id => {
          //   this.$http.post('book/saveRelation', qs.stringify({ bookId: response.data.data, relationId: id }))
          // })
          this.$http.post('book/saveRelation', qs.stringify({ bookId: response.data.data, relationId: this.ids }))
          this.$message.success(response.data.message)
          this.$router.push('/book/all')
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
