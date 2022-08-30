<template>
  <div>
    <hitb-menu activeIndex="rule" :userObj="userObj" />
    <div id="body" v-cloak>
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
              <!-- option -->
              <el-row>
                <el-col :span="24" style="margin:10px 0 10px 0">
                  <el-select v-model="optionValue" placeholder="请选择" @change="getIcdc">
                    <el-option
                      v-for="item in icdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <!-- option -->

              <el-row :gutter="20" style="margin-top:10px">
                <!-- icdc -->
                <el-col :span="8">
                  <el-table
                    v-if="icdc.data"
                    :data="icdc.data"
                    height="400"
                    border
                    highlight-current-row
                    @row-click="click"
                    style="width: 100%">
                    <el-table-column prop="code" label="编码" width="180"></el-table-column>
                    <el-table-column prop="name" label="名称" width="340"></el-table-column>
                  </el-table>
                </el-col>
                <!-- icdc -->
                <!-- icdcc -->
                <el-col :span="8">
                  <el-table
                    v-if="icdcc.data"
                    :data="icdcc.data"
                    height="400"
                    border
                    highlight-current-row
                    @row-click="click"
                    style="width: 100%">
                    <el-table-column prop="sub_code" label="编码" width="180"></el-table-column>
                    <el-table-column prop="name" label="名称" width="340"></el-table-column>
                  </el-table>
                </el-col>
                <!-- icdcc -->
                <!-- icd -->
                <el-col :span="8">
                  <el-table
                    v-if="icd.data"
                    :data="icd.data"
                    height="400"
                    border
                    highlight-current-row
                    @row-click="click"
                    style="width: 100%">
                    <el-table-column v-if="version == 'Rule2021'" prop="show_codes" label="编码" width="180"></el-table-column>
                    <el-table-column v-else prop="code" label="编码" width="180"></el-table-column>
                    <el-table-column prop="name" label="名称" width="340"></el-table-column>
                  </el-table>
                </el-col>
                <!-- icd -->
                <!-- info -->
                <el-col :span="24" style="margin-top: 15px;" v-if="info.data">
                  <el-tabs type="border-card" v-model="info.activeTab">
                    <el-tab-pane label="规则详情" name="规则详情">
                        <table border="1px" class="rule-info-table" cellpadding="12px" cellspacing="0" v-if="title == 'ICD10'">
                            <tr v-if="version == 'Rule2021'"><td>编码</td><td>{{info.data.show_codes}}</td></tr>
                            <tr v-else><td>编码</td><td>{{info.data.code}}</td></tr>
                            <tr><td>名称</td><td>{{info.data.name}}</td></tr>
                            <tr><td>是否严重并发症</td><td>{{info.data.is_mcc}}</td></tr>
                            <tr><td>是否并发症</td><td>{{info.data.is_cc}}</td></tr>
                            <tr><td>是否新生儿</td><td>{{info.data.mdc_p}}</td></tr>
                            <tr><td>是否MDCY主要诊断</td><td>{{info.data.y01}}</td></tr>
                            <tr><td>创伤描述(Z)</td><td>{{info.data.mdc_z}}</td></tr>
                        </table>
                        <table border="1px" class="rule-info-table" cellpadding="12px" cellspacing="0" v-else>
                          <tr v-if="version == 'Rule2021'"><td>编码</td><td>{{info.data.show_codes}}</td></tr>
                          <tr v-else><td>编码</td><td>{{info.data.code}}</td></tr>
                          <tr><td>名称</td><td>{{info.data.name}}</td></tr>
                          <tr><td>手术室手术</td><td>{{info.data.p_type}}</td></tr>
                        </table>
                    </el-tab-pane>
                    <el-tab-pane label="ADRG规则" name="ADRG规则">
                      <div v-if="userObj && userObj.user.type == '专家用户'">
                        <el-row :gutter="2" v-if="info.table != '2'">
                          <el-col :span="20">
                            <el-input placeholder="请输入内容" v-model="codeInput"> </el-input>
                          </el-col>
                          <el-col :span="4">
                            <el-button-group>
                              <el-button type="primary" v-on:click="updateRule(`添加ADRG规则`)">添加规则</el-button>
                              <el-button type="danger" v-on:click="updateRule(`删除ADRG规则`)">删除规则</el-button>
                            </el-button-group>
                          </el-col>
                        </el-row>
                      </div>
                      <div style="margin: 12px;">
                        <el-tag v-for="adrg in info.data.adrg_a" v-bind:key="adrg" style="margin: 12px">{{adrg}}</el-tag>
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
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, compMenu, getDefaultHeight } from '../utils'

const optionIcd10 = [
    { value: 'A', label: 'A-传染病和寄生虫病' },
    { value: 'B', label: 'B-传染病和寄生虫病' },
    { value: 'C', label: 'C-肿瘤' },
    { value: 'D', label: 'D-肿瘤,血液及造血器官疾病和涉及免疫机制的疾患' },
    { value: 'E', label: 'E-分泌、营养和代谢疾病' },
    { value: 'F', label: 'F-精神和行为障碍' },
    { value: 'G', label: 'G-神经系统疾病' },
    { value: 'H', label: 'H-眼和附器疾病,耳和乳突疾病' },
    { value: 'I', label: 'I-循环系统疾病' },
    { value: 'J', label: 'J-呼吸系统疾病' },
    { value: 'K', label: 'K-消化系统疾病' },
    { value: 'L', label: 'L-皮肤和皮下组织疾病' },
    { value: 'M', label: 'M-肌肉骨骼系统和结缔组织疾病' },
    { value: 'N', label: 'N-泌尿生殖系统疾病' },
    { value: 'O', label: 'O-妊娠、分娩和产褥期' },
    { value: 'P', label: 'P-起源于围生期的某些情况' },
    { value: 'Q', label: 'Q-先天性畸形、变形和染色体异常' },
    { value: 'R', label: 'R-症状、体征和临床与实验室异常所见，不可归类在他处者' },
    { value: 'S', label: 'S-损伤、中毒和外因的某些其他后果' },
    { value: 'T', label: 'T-损伤、中毒和外因的某些其他后果' },
    { value: 'U', label: 'U-用于特殊目的的编码' },
    { value: 'V', label: 'V-疾病和死亡的外因' },
    { value: 'W', label: 'W-疾病和死亡的外因' },
    { value: 'X', label: 'X-疾病和死亡的外因' },
    { value: 'Y', label: 'Y-疾病和死亡的外因' },
    { value: 'Z', label: 'Z-影响健康状态和与保健机构接触的因素'}
  ]

