<template>
  <div>
    <hitb-menu activeIndex="rule" :userObj="userObj" />
    <div :style="defaultHeight">
      <el-container style="border: 1px solid #eee">
        <!-- 左侧 -->
        <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
          <el-menu class="el-menu-vertical" v-if="defaultOpeneds.length > 0" :default-openeds="defaultOpeneds" :default-active="defaultActive" >
            <el-sub-menu v-for="(menu, index) in leftMenus" :index="menu.opened" v-bind:key="index">
              <template #title>
                <span>{{menu.title}}</span>
              </template>
              <el-menu-item-group>
                <a :href="`/hospitals/rule_page_drg?page=1&version=${menu.version}&title=DRG&code=`" style="text-decoration:none">
                  <el-menu-item :index="menu.DRG">DRG</el-menu-item>
                </a>
                <a :href="`/hospitals/rule_page_icd?page=1&version=${menu.version}&title=ICD10&code=`" style="text-decoration:none">
                    <el-menu-item :index="menu.ICD10">ICD10</el-menu-item>
                </a>
                <a :href="`/hospitals/rule_page_icd?page=1&version=${menu.version}&title=ICD9&code=`" style="text-decoration:none">
                  <el-menu-item :index="menu.ICD9">ICD9</el-menu-item>
                </a>
                <a :href="`/hospitals/rule_order_page?&version=${menu.version}&title=DRG入组排序`" style="text-decoration:none" v-if="userObj && userObj.user.username != '' && userObj.user.type == '专家用户' && userObj.user.rule_order">
                  <el-menu-item :index="menu.DRG入组排序">DRG入组排序</el-menu-item>
                </a>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <!-- 左侧 -->
        <!-- 内容 -->
        <el-container>
          <!-- div -->
          <el-main>
            <el-row :gutter="20" style="margin-top:10px">
              <!-- mdc -->
              <el-col :span="8">
                <el-table
                  v-if="mdc.data"
                  :data="mdc.data"
                  height="400"
                  border
                  highlight-current-row
                  @row-click="click"
                  style="width: 100%">
                  <el-table-column prop="code" label="编码" width="180"></el-table-column>
                  <el-table-column prop="name" label="名称" width="340"></el-table-column>
                </el-table>
              </el-col>
              <!-- mdc -->
              <!-- adrg -->
              <el-col :span="8">
                <el-table
                  v-if="adrg.data"
                  :data="adrg.data"
                  height="400"
                  border
                  highlight-current-row
                  @row-click="click"
                  style="width: 100%">
                  <el-table-column prop="code" label="编码" width="180"></el-table-column>
                  <el-table-column prop="name" label="名称" width="340"></el-table-column>
                </el-table>
              </el-col>
              <!-- adrg -->
              <!-- drg -->
              <el-col :span="8">
                <el-table
                  v-if="drg.data"
                  :data="drg.data"
                  height="400"
                  border
                  highlight-current-row
                  @row-click="click"
                  style="width: 100%">
                  <el-table-column prop="code" label="编码" width="180"></el-table-column>
                  <el-table-column prop="name" label="名称" width="340"></el-table-column>
                </el-table>
              </el-col>
              <!-- drg -->
              <!-- info -->
              <el-col :span="24" style="margin-top: 15px;" v-if="info.row">
                <el-tabs type="border-card" v-model="info.activeTab">
                  <el-tab-pane label="规则详情" name="规则详情">
                      <table border="1px" class="rule-info-table" cellpadding="12px" cellspacing="0">
                        <tr v-for="i in info.row.web_info_rule" v-bind:key="i">
                          <td>{{i.header}}</td><td>{{i.data}}</td>
                        </tr>
                      </table>
                  </el-tab-pane>
                  <el-tab-pane v-for="(rule, index) in info.row.web_comp_rule" :label="`${rule.header} ${rule.data.length}`" v-bind:key="index">
                    <div style="margin-top: 15px;">
                      <div v-if="userObj && userObj.user.type == '专家用户'">
                        <el-row :gutter="2" v-if="['非QY小手术', '主要手术', '其他手术', '主要诊断', '其他诊断'].includes(rule.header)">
                          <el-col :span="18">
                            <el-input placeholder="请输入内容" v-model="codeInput"> </el-input>
                          </el-col>
                          <el-col :span="6">
                            
                            <el-button-group>
                              <el-button type="success" v-on:click="searchPage(rule.data)">搜索以下规则</el-button>
                              <el-button type="primary" v-on:click="updateRule(`添加${rule.header}`, index)">添加规则</el-button>
                              <el-button type="danger" v-on:click="updateRule(`删除${rule.header}`, index)">删除规则</el-button>
                            </el-button-group>
                          </el-col>
                        </el-row>
                      </div>
                      <el-row :gutter="20">
                        <el-col :span="6" v-for="(x, index) in rule.data" style="margin-top: 30px;" v-bind:key="index"><span v-bind:class="info.index == index ? 'table-primary' : ''" v-on:click="info.index = index;codeInput = x">{{x}}</span></el-col>
                      </el-row>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
              <!-- info -->
            </el-row>
          </el-main>
          <!-- div -->
        </el-container>
        <!-- 内容 -->
      </el-container>
    </div>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, compMenu, getDefaultHeight } from '../utils'

