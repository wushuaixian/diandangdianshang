<template>
  <div class="right">
    <a-card title="基本信息" class="base-info">
      <div class="box">
        <div class="title" v-if="info">
          <div class="name" :class="{ cur: info.level === 1 }" @click="info.level === 1 && goInfo()">
            {{ $$(info, 'name') }}
            <span v-if="info" class="departmentType">{{
              departmentTypeList[$store.state.organization.departmentType]
            }}</span>
          </div>
          <a-button
            class="ant-btn-departmentType"
            @click="handleEdit"
            v-if="info.level === 1 && departmentType === '0'"
            :disabled="!info"
          >
            编辑
          </a-button>
        </div>
      </div>
    </a-card>
    <a-card title="员工信息" class="ant-card-head-info"></a-card>
    <a-card class="add-user-card" v-if="info">
      <AddUser
        :info="info"
        :checkeds="checkeds"
        @ok="$refs.queryEmployeePageByIdentityTypeOrganization.refresh(true)"
      />
      <s-table
        ref="queryEmployeePageByIdentityTypeOrganization"
        :loading="loading"
        name="queryEmployeePageByIdentityTypeOrganization"
        :columns="columns"
        :data="queryEmployeePageByIdentityType"
        :row-key="(record) => record.userId"
        :scroll="{ x: 50 }"
      >
        <template v-slot:isAvailable="slotProps">
          <!-- <a-switch @change="handleSwitchEmployee" :checked="slotProps.isAvailable" /> -->
          <div>{{ slotProps === '0' ? '停用' : '启用' }}</div>
        </template>
        <template v-slot:isChargePerson="slotProps, item">
          <a-switch :disabled="!!slotProps" @change="handleSwitchEmployee(item)" :checked="!!slotProps" />
        </template>
        <template v-slot:action="scope">
          <a-button type="link" @click="hanldeRemove(scope)">移除</a-button>
        </template>
      </s-table>
    </a-card>
    <a-drawer
      title="基本信息编辑"
      :width="500"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form-model
        v-if="isEditInfo"
        :model="isEditInfo"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        @submit="handleSubmit"
      >
        <a-form-model-item label="编码">
          <a-input disabled :value="$$(isEditInfo, 'code')" />
        </a-form-model-item>
        <a-form-model-item label="名称" :rules="rules.name">
          <!-- <a-input :value="$$(info, 'name')" /> -->
          <a-input v-model="isEditInfo.name" />
        </a-form-model-item>
        <!-- <a-form-model-item label="组织类型">
          <a-select
            allowClear
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            disabled
            :value="isEditInfo.entityType"
            :options="entityTypeList"
          >
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="关联的组织名称" v-if="isEditInfo.entityType !== 0">
          <a-input disabled :value="isEditInfo.entityName" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-switch @change="handleSwitchChange" :checked="$$(isEditInfo, 'isAvailable') ? true : false" />
        </a-form-model-item>
        <div style="margin-left: 113px">
          <a-button type="primary" html-type="submit">保存</a-button>
        </div>
      </a-form-model>
    </a-drawer>
    <!-- <a-modal
      title="提示"
      :visible="batchDeleteDepartmentUserVisible"
      @ok="batchDeleteDepartmentUserHandleOk"
      @cancel="batchDeleteDepartmentUserVisible = false"
    >
      <img class="img" src="@/assets/images/user/xxx.png" alt="" />
      <div>此操作将从该组织节点删除员工,是否继续?</div> -->
    <!-- </a-modal> -->
  </div>
</template>

