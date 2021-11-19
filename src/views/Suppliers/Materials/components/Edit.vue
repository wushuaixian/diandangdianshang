<!--
 * @Author: your name
 * @Date: 2021-07-02 22:31:11
 * @LastEditTime: 2021-07-02 23:46:10
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/Materials/components/Edit.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="编辑物料类目" @ok="handleOk">
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="公司名称：" prop="name">
          <span class="dao">{{ queryParams.buyerMerchantName || '' }}</span>
        </a-form-model-item>
        <a-form-model-item label="类目编码" prop="categoryCode">
          <a-input :disabled="true" class="display-inline" :maxLength="30" v-model="queryParams.categoryCode" />
        </a-form-model-item>
        <a-form-model-item label="类目名称" prop="name">
          <a-input class="display-inline" :maxLength="30" v-model="queryParams.name" />
        </a-form-model-item>
        <a-form-model-item label="上级类目名称：">
          <span>{{ queryParams.parentName || '' }}</span>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <p>
            <span class="dao">
              <a-radio-group v-model="queryParams.status">
                <a-radio value="0">启用</a-radio>
                <a-radio value="1">停用</a-radio>
              </a-radio-group>
            </span>
          </p>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { Editors } from '@/api/Material'
export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      visible: false,
      value: 1,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      queryParams: {},
      rules: {
        categoryCode: [{ required: true, message: '请填写类目编码', trigger: 'blur' }],
        name: [{ required: true, message: '请选择类目名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(queryParams) {
      this.visible = true
      this.queryParams = queryParams
      console.log(queryParams, 123123)
    },
    showModal() {
      this.visible = true
    },
    async handleOk(e) {
      const { queryParams } = this
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (queryParams.parentName) delete queryParams.parentName
          // if (queryParams.status) delete queryParams.status
          const result = await Editors(queryParams)
          if (result.code === '0') {
            this.$message.success('更改成功')
            this.visible = false
            this.$emit('updataList')
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
div {
  font-size: 16px;
  font-weight: 20;
}
.dao {
  margin-right: 30px;
  margin-left: 20px;
}
.wen {
  margin-bottom: 20px;
}
.display-inline {
  display: inline-block;
}
</style>
