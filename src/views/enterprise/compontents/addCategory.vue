<template>
  <div class="add-category">
    <a-button type="primary" class="button" @click="visible = true">添加类目</a-button>
    <a-modal
      wrapClassName="add-category-modal"
      title="添加品类"
      width="920px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="visible = false"
    >
      <template slot="footer">
        <a-button key="back" @click="visible = false"> 取消 </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="confirmLoading"
          @click="handleOk"
          :disabled="targetKeys.length == 0"
        >
          保存
        </a-button>
      </template>
      <a-transfer
        :list-style="{
          width: '40%',
          height: '435px'
        }"
        show-search
        class="tree-transfer"
        :titles="['待选列表', '已选列表']"
        :data-source="dataSource"
        :target-keys="targetKeys"
        :show-select-all="false"
        @change="handleChange"
        @search="handleFilter"
        :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
      >
        <template
          slot="children"
          slot-scope="{
            props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
            on: { itemSelectAll, itemSelect }
          }"
        >
          <a-tree
            v-if="direction === 'left' && treeData.length > 0"
            blockNode
            checkable
            checkStrictly
            :checkedKeys="[...selectedKeys, ...targetKeys]"
            :treeData="treeData"
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
          <a-table
            v-if="direction === 'right'"
            childrenColumnName="child"
            :pagination="false"
            :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
            :columns="rightColumns"
            :data-source="filteredItems"
            size="small"
            :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :custom-row="
              ({ key, disabled: itemDisabled }) => ({
                on: {
                  click: () => {
                    if (itemDisabled || listDisabled) return
                    itemSelect(key, !selectedKeys.includes(key))
                  }
                }
              })
            "
          />
        </template>
        <!-- <template
          slot="children"
          slot-scope="{
            props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
            on: { itemSelectAll, itemSelect }
          }"
        >
          <a-table
            :pagination="false"
            :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
            :columns="direction === 'left' ? leftColumns : rightColumns"
            :data-source="filteredItems"
            size="small"
            :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :custom-row="
              ({ key, disabled: itemDisabled }) => ({
                on: {
                  click: () => {
                    if (itemDisabled || listDisabled) return
                    itemSelect(key, !selectedKeys.includes(key))
                  }
                }
              })
            "
          />
        </template> -->
      </a-transfer>
    </a-modal>
  </div>
</template>

<script>
import { getAllCategoryList, getOwenerCategoryList, addCategory } from '@/api/enterprise'
import difference from 'lodash/difference'
import { getSearchList } from '@/views/systemManagement/organization/_utils/'
const leftTableColumns = [
  {
    dataIndex: 'title'
  }
]
const rightTableColumns = [
  {
    dataIndex: 'title'
  }
]
function isChecked(selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}
function getChildren(children) {
  return children?.map((x) => {
    const { id: key, name: title, children } = x
    return {
      key: key + '',
      title,
      description: '',
      disableCheckbox: true,
      disabled: ['1', '2'].includes(x.auditStatus),
      children: x?.children && x?.children?.length > 0 ? getChildren(children) : []
    }
  })
}
export default {
  data() {
    return {
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      visible: false,
      confirmLoading: false,
      dataSource: [],
      targetKeys: [],
      targetList: [],
      treeData: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    async init() {
      await this.getOwenerCategoryList()
      await this.getAllCategoryList()
    },
    handleFilter(direction, value) {
      const list = JSON.parse(JSON.stringify(this.dataSource))
      this.treeData = getSearchList(list, value)
    },
    async getOwenerCategoryList() {
      const { data } = await getOwenerCategoryList({})
      this.targetList = data
      this.targetKeys = data.map((x) => x.id + '')
    },
    async getAllCategoryList() {
      const { targetList } = this
      const { data } = await getAllCategoryList({})
      const list = data?.map((x) => {
        const { id: key, name: title, children } = x
        return {
          key: key + '',
          title,
          description: '',
          disabled: ['1', '2'].includes(x.auditStatus),
          children: getChildren(children)
        }
      })
      this.dataSource = [...list, ...getChildren(targetList)]
      this.treeData = [...list]
      console.log(this.dataSource)
    },
    async handleOk() {
      const { targetKeys: ids, targetKeys, targetList } = this
      if (targetKeys.length === targetList.length) {
        this.$message.error('请选择数据')
        return
      }
      this.confirmLoading = true
      const res = await addCategory({ ids }).finally(() => (this.confirmLoading = false))
      if (res.code === '0') {
        this.visible = false
        this.$message.success('添加成功')
        this.$emit('ok')
      }
    },
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
      this.treeData = this.dataSource.filter((x) => !nextTargetKeys.includes(x.key))
    },
    onChecked(_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add-category {
  .button {
    margin-top: 16px;
  }
}
.add-category-modal {
  .ant-transfer {
    /deep/.ant-tree {
      height: 320px;
      overflow: auto;
    }
    /deep/.ant-table-content {
      height: 300px;
      overflow: auto;
    }
  }
}
</style>
