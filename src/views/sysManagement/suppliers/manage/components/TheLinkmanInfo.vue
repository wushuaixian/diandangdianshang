<template>
  <div class="the-link-manInfo">
    <header-title>
      <span>联系人信息</span>
    </header-title>
    <div class="table">
      <s-table :columns="columns" name="TheLinkmanInfoTable" :data="init" :showPagination="false"></s-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          title: '联系人姓名',
          dataIndex: 'name',
          width: 150
        },
        { title: '联系人手机号', width: 170, dataIndex: 'mobileNo' },
        { title: '职务', dataIndex: 'position', width: 150 },
        { title: '联系人邮箱', key: '2', width: 120, dataIndex: 'email' }
      ]
    }
  },
  methods: {
    async init() {
      const { list } = this
      return { data: list }
    }
  }
}
</script>

<style lang="less" scoped>
.the-link-manInfo {
  .table {
    margin-top: 20px;
  }
}
</style>
