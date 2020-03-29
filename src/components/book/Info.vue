<template>
  <div>
    <el-card>
      <el-button type="text" @click="back">返回</el-button>
      <!-- 表单 -->
      <el-form ref="form" :model="data" label-width="80px">
        <el-image :src="data.image"></el-image>
        <div class="book_info">
          <h1>{{data.name}}</h1>
          <h2><span>{{data.intro}}</span></h2>
          <div class="info">
            作者：<span>{{data.author}}</span>
          </div>
          <div class="info">
            销量：<span>{{data.sale}}</span>
          </div>
          <div class="info">
            库存：<span>{{data.inventory}}</span>
          </div>
          <div class="price_info">
            定价：<span>￥<span class="price">{{data.price}}</span></span>
          </div>
        </div>
        <div class="relation_info">
          <span>关联书籍</span>
          <p v-for="book in relationBook" :key="book.id" @click="toReview(book)">{{book.name}}</p>
        </div>
        <div class="comment_info">
          <div class="label">
            <span>评论区</span>
            <el-button type="primary" @click="toPublishComment" :style="{ display: this.user.roleId === 1 ? '' : 'none' }">发布评论</el-button>
          </div>
          <el-input type="textarea" :rows="2" placeholder="请留下你的评论" v-model="textarea" :style="{ display: this.user.roleId === 1 ? '' : 'none' }" />
          <p v-for="comment in comments" :key="comment.id"><span class="name">{{comment.user.realname}}</span>：<span>{{comment.content}}</span></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import qs from 'querystring'
export default {
  data() {
    return {
      data: {},
      relationBook: [],
      textarea: '',
      comments: [],
      user: {}
    }
  },
  created() {
    this.data = this.$route.query
    this.getRelationBook()
    this.getComments()
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.user = user
  },
  methods: {
    back() {
      if (this.user.roleId === 1) {
        this.$router.push('/book/list')
      } else if (this.user.roleId === 2) {
        this.$router.push('/book/all')
      }
    },
    async getRelationBook() {
      const { data: res } = await this.$http.get('book/findRelationBook', { params: { id: this.data.id } })
      this.relationBook = res.data
    },
    async getComments() {
      const { data: res } = await this.$http.get('comment/findByBookId', { params: { id: this.data.id } })
      this.comments = res.data
    },
    async toReview(record) {
      this.data = record
      this.getComments()
      this.getRelationBook()
    },
    toPublishComment() {
      this.$http.post('comment/save', qs.stringify({ content: this.textarea, userId: this.user.id, bookId: this.data.id })).then(res => {
        this.$message.success(res.data.message)
        this.textarea = ''
        this.getComments()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-image {
  float: left;
  width: 320px;
  padding: 0 30px 30px 50px;
}

.book_info {
  float: left;
  width: 330px;
  margin: 0 30px;
}

h2 {
  font-size: 16px;
  line-height: 24px;
  color: #323232;
  list-style-type: none;
  font-weight: 400;
}

.info {
  margin: 15px 0;
  span {
    color: #1a66b3;
  }
}

.price_info {
  margin: 20px 0;
  span {
    color: #e52222;
  }
  .price {
    font-size: 26px;
  }
}

.relation_info {
  float: left;
  width: 200px;
  margin: 20px 15px;
  span {
    color: #646464;
  }
  p {
    cursor: pointer;
    color: #1a66b3;
  }
  p:hover {
    text-decoration: underline;
    color: #e52222;
  }
}

.comment_info {
  clear: both;
  padding: 0 50px;
  margin: 30px 0;
  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-textarea {
    margin-top: 15px;
  }
  .name {
    color: #1a66b3;
  }
}
</style>
