<template>
  <div>
    <a-button type="primary" class="button" @click="visible = true">添加类目</a-button>
    <a-modal :footer="null" title="添加设置" width="900px" :visible="visible" @cancel="visible = false">
      <div style="height: 500px">
        <a-input-search v-model="search" placeholder="请输入类目名称" style="width: 376px" />
        <a-transfer
          class="tree-transfer"
          :data-source="dataSource"
          style="margin-top: 24px"
          :titles="['源列表', '已选列表']"
          :list-style="{ width: '200px', height: '400px' }"
          :target-keys="targetKeys"
          :render="(item) => item.title"
          :show-select-all="false"
          @change="onChange"
        >
          <template slot="children" slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }">
            <a-tree
              class="tree"
              v-if="direction === 'left'"
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              :checkedKeys="[...selectedKeys, ...targetKeys]"
              :treeData="treeData"
              @check="(_, props) => onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect)"
              @select="(_, props) => onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect)"
            />
          </template>
        </a-transfer>
        <div style="float: right; margin-top: 15px">
          <a-button @click="visible = false">取消</a-button>
          <a-button type="primary" :disabled="flag" @click="Ok" style="margin-left: 10px">确认</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getAllCategoryList, postGoodsAuditCategoryAdd, postGoodsAuditCategoryGetSelected } from '@/api/goodsConfigure'

const transferDataSource = []
function flatten(list = []) {
  list.forEach((item) => {
    transferDataSource.push(item)
    if (item.children && item.children.length > 0) {
      flatten(item.children)
    }
  })
}
function isChecked(selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}

function handleTreeData(data, targetKeys = []) {
  data.forEach((item) => {
    item['disabled'] = targetKeys.includes(item.key)
    if (item.children) {
      handleTreeData(item.children, targetKeys)
    }
  })
  return data
}

export default {
  data() {
    return {
      visible: false,
      flag: true,
      targetKeys: [],
      oldTargetKeys: [],
      treeDataList: [],
      search: '',
      dataSource: transferDataSource
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    treeData() {
      const sourceData = handleTreeData(this.treeDataList, [...this.targetKeys, ...this.oldTargetKeys])
      const newData = []
      JSON.parse(JSON.stringify(sourceData)).map((x) => {
        if (x.name.includes(this.search)) {
          newData.push({ ...x })
        } else {
          const childList = x.children ? x.children.filter((x) => x.name.includes(this.search)) : []
          if (childList.length > 0) {
            x.children = childList
            newData.push({ ...x })
          }
        }
      })
      return newData
    }
  },
  methods: {
    async getList() {
      const { data } = await getAllCategoryList({})
      this.dataList = data
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          Object.assign(data[i].children, data[i].children)
        }
      }
      this.treeDataList = data
      const res = await postGoodsAuditCategoryGetSelected()
      if (res.code === '0') {
        this.oldTargetKeys = res.data
        this.targetKeys = res.data
      }
      transferDataSource.length = 0
      flatten(handleTreeData(JSON.parse(JSON.stringify(this.treeDataList)), this.oldTargetKeys))
    },
    onChange(targetKeys) {
      this.targetKeys = targetKeys
      this.flag = !targetKeys.length > 0
    },
    onChecked(_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      const list = this.getCheckChild(this.treeData, eventKey, checkedKeys)
      list.forEach((x) => {
        itemSelect(x, !isChecked(checkedKeys, x))
      })
    },
    getCheckChild(treeData, eventKey, checkedKeys) {
      const that = this
      const list = (function getTreeData(treeData) {
        return treeData.find((x) => {
          if (x?.children?.length > 0 && !(x.key === eventKey)) {
            getTreeData(x.children)
            return
          }
          if (!isChecked(checkedKeys, x.key)) {
            that.targetKeys = that.targetKeys.filter((item) => {
              return item !== x.key
            })
          }
          return x.key === eventKey && !isChecked(checkedKeys, x.key)
        })
      })(treeData)
      return [
        ...this.targetKeys,
        eventKey,
        ...(list?.children
          ?.filter((x) => {
            return !isChecked(checkedKeys, x.key)
          })
          ?.map((x) => {
            return x.key
          }) || [])
      ]
    },
    Ok() {
      const keys = [...this.oldTargetKeys, ...this.targetKeys]
      const data = []
      this.dataSource.map((x) => {
        if ((x.level === 2 || x.level === 3) && keys.includes(x.id)) {
          data.push({ id: x.id, level: x.level, pId: x.parentId })
        }
      })
      postGoodsAuditCategoryAdd(data).then((res) => {
        if (res.code === '0') {
          this.$message.success('添加成功')
          this.$emit('ok')
          this.getselectList()
        }
      })
      this.visible = false
    }
  }
}
</script>
<style scoped>
.tree {
  height: 340px;
  overflow-y: scroll;
}
</style>
