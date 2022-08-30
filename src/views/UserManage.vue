<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <admin-left-menu activeIndex="user" :userObj="userObj">
      <el-table
        :data="user"
        stripe
        border
        @row-click="info"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="type"
          label="用户类型">
        </el-table-column>
        <el-table-column
          prop="wechat_mp_bind"
          label="小程序绑定">
        </el-table-column>
        <el-table-column
          prop="wechat_mp_id"
          label="小程序id">
        </el-table-column>
        <el-table-column
          prop="wechat_mp_user_info"
          label="小程序用户信息">
        </el-table-column>
        <el-table-column
          prop="inserted_at"
          label="创建时间">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="user"
        layout="prev, pager, next"
        @current-change="changePage"
        :page-count="pageCount"
        :current-page="page"
        style="margin-top: 10px;margin-bottom: 50px;">
      </el-pagination>
    </admin-left-menu>
    <el-dialog title="用户详情" v-model="dialogTableVisible">
      <div v-if="userDetail">
        <table style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
          <tr>
            <th class="wt4-info-table-left">用户名</th>
            <td class="wt4-info-table-right">{{userDetail.username}}</td>
          </tr>
          <tr>
            <th class="wt4-info-table-left">用户类型</th>
            <td class="wt4-info-table-right">{{userDetail.type}}</td>
          </tr>
          <tr>
            <th class="wt4-info-table-left">小程序绑定</th>
            <td class="wt4-info-table-right">{{userDetail.wechat_mp_bind}}</td>
          </tr>
          <tr>
            <th class="wt4-info-table-left">小程序id</th>
            <td class="wt4-info-table-right">{{userDetail.wechat_mp_id}}</td>
          </tr>
          <tr>
            <th class="wt4-info-table-left">创建时间</th>
            <td class="wt4-info-table-right">{{userDetail.inserted_at}}</td>
          </tr>
          <tr>
            <th class="wt4-info-table-left">小程序昵称</th>
            <td class="wt4-info-table-right">{{userDetail.wechat_mp_user_info.nickName}}</td>
          </tr>
          <tr>
            <th class="wt4-info-table-left">小程序地区</th>
            <td class="wt4-info-table-right">{{userDetail.wechat_mp_user_info.country}}-{{userDetail.wechat_mp_user_info.province}}-{{userDetail.wechat_mp_user_info.city}}</td>
          </tr>
          <tr>
            <th class="wt4-info-table-left">小程序头像</th>
            <td class="wt4-info-table-right">
              <el-image fit="fill" :src="userDetail.wechat_mp_user_info.avatarUrl"></el-image>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import AdminLeftMenu from '../components/AdminLeftMenu.vue'
import { apiRequest, getDefaultHeight } from '../utils'
export default {
  name: 'UserManage',
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
      user: null,
      userDetail: null,
      dialogTableVisible: false,
      pageCount: 0,
      page: 1
    }
  },
  created: function () {
    this.users()
  },
  methods: {
    users () {
      apiRequest(null, 'get', '/get_user_info', { page: this.page }).then(res => {
        this.user = res.data
        this.pageCount = res.page_count
      })
    },
    info(row, column, event) {
      this.userDetail = row
      this.dialogTableVisible = true
    },
    changePage (num) {
      this.page = num
      this.users()
    }
  }
}
</script>