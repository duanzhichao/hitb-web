<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="index" :userObj="userObj" />
    <el-row :gutter="20" style="margin-top: 120px;">
      <el-col :span="8">&nbsp;&nbsp;</el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">
            <span style="text-align: center;color: #0082ff;font-weight: bold;">重置密码</span>
          </div>
           <!-- :style="`margin-bottom: ${divMargin};`" -->
          <div v-if="user.error" style="margin-bottom: 3px">
            <el-alert :title="user.errorLog" type="warning" show-icon></el-alert>
          </div>
          <div>
            <div>用户名</div>
            <el-input :readonly="readonly" @focus="cancel" v-model="user.username"></el-input>
          </div>
          <div style="margin-top: 5px;">
            <div>邮箱</div>
            <el-input :readonly="readonly" @focus="cancel" v-model="user.email"></el-input>
          </div>
          <div style="margin-top: 5px;">
            <div>新密码<span style="font-size: 6px;">(密码长度不小于6位且必须含有英文字母)</span></div>
            <el-input :readonly="readonly" @focus="cancel" v-model="user.password" show-password></el-input>
          </div>
          <div style="margin-top: 5px;">
            <div>确认密码</div>
            <el-input :readonly="readonly" @focus="cancel" v-model="user.repassword" show-password></el-input>
          </div>
          <div style="margin-top:10px">
            <vcode @success="captchaonSuccess" @close="onClose" :show="isShowCaptcha"></vcode>
          </div>
          <div style="margin-top: 10px;">
            <el-button type="primary" @click="submit()">确认提交</el-button>
            <el-button type="info" @click="back()">取消</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">&nbsp;</el-col>
    </el-row>

  </div>
</template>
<script>
import Vcode from 'vue3-puzzle-vcode'
import { ref } from 'vue'
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, logOut, saveStore } from '../utils'

// 密码长度不小于6位且必须含有英文字母
const regexpPassword = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/
// 邮箱验证
const regexpEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
// 4-16位数字或字母
const regexpUsername = /^[a-zA-Z0-9_-]{4,16}$/


export default {
  name: 'Retrieve',
  components: {
    HitbMenu,
    Vcode
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj
      }
    }
  },
  data () {
    return {
      isShowCaptcha: true,
      captchaSuccess: false,
      readonly: true,
      articles: [],
      user: {
        username: 'duanzhichao123',
        password: 'dzc944262316',
        email: 'duanzhichao@qq2.com',
        repassword: 'dzc944262316',
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
  // computed: {
  //   divMargin() {
  //     return this.captcha.show ? '3px' : '10px'
  //   }
  // },
  created: function () {
  },
  methods: {
    cancel() {
      this.readonly= false;
    },
    submit() {
      if (this.captchaSuccess == false) {
        this.isShowCaptcha = true
        return true
      }
    },
    captchaonSuccess () {
      this.isShowCaptcha = false;
      this.captchaSuccess = true
      this.getPassword()
    },
    getPassword () {
      // 用户名验证
      if (this.user.username.length === 0) {
        this.user.error = true
        this.user.errorLog = '请输入用户名'
        this.captchaSuccess = false
        return;
      }
      // 邮箱验证
      if (!regexpEmail.test(this.user.email)) {
        this.user.error = true
        this.user.errorLog = '您输入的邮箱有误'
        this.captchaSuccess = false
        return;
      }
      // 密码验证
      if (this.user.password.length === 0 || (this.user.password != this.user.repassword)) {
        this.user.error = true
        this.user.errorLog = '请检查密码'
        this.captchaSuccess = false
        return;
      }
      // 无错误
      this.user.error = false
      this.user.errorLog = ''

      const data = { drg_admin_user: { username: this.user.username, password: this.user.password, confirm: this.user.repassword, email: this.user.email, captcha: this.user.captcha, isupdate_password: true } }
      apiRequest(this, 'post', '/servers/forget_password', data).then(res => {
        if (!res.is_success) {
          this.user.error = true
          this.user.errorLog = res.log
          this.captchaSuccess = false
        } else {
          this.$message({
            message: "密码更新成功,3秒后跳转至登录",
            center: true,
            type: "success"
          });
          setTimeout(function () {
            window.location.href = "/hospitals/login_html";
          }, 3000);
        }
      })
    },
    openCaptcha() {
      this.isShowCaptcha = true
    }
  }
}
</script>