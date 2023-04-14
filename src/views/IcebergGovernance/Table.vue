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
        <td>{{item.fileNum}}</td>
        <td>{{item.statues}}</td>
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
        fileNum: 1,
        statues: "free"
      },
        {
          name: 22,
          location: "lo2",
          fileNum: 2,
          statues: "no"
        }]
    }
  },
  created() {
    const _this = this
    _this.$axiosGet('/api/icebergGovernance/table/getTableList')
        .then(function (res) {
      console.log(res)
    });
  },
  methods: {}
}
</script>

<style scoped>

</style>