const optionIcd9 = [
    { value: '0', label: '0-操作和介入,不可归类于他处,神经系统,内分泌系统,眼部手术' },
    { value: '1', label: '1-眼部手术,其他种类的诊断性和治疗性手术,耳部手术' },
    { value: '2', label: '2-耳部手术, 鼻、口、咽部手术' },
    { value: '3', label: '3-呼吸系统手术,心血管系统手术' },
    { value: '4', label: '4-造血和淋巴系统手术,消化系统手术' },
    { value: '5', label: '5-男性生殖器官手术,女性生殖器官手术' },
    { value: '6', label: '6-女性生殖器官手术,产科操作,肌肉骨骼系统手术' },
    { value: '7', label: '7-肌肉骨骼系统手术' },
    { value: '8', label: '8-肌肉骨骼系统手术,体被系统手术,其他诊断性和治疗性操作' },
    { value: '9', label: '9-其他诊断性和治疗性操作'}
  ]

export default {
  name: 'RuleIcd',
  components: {
    HitbMenu
  },
  data () {
    return {
      leftMenus: [], // 左侧菜单
      defaultOpeneds: [], // 默认打开菜单
      defaultActive: '', //默认选中菜单
      version: 'Rule2021', // 版本
      title: 'ICD10', // 标题
      optionValue: '', // 下拉列表值
      icdOptions: [], // 下拉列表
      defaultHeight: getDefaultHeight(),
      codeInput: '', // 输入框值
      url: '',
      icdc: { data: null, loading: false }, // icdc表格相关
      icdcc: { data: null, loading: false }, // icdcc表格相关
      icd: { data: null, loading: false },
      info: { data: null, activeTab: '规则详情', index: -1, table: '' },
    }
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj
      }
    }
  },
  created: function () {
    const { version, title } = this.$route.query
    this.version = version ? version : 'Rule2021'
    console.log(title)
    this.title = title ? title : 'ICD10'
    // 计算获得menu显示
    this.getVersions()
    // 计算获得初始化变量
    this.icdOptions = this.title == 'ICD10' ? optionIcd10 : optionIcd9
    this.optionValue = this.title == 'ICD10' ? 'A' : '0'
    this.url = this.title == 'ICD10' ? 'icd10' : 'icd9'
    // 获取icdc列表
    this.getIcdc(this.optionValue)
  },
  mounted: function () {
  },
  updated: function () {
  },
  methods: {
    getVersions () {
      apiRequest(null, 'get', '/library/get_all_version?type=rule_menu_version', null).then(res => {
        res.versions.forEach((x, i) => {
          this.leftMenus.push({ opened: `${i + 1}`, DRG: `${i + 1}-1`, ICD10: `${i + 1}-2`, ICD9: `${i + 1}-3`, DRG入组排序: `${i + 1}-4`, title: x.text, version: x.value })
        });
        const {defaultOpeneds, defaultActive} = compMenu(this.leftMenus, this.version, this.title)
        this.defaultOpeneds = defaultOpeneds
        this.defaultActive = defaultActive
      })
    },
    getIcdc (code) {
      const url = `/library/${this.url}c?plat=client&version=${this.version}&code=${code}`
      apiRequest(this, 'get', url, null).then(res => {
        this.icdc.data = res.data
      })
    },
    getIcdcc (code) {
      const url = `/library/${this.url}cc?plat=client&version=${this.version}&code=${code}`
      apiRequest(this, 'get', url, null).then(res => {
        this.icdcc.data = res.data
      })
    },
    getIcd (code) {
      const url = `/library/rule_${this.url}?plat=client&version=${this.version}&code=${code}`
      apiRequest(this, 'get', url, null).then(res => {
        this.icd.data = res.data
      })
    },
    click (row, column, event) {
      switch (column.id) {
        case 'el-table_1_column_2':
        case 'el-table_1_column_1':
          this.getIcdcc(row.code)
          this.codeInput = ''
          this.info.activeTab = '规则详情'
          this.info.data = null
          break;
        case 'el-table_2_column_3':
        case 'el-table_2_column_4':
          this.getIcd(row.sub_code)
          this.codeInput = ''
          this.info.activeTab = '规则详情'
          this.info.data = row
          this.info.table = '2'
          break;
        default:
          this.codeInput = ''
          this.info.activeTab = '规则详情'
          this.info.data = row
          this.info.table = '3'
          break;
      }
    },
    updateRule (mode) {
      const url = `/library/rule_${this.url}/${this.info.data.id}`
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
        this.sumbitRule(mode, url)
      });
    },
    sumbitRule (mode, url) {
      const data = { mode: mode, code: this.codeInput, version: this.version }
      apiRequest(this, 'put', url, data).then(res => {
        if (!res.is_success) {
          this.$message({ message: res.info, type: 'error' });
          return
        }
        this.info.data.adrg_a = res.data.adrg_a
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
</style>