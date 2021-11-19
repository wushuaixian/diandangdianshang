
<template>
  <div class="source-page">
    <a-card>
      <slot></slot>
      <div
        v-if="loginInfo"
        :identityCardName="$$(loginInfo, 'identityCardName')"
        :is="search[active]"
        @search="handleSearch"
        :active="active"
      ></div>
    </a-card>
    <a-card>
      <div ref="tables" :key="tables[active]" v-if="queryParam" :is="tables[active]" :params="queryParam"></div>
    </a-card>
  </div>
</template>

<script>
import { SearchForm } from './search'
import { OrderTable } from './table'
export default {
  props: {
    loginInfo: {
      type: Object,
      default: null
    }
  },
  components: { OrderTable, SearchForm },
  data() {
    return {
      active: 0,
      tables: ['OrderTable'],
      search: ['SearchForm'],
      queryParam: null
    }
  },
  methods: {
    handleSearch(params) {
      const { active, tables } = this
      this.queryParam = { ...params }
      const key = tables[active]
      if (this.$refs?.tables?.$vnode?.key === key) {
        /* eslint-disable no-unused-expressions */
        this.$refs?.tables?.handleSearch(params)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.source-page {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .ant-form {
    margin-top: 25px;
  }
}
</style>
