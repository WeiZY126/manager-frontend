<template>
  <el-form :model="formData" ref="vForm" :rules="rules" label-position="left" label-width="150px"
           size="default" @submit.prevent
           v-loading="loading"
           element-loading-text="Loading..."
           :element-loading-spinner="svg"
           element-loading-svg-view-box="-10, -10, 50, 50"
           element-loading-background="rgba(122, 122, 122, 0.8)">
    <div class="static-content-item">
    </div>
    <div class="static-content-item" v-show="false">
      <el-divider direction="horizontal"></el-divider>
    </div>
    <div class="card-container">
      <el-card style="{width: 100% !important}" shadow="never">
        <template #header>
          <div class="clear-fix">
            <span>导出集群信息</span>
            <i class="float-right el-icon-arrow-down"></i>
          </div>
        </template>
        <el-row>
          <el-col :span="12" class="grid-cell">
            <el-form-item label="Hive连接串" prop="hiveConnection.uri" class="required label-right-align">
              <el-input v-model="formData.hiveConnection.uri" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="hiveConnection.username" class="required label-right-align">
              <el-input v-model="formData.hiveConnection.username" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="hiveConnection.password" class="required label-right-align">
              <el-input v-model="formData.hiveConnection.password" type="password" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1" class="grid-cell">
            <el-form-item label="连接池大小" prop="poolSize" class="label-right-align">
              <el-input-number v-model="formData.hiveConnection.poolSize" class="full-width-input"
                               controls-position="right"
                               :min="0" :max="20" :precision="0" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="连接重试" prop="maxRetry" class="label-right-align">
              <el-input-number v-model="formData.hiveConnection.maxRetry" class="full-width-input"
                               controls-position="right"
                               :min="0" :max="30" :precision="0" :step="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="grid-cell">
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="static-content-item" v-show="false">
      <el-divider direction="horizontal"></el-divider>
    </div>
    <div class="static-content-item">
      <el-divider direction="horizontal"></el-divider>
    </div>
    <div class="card-container">
      <el-card style="{width: 100% !important}" shadow="never">
        <template #header>
          <div class="clear-fix">
            <span>导入集群信息</span>
            <i class="float-right el-icon-arrow-down"></i>
          </div>
        </template>
        <el-row>
          <el-col :span="24" class="grid-cell">
            <el-form-item label="导入Catalog" prop="catalogId" class="required label-right-align">
              <el-select v-model="formData.catalogId" class="full-width-input" clearable>
                <el-option v-for="(item, index) in catalogOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="grid-cell">
            <el-form-item label="导入线程数" prop="threadNum" class="label-right-align">
              <el-input-number v-model="formData.threadNum" class="full-width-input" controls-position="right"
                               :min="1" :max="15" :precision="0" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="导入用户" prop="kerberosUser" class="required label-right-align">
              <el-input v-model="formData.kerberosUser" type="text" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1" class="grid-cell">
            <el-form-item label="是否自定义导入库" prop="isUdfDatabase" class="label-right-align">
              <el-switch v-model="isUdfDatabase"></el-switch>
            </el-form-item>
            <el-form-item label="自定义导入库名" prop="udfDataBase" class="label-right-align" v-if="isUdfDatabase">
              <el-input v-model="formData.udfDataBase" type="text" placeholder="开启后, 所有表都会导入自定义库下" clearable></el-input>
            </el-form-item>
            <el-form-item label="项目组导入" prop="isProjectTeam" class="label-right-align">
              <el-switch v-model="isProjectTeam"></el-switch>
            </el-form-item>
            <el-form-item label="项目组名称" prop="projectTeam" class="label-right-align" v-if="isProjectTeam">
              <el-input v-model="formData.projectTeam" type="text" placeholder="开启后, 所有表都会导入在项目组所属目录下"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="grid-cell">
            <el-form-item label="自定义配置" prop="envConfigFile" class="label-right-align">
              <el-upload
                  v-model:file-list="envConfigFileFileList"
                  class="upload-demo"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :on-change="handleChange"
              >
                <el-button type="primary">上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    xml files with a size less than 500kb
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="static-content-item" v-show="false">
      <el-divider direction="horizontal"></el-divider>
    </div>
    <div class="static-content-item">
      <el-divider direction="horizontal"></el-divider>
    </div>
    <div class="card-container">
      <el-card style="{width: 100% !important}" shadow="never">
        <template #header>
          <div class="clear-fix">
            <span>导入表信息</span>
            <i class="float-right el-icon-arrow-down"></i>
          </div>
        </template>
        <el-row>
          <el-col :span="24" class="grid-cell">
            <el-form-item label="自定义表属性" prop="tableConfigData" class="label-right-align">
              <el-input type="textarea" v-model="tableConfigData" rows="3"
                        placeholder="换行分隔,例:&#13;&#10;format-version=2&#13;&#10;write.format.default=parquet"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="grid-cell">
            <el-form-item label="导出清单类型" prop="listType" class="required label-right-align">
              <el-select v-model="formData.listType" class="full-width-input" clearable>
                <el-option v-for="(item, index) in listTypeOptions" :key="index" :label="item.label"
                           :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表清单" prop="tableList" class="label-right-align" v-if="formData.listType=='list'">
              <el-input type="textarea" v-model="formData.tableList"
                        placeholder="db1 tbl1&#13;&#10;db2 tbl2...&#13;&#10;表数量大于50张建议使用文件方式" rows="3"></el-input>
            </el-form-item>
            <el-form-item label="主机文件路径" prop="udfDataBase" class="label-right-align" v-if="formData.listType=='file'">
              <el-input v-model="formData.filePath" type="text" placeholder="请联系管理员上传文件" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="grid-cell">
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="static-content-item">
      <el-button @click="submitForm">
        提交
      </el-button>

      <el-dialog v-model="visible"
                 :show-close="false"
                 :close-on-click-modal="false"
                 width="70%"
                 :before-close="handleClose"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">
            <h4 :id="titleId" :class="titleClass">执行结果</h4>
            <el-button type="danger" @click="close">
              <!--              <el-icon class="el-icon&#45;&#45;left">-->
              <!--                <CircleCloseFilled/>-->
              <!--              </el-icon>-->
              Close
            </el-button>
          </div>
        </template>
        <el-input
            id="textarea_id"
            type="textarea"
            :rows="20"
            placeholder="wait a moment.."
            v-model="taskLog"
            readonly="">
        </el-input>
      </el-dialog>
      <!--      <el-button @click="submitForm">提交</el-button>-->
    </div>
  </el-form>

