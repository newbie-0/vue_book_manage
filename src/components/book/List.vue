<template>
    <div class="book_list">
      <el-card class="box-card">
        <!-- 按钮 -->
        <div class="top">
          <div class="nav">
            <span class="text">分类：</span>
            <span class="text all" @click="getBookList">全部</span>
            <el-dropdown v-for="c in categorys" :key="c.id"  @command="selectByCategory2">
              <span class="el-dropdown-link" @click="selectByCategory(c.id)">{{c.name}}</span>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in c.children" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-input placeholder="请输入书籍名称" v-model="input">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-form :model="form">
                <el-form-item>
                  <el-select v-model="form.sort" placeholder="排序方式" @change="sortBook">
                    <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> -->
                    <el-option label="价格升序" value="1"></el-option>
                    <el-option label="销量优先" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <!-- 表格 -->
        <el-table :data="data.list" style="width: 100%" border>
          <el-table-column prop="id" label="编号" >
          </el-table-column>
          <el-table-column prop="name" label="名称" >
          </el-table-column>
          <el-table-column prop="price" label="价格" >
          </el-table-column>
          <el-table-column prop="inventory" label="库存" >
          </el-table-column>
          <el-table-column prop="sale" label="销量" >
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
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="toReview(scope.row)" type="text" size="small">查看</el-button>
              <!--<el-button @click="toAdd(scope.row)" type="text" size="small">添加</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total"
          :total="this.data.total">
        </el-pagination>
      </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      input: '',
      categorys: [],
      categoryId: '',
      form: {}
    }
  },
  created() {
    this.getBookList()
    this.getCategoryList()
  },
  methods: {
    async selectBookList(name, categoryId, orderField) {
      const { data: res } = await this.$http.get('book/findBookLike', { params: { status: '已上架', name, categoryId, orderField } })
      this.data = res.data
    },
    getBookList() {
      this.categoryId = ''
      this.selectBookList()
    },
    async getCategoryList() {
      const { data: res } = await this.$http.get('category/cascadeFindAll')
      this.categorys = res.data
    },
    search() {
      this.selectBookList(this.input)
    },
    toReview(record) {
      this.$router.push({ path: '/book/info', query: record })
    },
    // toAdd() {

    // },
    // 按照分类进行查询
    selectByCategory(id) {
      this.categoryId = id
      this.selectBookList(this.input, id)
    },
    selectByCategory2(command) {
      this.categoryId = command
      this.selectBookList(this.input, command)
    },
    // 排序
    sortBook() {
      this.selectBookList(this.input, this.categoryId, this.form.sort)
    }
  }
}
</script>
<style lang="less" scoped>
.text {
  font-size: 15px;
  color: #606266;
}

.all {
  cursor: pointer;
  display: inline-block;
  width: 50px;
}

.el-dropdown {
  color: #606266;
  font-size: 15px;
}

.el-dropdown-link {
  cursor: pointer;
  display: block;
  width: 80px;
}

.el-row {
  top: 15px;
}

.sort {
  width: 85px;
  font-size: 15px;
  color: #606266;
  position: relative;
  top: 10px;
}

.el-table {
  top: 25px;
}

.el-pagination {
  margin-top: 35px;
}

</style>
