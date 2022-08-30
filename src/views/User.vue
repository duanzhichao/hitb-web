<template>
  <div>
    <hitb-menu activeIndex="user" :userObj="userObj" />
    <el-row :gutter="20" :style="defaultHeight">
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="6">
        <el-card :body-style="{ padding: '20px' }" style="width: 100%;">
          <el-row>
            <el-col :span="10">
              <div style="margin:10%;" v-if="userObj.is_success && userObj.user.headimgurl">
                <el-image fit="fill" :src="userObj.user.headimgurl"></el-image>
              </div>
              <div style="margin:10%;" v-else>
                <el-image fit="fill" src="https://jklf.hitb.com.cn/images/defualt_avater.png"></el-image>
              </div>
            </el-col>
            <el-col :span="14">
              <div style="width:100%;height:100%;" >
                <h3 style="margin-top:7%;">{{userObj.user.username}}</h3>

                <h5 style="margin-top:7%;" v-if="userObj.user.web_wechat_nickname">{{userObj.user.web_wechat_nickname}}</h5>
                <h5 style="margin-top:7%;" v-else>无</h5>

                <div style="margin-top:7%;">
                  <a href="/hospitals/retrieve_html"><el-button type="primary">重置密码</el-button></a>
                </div>
                <div style="margin-top:5px;margin-bottom: 5px;" v-if="userObj.user.username !== '' && userObj.user.rule_order">
                  <a href="/hospitals/keyanpingtai" target="_blank"><el-button type="warning">科研平台</el-button></a>
                </div>
              </div>
            </el-col>
          </el-row>
          
          <table style="width: 100%;border-bottom: 1px solid #dee2e6;border-spacing:0px">
            <tr>
              <td class="user-info-table-left"><img style="height:17px;" src="https://jklf.hitb.com.cn/images/choice.png" /> 用户名</td>
              <td class="user-info-table-right">{{userObj.user.username}}</td>
            </tr>
            <tr>
              <td class="user-info-table-left"><img style="height:17px;" src="https://jklf.hitb.com.cn/images/email.png" /> 邮箱</td>
              <td class="user-info-table-right">{{userObj.user.email}}</td>
            </tr>
            <tr>
              <td class="user-info-table-left"><img style="height:17px;" src="https://jklf.hitb.com.cn/static/images/wechat2.png" /> 微信</td>
              <td class="user-info-table-right" v-if="userObj.user.web_wechat_nickname">
                  {{userObj.user.web_wechat_nickname}}
              </td>
              <td class="user-info-table-right" v-else>
                <a href="/hospitals/wechat_login_html"><el-button type="primary">绑定微信</el-button></a>
              </td>
            </tr>
            <tr>
              <td class="user-info-table-left"><img style="height:17px;" src="https://jklf.hitb.com.cn/images/integral.jpg" /> 积分</td>
              <td class="user-info-table-right"> {{userObj.user.bp}} </td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-tabs v-model="active" @before-leave="beforeClick" @tab-click="handleClick"
          active-text-color="#0082ff">
          <el-tab-pane label="专家操作记录" name="1"> </el-tab-pane>
          <el-tab-pane label="我的操作记录" name="2" :lazy="true"> </el-tab-pane>
          <el-tab-pane label="规则批量更新上传" name="4" v-if="userObj.user.username != '' && userObj.user.type == '专家用户'"> </el-tab-pane>
        </el-tabs>
        <div v-if="active == '1'">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="el-input el-input-group el-input-group--prepend" style="margin-bottom: 17px;">
                <div class="el-input-group__prepend">用户</div>
                <el-select v-model="recordUser" placeholder="选择用户" class="el-input__inner" style="width: 100%;padding: 0px;" @change="changeUser">
                  <el-option label="全部" value=""> </el-option>
                  <el-option v-for="item in recordUsers" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="getDownload">导出操作记录</el-button>
            </el-col>
          </el-row>
          <el-table :data="datas" :row-style="{background:'#fff',color:'#000'}" border
            :header-cell-style="{background:'#F3F4F7',color:'#000'}" style="width: 100%;">
            <el-table-column prop="mode" label="操作" width="180"> </el-table-column>
            <el-table-column prop="value" label="内容" width="180"> </el-table-column>
            <el-table-column prop="code" label="编码"> </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="type" label="类型"> </el-table-column>
            <el-table-column prop="time" label="时间"> </el-table-column>
            <el-table-column prop="version" label="版本"> </el-table-column>
            <el-table-column prop="user" label="用户"> </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changePage"
            :current-page="page"
            :page-count="pageCount"
            style="margin-top: 10px;">
          </el-pagination>
        </div>
        <div v-if="active == '2'">
          <el-table :data="datas" :row-style="{background:'#fff',color:'#000'}" border
          :header-cell-style="{background:'#F3F4F7',color:'#000'}" style="width: 100%;">
            <el-table-column prop="mode" label="操作" width="180"> </el-table-column>
            <el-table-column prop="value" label="内容" width="180"> </el-table-column>
            <el-table-column prop="code" label="编码"> </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="type" label="类型"> </el-table-column>
            <el-table-column prop="time" label="时间"> </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changePage"
            :current-page="page"
            :page-count="pageCount"
            style="margin-top: 10px;">
          </el-pagination>
        </div>
        <div v-if="active == '3' && userObj.user.type == '专家用户'">
          <a href="https://jklf.hitb.com.cn/static/wt4_example.xlsx">
            <el-button type="primary">下载示例文件</el-button>
          </a>
          <span style="margin-left: 10px">注意: 不可修改第一行内容</span>
          <br /><br />
          <el-upload class="upload-demo" drag action="/upload_csv" :limit="1" :on-success="success" :on-error="uploadError">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div>
          </el-upload>
          <el-form ref="form" v-if="wt4 && wt4.mes === '读取成功'">
            <el-form-item label="分组器版本">
              <el-select @change="changeVersion">
                <el-option :key="'GB开发版'" :label="'GB开发版'" :value="'GB开发版'"> </el-option>
                <el-option :key="'BJ开发版'" :label="'BJ开发版'" :value="'BJ开发版'"> </el-option>
                <el-option :key="'BJ-2017版'" :label="'BJ-2017版'" :value="'BJ-2017版'"> </el-option>
                <el-option :key="'CN-2018B版'" :label="'CN-2018B版'" :value="'CN-2018B版'"> </el-option>
                <el-option :key="'CN-2018T版'" :label="'CN-2018T版'" :value="'CN-2018T版'"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div v-if="loading">
            正在分组--{{ loadingIndex }},请不要进行其他操作...
          </div>
          <div v-else>
            <el-button v-if="wt4 && wt4.mes === '读取成功'" type="primary" v-on:click="submit">提交分组</el-button>
          </div>
          <div v-if="errorWt4">
             <el-alert title="网络链接错误,请重试" type="error"> </el-alert>
          </div>
        </div>
        <div v-if="active == '4' && userObj.user.type == '专家用户'">
         <div class="form-row" style="margin-top: 10px">
            <div class="form-group col-md-1">
              <label for="inputState" style="margin-top: 7px">
                <h5>选择版本</h5>
              </label>
            </div>
            <div class="form-group col-md-2">

              <el-select v-model="changeRuleVersion" placeholder="请选择">
                <el-option v-for="item in changeRuleVersions" :key="item.value" :label="`${item.label}`" :value="item.value"> </el-option>
              </el-select>

              <el-select v-model="changeRuleIcd" placeholder="请选择">
                <el-option label="ICD10" value="ICD10"> </el-option>
                <el-option label="ICD9" value="ICD9"> </el-option>
              </el-select>
            </div>
            <br/>
            <div class="form-group col-md-2">
              <el-button type="primary" v-on:click="exportExplame()">下载{{changeRuleIcd}}批量修订规则示例文件</el-button>
              <span style="margin-left: 10px"><b>注意: 不允许修改前两行,可修改文件名,每次上传和更新的规则,会以文件和操作记录两种形式保存到云端</b></span>
            </div>
          </div>
          <br /><br />
          <el-upload class="upload-demo" drag action="/servers/upload_rule_file" :limit="20" :on-success="ruleSuccess" :on-error="ruleError" :data="{ type: changeRuleIcd, version: changeRuleVersion }">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将{{changeRuleIcd}}批量修订文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div>
          </el-upload>
          <br /><br />
          <p v-for="code in undefinedCode" v-bind:key="code">{{code}}</p>
        </div>
      </el-col>
      <el-col :span="2">&nbsp;</el-col>
    </el-row> 
  </div>
