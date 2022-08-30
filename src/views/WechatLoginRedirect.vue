<template>
  <div>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <div :style="defaultHeight">
      <el-row :gutter="10" v-if="loginInfo === '重新登录'" style="margin-top: 200px;">
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="12">
          <el-alert title="您的微信登录已过期,即将跳转重新登录" type="success" effect="dark"></el-alert>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
      </el-row>

      <el-row :gutter="10" v-if="loginInfo === '绑定账号'" style="margin-top: 200px;">
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header">
              <span style="text-align: center;color: #0082ff;font-weight: bold;">请绑定账号</span>
            </div>
            <div v-if="user.error" style="margin-bottom: 5px;margin-top: 5px">
              <el-alert :title="user.errorLog" type="warning" show-icon></el-alert>
            </div>
            <div style="margin-bottom: 5px;margin-top: 5px">
              <el-input :readonly="readonly" @focus="cancel" placeholder="请输入用户名" v-model="user.username" clearable></el-input>
            </div>
            <div style="margin-top: 5px;">
              <el-input :readonly="readonly" @focus="cancel" placeholder="请输入密码" v-model="user.password" show-password></el-input>
            </div>
            <div style="margin-top:5px">
              <vcode @success="captchaonSuccess" @close="onClose" :show="isShowCaptcha"></vcode>
            </div>
            <div style="margin-top: 10px;">
              <el-button type="primary" @click="sumbit()">登录并绑定</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
      </el-row>


      <el-row :gutter="10" v-if="loginInfo === '已绑定'" style="margin-top: 200px;">
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="12">
          <el-alert title="登录成功,即将跳转至首页" type="success" effect="dark"></el-alert>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
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
  components:{
    HitbMenu,
    Vcode
  },
  data () {
    return {
      defaultHeight: getDefaultHeight(),
      isShowCaptcha: true,
      captchaSuccess: false,
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
      captcha: { show: false, html: '' },
      weixin: {
        code: '',
        state: '',
        location: window.location.origin
      },
      wechat: null,
      loginInfo: ''
    }
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
    const { code, state } = this.$route.query
    this.weixin.code = code ? code : ''
    this.weixin.state = state ? state : ''
    this.getState()
  },
  methods: {
    cancel() {
      this.readonly= false;
    },
    getState() {
      apiRequest(this, 'post', '/servers/wechat_login_verify', this.weixin).then(res => {
        this.loginInfo = res.info
        this.wechat = res
        if (res.info === '已绑定') {
          saveStore('login_token', res.userInfo.token)
          saveStore('login_username', res.userInfo.username)
          saveStore('user_type', res.userInfo.type)
          saveStore('user_admin', res.userInfo.admin)
          const userObj = { is_success: true, user: res.userInfo }
          this.$store.commit('set_userObj', userObj)
          setTimeout(function () {
            window.location.href = '/hospitals';
          }, 3000);
        } else if (res.info === '重新登录') {
          setTimeout(function () {
            window.location.href = '/hospitals/login_html';
          }, 3000);
        }
      })
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
      const data = { params: { username: this.user.username, password: this.user.password, captcha: this.user.captcha } }

      apiRequest(this, 'post', `/servers/login/`, data).then(res => {
        switch (res.login) {
          case false:
            this.user.error = true
            this.user.errorLog = res.log
            this.captchaSuccess = false
            break;
          default:
            saveStore('login_token', res.data.token)
            saveStore('login_username', res.data.username)
            saveStore('user_type', res.data.type)
            saveStore('user_admin', res.data.admin)
            const userObj = { is_success: true, user: res.data }
            this.$store.commit('set_userObj', userObj)
            this.update(res.data.id)
            break;
        }
      })
    },
    update (id) {
      const data = { drg_admin_user: { web_wechat_nickname: this.wechat.nickname, web_wechat: this.wechat.open_id, headimgurl: this.wechat.headimgurl } }
      console.log(id)
      apiRequest(this, 'put', `/servers/drg_admin_user/${id}`, data).then(res => {
        if (res.is_success) {
          this.$message({
            message: '绑定成功!3秒后将跳转页面',
            type: 'success'
          });
          setTimeout(function () {
            window.location.href = '/hospitals/';
          }, 3000);
        }
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
    }
  }
}
</script>