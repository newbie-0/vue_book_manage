import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import BookList from '../components/book/List.vue'
import All from '../components/book/All.vue'
import Add from '../components/book/Add.vue'
import CheckList from '../components/book/CheckList.vue'
import CategoryList from '../components/category/List.vue'
import Info from '../components/book/Info.vue'
import NotFound from '../components/error/404.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login, meta: { title: '登录界面' } },
    { path: '/', redirect: '/login' },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome, meta: { title: '欢迎界面' } },
        { path: '/book/list', component: BookList, meta: { title: '书籍列表' } },
        { path: '/book/all', component: All, meta: { title: '书籍管理' } },
        { path: '/book/add', component: Add, meta: { title: '书籍管理' } },
        { path: '/book/checkList', component: CheckList, meta: { title: '书籍审核' } },
        { path: '/category/list', component: CategoryList, meta: { title: '分类列表' } },
        { path: '/book/info', component: Info, meta: { title: '书籍详细信息' } }
      ]
    },
    { path: '*', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //      next() 放行       next('/login')  强制跳转
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
