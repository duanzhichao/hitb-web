<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="download" :userObj="userObj" />
    <el-row :gutter="20" :style="defaultHeight">
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="20">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="病案下载" name="wt4">
            <el-button type="primary" :loading="loading === '1-1'" v-on:click="sumbit('wt4_download', '重点DRG组病历', '1-1')">重点DRG病历</el-button>
            <el-button type="success" :loading="loading === '1-2'" v-on:click="sumbit('wt4_download', 'DRG测试病历', '1-2')">DRG测试病历</el-button>
            <el-button type="info" :loading="loading === '1-3'" v-on:click="sumbit('wt4_download', '分组差异较大病历', '1-3')">分组差异较大病历</el-button>
            <el-button type="warning" :loading="loading === '1-4'" v-on:click="sumbit('wt4_download', '年龄-出院转归-呼吸机相关DRG病历', '1-4')">年龄/转归/呼吸相关DRG病历</el-button>
          </el-tab-pane>
          <el-tab-pane label="规则下载" name="rule">
            <div class="form-row" style="margin-top: 10px">
              <div class="form-group col-md-1">
                <label for="inputState" style="margin-top: 7px">
                  <h5>选择版本</h5>
                </label>
              </div>
              <div class="form-group col-md-2">
                <el-select v-model="version" placeholder="请选择">
                  <el-option v-for="item in versions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <el-select v-model="ICDversion" placeholder="请选择">
                  <el-option v-if="version !== 'rule_merge'" label="MDC" value="mdc"> </el-option>
                  <el-option v-if="version !== 'rule_merge'" label="ADRG" value="adrg"> </el-option>
                  <el-option v-if="version !== 'rule_merge'" label="DRG" value="drg"> </el-option>
                  <el-option v-if="version !== 'rule_merge'" label="DRG排序表" value="drg_order"> </el-option>
                  <el-option v-if="version !== 'rule_merge'" label="非QY小手术分布" value="非QY小手术分布"> </el-option>
                  <el-option label="ICD10" value="icd10"> </el-option>
                  <el-option label="ICD9" value="icd9"> </el-option>
                </el-select>
              </div>
              <br/>
              <div class="form-group col-md-2">
                <el-button type="primary" :loading="loading === '2-1'" v-on:click="exportRule('2-1')">导出规则</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="2">&nbsp;</el-col>
    </el-row>
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
      defaultHeight: getDefaultHeight(),
      versions: [{ value: 'rule_merge', label: '混合版本' }],
      version: '',
      ICDversion: 'icd10',
      activeName: 'rule',
      loading: ''
    }
  },
  created: function () {
    const { active } = this.$route.query
    this.activeName = active ? active : 'wt4'
    this.getVersions()
  },
  methods: {
    getVersions () {
      apiRequest(null, 'get', '/library/get_all_version?type=download_version', null).then(res => {
        this.version = res.versions[0].value
        res.versions.forEach(x => {
          this.versions.push({ value: x.value, label: x.text })
        });
      })
    },
    sumbit: function (type, fileType, button) {
      this.loading = button
      const url = type === 'wt4_download' ? '/stat/hospital_download/download_stat_query' : '/hospital_download/download_rule'
      const data = type === 'wt4_download' ? { plat: 'web', code: '', type: fileType, order: '' } : { version: this.version, type: this.ICDversion }

      apiRequest(this, 'get', url, data).then(res => {
        window.open(res.path)
        this.loading = ''
      })
    },
    handleClick(tab, event) {
      window.location.href = `/hospitals/download_page?active=${tab.props.name}`
    },
    changeversion(e) {
    },
    exportRule(button) {
      this.loading = button
      if (this.version === 'rule_merge') {
        apiRequest(this, 'get', `/hospital_download/download_merge_rule?version=${this.version}&type=${this.ICDversion}`, null, 6000000).then(res => {
          window.open(res.path)
          this.loading = ''
        })
      } else {
        apiRequest(this, 'get', `/hospital_download/download_rule?version=${this.version}&type=${this.ICDversion}`, null).then(res => {
          window.open(res.path)
          this.loading = ''
        })
      }
    }
  }
}
</script>