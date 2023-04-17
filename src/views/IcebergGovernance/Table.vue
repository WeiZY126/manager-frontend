<template>
  <div>
    <table>
      <tr>
      <td>表名</td>
      <td>位置</td>
      <td>文件数量</td>
      <td>合并状态</td>
      </tr>
      <tr v-for="item in tables">
        <td>{{item.name}}</td>
        <td>{{item.location}}</td>
        <td>{{item.fileNumber}}</td>
        <td>{{item.mergeState}}</td>
      </tr>
    </table>
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: 'Table',
  data() {
    return {
      msg: 'Hello vue',
      tables: [{
        name: 11,
        location: "lo1",
        fileNumber: 1,
        mergeState: "free"
      }]
    }
  },
  created() {
    const _this = this
    _this.$axiosGet('/icebergGovernance/table/getTableList')
        .then(function (res) {
          _this.tables = res.data;
    });
  },
  methods: {}
}
</script>

<style scoped>

</style>