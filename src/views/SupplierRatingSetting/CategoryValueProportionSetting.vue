<template>
  <div class="H">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!--search -->
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="类目名称" prop="name">
                <a-input v-model="form.name" placeholder />
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
      <a-button style="margin-bottom: 16px" type="primary" @click="handleAdd">添加</a-button>
      <s-table
        v-if="(queryParam.platformId && queryParam.entityId) || $store.state.permission.isPlatform === 1"
        ref="table"
        name="CategoryValueProportionSetting"
        rowKey="id"
        :scroll="{ x: 1600 }"
        :columns="columns"
        :data="init"
      >
        <!--platformId-->
        <!-- <template slot="platformId" slot-scope="record">{{ record.platformId | platformTypeFilter(that) }}</template> -->
        <template slot="isAvailable" slot-scope="record">
          <a-switch v-model="record.isAvailable" @change="(checked) => handleUpdateStatus(checked, record)"></a-switch>
        </template>
        <!--createTime-->
        <template slot="createTime" slot-scope="record">{{
          record.createTime | moment('YYYY-MM-DD HH:mm:ss')
        }}</template>
        <template slot="operation" slot-scope="record">
          <a-space>
            <a @click="() => handleEdit(record)">编辑</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { updateState } from '@/api/role.js'
import { queryRoleManagementInfo, queryRoleManagementInfoIsPlatform } from '@/api/roleManagement.js'
import { getCategoryList } from '@/api/SupplierSettings.js'

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
        { title: '一级类目', dataIndex: 'oneName', key: 'oneName' },
        { title: '二级类目', dataIndex: 'twoName', key: 'twoName' },
        { title: '静态分值方案', key: 'staticName', dataIndex: 'staticName' },
        { title: '动态分值方案', key: 'moveName', dataIndex: 'moveName' },
        { title: '等级占比方案', key: 'gradeName', dataIndex: 'gradeName' },
        { title: '店铺分值方案', key: 'storeName', dataIndex: 'storeName' },
        { title: '创建人', key: 'createUsername', dataIndex: 'createUsername' },
        { title: '创建时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'operation' }, width: 130 }
      ],
      visibleModal: false,
      confirmLoading: false,
      modalTitle: '添加角色',
      form: {
        name: ''
      },
      functionIds: [],
      addForm: {
        entityId: null,
        name: '',
        platformId: null,
        desc: '',
        isAvailable: true // 状态默认开启
      },

      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    }
  },

  created() {},
  mounted() {
    // vm.$refs.table.refresh(true)
  },
  methods: {
    // 添加方法
    handleAdd() {
      this.$router.push({
        name: 'formCategoryValueProportionSetting',
        params: { add: '0', id: false }
      })
    },
    async init(pagination) {
      const params = {
        ...pagination,
        message: this.form.name
      }
      // filter  Null and Empty string

      const AAPromise = await getCategoryList({ ...params })

      return AAPromise
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
              vm.addForm.entityId = vm.organList[0]?.orgId
              this.$refs.table.refresh(true)
            }
            // vm.$refs.table.refresh(true)
          }
        }
      })
    },

    handleReset() {
      this.form.name = ''
      this.$refs.table.refresh(true)
    },

    handleEdit(row) {
      this.$router.push({
        name: 'formCategoryValueProportionSetting',
        params: { add: '1', id: row.id }
      })
    },

    handleUpdateStatus(checked, row) {
      const params = {
        id: row.id,
        entityId: row.entityId,
        isAvailable: checked === true ? '1' : '0'
      }

      updateState(params).then((res) => {
        if (res.code === '0' || res.code === 0) {
          this.$message.success('状态更新成功')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.H {
  height: calc(100% - 0px);
}
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
