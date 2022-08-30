<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="stat" :userObj="userObj" />
    <div :style="defaultHeight">
      <el-container style="border: 1px solid #eee">
        <!-- 左侧 -->
        <el-aside width="280px" style="height:700px;background-color: rgb(238, 241, 246);">
          <el-menu :default-active="defaultActive" v-if="defaultActive">
            <a v-for="menu in leftMenus" :href="`/hospitals/stat_page?version=${menu.version}`" style="text-decoration:none" v-bind:key="menu">
              <el-menu-item :index="menu.active">
                <span slot="title">{{menu.title}}</span>
              </el-menu-item>
            </a>
          </el-menu>
        </el-aside>
        <!-- 左侧 -->
        <!-- 内容 -->
        <el-container>
          <!-- div -->
          <el-main>
            <el-row :gutter="20">
              <!-- mdc -->
              <el-col :span="10">
                <el-select v-model="option" placeholder="请选择" style="width: 100%;" @change="changeVersion">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input placeholder="请输入编码或名称以搜索" v-model="searchValue" style="width: 100%;">
                  <template #append>
                    <el-button @click="getData">搜索</el-button>
                  </template>
                </el-input>
              </el-col>
              <el-col :span="4">
                &nbsp;&nbsp;
              </el-col>
            </el-row>
            
            <el-row :gutter="20" style="background-color: #fff;margin-top: 10px;">
              <el-table v-loading="tableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="stat" stripe border style="width: 100%">
                <el-table-column prop="code" label="编码"> </el-table-column>
                <el-table-column prop="name" label="名称"> </el-table-column>
                <el-table-column prop="num_sum" label="病历数"> </el-table-column>
                <el-table-column prop="fee_avg" label="平均费用"> </el-table-column>
                <el-table-column prop="day_avg" label="平均天数"> </el-table-column>
                <el-table-column prop="fee_cv" label="费用变异系数(100%)"> </el-table-column>
                <el-table-column prop="day_cv" label="时间变异系数(100%)"> </el-table-column>
                <el-table-column prop="death_rate_level" label="死亡风险等级"> </el-table-column>
                <el-table-column prop="weight" label="权重"> </el-table-column>
              </el-table>
              <el-pagination
                background
                v-if="stat"
                layout="prev, pager, next"
                @current-change="changePage"
                :page-count="tablePageCount"
                :current-page="page"
                style="margin-top: 10px;margin-bottom: 50px;">
              </el-pagination>
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
import { apiRequest, getDefaultHeight } from '../utils'
export default {
  name: 'CompDrg',
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
      tableLoading: false,
      searchValue: '',
      options: [
        { label: 'MDC', value: 'MDC' },
        { label: 'ADRG', value: 'ADRG' },
        { label: 'DRG', value: 'DRG' },
        { label: '主要诊断(ICD10)', value: 'ICD10' },
        { label: '主要手术(ICD9)', value: 'ICD9' }
      ],
      option: 'ADRG',
      activeNames: ['1'],
      stat: null,
      leftMenus: [],
      version: '',
      defaultHeight: getDefaultHeight(),
      tablePageCount: 0,
      defaultActive: null,
      page: 1
    }
  },
  created: function () {
    const { version } = this.$route.query
    this.version = version ? version : 'rule_bj2019'
    this.getVersions()
    this.getData()
  },
  mounted: function () {
  },
  updated: function () {
  },
  watch: {
  },
  methods: {
    getVersions () {
      apiRequest(this, 'get', `/stat/get_wt4_stat`, { code: '', type: '', data_type: 'version', version: '', page: '' }).then(res => {
        res.forEach((x, i) => {
          i += 1
          this.leftMenus.push({ active: i.toString(), title: x.text, version: x.value })
        })
        this.compMenu()
      })
    },
    changePage (num) {
      this.page = num
      this.getData()
    },
    changeVersion (e) {
      this.option = e
      this.page = 1
      this.tablePageCount = 0
      this.stat = null
      this.getData()
    },
    getData () {
      this.tableLoading = true
      apiRequest(this, 'get', `/stat/get_wt4_stat`, { code: this.searchValue, type: this.option, data_type: 'list', version: this.version, page: this.page }).then(res => {
        setTimeout(() => {
          this.stat = res.data
          this.tablePageCount = res.page_count
          this.tableLoading = false
        }, 2000)
      })
    },
    compMenu() {
      const menus = this.leftMenus
      const menu = menus.filter(x => x.version == this.version)[0]
      this.defaultActive = menu.active
    },
  }
}
</script>