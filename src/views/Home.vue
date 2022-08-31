<template>
  <hitb-menu :activeIndex="activeIndex" :userObj="userObj" />
  <el-row :gutter="20">
    <!-- 左侧列表 -->
    <el-col :span="14" :offset="2">
      <div class="card-header">
        <b>最近更新</b>
      </div>
      <!-- 导航图 -->
      <div class="first-card">
        <el-row :gutter="20">
          <el-col :span="15">
            <div>
              <el-carousel :interval="4000" height="360px">
                <el-carousel-item v-for="item in images" :key="item.src">
                  <div style="line-height:360px">
                    <el-image style="height: 360px;width: 705.6px;" :src="item.src" fit="contain" height="360" ></el-image>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
          <el-col :span="9">
            <div ref="docList" style="width:100%">
              <div v-for="(article, index) in news" :key="index">
                <div class="text item news"
                  style="height: 70px;line-height: 70px;padding: buttom 10px;">
                  <a :href="`/hospitals/doc_page?id=${article.id}`" class="doc href">
                    <span>{{article.title}}</span>
                    <span style="float: right;">{{article.inserted_at}}</span>
                  </a>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <!-- 左侧列表 -->
    <el-col :span="6" v-if="userObj.is_success">
      <div class="card-header">
        <b>用户信息</b>
      </div>
      <div class="first-card">
        <div class="el-table--fit el-table--border el-table--enable-row-transition el-table"
          style="width: 100%;">
          <div class="hidden-columns">
            <div></div>
            <div></div>
          </div>
          <div class="el-table__header-wrapper">
            <table border="0" cellpadding="0" cellspacing="0" class="el-table__header" style="width: 161px;">
              <colgroup>
                <col name="my-el-table_1_column_1">
                <col name="my-el-table_1_column_2">
              </colgroup>
            </table>
          </div>
          <div class="el-table__body-wrapper is-scrolling-none">
            <table class="my-el-table__body" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
              <colgroup>
                <col name="my-el-table_1_column_1">
                <col name="my-el-table_1_column_2">
              </colgroup>
              <tbody>
                <tr class="my-el-table__row">
                  <td class="my-el-table_1_column_1" rowspan="1" colspan="1" style="width: 35%;">
                    <div class="cell"><b>用户名</b></div>
                  </td>
                  <td class="my-el-table_1_column_2" rowspan="1" colspan="1">
                    <div class="cell" style="text-align: right;">{{userObj.user.username}}</div>
                  </td>
                </tr>
                <tr class="my-el-table__row">
                  <td class="my-el-table_1_column_1" rowspan="1" colspan="1" style="width: 35%;">
                    <div class="cell"><b>积分</b></div>
                  </td>
                  <td class="my-el-table_1_column_2" rowspan="1" colspan="1">
                    <div class="cell" style="text-align: right;">{{userObj.user.bp}}</div>
                  </td>
                </tr>
                <tr class="my-el-table__row">
                  <td class="my-el-table_1_column_1" rowspan="1" colspan="1" style="width: 35%;">
                    <div class="cell"><b>用户类型</b></div>
                  </td>
                  <td class="my-el-table_1_column_2" rowspan="1" colspan="1">
                    <div class="cell" style="text-align: right;">{{userObj.user.type}}</div>
                  </td>
                </tr>
                <tr class="my-el-table__row">
                  <td class="my-el-table_1_column_1" rowspan="1" colspan="1" style="width: 35%;">
                    <div class="cell"><b>邮箱</b></div>
                  </td>
                  <td class="my-el-table_1_column_2" rowspan="1" colspan="1">
                    <div class="cell" style="text-align: right;">{{userObj.user.email}}</div>
                  </td>
                </tr>
                <tr class="my-el-table__row">
                  <td class="my-el-table_1_column_1" rowspan="1" colspan="1">
                    <div class="cell"><b>微信</b></div>
                  </td>
                  <td class="my-el-table_1_column_2" rowspan="1" colspan="1">
                    <div class="cell" style="text-align: right;">{{userObj.user.web_wechat_nickname}}</div>
                  </td>
                </tr>
                <tr class="my-el-table__row">
                  <td class="my-el-table_1_column_1" rowspan="1" colspan="1">
                    <div class="cell"><b>规则修改数量</b></div>
                  </td>
                  <td class="my-el-table_1_column_2" rowspan="1" colspan="1">
                    <div class="cell" style="text-align: right;">{{userObj.user.record_count}}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="margin-top:10px">
          <el-button type="primary" @click="logOut()" style="width: 100%;">退出</el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="6" v-else>
      <div class="card-header">
        <b>用户登录</b>
      </div>
      <div class="first-card">
        <el-tabs v-model="loginTab">
          <el-tab-pane label="账号登录" name="first">
            <div v-if="user.error">
              <el-alert :title="user.errorLog" type="warning" show-icon></el-alert>
            </div>
            <div style="margin-top:10px">
              <el-input placeholder="请输入用户名" v-model="user.username" clearable show-message="true" error="sadsa">
              </el-input>
            </div>
            <div style="margin-top:10px">
              <el-input placeholder="请输入密码" v-model="user.password" show-password v-on:keypress.enter="sumbit"></el-input>
            </div>
            <div style="margin-top:10px">
              <vcode @success="captchaonSuccess" @close="onClose" :show="isShowCaptcha"></vcode>
            </div>
            <div style="margin-top:5px">
              <span style="font-size: 10px;">
                <a href="/hospitals/signup_page" style="color:#808080;">立即注册</a>
              </span>
              <span style="font-size: 10px;float: right;">
                <a href="/hospitals/retrieve_page" style="color:#808080;">找回密码</a>
              </span>
            </div>
            <div style="margin-top:5px">
              <el-button type="primary" @click="sumbit()" style="width: 100%;">登录</el-button>
            </div>
            <p :style="`font-size: 10px;color:#808080;text-align:center`">推荐使用微信扫码登录，防止盗号。</p>
          </el-tab-pane>
          <el-tab-pane label="微信扫码登录" name="second">
            <div class="box" id="login_container" style="margin:0 -25px;width:100%">
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="2">&nbsp;</el-col>
    <!-- 左侧列表 -->
    <el-col :span="14">
      <div class="card-header">
        <b>新闻动态</b>
      </div>
      <div class="second-card">
        <div v-for="(article, index) in articles" :key="index" class="text item doc">
          <el-row type="flex" class="row-bg">
            <el-col :span="20">
              <a class="doc href" :href="`/hospitals/doc_page?id=${article.id}`">{{article.title}}</a>
            </el-col>
            <el-col :span="4">{{article.inserted_at}}</el-col>
          </el-row>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card-header">
        <b>其他软件</b>
      </div>

      <div class="second-card">
        <table>
          <tr v-for="item in softData" v-bind:key="item">
            <td style="height: 190px;width:60%;">
              <el-image :style="`height: 133px;width: 133px`" :src="item.image" fit="fill"></el-image>
            </td>
            <td style="height: 190px;width:40%;padding-left:30px;text-align:center">
              <a class="doc href" target="_blank" :href="item.href">{{item.title}}</a>
            </td>
          </tr>
        </table>
      </div>
    </el-col>
    <el-col :span="2">&nbsp;</el-col>
  </el-row>

  <!-- 页尾 -->
  <div style="height: 100px;"></div>
  <el-footer style="background-color: #343a40;color:#a1a3a6;height: 90px;width: 102%;">
    <p class="p1" style="text-align: center;">
      Copyright&copy;jklf.hitb.com.cn&nbsp;&nbsp;ICP证: <a href="https://beian.miit.gov.cn/" target="_blank" style="color:#a1a3a6">京ICP备17063829号-2</a>
    </p>
    <p class="p3" style="text-align: center;">
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802034138" style="display:inline-block;height:20px;line-height:20px;"><img src="https://jklf.hitb.com.cn/images/police_icon.png" style="float:left;"/><span style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 2px;color:#a1a3a6">京公网安备11010802034138号</span></a>
    </p>
    <p class="p2" style="text-align: center;">北京东华万兴软件有限公司</p>
  </el-footer>
