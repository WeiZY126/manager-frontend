<template>
  <el-form :model="formData" ref="vForm" :rules="rules" label-position="left" label-width="80px"
           size="default" @submit.prevent>
    <el-row>
      <el-col :span="12" class="grid-cell">
        <div class="card-container">
          <el-card style="{width: 100% !important}" shadow="never" class="box-card">
            <template #header>
              <div class="clear-fix">
                <span>SQL解析</span>
                <i class="float-right el-icon-arrow-down"></i>
              </div>
            </template>
            <el-form-item label="" label-width="0">
              <el-input type="textarea" v-model="formData.SQL" placeholder="请输入需要解析的SQL，多段SQL以分号分隔" rows="10"></el-input>
            </el-form-item>
            <el-row class="mb-4">
              <el-button type="primary" plain @click="submitForm">提交解析</el-button>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12" class="grid-cell">
        <div class="card-container">
          <el-card style="{width: 100% !important}" shadow="never" class="box-card">
            <template #header>
              <div class="clear-fix">
                <span>解析结果</span>
                <i class="float-right el-icon-arrow-down"></i>
              </div>
            </template>
            <el-table :data="resData" style="width: 100%" max-height="750">
              <el-table-column fixed prop="key" label="SQL" width="150"/>
              <el-table-column prop="value" label="校验结果">
                <template v-slot="{ row }">
                  <div v-html="formatValue(row.value)"></div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>
import {
  defineComponent,
  toRefs,
  reactive,
  getCurrentInstance
}
  from 'vue'

export default defineComponent({
  name:"SQL语法解析",
  components: {},
  props: {},
  data() {
    const state = reactive({
      formData: {
        SQL: "",
      },
      rules: {},
    })
    const instance = getCurrentInstance()
    const submitForm = () => {
      instance.proxy.$refs['vForm'].validate(valid => {
        if (!valid) return
        const _this = this
        _this.$axiosPostWithStringify('/analyze/analyzeSQL', _this.formData)
            .then(function (res) {
              _this.resMap = res.data;
              _this.formatTableData()
            });
      })
    }
    const resetForm = () => {
      instance.proxy.$refs['vForm'].resetFields()
    }
    return {
      resMap: new Map(),
      resData:[],
      ...toRefs(state),
      submitForm,
      resetForm
    }
  },
  methods:{
    formatTableData() {
      this.resData = []
      // 将mapData转换为el-table所需的数据格式
      for (let key in this.resMap) {
        let value = this.resMap[key].join('\n') // List<String>换行连接
        this.resData.push({
          key: '第'+key.toString()+'条',
          value: value
        })
      }
    },
    formatValue(value){
      return value.replace(/\n/g,'<br/>');
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

.box-card {
  min-height: 850px;
}

</style>

<style lang="scss" scoped>
div.table-container {
  table.table-layout {
    width: 100%;
    //border:1px solid black;
    border: black 1px solid;
    //table-layout: fixed;
    //border-collapse: collapse;

    //td.table-cell {
    //  display: table-cell;
    //  height: 36px;
    //  border: 1px solid #e3e1e1;
    //}
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
