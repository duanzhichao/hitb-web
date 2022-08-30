<template>
  <div>
    <hitb-menu activeIndex="library" :userObj="userObj" />
    <div id="body" v-cloak>
      <div :style="defaultHeight">
        <el-container style="border: 1px solid #eee">
          <!-- 左侧 -->
          <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-active="defaultActive">
              <a v-for="menu in leftMenus" :href="`/hospitals/library_page?type=${menu.type}`" style="text-decoration:none" v-bind:key="menu">
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
              <el-row :gutter="10" style="margin-top:10px" v-if="type !== 'convert'">
                <el-col :span="4">
                  <el-select v-model="version" placeholder="请选择" style="width: 100%;" @change="changeVersion">
                    <el-option
                      v-for="item in versions"
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
                <el-col :span="6">
                  <el-button @click="exportData" :loading ="loading">导出以下结果</el-button>
                </el-col>
              </el-row>
              <!--  -->
              <el-row :gutter="20" style="margin-top:10px" v-if="type !== 'convert'">
                <el-col :span="24" style="margin-top:10px">
                  <el-table
                    v-if="tableData"
                    :data="tableData"
                    border
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column prop="code" label="编码"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                  </el-table>
                  <el-pagination
                    background
                    v-if="tableData"
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :page-count="tablePageCount"
                    :current-page="page"
                    style="margin-top: 10px;">
                  </el-pagination>
                </el-col>
              </el-row>
              <!--  -->
              <el-row :gutter="20" style="margin-top:110px;height: 500px;" v-else>
                <el-col :span="6">&nbsp;&nbsp;</el-col>
                <el-col :span="12" style="padding: 25px;background-color: #fff;">
                  <el-select v-model="codeOption" @change="changeIcdOption" style="width: 100%;">
                    <el-option
                      v-for="item in icdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div style="margin-top: 15px;">
                    <el-input placeholder="请输入编码或名称以转换" v-model="searchValue" style="width: 100%;">
                      <template #append>
                        <el-button @click="getConvert">转换</el-button>
                      </template>
                    </el-input>
                  </div>
                  <div style="margin-top: 30px;" v-if="tableData === '您查询的内容不存在'">
                    <el-tag type="danger">您查询的内容不存在</el-tag>
                  </div>
                  <div style="margin-top: 30px;" v-else>
                    <el-collapse v-model="activeNames">
                      <el-collapse-item v-for="data in tableData.other_version_result" :title="data.header" :name="data.header" v-bind:key="data">
                        <div>{{data.code}}-{{data.name}}</div>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </el-col>
                <el-col :span="6">&nbsp;&nbsp;</el-col>
              </el-row>
            </el-main>
            <!-- div -->
          </el-container>
          <!-- 内容 -->
        </el-container>
      </div>
    </div>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, getDefaultHeight } from '../utils'
const optionConvert = [
    { value: '北京v6.0-诊断', label: '北京v6.0-诊断' },
    { value: '国家临床v2.0-诊断', label: '国家临床v2.0-诊断' },
    { value: '国家临床v1.0-诊断', label: '国家临床v1.0-诊断' },
    { value: '北京v7.0-手术', label: '北京v7.0-手术' },
    { value: '国家临床v3.0-手术', label: '国家临床v3.0-手术' },
    { value: '国家临床v2.0-手术', label: '国家临床v2.0-手术' },
    { value: '国家临床v1.0-手术', label: '国家临床v1.0-手术' },
]

export default {
  name: 'Library',
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
      activeNames: [],
      icdOptions: [],
      icdOption: '',
      leftMenus: [
        { active: '1', title: '诊断字典', type: 'icd10' },
        { active: '2', title: '手术字典', type: 'icd9' },
        { active: '3', title: '编码名称转换', type: 'convert' }
      ],
      defaultOpeneds: [],
      defaultActive: '',
      versions: [],
      version: '北京v6.0-诊断',
      type: 'icd10',
      searchValue: '',
      page: 1,
      tableData: [],
      tablePageCount: 0,
      loading: false,
      url: '',
      codeOption: ''
    }
  },
  created: function () {
    const { type } = this.$route.query
    this.type = type ? type : 'icd10'
    this.compMenu()
    this.getVersions()
  },
  mounted: function () {
  },
  updated: function () {
  },
  methods: {
    changeVersion (e) {
      this.version = e
      this.page = 1
      this.tablePageCount = 0
      this.getData()
    },
    changeIcdOption (e) {
      this.icdOption = e
      this.page = 1
      this.tablePageCount = 0
      this.getData()
    },
    getVersions () {
      apiRequest(this, 'get', '/library/get_library_version', null).then(res => {
        let versions, version, url
        switch (this.type) {
          case 'icd10':
            versions = res.library_icd10
            version = res.library_icd10[0].value
            url = `/library/library_icd10`
            break;
          case 'icd9':
            versions = res.library_icd9
            version = res.library_icd9[0].value
            url = `/library/library_icd9`
            break;
          default:
            versions = optionConvert
            version = '北京v6.0-诊断'
            url = `/library/icd_convert`
            break;
        }
        versions = versions.map(x => {
          return { value: x.value, label: x.text }
        })
        this.versions = versions
        this.version = version
        this.url = url
        if (this.type !== 'convert'){
          this.getData()
        }
      })
    },
    compMenu() {
      const menus = this.leftMenus
      const menu = menus.filter(x => x.type == this.type)[0]
      this.defaultActive = menu.active
    },
    getData() {
      this.tableData = []
      const params = {
        version: this.version,
        searchValue: this.searchValue,
        page: this.page,
        icdc: this.icdOption,
        limit: 10
      }
      apiRequest(this, 'get', this.url, params).then(res => {
        this.tableData = res.data
        this.tablePageCount = res.page_count
      })
    },
    getConvert () {
      this.tableData = []
      this.tablePageCount = 0
      const params = {
        input: this.searchValue,
        type: this.codeOption
      }
      apiRequest(this, 'post', this.url, params).then(res => {
        if (res.msg && res.msg == '您查询的内容不存在') {
          this.tableData = '您查询的内容不存在'
          return true
        }
        this.activeNames = res.data.other_version_result.map(x => x.header)
        this.tableData = res.data
      })
    },
    exportData () {
      this.loading = true
      const params = {
        version: this.version,
        searchValue: this.searchValue,
        page: this.page,
        icdc: this.icdOption,
        limit: 10
      }
      params.page = -1
      apiRequest(this, 'get', this.url, params).then(res => {
        this.loading = false
        window.open(res.path)
      })
    },
    changePage(row) {
      if (this.type === 'convert') {
        return true
      }
      this.page = row
      this.getData()
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
</style>