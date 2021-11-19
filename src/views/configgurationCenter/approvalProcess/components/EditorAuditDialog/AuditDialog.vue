<template>
  <a-modal :visible.sync="visible" :title="$t(title)" width="600px" @cancel="close">
    <a-form-model :model="task" :rules="rules" ref="form" class="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item :label="$t('审核结果')">
        <a-radio-group v-model="task.auditStatus" @change="handleRadioChange">
          <a-radio :value="2">审核通过</a-radio>
          <a-radio :value="3">审核不通过</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item :label="$t('备注')" prop="auditRemark">
        <a-textarea v-model="task.auditRemark" :maxLength="100" :auto-size="{ minRows: 3, maxRows: 5 }" />
      </a-form-model-item>
    </a-form-model>
    <span slot="footer">
      <div class="line-top" />
      <a-button @click="close">{{ $t('取消') }}</a-button>
      <a-button type="primary" @click="audit">{{ $t('确认') }}</a-button>
    </span>
  </a-modal>
</template>
<script>
import { audit } from '@/api/configgurationCenter/approvalTask'
export default {
  props: {
    title: { type: String, required: false, default: '审批' },
    visible: { type: Boolean, required: true, default: false },
    auditIdList: { type: Array, required: true, default: null },
    auditStatus: { type: Number, required: false, default: null }
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      task: {
        auditIdList: [],
        auditStatus: null,
        auditRemark: null
      },
      rules: {
        auditRemark: [{ required: false, message: '请填写备注', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.init()
      }
    }
  },
  methods: {
    async init() {
      this.task.auditIdList = this.auditIdList
      if (!this.task.auditIdList || this.task.auditIdList.length <= 0) {
        this.$message.warning('至少选择一条数据')
        this.close()
      }
      this.task.auditStatus = this.auditStatus ? this.auditStatus : 2
      this.task.auditRemark = null
    },
    close() {
      this.$emit('update:visible', false)
      this.$forceUpdate()
    },
    ok() {
      this.$emit('ok')
    },
    handleRadioChange(e) {
      const value = e?.target?.value
      if (value === 3) {
        this.rules.auditRemark[0].required = true
      } else {
        this.rules.auditRemark[0].required = false
        this.$refs.form.resetFields()
      }
    },
    async audit() {
      await this.$refs.form.validate()
      const result = await audit(this.task)
      if (result && result.code === '0') {
        this.ok()
        this.$message.success('审批成功')
      } else {
        this.$message.error('审批失败')
      }
      this.close()
    }
  }
}
</script>
