<!--
 * @Author: your name
 * @Date: 2021-06-26 21:07:33
 * @LastEditTime: 2021-07-12 12:42:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/implement/compoents/waitPage/index.vue
-->
<template>
  <div class="wait-page">
    <a-card>
      <slot></slot>
      <div
        v-if="loginInfo && loading"
        :is="search[active]"
        :identityCardName="$$(loginInfo, 'identityCardName')"
        @search="handleSearch"
        :active="active"
      ></div>
    </a-card>
    <a-card>
      <a-tabs v-model="active" @change="handleTabsChange" v-if="implementActive === 0">
        <a-tab-pane :key="0" :tab="`计划待执行 (${countPendingExecuteObject.pendingExecute || 0})`"> </a-tab-pane>
        <a-tab-pane :key="1" :tab="`长协待下单 (${countPendingExecuteObject.longTermOrder || 0})`"> </a-tab-pane>
        <a-tab-pane :key="2" :tab="`零采待下单 (${countPendingExecuteObject.detailOrder || 0})`"></a-tab-pane>
        <!-- <a-tab-pane key="3" tab="计划已关闭"></a-tab-pane> -->
      </a-tabs>
      <div
        ref="tables"
        :key="tables[active]"
        v-if="queryParam && loading"
        :is="tables[active]"
        @changeCount="handleChangeCount"
        :params="queryParam"
      ></div>
    </a-card>
  </div>
</template>

<script>
import { SearchForm, MatchForm } from './search/'
import { WaitTable, MatchTable } from './table/'
// import { countPendingExecute } from '@/api/projectCarry'
import { mapMutations, mapState } from 'vuex'
// import { getLoginUserInfo } from '@/api/projectCarry'
export default {
  props: {
    loginInfo: {
      type: Object,
      default: null
    },
    activeParser: {
      type: Number,
      default: 0
    }
  },
  components: { WaitTable, SearchForm, MatchTable, MatchForm },
  data() {
    return {
      tables: ['WaitTable', 'MatchTable', 'MatchTable'],
      search: ['SearchForm', 'MatchForm', 'MatchForm'],
      active: 0,
      loading: true,
      queryParam: null
    }
  },
  watch: {
    activeParser() {
      const vm = this
      this.active = 0
      vm.loading = false
      setTimeout(() => {
        vm.loading = true
      }, 300)
    }
  },
  computed: {
    ...mapState({
      implementActive: (state) => state.planManage.implementActive,
      countPendingExecuteObject: (state) => state.planManage.countPendingExecuteObject
    }),
    currentKey() {
      return this.tables[this.active]
    }
  },
  methods: {
    ...mapMutations(['setCountPendingExecuteObject']),
    handleTabsChange() {
      this.queryParam = null
    },
    handleSearch(params) {
      const { active, tables } = this
      this.queryParam = { ...params }
      const key = tables[active]
      if (this.$refs?.tables?.$vnode?.key === key) {
        // eslint-disable-next-line no-unused-expressions
        this.$refs?.tables?.handleSearch(params)
      }
    },
    handleChangeCount() {
      this.$emit('changeCount')
    }
    // async getCountPendingExecute() {
    //   const { data } = await countPendingExecute()
    //   this.countPendingExecuteObject = data
    // }
  }
}
</script>

<style lang="less" scoped>
.wait-page {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .ant-form {
    margin-top: 25px;
  }
}
</style>
