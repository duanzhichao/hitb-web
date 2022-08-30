<template>
  <div>
    <el-container :style="defaultHeight">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-active="activeIndex"
          :uniqueOpened="true"
          @select="handleSelect"
          default-active="2">
          <el-menu-item index="createFile">
            <i class="el-icon-menu"></i>
            <template #title>生成分组规则文件</template>
          </el-menu-item>
          <el-menu-item index="compWt4">
            <i class="el-icon-document"></i>
            <template #title>分组计算</template>
          </el-menu-item>
          <el-menu-item index="stat">
            <i class="el-icon-setting"></i>
            <template #title>分析计算</template>
          </el-menu-item>
          <el-menu-item index="user">
            <i class="el-icon-setting"></i>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="model">
            <i class="el-icon-setting"></i>
            <template #title>模型管理</template>
          </el-menu-item>
          <el-menu-item index="versions">
            <i class="el-icon-setting"></i>
            <template #title>版本管理</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <slot />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getDefaultHeight } from '../utils'

export default {
  name: 'AdminLeftMenu',
  props: {
    activeIndex: {
      type: String,
      required: true,
      default: 'index'
    },
    userObj: {
      type: Object,
      required: true,
      default: {
        is_success: false, user: { type: '', wechat_mp_id: '', subject_bp: '', headimgurl: '', bp: 0, wechat_mp_bind: false, rule_order: false, isupdate_password: true, admin: false, username: '', image_name: '', email: '' }
      }
    }
  },
  data () {
    return {
      defaultHeight: {},
      menu: {
        'createFile': '/hospitals/create_server_file_page',
        'compWt4': '/hospitals/comp_wt4_page',
        'stat': '/hospitals/comp_stat_page',
        'user': '/hospitals/admin_user_page',
        'model': '/hospitals/rule_model_page',
        'versions': '/hospitals/versions'
      }
    }
  },
  created: function () {
    const styleObj = getDefaultHeight()
    styleObj.border = '1px solid #eee'
    this.defaultHeight = styleObj
  },
  methods: {
    handleSelect (index) {
      window.location = this.menu[index]
    }
  }
}
</script>
