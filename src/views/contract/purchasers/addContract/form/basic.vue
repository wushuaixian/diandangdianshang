<template>
  <a-row :gutter="48">
    <a-col :md="8" :sm="24" v-if="$store.state.permission.isPlatform === 7">
      <a-form-model-item label="公司名称" prop="buyerMerchantId">
        <a-input
          v-if="isCopy || Number(query.id) > 0 || [1, 2].includes(sourceType) || query.type === 'read'"
          v-model="form.buyerMerchantName"
          disabled="disabled"
        />
        <a-select
          v-else
          v-model="form.buyerMerchantId"
          @change="(value) => (form.buyerMerchantId = value)"
          placeholder="请选择公司"
          option-filter-prop="children"
          showSearch
        >
          <a-select-option v-for="item in comList" :key="item.orgName" :value="item.id">
            {{ item.orgName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item
        :label="$store.state.permission.isPlatform === 6 ? '公司名称' : '供应商'"
        prop="providerMerchantId"
      >
        <a-input
          v-if="isCopy || Number($$($route.query, 'id')) > 0 || sourceType === 1 || $$($route.query, 'type') === 'read'"
          v-model="form.providerMerchantName"
          disabled="disabled"
        />
        <a-select
          v-else
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          show-search
          placeholder="请输入供应商名称查询"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          @search="handleSearch"
          @change="
            (v) => {
              form.providerMerchantId = v
            }
          "
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
            {{ item.orgName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>

    <a-col :md="8" :sm="24" v-if="$store.state.permission.isPlatform === 6">
      <a-form-model-item label="采购商" prop="buyerMerchantId">
        <a-input
          v-if="isCopy || Number(query.id) > 0 || [1, 2].includes(sourceType) || query.type === 'read'"
          v-model="form.buyerMerchantName"
          disabled="disabled"
        />
        <a-select
          v-else
          v-model="form.buyerMerchantId"
          @change="(value) => (form.buyerMerchantId = value)"
          placeholder="请选择公司"
          option-filter-prop="children"
          showSearch
        >
          <a-select-option v-for="item in comList" :key="item.orgName" :value="item.id">
            {{ item.orgName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="合同类型" prop="contractType">
        <a-select
          v-if="Number($$($route.query, 'id')) > 0"
          :disabled="
            isCopy || Number($$($route.query, 'id')) > 0 || sourceType === 1 || $$($route.query, 'type') === 'read'
          "
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          allowClear
          placeholder="请选择合同类型"
          v-model="form.contractType"
        >
          <a-select-option :value="1">长协合同</a-select-option>
          <a-select-option :value="2">零采合同</a-select-option>
        </a-select>
        <a-select
          v-else
          :disabled="
            isCopy || Number($$($route.query, 'id')) > 0 || sourceType === 1 || $$($route.query, 'type') === 'read'
          "
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          allowClear
          v-model="form.contractType"
          placeholder="请选择合同类型"
        >
          <a-select-option :value="1">长协合同</a-select-option>
          <a-select-option :value="2">零采合同</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24" v-if="form.contractType === 1">
      <a-form-model-item label="是否框架采购" prop="frameBuyer">
        <a-radio-group
          v-model="form.frameBuyer"
          :disabled="isCopy || $$($route.query, 'type') === 'read' || sourceType === 2"
        >
          <a-radio :value="1"> 是 </a-radio>
          <a-radio :value="0"> 否 </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="支付方式" prop="paymentType">
        <a-radio-group v-model="form.paymentType" :disabled="$$($route.query, 'type') === 'read'">
          <a-radio :value="1"> 电汇 </a-radio>
          <a-radio :value="2"> 承兑 </a-radio>
          <a-radio :value="3"> 两者皆可 </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="付款方式" prop="paymentMethod">
        <a-radio-group v-model="form.paymentMethod" :disabled="$$($route.query, 'type') === 'read'">
          <a-radio :value="1"> 账期 </a-radio>
          <a-radio :value="2"> 分阶段支付 </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24" v-if="form.paymentMethod === 1">
      <a-form-model-item label="账期(天)" prop="paymentDays">
        <a-input
          v-model="form.paymentDays"
          :maxLength="100"
          placeholder="请输入账期"
          :disabled="$$($route.query, 'type') === 'read'"
        />
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24" v-if="form.paymentMethod === 2">
      <a-form-model-item label="分阶段支付" prop="progressPayment">
        <a-input
          v-model="form.progressPayment"
          :maxLength="100"
          placeholder="请输入分阶段支付"
          :disabled="$$($route.query, 'type') === 'read'"
        />
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="合同名称">
        <a-input
          :maxLength="50"
          v-model="form.name"
          placeholder="请输入合同名称"
          :disabled="$$($route.query, 'type') === 'read'"
        />
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="合同编号" prop="code">
        <a-input v-model="form.code" placeholder="请输入合同编号" :disabled="$$($route.query, 'type') === 'read'" />
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="合同签订日期" prop="effectiveTime">
        <a-date-picker
          format="yyyy-MM-DD"
          v-model="form.effectiveTime"
          :disabled="$$($route.query, 'type') === 'read'"
        />
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="合同截止日期" :prop="form.contractType === 1 ? 'expireTime' : ''">
        <a-date-picker
          format="yyyy-MM-DD"
          v-model="form.expireTime"
          :disabled-date="disabledEndDate"
          :disabled="$$($route.query, 'type') === 'read'"
        />
      </a-form-model-item>
    </a-col>
  </a-row>
</template>

<script>
import moment from 'moment'
import * as api from '@/api/contract'
let timeout
export default {
  created() {
    this.form.contractType = 1
    api.getComList().then((res) => {
      if (res.code === '0') {
        this.comList = res.data.buyerMerchantList
        // this.supList = res.data.providerMerchantList
        if (this.comList.length > 0 && Number(this.$route?.query?.id || 0) === 0 && !this.$route?.query?.ids) {
          this.form.buyerMerchantId = this.comList[0].id
          this.form.buyerMerchantName = this.comList[0].orgName
          this.$forceUpdate()
        }
      }
    })
  },
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    isCopy: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({
        buyerMerchantId: '', // 公司ID
        buyerMerchantName: '', // 公司名称
        providerMerchantId: '',
        providerMerchantName: '', // 供应商
        contractType: '', // 合同类型 1长协合同 2零采合同
        frameBuyer: 0, // 是否框架采购 0.否 1.是
        paymentType: 1, // 支付方式 1电汇 2承兑 3两者皆可
        paymentMethod: 1, // 付款方式 1账期 2分阶段支付
        paymentDays: '', // 账期（天）
        progressPayment: '',
        name: '', // 合同名称
        code: '', // 合同编号
        effectiveTime: null, // 合同签订日期
        expireTime: null // 合同截止日期
      })
    },
    sourceType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      query: {
        id: this.$route.query?.id,
        type: this.$route.query?.type
      },
      fetching: false,
      moment,
      comList: [],
      supList: []
    }
  },
  methods: {
    handleChangeMerchant(v, i) {
      this.form.buyerMerchantId = v
      this.form.buyerMerchantName = i.key
    },
    handleChangeSupMerchant(v, i) {
      this.form.providerMerchantId = v
      this.form.providerMerchantName = i.key
    },
    disabledEndDate(endValue) {
      return (
        (!endValue || !this.form.effectiveTime ? new Date().valueOf() : this.form.effectiveTime.valueOf()) >=
        endValue.valueOf()
      )
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      timeout = setTimeout(() => {
        api.searchCom(value).then((ret) => {
          this.fetching = false
          this.supList = ret.data.providerMerchantList
        })
      }, 300)
    }
  },
  mounted() {
    // this.form.contractType = null
    // this.form.effectiveTime = moment(new Date())
  }
}
</script>
