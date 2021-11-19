<template>
  <div class="pagination">
    <div class="l">
      <div class="count">共{{ total }}条</div>
      <a-select
        allowClear
        :getPopupContainer="(triggerNode) => triggerNode.parentNode"
        :default-value="pageSizeOptions[0]"
        style="width: 100px"
        @change="handleChange"
      >
        <a-select-option v-for="item in pageSizeOptions" :key="item" :value="item"> {{ item }}条/页 </a-select-option>
      </a-select>
    </div>
    <a-pagination
      show-quick-jumper
      :default-current="defaultCurrent"
      :total="total"
      :pageSize="pageSize"
      :showQuickJumper="showQuickJumper"
      @change="Change"
    />
  </div>
</template>

<script>
export default {
  props: {
    defaultCurrent: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30', '40', '50']
    },
    showQuickJumper: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: 1
    }
  },
  methods: {
    Change(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.return()
    },
    handleChange(value) {
      this.pageSize = value
      const newPage = Math.floor(this.total / value + (this.total % value > 0 ? 1 : 0))
      this.page = this.page > newPage ? newPage : this.page
      this.return()
    },
    return() {
      this.$emit('update', { page: this.page, limit: this.pageSize })
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  .l {
    display: flex;
    flex-direction: row;
    align-items: center;
    .count {
      font-size: 12px;
      color: #262626;
      letter-spacing: 0;
      line-height: 16px;
      margin-right: 4px;
    }
  }
}
</style>
