<template>
  <a-row type="flex" justify="space-between">
    <a-col :span="14">
      <a-transfer
        class="tree-transfer"
        :titles="['来源', '目标']"
        :data-source="dataSource"
        :filter-option="filterOption"
        :target-keys="targetKeys"
        :render="(item) => item.title"
        :locale="{ itemUnit: '', itemsUnit: '', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }"
        show-search
        @search="handleSearch"
        @change="onChange"
      >
        <template slot="children" slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }">
          <a-tree
            v-if="direction === 'left' && sourceTreeData.length > 0"
            blockNode
            checkable
            multiple
            checkStrictly
            :selectedKeys="filterKeys"
            :checkedKeys="[...selectedKeys, ...targetKeys]"
            :treeData="sourceTreeData"
            @check="
              (_, props) => {
                onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect)
              }
            "
            @select="
              (_, props) => {
                onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect)
              }
            "
          />
        </template>
      </a-transfer>
    </a-col>
    <a-col :span="9">
      <a-card size="small" style="width: 300px">
        <template slot="title"> 菜单预览 </template>
        <template slot="extra"></template>
        <a-tree class="draggable-tree" default-expand-all defaultExpandParent draggable :tree-data="previewMenu" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { queryRoleToOperate } from '@/api/user.js'
import constants from '@/config/constants.js'
import { getAllUserFunctionByRoleIds } from '@/api/function.js'
import { menuTotree } from '@/utils/util.js'
function isChecked(selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}

function handleTreeData(data, targetKeys = []) {
  console.log(data)
  data.forEach((item) => {
    item['disabled'] = targetKeys.includes(item.key)
    if (item.children && item.children.length === 0) {
      item.disableCheckbox = true
    }
    if (item.children) {
      item.children = item.children.map((i) => {
        i.value = item.value
        return i
      })
      handleTreeData(item.children, targetKeys)
    }
  })
  return data
}
export default {
  name: 'Authority',
  data() {
    return {
      targetKeys: [], // 目标已选菜单
      dataSource: [],
      autoExpandParent: true,
      expandedKeys: [],
      checkedKeys: [],
      sourceRole: [],
      sourceTree: [], // 权限来源树
      targetTree: [],
      previewMenu: [], // 预览菜单数据
      originRoleList: [],
      searchLeftValue: '',
      filterKeys: [],
      role: [],
      searchData: ''
    }
  },
  created() {
    const vm = this
    vm.queryRoleToOperateList()
    vm.queryTargetRoleList()
  },
  props: {
    // departmentId: {
    //   type: Number,
    //   require: true,
    //   default: -1
    // }
    entityId: {
      type: Number,
      default: -1
    },
    userId: {
      type: Number,
      default: -1
    }
  },
  computed: {
    sourceTreeData() {
      return handleTreeData(this.sourceTree, this.targetKeys).filter((item) => item.title.indexOf(this.searchData) > -1)
    }
  },
  methods: {
    onChange(targetKeys) {
      this.targetKeys = targetKeys
      this.getPreViewData(targetKeys)
      this.$emit('change', targetKeys, this.originRoleList)
    },
    onChecked(_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    /**
     * description:查询权限列表，组装tree结构
     */
    queryRoleToOperateList() {
      const vm = this
      const platformType = constants.platformType[this.$store.state.permission.isPlatform]
      queryRoleToOperate({ departmentId: vm.entityId }).then((res) => {
        if (res.code === '0' || res.code === 0) {
          const sourceRole = res.data
          vm.role = sourceRole
          const sourceTree = []
          platformType.forEach((item) => {
            const treeItem = { ...item, key: item.value + '', title: item.label, children: [] }

            for (let i = 0; i <= sourceRole.length; i++) {
              const sourceRoleItem = sourceRole[i]
              if (sourceRoleItem && item.value === sourceRoleItem.platformId) {
                treeItem.children.push({
                  ...sourceRoleItem,
                  key: sourceRoleItem.id + '',
                  title: sourceRoleItem.name
                })
              }
            }
            sourceTree.push(treeItem)
          })
          vm.sourceTree = sourceTree
          vm.flatten(JSON.parse(JSON.stringify(sourceTree)))
        }
      })
    },
    queryTargetRoleList() {
      const vm = this
      queryRoleToOperate({ userId: vm.userId, operaDepartmentId: vm.entityId }).then((res) => {
        if (res.code === '0' || res.code === 0) {
          const role = res.data
          const keys = []
          if (role && role.length > 0) {
            role.forEach((item) => {
              keys.push(item.id + '')
            })
            vm.targetKeys = keys
            vm.originRoleList = keys
            vm.getPreViewData(keys)
          }
        }
      })
    },
    flatten(list = []) {
      list.forEach((item) => {
        this.dataSource.push(item)
        this.flatten(item.children)
      })
    },
    getPreViewData(roleIds) {
      const vm = this
      const platformType = constants.platformType[this.$store.state.permission.isPlatform]
      const _treeData = []
      getAllUserFunctionByRoleIds({ roleIds: roleIds }).then((res) => {
        if (res.code === '0' || res.code === 0) {
          const _data = res.data
          platformType.forEach((item) => {
            const obj = {
              key: item.value,
              title: item.label
            }
            obj.children = menuTotree(
              _data.filter((menu) => {
                return menu.platformId === item.value
              }),
              'id',
              'pId',
              'name'
            )
            if (obj.children.length > 0) {
              _treeData.push(obj)
            }
          })
          console.log('_treeData', _treeData)
          vm.previewMenu = _treeData
        }
      })
    },
    handleSearch(direction, value) {
      this.searchData = value
      const vm = this
      const { role } = vm
      const filterKeys = []
      if (direction === 'left') {
        if (value.length > 0) {
          role.forEach((item) => {
            if (item.name.indexOf(value) > -1) {
              console.log('===', item)
              filterKeys.push(item.id + '')
            }
          })
          vm.filterKeys = filterKeys
        } else {
          vm.filterKeys = []
        }
      }
    },
    filterOption(inputValue, option) {
      return option?.title.indexOf(inputValue) > -1
    }
  }
}
</script>

<style scoped>
</style>
