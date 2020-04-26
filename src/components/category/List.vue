<template>
  <div>
    <el-card>
      <div class="btns">
        <el-button type="primary" @click="toAdd">分类添加</el-button>
        <el-button type="primary" @click="sort">按数量排序</el-button>
      </div>
      <el-table :data="categorys" style="width: 100%" border>
        <el-table-column prop="id" label="编号">
        </el-table-column>
        <el-table-column prop="name" label="名称" >
        </el-table-column>
        <el-table-column prop="description" label="描述" >
        </el-table-column>
        <el-table-column prop="children.length" label="书籍数量" >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="toDelete(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="更新分类" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="上级分类">
            <el-select v-model="form.parentId" placeholder="请选择上级分类" clearable>
                <el-option v-for="c in parentCategorys" :key="c.id" :label="c.name" :value="c.id"></el-option>
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
      categorys: [],
      parentCategorys: [],
      form: {},
      dialogFormVisible: false
    }
  },
  created() {
    this.getCategorys()
    this.getParentCategory()
  },
  methods: {
    async getCategorys() {
      const { data: res } = await this.$http.get('category/findAllCategoryAndBook')
      this.categorys = res.data
    },
    async getParentCategory() {
      const { data: res } = await this.$http.get('category/findParentCategory')
      this.parentCategorys = res.data
    },
    toAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    async sort() {
      const { data: res } = await this.$http.get('category/findAllCategoryAndBook', { params: { isSort: '1' } })
      this.categorys = res.data
    },
    toEdit(record) {
      this.form = record
      this.dialogFormVisible = true
    },
    toDelete(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('category/deleteById', { params: { id } }).then(response => {
          this.getCategorys()
          if (response.data.status === 200) {
            this.$message.success(response.data.message)
          } else {
            this.$message.error(response.data.message)
          }
        })
      })
    },
    submit() {
      this.$http.post('category/saveOrUpdate', qs.stringify(this.form)).then(res => {
        this.dialogFormVisible = false
        if (res.data.status === 200) {
          this.getCategorys()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-table {
  margin: 15px 0;
}
</style>
