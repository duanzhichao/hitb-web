import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { getStore } from '../utils'
import NProgress from 'nprogress'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    alias: ['/hospitals']
  },
  {
    path: '/library_page',
    name: 'Library',
    component: () => import(/* webpackChunkName: "about" */ '../views/Library.vue'),
    alias: ['/hospitals/library_page']
  },
  {
    path: '/rule_page_drg',
    name: 'RuleDrg',
    component: () => import(/* webpackChunkName: "about" */ '../views/RuleDrg.vue'),
    alias: ['/hospitals/rule_page_drg']
  },
  {
    path: '/rule_page_icd',
    name: 'RuleIcd',
    params: {
      page: '1', code: '8989'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/RuleIcd.vue'),
    alias: ['/hospitals/rule_page_icd']
  },
  {
    path: '/edit_page',
    name: 'Edit',
    component: () => import(/* webpackChunkName: "about" */ '../views/Edit.vue'),
    alias: ['/hospitals/edit_page']
  },
  {
    path: '/edit_search_page',
    name: 'EditSearch',
    component: () => import(/* webpackChunkName: "about" */ '../views/EditSearch.vue'),
    alias: ['/hospitals/edit_search_page']
  },
  {
    path: '/comp_from',
    name: 'CompDrg',
    component: () => import(/* webpackChunkName: "about" */ '../views/CompDrg.vue'),
    alias: ['/hospitals/comp_from']
  },
  {
    path: '/hospitals/stat_page',
    name: 'Stat',
    component: () => import(/* webpackChunkName: "about" */ '../views/Stat.vue'),
    alias: ['/hospitals/stat_page']
  },
  {
    path: '/hospitals/download_page',
    name: 'Download',
    component: () => import(/* webpackChunkName: "about" */ '../views/Download.vue'),
    alias: ['/hospitals/download_page']
  },
  {
    path: '/hospitals/user_page',
    name: 'User',
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue'),
    alias: ['/hospitals/user_page']
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin.vue'),
    alias: ['/hospitals/admin']
  },
  {
    path: '/signup_html',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp.vue'),
    alias: ['/hospitals/signup_html']
  },
  {
    path: '/retrieve_html',
    name: 'Retrieve',
    component: () => import(/* webpackChunkName: "about" */ '../views/Retrieve.vue'),
    alias: ['/hospitals/retrieve_html']
  },
  {
    path: '/login_html',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    alias: ['/hospitals/login_html']
  },
  {
    path: '/create_server_file_page',
    name: 'CreateRuleFile',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateRuleFile.vue'),
    alias: ['/hospitals/create_server_file_page']
  },
  {
    path: '/comp_wt4_page',
    name: 'CompWt4',
    component: () => import(/* webpackChunkName: "about" */ '../views/CompWt4.vue'),
    alias: ['/hospitals/comp_wt4_page']
  },
  {
    path: '/comp_stat_page',
    name: 'CompStat',
    component: () => import(/* webpackChunkName: "about" */ '../views/CompStat.vue'),
    alias: ['/hospitals/comp_stat_page']
  },
  {
    path: '/admin_user_page',
    name: 'UserManage',
    component: () => import(/* webpackChunkName: "about" */ '../views/UserManage.vue'),
    alias: ['/hospitals/admin_user_page']
  },
  {
    path: '/rule_model_page',
    name: 'RuleModel',
    component: () => import(/* webpackChunkName: "about" */ '../views/RuleModel.vue'),
    alias: ['/hospitals/rule_model_page']
  },
  {
    path: '/versions',
    name: 'VersionManage',
    component: () => import(/* webpackChunkName: "about" */ '../views/VersionManage.vue'),
    alias: ['/hospitals/versions']
  },
  {
    path: '/doc',
    name: 'Doc',
    component: () => import(/* webpackChunkName: "about" */ '../views/Doc.vue'),
    alias: ['/hospitals/doc']
  },
  {
    path: '/rule_order_page',
    name: 'RuleOrder',
    component: () => import(/* webpackChunkName: "about" */ '../views/RuleOrder.vue'),
    alias: ['/hospitals/rule_order_page']
  },
  {
    path: '/wechat_login_redirect_html',
    name: 'WechatLoginRedirect',
    component: () => import(/* webpackChunkName: "about" */ '../views/WechatLoginRedirect.vue'),
    alias: ['/hospitals/wechat_login_redirect_html']
  },
  {
    path: '/no_auth',
    name: 'NoAuth',
    component: () => import(/* webpackChunkName: "about" */ '../views/NoAuth.vue'),
    alias: ['/hospitals/no_auth']
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue'),
    alias: ['/hospitals/404']
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let userType = getStore('user_type')
  let userAdmin = getStore('user_admin')
  let username = getStore('login_username')
  userType = userType && userType.toString() == 'null' ? undefined : userType
  userAdmin = userAdmin && userAdmin.toString() == 'null' ? undefined : userAdmin
  username = username && username.toString() == 'null' ? undefined : username
  // 开启进度条
  NProgress.start()
  //
  switch (to.name) {
    //无需登录
    case 'Home':
    case 'SignUp':
    case 'Retrieve':
    case 'Login':
    case 'Doc':
    case 'WechatLoginRedirect':
    case 'NoAuth':
    case '404':
      next()
      break
    //登录即可以查看
    case 'Library':
    case 'CompDrg':
    case 'RuleDrg':
    case 'RuleIcd':
    case 'Stat':
    case 'User':
      if (username != undefined) {
        next()
      } else {
        next({ path: '/hospitals/login_html' })
      }
      break
    //专家权限
    case 'Edit':
    case 'EditSearch':
    case 'Download':
    case 'RuleOrder':
      if (username != undefined && userType == '专家用户') {
        next()
      } else if (username != undefined && userType == '个人用户') {
        next({ path: '/hospitals/no_auth' })
      } else if (username == undefined) {
        next({ path: '/hospitals/login_html' })
      } else {
        next({ path: '/hospitals/login_html' })
      }
      break
    //管理员权限
    case 'Admin':
    case 'CreateRuleFile':
    case 'CompWt4':
    case 'CompStat':
    case 'UserManage':
    case 'RuleModel':
    case 'VersionManage':
      if (username != undefined && userAdmin.toString() == 'true') {
        next()
      } else if (username != undefined) {
        next({ path: '/hospitals/404' })
      } else if (username == undefined) {
        next({ path: '/hospitals/login_html' })
      } else {
        next({ path: '/hospitals' })
      }
      break
    default:
      next({ path: '/hospitals/404' })
      break
  }
  router.afterEach(() => {
    // 关闭进度条
    NProgress.done()
  })
})

export default router
