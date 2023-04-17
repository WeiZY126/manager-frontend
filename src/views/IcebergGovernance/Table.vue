<template>
  <div>
    <el-table :data="tables" style="width: 100%" height="80%">
      <el-table-column fixed prop="name" label="表名" width="300"/>
      <el-table-column prop="location" label="表路径" width="500"/>
      <el-table-column prop="fileNumber" label="最新快照文件数" width="120"/>
      <el-table-column prop="currentSnapshotMillisecond" label="当前快照时间" width="120"/>
      <el-table-column prop="lastMergeMillisecond" label="最后合并时间" width="120"/>
      <el-table-column prop="mergeState" label="合并状态" width="120"/>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default>
          <el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
          <el-button link type="primary" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
      <el-pagination
          background
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'

const currentPage4 = ref(4)
const pageSize = ref(20)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)


export default {
  name: 'Table',
  data() {
    return {
      tables: []
    }
  },
  created() {
    const _this = this
    _this.$axiosGet('/icebergGovernance/table/findByPage/1/5')
        .then(function (res) {
          _this.tables = res.data;
        });
  },
  methods: {
    handleSizeChange(number) {
      const _this = this
      pageSize.value = number;
      _this.$axiosGet('/icebergGovernance/table/findByPage/' + number + '/' + pageSize.value)
          .then(function (res) {
            _this.tables = res.data;
          });
    },
    handleCurrentChange(number) {
      const _this = this
      _this.$axiosGet('/icebergGovernance/table/findByPage/' + number + '/' + pageSize.value)
      .then(function (res) {
        _this.tables = res.data;
      });
    }
  }
}
</script>

<style scoped>

</style>