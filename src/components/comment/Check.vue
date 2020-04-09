<template>
  <div>
    <el-card>
      <el-table :data="comments" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="content" label="内容" >
        </el-table-column>
        <el-table-column prop="time" label="时间" width="180px">
        </el-table-column>
        <el-table-column prop="user.realname" label="评论人" width="100px">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80px">
          <template slot-scope="scope">
            <el-button @click="toCheck(scope.row.id)" type="text" size="small">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="评论审核" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="状态" label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请审核">
            <el-option label="审核通过" value="已审核"></el-option>
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
      comments: [],
      form: {},
      dialogFormVisible: false,
      id: ''
    }
  },
  created() {
    this.getUnckeckedComment()
  },
  methods: {
    async getUnckeckedComment() {
      const { data: res } = await this.$http.get('comment/findUnCheckedComment')
      this.comments = res.data
    },
    toCheck(id) {
      this.dialogFormVisible = true
      this.id = id
    },
    submit() {
      this.$http.put('comment/check', qs.stringify({ id: this.id, status: this.form.status })).then(res => {
        this.dialogFormVisible = false
        this.getUnckeckedComment()
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
