<template>
  <div class="add-user">
    <div class="btn">
      <a-button type="primary" :disabled="!info" @click="handleOpen">关联现有员工</a-button>
    </div>
    <a-modal
      wrapClassName="add-user-modal"
      width="960px"
      title="关联员工"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.mobile" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8">
              <a-form-item label="账号">
                <a-input v-model="queryParam.userName" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.identityCardName" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" class="search-btn">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        v-if="visible"
        ref="organizationTableAdd"
        name="organizationTableAdd"
        :loading="loading"
        rowKey="userId"
        :data="init"
        :selected-rowKeys="selectedRowKeys"
        :columns="columns"
        :isCanFilter="false"
        :row-selection="rowSelection"
      ></s-table>
    </a-modal>
  </div>
</template>

<script>
import { queryEmployeeForDepartment, batchAddDepartmentUser } from '@/api/organization'
const columns = [
  {
    title: '姓名',
    dataIndex: 'identityCardName',
    key: 'identityCardName',
    ellipsis: true
  },
  {
    title: '账号',
    dataIndex: 'userName',
    key: 'userName',
    ellipsis: true
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
    ellipsis: true
  }
  // {
  //   title: '所属机构',
  //   dataIndex: 'departmentName',
  //   key: 'departmentName',
  //   ellipsis: true
  // }
]
export default {
  props: {
    info: {
      type: Object,
      default: null
    },
    checkeds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns,
      visible: false,
      confirmLoading: false,
      queryParam: {},
      selectedRowKeys: [],
      loading: false
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: this.checkeds.includes(record.userId)
          }
        })
      }
    }
  },
  methods: {
    async init(params) {
      const { queryParam } = this
      this.loading = true
      const res = await queryEmployeeForDepartment({
        ...params,
        ...queryParam,
        ...{
          departmentType: this.$store.state.organization.departmentType,
          entityId: this.info.entityId
        }
      })
      return res
    },
    handleOpen() {
      // this.$refs.organizationTableAdd.refresh(true)
      this.visible = true
    },
    handleCancel() {
      this.$refs.organizationTableAdd.refresh(true)
      this.visible = false
      this.selectedRowKeys = []
    },
    async handleOk() {
      const {
        info: { id: departmentId },
        selectedRowKeys: userIds
      } = this
      if (userIds.length === 0) {
        this.$message.error('请至少选择一个员工')
        return
      }
      const res = await batchAddDepartmentUser({ departmentId, userIds })
      if (res.code === '0') {
        this.$message.success('关联成功')
        this.visible = false
        this.queryParam = {}
        this.$emit('ok')
      }
    },
    handleSearch() {
      this.$refs.organizationTableAdd.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style lang="less" scoped>
.add-user {
  .btn {
    margin-top: 20px;
  }
}
.add-user-modal {
  .search-btn {
    text-align: center;
  }
  /deep/.ant-table {
    margin-top: 20px;
  }
}
</style>
