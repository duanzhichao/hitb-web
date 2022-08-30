<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <admin-left-menu activeIndex="createFile" :userObj="userObj">
      <el-row :gutter="20" :style="defaultHeight">
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="20">
          <el-tabs v-model="activeName">
            <el-tab-pane label="生成规则" name="生成规则">
              <el-row :gutter="10" >

                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">生成规则版本</div>
                    <el-select v-model="version" placeholder="生成规则版本" class="el-input__inner" style="width: 100%;padding: 0px;border: none;">
                      <el-option v-for="item in versions" :key="item.value" :label="`${item.label}`" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10" >
                <el-col :span="24">
                  <div style="padding-left: 45%;">
                    <el-button type="primary" @click="gen()">生成</el-button>
                    <br/><br/>
                    {{file_path}}
                  </div>
                </el-col>
              </el-row>
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
  name: 'CreateRuleFile',
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
      activeName: '生成规则',
      version: 'rule_gb2021',
      versions: [{as_server: true, change: true, download: false, if_not_expert: true, name: '整合开发版(2021)', server_code_info: '诊断或手术请使用名称', text: '整合开发版(2021)',value: 'Rule2021'} ],
      file_path: ''
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
    gen: function () {
      apiRequest(null, 'get', `/generate_drgserver_rule_files?version=${this.version}`, null).then(res => {
        if (res.is_success) {
          this.file_path = res.file_path
          alert('规则导出写入文件完成！')
        }
      })
      // const data = { year: this.year, version: this.version, drgserver_type: this.drgserver_type }
      // if (this.date !== '') {
      //   data.date = this.date
      // }
      // apiRequest(this, 'get', `/comp`, data).then(res => {
      //   this.getState();
      // })
    }
  }
}
</script>