</template>

<script>
import {
  defineComponent,
  toRefs,
  reactive,
  getCurrentInstance,
  ref
}
  from 'vue'
import {ElMessageBox} from "element-plus";

export default defineComponent({
  name: 'metaTransformIndex',
  components: {},
  props: {},
  data() {
    const loading = true
    const tableConfigData = null;
    const state = reactive({
      visible: false,
      taskLog: "",
      isUdfDatabase: false,
      isProjectTeam: false,
      formData: {
        hiveConnection: {
          uri: "",
          username: "",
          password: "",
          poolSize: 1,
          maxRetry: 5
        },
        catalogId: null,
        threadNum: 1,
        kerberosUser: null,
        udfDataBase: null,
        envConfigFile: null,
        icebergTableConfig: null,
        listType: null,
        tableList: null,
        filePath: null,
        projectTeam: null
      },
      rules: {
        hiveConnection: {
          uri: [{
            required: true,
            message: '请输入hiveURI',
          }],
          username: [{
            required: true,
            message: '请输入用户名',
          }],
          password: [{
            required: true,
            message: '请输入密码',
          }]
        },
        kerberosUser: [{
          required: true,
          message: '请输入导入用户',
        }],
        listType: [{
          required: true,
          message: '请选择清单类型',
        }],
        catalogId: [{
          required: true,
          message: '请选择要导入的Catalog',
        }]
      },
      catalogOptions: [],
      listTypeOptions: [{
        "label": "清单(推荐)",
        "value": "list"
      }, {
        "label": "文件路径",
        "value": "file"
      }, {
        "label": "数据库(暂不开放)",
        "value": "owner"
      }, {
        "label": "租户(暂不开放)",
        "value": "dbs"
      }],
      envConfigFileFileList: [],
      envConfigFileUploadHeaders: {},
      envConfigFileUploadData: {},
    })
    const instance = getCurrentInstance()
    const submitForm = () => {
      instance.proxy.$refs['vForm'].validate(valid => {
        if (!valid) return
        const _this = this
        _this.loading = true;
        _this.parseMapData()
        _this.taskLog = ""
        // _this.$axiosPost('/metaTransform/test', _this.formData)
        _this.$axiosPost('/metaTransform/createMultiMetaTransformByForm', _this.formData)
            .then(function (res) {
              // alert(res.message)
              _this.loading = false;
              _this.visible = true;
              let taskID = res.data;
              let logUrl = 'ws://134.96.176.241:28781/tasks/log/' + taskID;
              var webSocket = new WebSocket(logUrl);
              webSocket.onopen = function () {
                console.log("open log ws")
              }
              webSocket.onmessage = function (msg) {
                _this.taskLog = _this.taskLog + msg.data + '\r\n';
              }
              webSocket.onclose = function () {
                console.log("close log ws")
              }
            });
      })
    }
    const resetForm = () => {
      instance.proxy.$refs['vForm'].resetFields()
    }

    // const handleClose = (done: () => void) => {
    //   ElMessageBox.confirm('Are you sure to close this dialog?')
    //       .then(() => {
    //         done()
    //       })
    //       .catch(() => {
    //         // catch error
    //       })
    // }

    return {
      loading,
      tableConfigData,
      ...toRefs(state),
      submitForm,
      resetForm
    }
  },
  created() {
    const _this = this
    _this.loading = true;
    _this.$axiosGet('/icebergGovernance/catalog/getCatalogList')
        .then(function (res) {
          _this.catalogOptions = res.data;
          _this.loading = false;
        });
  },
  methods: {
    parseMapData() {
      const mapDataStr = this.tableConfigData
      if (!mapDataStr) {
        return
      }
      const mapDataArr = mapDataStr.split('\n')
      const mapData = new Map()
      mapDataArr.forEach(item => {
        const [key, value] = item.split('=')
        if (key && value) {
          mapData.set(key, value)
        }
      })
      this.formData.icebergTableConfig = Object.fromEntries(mapData)
    }
  }
})

