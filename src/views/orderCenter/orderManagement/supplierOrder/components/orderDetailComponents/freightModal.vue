<!--
 * @Author: your name
 * @Date: 2021-07-20 10:25:46
 * @LastEditTime: 2021-07-20 11:19:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/orderDetailComponents/freightModal.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="编辑运费" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="原运费金额" prop="originalFreight">
          <span>{{ queryParams.originalFreight }}</span>
        </a-form-model-item>
        <a-form-model-item ref="name" label="新运费金额" prop="newFreight">
          <a-input v-model="queryParams.newFreight" placeholder="请输入新运费金额"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      queryParams: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        newFreight: [{ required: true, message: '请输入新运费金额', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(params) {
      this.visible = true
      this.queryParams.originalFreight = params
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      const vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          vm.visible = false
          vm.$emit('ok', this.queryParams.newFreight)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
</style>
