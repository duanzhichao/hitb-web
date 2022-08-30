<template>
  <div id="body" v-cloak>
    <hitb-menu activeIndex="admin" :userObj="userObj" />
    <el-row :gutter="20">
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="20">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{article.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="2">&nbsp;</el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="20" class="doc-border">
        <div id="test_div" class="ql-editor" v-html="contentHtml"></div>
      </el-col>
      <el-col :span="2">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, getDefaultHeight } from '../utils'
import VueQuillEditor from 'vue-quill-editor'

export default {
  name: 'Doc',
  components: {
    HitbMenu,
    LocalQuillEditor: VueQuillEditor.quillEditor
  },
  computed: {
    userObj: {
      get() {
        return this.$store.state.userObj
      }
    },
    editorA: {
      get() {
        return this.$refs.quillEditorA.quill
      }
    }
  },
  data () {
    return {
      defaultHeight: getDefaultHeight(),
      message: 'Hi from Vue.',
      content: '',
      content2: '<h2>I am Example B</h2>',
      editorOption: { theme: 'snow' },
      article: {},
      contentHtml: '',
      id: null
    }
  },
  created: function () {
    const { id } = this.$route.query
    this.id = id ? id : 20
    this.getArticle()
  },
  methods: {
    getArticle() {
      apiRequest(this, 'get', `/servers/doc?id=${this.id}`, null).then(res => {
        this.article = res.data[0]
        this.contentHtml = res.data[0].content
      })
    },
    onEditorBlur(quill) {
    },
    onEditorFocus(quill) {
    },
    onEditorReady(quill) {
    },
    saveHtml:function(event){
      apiRequest(this, 'post', '/hospitals/test_admin', { html: this.content }).then(res => {
      })
    }
  }
}
</script>