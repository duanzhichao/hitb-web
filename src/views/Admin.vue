<template>
  <div>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <admin-left-menu activeIndex="admin" :userObj="userObj">
      <div>
        <el-row :gutter="20">
          <el-col :span="6" style="margin-top: 200px;">
            <div>
              <el-card class="box-card">
                <div style="text-align:center;"><b>生成分组规则文件</b></div>
                <div style="margin-top: 10px;text-align:center">
                  <el-button type="primary" @click="redridert('/hospitals/create_server_file_page')" style="width: 150px;height: 60px;">生成分组规则文件</el-button>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6" style="margin-top: 200px;">
            <el-card class="box-card">
              <div style="text-align:center;"><b>分组计算</b></div>
              <div style="margin-top: 10px;text-align:center">
                <el-button type="success" @click="redridert('/hospitals/comp_wt4_page')" style="width: 150px;height: 60px;">分组计算</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 200px;">
            <el-card class="box-card">
              <div style="text-align:center;"><b>分析计算</b></div>
              <div style="margin-top: 10px;text-align:center">
                <el-button type="info" @click="redridert('/hospitals/comp_stat_page')" style="width: 150px;height: 60px;">分析计算</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 200px;">
            <el-card class="box-card">
              <div style="text-align:center;"><b>用户管理</b></div>
              <div style="margin-top: 10px;text-align:center">
                <el-button type="danger" @click="redridert('/hospitals/admin_user_page')" style="width: 150px;height: 60px;">用户管理</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div style="text-align:center;"><b>模型管理</b></div>
              <div style="margin-top: 10px;text-align:center">
                <el-button type="danger" @click="redridert('/rule_model_page')" style="width: 150px;height: 60px;">模型管理</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </admin-left-menu>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import AdminLeftMenu from '../components/AdminLeftMenu.vue'
import { getDefaultHeight } from '../utils'

export default {
  name: 'Admin',
  components: {
    HitbMenu,
    AdminLeftMenu
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
  },
  methods: {
    redridert (url) {
      window.open(url)
    },
  }
}
</script>