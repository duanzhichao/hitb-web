<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <admin-left-menu activeIndex="model" :userObj="userObj">
      <el-table
        :data="ruleModels"
        stripe
        border
        @row-click="info"
        style="width: 100%">
        <el-table-column
          prop="model"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="info"
          label="描述">
        </el-table-column>
      </el-table>

      <el-pagination
        background
        v-if="ruleModels"
        layout="prev, pager, next"
        @current-change="changePage"
        :page-count="pageCount"
        :current-page="page"
        style="margin-top: 10px;margin-bottom: 50px;">
      </el-pagination>
    </admin-left-menu>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import AdminLeftMenu from '../components/AdminLeftMenu.vue'
import { apiRequest, getDefaultHeight } from '../utils'
export default {
  name: 'RuleModel',
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
      ruleModels: null,
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
      apiRequest(null, 'get', '/library/all_rule_model', { page: this.page }).then(res => {
        this.ruleModels = res.data
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