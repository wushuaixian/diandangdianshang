<!--
 * @Author: your name
 * @Date: 2021-07-28 15:50:49
 * @LastEditTime: 2021-08-08 11:47:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/listEditcomponents/addlistEdit.vue
-->
<template>
  <div>
    <!-- <a-modal v-model="visible" :title="!isEdit ? '新增匹配条件' : '编辑匹配条件'" @ok="handleOk" @cancel="handleCancel">
    </a-modal> -->
    <a-drawer
      :width="400"
      :title="!isEdit ? '新增匹配条件' : '编辑匹配条件'"
      placement="right"
      :visible="visible"
      @close="onClose"
    >
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="变量名" prop="variableCode">
          <d-select v-model="queryParams.variableCode" :options="variableList" @change="changeVariableName"></d-select>
        </a-form-model-item>
        <a-form-model-item ref="name" label="运算符" prop="operator">
          <a-select v-model="queryParams.operator">
            <a-select-option v-for="item in operatorList" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="name" label="条件值" prop="variableValue">
          <d-select
            v-if="queryParams.variableCode === 13"
            mode="multiple"
            v-model="queryParams.variableValue"
            :options="variableValueList"
            @change="changeVariableCode"
          ></d-select>
          <div v-else-if="queryParams.variableCode === 14">
            <d-select mode="multiple" v-model="queryParams.variableValue" :options="[]" hidden></d-select>
            <a-time-picker format="HH:mm" @change="onChangeStart" />
            <a-time-picker format="HH:mm" @change="onChangeEnd" />
          </div>
        </a-form-model-item>
      </a-form-model>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose"> 取消 </a-button>
        <a-button type="primary" @click="onSubmit"> 确认 </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
// import moment from 'moment'
import { listByRuleType, queryChannelMap } from '@/api/orderCenter'
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    isEdit: {
      type: Boolean,
      default: () => false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    if (this.isEdit) {
      this.queryParams = this.params || {}
      this.queryParams.variableCode = this.params?.variableId
      // this.queryParams.variableValue =
      //   typeof this.params.variableValue === 'string' ? this.params.variableValue.split(',') : this.params.variableValue
    }
    this.getlistByRuleType()
    this.getQueryChannelMap()
  },
  data() {
    return {
      queryParams: {
        variableValue: []
      },
      typeList: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        variableCode: [{ required: true, message: '请选择变量名', trigger: 'blur' }],
        operator: [{ required: true, message: '请选择运算符', trigger: 'blur' }],
        variableValue: [{ required: true, message: '请选择条件值', trigger: 'blur' }]
      },
      variableList: [
        {
          value: 13,
          label: '来源渠道'
        },
        {
          value: 14,
          label: '起始时间'
        }
      ],
      variableValueList: [],
      timeStringStart: [],
      operatorList: []
      // operatorList: [
      //   {
      //     value: 0,
      //     label: '='
      //   },
      //   {
      //     value: 1,
      //     label: '!='
      //   }
      // ]
    }
  },
  methods: {
    onChangeStart(time, timeString) {
      this.timeStringStart[0] = timeString
      this.queryParams.variableValue = [this.timeStringStart.join('-')]
    },
    onChangeEnd(time, timeString) {
      this.timeStringStart[1] = timeString
      this.queryParams.variableValue = [this.timeStringStart.join('-')]
    },
    handleOk() {
      this.resetComponents()
    },
    async getlistByRuleType() {
      const params = { ruleType: 4 }
      const result = await listByRuleType(params)
      if (result.code === '0') {
        this.typeList = result.data
        this.variableList = result.data.map((item) => {
          return {
            ...item,
            ...{
              value: item.id,
              label: item.name
            }
          }
        })
      }
    },
    async getQueryChannelMap() {
      const result = await queryChannelMap()
      if (result.code === '0') {
        const list = Object.values(result.data)
        this.variableValueList = list.map((item) => {
          return {
            ...item,
            ...{
              value: item.channelCode,
              label: item.channelName
            }
          }
        })
      }
    },
    resetComponents() {
      this.$emit('update:visible', false)
      this.$emit('update:isEdit', false)
      this.$emit('update:params', {})
    },
    onClose() {
      const vm = this
      this.$confirm({
        content: '确认关闭',
        onOk() {
          vm.resetComponents()
        },
        onCancel() {}
      })
    },
    async onSubmit() {
      await this.$refs.ruleForm.validate()
      if (this.queryParams.variableCode === 14) {
        const arr = this.timeStringStart
        this.queryParams.variableValue = [arr.join('-')]
        this.queryParams.variableValueDesc = this.queryParams.variableValue
      } else if (this.queryParams.variableCode === 13) {
        this.queryParams.variableValue = this.queryParams.variableValue
        this.queryParams.variableValueDesc = this.queryParams.variableValueDesc
      }
      this.isEdit ? this.$emit('ok', this.queryParams, this.queryParams.variableId) : this.$emit('ok', this.queryParams)
      this.resetComponents()
    },
    changeVariableName(value) {
      const obj = this.variableList.filter((item) => {
        return item.value === value
      })[0]
      this.operatorList = this.typeList
        .filter((item) => {
          return item.id === value
        })[0]
        ?.operator?.split(',')
      this.queryParams.variableName = obj.label
      this.queryParams.variableId = obj.value
      this.queryParams.variableValue = []
      this.queryParams.operator && delete this.queryParams.operator
    },
    changeOperator(value) {
      this.queryParams.operator = this.operatorList.filter((item) => {
        return item.value === value
      })[0]?.label
    },
    changeVariableCode(value) {
      console.log(value, 'value')
      const { variableValueList } = this
      this.queryParams.variableValueDesc = value.map((item) => {
        return variableValueList.filter((i) => {
          return i.value === item
        })[0]?.label
      })
    }
  }
}
</script>
<style scoped>
</style>
