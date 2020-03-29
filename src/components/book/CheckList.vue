<template>
  <div>
    <el-card>
      <el-table :data="books" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="name" label="名称" >
        </el-table-column>
        <el-table-column prop="price" label="价格" >
        </el-table-column>
        <el-table-column prop="inventory" label="库存" >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="toCheck(scope.row.id)" type="text" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="书籍审核" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="状态" label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请审核">
            <el-option label="审核通过" value="未上架"></el-option>
            <el-option label="审核不通过" value="未通过"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data() {
    return {
      books: [],
      form: {},
      dialogFormVisible: false,
      id: ''
    }
  },
  created() {
    this.getUnckeckedBook()
  },
  methods: {
    async getUnckeckedBook() {
      const { data: res } = await this.$http.get('book/findByUserIdAndStatus', { params: { status: '待审核' } })
      this.books = res.data
    },
    toCheck(id) {
      this.dialogFormVisible = true
      this.id = id
    },
    submit() {
      this.$http.put('book/check', qs.stringify({ id: this.id, status: this.form.status })).then(res => {
        this.dialogFormVisible = false
        this.getUnckeckedBook()
        this.$message.success(res.data.message)
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
