<!--
 * @Author: your name
 * @Date: 2021-06-28 15:20:29
 * @LastEditTime: 2021-06-28 20:20:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/product/productSet/categoryManagement/components/edit.vue
-->
<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :title="type === 'edit' ? '编辑类目' : '新增类目'"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="类目编码" prop="categoryCode">
          <a-input v-model.number="queryParams.categoryCode" :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="类目名称" prop="name">
          <a-input v-model="queryParams.name" :maxLength="60" />
        </a-form-model-item>
        <a-form-model-item v-if="queryParams.level < 3" label="保险金上限金额" prop="highPrice">
          <a-input :disabled="type === 'edit' ? true : false" v-model="queryParams.highPrice" :maxLength="10" />
        </a-form-model-item>
        <a-form-model-item label="允许自定义属性" prop="enableAddAtt">
          <a-radio-group v-model="queryParams.enableAddAtt">
            <a-radio :value="1"> 是 </a-radio>
            <a-radio :value="0"> 否 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
          <a-button type="primary" @click="onSubmit"> Create </a-button>
          <a-button style="margin-left: 10px" @click="resetForm"> Reset </a-button>
        </a-form-model-item> -->
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { updateCategory, addCategoryChild } from '@/api/categoryControl'
const rulesEdit = {
  categoryCode: [{ required: true, message: '请输入类目编码', trigger: 'change' }],
  name: [{ required: true, message: '请输入类目名称', trigger: 'change' }],
  // highPrice: [{ required: true, message: '请输入保证金上限金额', trigger: 'change' }],
  enableAddAtt: [{ required: true, message: '请选择允许自定义属性', trigger: 'change' }]
}
const rulesAdd = {
  categoryCode: [{ required: true, message: '请输入类目编码', trigger: 'change' }],
  name: [{ required: true, message: '请输入类目名称', trigger: 'change' }],
  highPrice: [{ required: true, message: '请输入保证金上限金额', trigger: 'change' }],
  enableAddAtt: [{ required: true, message: '请选择允许自定义属性', trigger: 'change' }]
}
export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      visible: false,
      rules: {},
      type: 'add',
      queryParams: {}
    }
  },
  methods: {
    init(params, type) {
      this.visible = true
      this.type = type
      if (params.level > 2) {
        delete rulesAdd['highPrice']
      }
      this.type === 'edit' ? (this.rules = rulesEdit) : (this.rules = rulesAdd)
      this.queryParams = params || {}
    },
    handleOk() {
      const vm = this
      const { queryParams } = vm
      vm.$refs.ruleForm.validate(async (valid) => {
        console.log(valid)
        if (valid) {
          const result = this.type === 'edit' ? await updateCategory(queryParams) : await addCategoryChild(queryParams)
          console.log(result)
          if (result.code === '0') {
            vm.$message.success(this.type === 'edit' ? '修改成功' : '新增成功')
            vm.$refs.ruleForm.resetFields()
            vm.visible = false
            this.$emit('refresh')
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style scoped lang="less">
</style>
