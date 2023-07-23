<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>表模型创建工具</span>
      </div>
    </template>
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules" v-loading="loading">
      <el-form-item label="数据库信息">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="导入Catalog" style="margin-bottom: 0;" prop="catalogId" class="required">
              <el-select v-model="formData.catalogId" class="full-width-input" clearable @change="catalogIdChange">
                <el-option v-for="(item, index) in catalogOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据库" style="margin-bottom: 0;" prop="databaseName" class="required">
              <el-select v-model="formData.databaseName" class="full-width-input" clearable>
                <el-option
                    v-for="item in databaseOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
            </el-form-item>
            <!--            <el-form-item label="库名" style="margin-bottom: 0;" prop="databaseName" class="required">-->
            <!--              <el-input v-model="formData.databaseName" style="width: 100%;"></el-input>-->
            <!--            </el-form-item>-->
          </el-col>
          <el-col :span="8">
            <el-form-item label="表名" style="margin-bottom: 0;" prop="tableName" class="required">
              <el-input v-model="formData.tableName" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="字段信息">
        <el-table :data="formData.columnsList" prop="formData.columnsList" class="required" style="width: 100%">
          <el-table-column prop="name" label="Column Name" class="required">
            <template #default="{row}">
              <el-input v-model="row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="Type" class="required">
            <template #default="{row}">
              <el-autocomplete
                  v-model="row.type"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入字段类型"
                  @select="handleSelect"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="Comment">
            <template #default="{row}">
              <el-input v-model="row.comment"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="notNullable" label="NOT NULL" class="required">
            <template #default="{row}">
              <el-checkbox v-model="row.notNullable"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row, $index}">
              <el-button type="danger" @click="deleteColumn($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addColumn">+ 添加字段</el-button>
        <el-button type="primary" @click="openImportSQL">+ 一键导入</el-button>
      </el-form-item>
      <el-form-item label="分区信息">
        <el-table :data="formData.partitionList" style="width: 100%">
          <el-table-column prop="name" label="Partition Name" class="required">
            <template #default="{row}">
              <el-select v-model="row.name" placeholder="请选择 Column Name">
                <el-option v-for="item in formData.columnsList" :key="item.name" :label="item.name"
                           :value="item.name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="Type" class="required">
            <template #default="{row}">
              <!--              <el-input v-model="row.type"></el-input>-->
              <el-select v-model="row.type" placeholder="Select">
                <el-option
                    v-for="item in partitionTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span
                      style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        "
                  >{{ item.value }}</span
                  >
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="inputParametersValue" label="Input Parameters Value">
            <template #default="{row}">
              <el-input-number
                  v-if="row.type == 'bucket' || row.type == 'truncate'"
                  v-model="row.inputParametersValue"
                  class="mx-4"
                  :min="1"
                  controls-position="right"
                  placeholder="分桶数/truncate偏移量"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row, $index}">
              <el-button type="danger" @click="deletePartition($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="formData.partitionList.length === 0">
          <el-button type="primary" @click="addPartition">+ 添加分区</el-button>
        </div>
        <div v-else>
          <el-button type="primary" circle @click="addPartition" size="small" style="margin-left: 10px;font-size: 20px">
            +
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="删除键/主键">
        <el-select v-model="formData.identifierKeyList" multiple placeholder="可选">
          <el-option v-for="item in formData.columnsList" :key="item.name" :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="自定义表属性" prop="tableConfigData" class="label-right-align">
        <el-cascader
            :options="tableConfigStrategy"
            :props="{ expandTrigger: 'hover' }"
            v-model="tableConfigStrategyValue"
            @change="handleChange"
            placeholder="推荐属性策略(可选)"
        />
        <el-input type="textarea" v-model="tableConfigData" rows="3"
                  placeholder="换行分隔,例:&#13;&#10;format-version=2&#13;&#10;write.format.default=parquet"></el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="项目组" prop="projectTeam">
            <el-input v-model="formData.projectTeam"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户(加密)" prop="kerberosUser" class="required">
            <el-input v-model="formData.kerberosUser" placeholder="请找管理员获取加密用户"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-form-item>
      <el-button type="primary" @click="submitForm">提交创建</el-button>
    </el-form-item>
  </el-card>
  <el-dialog v-model="importSQLOpen"
             :show-close="false"
             :close-on-click-modal="false"
             width="70%"
             custom-class="my-dialog-style">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header-style">
        <h4 :id="titleId" :class="titleClass">导入 SQL 建表语句</h4>
        <div class="my-danger-button">
          <el-button type="danger"  @click="close">
            ×
          </el-button></div>
      </div>
    </template>

    <div class="my-content-style">
      <el-row>
        <el-col :span="24" class="grid-cell">
          <el-input
              type="textarea"
              v-model="fromSQL"
              :rows="20"
              placeholder="请输入 SQL 建表语句，建议只保留字段、主键信息。目前仅能识别 PRIMARY KEY(xx) 指定主键的方式，其他方式请在页面上添加主键。
