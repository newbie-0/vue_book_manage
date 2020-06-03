<template>
  <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <span>书籍管理系统</span>
        <span class="main" @click="toMain">个人主页</span>
        <el-tooltip class="item" effect="dark" content="退出" placement="bottom" :enterable="false">
        <i class="el-icon-switch-button" @click="logout"></i>
        </el-tooltip>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu background-color="#304156" text-color="#BFCBD9"
          active-text-color="#4092D3" router :default-active="$route.path">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
        <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: []
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    toMain() {
      this.$router.push('/main')
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('user/getMenuList')
      if (res.status !== 200) return this.$message.error(res.message)
      this.menuList = res.data
    }
  }
}
</script>

<style land="less" scoped>
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  font-size: 20px;
}

.main {
  cursor: pointer;
}

.el-aside {
  background-color: #304156;
}

.el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}

.el-icon-switch-button {
  cursor: pointer;
}
</style>