</template>

<script>
import Vcode from 'vue3-puzzle-vcode'
import { ref, onMounted } from 'vue'
import wxlogin from 'vue-next-wxlogin'
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, logOut, saveStore, tokenLogin, delStore } from '../utils'

export default {
  name: 'Home',
  components: {
    HitbMenu,
    Vcode,
    wxlogin
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj
      }
    }
  },
  data() {
    return {
      show: false,
      isShow: false,
      activeIndex: 'index',
      isShowCaptcha: false,
      captchaSuccess: false,
      loginTab: 'first',
      articles: [],
      softData: [{
        image: 'https://jklf.hitb.com.cn/static/images/clipalm-wechat1.png',
        title: '掌上医助小程序',
        href: 'https://jklf.hitb.com.cn/static/images/clipalm-wechat1.png'
      }, {
        image: 'https://jklf.hitb.com.cn/static/images/clinet.png',
        title: '健康来福客户端',
        href: '/hospitals/clinet?page_type=comp&active=group'
      }, {
        image: 'https://jklf.hitb.com.cn/static/images/drgserver_logo.png',
        title: 'DRG分组器',
        href: 'https://jklf.hitb.com.cn/drgserver/'
      }],
      news: [1,2,3,4,5],
      user: {
        username: '',
        password: '',
        captcha: '',
        error: false,
        errorLog: ''
      },
      captchaSize: {
        width: '0',
        height: '0'
      },
      captcha: {
        show: false,
        html: ''
      },
      images: [
        { src: 'https://jklf.hitb.com.cn/images/head1.png', redirect: '/hospitals/rule_page_drg?page=1&version=Rule2021&title=DRG' },
        { src: 'https://jklf.hitb.com.cn/images/head2.png', redirect: '/hospitals/edit_page?next_menu=自定义搜索&type=search&code=&page=1' },
        { src: 'https://jklf.hitb.com.cn/images/head3.png', redirect: '/hospitals/comp_from' }
      ],
      headImage: {
        width: 0,
        height: 0
      },
      softwareCardHeight: 0,
      userCardHeight: 0,
      is_show: false
    }
  },
  setup() {
    const isShowCaptcha = ref(false);
    const captchaSuccess = ref(false);

    const onShow = () => {
      isShowCaptcha.value = true;
    };

    const onClose = () => {
      isShowCaptcha.value = false;
    };

    const onSuccess = () => {
      onClose()
      captchaSuccess.value = true;
    };

    return {
      isShowCaptcha,
      onShow,
      onClose,
      onSuccess,
      captchaSuccess
    };
  },
  beforeCreate: function () {
    tokenLogin().then(res => {
      if (!res) {
        return
      }
      this.userObj = res
      this.show = true
      this.createQrCode()
    })
  },
  created: function () {
    this.getArticleList()
    this.getNews()
  },
  mounted: function () {
  },
  updated: function () {
    NProgress.done();
  },
  methods: {
    createQrCode() {
      // if (this.userObj.is_success == false) {
      //   const obj = new WxLogin({
      //     // 如果只是在页面一小块显示二维码，前方不要填true！！官方的我复制过来的时候是true，很坑
      //     self_redirect: false,
      //     // 第三方页面显示二维码的容器id
      //     id: "login_container",
      //     // 只有appid正确，且配置的站点与后台链接站点相同才能正常显示二维码
      //     appid: 'wxb8a3a890a9b8ef5f',
      //     scope: "snsapi_login",
      //     redirect_uri: encodeURIComponent("https://jklf.hitb.com.cn/hospitals/wechat_login_redirect_page"),
      //     state: "aw",
      //     style: "black",
      //     href: 'https://jklf.hitb.com.cn/static/vue3_all/wechat.css'
      //   })
      // }
    },
    getArticleList() {
      const requestObj = { that: this, method: 'get', url: `/servers/doc`, data: { type: '新闻动态' } }
      apiRequest(requestObj).then(res => {
        this.articles = res.data
      })
    },
    getNews() {
      const requestObj = { that: this, method: 'get', url: '/servers/doc', data: { type: '最近更新' } }
      apiRequest(requestObj).then(res => {
        this.news = res.data
      })
    },
    sumbit() {
      if (this.captchaSuccess == false) {
        this.isShowCaptcha = true
        return true
      }
    },
    captchaonSuccess () {
      this.isShowCaptcha = false;
      this.captchaSuccess = true
      this.login()
    },
    login() {
      // 用户名验证
      if (this.user.username.length === 0) {
        this.user.error = this.user.username.length === 0 ? true : false
        this.user.errorLog = this.user.username.length === 0 ? '请输入用户名' : ''
        this.captchaSuccess = false
        return;
      }
      // 密码验证
      if (this.user.password.length === 0) {
        this.user.error = this.user.password.length === 0 ? true : false
        this.user.errorLog = this.user.password.length === 0 ? '请输入密码' : ''
        this.captchaSuccess = false
        return;
      }
      const data = { params: { username: this.user.username, password: this.user.password, captcha: this.user.captcha } }
      const requestObj = { that: this, method: 'post', url: '/servers/login', data: data }
      apiRequest(requestObj).then(res => {
        switch (res.login) {
          case 'update':
            delStore('login_token')
            delStore('login_username')
            delStore('user_type')
            delStore('user_admin')
            this.$message({ message: '您的账号需要重置密码,3秒后跳转至重置密码!', type: 'warning' });
            setTimeout(function () {
              window.location.href = '/hospitals/retrieve_page';
            }, 3000);
            break;
          case false:
            delStore('login_token')
            delStore('login_username')
            delStore('user_type')
            delStore('user_admin')
            this.user.error = true
            this.user.errorLog = res.msg
            this.captchaSuccess = false
            break;
          default:
            saveStore('login_token', res.user.token)
            saveStore('login_username', res.user.username)
            saveStore('user_type', res.user.type)
            saveStore('user_admin', res.user.admin)
            window.location.href = '/hospitals'
            break;
        }
      })
    },
    logOut() {
      delStore('login_token')
      delStore('login_username')
      delStore('user_type')
      delStore('user_admin')
      window.location = "/hospitals/"
    }
  }
}
</script>

