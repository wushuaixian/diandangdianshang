/* eslint-disable no-eval */
/* eslint-disable no-eval */
<!--
 * @Author: your name
 * @Date: 2021-07-30 19:26:30
 * @LastEditTime: 2021-08-09 10:26:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/orderRuleSettingsComponents/addrulesSetting.vue
-->
<template>
  <div>
    <a-drawer
      :title="isEdit ? '编辑匹配条件' : '新增匹配条件'"
      :width="400"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="变量名" prop="variableId">
          <a-select v-model="queryParams.variableId" :options="variableNameList" @change="nameChange"> </a-select>
        </a-form-model-item>
        <a-form-model-item ref="name" label="运算符" prop="operator">
          <a-select v-model="queryParams.operator">
            <a-select-option v-for="item in operatorList" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="!isNone" ref="name" label="条件值" prop="variableValue">
          <a-input v-if="isText" v-model="queryParams.variableValue"></a-input>
          <a-select
            v-else
            mode="multiple"
            v-model="queryParams.variableValue"
            :options="variableValueList"
            @change="variableValueChange"
          ></a-select>
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
import { listByRuleType, getVariableValue } from '@/api/orderCenter'
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    isEdit: {
      type: Boolean,
      dafault: () => false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      queryParams: {
        // variableValue: ''
      },
      isNone: false,
      isText: false,
      rules: {
        variableId: [{ required: true, message: '请选择变量名', trigger: 'change' }],
        operator: [{ required: true, message: '请选择运算符', trigger: 'change' }],
        variableValue: [{ required: true, message: '请选择条件值', trigger: 'change' }]
      },
      // rulesNode: {
      //   variableId: [{ required: true, message: '请选择变量名', trigger: 'change' }],
      //   operator: [{ required: true, message: '请选择运算符', trigger: 'change' }]
      // },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      ruleType: [],
      variableNameList: [],
      operatorList: [],
      variableValueList: []
    }
  },
  async mounted() {
    const vm = this
    await this.getListByRuleType()
    if (vm.params && vm.isEdit) {
      vm.queryParams = JSON.parse(JSON.stringify(vm.params))
      vm.queryParams.variableId = vm.params.variableId
      vm.queryParams.variableName = vm.params.variableName
      vm.queryParams.variableValue = JSON.parse(vm.queryParams.variableValue)
      // this.$set(this.queryParams, 'variableId', this.params.variableId)
      // this.$set(this.queryParams, 'variableName', this.params.variableName)
      // this.changeVariablenName({ key: this.params.variableId, label: this.params.variableName })
    }
  },
  watch: {
    'queryParams.variableId'() {
      const {
        queryParams: { variableId }
      } = this
      const obj = this.variableNameList.filter((item) => {
        return item.value === variableId
      })[0]
      this.changeVariablenName({ ...obj, ...{ key: obj.value } })
    },
    'queryParams.variableValue'() {
      const {
        queryParams: { variableValue },
        variableValueList
      } = this
      const list = (variableValue && typeof variableValue !== 'string' ? variableValue : variableValue.split(',')).map(
        (item) => {
          return variableValueList.filter((i) => {
            return i.value === item
          })[0]
        }
      )
      this.changeVariableValue(list)
    }
  },
  methods: {
    async getListByRuleType() {
      const result = await listByRuleType({ ruleType: 2 })
      if (result.code === '0') {
        this.ruleType = result.data
        if (this.isEdit) {
          // const bool = this.ruleType.some((item) => {
          //   return item.displayStyle === 'text' && this.params.variableId === item.id
          // })
          // eslint-disable-next-line no-eval
          // if (bool) this.queryParams.variableValue = eval('[' + this.queryParams.variableValue + ']')
          // // eslint-disable-next-line no-eval
          // if (bool) this.queryParams.variableValueDesc = eval('[' + this.queryParams.variableValueDesc + ']')
        }
        this.variableNameList = result.data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
    },
    nameChange() {
      this.queryParams.operator && delete this.queryParams.operator
    },
    variableValueChange(a, b) {
      console.log(a, b)
      this.queryParams.variableValueDesc = b.map((item) => {
        return item.componentOptions.children[0].elm.data
      })
    },
    onClose() {
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确认关闭吗?',
        onOk() {
          vm.$emit('update:visible', false)
          vm.$emit('update:isEdit', false)
        },
        onCancel() {}
      })
    },
    onSubmit() {
      const vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.queryParams, 'this.queryParams')
          !vm.isEdit ? vm.$emit('ok', vm.queryParams) : vm.$emit('ok', vm.queryParams, vm.queryParams.variableId)
          vm.$emit('update:visible', false)
          vm.$emit('update:isEdit', false)
          // vm.onClose()
        }
      })
    },
    changeVariableValue(item) {
      // if (!this.isText) {
      //   this.queryParams.variableValue = item.map((i) => i.key)
      //   this.queryParams.variableValueDesc = item.map((i) => i.label)
      // } else {
      //   this.queryParams.variableValue = [...this.queryParams.variableValue]
      //   this.queryParams.variableValueDesc = [...this.queryParams.variableValue]
      // }
    },
    async changeVariablenName(item) {
      const e = item.key
      this.isNone = false
      this.isText = false
      this.queryParams.variableId = e
      this.queryParams.variableName = item.label
      const list = this.ruleType.filter((item) => {
        return item.id === e
      })[0]
      this.operatorList = list.operator.split(',')
      if (list.displayStyle === 'selectIQ' || list.displayStyle === 'select') {
        if (!this.isEdit) {
          delete this.queryParams.variableValue
        }
        const paras = list.resourceUrl.split('?')[1]
        // eslint-disable-next-line no-eval
        var obj2 = eval('(' + paras + ')')
        const result = await getVariableValue(list.resourceUrl.split('?')[0], { filters: obj2.filters })
        this.variableValueList = result.data.map((item) => {
          return {
            value: item.code,
            label: item.name
          }
        })
        if (this.queryParams.variableValue[0] && typeof this.queryParams.variableValue[0] === 'string') {
          this.queryParams.variableValue = this.queryParams.variableValue.map((item) => {
            return item - 0
          })
        }
      } else if (list.displayStyle === 'none') {
        this.queryParams.variableValue = []
        this.queryParams.variableValueDesc = []
        this.isNone = true
      } else if (list.displayStyle === 'text' || list.displayStyle === 'number') {
        this.isText = true
        // this.queryParams.variableValue = ''
        if (!this.isEdit) this.$set(this.queryParams, 'variableValue', '')
      }
    }
  }
}
</script>
<style scoped lang="less">
</style>
