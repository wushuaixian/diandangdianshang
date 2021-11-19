<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!--search -->
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="所属平台" prop="entityType">
                <a-select
                  v-model="queryParam.entityType"
                  @change="handleChange_platform"
                  :disabled="$store.state.permission.isPlatform !== 1"
                  placeholder="请选择"
                >
                  <a-select-option :key="item.value" v-for="item in platformType" :value="item.value">
                    {{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
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
            <a-col :span="8">
              <a-form-model-item label="岗位名称" prop="positionName">
                <a-input v-model="queryParam.positionName" placeholder="岗位名称" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker v-model="time" @change="onChange_time" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col align="center">
              <a-space align="center">
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <a-button type="primary" @click="handleAdd">添加</a-button>
      <s-table
        ref="table"
        v-if="(queryParam.entityType && queryParam.entityId) || $store.state.permission.isPlatform === 1"
        rowKey="id"
        name="PostManagementTables"
        :columns="columns"
        :data="init"
      >
        <!--平台-->
        <template slot="entityType" slot-scope="record">
          {{ record.entityType | platformTypeFilter(that) }}
        </template>
        <!--创建时间-->
        <template slot="createTime" slot-scope="record">
          {{ record.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot="operation" slot-scope="record">
          <a-space>
            <a @click="() => handleEdit(record)">编辑</a>
            <a @click="() => handleDel(record.id)">删除</a>
          </a-space>
        </template>
      </s-table>
    </a-card>

    <!--edit-->
    <a-modal
      :visible="visibleModal"
      :confirmLoading="confirmLoading"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="closeModal"
      width="600px"
      okText="保存"
      cancelText="取消"
      destroyOnClose
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item label="所属平台" prop="entityType">
          <a-select
            :disabled="isEdit === true || $store.state.permission.isPlatform !== 1"
            v-model="form.entityType"
            placeholder="请选择"
            @change="handleChange_platform"
          >
            <a-select-option v-for="item in platformType" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属机构" prop="entityId">
          <a-select
            :disabled="isEdit === true || $store.state.permission.isPlatform !== 1"
            v-model="form.entityId"
            show-search
            :filter-option="filterOption"
            placeholder="请选择"
          >
            <a-select-option v-for="(item, index) in organList" :key="index" :value="item.orgId">
              {{ item.enterpriseName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="岗位编码" prop="positionCode">
          <a-input v-model="form.positionCode" :maxLength="20" :disabled="isEdit === true" placeholder="岗位编码" />
        </a-form-model-item>
        <a-form-model-item label="岗位名称" prop="positionName">
          <a-input v-model="form.positionName" :maxLength="20" placeholder="岗位名称" />
        </a-form-model-item>
        <a-form-model-item label="岗位备注" prop="positionDesc">
          <a-input v-model="form.positionDesc" :maxLength="100" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!--edit end-->
  </div>
</template>

<script>
import { queryPositionLists, addPosition, updatePosition, deletePosition } from '@/api/position.js'
import { queryRoleManagementInfo, queryRoleManagementInfoIsPlatform } from '@/api/roleManagement.js'
import constants from '@/config/constants.js'
export default {
  name: 'PostManagement',
  data() {
    return {
      that: this,
      platformType: [],
      organList: [],
      time: [],
      queryParam: {
        entityType: '', // 所属平台
        entityId: '', // 所属机构
        positionName: '', // 岗位名称
        createTimeStart: '',
        createTimeEnd: ''
      },
      columns: [
        { title: '岗位编码', dataIndex: 'positionCode' },
        { title: '岗位名称', dataIndex: 'positionName' },
        { title: '所属平台', key: 'entityType', scopedSlots: { customRender: 'entityType' } },
        { title: '所属机构', dataIndex: 'enterPriseName' },
        { title: '岗位备注', dataIndex: 'positionDesc' },
        { title: '创建时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'operation', fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ],
      tableList: [],
      visibleModal: false,
      confirmLoading: false,
      form: {},
      total: 0,
      isEdit: false,
      rules: {
        entityType: [{ required: true, message: '请选择所属平台', trigger: 'blur' }],
        entityId: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
        positionCode: [
          { required: true, message: '岗位编码不能为空', trigger: 'blur' },
          { validator: this.validate_positionCode, trigger: 'change' },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: '岗位编码不正确',
            trigger: 'change'
          }
        ],
        positionName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' },
          { validator: this.validate_positionName, trigger: 'change' }
        ]
        // positionDesc: [{ validator: this.validate_positionDesc, trigger: 'change' }]
      },
      modalTitle: '新增岗位'
    }
  },
  created() {
    const vm = this
    const id = this.$store.state.permission.isPlatform
    vm.platformType = constants.platformType[id]
    if (this.$store.state.permission.isPlatform !== 1) {
      vm.queryParam.entityType = vm.platformType[0]?.value
      vm.form.entityType = vm.platformType[0]?.value
    }
    this.handleChange_platform(vm.platformType[0]?.value)
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
  methods: {
    validate_positionCode(rule, value, callback) {
      if (value.length > 20) {
        callback(new Error('请输入1-20个字符'))
      } else {
        callback()
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    validate_positionName(rule, value, callback) {
      if (value.length > 20) {
        callback(new Error('请输入1-20个字符'))
      } else {
        callback()
      }
    },
    // validate_positionDesc(rule, value, callback) {
    //   if (value.length > 100) {
    //     callback(new Error('请输入0-100个字符'))
    //   } else {
    //     // callback()
    //   }
    // },
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
      return queryPositionLists({ ...params })
    },
    handleReset() {
      const vm = this
      // vm.$refs.form.resetFields()
      vm.time = []
      if (this.$store.state.permission.isPlatform === 1) {
        vm.$refs.form.resetFields()
      } else {
        vm.queryParam.createTimeEnd = null
        vm.queryParam.createTimeStart = null
        vm.queryParam.positionName = null
      }
      // vm.queryParam.currentPage = 1
      // vm.queryParam.itemsPerPage = 10
      vm.$refs.table.refresh(true)
    },
    handleAdd() {
      const vm = this
      vm.isEdit = false
      vm.modalTitle = '新增岗位'
      vm.form = {}
      vm.form.entityType = vm.platformType[0]?.value
      vm.form.entityId = vm.organList[0]?.orgId
      // vm.organList = []
      // vm.form = {}
      vm.visibleModal = true
    },
    closeModal() {
      const vm = this
      vm.visibleModal = false
    },
    handleOk() {
      const vm = this
      vm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          vm.confirmLoading = true
          const { isEdit } = vm
          if (isEdit === true) {
            vm.updatePosition()
          } else {
            vm.createPosition()
          }
        }
      })
    },
    /**
     * create
     */
    createPosition() {
      const vm = this
      const { form } = vm
      addPosition(form).then((res) => {
        vm.confirmLoading = false
        const { code } = res
        if (code === '0' || code === 0) {
          vm.$refs.table.refresh(true)
          if (this.$store.state.permission.isPlatform === 1) {
            this.$refs.ruleForm.resetFields()
          }
          vm.visibleModal = false
        }
      })
    },
    /**
     * update
     */
    updatePosition() {
      const vm = this
      const { form } = vm
      updatePosition(form).then((res) => {
        vm.confirmLoading = false
        const { code } = res
        if (code === '0' || code === 0) {
          // vm.getList()
          vm.$refs.table.refresh(true)
          if (this.$store.state.permission.isPlatform === 1) {
            this.$refs.ruleForm.resetFields()
          }
        }
        vm.visibleModal = false
      })
    },
    handleChange_platform(value) {
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
              vm.form.entityId = vm.organList[0]?.orgId
              vm.$refs.table.refresh(true)
            }
            // vm.$refs.table.refresh(true)
          }
        }
      })
    },
    onChange_time(val, dateString) {
      const vm = this
      vm.queryParam.createTimeStart = dateString[0]
      vm.queryParam.createTimeEnd = dateString[1]
    },
    handleEdit(row) {
      const vm = this
      vm.isEdit = true
      vm.modalTitle = '编辑岗位'
      vm.form = row
      vm.visibleModal = true
    },
    handleDel(id) {
      const vm = this
      vm.$confirm({
        title: '提示',
        content: '确认删除数据',
        onOk() {
          deletePosition({ id: id }).then((res) => {
            const { code } = res
            if (code === '0' || code === 0) {
              // vm.getList()
              vm.$refs.table.refresh(true)
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped>
</style>
