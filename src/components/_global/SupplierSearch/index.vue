<template>
  <div>
    <a-select
      allowClear
      :getPopupContainer="(triggerNode) => triggerNode.parentNode"
      show-search
      placeholder="请输入供应商名称查询"
      :default-active-first-option="false"
      :show-arrow="false"
      v-model="value"
      :filter-option="false"
      :not-found-content="fetching ? undefined : null"
      @search="handleSearch"
      @change="handleChange"
    >
      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
      <a-select-option v-for="item in list" :key="item.orgName" :value="item[valueKey]">
        {{ item.orgName }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { searchCom } from '@/api/contract'
import _ from 'loadsh'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    valueKey: {
      type: String,
      default: 'id'
    }
  },
  name: 'SupplierSearch',
  data() {
    return {
      list: [],
      fetching: false
    }
  },
  created() {
    this.handleSearch = _.debounce(this.handleSearch, 500)
  },
  methods: {
    handleChange(v) {
      this.$emit('input', v)
      this.$emit('change', v)
    },
    async handleSearch(value) {
      if (!value) return
      this.fetching = true
      this.fetching = false
      const res = await searchCom(value)
      this.list = res.data.providerMerchantList
    }
  }
}
</script>

<style lang="less" scoped>
</style>