</template>
<script>
import HitbMenu from '../components/HitbMenu.vue'
import { apiRequest, getDefaultHeight } from '../utils'
export default {
  name: 'User',
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
      index: 0,
      datas: [],
      recordUsers: [],
      recordUser: '',
      active: '1',
      page: 0,
      wt4: null,
      wt4_comp: null,
      errorWt4: null,
      wt4_result: [],
      activeNames: ["0"],
      total: null,
      loading: false,
      loadingIndex: 0,
      details: {
        version: "GB",
        year: null
      },
      tabPosition: "标题",
      title: "",
      pageCount: null,
      changeRuleVersions: [],
      changeRuleVersion: '',
      changeRuleIcd: 'ICD10',
      undefinedCode: ''
    }
  },
  mounted() {
  },
  created: function () {
    const { record_user, active, page } = this.$route.query
    this.recordUser = record_user ? record_user : '全部'
    this.active = active ? active : '1'
    this.page = page ? parseInt(page) : 0
    // this.getVersions()
    this.getData();
  },
  methods: {
    getVersions () {
      apiRequest(null, 'get', '/library/get_all_version?type=quick_change_version', null).then(res => {res.versions.forEach(x => {
        this.changeRuleVersions.push({ value: x.value, label: x.text, server_code_info: x.server_code_info })
      });
      })
    },
    success(response, file, fileList) {
      const that = this;
      that.wt4 = response;
      this.errorWt4 = null;
      if (response.mes === "读取成功") {
        this.$message({
          message: "您上传的病案解析成功!",
          type: "success"
        });
      } else {
        this.$message({
          message: "您上传的病案解析失败!",
          type: "error"
        });
      }
    },
    uploadError(err, file, fileList) {
      this.wt4 = null;
      this.errorWt4 = true;
      this.$message({
        message: "您上传的病案解析失败!",
        type: "error"
      });
    },
    ruleSuccess(response, file, fileList) {
      if (response.is_success) {
        // 规则操作
        if (response.undefined_code.length > 0) {
          this.$alert(`文件读取成功,规则修改${response.defined_count}条,不能识别${response.undefined_code.length}条`, '提示', {
            confirmButtonText: '查看不能识别条目',
            callback: action => {
              this.undefinedCode = response.undefined_code
            }
          });
          return true
        }
        // 规则操作
        if (response.defined_count == 0) {
          this.$alert(`文件读取成功,规则修改0条,不能识别0条`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.undefinedCode = ''
            }
          });
          return true
        }
        this.$alert(`文件读取成功,规则修改${response.defined_count}条,不能识别${response.undefined_code.length}条,是否更新规则?`, '提示', {
            confirmButtonText: '更新',
        }).then(() => {
          this.undefinedCode = ''
          this.quickUpdataRule(response.file_name)
        }).catch(_ => {
          this.undefinedCode = response.undefined_code
        });;
      } else {
        this.$confirm(response.mes, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.undefinedCode = ''
        }).catch(_ => {
          this.undefinedCode = ''
        });;
      }
    },
    ruleError(err, file, fileList) {
      this.$message({
        message: "您上传的文件解析失败!",
        type: "error"
      });
      console.log(err)
    },
    changeVersion(version) {
      this.details.version = version;
    },
    quickUpdataRule (file_name) {
      apiRequest(this, 'get', `/servers/quick_updata_rule?file_name=${file_name}&type=${this.changeRuleIcd}&version=${this.changeRuleVersion}`, null).then(res => {
        if (res.is_success) {
          this.$message({ message: res.msg, type: "success" });
          alert(res.msg)
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      })
    },
    getDownload() {
      apiRequest(this, 'get', `/hospitals/hospital_download/download_record`, null).then(res => {
        window.open(res.path)
      })
    },
    getData() {
      const username = this.recordUser === "全部" ? "" : this.recordUser;
      const type = this.active === "1" ? "全部记录" : "个人记录";

      apiRequest(this, 'get', `/servers/record?page=${this.page}&rows=10&username=${username}&type=${type}`, null).then(res => {
        this.pageCount = parseInt(res.page_count);
        this.page = parseInt(this.page);
        this.total = parseInt(res.total)
        this.datas = res.data;
        this.recordUsers = res.record_user;
      })
    },
    changeUser(user) {
      window.location.href = `/hospitals/user_page?page=1&record_user=${user}&active=${this.active}`;
    },
    handleClick(tab, event) {
      this.datas = []
      this.pageCount = 0
      switch (tab.props.name) {
        case "1":
          window.location.href = `/hospitals/user_page?page=1&record_user=全部&active=1`;
          break;
        case "2":
          window.location.href =
            `/hospitals/user_page?page=1&record_user=${this.userObj.user.username}&active=2`;
          break;
        case "3":
          window.location.href = `/hospitals/user_page?page=1&record_user=全部&active=3`;
          break;
        case "4":
          window.location.href = `/hospitals/user_page?page=1&record_user=全部&active=4`;
          break;
        default:
          window.location.href = `/hospitals/user_page?page=1&record_user=全部&active=3`;
          break;
      }
    },
    beforeClick() {
      return false;
    },
    changeWt4(value) {
      const data = {
        drg_admin_user: {
          wt4: value
        }
      }
      apiRequest(this, 'put', `/servers/drg_admin_user/<%=@user.userInfo.id%>`, data).then(res => {
      })
    },
    changePage (page){
      window.location = `/hospitals/user_page?page=${page}&record_user=${this.recordUser}&active=${this.active}`
    },
    generateUrl(page) {
      return `/hospitals/user_page?page=${page.page}&record_user=${
        this.recordUser
      }&active=${this.active}`;
    },
    default_css: function () {
      //初始化进度条
      $("#percent").css("width", "0%");
    },
    file_upload: function (e) {
      this.file = e.target.files[0];
      $("#percent").css("width", "0%");
      $("#percent").html("");
      $("#table").css("display", "none");
    },
    upload_button: function () {
      var xhr = new XMLHttpRequest();
      var fd = new FormData();
      const that = this;
      xhr.upload.addEventListener("progress", this.uploadProgress, false);
      fd.append("file", this.file);
      xhr.open("POST", "/upload_csv", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var data = eval("(" + xhr.responseText + ")");
          that.wt4 = data;
          this.errorWt4 = null;
        } else if (xhr.status !== 200) {
          this.wt4 = null;
          this.errorWt4 = true;
        }
      };
      xhr.send(fd);
    },
    uploadProgress: function (evt) {
      if (evt.lengthComputable) {
        //evt.loaded：文件上传的大小 evt.total：文件总的大小
        var percentComplete = Math.round((evt.loaded * 100) / evt.total);
        //加载进度条，同时显示信息
        // $('#example3').progress({percent: percentComplete});
        $("#percent").html(percentComplete + "%");
        $("#percent").css("width", percentComplete + "%");
      }
    },
    submit: function () {
      this.loading = true;
      apiRequest(this, 'get', `/comp_drg_rule?year=&version=`, null).then(res => {
        this.wt4.data.forEach((x, index) => {
          x.version = this.details.version;
          apiRequest(this, 'post', `/servers/comp_drg`, x).then(res => {
            that.loadingIndex = index + 1;
            this.wt4_result.push([x, res]);
            if (this.wt4.data.length - 1 === index) {
              setTimeout(function () {
                this.$message({ message: "分组成功,正在存储分组结果!", type: "success" });
                // this.save();
              }, 1000);
            }
          })
        });
      })
    },
    save: function () {
      this.wt4_result.forEach((x, index) => {
        const wt4 = x[0];
        const result = x[1];
        const obj = {
          acctual_days: wt4.ACCTUAL_DAYS,
          age: wt4.AGE,
          b_wt4_v1_id: -1,
          disease_code: wt4.DISEASE_CODE,
          gender: wt4.GENDER,
          org_code: -1,
          sf0101: wt4.SF0101,
          sf0100: wt4.SF0100,
          sf0108: wt4.SF0108,
          total_expense: wt4.TOTAL_EXPENSE,
          drg: result.drg,
          log: result.log,
          user: this.userObj.user.username,
          type: "批量分组测试",
          version: this.details.version
        };
        apiRequest(this, 'post', `/servers/wt4_comp`, { wt4_comp: obj }).then(res => {
          this.loadingIndex = index + 1;
          if (this.wt4.data.length - 1 === index) {
            that.loading = false;
            setTimeout(function () {
              that.record();
              this.$message({ message: "存储完成,可在我的病案查看分组结果!", type: "success" });
            }, 1000);
          }
        })
      })
    },
    record () {
      const data = { record: { type: '批量分组测试', name: '-', mode: this.details.version, value: `${this.wt4.data.length}条`, user: this.userObj.user.username, revoke_state: true, code: '-' } }
      apiRequest(this, 'post', `/servers/record`, data).then(res => {
      })
    },
    changeReply(value) {
      this.replyIndex = value;
      this.showReply = !this.showReply;
    },
    exportExplame () {
      if (this.changeRuleVersion === '') {
        this.$message({ message: "请选择版本", type: "info" });
        return true
      }
      switch (this.changeRuleIcd) {
        case 'ICD10':
          if (this.changeRuleVersion === 'rule_merge2021') {
            window.open('https://jklf.hitb.com.cn/download/ICD10批量修改规则示例_merge.xlsx')
          } else {
            window.open('https://jklf.hitb.com.cn/download/ICD10批量修改规则示例.xlsx')
          }
          break;
        default:
          window.open('https://jklf.hitb.com.cn/download/ICD9批量修改规则示例_新.xlsx')
          break;
      }
    }
  }
}
</script>

<style>
  .el-tabs__item.is-active,
  .el-tabs__item:hover {
    color: #0082ff;
  }

  .el-tabs__active-bar {
    background: #0082ff;
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: rgba(67, 172, 149, 0.5) !important;
  }

  .current-row>td {
    background: rgba(67, 172, 149, 0.5) !important;
  }

  .forum-tr:hover>td {
    background-color: rgba(67, 172, 149, 0.5) !important;
  }

  .text.item.user {
    padding: 12px;
    /* margin: 10px; */
    border-bottom: 1px solid rgb(222, 226, 230);
  }
  .row-bg.user {
    border: 1px solid rgb(222, 226, 230);
  }

  .user-info-table-left {
    margin: 0px;
    padding: 10px;
    border-top: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    width: 50%;
  }
  .user-info-table-right {
    margin: 0px;
    padding: 10px;
    border-top: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
    width: 50%;
  }
</style>