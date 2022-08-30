<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <admin-left-menu activeIndex="compWt4" :userObj="userObj">
      <el-row :gutter="20" :style="defaultHeight">
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="20">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="病案分组" name="病案分组">
              <el-row :gutter="10" >
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">病历年份</div>
                    <el-select v-model="year" placeholder="请选择病历年份" class="el-input__inner" style="width: 100%;padding: 0px;border: none;">
                      <el-option label="2021" value="2021"> </el-option>
                      <el-option label="2020" value="2020"> </el-option>
                      <el-option label="2019" value="2019"> </el-option>
                      <el-option label="2018" value="2018"> </el-option>
                      <el-option label="2017" value="2017"> </el-option>
                      <el-option label="2016" value="2016"> </el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">分组器类型</div>
                    <el-select v-model="drgserver_type" placeholder="请选择病历年份" class="el-input__inner" style="width: 100%;padding: 0px;border: none;">
                      <el-option label="prod(已编译)" value="prod"> </el-option>
                      <el-option label="dev(未编译)" value="BJ"> </el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">分组结果表重新命名</div>
                    <input type="text" v-model="date" autocomplete="off" placeholder="未填写以当天日期组合名称" class="el-input__inner">
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10" >

                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">调用分组器输入编码版本</div>
                    <el-select v-model="version" placeholder="请选择分组器版本" class="el-input__inner" style="width: 100%;padding: 0px;border: none;">
                      <el-option v-for="item in versions" :key="item.value" :label="`${item.label}`" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10" >
                <el-col :span="24">
                  <div style="padding-left: 45%;">
                    <el-button type="primary" @click="comp()" :disabled = "disabled">开始分组</el-button>
                    <el-button type="primary" @click="s()" >状态查询</el-button>
                  </div>
                </el-col>
              </el-row>

              <table style="margin-top: 10px;width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
                <tr>
                  <td class="user-info-table-left">计算状态(每分钟更新一次)</td>
                  <td class="user-info-table-right">{{state.state}}</td>
                </tr>
                <tr>
                  <td class="user-info-table-left">计算病案总数</td>
                  <td class="user-info-table-right">{{state.total}}</td>
                </tr>
                <tr>
                  <td class="user-info-table-left">计算进程数</td>
                  <td class="user-info-table-right">{{state.process_num}}</td>
                </tr>
              </table>
              
              
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
      </el-row>
    </admin-left-menu>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import AdminLeftMenu from '../components/AdminLeftMenu.vue'
import { apiRequest, getDefaultHeight } from '../utils'
export default {
  name: 'CompWt4',
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
      year: '2019',
      date: '',
      drgserver_type: 'prod',
      activeName: '病案分组',
      state: { process_num: "--", total: '--', state: '--', comp_result_name: '--' },
      disabled: false,
      timer: null,
      version: 'rule_gb2021',
      versions: [{as_server: true, change: true, download: false, if_not_expert: true, name: '整合开发版(2021)', server_code_info: '诊断或手术请使用名称', text: '整合开发版(2021)',value: 'Rule2021'} ]
    }
  },
  created: function () {
    this.getVersions()
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
    comp: function () {
      const data = { year: this.year, version: this.version, drgserver_type: this.drgserver_type }
      if (this.date !== '') {
        data.date = this.date
      }
      apiRequest(this, 'get', `/comp`, data).then(res => {
        this.getState();
      })
    },
    handleClick(tab, event) {
    },
    changeversion(e) {
    },
    s () {
      this.disabled = true
      this.getState()
    },
    getState() {
      apiRequest(this, 'get', `/comp_state`, null).then(res => {
        this.state = res
        clearInterval(this.timer)
        if (res.state_log === '======分组计算全部完成,请操作======') {
        } else if (res.state_log === '======正在分组计算======') {
          this.timer = setInterval(this.getState, 4500);
        } else {
          this.timer = setInterval(this.getState, 5000);
        }
      })
    }
  }
}
</script>