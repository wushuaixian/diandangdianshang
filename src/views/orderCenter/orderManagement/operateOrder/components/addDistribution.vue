<!--
 * @Author: your name
 * @Date: 2021-07-26 11:22:13
 * @LastEditTime: 2021-08-16 19:29:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/operateOrder/components/addList.vue
-->
<template>
  <div>
    <a-modal
      v-model="visible"
      :title="edit ? '编辑' : '新增'"
      ok-text="确认"
      cancel-text="取消"
      @cancel="handleCancel"
      @ok="hideModal"
    >
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="配送商来源" prop="type">
          <!-- <a-input v-model="queryParams.type" /> -->
          <a-radio-group v-model="queryParams.type">
            <a-radio :value="item.value" v-for="(item, index) in typeList" :key="index">{{ item.label }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="销售商家" prop="merchantId">
          <d-select
            v-model="queryParams.merchantId"
            show-search
            :filter-option="filterOption"
            :options="merchantList"
          ></d-select>
        </a-form-model-item>
        <a-form-model-item label="物流公司名称" prop="deliveryCompanyName">
          <d-select
            v-if="expressConfig"
            v-model="queryParams.deliveryCompanyId"
            :options="expressConfig"
            @change="changeDeliveryCompany"
          ></d-select>
        </a-form-model-item>
        <a-form-model-item label="物流公司编号" prop="deliveryCompanyId">
          <a-input disabled :value="queryParams.deliveryCompanyId"></a-input>
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="phone">
          <a-input :maxLength="11" v-model="queryParams.phone"></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="isAvailable">
          <!-- <a-input :disabled="queryParams.type === '2'" v-model="queryParams.phone"></a-input> -->
          <a-radio-group v-model="queryParams.isAvailable">
            <a-radio :value="item.value" v-for="(item, index) in isAvailableList" :key="index">{{
              item.label
            }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { queryRoleManagementInfo } from '@/api/roleManagement'
import { listByCategorys, merchantExpressConfigAdd, merchantExpressConfigUpdate } from '@/api/orderCenter'
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    edit: {
      type: Boolean,
      default: () => false
    },
    params: {
      type: Object,
      default: () => null
    }
  },
  mounted() {
    this.getQueryRoleManagementInfo()
    this.getListByCategorys()
    if (this.params) {
      this.queryParams = this.params
    }
  },
  data() {
    return {
      queryParams: {
        type: 1
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      merchantList: [],
      expressConfig: [],
      typeList: [
        {
          label: '系统配送商',
          value: 1
        },
        {
          label: '自定义配送商',
          value: 2
        }
      ],
      isAvailableList: [
        {
          label: '停用',
          value: 0
        },
        {
          label: '启用',
          value: 1
        }
      ],
      rules: {
        merchantId: [{ required: true, message: '请选择商家', trigger: 'change' }],
        deliveryCompanyName: [{ required: true, message: '请选择物流公司名称', trigger: 'change' }]
        // deliveryCompanyId: [{ required: true, message: '请选择物流公司编号', trigger: 'change' }]
      }
    }
  },
  methods: {
    async getQueryRoleManagementInfo() {
      const result = await queryRoleManagementInfo({
        departmentType: null
      })
      this.merchantList = result.data.map((item) => {
        item.value = item.orgId
        item.label = item.enterpriseName
        return item
      })
    },
    async getListByCategorys() {
      const result = await listByCategorys({
        categorys: ['EXPRESS_CONFIG']
      })
      if (result.code === '0') {
        this.expressConfig = result.data.EXPRESS_CONFIG.map((item) => {
          item.value = item.id + ''
          item.label = item.name
          return item
        })
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('update:edit', false)
      this.$emit('update:params', {})
      this.queryParams = {}
    },
    changeDeliveryCompany(e) {
      const obj = this.expressConfig.find((item) => {
        return item.id === Number(e)
      })
      this.queryParams.deliveryCompanyName = obj?.label
      this.queryParams.deliveryCompanyId = obj?.id + ''
    },
    hideModal() {
      console.log(this.queryParams)
      const { queryParams, edit } = this
      const vm = this
      vm.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const result = !edit
            ? await merchantExpressConfigAdd({
                ...queryParams
              })
            : await merchantExpressConfigUpdate({
                ...queryParams
              })
          if (result.code === '0') {
            vm.$message.success(!edit ? '新增成功' : '编辑成功')
            vm.$emit('ok')
            vm.handleCancel()
          }
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
