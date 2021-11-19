<template>
  <div>
    <a-modal v-model="visible" title="新增物料类目" @ok="handleOk" @cancel="$refs.ruleForm.resetFields()">
      <a-form-model ref="ruleForm" :model="list" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="公司名称：" prop="merchantName">
          <span class="dao">{{ merchantName }}</span>
        </a-form-model-item>
        <a-form-model-item label="类目编码：" prop="categoryCode">
          <a-input v-model="list.categoryCode" :maxLength="30" class="dao" />
        </a-form-model-item>
        <a-form-model-item label="类目名称" prop="name">
          <a-input v-model="list.name" :maxLength="30" class="dao" />
        </a-form-model-item>
        <a-form-model-item label="上级类目名称：">
          <span class="dao">{{ name }}</span>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <a-radio-group v-model="list.status" @change="onChange">
            <a-radio value="0">启用</a-radio>
            <a-radio value="1">停用</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { AddiTion } from '@/api/Material'
export default {
  props: {
    ids: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    merchantName: {
      type: String,
      default: ''
    },
    buyerMerchantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      list: { categoryCode: '', name: '', status: '0' },
      visible: false,
      formLayout: 'horizontal',
      value: 1,
      queryParams: {},
      rules: {
        categoryCode: [{ required: true, message: '请填写类目编码', trigger: 'blur' }],
        name: [{ required: true, message: '请选择类目名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onChange(e) {
      this.list.state = e.target.value
    },
    init() {
      this.visible = true
    },
    showModal() {
      this.visible = true
    },
    async handleOk(e) {
      this.list.merchantId = this.buyerMerchantId
      this.list.parentId = this.ids
      // this.visible = false
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const result = await AddiTion(this.list)
          if (result.code === '0') {
            this.$message.success('新增成功')
            this.visible = false
            this.$emit('upData')
            this.$refs.ruleForm.resetFields()
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
// .dao {
//   margin-right: 30px;
//   // margin-left: 30px;
// }
.wen {
  margin-bottom: 20px;
}
</style>
