<template>
  <hitb-menu activeIndex="admin" :userObj="userObj" />
  <admin-left-menu activeIndex="versions" :userObj="userObj">
    <el-table
      :data="versionsData"
      stripe
      border
      @row-click="info"
      style="width: 100%">
      <el-table-column
        prop="text"
        label="text">
      </el-table-column>
      <el-table-column
        prop="value"
        label="版本代号">
      </el-table-column>
      <el-table-column label="是否可修改规则">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.change">{{scope.row.change}}</el-tag>
          <el-tag type="danger" v-else>{{scope.row.change}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="如果不是专家是否可以查看">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.if_not_expert">{{scope.row.if_not_expert}}</el-tag>
          <el-tag type="danger" v-else>{{scope.row.if_not_expert}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否作为分组器">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.as_server">{{scope.row.as_server}}</el-tag>
          <el-tag type="danger" v-else>{{scope.row.as_server}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否可下载">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.can_download">{{scope.row.can_download}}</el-tag>
          <el-tag type="danger" v-else>{{scope.row.can_download}}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      v-if="versionsData"
      layout="prev, pager, next"
      @current-change="changePage"
      :page-count="pageCount"
      :current-page="page"
      style="margin-top: 10px;margin-bottom: 50px;">
    </el-pagination>
  </admin-left-menu>
  <el-dialog title="版本详情" v-model="dialogTableVisible">
    <div v-if="versionDetail">
      <el-form label-width="30%">
        <el-form-item label="text">
          <el-input v-model="versionDetail.text"></el-input>
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="versionDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="版本代号">
          <el-input v-model="versionDetail.value"></el-input>
        </el-form-item>
        <el-form-item label="是否可修改规则">
          <el-switch v-model="versionDetail.change"></el-switch>
        </el-form-item>
        <el-form-item label="如果不是专家是否可以查看">
          <el-switch v-model="versionDetail.if_not_expert"></el-switch>
        </el-form-item>
        <el-form-item label="是否作为可测试分组器">
          <el-switch v-model="versionDetail.as_server"></el-switch>
        </el-form-item>
        <el-form-item label="字典是否可使用ets转换">
          <el-switch v-model="versionDetail.library_can_convert"></el-switch>
        </el-form-item>
        <el-form-item label="字典是否可下载">
          <el-switch v-model="versionDetail.can_download"></el-switch>
        </el-form-item>
        <el-form-item label="版本描述提示">
          <el-input v-model="versionDetail.server_code_info"></el-input>
        </el-form-item>
        <el-form-item label="MDC表模块">
          <el-input v-model="versionDetail.mdc_module"></el-input>
        </el-form-item>
        <el-form-item label="ADRG表模块">
          <el-input v-model="versionDetail.adrg_module"></el-input>
        </el-form-item>
        <el-form-item label="DRG表模块">
          <el-input v-model="versionDetail.drg_module"></el-input>
        </el-form-item>
        <el-form-item label="ICD10表模块">
          <el-input v-model="versionDetail.icd10_module"></el-input>
        </el-form-item>
        <el-form-item label="ICD9表模块">
          <el-input v-model="versionDetail.icd9_module"></el-input>
        </el-form-item>
        <el-form-item label="ICD10字典模块">
          <el-input v-model="versionDetail.library_icd10_module"></el-input>
        </el-form-item>
        <el-form-item label="ICD9字典模块">
          <el-input v-model="versionDetail.library_icd9_module"></el-input>
        </el-form-item>
        <el-form-item label="icd10的ets名称">
          <el-input v-model="versionDetail.library_icd10_atom"></el-input>
        </el-form-item>
        <el-form-item label="icd9的ets名称">
          <el-input v-model="versionDetail.library_icd9_atom"></el-input>
        </el-form-item>
        <el-form-item label="drg的ets名称">
          <el-input v-model="versionDetail.rule_drg_atom"></el-input>
        </el-form-item>
        <el-form-item label="分组器icd10字典信息">
          <el-input v-model="versionDetail.library_icd10_info"></el-input>
        </el-form-item>
        <el-form-item label="分组器icd9字典信息">
          <el-input v-model="versionDetail.library_icd9_info"></el-input>
        </el-form-item>
        <el-button type="primary" v-on:click="submit">保存</el-button>
      </el-form>
    </div>
  </el-dialog>
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
      versionsData: null,
      versionDetail: null,
      dialogTableVisible: false,
      pageCount: 0,
      page: 1
    }
  },
  created: function () {
    this.getVersions()
  },
  methods: {
    getVersions () {
      apiRequest(null, 'get', '/library/drgserver_version', { page: this.page }).then(res => {
        this.versionsData = res.data
        this.pageCount = res.page_count
      })
    },
    info(row, column, event) {
      this.versionDetail = row
      this.dialogTableVisible = true
    },
    changePage (num) {
      this.page = num
      this.getVersions()
    },
    submit () {
      apiRequest(this, 'put', `/library/drgserver_version/${this.versionDetail.id}`, { params: this.versionDetail }).then(res => {
        if (res.data) {
          this.versionsData = null
          this.dialogTableVisible = false
          this.getVersions()
        }
      })
    }
  }
}
</script>