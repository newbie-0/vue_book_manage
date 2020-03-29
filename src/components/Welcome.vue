<template>
  <div>
    <el-card>
      <div class="user_info">
        <h1>Welcome! {{user.realname}}</h1>
        <p>电话号码：<span>{{user.telephone}}</span></p>
        <p>余额：<span>{{user.balance}}</span></p>
      </div>
      <el-image :src="user.userFace"></el-image>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {}
    }
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.user = user
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.el-card {
  height: 520px;
}

.user_info {
  position: relative;
  top: 50px;
  left: 80px;
}

.el-image {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  right: 60px;
  top: 120px;
}
</style>