</script>


<style lang="scss">
.el-input-number.full-width-input,
.el-cascader.full-width-input {
  width: 100% !important;
}

.el-form-item--medium {
  .el-radio {
    line-height: 36px !important;
  }

  .el-rate {
    margin-top: 8px;
  }
}

.el-form-item--small {
  .el-radio {
    line-height: 32px !important;
  }

  .el-rate {
    margin-top: 6px;
  }
}

.el-form-item--mini {
  .el-radio {
    line-height: 28px !important;
  }

  .el-rate {
    margin-top: 4px;
  }
}

.clear-fix:before,
.clear-fix:after {
  display: table;
  content: "";
}

.clear-fix:after {
  clear: both;
}

.float-right {
  float: right;
}

.example-showcase .el-loading-mask {
  z-index: 9;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

<style lang="scss" scoped>
div.table-container {
  table.table-layout {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    td.table-cell {
      display: table-cell;
      height: 36px;
      border: 1px solid #e1e2e3;
    }
  }
}

div.tab-container {
}

.label-left-align :deep(.el-form-item__label) {
  text-align: left;
}

.label-center-align :deep(.el-form-item__label) {
  text-align: center;
}

.label-right-align :deep(.el-form-item__label) {
  text-align: right;
}

.custom-label {
}

.static-content-item {
  min-height: 20px;
  display: flex;
  align-items: center;

  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}

</style>