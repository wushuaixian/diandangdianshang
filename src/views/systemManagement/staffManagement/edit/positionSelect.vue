<template>
  <a-select
    :disabled="$store.state.permission.isPlatform !== 1"
    allowClear
    placeholder="请选择"
    @change="handleChange"
    v-model="positionId"
  >
    <a-select-option :title="item.positionName" :key="item.id" v-for="item in list" :value="item.id">
      {{ item.positionName }}</a-select-option
    >
  </a-select>
</template>

<script>
import { queryPositionLists } from '@/api/position.js'
export default {
  name: 'PositionSelect',
  props: {
    orgId: {
      type: Number,
      default: -1
    },
    positionId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: [],
      value: null
    }
  },
  created() {
    const vm = this
    vm.getPositionList(vm.orgId)
  },
  methods: {
    getPositionList(orgId) {
      const vm = this
      queryPositionLists({ entityId: orgId, currentPage: 1, itemsPerPage: 100 }).then((res) => {
        if (res.code === 0 || res.code === '0') {
          vm.list = res.data.listObj
        }
      })
    },
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>
</style>
