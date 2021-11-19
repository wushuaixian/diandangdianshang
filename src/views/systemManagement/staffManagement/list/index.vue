<template>
  <!-- <a-space direction="vertical"> -->
  <div>
    <!--search-->
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!--search -->
        <a-form-model layout="inline" ref="form" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="账号" prop="username" :labelCol="{ style: 'width: 78px' }">
                <a-input v-model="queryParam.username" placeholder />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="姓名" prop="identityCardName" :labelCol="{ style: 'width: 78px' }">
                <a-input v-model="queryParam.identityCardName" placeholder />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="手机号" prop="mobile" :labelCol="{ style: 'width: 78px' }">
                <a-input v-model="queryParam.mobile" placeholder />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="用户类型" prop="userType" :labelCol="{ style: 'width: 78px' }">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.userType"
                  placeholder="请选择"
                >
                  <a-select-option key="all" :value="-1"> 全部 </a-select-option>
                  <a-select-option :key="item.value" v-for="item in userTypes" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="所属机构" prop="orgId">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.orgId"
                >
                  <a-select-option v-for="item in organList" :key="item.orgId" :value="item.orgId">
                    {{ item.enterpriseName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="状态" prop="isAvailable" :labelCol="{ style: 'width: 78px' }">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.isAvailable"
                  placeholder="请选择"
                >
                  <a-select-option key="all" :value="-1"> 全部 </a-select-option>
                  <a-select-option v-for="item in staffStatus" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" align="center">
              <a-space align="center">
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <!--table-->
    <a-card>
      <a-space>
        <a-button
          type="primary"
          @click="
            () => {
              this.$router.push({ name: 'StaffManagementCreate' })
            }
          "
        >
          添加新员工
        </a-button>
        <a-button type="primary" @click="batchHandleDel">批量删除</a-button>
        <a-button type="primary" @click="batchHandleImport">批量导入</a-button>
        <a-button type="primary" @click="viewTaskHandle">查看任务</a-button>
      </a-space>
      <s-table
        name="staffManagementTablese"
        :row-selection="rowSelection"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="init"
      >
        <!--departmentType-->
        <template slot="departmentType" slot-scope="record">
          {{ record.departmentType | departmentTypeFilter(that) }}
        </template>
        <!--isAvailable-->
        <template slot="isAvailable" slot-scope="record">
          <a-switch
            @change="(checked) => handleUpdateStatus(checked, record.id)"
            :default-checked="statusFormatter(record.isAvailable)"
          ></a-switch>
        </template>
        <!--operation-->
        <template slot="operation" slot-scope="record">
          <a-space>
            <a @click="() => handleEdit(record)">编辑</a>
            <a @click="() => handleDel(record.id)">删除</a>
          </a-space>
        </template>
      </s-table>
    </a-card>

    <a-modal
      :visible="showImportModal"
      :confirmLoading="uploading"
      title="批量导入"
      @ok="handleImportOk"
      @cancel="closeImportModal"
      width="600px"
      okText="保存"
      cancelText="取消"
    >
      <a-row>
        <a-col :span="5" align="center"><span>文件上传:</span></a-col>
        <a-col :span="19">
          <a-upload ref="upload" name="file" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
            <a-button>文件上传</a-button>
          </a-upload>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="5"><span></span></a-col>
        <a-col :span="19"><a-button @click="downloadFile" type="link">模板下载</a-button></a-col>
      </a-row>
    </a-modal>
    <a-modal
      :visible="showTaskModal"
      title="查看任务"
      @ok="closeTaskModal"
      @cancel="closeTaskModal"
      width="1000px"
      okText="关闭"
      cancelText="取消"
    >
      <task></task>
    </a-modal>
  </div>
  <!-- </a-space> -->
</template>

<script>
import { queryUserManagementInfo, deleteUsers, updateUserStatus } from '@/api/userManagement.js'
import { queryRoleManagementInfo } from '@/api/roleManagement.js'
import { asyncImport } from '@/api/employee.js'
import constants from '@/config/constants.js'
import Task from '../task/index.vue'
export default {
  name: 'StaffManagement',
  components: {
    Task
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      queryParam: {
        userType: -1,
        isAvailable: -1,
        username: '',
        identityCardName: '',
        mobile: '',
        orgId: ''
      },
      that: this,
      staffStatus: [],
      userTypes: [],
      organList: [],
      columns: [
        { title: '账号', dataIndex: 'username' },
        { title: '姓名', dataIndex: 'identityCardName' },
        { title: '手机号', dataIndex: 'mobile' },
        { title: '用户类型', key: 'departmentType', scopedSlots: { customRender: 'departmentType' } },
        { title: '所属机构', dataIndex: 'enterpriseName' },
        { title: '邮箱', dataIndex: 'email' },
        { title: '状态', key: 'isAvailable', scopedSlots: { customRender: 'isAvailable' } },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
      ],
      selectedRowKeys: [],
      showImportModal: false,
      fileList: [],
      uploading: false,
      showTaskModal: false
    }
  },
  async created() {
    const vm = this
    vm.staffStatus = constants.staffStatus
    vm.userTypes = constants.userTypes
    await this.handleChange_userType()
    // vm.$refs.table.refresh(true)
  },
  computed: {
    rowSelection() {
      const vm = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          vm.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },
  filters: {
    departmentTypeFilter(value, vm) {
      const { userTypes } = vm
      const userType = userTypes.find((item) => {
        return item.value === value || item.value + '' === value
      })
      return userType ? userType.label : ''
    }
  },
  methods: {
    async init(pagination) {
      const { queryParam } = this
      const params = {
        ...pagination,
        ...queryParam
      }
      // filter  Null and Empty string
      // Object.keys(params).forEach((item) => {
      //   if (params[item] === null || params[item] === '') delete params[item]
      //   if (params['userType'] && params['userType'] === -1) delete params.userType
      //   if (params['isAvailable'] && params['isAvailable'] === -1) delete params.isAvailable
      // })
      for (var i in params) {
        if ((params[i] && params[i] === -1) || params[i] === '') delete params[i]
        // if (params['isAvailable'] && params['isAvailable'] === -1) delete params.isAvailable
      }
      const result = await queryUserManagementInfo({ ...params })
      return result
    },
    statusFormatter(value) {
      return value === 1
    },
    handleReset() {
      const vm = this
      vm.$refs.form.resetFields()
      vm.$refs.table.refresh(true)
    },
    handleEdit(row) {
      this.$router.push({ path: `/staff-management/detail/${row.id}` })
    },
    handleDel(id) {
      const vm = this
      vm.$confirm({
        title: '提示',
        content: '确认删除员工数据吗?',
        onOk() {
          deleteUsers([id]).then((res) => {
            if (res.code === '0' || res.code === 0) {
              vm.$message.success('删除成功')
              vm.$refs.table.refresh(true)
            }
          })
        },
        onCancel() {}
      })
    },
    batchHandleDel() {
      const vm = this
      const { selectedRowKeys } = vm
      if (selectedRowKeys.length > 0) {
        vm.$confirm({
          title: '提示',
          content: '确认删除员工数据吗?',
          onOk() {
            deleteUsers(selectedRowKeys).then((res) => {
              if (res.code === '0' || res.code === 0) {
                vm.$message.success('删除成功')
                vm.$refs.table.refresh(true)
              }
            })
          },
          onCancel() {}
        })
      } else {
        vm.$message.warning('请先选择要删除的数据')
      }
    },
    batchHandleImport() {
      const vm = this
      vm.showImportModal = true
    },
    handleImportOk() {
      const vm = this
      const { fileList } = vm
      const formData = new FormData()
      if (fileList.length > 0) {
        console.log('fileList[0]', fileList[0])
        formData.append('fileName', fileList[0].name)
        formData.append('fileData', fileList[0])
      }
      vm.uploading = true
      console.log(fileList, 'fileList')
      asyncImport(formData).then((res) => {
        vm.uploading = false
        if (res.code === '0' || res.code === 0) {
          vm.showImportModal = false
          vm.$message.success('上传成功')
          vm.fileList = []
        }
      })
    },
    closeImportModal() {
      const vm = this
      vm.fileList = []
      vm.showImportModal = false
    },
    downloadFile() {
      const downloadUrl = '/files/departmentUserTemplate.xlsx'
      window.open(downloadUrl)
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    closeTaskModal() {
      const vm = this
      vm.showTaskModal = false
    },
    viewTaskHandle() {
      this.showTaskModal = true
    },
    async handleChange_userType(value) {
      const vm = this

      const res = await queryRoleManagementInfo({ userType: value })
      const { code, data } = res
      if (code === '0' || code === 0) {
        if (data && data.length > 0) {
          vm.organList = data.filter((item) => {
            return item !== null
          }) // 过滤null脏数据
        }
      }
    },
    /**
     * Update status
     * @param checked
     * @param id
     */
    handleUpdateStatus(checked, id) {
      const params = {
        id: id,
        isAvailable: checked === true ? 1 : 0
      }
      updateUserStatus(params).then((res) => {
        if (res.code === '0' || res.code === 0) {
          this.$message.success('状态更新成功')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
