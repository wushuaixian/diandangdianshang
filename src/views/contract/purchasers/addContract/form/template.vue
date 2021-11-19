<template>
  <a-row :gutter="48">
    <a-col :md="8" :sm="24">
      <a-form-model-item label="是否对接电子签章">
        <a-radio-group :value="0" :disabled="true">
          <a-radio :value="1"> 对接 </a-radio>
          <a-radio :value="0"> 不对接 </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-col>
    <a-col :md="8">
      <a-form-model-item label="是否使用模板">
        <a-radio-group
          v-model="form.isUseTemplate"
          @change="handleChangeTemplateType"
          :disabled="$$($route.query, 'type') === 'read'"
        >
          <a-radio :value="1"> 使用 </a-radio>
          <a-radio :value="0"> 不使用 </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-col>
    <a-col :md="8" :sm="24">
      <a-form-model-item label="合同模板" v-if="form.isUseTemplate === 1" prop="buyerContractTemplateId">
        <a-select
          placeholder="请选择合同模板"
          v-model="form.buyerContractTemplateId"
          @change="handleChangeTemplate"
          :disabled="!merchantId > 0 || $$($route.query, 'type') === 'read'"
          option-filter-prop="children"
          showSearch
        >
          <a-select-option
            v-for="item in template"
            :title="`${item.name} - ${item.code}`"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}-{{ item.code }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
  </a-row>
</template>

<script>
import * as api from '@/api/contract'
export default {
  created() {
    if (this.merchantId > 0) {
      this.bindTemplate()
    }
  },
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        isUseTemplate: 1, // 是否使用模板 0.不使用 1.使用
        buyerContractTemplateId: null // 模板ID
      })
    },
    merchantId: {
      type: Number,
      default: 0
    },
    platformId: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      template: []
    }
  },
  methods: {
    bindTemplate() {
      api.getTemplateListNoPage(this.merchantId, this.platformId).then((ret) => {
        if (ret.code === '0') {
          this.template = ret.data
        }
      })
    },
    handleChangeTemplateType() {
      if (this.form.isUseTemplate === 0) {
        this.form.buyerContractTemplateId = null
      }
      this.$emit('editTemplateType')
    },
    handleChangeTemplate() {
      this.handleChangeTemplateType()
    }
  },
  watch: {
    merchantId() {
      if (this.merchantId > 0) {
        this.bindTemplate()
      }
    }
  }
}
</script>