<style scoped>

.vue-auth-box_ {
  position:absolute;
  top: 30%;
  left: 80%;
}
strong:hover {
  color: #0082ff;
}
#body div footer p.p1 a {
  color:#a1a3a6;
  text-decoration:none;
}
#body div footer p.p1 a:hover {
  color:#fff;
  text-decoration:none;
}
#body div footer p.p3 a {
  color:#a1a3a6;
  text-decoration:none;
}
#body div footer p.p3 a:hover {
  color:#fff;
  text-decoration:none;
}
strong {
  color: #6c747d;
}

.el-card__body {
  padding-top: 8px;
}

.text.item.doc {
  color: #6c747d;
  padding: 12px;
  /* margin: 10px; */
  border-bottom: 1px solid rgb(222, 226, 230);
}

.text.item.news {
  color: #6c747d;
  border-bottom: 1px solid rgb(222, 226, 230);
  padding-left: 0px;
  padding-right: 8px
}

.text.item.user {
  padding: 12px;
  /* margin: 10px; */
  border-bottom: 1px solid rgb(222, 226, 230);
}

.doc.href {
  color: #6c747d;
  text-decoration: none;
}

.row-bg.user {
  border: 1px solid rgb(222, 226, 230);
}

.p1 {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  margin: 0px;
  padding: 0px;
}

