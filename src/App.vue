<template>
  <div id="vueApp" :style="compStyle">
    <router-view/>
  </div>
</template>

<script>
import 'nprogress/nprogress.css'
// window.addEventListener('storage', function () {
//   localStorage.clear()
//   window.location.replace('/');
// })
import { tokenLogin } from './utils'
export default {
  data() {
    return {
      activeIndex: 'index',
      clientWidth: document.body.clientWidth,
      // compStyle: { 'width': '100%', 'overflow': 'hidden' },
      compStyle: { 'width': '100%' }
    }
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj ? this.$store.state.userObj : user
      }
    }
  },
  watch:{
    clientWidth (newWidth, oldVal) {
      if (newWidth <= 1400) {
        this.compStyle = { width: '1400px' }
      } else {
        this.compStyle = { 'width': '100%', 'overflow': 'hidden' }
        this.compStyle = { 'width': '100%', 'overflow-x': 'hidden' }
      }
    }
  },
  mounted () {
    const that = this
    window.onresize =() =>{
      return (()=>{
          window.clientWidth = document.body.clientWidth;
          that.clientWidth = window.clientWidth;
      })()
    }
  },
  beforeCreate: function () {
  },
  created: function () {
    // const { active } = this.$route.query
    tokenLogin(this)
  },
  methods: {
    handleSelect(e) {
      const url = this.menu[e]
      if (e == '6' || e == '7') {
        window.open(url)
        return;
      }
      window.location = url
    }
  }
}
</script>


<style>
#vueApp {
  background: #f8f9fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f8f9fa;
}

#nav {
  color: rgba(0,0,0,.65);
}

#nav a {
  font-weight: bold;
  color: rgba(0,0,0,.65);
}
.header-menu {
  text-decoration:none
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.el-menu--horizontal>.el-menu-item a, .el-menu--horizontal>.el-menu-item{
  color: rgba(0,0,0,.65);
}
#header > div > div.el-col.el-col-15.is-guttered > div > ul > li.el-menu-item.is-active > a
{
  color: #1890ff;
}
</style>
