/* eslint-disable no-unused-vars */
<!--
 * @Author: your name
 * @Date: 2021-07-07 17:06:07
 * @LastEditTime: 2021-07-19 12:00:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/organization/list/components/TheBusiness.vue
-->
<template>
  <div class="the-busiiness">
    <header-title>
      <span>工商信息</span>
    </header-title>
    <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
      <!-- <a-form-model-item label="企业性质">
        <div v-if="edit">{{ businessDetail.enterpriseNature === '1' ? '生产商' : '贸易商' }}</div>
        <a-radio-group
          v-else
          v-model="businessDetail.enterpriseNature"
          :options="[
            { label: '生产商', value: '1' },
            { label: '贸易商', value: '2' }
          ]"
        >
        </a-radio-group>
      </a-form-model-item> -->
      <a-form-model-item label="企业名称:">
        <a-input disabled v-model="businessDetail.enterpriseName" />
      </a-form-model-item>
      <!-- <a-form-model-item label="管理员手机号:">
        <a-input :disabled="edit" v-model="businessDetail.registerMobile" />
      </a-form-model-item> -->
      <a-form-model-item label="统一社会信用代码:">
        <a-input :disabled="edit" v-model="businessDetail.businessLicenceNo" />
      </a-form-model-item>
      <a-form-model-item label="法定代表人:">
        <a-input :disabled="edit" v-model="businessDetail.legalPersonName" />
      </a-form-model-item>
      <a-form-model-item label="成立日期:">
        <!-- <a-input v-if="edit" :disabled="edit" :value="businessDetail.businessLicencePeriodBegin | moment" /> -->
        <a-date-picker
          :disabled="edit"
          :default-value="
            businessDetail.businessLicencePeriodBegin
              ? moment(businessDetail.businessLicencePeriodBegin, 'YYYY-MM-DD')
              : ''
          "
          @change="businessLicencePeriodBeginChange"
        />
      </a-form-model-item>
      <a-form-model-item label="注册资金:">
        <a-input :disabled="edit" v-model="businessDetail.registeredCapital" />
      </a-form-model-item>
      <a-form-model-item label="公司类型:">
        <a-input :disabled="edit" v-model="businessDetail.enterpriseType" />
      </a-form-model-item>
      <a-form-model-item label="截止日期:">
        <!-- <a-input v-if="edit" :disabled="edit" :value="businessDetail.businessLicencePeriodEnd | moment" /> -->
        <a-date-picker
          :disabled="edit"
          :default-value="
            businessDetail.businessLicencePeriodEnd ? moment(businessDetail.businessLicencePeriodEnd, 'YYYY-MM-DD') : ''
          "
          @change="businessLicencePeriodEndChange"
        />
      </a-form-model-item>
      <a-form-model-item label="注册币种:">
        <a-input :disabled="edit" v-model="businessDetail.currency" />
      </a-form-model-item>
      <a-form-model-item label="经营范围:">
        <a-textarea :disabled="edit" v-model="businessDetail.businessScope" />
      </a-form-model-item>
      <a-form-model-item label="注册地:">
        <!-- <a-input
          :disabled="edit"
          :value="`${businessDetail.registeredProvinceName || ''}${businessDetail.registeredCityName || ''}${
            businessDetail.registeredRegionName || ''
          }`"
        /> -->
        <AreaSelect v-model="register" :disabled="edit" :selected.sync="selected" />
      </a-form-model-item>
      <a-form-model-item label="详细地址:">
        <a-textarea :disabled="edit" v-model="businessDetail.registeredDetailAddress" />
      </a-form-model-item>
      <a-form-model-item label="营业执照:">
        <ImagePreview v-if="edit" style="width: 80px" :value="businessDetail.businessLicenceUrl"></ImagePreview>
        <s-upload v-else v-model="businessDetail.businessLicenceUrl" list-type="picture-card">
          <div class="upload" v-show="!businessDetail.businessLicenceUrl">
            <div class="plus">
              <a-icon class="icon" type="plus" />
            </div>
            <div class="text">上传图片</div>
          </div>
        </s-upload>
      </a-form-model-item>
      <a-form-model-item label="授权委托书:">
        <ImagePreview v-if="edit" style="width: 80px" :value="businessDetail.powerOfAttorneyUrl"></ImagePreview>
        <s-upload v-else v-model="businessDetail.powerOfAttorneyUrl" list-type="picture-card">
          <div class="upload" v-show="!businessDetail.powerOfAttorneyUrl">
            <div class="plus">
              <a-icon class="icon" type="plus" />
            </div>
            <div class="text">上传图片</div>
          </div>
        </s-upload>
      </a-form-model-item>
    </a-form-model>

    <div class="class-btn">
      <a-button class="save-btn" v-if="!edit" type="primary" @click="onSave">保存</a-button>
      <a-button @click="$router.back()">返回</a-button>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { ImagePreview, AreaSelect } from '@/components/'
import { updateMerchantOrgInfo, getDetail } from '@/api/appealManage'
export default {
  components: { ImagePreview, AreaSelect },
  props: {
    businessDetail: {
      type: Object,
      default: () => {}
    },
    edit: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      info: {},
      register: [],
      selected: []
    }
  },
  methods: {
    moment,
    async getDetail() {
      const id = this.$route.params.id
      const res = await getDetail({ id })
      if (res.code === '0') {
        const {
          businessLicencePeriodBegin,
          businessLicencePeriodEnd,
          registeredProvinceCode,
          registeredCityCode,
          registeredRegionCode
        } = res.data
        this.info = {
          ...res.data,
          businessLicencePeriodBegin: businessLicencePeriodBegin ? moment(businessLicencePeriodBegin) : null,
          businessLicencePeriodEnd: businessLicencePeriodEnd ? moment(businessLicencePeriodEnd) : null
        }
        if (registeredProvinceCode && registeredCityCode && registeredRegionCode) {
          this.register = [Number(registeredProvinceCode), Number(registeredCityCode), Number(registeredRegionCode)]
        }
      }
    },
    businessLicencePeriodBeginChange(date, dateString) {
      this.businessDetail.businessLicencePeriodBegin = dateString
    },
    businessLicencePeriodEndChange(date, dateString) {
      this.businessDetail.businessLicencePeriodEnd = dateString
    },
    async onSave(rejectReason) {
      const { info, selected, businessDetail } = this
      const params = {
        ...info
      }
      if (selected.length === 3) {
        ;['registeredProvince', 'registeredCity', 'registeredRegion'].forEach((x, i) => {
          params[`${x}Code`] = selected[i]?.code
          params[`${x}Name`] = selected[i]?.name
        })
      }
      const res = await updateMerchantOrgInfo({ ...params, ...businessDetail })
      if (res.code === '0') {
        this.$message.success('操作成功')
        // this.$router.push({ name: 'AppealManageList' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.the-busiiness {
  .ant-form {
    margin-top: 20px;
  }
}
.class-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .save-btn {
    margin-right: 20px;
  }
}
</style>
