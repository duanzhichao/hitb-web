<template>
  <div>
    <hitb-menu activeIndex="edit" :userObj="userObj" />
    <div id="body" v-cloak>
      <el-container style="border: 1px solid #eee">
        <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-active="defaultActive">
              <a v-for="menu in leftMenus" :href="`/hospitals/edit_page?next_menu=${menu.title}&type=${menu.type}&code=&page=1`" style="text-decoration:none" v-bind:key="menu">
                <el-menu-item :index="menu.active">
                  <span slot="title">{{menu.title}}</span>
                </el-menu-item>
              </a>
            </el-menu>
        </el-aside>
        <el-container>
          <el-main :style="defaultHeight">
            <el-card class="box-card" style="margin-top: 20px;">
              <el-row :gutter="10" >
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">病历年份</div>
                    <el-select placeholder="性别" v-model="wt4_year" class="el-input__inner" style="width: 100%;padding: 0px;">
                      <el-option label="2020年" value="2020"></el-option>
                      <el-option label="2019年" value="2019"></el-option>
                      <el-option label="2018年" value="2018"></el-option>
                      <el-option label="2017年" value="2017"></el-option>
                      <el-option label="2016年" value="2016"></el-option>
                      <el-option label="2015年" value="2015"></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10" >
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">编码版本</div>
                    <el-select placeholder="性别" v-model="icdVersion" class="el-input__inner" style="width: 100%;padding: 0px;">
                      <el-option label="整合版(诊断请使用准确名称)" value="Rule2021"></el-option>
                      <el-option label="北京7.0编码" value="rule_bj2017"></el-option>
                      <el-option label="国临2.0编码" value="rule_gb2020"></el-option>
                    </el-select>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">DRG</div>
                    <input type="text" v-model="wt4SearchObject.drg" autocomplete="off" placeholder="如AA19" class="el-input__inner">
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">ADRG</div>
                    <input type="text" v-model="wt4SearchObject.adrg" autocomplete="off" placeholder="如AA1" class="el-input__inner">
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">MDC</div>
                    <input type="text" v-model="wt4SearchObject.mdc" autocomplete="off" placeholder="如A" class="el-input__inner">
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">主要诊断</div>
                    <input type="text" v-model="wt4SearchObject.disease_code" autocomplete="off" placeholder="如A01.001" class="el-input__inner">
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">性别</div>
                    <el-select placeholder="性别" v-model="wt4SearchObject.gender" class="el-input__inner" style="width: 100%;padding: 0px;">
                      <el-option label="-" value=""></el-option>
                      <el-option label="1-男" value="男"></el-option>
                      <el-option label="2-女" value="女"></el-option>
                      <el-option label="9-未知" value="-1"></el-option>
                    </el-select>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">年龄</div>
                    <el-row>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.age1" autocomplete="off" placeholder="如1" class="el-input__inner">
                      </el-col>
                      <el-col :span="2">&nbsp;</el-col>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.age2" autocomplete="off" placeholder="如20" class="el-input__inner">
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">住院天数</div>
                    <el-row>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.acctual_days1" autocomplete="off" placeholder="如1" class="el-input__inner">
                      </el-col>
                      <el-col :span="2">&nbsp;</el-col>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.acctual_days2" autocomplete="off" placeholder="如20" class="el-input__inner">
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">住院费用</div>
                    <el-row>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.total_expense1" autocomplete="off" placeholder="如1" class="el-input__inner">
                      </el-col>
                      <el-col :span="2">&nbsp;</el-col>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.total_expense2" autocomplete="off" placeholder="如20" class="el-input__inner">
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">新生儿天数</div>
                    <el-row>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.sf0100_1" autocomplete="off" placeholder="如1" class="el-input__inner">
                      </el-col>
                      <el-col :span="2">&nbsp;</el-col>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.sf0100_2" autocomplete="off" placeholder="如20" class="el-input__inner">
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">新生儿出生体重</div>
                    <el-row>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.sf0101_1" autocomplete="off" placeholder="如1" class="el-input__inner">
                      </el-col>
                      <el-col :span="2">&nbsp;</el-col>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.sf0101_2" autocomplete="off" placeholder="如20" class="el-input__inner">
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                    <div class="el-input-group__prepend">新生儿入院体重</div>
                    <el-row>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.sf0102_1" autocomplete="off" placeholder="如1" class="el-input__inner">
                      </el-col>
                      <el-col :span="2">&nbsp;</el-col>
                      <el-col :span="11">
                        <input type="number" v-model="wt4SearchObject.sf0102_2" autocomplete="off" placeholder="如20" class="el-input__inner">
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8">&nbsp;</el-col><el-col :span="8">&nbsp;</el-col>
                <el-col :span="24">
                  <div style="padding-left: 45%;">
                    <el-button type="primary" :loading="buttonLoading" @click="sumbit()">病案搜索</el-button>
                    <el-button v-if="wt4s.length > 0 && userObj && userObj.user.type == '专家用户'" type="success" :loading="downLoadButtonLoading" @click="download()">下载结果</el-button>
                  </div>
                </el-col>

              </el-row>
            </el-card>

            <el-row :gutter="10" style="margin-top: 20px;" v-if="statObj">
              <el-col :span="24">
                <el-card class="box-card">
                  <span v-for="(x, i) in statObj" v-bind:key="x">
                    <el-tag :type="tags[i]"> {{x[0]}}: {{x[1]}}</el-tag>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  <span v-if="subtext">
                    <el-tag :type="tags[-1]"> {{subtext}}</el-tag>
                  </span>
                </el-card>
              </el-col>
            </el-row>

            <el-row :gutter="10" style="margin-top: 20px;" v-if="wt4s.length > 0">
              <el-col :span="24">
                <el-card class="box-card">
                  <el-table :data="wt4s" height="600" highlight-current-row border style="width: 100%">
                    <el-table-column prop="disease_code" label="主要诊断"></el-table-column>
                    <el-table-column v-if="userObj && userObj.user.type == '专家用户'" prop="gender" label="性别"></el-table-column>
                    <el-table-column v-if="userObj && userObj.user.type == '专家用户'" prop="age" label="年龄"></el-table-column>
                    <el-table-column v-if="userObj && userObj.user.type == '专家用户'" prop="total_expense" label="费用"></el-table-column>
                    <el-table-column v-if="userObj && userObj.user.type == '专家用户'" label="其他诊断">
                      <template #default="scope">
                        <p style="margin: 10px">{{ scope.row.diags_code.join(' / ') }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="userObj && userObj.user.type == '专家用户'" label="手术/操作">
                      <template #default="scope">
                        <p style="margin: 10px">{{ scope.row.opers_code.join(' / ') }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="userObj && userObj.user.type == '专家用户'" prop="drg" label="DRG"></el-table-column>
                    <el-table-column v-if="userObj && userObj.user.type == '专家用户'" label="操作">
                      <template #default="scope">
                        <el-button type="primary" round v-on:click="click(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-count="pageCount"
                    @current-change="changePage"
                    :current-page="page"
                    style="margin-top: 10px;">
                  </el-pagination>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-container>

      <el-dialog title="病历详情" v-model="dialogVisible" width="50%" :before-close="handleClose">
        <div v-if="userObj && userObj.user.type == '专家用户'" prop="gender">
          <el-row :gutter="10" v-if="wt4">
            <el-col :span="12">
              <table style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
                <tr>
                  <th class="wt4-info-table-left">入组DRG</th>
                  <td class="wt4-info-table-right">{{wt4.drg}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">病案ID</th>
                  <td class="wt4-info-table-right">{{wt4.id}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">主要诊断</th>
                  <td class="wt4-info-table-right">{{wt4.disease_code}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">其他诊断</th>
                  <td class="wt4-info-table-right">{{wt4.diags_code.join(',')}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">手术/操作</th>
                  <td class="wt4-info-table-right">{{wt4.opers_code.join(',')}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">住院天数</th>
                  <td class="wt4-info-table-right">{{wt4.acctual_days}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">住院总费用</th>
                  <td class="wt4-info-table-right">{{wt4.total_expense}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">年龄</th>
                  <td class="wt4-info-table-right">{{wt4.age}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">新生儿天数</th>
                  <td class="wt4-info-table-right">{{wt4.sf0100}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">新生儿出生体重</th>
                  <td class="wt4-info-table-right">{{wt4.sf0101}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">新生入入院体重</th>
                  <td class="wt4-info-table-right">{{wt4.sf0102}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">呼吸机使用时间</th>
                  <td class="wt4-info-table-right">{{wt4.sf0104}}</td>
                </tr>
                <tr>
                  <th class="wt4-info-table-left">出院转归</th>
                  <td class="wt4-info-table-right">{{wt4.sf0108}}</td>
                </tr>
              </table>
            </el-col>
            <el-col :span="12">
              <el-alert
                title="日志中编码和名称显示为分组时所使用编码和名称"
                type="info"
                show-icon
                :closable="false"
                effect="dark">
              </el-alert>
            <br/>
            <el-timeline>
              <el-timeline-item v-for="(log, index) in wt4.logs" :key="index" :icon="log.icon" :type="log.type" :color="log.color" :size="log.size">
                  {{log.log}}
              </el-timeline-item>
            </el-timeline>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <table style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
            <tr>
              <th class="wt4-info-table-left">权限</th>
              <td class="wt4-info-table-right">您无权查看病案详情</td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, getDefaultHeight } from '../utils'

export default {
  name: 'EditSearch',
  components: {
    HitbMenu
  },
  data () {
    return {
      wt4_year: '2019',
      dialogVisible: false,
      tags: ['success', 'info', 'warning', 'danger'],
      leftMenus: [
        { active: '7', title: '自定义搜索', type: 'search' },
        { active: '1', title: '未入组病历', type: '未入组病历' },
        { active: '2', title: 'QY病历', type: 'QY病历' },
        { active: '3', title: '低风险死亡病历', type: '低风险死亡病历' },
        { active: '4', title: '费用异常病历', type: '费用异常病历' },
        { active: '5', title: '填报异常病历', type: '填报异常病历' },
        { active: '6', title: '我的病历', type: '我的病历' }
      ],
      menu: '自定义搜索',
      type: 'search',
      defaultActive: '7',
      page: 1,
      pageCount: 0,
      wt4s: [],
      wt4: null,
      statObj: null,
      subtext: null,
      icdVersion: 'rule_bj2017',
      wt4SearchObject: { drg: 'AA19', adrg: '', mdc: '', disease_code: '', gender: '', age1: '', age2: '', acctual_days1: '', acctual_days2: '', total_expense1: '', total_expense2: '', sf0100_1: '', sf0100_2: '', sf0101_1: '', sf0101_2: '', sf0102_1: '', sf0102_2: '' },
      buttonLoading: false,
      tableLoading: false,
      downLoadButtonLoading: false,
      defaultHeight: getDefaultHeight(),
      sql: '',
      dialogTableVisible: false
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
    // this.compMenu()
  },
  methods: {
    sumbit () {
      this.createSql()
      if (this.sql === '') {
        return
      }
      this.wt4s = []
      this.buttonLoading = true
      this.tableLoading = true
      const data = { wt4_year: this.wt4_year, sql: this.sql, page: this.page, icd_vesion: this.icdVersion, type: 'my_defind' }
      //查询数据
      apiRequest(this, 'post', `/edit/wt4_search`, data).then(res => {
        this.statObj = res.stat_obj
        this.buttonLoading = false
        this.tableLoading = false
        this.pageCount = res.page_count
        const data = []
        res.data.forEach(x => {
          x.logs = x.log.split('判断').filter(x => x !== '').map(function (log, i) {
            return { type: 'process', icon: 'more', color: 'grey', log: `判断${log}` }
          })
          x.obj = x
          data.push(x)
        })
        this.wt4s = data
        this.subtext = res.subtext
      })
    },
    changePage (page) {
      this.page = page
      this.sumbit()
    },
    download () {
      this.downLoadButtonLoading = true
      const data = { sql: this.sql, page: -1, icd_vesion: this.icdVersion, type: 'my_defind', plat: 'web' }
      //查询数据
      apiRequest(this, 'post', `/edit/wt4`, data).then(res => {
        this.downLoadButtonLoading = false
        window.open(res.path)
      })
    },
    click (row) {
      this.wt4 = row
      this.dialogVisible = true
    },
    createSql () {
      const obj = this.wt4SearchObject
      const newObj = { drg: obj.drg, adrg: obj.adrg, mdc: obj.mdc, disease_code: obj.disease_code, gender: obj.gender, age: `${obj.age1},${obj.age2}`, acctual_days: `${obj.acctual_days1},${obj.acctual_days2}`, total_expense: `${obj.total_expense1},${obj.total_expense2}`, sf0100: `${obj.sf0100_1},${obj.sf0100_2}`, sf0101: `${obj.sf0101_1},${obj.sf0101_2}`, sf0102: `${obj.sf0102_1},${obj.sf0102_2}` }
      // 过滤没有填写的条件
      const key = Object.keys(newObj).filter(k => newObj[k] !== '').filter(k => newObj[k] !== ',')
      // 拼接sql
      let sql = []
      key.forEach(x => {
        sql.push(`${x}^${newObj[x]}`)
      })
      this.sql = sql.join('&').split('^').join('=')
    },
    compMenu() {
      const menus = this.leftMenus
      const menu = menus.filter(x => x.type == this.type)[0]
      this.defaultActive = menu.active
    },
    location (e) {
      window.location = e.$attrs.name
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>

<style>
  .el-header {
    background-color: rgb(226, 234, 244);
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  .el-main {
    padding: 0px 5px;
  }
  .el-input-group__prepend {
    width: 35%;
    text-align: center;
  }

  .wt4-info-table-left {
    margin: 0px;
    padding: 10px;
    border-top: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    width: 50%;
  }
  .wt4-info-table-right {
    margin: 0px;
    padding: 10px;
    border-top: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
    width: 50%;
  }

</style>