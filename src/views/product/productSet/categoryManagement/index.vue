<template>
  <div class="category-management-wrap">
    <!--title-->
    <div class="custom-title"><span>后台商品类目</span></div>
    <div class="custom-content">
      <!--left-->
      <div class="custom-content-left">
        <br />
        <a-input-search placeholder="请输入类目名称" @search="onChange" />
        <br />
        <br />
        <a-space>
          <a-button type="primary" disabled>批量导入</a-button>
          <a-button type="primary" @click="viewTaskHandle">查看任务</a-button>
          <div class="operation-wrap">
            <div class="expanded-btn"><span>收起</span><span></span></div>
          </div>
        </a-space>
        <br />
        <br />
        <a-tree
          v-if="copyMenuTreeData.length > 0"
          v-model="checkedKeys"
          :replaceFields="{ key: 'id', title: 'name' }"
          checkable
          :tree-data="copyMenuTreeData"
          :selected-keys="selectedKeys"
          :autoExpandParent="false"
          @expand="onExpand"
          @select="onSelect"
        >
          <template class="item-icon" v-slot:custom="{ dataRef }">
            <span v-if="dataRef.name.indexOf(searchValue) > -1">
              {{ dataRef.name.substr(0, dataRef.name.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ dataRef.name.substr(dataRef.name.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ dataRef.name }}</span>
            <span class="right">
              <a-icon type="plus" :style="style" @click="editCategory(dataRef, 'add')" />
              <a-icon type="edit" :style="style" @click="editCategory(dataRef, 'edit')" />
              <a-icon type="up" :style="style" @click="positionCategory(dataRef, 'UP')" />
              <a-icon type="down" :style="style" @click="positionCategory(dataRef, 'DOWN')" />
              <a-icon type="caret-up" :style="style" @click="positionCategory(dataRef, 'TOP')" />
              <a-icon type="caret-down" :style="style" @click="positionCategory(dataRef, 'BOTTOM')" />
            </span>
            <!-- <a-menu slot="overlay" v-if="dataRef.level > 0">
              <a-menu-item>
                <a @click="handleAddNext(dataRef)">新增下一级</a>
              </a-menu-item>
              <a-menu-item v-if="dataRef.level > 1">
                <a @click="handleRemove(dataRef.id, dataRef)">删除</a>
              </a-menu-item>
            </a-menu> -->
          </template>
        </a-tree>
      </div>
      <!--right-->
      <div class="custom-content-right">
        <div class="custom-content-right-main" v-if="currentTreeItem.level > 1">
          <header-title>
            <span>类目详情</span>
          </header-title>
          <br />
          <a-row :gutter="24">
            <a-col :span="8">
              <div class="detail-lbl">类目编码：{{ currentTreeItem.categoryCode }}</div>
            </a-col>
            <a-col :span="8">
              <div class="detail-lbl">类目名称：{{ currentTreeItem.name }}</div>
            </a-col>
            <a-col :span="8">
              <div class="detail-lbl">允许自定义属性：{{ currentTreeItem.enableAddAtt }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <div class="detail-lbl">类目负责人：{{ currentTreeItem.identityCardName }}</div>
            </a-col>
            <a-col :span="8">
              <div v-if="currentTreeItem.level === 2" class="detail-lbl">
                保证上限金额：{{ currentTreeItem.highPrice }}
              </div>
            </a-col>
          </a-row>
          <br />
          <!--tabs-->
          <div class="tabs">
            <div class="tabs-scroll">
              <div
                v-for="(item, index) in tabs"
                :class="[`tab-item`, defaultActiveKey === item.key ? 'tab-item-active' : '']"
                :key="index"
                @click="handleTabChange(item.key)"
              >
                <span>{{ item.title }}</span>
              </div>
            </div>
            <div class="tabs-line"></div>
          </div>
          <!--资质类型-->
          <div v-if="defaultActiveKey === 1" class="tab-panel"></div>
          <!--类目负责人-->
          <div v-else-if="defaultActiveKey === 2" class="tab-panel">
            <category-leader :info="categoryLeaderItem" @edit="handleEditOwner"></category-leader>
          </div>
          <!--商品属性-->
          <div v-else-if="defaultActiveKey === 3" class="tab-panel"></div>
          <!--销售属性-->
          <div else class="tab-panel"></div>
        </div>
        <div class="custom-content-right-bottom" v-if="currentTreeItem.level > 1">
          <a-button type="primary" @click="handleSave">保存</a-button>
        </div>
      </div>
    </div>
    <!--关联类目负责人-->
    <a-modal
      :visible="visibleModal"
      :confirmLoading="confirmLoading"
      title="关联类目负责人"
      @ok="handleOk"
      @cancel="closeModal"
      okText="确认"
      width="880px"
      cancelText="取消"
    >
      <category-owner-list v-if="visibleModal" @selectRow="handleSelect"></category-owner-list>
    </a-modal>
    <!--查看任务-->
    <a-modal
      :visible="showTaskModal"
      title="查看任务"
      @ok="closeTaskModal"
      @cancel="closeTaskModal"
      width="1000px"
      okText="关闭"
      cancelText="取消"
    >
      <category-task></category-task>
    </a-modal>
    <edit ref="editCatefory" @refresh="getCategoryMenu" />
  </div>
</template>

<script>
import edit from './components/edit.vue'
import CategoryLeader from './categoryLeader/index.vue'
import CategoryOwnerList from './categoryOwnerList/index'
import CategoryTask from './task/index'
import { queryCategoryTreeMenu, updateCategoryControlInfo, updateCategorySort } from '@/api/categoryControl.js'
const dataList = []
const style = { color: '#1890FF' }
const getParentKey = (id, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.id === id)) {
        node.children.some((item) => (parentKey = item.key))
      } else if (getParentKey(id, node.children)) {
        parentKey = getParentKey(id, node.children)
      }
    }
  }
  return parentKey
}
export default {
  name: 'CategoryManagement',
  components: {
    CategoryLeader,
    CategoryOwnerList,
    CategoryTask,
    edit
  },
  data() {
    return {
      visibleModal: false,
      checkedKeys: [],
      expandedKeys: [],
      checkedRow: [],
      autoExpandParent: true,
      selectedKeys: [],
      defaultActiveKey: 2,
      style,
      tabs: [
        {
          key: 1,
          title: '资质类型'
        },
        {
          key: 2,
          title: '类目负责人'
        },
        {
          key: 3,
          title: '商品属性'
        },
        {
          key: 4,
          title: '销售属性'
        }
      ],
      menuTreeData: [],
      copyMenuTreeData: [],
      currentTreeItem: {},
      confirmLoading: false,
      searchValue: '',
      modalSelectRows: {},
      categoryLeaderItem: {},
      showTaskModal: false,
      firstCategoryId: null
    }
  },
  created() {
    const vm = this
    vm.getCategoryMenu()
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const id = node.id
        const name = node.name
        const title = node.title
        dataList.push({ id, name, title })
        if (node.children) {
          this.generateList(node.children)
        }
      }
      this.treetreeData = dataList
    },
    onSelect(selectedKeys, info) {
      const vm = this
      const { identityCardName, username, mobile } = info.node._props.dataRef
      vm.currentTreeItem = info.node._props.dataRef
      /* tab页里面显示的 类目负责人 */
      vm.categoryLeaderItem = {
        identityCardName,
        username,
        mobile
      }
      vm.selectedKeys = selectedKeys
    },
    handleTabChange(key) {
      this.defaultActiveKey = key
    },
    getCategoryMenu() {
      const vm = this
      queryCategoryTreeMenu({}).then((res) => {
        if (res.code === '0' || res.code === 0) {
          vm.menuTreeData = res.data
          vm.copyMenuTreeData = vm.menuTreeData
          this.firstCategoryId = res.data[0]?.id
          this.generateList(this.menuTreeData)
          const newData = (function getRoles(_preKey, _tns) {
            return _tns
              ?.map((x, i) => {
                x.scopedSlots = {
                  title: 'custom'
                }
                if (x.parentId === 0) x.name = '平台类目'
                x.key = `${_preKey}-${i}`
                if (x.parentCode === '0') {
                  x.disabled = true
                }
                if (x.userId) {
                  x.disableCheckbox = true
                }
                if (x.children && x.children.length > 0) {
                  const children = getRoles(x.key, x.children)
                  return [...children, x.children]
                }
                return x
              })
              .flat()
          })('0', this.menuTreeData)
          console.log(newData, '1312')
        }
      })
    },
    handleOk() {
      const vm = this
      vm.categoryLeaderItem = vm.modalSelectRows
      vm.visibleModal = false
    },
    closeModal() {
      const vm = this
      vm.visibleModal = false
    },
    /**
     * 编辑负责人
     */
    handleEditOwner() {
      const vm = this
      vm.visibleModal = true
    },
    handleSelect(row) {
      // 暂存此对象，当点击保存时再赋值给
      this.modalSelectRows = row
    },
    handleSave() {
      const vm = this
      // currentTreeItem
      const { categoryLeaderItem, checkedKeys, selectedKeys } = vm
      const { id } = categoryLeaderItem || {}
      const params = [...checkedKeys, ...selectedKeys].map((item) => {
        return {
          id: item,
          userControlId: id
        }
      })
      updateCategoryControlInfo(params).then((res) => {
        if (res.code === '0' || res.code === 0) {
          vm.$message.success('修改成功')
          vm.getCategoryMenu()
        }
      })
    },
    viewTaskHandle() {
      this.showTaskModal = true
    },
    closeTaskModal() {
      const vm = this
      vm.showTaskModal = false
    },
    onChange(e) {
      // const value = e.target.value
      const value = e
      const expandedKeys = dataList
        .map((item) => {
          if (item.name.indexOf(value) > -1) {
            return getParentKey(item.id, this.menuTreeData)
          }
          return null
        })
        .filter((item, i, self) => {
          return item && self.indexOf(item) === i
        })
      const newData = (function getRoles(_tns) {
        return _tns
          ?.map((x, i) => {
            if (x.name.indexOf(value) !== -1) {
              return x
            }
            if (x.children && x.children.length) {
              return getRoles(x.children)
            }
          })
          .flat()
      })(this.menuTreeData).filter((x) => {
        return x
      })
      console.log(newData, '1312')
      this.copyMenuTreeData = newData
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    editCategory(dataRef, type) {
      const { level, id } = dataRef
      this.$refs.editCatefory.init(type === 'edit' ? dataRef : { level, parentId: id }, type)
    },
    async positionCategory(dataRef, type) {
      const { firstCategoryId } = this
      const params = {
        firstCategoryId,
        id: dataRef.id,
        moveType: type
      }
      const result = await updateCategorySort(params)
      if (result.code === '0') {
        this.$message.success('移动成功')
        this.getCategoryMenu()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.category-management-wrap {
  height: 100%;
  min-height: 700px;
  background-color: #ffffff;
  .custom-title {
    background-color: #f8f9fa;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    span {
      color: #262626;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .custom-content {
    display: flex;
    .custom-content-left {
      min-height: 660px;
      width: 420px;
      border-right: 1px solid #e5e5e5;
      padding: 0 14px;
      .operation-wrap {
        width: 100px;
        text-align: right;
        .expanded-btn {
          font-size: 14px;
          color: #262626;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
    .custom-content-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .custom-content-right-main {
        flex: 1;
        padding: 24px;
        .detail-lbl {
          font-size: 14px;
          color: #262626;
          font-weight: 400;
        }
        .tabs {
          height: 48px;
          .tabs-scroll {
            height: 48px;
            display: flex;
            flex-direction: row;
            .tab-item {
              width: 120px;
              height: 48px;
              background: #f9f9f9;
              border: 1px solid #e5e5e5;
              text-align: center;
              line-height: 48px;
              cursor: pointer;
              margin-right: 4px;
              span {
                font-size: 14px;
                color: #262626;
                font-weight: 500;
              }
            }
            .tab-item-active {
              height: 49px !important;
              border-top: 3px solid #ff6b00;
              background: #ffffff;
              border-bottom-color: #ffffff;
              span {
                color: #ff6b00;
              }
            }
          }
          .tabs-line {
            height: 1px;
            background-color: #e5e5e5;
          }
        }
      }
      .custom-content-right-bottom {
        flex: 0 0 64px;
        border-top: 1px solid #e5e5e5;
        height: 64px;
        line-height: 64px;
        text-align: center;
      }
    }
  }
}
/deep/ .ant-tree-title {
  display: flex;
  justify-content: space-between;
  position: relative;
  span {
    i {
      margin-left: 2px;
    }
  }
  .right {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.item-icon {
  position: relative;
  .right {
    position: absolute;
    right: 0;
    top: 0;
  }
}
/deep/ .ant-tree::-webkit-scrollbar {
  display: none;
}
/deep/ .ant-tree {
  max-height: 650px;
  max-width: 400px;
  width: 400px;
  overflow: scroll;
}
</style>
