<!--
 * @Author: your name
 * @Date: 2021-07-30 17:03:21
 * @LastEditTime: 2021-08-17 11:28:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/orderRuleSettingsDetail.vue
-->
<template>
  <div>
    <a-card>
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="规则编码" prop="code">
          <!-- <a-input v-model="queryParams.code" /> -->
          <span>
            {{ queryParams.code }}
          </span>
        </a-form-model-item>
        <a-form-model-item ref="name" label="规则名称" prop="name">
          <a-input v-model="queryParams.name" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="规则适用商家" prop="merchantId">
          <a-select
            allowClear
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            show-search
            placeholder="请输入规则适用商家"
            :default-active-first-option="false"
            :show-arrow="false"
            v-model="queryParams.merchantId"
            :default-value="queryParams.merchantId"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="handleSearch"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
              {{ item.orgName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="name" label="优先级" prop="priority">
          <a-input-number
            style="width: 150px"
            :min="1"
            :max="999999999"
            v-model="queryParams.priority"
            @change="onChange"
          />
        </a-form-model-item>
        <a-form-model-item label="规则状态" prop="isDisable">
          <a-radio-group v-model="queryParams.isDisable">
            <a-radio :value="0"> 启用 </a-radio>
            <a-radio :value="1"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="name" label="有效期" prop="time">
          <!-- <a-input v-model="queryParams.name" /> -->
          <a-range-picker
            v-model="queryParams.time"
            :disabled-date="disabledStartDate"
            @change="onChangeEndAuditTime"
          />
        </a-form-model-item>
        <a-form-model-item ref="name" label="备注" prop="remark">
          <a-textarea v-model="queryParams.remark" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="审核原因分类" prop="reasonType">
          <d-select v-model="queryParams.reasonType" :options="reasonTypeList"></d-select>
        </a-form-model-item>
        <a-form-model-item ref="name" label="审核原因" prop="reason">
          <d-select v-model="queryParams.reason" :options="reasonList"></d-select>
        </a-form-model-item>
        <a-form-model-item ref="name" label="通知邮箱" prop="notifyEmails">
          <a-input v-model="queryParams.notifyEmails" />
        </a-form-model-item>

        <a-form-model-item label="匹配条件" prop="conList">
          <a-col>
            <div class="button">
              <a-button type="primary" @click="addConList">匹配条件</a-button>
            </div>
            <a-row>
              <s-table
                name="listEditTable"
                :list="queryParams.conList"
                :columns="columns"
                :customPage="true"
                :scroll="{ x: 300 }"
              >
                <template v-slot:active="action, item">
                  <a class="btn" @click="edit(item)">编辑</a>
                  <a @click="deteleFn(item)">删除</a>
                </template>
              </s-table>
            </a-row>
          </a-col>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit" :loading="loading"> 保存 </a-button>
          <a-button style="margin-left: 20px" @click="$router.back()"> 返回 </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <add-rules-setting
      v-if="visible"
      :visible.sync="visible"
      :isEdit.sync="isEdit"
      :params="params"
      @ok="setConList"
    ></add-rules-setting>
  </div>
</template>
<script>
import {
  mappingWarehouseRuleCreateCode,
  soApproveRuleAdd,
  soApproveRuleGet,
  soApproveRuleUpdate
} from '@/api/orderCenter'
import moment from 'moment'
import { searchCom } from '@/api/contract'
import addRulesSetting from './components/orderRuleSettingsComponents/addRulesSetting'
let timeout
export default {
  components: {
    addRulesSetting
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      queryParams: {
        code: '',
        time: [
          moment(new Date(), 'YYYY-MM-DD'),
          moment(`${new Date().getFullYear() + 1}-${new Date().getMonth() + 1}-${new Date().getDate()}`, 'YYYY-MM-DD')
        ],
        conList: [],
        isDisable: 0,
        deleteIds: []
      },
      params: {},
      supList: [],
      loading: false,
      fetching: false,
      visible: false,
      isEdit: false,
      reasonTypeList: [
        {
          value: '1',
          label: '待审核网订'
        },
        {
          value: '2',
          label: '待审核其他'
        }
      ],
      reasonList: [
        {
          value: '1',
          label: '订单有备注'
        },
        {
          value: '2',
          label: '价格与套价不符'
        },
        {
          value: '3',
          label: '有过人工改价'
        },
        {
          value: '4',
          label: '其他'
        }
      ],
      columns: [
        {
          title: '变量名',
          key: 'variableName',
          width: 200,
          dataIndex: 'variableName'
        },
        {
          title: '运算符',
          key: 'operator',
          width: 200,
          dataIndex: 'operator'
        },
        {
          title: '条件值',
          key: 'variableValueDesc',
          width: 200,
          dataIndex: 'variableValueDesc',
          customRender: (value) => {
            if (typeof value !== 'string' && value) {
              return value.join(',') || ''
            } else {
              if (typeof value === 'number' || typeof value === 'string') return value
              const list = JSON.parse(value)
              return list?.reduce((cur, pro) => {
                cur += `${pro} `
                return cur
              }, '')
            }
          }
        },
        {
          title: '操作',
          key: 'active',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'active' }
        }
      ],
      rules: {
        name: [
          { required: true, message: '规则名称不能为空', trigger: 'change' },
          { min: 1, max: 20, message: '请输入输入1-20位名称', trigger: 'change' }
        ],
        isDisable: [{ required: true, message: '请选择规则状态', trigger: 'change' }],
        priority: [{ required: true, message: '优先级不能为空', trigger: 'change' }],
        time: [{ required: true, message: '请选择有效期', trigger: 'change' }],
        reasonType: [{ required: true, message: '请选择审核原因分类', trigger: 'change' }],
        reason: [{ required: true, message: '请选择审核原因', trigger: 'change' }],
        conList: [
          {
            type: 'array',
            required: true,
            message: '匹配条件不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    'queryParams.merchantId'(val) {
      const { supList } = this
      this.queryParams.merchantName = supList.filter((item) => {
        return val === item.id
      })[0]?.orgName
    }
  },
  mounted() {
    const {
      $route: {
        query: { id }
      }
    } = this
    if (!id) {
      this.createCode()
      this.handleSearch('')
    } else {
      this.getCode(id)
      this.handleSearch('')
    }
  },
  methods: {
    async createCode() {
      const result = await mappingWarehouseRuleCreateCode()
      this.queryParams.code = result.data
    },
    disabledStartDate(val) {
      return val?.valueOf() <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000).valueOf()
    },
    async getCode(id) {
      const result = await soApproveRuleGet({ id })
      this.queryParams = { ...result.data, deleteIds: [] }
      this.queryParams.conList = this.queryParams?.conList?.map((item) => {
        if (item.variableValue === item.variableValueDesc) {
          item.variableValue = JSON.parse(item.variableValue)[0]
          item.variableValueDesc = JSON.parse(item.variableValueDesc)[0]
        } else {
          item.variableValue = JSON.parse(item.variableValue)
          item.variableValueDesc = JSON.parse(item.variableValueDesc)
        }
        return item
      })
      console.log(this.queryParams)
      this.queryParams.time = [result.data.startDate, result.data.endDate]
      this.handleSearch()
    },
    onChange() {
      this.queryParams.priority = Math.ceil(this.queryParams.priority)
    },
    async onSubmit() {
      this.loading = true
      const {
        queryParams,
        $route: {
          query: { id }
        }
      } = this
      const vm = this
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const list = queryParams.conList.map((item) => {
            if (item.variableValue && typeof item.variableValue !== 'object') {
              item.variableValue = JSON.stringify([item.variableValue])
              item.variableValueDesc = item.variableValue
              return item
            }
            if (item.variableValue && typeof item.variableValue !== 'string') {
              // item.variableValue = item.variableValue.join(',') // 转成字符串存储
              item.variableValue = JSON.stringify(item.variableValue) // 转成字符串存储
            }
            if (item.variableValueDesc && typeof item.variableValueDesc !== 'string') {
              // item.variableValueDesc = item.variableValueDesc.join('，') // 转成字符串存储
              item.variableValueDesc = JSON.stringify(item.variableValueDesc) // 转成字符串存储
            }

            return item
          })
          queryParams.conList = list
          if (!queryParams.startDate || !queryParams.endDate) {
            this.queryParams.startDate = queryParams.time[0]
            this.queryParams.endDate = queryParams.time[1]
          }
          console.log(this.queryParams)
          const result = !id
            ? await soApproveRuleAdd({
                ...queryParams
              })
            : await soApproveRuleUpdate({
                ...queryParams
              })
          if (result.code === '0') {
            vm.$message.success(!id ? '保存成功' : '更新成功')
            vm.$router.back()
          }
        } else {
          this.loading = false
        }
      })
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      const vm = this
      timeout = setTimeout(() => {
        searchCom(value).then((ret) => {
          vm.fetching = false
          vm.supList = ret.data.providerMerchantList
          if (vm.supList.length > 0) {
            vm.queryParams.merchantName = vm.supList[0]?.orgName
            vm.queryParams.merchantId = vm.supList[0]?.id
          }
        })
      }, 300)
    },
    onChangeEndAuditTime(val, [startTime, endTime]) {
      this.queryParams.startDate = startTime + ' 00:00:00'
      this.queryParams.endDate = endTime + ' 23:59:59'
    },
    addConList() {
      this.visible = true
    },
    setConList(params, variableId) {
      console.log(params, variableId)
      if (
        this.queryParams.conList.some((item) => {
          return item.variableId === params.variableId
        }) &&
        !variableId
      ) {
        this.$message.warning('已存在该类匹配条件')
        return
      }
      if (variableId) {
        this.queryParams.conList = this.queryParams.conList.map((item) => {
          if (item.variableId === variableId) {
            item = params
          }
          if (!item.variableValueDesc) {
            item.variableValueDesc = item.variableValue
          }
          return item
        })
        return
      }
      !params.variableValueDesc && (params.variableValueDesc = params.variableValue)
      this.queryParams.conList = [...(this.queryParams.conList || []), params]
    },
    edit(item) {
      if (typeof item.variableValue === 'string') item.variableValue = item.variableValue.split(',') // 回显为数组
      if (typeof item.variableValueDesc === 'string') item.variableValueDesc = item.variableValueDesc.split('，') // 回显为数组
      console.log(item)
      this.params = item
      this.visible = true
      this.isEdit = true
    },
    deteleFn({ variableId, id }) {
      this.queryParams.deleteIds = [...this.queryParams.deleteIds, id]
      this.queryParams.conList = this.queryParams.conList.filter((item) => item.variableId !== variableId)
    }
  }
}
</script>
<style scoped lang="less">
.btn {
  margin-right: 20px;
}
</style>