<script>
import {
  getCategoryList,
  updateDepartment,
  queryEmployeePageByIdentityType,
  // updateEmployeeStatus,
  batchDeleteDepartmentUser,
  openIsCharge
} from '@/api/organization'
import AddUser from './add'
const columns = [
  {
    title: '账号',
    dataIndex: 'userName',
    key: 'userName',
    width: 200,
    ellipsis: true
  },
  {
    title: '姓名',
    dataIndex: 'identityCardName',
    key: 'identityCardName',
    width: 200,
    ellipsis: true
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
    width: 200,
    ellipsis: true
  },
  // {
  //   title: '邮箱',
  //   dataIndex: 'email',
  //   key: 'email'
  // },
  {
    title: '角色',
    dataIndex: 'roleNmae',
    key: 'roleNmae',
    width: 200,
    ellipsis: true
  },
  {
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'isAvailable' }
  },
  {
    title: '是否部门主管',
    dataIndex: 'isChargePerson',
    key: 'isChargePerson',
    width: 200,
    ellipsis: true,
    scopedSlots: { customRender: 'isChargePerson' }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
    align: 'center'
  }
]
const departmentTypeList = {
  0: '内部机构',
  1: '供应商',
  2: '采购商'
}
export default {
  components: {
    AddUser
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    isChange: {
      type: Number,
      default: 0
    },
    departmentType: {
      type: String,
      default: ''
    }
  },
  watch: {
    info(val) {
      if (val) {
        if (this.$refs.queryEmployeePageByIdentityTypeOrganization) {
          this.$refs.queryEmployeePageByIdentityTypeOrganization.refresh(true)
        }
      } else {
        this.list = []
      }
    }
  },
  data() {
    return {
      columns,
      departmentTypeList,
      loading: false,
      checkeds: [],
      list: [],
      rules: {
        name: [
          { whitespace: true, required: true, message: '请输入名称' },
          {
            min: 1,
            max: 50,
            message: '长度在1到50个字符',
            trigger: 'change'
          }
        ]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      visible: false,
      form: this.$form.createForm(this),
      entityTypeList: [],
      batchDeleteDepartmentUserVisible: false,
      userId: null,
      isEditInfo: this.info
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async batchDeleteDepartmentUserHandleOk() {},
    async hanldeRemove({ userId }) {
      // this.batchDeleteDepartmentUserVisible = true
      this.userId = userId
      this.$confirm({
        title: '提示',
        content: '此操作将从该组织节点删除员工,是否继续?',
        onOk: async () => {
          const {
            info: { id: departmentId }
          } = this
          const res = await batchDeleteDepartmentUser({ userIds: [this.userId], departmentId })
          if (res.code === '0') {
            this.$message.success('变更成功')
            this.batchDeleteDepartmentUserVisible = false
            // this.queryEmployeePageByIdentityType()
            this.$refs.queryEmployeePageByIdentityTypeOrganization.refresh(true)
          }
        },
        onCancel: () => {
          this.info.isAvailable = true
        }
      })
    },
    async queryEmployeePageByIdentityType(params) {
      const {
        info: { id, entityId }
      } = this
      const data = {
        ...params,
        entityId,
        departmentIds: [id]
      }
      this.loading = true
      const res = await queryEmployeePageByIdentityType(data).finally(() => (this.loading = false))
      if (res.code === '0') {
        const { listObj } = res.data
        this.list = listObj
        this.checkeds = listObj.map((x) => x.userId)
        return res
      }
    },
    handleSwitchEmployee({ userId }) {
      const { id } = this.info
      const vm = this
      this.$confirm({
        title: '提示',
        content: '设为部门主管后，将取消原主管的身份，确认设置吗？',
        onOk: async () => {
          // const res = await openIsCharge({ userId: userId, departmentId: entityId })
          const res = await openIsCharge({ userId: userId, departmentId: id })
          if (res.code === '0') {
            vm.$message.success('设置成功')
            // this.queryEmployeePageByIdentityType()
            vm.$refs.queryEmployeePageByIdentityTypeOrganization.refresh(true)
          }
        },
        onCancel: () => {}
      })
    },
    handleSwitchChange(value) {
      if (!value) {
        this.$confirm({
          title: '提示',
          content: '禁用组织可能造成用户数据权限丢失，请谨慎操作',
          onOk: () => {
            this.isEditInfo.isAvailable = false
          },
          onCancel: () => {
            this.isEditInfo.isAvailable = true
          }
        })
      } else {
        this.isEditInfo.isAvailable = value
      }
    },
    async init() {
      const res = await getCategoryList()
      if (res.code === '0') {
        this.entityTypeList = Object.values(res.data).map((x, i) => {
          return {
            label: x,
            value: i
          }
        })
      }
    },
    handleEdit() {
      const {
        departmentType,
        info: { level, entityId }
      } = this
      if (level === 1) {
        this.$router.push({
          name: 'OrganizationDetail',
          params: {
            id: entityId,
            edit: '1',
            departmentType
          }
        })
        return
      }
      this.visible = true
      this.isEditInfo = JSON.parse(JSON.stringify(this.info))
    },
    onClose() {
      this.visible = false
    },
    async handleSubmit(e) {
      e.preventDefault()
      const values = await this.form.validateFields()
      const {
        isEditInfo: { id, name, isAvailable, entityId }
      } = this
      const res = await updateDepartment({ id, name, isAvailable, ...values, entityId })
      if (res.code === '0') {
        this.$message.success('更新成功')
        this.visible = false
        this.$emit('changeInfo', this.isEditInfo)
        this.$emit('change', this.isChange + 1)
      }
    },
    goInfo() {
      const {
        departmentType,
        info: { entityId }
      } = this
      this.$router.push({
        name: 'OrganizationDetail',
        params: {
          id: entityId,
          departmentType,
          edit: '0'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.right {
  width: 100%;
  max-width: 75%;
  min-height: 900px;
  background: #fff;
  .ant-card {
    border-left: none;
  }
  .box {
    // border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
  }
}
.base-info {
  border: none !important;
  /deep/ .ant-card-body {
    padding-bottom: 0px !important;
    /deep/ .box {
      border-bottom: 0px !important;
    }
  }
}
/deep/ .ant-card-head {
  width: 94%;
  margin: 0 auto;
  position: relative;
  margin-bottom: 24px;
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
.ant-card-head-info {
  border: none !important;
  /deep/ .ant-card-head {
    border: none !important;
    margin-bottom: 0px !important;
    border-bottom: 1px solid #eee !important;
  }
  /deep/ .ant-card-body {
    padding-top: 0px !important;
    /deep/ .btn {
      margin-top: 0px !important;
    }
  }
}
.add-user-card {
  max-width: 100%;
  border-bottom: none !important;
  border-top: none !important;
  /deep/ .ant-card-body {
    padding-top: 0px !important;
    border-top: none !important;
  }
}
/deep/ .add-user {
  margin-bottom: 20px;
}
.name {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #262626;
  letter-spacing: 0;
}
.departmentType {
  font-size: 14px;
  color: #ff6b00;
  letter-spacing: 0;
  background: rgba(255, 107, 0, 0.1);
  border-radius: 4px;
  padding: 5px 5px;
  vertical-align: middle;
}
.ant-btn-departmentType {
  border: 1px solid #ff6b00;
  border-radius: 2px;
  font-size: 14px;
  color: #ff6b00;
}
/deep/ .ant-table-placeholder {
  min-height: 500px;
}
/deep/ .ant-empty-normal {
  margin: 200px auto;
}
/deep/ .ant-table-placeholder {
  border-bottom: none !important;
}
/deep/ .ant-modal-content {
  height: 217px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/deep/ .ant-modal-body {
  display: flex;
  justify-content: center;
  align-items: center;
  .img {
    width: 24px;
    height: 24px;
    margin-right: 9px;
  }
  .text {
    width: 350px;
  }
}
/deep/ .ant-modal-footer {
  padding: 12px 20px;
}
.cur {
  cursor: pointer;
}
</style>
