<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="index" :userObj="userObj" />
    <div :style="defaultHeight">
      <el-row :gutter="20" style="margin-top: 200px;">
        <el-col :span="8">&nbsp;&nbsp;</el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header">
              <span style="text-align: center;color: #0082ff;font-weight: bold;">请登录您的账户</span>
            </div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="账号登录" name="first">
                <div v-if="user.error" style="margin-bottom: 3px">
                  <el-alert :title="user.errorLog" type="warning" show-icon></el-alert>
                </div>
                <div>
                  <el-input :readonly="readonly" @focus="cancel" placeholder="请输入用户名" v-model="user.username" clearable></el-input>
                </div>
                <div style="margin-top: 5px;">
                  <el-input :readonly="readonly" @focus="cancel" placeholder="请输入密码" v-model="user.password" show-password></el-input>
                </div>
                <div style="margin-top:10px">
                  <vcode @success="captchaonSuccess" @close="onClose" :show="isShowCaptcha"></vcode>
                </div>

                <div style="margin-top: 5px;padding-left: 4px;">
                  <span style="font-size: 12px;">
                    <a href="/signup_html" style="color:#808080;">立即注册</a>
                  </span>
                  <span style="font-size: 12px;float: right;">
                    <a href="/retrieve_html" style="color:#808080;">找回密码</a>
                  </span>
                </div>

                <div style="margin-top: 10px;">
                  <el-button type="primary" @click="sumbit()">登录</el-button>
                  <el-button type="info" @click="getCaptcha('signup');dialogFormVisible = true">注册</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="微信扫码登录" name="second" style="text-align:center" >
                  <div class="box" id="login_container" style="height: 220px;margin:0 auto"></div>
              </el-tab-pane>
            </el-tabs>
            
          </el-card>
        </el-col>
        <el-col :span="8">&nbsp;</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Vcode from 'vue3-puzzle-vcode'
import { ref } from 'vue'
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, getDefaultHeight, saveStore } from '../utils'
export default {
  name: 'Login',
  components: {
    HitbMenu,
    Vcode
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj
      }
    },
    divMargin: {
      get() {
        return this.captcha.show ? '3px' : '10px'
      }
    }
  },
  data () {
    return {
      defaultHeight: getDefaultHeight(),
      isShowCaptcha: true,
      captchaSuccess: false,
      activeName: 'first',
      readonly: true,
      articles: [],
      user: {
        username: '',
        password: '',
        captcha: '',
        error: false,
        errorLog: ''
      },
      captchaSize: { width: '0', height: '0' },
      captcha: { show: false, html: '' }
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
  created: function () {
  },
  mounted: function () {
    this.createQrCode()
  },
  methods: {
    createQrCode() {
      const obj = new WxLogin({
        // 如果只是在页面一小块显示二维码，前方不要填true！！官方的我复制过来的时候是true，很坑
        self_redirect: false,
        // 第三方页面显示二维码的容器id
        id: "login_container",
        // 只有appid正确，且配置的站点与后台链接站点相同才能正常显示二维码
        appid: 'wxb8a3a890a9b8ef5f',
        scope: "snsapi_login",
        redirect_uri: encodeURIComponent("https://jklf.hitb.com.cn/hospitals/wechat_login_redirect_html"),
        state: "aw",
        style: "black",
        href: 'https://jklf.hitb.com.cn/static/vue3_all/wechat.css'
      })
    },
    cancel() {
      this.readonly= false;
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
    login () {
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
      if (this.captchaSuccess) {
        this.user.error = false
        this.user.errorLog = ''
        this.captchaSuccess = false
      } else {
        this.user.error = true
        this.user.errorLog = '请点击验证码验证'
        this.captchaSuccess = false
        return;
      }
      const data = { params: { username: this.user.username, password: this.user.password, captcha: this.user.captcha } }
      apiRequest(this, 'post', '/servers/login', data).then(res => {
        switch (res.login) {
          case 'update':
            setTimeout(function () {
              window.location.href = '/hospitals/retrieve_html';
            }, 3000);
            break;
          case false:
            this.user.error = true
            this.user.errorLog = res.log
            this.captchaSuccess = false
            this.$store.commit('clear_userObj')
            break;
          default:
            saveStore('login_token', res.data.token)
            saveStore('login_username', res.data.username)
            saveStore('user_type', res.data.type)
            saveStore('user_admin', res.data.admin)
            const userObj = { is_success: true, user: res.data }
            this.$store.commit('set_userObj', userObj)
            window.location.href = '/hospitals'
            break;
        }
      })
    },
    openCaptcha() {
      this.isShowCaptcha = true
    }
  }
}
</script>