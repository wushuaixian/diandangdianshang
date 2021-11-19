<!--
 * @Author: your name
 * @Date: 2021-07-20 15:10:47
 * @LastEditTime: 2021-08-07 14:13:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/orderDetailComponents/batchConfirmationModal.vue
-->
<template>
  <div>
    <a-modal title="审核订单" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="审核结果" prop="status">
          <a-radio-group v-model="queryParams.status" :options="plainOptions" />
        </a-form-model-item>
        <a-form-model-item v-if="queryParams.status === '3'" ref="name" label="备注" prop="remark">
          <a-textarea v-model="queryParams.remark" placeholder="请输入驳回原因" :auto-size="{ minRows: 2, maxRows: 6 }">
          </a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { reviewByOrderCodes } from '@/api/orderCenter'
export default {
  data() {
    return {
      visible: false,
      id: null,
      queryParams: {
        status: '2',
        remark: ''
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        status: [{ required: true, message: '请选择审核结果类型', trigger: 'blur' }]
      },
      plainOptions: [
        { label: '不通过', value: '3' },
        { label: '通过', value: '2' }
      ]
    }
  },
  methods: {
    init(id, type) {
      this.visible = true
      this.id = id
      this.type = type
    },
    handleOk(e) {
      const { queryParams, id, type } = this
      const vm = this
      this.$refs.ruleForm.validate(async (vaild) => {
        if (vaild) {
          const result =
            type === 'review'
              ? await reviewByOrderCodes({
                  ids: id,
                  ...queryParams
                })
              : await reviewByOrderCodes({
                  orderCodes: id,
                  ...queryParams
                })
          if (result.code === '0') {
            this.visible = false
            this.$refs.ruleForm.resetFields()
            vm.$message.success('操作成功')
            vm.$emit('ok')
          }
        }
      })
    },
    handleCancel(e) {
      this.visible = false
    }
  }
}
</script>
<style scoped lang="less">
</style>
