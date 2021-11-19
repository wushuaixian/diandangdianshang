<!--
 * @Author: your name
 * @Date: 2021-07-26 17:12:11
 * @LastEditTime: 2021-08-03 20:08:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/menuPathConfiguration/components/left.vue
-->
<template>
  <div>
    <a-input-group compact class="input-group">
      <d-select v-model="platformId" :options="isPlatformList"></d-select>
      <a-input-search class="input" placeholder="请输入" @search="onSearch" />
    </a-input-group>
    <a-tree v-if="copyList.length > 0" :tree-data="copyList" @select="onSelect" :defaultExpandAll="true">
      <template slot="custom" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>
<script>
import { getAllFunctionByPlatform } from '@/api/configgurationCenter/menuPathConfiguration'
import { treeList, getSearchList } from '../_utils/index'
export default {
  data() {
    return {
      list: [],
      copyList: [],
      platformId: 1,
      searchValue: '',
      autoExpandParent: true,
      isPlatformList: [
        {
          value: 1,
          label: '运营平台'
        },
        {
          value: 6,
          label: '供应商'
        },
        {
          value: 7,
          label: '采购商'
        }
      ]
    }
  },
  mounted() {
    this.getTreeList()
    this.$emit('changeInfo', { platformId: this.platformId })
  },
  watch: {
    platformId(val) {
      this.getTreeList()
      this.$emit('changeInfo', { platformId: val })
    }
  },
  methods: {
    async getTreeList() {
      const { platformId } = this
      const result = await getAllFunctionByPlatform({
        platformId
      })
      this.list = treeList(result.data)
      this.copyList = [...this.list]
    },
    onSelect(selectedKeys, { selected, selectedNodes, node, event }) {
      if (selected) {
        const [item] = selectedNodes
        const {
          data: {
            props: { info }
          }
        } = item
        this.leftSelectedKeys = selectedKeys
        this.$emit('changeInfo', { ...info })
        // this.$emit('changeSelectedKeys', selectedKeys)
      }
      this.selectedKeys = selectedKeys
    },
    async onSearch(value) {
      this.searchValue = value
      if (!value) {
        this.copyList = [...this.list]
        return
      }
      const list = JSON.parse(JSON.stringify(this.list))
      this.copyList = getSearchList(list, value.toLocaleLowerCase())
    }
  }
}
</script>
<style scoped lang="less">
.input-group {
  display: flex;
  /deep/ .ant-input {
    width: 70%;
  }
}
</style>
