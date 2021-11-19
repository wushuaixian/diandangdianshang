<template>
  <div id="listPopup">
    <a-modal
      title="企业认证"
      :visible="listPopupvisible"
      :width="600"
      cancelText="取消"
      okText="确定"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="form" :label-col="labelCol" :rules="rules" ref="ruleForm" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="验厂机构" prop="selectValue">
          <a-select
            allowClear
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            class="inp"
            v-model="form.selectValue"
            placeholder="请选择"
          >
            <a-select-option value="SGS"> SGS </a-select-option>
            <!-- <a-select-option value="农业银行"> 农业银行 </a-select-option>
            <a-select-option value="工商银行"> 工商银行 </a-select-option> -->
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="预计验厂时间" required prop="date1">
          <a-date-picker v-model="form.date1" type="date" placeholder="请选择验厂时间" class="inp" />
        </a-form-model-item>
        <a-form-model-item label="验厂工单号" prop="workOrderNo">
          <a-input placeholder="请输入验厂工单号" v-model="form.workOrderNo" class="inp" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { designatedFactoryInspection } from '@/api/supplieAuthAdmin'
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        selectValue: undefined,
        date1: undefined,
        workOrderNo: ''
      },
      rules: {
        selectValue: [{ required: true, message: '请选择验厂机构', trigger: 'change' }],
        date1: [{ required: true, message: '请选择验厂时间', trigger: 'change' }],
        workOrderNo: [{ required: true, message: '请输入工单号', trigger: 'change' }]
      }
    }
  },
  props: {
    listPopupvisible: {
      type: Boolean,
      default: true
    },
    id: {
      type: [Number, String],
      default: '11111'
    }
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            orgId: this.id,
            factoryAuditOrg: this.form.selectValue,
            expectFactoryAuditTime: this.form.date1,
            factoryAuditNo: this.form.workOrderNo
          }
          designatedFactoryInspection(params).then((res) => {
            if (res.success) {
              this.handleCancel()
              this.$emit('ok')
            } else {
              this.$message.error('指定验厂信息失败')
            }
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('close')
      this.$refs.ruleForm.resetFields()
      setTimeout(() => {
        this.form = {
          selectValue: undefined,
          date1: undefined,
          workOrderNo: ''
        }
      }, 2000)
    },
    data1(e) {
      this.form.data1 = e
    }
  }
}
</script>
<style lang="less" scoped>
.inp {
  width: 306px;
}
</style>