export default {
  name: 'RuleDrg',
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
      leftMenus: [],
      defaultOpeneds: [],
      defaultActive: '',
      version: 'Rule2021',
      title: 'DRG',
      defaultHeight: getDefaultHeight(),
      codeInput: '',
      mdc: { data: null, loading: false },
      adrg: { data: null, loading: false },
      drg: { data: null, loading: false },
      info: { row: null, activeTab: '规则详情', index: -1 }
    }
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj
      }
    }
  },
  beforeMount: function () {
  },
  created: function () {
    const { version, tilte } = this.$route.query
    this.version = version ? version : 'Rule2021'
    this.tilte = tilte ? tilte : 'DRG'
    this.getMdc()
    this.getVersions()
  },
  mounted: function () {
  },
  updated: function () {
  },
  methods: {
    getVersions () {
      apiRequest(null, 'get', '/library/get_all_version?type=rule_menu_version', null).then(res => {
        const a = []
        res.versions.forEach((x, i) => {
          // this.leftMenus.push({ opened: `${i + 1}`, DRG: `${i + 1}-1`, ICD10: `${i + 1}-2`, ICD9: `${i + 1}-3`, DRG入组排序: `${i + 1}-4`, title: x.text, version: x.value })
          a.push({ opened: `${i + 1}`, DRG: `${i + 1}-1`, ICD10: `${i + 1}-2`, ICD9: `${i + 1}-3`, DRG入组排序: `${i + 1}-4`, title: x.text, version: x.value })
        });
        this.leftMenus = a
        const {defaultOpeneds, defaultActive} = compMenu(this.leftMenus, this.version, this.title)
        this.defaultOpeneds = defaultOpeneds
        this.defaultActive = defaultActive
      })
    },
    getMdc () {
      this.mdc.loading = []
      this.mdc.loading = true
      const url = `/library/rule_mdc?plat=client&version=${this.version}`
      apiRequest(this, 'get', url, null).then(res => {
        this.mdc.data = res.data
      })
    },
    getAdrg (code) {
      this.adrg.loading = []
      this.adrg.loading = true
      const url = `/library/rule_adrg?plat=client&version=${this.version}&code=${code}`
      apiRequest(this, 'get', url, null).then(res => {
        this.adrg.data = res.data
      })
    },
    getDrg (code) {
      this.drg.loading = []
      this.drg.loading = true
      const url = `/library/rule_drg?plat=client&version=${this.version}&code=${code}`
      apiRequest(this, 'get', url, null).then(res => {
        this.drg.data = res.data
      })
    },
    click (row, column, event) {
      switch (column.id) {
        case 'el-table_1_column_2':
        case 'el-table_1_column_1':
          this.getAdrg(row.mdc)
          break;
        case 'el-table_2_column_3':
        case 'el-table_2_column_4':
          this.getDrg(row.code)
          break;
        default:
          break;
      }
      this.codeInput = ''
      this.info.activeTab = '规则详情'
      this.info.row = row
    },
    searchPage (data) {
      data.forEach((x, i) => {
        if (x.indexOf(this.codeInput) >= 0) {
          this.info.index = i
        }
      })
    },
    updateRule (mode) {
      let url, ruleType;
      if (mode == '添加非QY小手术' || mode == '删除非QY小手术') {
        url = `/library/rule_mdc/${this.info.data.id}`
      } else {
        url = `/library/rule_adrg/${this.info.data.id}`
      }
      if (mode == '添加主要诊断' || mode == '添加其他诊断' || mode == '删除主要诊断' || mode == '删除其他诊断') {
        ruleType = 'icd10'
      } else {
        ruleType = 'icd9'
      }
      // 验证输入框
      if (this.codeInput === '') {
        this.$message({ message: '请检查规则!', type: 'warning' });
        return true
      }
      // 规则操作
      this.$confirm(`您确定要${mode}\n 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sumbitRule(mode, ruleType, url)
      });
    },
    sumbitRule (mode, ruleType, url) {
      const data = { mode: mode, code: this.codeInput, version: this.version, rule_type: ruleType }
      apiRequest(this, 'put', url, data).then(res => {
        if (!res.is_success) {
          this.$message({ message: res.info, type: 'error' });
          return
        }
        this.info.data.tab_rule = res.data.tab_rule
        this.$message({ message: '您的修订已成功', type: 'success' });
      })
    }
  }
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 200px;
  }

  .el-container {
    /*设置内部填充为0，几个布局元素之间没有间距*/
    padding: 0px;
     /*外部间距也是如此设置*/
    margin: 0px;
    /*统一设置高度为100%*/
    height: 100%;
  }

  .table-primary {
    background-color: #0082ff;
    color: aliceblue;
  }

  .rule-info-table {
    border: 1px solid #e9e0e0
  }

  /* 按钮 */
  .el-input-group__append button.el-button {
    background: #5daf34;
    border-color: #5daf34;
    color: #FFF;
  }
</style>