<template>
  <div>
    <hitb-menu activeIndex="rule" :userObj="userObj" />
    <el-container style="height: 800px; border: 1px solid #eee">
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
      <el-container>
        <el-row :gutter="5">
          <el-col :span="24">
            <div style="padding: 20px;">
              <span>DRG标签示例&nbsp;(拖动标签到想要的位置即可实现入组排序)&nbsp;</span>
              &nbsp;&nbsp;
              <el-tag>[排序码]-[编码]_[名称]</el-tag>
              <el-divider></el-divider>
              <el-button v-if="userObj && userObj.user.username != '' && userObj.user.type == '专家用户' && userObj.user.rule_order" type="primary" style="float: right;" v-on:click="submit">保存排序</el-button>
            </div>
          </el-col>

          <el-col :span="24">
            <draggable class="list-group" tag="transition-group" :component-data="{ tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }" v-model="drgOrder" v-bind="dragOptions" @start="drag = true" @end="drag = false" item-key="order_at">
              <template #item="{ element, index }">
                <li class="list-group-item">
                  <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed = !element.fixed" aria-hidden="true"></i>
                  {{index+1}}-{{element.code}}_{{ element.name }}
                </li>
              </template>
            </draggable>
          </el-col>
        </el-row>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, compMenu } from '../utils'
export default {
  name: 'Home',
  components: {
    HitbMenu,
    draggable
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj
      }
    },
    dragOptions: {
      get () {
        return { animation: 200, group: "description", disabled: false, ghostClass: "ghost" };
      }
    },
  },
  data () {
    return {
      leftMenus: [],
      defaultOpeneds: [], // 默认打开菜单
      defaultActive: '', //默认选中菜单
      version: '',
      title: 'DRG入组排序',
      drgOrder: [],
      loading: false,
      params: [],
      changeIndex: '',
      drg_order: [],
      drag: false,
      dragging: false,
      order: 6
    }
  },
  created: function () {
    const { version } = this.$route.query
    this.version = version ? version : 'Rule2021'
    this.getVersions()
    this.getOrderList()
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
    handleChange() {
    },
    inputChanged(value) {
      this.activeNames = value;
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        attrs:{
          wrap: true
        },
        props: {
          value: this.activeNames
        }
      };
    },
    getOrderList () {
      this.loading = true
      apiRequest(this, 'get', `/library/drg_order?version=${this.version}`, null).then(res => {
        this.drgOrder = res.data
        // const message = [
        //   "vue.draggable",
        //   "draggable",
        //   "component",
        //   "for",
        //   "vue.js 2.0",
        //   "based",
        //   "on",
        //   "Sortablejs"
        // ];
        // this.drgOrder = message.map((name, index) => {
        //   return { name, order: index + 1 };
        // })
        this.loading = false
      })
    },
    handleSelectionChange(rows) {
      if (rows) {
        this.params = rows
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable.clearSelection()
        this.params = []
      }
    },
    submit () {
      this.$confirm(`您确定要修改DRG入组顺序吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { version: this.version, data: this.drgOrder }
        // 提交更新
        apiRequest(this, 'post', '/library/save_drg_order', data).then(res => {
          if (!res.is_success) {
            this.$message({ message: res.info, type: 'error' });
            return
          }
          this.$message({ message: '您的修订已成功,3秒后刷新页面', type: 'success' });
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        })
      })
    },
    compMenu() {
      const menus = this.leftMenus
      const menu = menus.filter(x => x.version == this.version)[0]
      this.defaultOpeneds = [menu.opened]
      this.defaultActive = menu[this.title]
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
  .table-click {
    background-color: rgba(67,172,149,.40);
  }

  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .list-group-item {
    background-color: #ecf5ff;
    color: #409eff;
    margin: 10px;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;
    list-style: none;
    float: left;
  }
  .list-group {
    width: 100%;
  }
  .list-group-item.sortable-chosen.ghost {
    background-color: #1363be;
    color: #ecf5ff;
  }
</style>
