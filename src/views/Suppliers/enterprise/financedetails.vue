<template>
  <div>
    <Tabtitle :titleName="titleNameBan"></Tabtitle>
    <div class="finContent">
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="选择银行">
          <span>{{ data.bankName }}</span>
        </a-form-item>
        <a-form-item label="银行账号">
          <span>{{ data.bankNumber }}</span>
        </a-form-item>
        <a-form-item label="开户支行">
          <div class="cityClass" style="height: 50px">
            <span>{{ data.openBankProvince }}</span>
            <span>{{ data.openBankCity }}</span>
          </div>
          <div class="cityClass">
            <span>{{ data.openBankName }}</span>
          </div>
        </a-form-item>
        <a-form-item label="开户名称">
          <span>{{ data.bankAccountName }}</span>
        </a-form-item>
        <a-form-item label="支行联行号">
          <span>{{ data.bankBranchNumer }}</span>
        </a-form-item>
      </a-form>
    </div>
    <Tabtitle :titleName="titleNamePeo"></Tabtitle>
    <div>
      <div class="finContent">
        <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="证件类型">
            <span>{{ data.certificateType }}</span>
          </a-form-item>
          <a-form-item label="法定代表人身份证">
            <div class="IDcard">
              <ImagePreview :src="data.certificateFrontUrl"></ImagePreview>
            </div>
            <div class="IDcard">
              <ImagePreview :src="data.certificateReverseUrl"></ImagePreview>
            </div>
          </a-form-item>
          <a-form-item label="法定代表人">
            <span>{{ data.legalPersonName }}</span>
          </a-form-item>
          <a-form-item label="证件号码">
            <span>{{ data.certificateNumber }}</span>
          </a-form-item>
          <a-form-item label="证件有效期">
            <span>{{ data.certificateValid }}</span>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import Tabtitle from './tabtitle.vue'
import { ImagePreview } from '@/components/index.js'
export default {
  components: {
    Tabtitle: Tabtitle, // 导航标题
    ImagePreview
  },
  props: {},
  data() {
    return {
      bank_list: [], // 银行信息
      bankName: '', // 银行名字
      page: 1,
      userName: '',
      imageUrl: '',
      IDcard: '',
      mulist: [],
      titleNameBan: '银行信息',
      titleNamePeo: '法人信息',
      citys: [], // 省
      secondCity: [], // 市
      zhiBank: [], // 支行地址
      cityName: '请选择省',
      secondCityName: '请选择市'
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' })
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.finContent {
  padding: 20px 0;
  .IDcard {
    display: flex;
    margin-bottom: 10px;
    .uploadTishi {
      font-size: 12px;
    }
    .stateImg {
      margin-left: 20px;
    }
    /deep/ .ant-upload.ant-upload-select-picture-card {
      width: 80px;
      height: 80px;
    }
  }
  /deep/ .ant-form-item-control {
    position: relative;
    line-height: 40px;
    zoom: 1;
    background: #f7f7f7;
    border-radius: 4px;
    /* padding-bottom: 5px; */
    padding-left: 10px;
  }
}
</style>
