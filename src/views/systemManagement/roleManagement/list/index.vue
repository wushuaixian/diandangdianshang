<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!--search -->
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="所属平台" prop="platformId">
                <a-select
                  allowClear
                  :disabled="$store.state.permission.isPlatform !== 1"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.platformId"
                  @change="handleChange_platform"
                  placeholder="请选择"
                >
                  <a-select-option :key="item.value" v-for="item in platformType" :value="item.value">
                    {{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="所属机构" prop="entityId">
                <a-select
                  allowClear
                  :disabled="$store.state.permission.isPlatform !== 1"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.entityId"
                >
                  <a-select-option v-for="item in organList" :key="item.orgId" :value="item.orgId">{{
                    item.enterpriseName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="角色名" prop="name">
                <a-input v-model="queryParam.name" placeholder />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker v-model="time" @change="onChange_time" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" align="center">
              <!-- <a-space align="center"> -->
              <a-button class="btn" @click="handleReset">重置</a-button>
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <!-- </a-space> -->
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <a-button type="primary" @click="handleAdd">添加角色</a-button>
      <s-table
        v-if="(queryParam.platformId && queryParam.entityId) || $store.state.permission.isPlatform === 1"
        ref="table"
        name="roleManagementTables"
        rowKey="id"
        :scroll="{ x: 1600 }"
        :columns="columns"
        :data="init"
      >
        <!--platformId-->
        <template slot="platformId" slot-scope="record">{{ record.platformId | platformTypeFilter(that) }}</template>
        <template slot="isAvailable" slot-scope="record">
          <a-switch
            :disabled="record.fixedRole === 1"
            v-model="record.isAvailable"
            @change="(checked) => handleUpdateStatus(checked, record)"
          ></a-switch>
        </template>
        <!--createTime-->
        <template slot="createTime" slot-scope="record">{{
          record.createTime | moment('YYYY-MM-DD HH:mm:ss')
        }}</template>
        <template slot="operation" slot-scope="record">
          <a-space v-if="record.fixedRole === 0">
            <a @click="() => handleEdit(record)">编辑</a>
            <a @click="() => handleDel(record.id)">删除</a>
          </a-space>
          <a-space v-else>
            <a @click="() => handleEdit(record)">查看</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
    <a-modal
      :visible="visibleModal"
      :confirmLoading="confirmLoading"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="closeModal"
      okText="保存"
      width="800px"
      cancelText="取消"
    >
      <header-title>
        <span>角色信息</span>
      </header-title>
      <!--information-->
      <a-form-model ref="addForm" :model="addForm" :rules="rules" v-bind="layout">
        <a-form-model-item label="角色名称" prop="name">
          <a-input :disabled="addForm.fixedRole === 1" v-model="addForm.name" placeholder="角色名称" />
        </a-form-model-item>
        <a-form-model-item label="所属平台" prop="platformId">
          <a-select
            :disabled="isEdit === true || addForm.fixedRole === 1 || $store.state.permission.isPlatform !== 1"
            v-model="addForm.platformId"
            placeholder="请选择"
            @change="handleChange_platform"
          >
            <a-select-option v-for="(item, index) in platformType" :key="index" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属机构" prop="entityId">
          <a-select
            :disabled="isEdit === true || addForm.fixedRole === 1 || $store.state.permission.isPlatform !== 1"
            v-model="addForm.entityId"
            show-search
            :filter-option="filterOption"
            placeholder="请选择"
            @change="handleChange_entity"
          >
            <a-select-option v-for="(item, index) in organList" :key="index" :value="item.orgId">
              {{ item.enterpriseName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="角色描述" prop="desc">
          <a-input :disabled="addForm.fixedRole === 1" v-model="addForm.desc" type="textarea" placeholder="角色描述" />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="pisition">
          <a-switch :disabled="addForm.fixedRole === 1" v-model="addForm.isAvailable"></a-switch>
        </a-form-model-item>
      </a-form-model>
      <header-title>
        <span>功能权限</span>
      </header-title>
      <a-space align="baseline">
        <a-card size="small" style="width: 300px">
          <template slot="title">
            <a-checkbox :disabled="addForm.fixedRole === 1" @change="selectAllMenuChange"> 菜单 </a-checkbox>
          </template>
          <template slot="extra">{{ checkedKeys.length + '/' + menus.length }}</template>
          <a-tree
            v-model="checkedKeys"
            checkable
            checkStrictly
            :disabled="addForm.fixedRole === 1"
            :replace-fields="{ key: 'functionId' }"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :defaultCheckedKeys="defaultCheckedKeys"
            :tree-data="menuTree"
            @expand="onExpand"
            @select="onSelect"
            @check="onCheck"
          />
        </a-card>
        <a-card size="small" style="width: 300px">
          <template slot="title">
            <a-checkbox
              :disabled="addForm.fixedRole === 1"
              @change="selectAllButtonChange"
              :checked="currentButtonCheckAll"
            >
              页面按钮
            </a-checkbox>
          </template>
          <template slot="extra">
            {{
              `${
                buttons.filter((item) => {
                  return item.pId === selectedId && item.checked === true
                }).length
              }/${currentButtons.length}`
            }}
          </template>
          <!--<a-checkbox-group @change="handleChange_Button" >-->
          <template v-for="(item, index) in currentButtons">
            <a-checkbox
              :disabled="addForm.fixedRole === 1"
              class="check_function"
              :checked="item.checked"
              @change="handleChange_Button_Item"
              :value="item.functionId"
              :key="index"
            >
              {{ item.name }}
            </a-checkbox>
            <br :key="`br` + index" />
          </template>

          <!-- </a-checkbox-group>-->
        </a-card>
      </a-space>
      <div slot="footer" v-if="addForm.fixedRole === 1">
        <a-button @click="closeModal">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  queryAllRoleDataPage,
  saveRole,
  getRoleById,
  deleteRole,
  updateState,
  updateRoleAndFunction
} from '@/api/role.js'
import { queryRoleManagementInfo, queryRoleManagementInfoIsPlatform } from '@/api/roleManagement.js'
import { getAllRoleFunctionByPlatformAndRoleId } from '@/api/function.js'
import constants from '@/config/constants.js'
import { menuTotree } from '@/utils/util.js'

export default {
  name: 'RoleManagement',
  data() {
    return {
      that: this,
      platformType: [],
      organList: [],
      time: [],
      queryParam: {
        createTimeBegin: null,
        createTimeEnd: null,
        platformId: null,
        name: '',
        entityId: null
      },
      columns: [
        { title: '角色名称', dataIndex: 'name' },
        { title: '所属机构', dataIndex: 'entityName' },
        { title: '所属平台', key: 'platformId', scopedSlots: { customRender: 'platformId' } },
        { title: '状态', key: 'isAvailable', scopedSlots: { customRender: 'isAvailable' } },
        { title: '角色描述', dataIndex: 'desc' },
        { title: '创建时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ],
      initTable: [{}],
      visibleModal: false,
      confirmLoading: false,
      modalTitle: '添加角色',
      form: {},
      functionIds: [],
      addForm: {
        entityId: null,
        name: '',
        platformId: null,
        desc: '',
        isAvailable: true // 状态默认开启
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { validator: this.validate_name, trigger: 'change' }
        ],
        entityId: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
        platformId: [{ required: true, message: '请选择所属平台', trigger: 'blur' }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      buttons: [],
      menus: [],
      menuTree: [],
      checkedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      expandedKeys: [],
      currentButtons: [],
      currentButtonsCheckedList: [],
      currentButtonCheckAll: false, // 当前页面按钮是否全选
      isEdit: false,
      currentButtonsCheckedCount: 0,
      defaultCheckedKeys: [],
      selectedId: -1 // 当前选中的菜单id
    }
  },
  filters: {
    platformTypeFilter(value, vm) {
      const { platformType } = vm
      const platformTypeItem = platformType.find((item) => {
        return item.value === value
      })
      return platformTypeItem ? platformTypeItem.label : ''
    }
  },
  async created() {
    const vm = this
    const id = this.$store.state.permission.isPlatform
    vm.platformType = constants.platformType[id]
    if (this.$store.state.permission.isPlatform !== 1) {
      vm.queryParam.platformId = vm.platformType[0]?.value
      vm.addForm.platformId = vm.platformType[0]?.value
    }
    await this.handleChange_platform(vm.queryParam.platformId)
  },
  mounted() {
    const vm = this
    vm.$refs.table.refresh(true)
  },
  methods: {
    validate_name(rule, value, callback) {
      if (value.length > 20) {
        callback(new Error('请输入1-20个字符'))
      } else {
        callback()
      }
    },
    statusFormatter(value) {
      return value === 1
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleAdd() {
      const vm = this
      vm.isEdit = false
      vm.modalTitle = '添加角色'
      // vm.addForm = { type: true }
      vm.functionIds = []
      vm.selectedKeys = [] // 已选菜单
      vm.checkedKeys = [] // 选中菜单
      vm.currentButtons = []
      vm.menuTree = []
      vm.visibleModal = true
      if (vm.addForm.platformId && vm.addForm.entityId) vm.handleChange_entity(vm.addForm.entityId)
      vm.handleChange_platform(vm.addForm.platformId)
    },
    async init(pagination) {
      const { queryParam } = this
      const params = {
        ...pagination,
        ...queryParam
      }
      // filter  Null and Empty string
      Object.keys(params).forEach((item) => {
        if (params[item] === null || params[item] === '') delete params[item]
      })
      return queryAllRoleDataPage({ ...params })
    },
    handleChange_platform(value) {
      console.log(value)
      const vm = this
      ;(this.$store.state.permission.isPlatform === 1
        ? queryRoleManagementInfo({ departmentType: value })
        : queryRoleManagementInfoIsPlatform()
      ).then((res) => {
        const { code, data } = res
        if (code === '0' || code === 0) {
          if (data && data.length > 0) {
            vm.organList = data.filter((item) => {
              return item !== null
            }) // 过滤null脏数据
            vm.queryParam.entityId = null
            if (this.$store.state.permission.isPlatform !== 1) {
              vm.queryParam.entityId = vm.organList[0]?.orgId
              vm.addForm.entityId = vm.organList[0]?.orgId
              this.$refs.table.refresh(true)
            }
            // vm.$refs.table.refresh(true)
          }
        }
      })
    },
    handleChange_entity(value) {
      const vm = this
      const { platformId } = vm.addForm
      getAllRoleFunctionByPlatformAndRoleId({
        platformId: platformId,
        entityId: value,
        isSystem: this.$store.state.permission.isPlatform !== 1 ? 0 : 1
      }).then((res) => {
        const { code, data } = res
        if (code === '0' || code === 0) {
          const { button, menu } = data || {}
          vm.buttons = button
          vm.menus = menu
          vm.menuTree = menuTotree(JSON.parse(JSON.stringify(menu)), 'id', 'pId', 'name')
          const checkedList = menu.filter((item) => {
            return item.checked === true || item.id === 'Workplace'
          })
          if (checkedList.length > 0) {
            checkedList.forEach((item) => {
              this.onCheck(null, { node: { dataRef: { ...item } }, checked: true })
            })
          }
          const checkedFunctionIds = []
          checkedList.forEach((item) => {
            checkedFunctionIds.push(item.functionId)
          })
          vm.checkedKeys = checkedFunctionIds
        }
      })
    },
    handleReset() {
      const vm = this
      vm.time = []
      if (this.$store.state.permission.isPlatform === 1) {
        vm.$refs.form.resetFields()
      } else {
        vm.queryParam.createTimeBegin = null
        vm.queryParam.createTimeEnd = null
        vm.queryParam.name = ''
      }
      vm.$refs.table.refresh(true)
    },
    onChange_time(val, dateString) {
      const vm = this
      vm.queryParam.createTimeBegin = dateString[0]
      vm.queryParam.createTimeEnd = dateString[1]
    },
    async handleEdit(row) {
      const vm = this
      vm.isEdit = true
      vm.modalTitle = '编辑角色'
      const res = await getRoleById({ id: row.id })
      if (res.code === '0' || res.code === 0) {
        const { isAvailable } = res.data
        vm.addForm = res.data
        vm.addForm.isAvailable = isAvailable === 1
        vm.currentButtons = []
      }
      const resRole = await getAllRoleFunctionByPlatformAndRoleId({
        platformId: row.platformId,
        roleId: row.id,
        entityId: row.entityId,
        isSystem: this.$store.state.permission.isPlatform !== 1 ? 0 : 1
      })
      if (resRole.code === '0' || resRole.code === 0) {
        const { button, menu } = resRole.data || {}
        vm.buttons = button
        vm.menus = menu
        vm.menuTree = menuTotree(menu, 'id', 'pId', 'name')

        // 获取已选 菜单
        const checkedMenus = menu.filter((item) => {
          return item.checked === true
        })
        const checkedKeysTemp = []
        checkedMenus.forEach((item) => {
          checkedKeysTemp.push(item.functionId)
        })

        // 获取已选按钮
        const checkedButtons = button.filter((item) => {
          return item.checked === true
        })
        const functionIds = []
        checkedButtons.forEach((item) => {
          functionIds.push(item.functionId)
        })

        vm.checkedKeys = checkedKeysTemp
        vm.functionIds = functionIds
      }

      const resOrgan = await queryRoleManagementInfo({ departmentType: res.data.platformId })
      if (resOrgan.code === '0' || resOrgan.code === 0) {
        if (resOrgan.data && resOrgan.data.length > 0) {
          vm.organList = resOrgan.data.filter((item) => {
            return item !== null
          }) // 过滤null脏数据
        }
      }

      vm.visibleModal = true
    },
    handleDel(id) {
      const vm = this
      vm.$confirm({
        title: '提示',
        content: '确认删除该数据',
        onOk() {
          deleteRole({ id: id }).then((res) => {
            const { code } = res
            if (code === '0' || code === 0) {
              vm.$refs.table.refresh(true)
            }
          })
        },
        onCancel() {}
      })
    },
    closeModal() {
      const vm = this
      vm.visibleModal = false
      if (this.$store.state.permission.isPlatform === 1) {
        this.addForm = {}
      } else {
        // this.$refs.addForm.resetFields()
        const { platformId, entityId } = this.addForm
        this.addForm = {}
        this.addForm.platformId = platformId
        this.addForm.entityId = entityId
        this.addForm.this.addForm.isAvailable = this.addForm.isAvailable === true ? 1 : 0
      }
    },
    handleOk() {
      const vm = this
      vm.$refs.addForm.validate((valid) => {
        if (valid) {
          vm.confirmLoading = true
          const { isEdit } = vm
          if (isEdit === true) {
            vm.updateRole()
          } else {
            vm.createRole()
          }
        }
      })
    },
    handleUpdateStatus(checked, row) {
      const params = {
        id: row.id,
        entityId: row.entityId,
        isAvailable: checked === true ? 1 : 0
      }
      updateState(params).then((res) => {
        if (res.code === '0' || res.code === 0) {
          this.$message.success('状态更新成功')
        }
      })
    },
    createRole() {
      const vm = this
      const { addForm, menus, buttons } = vm
      const functionIds = []
      const selMenus = menus.filter((item) => {
        return item.checked === true
      })
      const selButtons = buttons.filter((item) => {
        return item.checked === true
      })
      selMenus.forEach((item) => {
        functionIds.push(item.functionId)
      })
      selButtons.forEach((item) => {
        functionIds.push(item.functionId)
      })
      addForm.functionIds = functionIds
      const { isAvailable } = addForm
      addForm.isAvailable = isAvailable === true ? 1 : 0
      saveRole(addForm).then((res) => {
        vm.confirmLoading = false
        const { code } = res
        if (code === '0' || code === 0) {
          vm.$refs.table.refresh(true)
          vm.closeModal()
        }
        vm.visibleModal = false
      })
    },
    updateRole() {
      const vm = this
      const { addForm, menus, buttons } = vm

      const functionIds = []
      const selMenus = menus.filter((item) => {
        return item.checked === true
      })
      const selButtons = buttons.filter((item) => {
        return item.checked === true
      })
      selMenus.forEach((item) => {
        functionIds.push(item.functionId)
      })
      selButtons.forEach((item) => {
        functionIds.push(item.functionId)
      })
      addForm.functionIds = functionIds

      const { isAvailable } = addForm
      addForm.isAvailable = isAvailable === true ? 1 : 0
      updateRoleAndFunction(addForm).then((res) => {
        vm.confirmLoading = false
        const { code } = res
        if (code === '0' || code === 0) {
          vm.$refs.table.refresh(true)
          vm.closeModal()
        }
        vm.visibleModal = false
      })
    },
    /**
     * 如果是勾选，需要关心（当前节点，子节点，父节点）
     * 如果是取消勾选  只需要关心(当前节点、子节点）
     * @param checkedKeys
     * @param e
     */
    onCheck(checkedKeys, e) {
      const vm = this
      const { buttons } = vm
      const id = e.node.dataRef.id
      const pId = e.node.dataRef.pId
      const currentOperationMenu = []

      const parentOperationMenu = []
      if (e.checked === true) {
        vm.checkParentAll(pId, parentOperationMenu)
      }
      // 操作当前节点和子节点
      vm.checkCurrentMenu(id, e.checked, currentOperationMenu)
      const checkedList = vm.menus.filter((item) => {
        return item.checked === true || item.id === 'Workplace'
      })
      const checkedFunctionIds = []
      checkedList.forEach((item) => {
        checkedFunctionIds.push(item.functionId)
      })

      if (e.checked === true) {
        /* 当前操作的菜单,按钮初始化默认值 */
        checkedList.forEach((menu) => {
          buttons.forEach((item) => {
            if (item.pId === menu.id) {
              item.checked = e.checked
            }
          })
        })
      } else {
        currentOperationMenu.forEach((id) => {
          buttons.forEach((item) => {
            if (item.pId === id) {
              item.checked = e.checked
            }
          })
        })
      }
      vm.checkedKeys = checkedFunctionIds
    },
    /**
     *递归更改当前菜单以及子级 状态，返回当前所有操作的菜单id
     **/
    checkCurrentMenu(id, checked, currentOperationMenu) {
      const vm = this
      const { menus } = vm
      menus.forEach((item) => {
        if (item.id === id) {
          item.checked = checked
          currentOperationMenu.push(item.id)
        } else if (item.pId === id) {
          vm.checkCurrentMenu(item.id, checked, currentOperationMenu)
        }
      })
    },
    checkParentAll(pId, parentList) {
      const vm = this
      const { menus } = vm
      const parent = menus.find((item) => {
        return item.id === pId
      })
      if (parent) {
        parent.checked = true
        parentList.push(parent.id)
        vm.checkParentAll(parent.pId, parentList)
      }
    },
    onSelect(selectedKeys, e) {
      const vm = this
      const { buttons, functionIds } = vm
      vm.selectedKeys = selectedKeys

      if (selectedKeys && selectedKeys.length > 0) {
        // 获取当前菜单下可以选择的按钮
        const id = e.selectedNodes[0].componentOptions.propsData.dataRef.id
        const currentButtons = buttons.filter((item) => {
          return item.pId === id
        })
        console.log('currentButtons', currentButtons)
        vm.currentButtons = currentButtons
        vm.selectedId = id
        const currentButtonsCheckedList = currentButtons.filter((item) => {
          return functionIds.indexOf(item.functionId) > -1
        })
        if (currentButtonsCheckedList && currentButtonsCheckedList.length > 0) {
          /* vm.currentButtonsCheckedCount = currentButtonsCheckedList.length */
        }
      }
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    handleChange_Button_Item(e) {
      const vm = this
      const { functionIds, buttons } = vm
      const { checked, value } = e.target
      if (checked === true) {
        vm.functionIds.push(value)
      } else {
        vm.functionIds = functionIds.filter((item) => {
          return item !== value
        })
      }

      const button = buttons.find((item) => {
        return item.functionId === value
      })
      if (button) {
        button.checked = checked
        // 重新获取当前数据
        vm.currentButtons = buttons.filter((item) => {
          return item.pId === button.pId
        })
      }
    },
    /**
     * description:Select All Menu
     */
    selectAllMenuChange(e) {
      const vm = this
      const { menus, buttons } = vm

      if (e.target.checked === true) {
        const checkedKeys = []
        menus &&
          menus.forEach((item) => {
            item.checked = e.target.checked
            checkedKeys.push(item.functionId)
          })
        vm.checkedKeys = checkedKeys
      } else {
        menus &&
          menus.forEach((item) => {
            item.checked = e.target.checked
          })
        vm.checkedKeys = []
      }
      buttons.forEach((item) => {
        item.checked = e.target.checked
      })
    },
    selectAllButtonChange(e) {
      const vm = this
      const { buttons, selectedId } = vm
      const currentButtons = buttons.filter((item) => {
        return item.pId === selectedId
      })
      currentButtons.forEach((item) => {
        item.checked = e.target.checked
      })
      vm.currentButtons = currentButtons
      vm.currentButtonCheckAll = e.target.checked
    }
  }
}
</script>

<style scoped lang="less">
.ant-checkbox-group {
  display: flex;
  flex-direction: column;
}
/deep/ .ant-space {
  width: 100%;
}
.check_function {
  margin-left: unset !important;
}
.btn {
  margin-right: 8px;
}
</style>
