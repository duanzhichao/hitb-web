<template>
  <div id="nav">
    <header id="header">
      <el-row :gutter="20" class="row-bg" style="height: 60px;">
        <el-col :span="1" style="background-color:#ffffff">
          &nbsp;
        </el-col>
        <el-col :span="8" style="background-color:#ffffff;">
          <a href="/">
            <img style="height: 50px;width: 121px;margin-top: 5px;" src="https://jklf.hitb.com.cn/images/logo1_new.png" />
          </a>
        </el-col>
        <el-col :span="14" style="background-color:#ffffff">
          <el-menu
            style="justify-content: flex-end; margin-right:20px"
            :default-active="activeIndex"
            class="el-menu"
            :collapse="false"
            mode="horizontal"
            @select="handleSelect"
            router>
            <el-menu-item index="index" :route="'/'">
              <a :href="menu.index" class="hitb-menu-a">
                <el-icon><House /></el-icon>
                首页
              </a>
            </el-menu-item>
            <el-menu-item index="library">
              <a :href="menu.library" class="hitb-menu-a">
                <el-icon><collection /></el-icon>
                字典
              </a>
            </el-menu-item>
            <el-menu-item index="rule">
              <a :href="menu.rule" class="hitb-menu-a">
                <el-icon><reading /></el-icon>
                规则
              </a>
            </el-menu-item>
            <el-menu-item index="comp">
              <a :href="menu.comp" class="hitb-menu-a">
                <el-icon><guide /></el-icon>
                分组测试
              </a>
            </el-menu-item>
            <el-menu-item index="edit">
              <a :href="menu.edit" class="hitb-menu-a">
                <el-icon><tickets /></el-icon>
                病案
              </a>
            </el-menu-item>
            <el-menu-item index="stat">
              <a :href="menu.stat" class="hitb-menu-a">
                <el-icon><pie-chart /></el-icon>
                基础分析
              </a>
            </el-menu-item>
            <el-menu-item index="download">
              <a :href="menu.download" class="hitb-menu-a">
                <el-icon><download /></el-icon>
                下载中心
              </a>
            </el-menu-item>
            <el-sub-menu index="2" v-if="userObj.is_success">
              <template #title>
                <el-icon><user /></el-icon>
                {{userObj.user.username}}
              </template>
              <el-menu-item index="user">
                <a :href="menu.user" class="hitb-menu-a">
                  <el-icon><collection-tag /></el-icon>
                  用户中心
                </a>
              </el-menu-item>
              <el-menu-item index="updateRule" v-if="userObj.user.type === '专家用户'">
                <a :href="menu.updateRule" class="hitb-menu-a">
                  <el-icon><finished /></el-icon>
                  规则批量修订
                </a>
              </el-menu-item>
              <el-menu-item index="" v-if="userObj.user.type === '专家用户'">
                <a :href="menu.stat_bj" class="hitb-menu-a" target="_blank">
                  <el-icon><data-analysis /></el-icon>
                  BJ病案分析
                </a>
              </el-menu-item>
              <el-menu-item index="admin" v-if="userObj.user.admin">
                <a :href="menu.admin" class="hitb-menu-a">
                  <el-icon><smoking /></el-icon>
                  管理员
                </a>
              </el-menu-item>
              <el-menu-item index="signout">
                <a :href="menu.signout" class="hitb-menu-a">
                  <el-icon><switch-button /></el-icon>
                  退出登录
                </a>
              </el-menu-item>
            </el-sub-menu>
            
            <el-menu-item index="login" v-else>
              <a :href="menu.login" class="hitb-menu-a">
                <el-icon><user /></el-icon>
                用户
              </a>
            </el-menu-item>

          </el-menu>
        </el-col>
        <el-col :span="1" style="background-color:#ffffff">
          &nbsp;
        </el-col>
      </el-row>
    </header>
  </div>
</template>

<script>
export default {
  name: 'HitbMenu',
  props: {
    activeIndex: {
      type: String,
      required: true,
      default: 'index'
    },
    userObj: {
      type: Object,
      required: true,
      default: {
        is_success: false, user: { type: '', wechat_mp_id: '', subject_bp: '', headimgurl: '', bp: 0, wechat_mp_bind: false, rule_order: false, isupdate_password: true, admin: false, username: '', image_name: '', email: '' }
      }
    }
  },
  data () {
    return {
      menu: {
        'index': '/',
        'rule': '/hospitals/rule_page_drg?page=1&version=Rule2021&title=DRG&active=rule',
        'library': '/hospitals/library_page?&page_type=library&type=icd10&version=rule_gb2020_v2&active=library',
        'edit': '/hospitals/edit_search_page?next_menu=自定义搜索&type=search&code=&page=1&active=edit',
        'comp': '/hospitals/comp_from?active=comp',
        'download': '/hospitals/download_page?active=wt4',
        'comp_wt4_page': '/hospitals/comp_wt4_page?active=comp_wt4_page',
        'comp_stat_page': '/hospitals/comp_stat_page?active=comp_stat_page',
        'keyanpingtai': '/hospitals/keyanpingtai?active=keyanpingtai',
        '6': 'https://jklf.hitb.com.cn/metabase_stat',
        '7': 'http://210.75.199.113/',
        'forum': '/hospitals/forum_page?active=forum',
        'user': '/hospitals/user_page?page=1&active=1',
        'admin2': '/hospitals/admin?active=admin_page',
        'admin': '/hospitals/create_server_file_page',
        'stat': 'stat_page?version=rule_bj2019&active=stat'
      }
    }
  },
  methods: {
    handleSelect (index) {
      window.location = this.menu[index]
    }
  }
}
</script>


<style>
#app {
  font-family: Myriad Pro,PingFang SC,Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f8f9fa;
}

#nav {
  color: rgba(0,0,0,.65);
  margin-bottom: 40px;
  box-shadow: 0 0 20px 0 rgba(0,0,0,.05);
  width: 100%;
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


#header > div > div.el-col.el-col-14.is-guttered > ul > li:hover {
  background-color: unset;
  border-bottom: 2px solid var(--el-menu-active-color);
}

ul > li:hover {
  background-color: unset;
}

.hitb-menu-a {
  text-decoration: none;
  color: var(--el-menu-text-color);
}

</style>