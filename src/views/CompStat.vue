<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <admin-left-menu activeIndex="stat" :userObj="userObj">
      <el-row :gutter="10" >
        <el-col :span="8">
          <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
            <div class="el-input-group__prepend">视图</div>
            <el-select v-model="view" placeholder="请选择视图" class="el-input__inner" style="width: 100%;padding: 0px;border: none;">
              <el-option v-for="item in views" :label="item" :value="item" v-bind:key="item"> </el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
            <div class="el-input-group__prepend">分组字段(DRG或ADRG)</div>
            <el-select v-model="field" placeholder="请选择病历年份" class="el-input__inner" style="width: 100%;padding: 0px;border: none;">
              <el-option label="DRG" value="drg"> </el-option>
              <el-option label="ADRG" value="adrg"> </el-option>
              <el-option label="MDC" value="mdc"> </el-option>
              <el-option label="主要诊断" value="disease_code"> </el-option>
              <el-option label="主要手术" value="oper_code"> </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" >
      </el-row>

      <el-row :gutter="10" >
        <el-col :span="24">
          <div style="padding-left: 45%;">
            <el-button type="primary" @click="stat()">开始分析</el-button>
          </div>
        </el-col>
      </el-row>


      <el-row :gutter="10" >
        <el-col :span="24">
          <el-table :data="havedStat" stripe border @row-click="info" style="width: 100%">
            <el-table-column prop="version" label="版本"> </el-table-column>
            <el-table-column prop="type" label="字段"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </admin-left-menu>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import AdminLeftMenu from '../components/AdminLeftMenu.vue'
import { apiRequest, compMenu } from '../utils'
export default {
  name: 'CompStat',
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
      view: '',
      field: 'drg',
      views: '<%=@views%>',
      havedStat: null,
      activeName: '病案分析',
      timer: null
    }
  },
  created: function () {
    this.views = this.views.split('&amp;&amp;&amp;')
    this.getHavedStat()
  },
  methods: {
    getHavedStat: function () {
      apiRequest(this, 'get', `/stat/get_haved_stat`, ).then(res => {
        this.havedStat = res.data
      })
    },
    stat: function () {
      const data = { result_view_name: this.view, field: this.field }
      if (this.view === '') {
        this.$message({ message: '请选择视图', type: 'warning' });
        return true
      }
      apiRequest(this, 'post', `/stat/wt4_stat_comp`, data).then(res => {
        if (res.is_success) {
          this.$message({ message: '开始分析计算!', type: 'success' });
        } else {
          this.$message({ message: '开始计算失败', type: 'error' });
        }
      })
    }
  }
}
</script>