示例如下:
CREATE TABLE users (
id int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
username varchar(50) NOT NULL COMMENT '用户名',
password decimal(16,0) NOT NULL COMMENT '密码',
email varchar(100) DEFAULT NULL COMMENT '电子邮箱',
created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';"
              class="input-textarea">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="grid-cell">
          <el-button type="primary" @click="submitParse" class="submit-btn">解析</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import {onBeforeUnmount} from 'vue';

export default {
  data() {
    const partitionTypes = [
      {
        value: 'identity',
        label: '默认以字段分区',
      },
      {
        value: 'bucket',
        label: '桶分区',
      },
      {
        value: 'truncate',
        label: 'truncate分区',
      },
      {
        value: 'year',
        label: '隐藏分区-年',
      },
      {
        value: 'month',
        label: '隐藏分区-月',
      },
      {
        value: 'day',
        label: '隐藏分区-日',
      },
      {
        value: 'hour',
        label: '隐藏分区-小时',
      }
    ]
    const columnTypes = [
      {
        value: 'boolean',
        label: 'boolean',
      },
      {
        value: 'int',
        label: 'int',
      },
      {
        value: 'long',
        label: 'long',
      },
      {
        value: 'float',
        label: 'float',
      },
      {
        value: 'double',
        label: 'double',
      },
      {
        value: 'decimal(P,S)',
        label: 'decimal(P,S)',
      },
      {
        value: 'date',
        label: 'date',
      },
      {
        value: 'time',
        label: 'time',
      },
      {
        value: 'timestamp',
        label: 'timestamp',
      },
      {
        value: 'timestampltz',
        label: 'timestampltz',
      },
      {
        value: 'string',
        label: 'string',
      },
      {
        value: 'binary',
        label: 'binary',
      },
      {
        value: 'struct<...>',
        label: 'struct<...>',
      },
      {
        value: 'list<E>',
        label: 'list<E>',
      },
      {
        value: 'map<K, V>',
        label: 'map<K, V>',
      }
    ]
    const tableConfigStrategy = [
          {
            label: '默认',
          },
          {
            label: 'BSS域',
            children: [
              {
                label: 'ODS层',
                children: [
                  {
                    value: 'format-version=2\n' +
                        'comment=表描述信息\n' +
                        'write.upsert.enabled=true\n' +
                        'write.merge.mode=merge-on-read\n' +
                        'write.delete.mode=merge-on-read\n' +
                        'write.update.mode=merge-on-read\n' +
                        'write.distribution-mode=hash\n' +
                        'write.metadata.metrics.default=full\n' +
                        'write.metadata.previous-versions-max=50\n' +
                        'write.metadata.delete-after-commit.enabled=true',
                    label: 'CDC流式接入表',
                  },
                  {
                    value: 'format-version=1\n' +
                        'comment=表描述信息\n' +
                        'write.distribution-mode=hash\n' +
                        'manager.merge.container=stream\n' +
                        'write.metadata.previous-versions-max=50\n' +
                        'write.metadata.delete-after-commit.enabled=true',
                    label: '非CDC流式接入，无行级更新',
                  },
                  {
                    value: 'format-version=1\n' +
                        'comment=表描述信息\n' +
                        'write.metadata.previous-versions-max=50\n' +
                        'write.metadata.delete-after-commit.enabled=true',
                    label: '批式接入，无行级更新',
                  },
                ]
              },
              {
                label: 'DW层',
                children: [
                  {
                    value: 'format-version=2\n' +
                        'comment=表描述信息\n' +
                        'write.upsert.enabled=true\n' +
                        'write.metadata.previous-versions-max = 50\n' +
                        'write.metadata.delete-after-commit.enabled = true',
                    label: '拉链表,行级批量更新',
                  },
                  {
                    value: 'format-version=1\n' +
                        'comment=表描述信息\n' +
                        'write.metadata.previous-versions-max=50\n' +
                        'write.metadata.delete-after-commit.enabled=true',
                    label: '维表/其他表，无行级更新',
                  },
                ]
              },
              {
                label: 'StarRocks外表',
                value: 'format-version=1\n' +
                    'comment=表描述信息\n' +
                    'write.metadata.previous-versions-max=50\n' +
                    'write.metadata.delete-after-commit.enabled=true'
              },
            ],
          },
        ],
        tableConfigData = null;
    return {
      formData: {
        catalogId: null,
        databaseName: '',
        tableName: '',
        partitionList: [],
        columnsList: [{
          name: '',
          type: '',
          comment: '',
          notNullable: false
        }],
        identifierKeyList: [],
        projectTeam: '',
        icebergTableConfig: {},
        kerberosUser: ''
      },
      rules: {
        catalogId: [{
          required: true,
          message: '请输入catalog',
        }],
        databaseName: [{
          required: true,
          message: '请输入库名',
        }],
        tableName: [{
          required: true,
          message: '请输入表名',
        }],
        columnsList: [{
          name: [{
            required: true,
            message: '请输入字段名',
          }],
          type: [{
            required: true,
            message: '请输入字段类型',
          }],
        }],
        projectTeam: [{
          required: true,
          message: '请输入项目组',
        }],
        kerberosUser: [{
          required: true,
          message: '请输入目标端集群用户',
        }]
      },
      newKey: '',
      newValue: '',
      catalogOptions: [],
      databaseOptions: [],
      loading: false,
      partitionTypes,
      columnTypes,
      tableConfigStrategy,
      tableConfigStrategyValue: [],
      tableConfigData,
      importSQLOpen: false,
      fromSQL: '',
    };
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
    querySearch(queryString, cb) {
      const results = queryString ? this.columnTypes.filter(this.createFilter(queryString)) : this.columnTypes;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return option => {
        return option.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
      };
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过后进行提交操作
          console.log(this.formData);
          // 在此处编写提交表单数据的逻辑
          const _this = this
          _this.loading = true;
          _this.parseMapData()
          _this.$axiosPost('/tableOperation/createTable', _this.formData)
              .then(function (res) {
                alert(res.data)
                _this.loading = false;
              });
        }
      })
    },
    submitParse() {
      const _this = this
      if (_this.fromSQL != null && _this.fromSQL != '') {
        // 在此处编写提交表单数据的逻辑
        _this.loading = true;
        _this.$axiosJsonPost('/tableOperation/parseKeyAndColumn', {fromSQL: _this.fromSQL})
            .then(function (res) {
              _this.formData.columnsList = res.data.data.columnsList
              _this.formData.identifierKeyList = res.data.data.identifierKeyList
              _this.loading = false;
              _this.importSQLOpen = false
            });
      } else {
        alert("请输入建表SQL")
      }
    },
    addColumn() {
      this.formData.columnsList.push({
        name: '',
        type: '',
        comment: '',
        notNullable: false
      });
    },
    deleteColumn(index) {
      if (this.formData.columnsList.length > 1) {
        this.formData.columnsList.splice(index, 1);
      } else {
        alert("至少保留一列")
      }
    },
    addPartition() {
      if (this.formData.partitionList.length === 0) {
        this.formData.partitionList.push({
          name: '',
          type: '',
          inputParametersValue: null
        });
      } else {
        this.formData.partitionList.push({
          name: '',
          type: '',
          inputParametersValue: ''
        });
      }
    },
    deletePartition(index) {
      this.formData.partitionList.splice(index, 1);
    },
    addTableConfig() {
      if (this.newKey && this.newValue) {
        this.$set(this.formData.icebergTableConfig, this.newKey, this.newValue);
        this.newKey = '';
        this.newValue = '';
      }
    },
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
    },
    handleChange(value) {
      this.tableConfigData = value.join('');
    },
    catalogIdChange() {
      const _this = this
      _this.loading = true;
      _this.parseMapData()
      if (_this.formData.catalogId != '' && _this.formData.catalogId != null) {
        _this.$axiosGet('/icebergGovernance/namespace/getNameSpaceListByCatalogId/' + _this.formData.catalogId)
            .then(function (res) {
              _this.databaseOptions = res.data;
              _this.loading = false;
            });
      } else {
        _this.databaseOptions = [];
        _this.loading = false;
      }
    },
    openImportSQL() {
      this.importSQLOpen = true;
    }
  },
}
</script>

<style>
.title {
  font-size: 16px;
  margin-right: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 20px;
}

.my-dialog-style {
  border-radius: 6px;
}

.my-dialog-style {
  border-radius: 6px;
}

.my-header-style {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #f2f6fc;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}

.my-danger-button .el-button {
  border-radius: 50%;
  padding: 0;
  background-color: #ff4949;
  color: #fff;
  font-size: 24px;
}


.my-header-style h4 {
  font-size: 20px;
  font-weight: bold;
  color: #3c4858;
}

.my-header-style .el-button {
  font-size: 20px;
  height: auto;
  padding: 0 4px;
  background-color: transparent;
  color: #303133;
}

.my-header-style .el-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.my-content-style {
  padding: 20px;
  background-color: #fff;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}

.my-content-style .input-textarea {
  background-color: #f5f7fa;
  border-radius: 6px;
}

.my-content-style .submit-btn {
  margin-top: 10px;
  width: 100%;
}

.my-content-style .parse-result {
  margin-top: 20px;
}
</style>
