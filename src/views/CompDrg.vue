<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="comp" :userObj="userObj" />
    <el-container>
      <el-main>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="1">&nbsp;</el-col>

          <el-col :span="11">
            <el-alert class="rounded-lg shadow mb-2" style="background:#0082ff;height: 50px;" title="分组测试" type="success" effect="dark" :closable="false">
            </el-alert>
            <el-card class="box-card">
              <el-timeline>
                <el-timeline-item
                  v-for="(log, index) in logs"
                  :key="index"
                  :icon="log.icon"
                  :type="log.type"
                  :color="log.color"
                  :size="log.size">
                  <span v-if="log.content.indexOf('--「') > 0 && log.content.indexOf('」') > 0 && log.content.indexOf('传入参数') < 0">
                    {{log.content.split('「')[0]}}
                    <a href="javascript:void(0)" v-on:click="search(log.ruleType, log.code)">「{{log.content.split('「')[1].split('」')[0]}}</a>
                    {{log.content.split('「')[0].split('」')[1]}}」;
                  </span>
                  <span v-else>
                    {{log.content}}
                  </span>
                </el-timeline-item>
              </el-timeline>
              <el-form ref="form" label-width="150px" v-if="compResult">
                <el-form-item>
                  <el-button type="success" @click="save">保存该病案到我的病案</el-button>
                </el-form-item>
              </el-form>
              <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                <div class="el-input-group__prepend">分组器版本</div>
                <el-select v-model="wt4.version" placeholder="请选择分组器版本" class="el-input__inner" style="width: 100%;padding: 0px;border: none;">
                  <el-option v-for="item in versions" :key="item.value" :label="`${item.label}`" :value="item.value"> </el-option>
                </el-select>
              </div>
              <div style="margin-bottom: 17px;margin-left: 7px;">
                <el-tag>提示</el-tag><span style="margin-left: 7px;">{{versions.filter(x => x.value === wt4.version)[0].server_code_info}}</span>
              </div>
              <el-input placeholder="如A01.001或伤寒" v-model="wt4.DISEASE_CODE" style="margin-bottom: 17px;">
                <template #prepend>主要诊断</template>
              </el-input>
              <el-input placeholder="" v-model="wt4.AGE" style="margin-bottom: 17px;">
                <template #prepend>年龄</template>
              </el-input>
              <el-input placeholder="" v-model="wt4.ACCTUAL_DAYS" style="margin-bottom: 17px;">
                <template #prepend>住院天数</template>
              </el-input>
              <el-input placeholder="" v-model="wt4.TOTAL_EXPENSE" style="margin-bottom: 17px;">
                <template #prepend>住院费用</template>
              </el-input>
              <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                <div class="el-input-group__prepend">出院转归</div>
                <el-select v-model="wt4.SF0108" placeholder="出院转归代码" class="el-input__inner" style="width: 100%;padding: 0px;">
                  <el-option label="-1-缺失" value="-1"></el-option>
                  <el-option label="1-医嘱离院" value="1"></el-option>
                  <el-option label="2-医嘱转院" value="2"></el-option>
                  <el-option label="3-医嘱转入社区" value="3"></el-option>
                  <el-option label="4-非医嘱离院" value="4"></el-option>
                  <el-option label="5-死亡" value="5"></el-option>
                  <el-option label="9-其他" value="9"></el-option>
                </el-select>
              </div>
              <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                <div class="el-input-group__prepend">性别</div>
                <el-select v-model="wt4.GENDER" placeholder="性别" class="el-input__inner" style="width: 100%;padding: 0px;">
                  <el-option label="1-男" value="男"></el-option>
                  <el-option label="2-女" value="女"></el-option>
                  <el-option label="9-未知" value="-1"></el-option>
                </el-select>
              </div>
              <el-input placeholder="" v-model="wt4.SF0101" style="margin-bottom: 17px;">
                <template #prepend>新生儿出生体重</template>
              </el-input>
              <el-input placeholder="" v-model="wt4.SF0102" style="margin-bottom: 17px;">
                <template #prepend>新生儿入院体重</template>
              </el-input>
              <el-input placeholder="" v-model="wt4.SF0100" style="margin-bottom: 17px;">
                <template #prepend>新生儿天数</template>
              </el-input>

              <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                <div class="el-input-group__prepend">其他诊断</div>
                <el-select
                  multiple
                  :filterable="false"
                  allow-create
                  v-model="wt4.diags_code"
                  class="el-input__inner"
                  style="width: 100%;padding: 0px;"
                  default-first-option
                  placeholder="请输入诊断,输入完成后按回车输入下一个">
                </el-select>
              </div>
              <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                <div class="el-input-group__prepend">手术操作</div>
                <el-select
                  multiple
                  :filterable="false"
                  allow-create
                  v-model="wt4.opers_code"
                  class="el-input__inner"
                  style="width: 100%;padding: 0px;"
                  default-first-option
                  placeholder="请输入手术,输入完成后按回车输入下一个">
                </el-select>
              </div>
              <el-form ref="form" label-width="150px">
                <el-form-item>
                  <el-button type="warning" @click="random">随机示例</el-button>
                  <el-button type="danger" @click="clear">清除示例</el-button>
                  <el-button type="primary" @click="sumbit('normal')">标准分组</el-button>
                  <el-button type="success" @click="sumbit('smart')">智能分组</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>

          <el-col :span="11">
            <el-alert class="rounded-lg shadow mb-2" style="background:#0082ff;height: 50px;" title="分组器判断逻辑的规则表查询" type="success" effect="dark" :closable="false">
            </el-alert>

            
            <el-card class="box-card" style="height: 950px;overflow-y: scroll;">
              <el-collapse accordion>
                <el-collapse-item v-for="(data, i) in rule" :title="`${data.code}`"  v-bind:key="i">
                  <div v-for="(x, i) in data.info_rule"  v-bind:key="i">
                    <div>
                      <h4>{{x.header}}</h4>
                    </div>
                    <div style="background-color: #f4f4f5;">{{x.data}}</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, compMenu } from '../utils'
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
      value: [],
      logs: null,
      versions: [{as_server: true, change: true, download: false, if_not_expert: true, name: '整合开发版(2021)', server_code_info: '诊断或手术请使用名称', text: '整合开发版(2021)',value: 'Rule2021'} ],
      wt4: { 'B_WT4_V1_ID': 1, 'version': 'Rule2021', 'DISEASE_CODE': '', 'AGE': '', 'ACCTUAL_DAYS': '', 'TOTAL_EXPENSE': '', 'SF0100': '', 'SF0101': '', 'SF0102': '', 'SF0108': '-1', 'GENDER': '9', 'diags_code': [], 'opers_code': [], verison: 'Rule2021' },
      activeName: 0,
      baseUrl: null,
      ruleType: null,
      rule: null,
      ruleHeader: [],
      compResult: null
    }
  },
  created: function () {
    this.getVersions()
  },
  mounted: function () {
    this.baseUrl = window.location.href.split('/hospitals')[0]
    this.baseUrl = this.baseUrl.replace(':8000', ':3001')
  },
  methods: {
    getVersions () {
      apiRequest(null, 'get', '/library/get_all_version?type=comp_version', null).then(res => {
        this.versions = []
        res.versions.forEach(x => {
          this.versions.push({ value: x.value, label: x.text, server_code_info: x.server_code_info })
        });
      })
    },
    sumbit: function (comp_type) {
      //
      if (comp_type) {
        this.wt4.comp_type = comp_type
      }
      const message = this.$message({ dangerouslyUseHTMLString: true, message: '<b>正在分组,请稍后</b>', type: 'success', iconClass: 'el-icon-loading', center: true })
      // 请求分组
      this.jsurl = 'https://jklf.hitb.com.cn/page_comp_drg'
      this.jscode = this.wt4
      this.curlString =
        `curl -H 'content-type: application/json' -X POST -d \"${JSON.stringify(this.wt4).replace(/\"/g,"\\\"")}\"
        ${this.curlUrl}/comp_drg`;
      this.comp(message)
    },
    comp: function (message) {
      apiRequest(this, 'post', '/hospitals/comp_drg', this.wt4).then(res => {
        message.close()
        this.$message({ dangerouslyUseHTMLString: true, message: "<b>分组成功</b>", center: true, type: "success" })
        this.compResult = res;
        this.logs = res.logs.map(function (x, i) {
          if (x.type === 'error') {
            x = { type: 'error', ruleType: x.rule_type, code: x.code, icon: 'el-icon-close', color: '#FF0000', content: x.log, size: 'large' }
          } else if (x.type === 'log') {
            x = { type: 'primary', ruleType: x.rule_type, code: x.code, icon: 'el-icon-more', content: x.log, size: 'large' }
          } else if (x.type === 'tip') {
            x = { type: 'tips', ruleType: x.rule_type, code: x.code, icon: 'el-icon-warning-outline', color: '#FFFF00', content: x.log, size: 'large' }
          } else {
            x = { type: 'wait', ruleType: x.rule_type, code: x.code, icon: 'el-icon-more', color: '#FF00FF', content: x.log, size: 'large' }
          }
          return x
        })
      })
    },
    save: function () {
      const wt4Obj = {
        acctual_days: this.wt4.ACCTUAL_DAYS,
        age: this.wt4.AGE,
        disease_code: this.wt4.DISEASE_CODE,
        gender: this.wt4.GENDER,
        sf0101: this.wt4.SF0101,
        sf0100: this.wt4.SF0100,
        sf0108: this.wt4.SF0108,
        total_expense: this.wt4.TOTAL_EXPENSE,
        diags_code: this.wt4.diags_code,
        opers_code: this.wt4.opers_code,
        user: "<%=@user.userInfo.username%>",
        comp_result: []
      };
      const version = this.versions.filter(x => x.value === this.wt4.version)[0].label
      wt4Obj.comp_result.push({ drg: this.compResult.drg, version: version, time: this.getTimeNow() })
      apiRequest(this, 'post', '/edit/wt4_comp', { wt4_comp: wt4Obj }).then(res => {
        this.$message({
          message: "保存成功",
          center: true,
          type: "success"
        });
      })
    },
    random() {
      const id = Math.floor(Math.random() * 1000000) + 1;
      const url = `/edit/wt4_random_one?id=${id}&icd_version=${this.wt4.version}&version=${this.wt4.version}`
      apiRequest(this, 'get', url, null).then(res => {
        const data = res.data[0]
        this.wt4 = { 'B_WT4_V1_ID': 1, 'version': this.wt4.version, 'DISEASE_CODE': data.disease_code, 'AGE': data.age, 'ACCTUAL_DAYS': data.acctual_days, 'TOTAL_EXPENSE': data.total_expense, 'SF0100': data.sf0100, 'SF0101': data.sf0101, 'SF0102': data.sf0102, 'SF0108': data.sf0108, 'GENDER': data.gender, 'diags_code': data.diags_code, 'opers_code': data.opers_code }
      })
    },
    clear() {
      this.wt4 = { 'B_WT4_V1_ID': 1, 'version': 'Rule2021', 'DISEASE_CODE': '', 'AGE': '', 'ACCTUAL_DAYS': '', 'TOTAL_EXPENSE': '', 'SF0100': '', 'SF0101': '', 'SF0102': '', 'SF0108': '-1', 'GENDER': '9', 'diags_code': [], 'opers_code': [] }
      this.diags_code_form = []
      this.opers_code_form = []
      this.compResult = null
    },
    search: function (type, value) {
      this.ruleType = type
      this.rule = []
      const data = { type: this.ruleType, code: value, version: this.wt4.version }
      apiRequest(this, 'post', `/library/get_comp_rule_details`, data).then(res => {
        if (res && res.length > 0) {
          this.rule = res
        }
      })
    },
    getTimeNow() {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let dateStr = date.getDate()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let seconds = date.getSeconds()
      const [first, second, third, fourth, fifth, sixth] = [year, month, dateStr, hours, minutes, seconds].map(x => x >= 1 && x <= 9 ? `0${x}` : `${x}`)
      return `${first}-${second}-${third} ${fourth}:${fifth}:${sixth}`
    }
  }
}
</script>