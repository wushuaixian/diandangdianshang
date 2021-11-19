<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!--search -->
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商评分方案名称" prop="name">
                <a-input v-model="scoreName" placeholder />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商评分方案编码" prop="name">
                <a-input v-model="scoreCode" placeholder />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="状态">
                <a-select default-value="" v-model="selectValue">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="0"> 停用 </a-select-option>
                  <a-select-option value="1"> 启用 </a-select-option>
                </a-select>
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
      <a-tabs :default-active-key="null" @change="back">
        <a-tab-pane :key="null" tab="全部"> </a-tab-pane>
        <a-tab-pane key="1" tab="静态评分"> </a-tab-pane>
        <a-tab-pane key="2" tab="动态评分"> </a-tab-pane>
        <a-tab-pane key="3" tab="店铺评分"> </a-tab-pane>
      </a-tabs>
      <a-button style="margin-bottom: 16px" type="primary" @click="handleAdd">添加</a-button>
      <s-table
        v-if="(queryParam.platformId && queryParam.entityId) || $store.state.permission.isPlatform === 1"
        ref="table"
        name="SupplierTables"
        rowKey="id"
        :scroll="{ x: 1600 }"
        :columns="columns"
        :data="init"
      >
        <!--platformId-->

        <template slot="isAvailable" slot-scope="record">
          <a-switch v-model="record.isAvailable" @change="(checked) => handleUpdateStatus(checked, record)"></a-switch>
        </template>
        <!--createTime-->
        <template slot="createTime" slot-scope="record">{{
          record.createTime | moment('YYYY-MM-DD HH:mm:ss')
        }}</template>
        <template slot="operation" slot-scope="record">
          <a-space>
            <a @click="() => handleEdit(record, 0)">编辑</a>
            <a @click="() => handleEdit(record, 1)">复制</a>
            <a @click="() => handleDel(record.id, record)">删除</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { queryPlanInfoPage, updateStatus, deleteById } from '@/api/SupplierSettings.js'
// import { accessAuditQuyery } from '@/api/accessAudit'
// import { deleteRole, updateState } from '@/api/role.js'

export default {
  name: 'RoleManagement',
  data() {
    return {
      selectValueTabs: null,
      selectValue: '',
      scoreName: '',
      scoreCode: '',
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
        { title: '供应商评分方案名称', dataIndex: 'scoreName', key: 'scoreName' },
        { title: '供应商评分方案编码', dataIndex: 'scoreCode', key: 'scoreCode' },
        { title: '方案类型', dataIndex: 'scoreTypeStr', key: 'scoreTypeStr' },
        { title: '状态', key: 'isAvailable', scopedSlots: { customRender: 'isAvailable' } },
        { title: '创建人', key: 'createUsername', dataIndex: 'createUsername' },
        { title: '创建时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'operation' }, width: 130 }
      ],
      visibleModal: false,
      confirmLoading: false,
      modalTitle: '添加角色',
      form: {},

      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
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
  created() {},
  mounted() {
    // vm.$refs.table.refresh(true)
  },
  methods: {
    back(value) {
      this.selectValueTabs = value
      // this.query.auditStatus = value
      this.$refs.table.refresh(true)
    },
    handleAdd() {
      this.$router.push({
        name: 'foformSupplierScoringSchemermlist',
        query: { value: 0, formSelect: 0, id: '', nub: '' }
      })
    },
    async init(pagination) {
      const params = {
        ...pagination,
        scoreType: this.selectValueTabs ? parseInt(this.selectValueTabs) : null,
        scoreName: this.scoreName || '',
        scoreCode: this.scoreCode || '',
        isAvailable: this.selectValue
      }

      const AAPromise = await queryPlanInfoPage({ ...params })
      AAPromise.data.listObj.forEach((item) => {
        if (item.isAvailable === '0') {
          item.isAvailable = false
        } else {
          item.isAvailable = true
        }
      })

      return AAPromise
    },

    handleReset() {
      const vm = this

      vm.scoreName = ''
      vm.scoreCode = ''
      vm.selectValue = ''
      vm.$refs.table.refresh(true)
    },

    handleEdit(row, val) {
      this.$router.push({
        name: 'foformSupplierScoringSchemermlist',
        query: { value: 1, formSelect: 1, id: row.id, nub: val }
      })
    },
    handleDel(id, record) {
      const vm = this

      this.$confirm({
        title: '提示',
        content: '确认删除该数据',
        onOk() {
          deleteById({ id: id }).then((res) => {
            const { code } = res

            if (code === '0' || code === 0) {
              vm.$refs.table.refresh(true)
            } else {
              vm.$message.error('方案已被引用，无法删除，如要删除从类目分值菜单删除', 6)
            }
            if (res.data === -1) {
              vm.$message.error('方案已被引用，无法删除，如要删除从类目分值菜单删除', 6)
            }
          })
        },
        onCancel() {}
      })
    },

    handleUpdateStatus(checked, row) {
      const params = {
        id: row.id,
        scoreType: row.scoreType,
        isAvailable: checked === true ? '1' : '0'
      }
      updateStatus(params).then((res) => {
        if (res.code === '0' || res.code === 0) {
          this.$message.success('状态更新成功')
        } else if (res.code === '-2') {
          this.$message.error(res.message)
          this.$refs.table.refresh(false)
        }
      })
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
