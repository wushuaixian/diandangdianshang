<template>
  <div class="left">
    <a-card class="left-card" title="组织架构">
      <a-tabs v-model="active">
        <a-tab-pane key="1" tab="部门"></a-tab-pane>
        <a-tab-pane key="2" tab="员工"> </a-tab-pane>
      </a-tabs>
      <a-input-search :placeholder="`请输入${active === '1' ? '部门' : '员工'}名称`" @search="onSearch" />
      <a-tabs v-model="departmentType">
        <a-tab-pane key="0" tab="内部机构" v-if="$store.state.permission.isPlatform === 1"></a-tab-pane>
        <a-tab-pane
          key="1"
          tab="供应商"
          v-if="$store.state.permission.isPlatform === 1 || $store.state.permission.isPlatform === 6"
        >
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="采购商"
          v-if="$store.state.permission.isPlatform === 1 || $store.state.permission.isPlatform === 7"
        >
        </a-tab-pane>
      </a-tabs>
      <a-spin :spinning="loading">
        <a-tree
          ref="tree"
          show-icon
          v-if="copyList.length > 0"
          :tree-data="copyList"
          :defaultExpandAll="true"
          :defaultSelectedKeys="leftSelectedKeys"
          @select="handleSelect"
          @load=";(leftSelectedKeys = selectedKeys), $refs.tree.select()"
        >
          <template v-slot:custom="slotProps">
            <img
              class="slotProps-img"
              v-if="slotProps.dataRef.info.level < 2"
              src="@/assets/icon/icon-organization-first.png"
              alt=""
            />
            <img class="slotProps-img" v-else src="@/assets/icon/icon-organization-three.png" alt="" />
            <a-dropdown>
              <span
                v-if="slotProps.title.indexOf(searchValue) > -1"
                :style="{ color: slotProps.style ? '#ff6b00' : '' }"
              >
                {{ slotProps.title.substr(0, slotProps.title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ slotProps.title.substr(slotProps.title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else :style="{ color: slotProps.style ? '#ff6b00' : '' }">{{ slotProps.title }}</span>
              <a-menu slot="overlay" v-if="slotProps.info.level > 0">
                <a-menu-item v-if="slotProps.info.level > 1">
                  <a @click="handleAddNext(slotProps, 'add')">新增同级</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleAddNext(slotProps, 'next')">新增下一级</a>
                </a-menu-item>
                <a-menu-item v-if="slotProps.info.level > 1">
                  <a @click="handleRemove(slotProps.id, slotProps)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-tree>
      </a-spin>
    </a-card>
    <a-modal title="新增下级组织" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="编码">
          <a-input :disabled="true" placeholder="编码自动生成" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  { whitespace: true, required: true, message: '请输入名称' },
                  {
                    min: 1,
                    max: 50,
                    message: '长度在1到50个字符',
                    trigger: 'change'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-switch default-checked @change="onChange" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- <a-modal
      title="提示"
      :visible="queryEmployeePageByIdentityTypeVisible"
      @ok="queryEmployeePageByIdentityTypeVisible = false"
      @cancel="queryEmployeePageByIdentityTypeVisible = false"
    >
      <img class="img" src="@/assets/images/user/xxx.png" alt="" />
      <div class="text">删除部门节点将删除当前及下属所有节点信息（含移除员工），确认继续?</div>
    </a-modal> -->
  </div>
</template>

<script>
import {
  queryDepartmentList,
  addDepartment,
  listByUsername,
  deleteDepartment,
  queryEmployeePageByIdentityType
} from '@/api/organization'
import { treeList, getSearchList, getSearchListFilter } from '../_utils/'
const dataList = []
export default {
  props: {
    isChange: {
      type: Number,
      default: 0
    },
    selectedKeys: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      active: '1',
      departmentType: '0',
      list: [],
      expandedKeys: ['1'],
      visible: false,
      form: this.$form.createForm(this, {}),
      isAvailable: '1',
      parentCode: '',
      leftSelectedKeys: [],
      autoExpandParent: false,
      checkedKeys: [],
      queryEmployeePageByIdentityTypeVisible: false,
      searchValue: '',
      addType: null,
      copyList: []
    }
  },
  watch: {
    isChange() {
      this.init()
    },
    active() {
      this.$emit('changeTab')
    },
    departmentType() {
      const { departmentType } = this
      this.init()
      this.$emit('changeTab')
      this.$emit('changeDepartmentType', departmentType)
    }
  },
  mounted() {
    // console.log(list)
    // isPlatform == 1  平台
    // isPlatform == 6  供应商
    // isPlatform == 7  采购商
    this.init()
    if (this.$store.state.permission.isPlatform === 6) {
      this.departmentType = '1'
    } else if (this.$store.state.permission.isPlatform === 7) {
      this.departmentType = '2'
    }
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
    async init() {
      this.$store.dispatch('ACTION_SET_DEPARTMENT_TYPE', this.departmentType)
      this.loading = true
      const { departmentType } = this
      const res = await queryDepartmentList({
        departmentType,
        platformId: this.$store.state.permission.isPlatform
      }).finally(() => (this.loading = false))
      if (res.code === '0') {
        this.list = treeList(res.data)
        this.copyList = [...this.list]
        this.generateList(this.list)
        ;(function getRoles(_preKey, _tns) {
          return _tns
            ?.map((x, i) => {
              x.scopedSlots = {
                title: 'custom'
              }
              x.key = `${_preKey}-${i}`
              if (x.parentCode === '0') {
                x.disabled = true
              }
              if (x.children && x.children.length > 0) {
                const children = getRoles(x.key, x.children)
                return [...children, x.children]
              }
              return x
            })
            .flat()
        })('0', this.list)
        // console.log(newData, '1312')
      }
    },
    onChange(checked) {
      this.isAvailable = Number(checked)
    },
    handleAddNext(key, type) {
      this.visible = true
      const {
        dataRef: {
          info: { entityId }
        }
      } = key
      this.parentCode = { ...key, entityId }
      // addType 是新增同级还是下级  (next 下级 )
      this.addType = type
    },
    async handleOk() {
      const params = await this.form.validateFields()
      const {
        isAvailable,
        departmentType,
        addType,
        parentCode: {
          entityId,
          info: { code, parentCode }
        }
      } = this
      const res = await addDepartment({
        ...params,
        isAvailable,
        entityId,
        parentCode: addType === 'next' ? code : parentCode,
        departmentType
      })
      if (res.code === '0') {
        this.visible = false
        this.init()
        this.$message.success('新增成功')
        this.form.setFieldsValue({
          code: '',
          name: ''
        })
      }
    },
    handleCancel() {
      this.visible = false
    },
    async handleRemove(id, slotScope) {
      const data = {
        currentPage: 1,
        itemsPerPage: 10,
        departmentIds: [id]
      }
      this.loading = true
      const res = await queryEmployeePageByIdentityType(data).finally(() => (this.loading = false))
      const vm = this
      if (res.code === '0') {
        if (res.data.listObj.length > 0) {
          this.$confirm({
            title: '删除部门节点将删除当前及下属所有节点信息（含移除员工），确认继续?',
            okText: '删除',
            cancelText: '返回',
            async onOk() {
              const res = await deleteDepartment({ id })
              if (res.code === '0') {
                vm.init()
                vm.$message.success('删除成功')
                vm.$emit('changeTab')
              }
            },
            onCancel() {}
          })
        } else {
          const res = await deleteDepartment({ id })
          if (res.code === '0') {
            this.init()
            this.$message.success('删除成功')
            this.$emit('changeTab')
          }
        }
      }
    },
    handleSelect(selectedKeys, { selected, selectedNodes, node, event }) {
      if (!selected) node.selected = true
      if (selected) {
        const [item] = selectedNodes
        const {
          data: {
            props: { info }
          }
        } = item
        this.leftSelectedKeys = selectedKeys
        this.$emit('input', { ...info })
        this.$emit('changeSelectedKeys', selectedKeys)
      } else {
        this.$emit('input', null)
      }
    },
    // filterTreeNode(node) {
    //   console.log(node.title())
    //   // return false
    // },
    async onSearch(value) {
      if (!value) {
        this.copyList = [...this.list]
        return
      }
      this.searchValue = value
      if (this.active === '1') {
        if (!value) {
          this.copyList = [...this.list]
          return
        }
        const list = JSON.parse(JSON.stringify(this.list))
        this.copyList = getSearchList(list, value.toLocaleLowerCase())
      } else {
        const { data } = await listByUsername({
          username: value
        })
        if (data.length === 0) return (this.copyList = [])
        const list = JSON.parse(JSON.stringify(this.list))
        this.copyList = getSearchListFilter(list, data)
        console.log(this.copyList, 'copyList')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.left-card {
  min-height: 900px;
  max-width: 350px;
  // min-width: 350px;
  overflow-x: scroll;
}
/deep/ .ant-card-head {
  width: 87%;
  margin: 0 auto;
  position: relative;
  padding-left: 8px;
}
/deep/ .ant-card-head::after {
  width: 4px;
  height: 16px;
  line-height: 16px;
  background: red;
  display: inline-block;
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translate(0%, -35%);
  background-image: linear-gradient(-180deg, #ff8323 0%, #ff663e 100%);
  border-radius: 2px;
}
/deep/ .ant-card-head-title {
  padding-top: 16px;
  padding-bottom: 8px;
  font-size: 14px;
}
/deep/ .ant-card-body {
  padding-top: 5px;
}
/deep/ .ant-tabs-ink-bar,
.ant-tabs-tab-active {
  width: 64px !important;
}
/deep/ .ant-input-search {
  margin-bottom: 4px;
}
.slotProps-img {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 5px;
}
/deep/ .ant-spin-container {
  height: 700px;
  overflow-y: scroll;
}
// /deep/ .ant-spin-container::-webkit-scrollbar {
//   // display: none;
// }
// /deep/ .ant-modal-content {
//   height: 217px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// }
// /deep/ .ant-modal-body {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   .img {
//     width: 24px;
//     height: 24px;
//     margin-right: 9px;
//   }
//   .text {
//     width: 350px;
//   }
// }
/deep/ .ant-modal-footer {
  padding: 12px 20px;
}
</style>