.p2 {
  height: 20px;
  line-height: 30px;
  font-size: 12px;
  margin: 0px;
  padding: 0px;
}

.p3 {
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  margin: 0px;
  padding: 0px;
}


.user-info-table-left {
  margin: 0px;
  padding: 10px;
  border-top: 1px solid #dee2e6;
  border-left: 1px solid #dee2e6;
  width: 50%;
}

.user-info-table-right {
  margin: 0px;
  padding: 10px;
  border-top: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  width: 50%;
}

.card-header {
  background: #0082ff;
  height: 50px;
  margin: 10px 0;
  border-radius: 6px;
  padding: 0px 16px;
  line-height: 50px;
  color: #ffffff;
}

/* .el-carousel__container {
  height: 360px;
} */

.first-card {
  height: 360px;
  background-color: white;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 4px;
  overflow: hidden;
}

.second-card {
  height: 570px;
  background-color: white;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 4px;
  overflow: hidden;
}

.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
  border-right: none;
}

.my-el-table-body {
  font-size: 14px;
  color: #606266;
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  -webkit-border-horizontal-spacing: 0px;
  -webkit-border-vertical-spacing: 0px;
  table-layout: fixed;
  border-collapse: separate;
  width: 100%;
}

.my-el-table__row {
  font-size: 14px;
  color: #606266;
  border-collapse: separate;
  background-color: #FFF;
}

.my-el-table_1_column_1 {
  font-size: 14px;
  color: #606266;
  border-collapse: separate;
  position: relative;
  vertical-align: middle;
  padding: 12px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  text-align: left;
  border-bottom: 1px solid #EBEEF5;
  border-right: none;
  transition: background-color .25s ease;
  width: 35%;
}

.my-el-table_1_column_2 {
  font-size: 14px;
  color: #606266;
  border-collapse: separate;
  position: relative;
  vertical-align: middle;
  padding: 12px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  text-align: left;
  border-bottom: 1px solid #EBEEF5;
  border-right: none;
  transition: background-color .25s ease;
}

.card-header {
  background: #0082ff;
  height: 50px;
  margin: 10px 0;
  border-radius: 6px;
  padding: 0px 16px;
  line-height: 50px;
  color: #ffffff;
}
</style>