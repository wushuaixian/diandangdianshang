<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!--search -->
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商等级占比方案名称" prop="name">
                <a-input v-model="name" placeholder />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商等级占比方案编码" prop="name">
                <a-input v-model="code" placeholder />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="状态">
                <a-select default-value="" v-model="selectValue" @change="handleChange">
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
      <a-button style="margin-bottom: 16px" type="primary" @click="handleAdd">添加</a-button>
      <s-table
        v-if="(queryParam.platformId && queryParam.entityId) || $store.state.permission.isPlatform === 1"
        ref="table"
        name="SupplierTablesProgramme"
        rowKey="id"
        :scroll="{ x: 1600 }"
        :columns="columns"
        :data="init"
      >
        <!--platformId-->
        <template slot="platformId" slot-scope="record">{{ record.platformId | platformTypeFilter(that) }}</template>
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
import { queryRoleManagementInfo, queryRoleManagementInfoIsPlatform } from '@/api/roleManagement.js'
import { postQueryGradeProportionPlanPage, postDeleteById, postUpdateStatus } from '@/api/SupplierSettings.js'
import constants from '@/config/constants.js'

export default {
  name: 'RoleManagement',
  data() {
    return {
      selectValue: '',
      name: '',
      code: '',
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
        { title: '供应商等级占比方案名称', dataIndex: 'name', key: 'name' },
        { title: '供应商等级占比方案编码', dataIndex: 'code', key: 'code' },
        { title: '状态', key: 'isAvailable', scopedSlots: { customRender: 'isAvailable' } },
        { title: '创建人', key: 'createUsername', dataIndex: 'createUsername' },
        { title: '创建时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'operation' }, width: 130 }
      ],
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
  mounted() {},
  methods: {
    handleChange(value) {
      console.log(value, 'value', this.selectValue)
    },
    handleAdd() {
      this.$router.push({ name: 'formlist', params: { value: 0, id: 0, nub: 0 } })
    },
    async init(pagination) {
      const params = {
        ...pagination,
        isAvailable: this.selectValue || '',
        name: this.name || '',
        code: this.code || ''
      }
      // filter  Null and Empty string
      // Object.keys(params).forEach((item) => {
      //   if (params[item] === null || params[item] === '') delete params[item]
      // })
      const AAPromise = await postQueryGradeProportionPlanPage(params)

      AAPromise.data.listObj.forEach((item) => {
        if (item.isAvailable === '0' || item.isAvailable === 0) {
          item.isAvailable = false
        } else {
          item.isAvailable = true
        }
      })

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
      const vm = this

      vm.name = ''
      vm.code = ''
      vm.selectValue = ''

      vm.$refs.table.refresh(true)
    },

    async handleEdit(row, val) {
      this.$router.push({ name: 'formlist', params: { value: 1, id: row.id, nub: val } })
      // this.$router.push({
      //   name: 'formlist',
      //   params: { id: false, formSelect: 1, delivery: row.isAvailable }
      // })
    },
    handleDel(id, record) {
      const vm = this
      vm.$confirm({
        title: '提示',
        content: '确认删除该数据',
        onOk() {
          postDeleteById({ id: id }).then((res) => {
            const { code } = res
            if (code === '0' || code === 0) {
              vm.$refs.table.refresh(true)
              if (res.data === -1) {
                // this.$message
                vm.$message.error('删除失败该方案被引用')
              } else {
                vm.$message.success('删除成功')
              }
            }
          })
        },
        onCancel() {}
      })
    },

    handleUpdateStatus(checked, row) {
      console.log(checked)
      const title = checked ? '确定启用该方案吗？' : '确定停用该方案吗？'
      this.$confirm({
        content: title,
        onOk: () => {
          const params = {
            id: row.id,
            isAvailable: checked === true ? '1' : '0'
          }
          postUpdateStatus(params).then((res) => {
            if (res.code === '0' || res.code === 0) {
              this.$message.success('状态更新成功')
            } else {
              this.$refs.table.refresh(true)
            }
          })
        },
        cancelText: '取消',
        onCancel: () => {
          this.$refs.table.refresh(true)
          // this.destroyAll()
        }
      })

      // updateState(params).then((res) => {
      //   console.log(res, 'res!!')
      //   if (res.code === '0' || res.code === 0) {
      //     this.$message.success('状态更新成功')
      //   }
      // })
    }
    /**
     *递归更改当前菜单以及子级 状态，返回当前所有操作的菜单id
     **/

    /**
     * description:Select All Menu
     */
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
