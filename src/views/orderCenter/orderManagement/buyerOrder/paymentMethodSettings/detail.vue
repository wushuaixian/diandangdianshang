<!--
 * @Author: your name
 * @Date: 2021-07-29 14:39:58
 * @LastEditTime: 2021-08-12 20:50:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/buyerOrder/paymentMethodSettings/detail.vue
-->
<template>
  <div>
    <a-card>
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="供应商" prop="providerMerchantId">
          <a-select
            v-if="supList"
            allowClear
            show-search
            placeholder="请输入供应商名称查询"
            :default-active-first-option="false"
            :show-arrow="false"
            v-model="queryParams.providerMerchantId"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="handleSearch"
          >
            <!-- <a-spin v-if="fetching" slot="notFoundContent" size="small" /> -->
            <a-select-option v-for="item in supList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="合同编号" prop="contractCode">
          <a-select
            v-if="contractList"
            allowClear
            show-search
            :default-active-first-option="false"
            :show-arrow="false"
            v-model="queryParams.contractCode"
            :filter-option="false"
            @search="contractSearch"
            @change="contractName"
          >
            <a-select-option v-for="item in contractList" :key="item.value" :value="item.value">
              {{ item.value }}
            </a-select-option>
          </a-select>
          <!-- <a-input v-model="queryParams.contractCode" /> -->
        </a-form-model-item>
        <a-form-model-item label="合同名称" prop="contractName">
          <!-- <span>{{ queryParams.contractName }}</span> -->
          <!-- <a-select
            v-if="contractList"
            allowClear
            disabled
            show-search
            :default-active-first-option="false"
            :show-arrow="false"
            v-model="queryParams.contractName"
            :filter-option="false"
            key="contractCode"
            @search="contractCode"
          >
            <a-select-option v-for="(item, index) in contractList" :key="index" :value="item.label">
              {{ item.label }}
            </a-select-option>
          </a-select> -->
          <d-select v-model="queryParams.contractName" disabled :options="contractList"></d-select>
          <!-- <a-input v-model="queryParams.contractName" /> -->
        </a-form-model-item>
        <a-form-model-item label="付款名称" prop="paymentName">
          <a-input v-model="queryParams.paymentName" />
        </a-form-model-item>
        <a-form-model-item label="付款方式" prop="paymentType">
          <a-radio-group v-model="queryParams.paymentType" :options="paymentTypeList" />
          <accounting ref="accounting" v-if="queryParams.paymentType === 1" :params="queryParams"></accounting>
          <phased ref="phased" v-if="queryParams.paymentType === 2" :params="queryParams.phasePayment"></phased>
        </a-form-model-item>
        <a-form-model-item label="支付方式" prop="payType">
          <!-- <d-select v-model="queryParams.payType" :options="payTypeList"></d-select> -->
          <a-radio-group v-model="queryParams.payType" :options="payTypeList" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit"> 保存 </a-button>
          <a-button style="margin-left: 10px" @click="back"> 返回 </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>
<script>
import { findPaymentType, addMerchantPaymentConfig, updateMerchantPaymentConfig } from '@/api/orderCenter'
import { myContract } from '@/api/projectCarry'
import { searchCom } from '@/api/contract'
import accounting from './components/accounting'
import phased from './components/phased'
let timeout
export default {
  components: {
    accounting,
    phased
  },
  watch: {
    'queryParams.providerMerchantId'() {
      this.getContractList()
    }
  },
  async mounted() {
    if (this.$route.query.id) {
      this.getFindPaymentType()
    }
    this.handleSearch('')
  },
  data() {
    return {
      queryParams: {},
      rules: {
        providerMerchantId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        paymentName: [
          { required: true, message: '请选择付款名称', trigger: 'change' },
          { min: 1, max: 20, message: '请输入输入1-20位名称', trigger: 'change' }
        ],
        paymentType: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
        payType: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
      },
      supList: [],
      contractList: [],
      fetching: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      payTypeList: [
        {
          value: 1,
          label: '电汇'
        },
        {
          value: 2,
          label: '承兑汇票'
        }
        // {
        //   value: 3,
        //   label: '两者都是'
        // }
      ],
      paymentTypeList: [
        {
          value: 1,
          label: '账期'
        },
        {
          value: 2,
          label: '分阶段'
        }
      ]
    }
  },
  methods: {
    async getFindPaymentType() {
      const result = await findPaymentType({
        id: this.$route.query.id
      })
      this.queryParams = result?.data[0] || {}
    },
    back() {
      this.$router.back()
    },
    async onSubmit() {
      const {
        queryParams,
        $route: {
          query: { id }
        }
      } = this
      const vm = this
      this.$refs.ruleForm.validate(async (vaild) => {
        if (vaild) {
          if (queryParams.paymentType === 1) {
            vm.$refs.accounting.$refs.ruleForm.validate(async (v) => {
              if (v) {
                const params = vm.$refs.accounting.queryParams
                const result = !id
                  ? await addMerchantPaymentConfig({
                      ...queryParams,
                      ...params
                    })
                  : await updateMerchantPaymentConfig({
                      ...queryParams,
                      ...params
                    })
                if (result.code === '0') {
                  vm.$message.success(!id ? '新增成功' : '编辑成功')
                  this.$router.back()
                }
              }
            })
          } else {
            // vm.$refs.phased.$refs.purchasersTable.validate(async (v) => {
            // if (v) {
            const params = vm.$refs.phased.phasePayment
            if (
              params.some((item) => {
                return item.percent === '' || item.day === ''
              })
            ) {
              this.$message.warning('请输入付款时间和付款比例')
              return
            }
            const num = params.reduce((cur, pro) => {
              cur += pro.percent
              return cur
            }, 0)
            if (num !== 100) {
              vm.$message.warning('付款比例应列表所和为100%')
              return
            }
            const result = !id
              ? await addMerchantPaymentConfig({
                  ...queryParams,
                  phasePayment: JSON.stringify(params)
                })
              : await updateMerchantPaymentConfig({
                  ...queryParams,
                  phasePayment: JSON.stringify(params)
                })
            if (result.code === '0') {
              // vm.$message.success('新增成功')
              vm.$message.success(!id ? '新增成功' : '编辑成功')
              this.$router.back()
            }
            // }
            // })
          }
        }
      })
    },
    async getContractList() {
      const {
        queryParams: { providerMerchantId, contractName: name, contractCode: code }
      } = this
      const result = await myContract({
        currentPage: 1,
        itemsPerPage: 10,
        name,
        code,
        providerMerchantId,
        status: 6,
        flag: true
      })
      if (result.code === '0') {
        this.contractList = result.data?.listObj?.map((item) => {
          return {
            value: item.code,
            label: item.name
          }
        })
      }
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      const vm = this
      timeout = setTimeout(async () => {
        const ret = await searchCom(value)
        vm.fetching = false
        vm.supList = ret?.data?.providerMerchantList.map((item) => {
          return {
            value: item.id,
            label: item.orgName
          }
        })
      }, 300)
    },
    contractSearch() {
      this.getContractList()
    },
    contractName() {
      const {
        queryParams: { contractCode }
      } = this
      const item = this.contractList.find((item) => {
        return item.value === contractCode
      })
      this.queryParams.contractName = item?.label
    },
    contractCode() {
      const {
        queryParams: { contractCode }
      } = this
      const item = this.contractList.find((item) => {
        return item.value === contractCode
      })
      this.queryParams.contractCode = item?.value
    }
  }
}
</script>
<style scoped>
</style>
