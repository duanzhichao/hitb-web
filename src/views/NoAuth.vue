<template>
  <div v-cloak>
    <hitb-menu activeIndex="" :userObj="userObj" />
    <div :style="defaultHeight">
        <p class="centerDiv">
          <span>您没有权限访问此页面,3秒钟之后自动返回上一页</span>
        </p>
    </div>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { getDefaultHeight } from '../utils'

export default {
  name: 'NoAuth',
  components: {
    HitbMenu
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
      defaultHeight: getDefaultHeight(),
      username: this.userObj ? this.userObj.user.username : ''
    }
  },
  created: function () {
    this.back()
  },
  methods: {
    back () {
      setTimeout(function () {
        window.history.go(-1)
      }, 3000)
    }
  }
}
</script>
<style scoped>
.centerDiv {
  margin: 200px auto 0 auto;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 300px;
  text-align: center;
  border-radius: 10px;
  background: var(--el-color-primary-light-9);
}
.centerDiv > span {
  color: var(--el-color-primary);
  font-weight: bold;
  line-height: 300px;
  text-align: center;
  user-select:none;
  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  -khtml-user-select:none;
}

</style>