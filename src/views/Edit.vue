<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="edit" :userObj="userObj" />
    <div :style="defaultHeight">
      <el-container style="border: 1px solid #eee">
        <!-- 左侧 -->
        <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
          <!-- <el-menu :default-active="defaultActive">
            <el-menu-item v-for="menu in leftMenus" :index="menu.active" @click="location" :name="`/hospitals/edit_page?next_menu=${menu.title}&type=${menu.type}&code=&page=1`">
              <span slot="title">{{menu.title}}</span>
            </el-menu-item>
          </el-menu> -->

          <el-menu :default-active="defaultActive">
            <a v-for="menu in leftMenus" :href="`/hospitals/edit_page?type=${menu.type}&code=&page=1`" style="text-decoration:none" v-bind:key="menu">
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
            <el-row :gutter="20" style="margin-top:10px">
              <el-col :span="16">
                <el-select v-model="optionTrue" multiple clearable placeholder="请选择" style="width:100%">
                  <el-option
                    v-for="item in option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" v-on:click="submit">提交筛选</el-button>
              </el-col>

              <el-col :span="24" style="margin-top:10px">
                <span v-for="(x, i) in wt4.stat" v-bind:key="x">
                  <el-tag :type="tags[i]"> {{x[0]}}: {{x[1]}}</el-tag>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span v-if="wt4.subtext">
                  <el-tag :type="tags[-1]"> {{wt4.subtext}}</el-tag>
                </span>
              </el-col>

              <!-- mdc -->
              <el-col :span="24" style="margin-top:10px">
                <el-table
                  v-if="wt4.data"
                  :data="wt4.data"
                  v-loading="wt4.loading"
                  border
                  highlight-current-row
                  @row-click="click"
                  style="width: 100%">
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
                  <el-table-column label="操作">
                    <template #default="scope">
                      <el-button type="primary" round v-on:click="click(scope.row)">查看详情</el-button>
                    </template>
                  </el-table-column>

                </el-table>

                  <!-- @current-change="changePage" -->
                <el-pagination
                  background
                  v-if="wt4.data"
                  layout="prev, pager, next"
                  @current-change="changePage"
                  :page-count="wt4.pageCount"
                  :current-page="wt4.page"
                  style="margin-top: 10px;">
                </el-pagination>
              </el-col>
              <!-- mdc -->
              <!-- info -->
            </el-row>
          </el-main>
          <!-- div -->
        </el-container>
        <!-- 内容 -->
      </el-container>
    </div>

    <el-dialog title="病历详情" v-model="dialogTableVisible" v-if="userObj && userObj.user.type == '专家用户'">
      <div v-if="type !== 'wt4_comp'">
        <el-row :gutter="10" v-if="wt4Detail">
          <el-col :span="12">
            <table style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
              <tr>
                <th class="wt4-info-table-left">入组DRG</th>
                <td class="wt4-info-table-right">{{wt4Detail.drg}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">病案ID</th>
                <td class="wt4-info-table-right">{{wt4Detail.id}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">主要诊断</th>
                <td class="wt4-info-table-right">{{wt4Detail.disease_code}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">其他诊断</th>
                <td class="wt4-info-table-right">{{wt4Detail.diags_code.join(',')}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">手术/操作</th>
                <td class="wt4-info-table-right">{{wt4Detail.opers_code.join(',')}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">住院天数</th>
                <td class="wt4-info-table-right">{{wt4Detail.acctual_days}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">住院总费用</th>
                <td class="wt4-info-table-right">{{wt4Detail.total_expense}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">年龄</th>
                <td class="wt4-info-table-right">{{wt4Detail.age}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">新生儿天数</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0100}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">新生儿出生体重</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0101}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">新生入入院体重</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0102}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">呼吸机使用时间</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0104}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">出院转归</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0108}}</td>
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
            <el-timeline-item v-for="(log, index) in wt4Detail.logs" :key="index" :icon="log.icon" :type="log.type" :color="log.color" :size="log.size">
                {{log.log}}
            </el-timeline-item>
          </el-timeline>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row :gutter="10" v-if="wt4Detail">
          <el-col :span="12">
            <table style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
              <tr>
                <th class="wt4-info-table-left">主要诊断</th>
                <td class="wt4-info-table-right">{{wt4Detail.disease_code}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">其他诊断</th>
                <td class="wt4-info-table-right">{{wt4Detail.diags_code.join(',')}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">手术/操作</th>
                <td class="wt4-info-table-right">{{wt4Detail.opers_code.join(',')}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">住院天数</th>
                <td class="wt4-info-table-right">{{wt4Detail.acctual_days}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">住院总费用</th>
                <td class="wt4-info-table-right">{{wt4Detail.total_expense}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">年龄</th>
                <td class="wt4-info-table-right">{{wt4Detail.age}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">新生儿天数</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0100}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">新生儿出生体重</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0101}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">新生入入院体重</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0102}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">呼吸机使用时间</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0104}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">出院转归</th>
                <td class="wt4-info-table-right">{{wt4Detail.sf0108}}</td>
              </tr>
            </table>
          </el-col>
          <el-col :span="12">
            <table v-for="data in wt4Detail.comp_result" style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px;margin-bottom:10px" v-bind:key="data">
              <tr>
                <th class="wt4-info-table-left">分组结果</th>
                <td class="wt4-info-table-right">{{data.drg}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">分组版本</th>
                <td class="wt4-info-table-right">{{data.version}}</td>
              </tr>
              <tr>
                <th class="wt4-info-table-left">分组时间</th>
                <td class="wt4-info-table-right">{{data.time}}</td>
              </tr>
            </table>
            <el-alert
              title="日志中编码和名称显示为分组时所使用编码和名称"
              type="info"
              show-icon
              :closable="false"
              effect="dark">
            </el-alert>
          <br/>
          <el-timeline>
            <el-timeline-item v-for="(log, index) in wt4Detail.logs" :key="index" :icon="log.icon" :type="log.type" :color="log.color" :size="log.size">
                {{log.log}}
            </el-timeline-item>
          </el-timeline>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog title="病历详情" v-model="dialogTableVisible" v-else>
      <table style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
        <tr>
          <th class="wt4-info-table-left">权限</th>
          <td class="wt4-info-table-right">您无权查看病案详情</td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, logOut, getDefaultHeight } from '../utils'

export default {
  name: 'Edit',
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
      leftMenus: [
        { active: '7', title: '自定义搜索', type: 'search' },
        { active: '1', title: '未入组病历', type: '未入组病历' },
        { active: '2', title: 'QY病历', type: 'QY病历' },
        { active: '3', title: '低风险死亡病历', type: '低风险死亡病历' },
        { active: '4', title: '费用异常病历', type: '费用异常病历' },
        { active: '5', title: '填报异常病历', type: '填报异常病历' },
        { active: '6', title: '我的病历', type: 'wt4_comp' }
      ],
      wt4: { data: null, loading: false, stat: [], subtext: [], page: 1, pages: [], pageCount: 0 },
      tags: ['success', 'info', 'warning', 'danger'],
      defaultOpeneds: [],
      defaultActive: '',
      type: '',
      option: [],
      optionTrue: [],
      defaultHeight: getDefaultHeight(),
      wt4Detail: null,
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
    const { type } = this.$route.query
    this.type = type ? type : '未入组病历'
    this.compMenu()
    if (this.type == 'wt4_comp' || this.type == '我的病历') {
      this.getWt4Comp()
    } else {
      this.getData()
    }
  },
  mounted: function () {
  },
  updated: function () {
  },
  methods: {
    location (e) {
      window.location = e.$attrs.name
    },
    getData () {
      this.wt4.data = []
      this.wt4.loading = true
      const data = { type: this.type, page: this.wt4.page, icd_version: this.icdVersion, code: this.optionTrue, order: this.order }
      const url = `/edit/wt4`
      apiRequest(this, 'post', url, data, 1500000000).then(res => {
        this.option = res.option[0].children
        this.wt4.data = res.data
        this.wt4.stat = res.stat_obj
        this.wt4.subtext = res.subtext
        this.wt4.pages = res.page_list
        if (this.wt4.pageCount === 0) {
          this.wt4.pageCount = res.page_count
        }
        this.wt4.loading = false
      })
    },
    getWt4Comp () {
      this.wt4.data = []
      this.wt4.loading = true
      const data = { type: this.type, page: this.wt4.page, icd_version: this.icdVersion, code: this.optionTrue, order: this.order }
      apiRequest(this, 'get', `/edit/wt4_comp`, data, 1500000000).then(res => {
        this.option = []
        this.wt4.data = res.data
        this.wt4.stat = res.stat_obj
        this.wt4.subtext = res.subtext
        this.wt4.pages = res.page_list
        this.wt4.pageCount = res.page_count
        this.wt4.loading = false
      })
    },
    changePage (num) {
      this.wt4.page = num
      if (this.type == 'wt4_comp' || this.type == '我的病历') {
        this.getWt4Comp()
      } else {
        this.getData()
      }
    },
    click (wt4) {
      let log = null;
      if (this.type !== 'wt4_comp' && this.type !== '我的病历') {
        if (Object.keys(wt4).includes('new_log')) {
          log = wt4.new_log
        }
        if (Object.keys(wt4).includes('log')) {
          log = wt4.log
        }
        wt4.logs = log.split('判断').filter(x => x !== '').map(function (log, i) {
          return { type: 'process', icon: 'more', color: 'grey', log: `判断${log}` }
        })
      }
      this.wt4Detail = wt4
      this.dialogTableVisible = true
    },
    submit () {
      this.wt4.page = 1
      if (this.type == 'wt4_comp' || this.type == '我的病历') {
        this.getWt4Comp()
      } else {
        this.getData()
      }
    },
    compMenu() {
      const menus = this.leftMenus
      const menu = menus.filter(x => x.type == this.type)[0]
      this.defaultActive = menu.active
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