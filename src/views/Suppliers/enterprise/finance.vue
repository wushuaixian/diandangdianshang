<template>
  <div>
    <div>
      <Financedetails v-if="dataStatus == 1" :data="data"></Financedetails>
    </div>
    <div v-if="dataStatus == 2">
      <Tabtitle :titleName="titleNameBan"></Tabtitle>
      <div class="finContent">
        <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="选择银行">
            <a-select
              allowClear
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              show-search
              labelInValue
              v-decorator="['bankName', validatorRules.bankName]"
              placeholder="请选择银行"
              option-filter-prop="children"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handlebankNameChange"
            >
              <a-select-option v-for="i in bank_list" :key="i.id">{{ i.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="银行账号">
            <a-input
              v-decorator="['bankCardID', validatorRules.bankCardID]"
              autocomplete="off"
              placeholder="请输入银行账号"
            />
          </a-form-item>
          <a-form-item label="开户支行">
            <div class="cityClass cityClassOne">
              <!-- 省选择 -->
              <a-select
                allowClear
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                class="citys"
                v-model="cityName"
                show-search
                placeholder="请选择省"
                @change="handleCityChange"
              >
                <a-select-option v-for="item in citys" :key="item.label">
                  {{ item.label }}
                </a-select-option>
              </a-select>
              <!-- 市选择 -->
              <a-select
                allowClear
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                class="citys"
                v-model="secondCityName"
                show-search
                placeholder="请选择市"
                @change="handleSecondCityChange"
              >
                <a-select-option v-for="i in secondCity" :key="i.label">
                  {{ i.label }}
                </a-select-option>
              </a-select>
            </div>
            <div class="cityClass">
              <!-- 支行选择 -->
              <a-select
                allowClear
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                show-search
                labelInValue
                option-filter-prop="children"
                :filter-option="filterOption"
                placeholder="请选择支行"
                v-decorator="['zhiBankName', validatorRules.zhiBankName]"
              >
                <a-select-option v-for="c in zhiBank" :key="c.bankCode">
                  {{ c.lname }}
                </a-select-option>
              </a-select>
            </div>
          </a-form-item>
          <a-form-item label="开户名称">
            <a-input
              v-decorator="['userName', validatorRules.userName]"
              autocomplete="off"
              placeholder="请输入开户名称"
            />
          </a-form-item>
          <a-form-item label="支行联行号">
            <a-input
              v-decorator="['zhiBankName', validatorRules.zhiBankName]"
              autocomplete="off"
              placeholder="请输入支行联行号"
            />
          </a-form-item>
        </a-form>
      </div>
      <Tabtitle :titleName="titleNamePeo"></Tabtitle>
      <div>
        <div class="finContent">
          <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="证件类型">
              <a-select
                allowClear
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                v-decorator="['IDcard', validatorRules.IDcard]"
                show-search
                placeholder="请选择证件类型"
                option-filter-prop="children"
                class="idcard"
                :filter-option="filterOption"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
              >
                <a-select-option value="1"> 身份证 </a-select-option>
              </a-select>
            </a-form-item>
            <!-- 身份证正面 -->
            <a-form-item label="法定代表人身份证">
              <div class="IDcard">
                <a-upload
                  v-decorator="['cardFace', validatorRules.cardFace]"
                  id="IDcardJust"
                  class="idcardUP"
                  name="Filedata"
                  list-type="picture-card"
                  :show-upload-list="false"
                  action="/api/back-manage-web/media/uploadFile"
                  @change="handleIDcardJustChange"
                >
                  <img class="idcardImg" v-if="IDcardJustUrl" :src="IDcardJustUrl" alt="avatar" />
                  <div v-else>
                    <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
                <img class="stateImg" :src="require('@/assets/images/enterprise/身份证正面.png')" alt="" />
              </div>
              <div class="uploadTishi">提示：单个上传文件最大为4M，支持JPG、JPEG、PNG</div>
              <!-- 身份证反面 -->
              <div class="IDcard">
                <a-upload
                  v-decorator="['cardBack', validatorRules.cardBack]"
                  id="IDcardBack"
                  class="idcardUP"
                  name="Filedata"
                  list-type="picture-card"
                  :show-upload-list="false"
                  action="/api/back-manage-web/media/uploadFile"
                  @change="handleIDcardBackChange"
                >
                  <img class="idcardImg" v-if="IDcardBackUrl" :src="IDcardBackUrl" alt="avatar" />
                  <div v-else>
                    <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
                <img class="stateImg" :src="require('@/assets/images/enterprise/身份证反面.png')" alt="" />
              </div>
              <div class="uploadTishi">提示：单个上传文件最大为4M，支持JPG、JPEG、PNG</div>
            </a-form-item>
            <a-form-item label="法定代表人">
              <a-input
                v-decorator="['IDName', validatorRules.IDName]"
                :disabled="IDName ? false : true"
                placeholder="请输入法定代表人"
              />
            </a-form-item>
            <a-form-item label="证件号码">
              <a-input
                v-decorator="['IDCard', validatorRules.IDCard]"
                :disabled="IDCard ? false : true"
                placeholder="请输入证件号码"
              />
            </a-form-item>
            <a-form-item label="证件有效期">
              <a-input
                v-decorator="['IDDate', validatorRules.IDDate]"
                :disabled="IDDate ? false : true"
                placeholder="请输入证件有效期"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
      <!-- <Entbnt /> -->
      <fixed-box class="btnBottom">
        <a-button class="btnLeft" size="large">取消</a-button>
        <a-button class="btnRight" size="large" type="primary" @click="addFinanceFrom">提交</a-button>
      </fixed-box>
    </div>
  </div>
</template>

<script>
import Tabtitle from './tabtitle.vue'
import Entbnt from './entbnt.vue'
import Financedetails from './financedetails.vue'
import {
  listmulti,
  queryBankaps,
  ocrIdFace,
  ocrIdBack,
  queryFInanceInfoByMerchantId
  // submitFinanceInfo
} from '@/api/enterprise'
import citys from './area_mini.json'
export default {
  components: {
    Tabtitle: Tabtitle, // 导航标题
    Entbnt: Entbnt, // 底部按钮
    Financedetails: Financedetails
  },
  data() {
    return {
      dataStatus: 0,
      data: {}, // 详情信息
      bank_list: [], // 银行信息
      bankName: '', // 银行名字
      page: 1,
      titleNameBan: '银行信息',
      titleNamePeo: '法人信息',
      citys: [], // 省
      secondCity: [], // 市
      zhiBank: [], // 支行地址
      cityName: '请选择省',
      secondCityName: '请选择市',
      IDcardJustList: [],
      IDcardJustUrl: '',
      IDcardBackList: [],
      IDcardBackUrl: '',
      IDName: '',
      IDCard: '',
      IDDate: '',
      validatorRules: {
        bankName: {
          rules: [
            // rules是验证规则，
            {
              required: true, // 是否为必填，否则将会出现提示信息
              message: '请选择银行' // 当输入框为空时，呈现出的提示信息
            }
          ]
        },
        bankCardID: {
          rules: [
            {
              required: true,
              message: '请选择银行'
            },
            {
              validator: this.checkName // 自定义的校验函数
            }
          ]
        },
        zhiBankName: {
          rules: [
            {
              required: true,
              message: '请选择支银行'
            }
          ]
        },
        userName: {
          rules: [
            {
              required: true,
              message: '请输入开户名称'
            }
          ]
        },
        IDcard: {
          rules: [
            {
              required: true,
              message: '请输入选择证件类型'
            }
          ]
        },
        cardFace: {
          rules: [
            {
              required: true,
              message: '请上传证件照正面'
            }
          ]
        },
        cardBace: {
          rules: [
            {
              required: true,
              message: '请上传证件照反面'
            }
          ]
        },
        IDName: {
          rules: [
            {
              required: true,
              message: '请输入法定代表人'
            }
          ]
        },
        IDCard: {
          rules: [
            {
              required: true,
              message: '请输入证件号码'
            }
          ]
        },
        IDDate: {
          rules: [
            {
              required: true,
              message: '请输入证件有效日期'
            }
          ]
        }
      }
    }
  },
  watch: {
    IDcardJustUrl: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== '') {
          this.getCardsFace(newVal)
        }
      }
    },
    IDcardBackUrl: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== '') {
          this.getCardsBack(newVal)
        }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' })
  },
  created() {
    this.getListmulti()
    this.getdata()
    this.citys = citys
  },
  mounted() {},
  methods: {
    // 获取企业银行信息
    async getdata() {
      const { data } = await queryFInanceInfoByMerchantId()
      window.console.log(data)
      if (data) {
        this.dataStatus = 1
        this.data = data
      } else {
        this.dataStatus = 2
      }
    },
    // 获取银行
    async getListmulti() {
      const promse = { categories: ['TONGLIAN_BANK_LIST'] }
      const res = await listmulti(promse)
      if (res.success === true) {
        this.bank_list = res.data.TONGLIAN_BANK_LIST
      } else {
        this.$message.success(res.massage)
      }
    },

    // 验证表单
    addFinanceFrom() {
      window.console.log(111)
      this.form.validateFields((err, values) => {
        if (err) {
          this.addFinance(values)
          return
        }
        this.addFinance(values)
      })
    },

    // 获取银行
    async addFinance(values) {
      window.console.log(values)
      const promse = {
        bankName: this.bankName,
        bankNumber: values.bankCardID,
        openBankProvince: this.cityName,
        openBankCity: this.secondCityName,
        openBankName: '长沙支行',
        bankAccountName: '隋右边',
        bankBranchNumer: '123456789012',
        certificateType: '1',
        certificateFrontUrl: this.DcardJustUrl,
        certificateReverseUrl: this.IDcardBackUrl,
        legalPersonName: '陈平安',
        certificateNumber: '12023423423',
        certificateValid: '2021-02-01'
      }
      window.console.log(promse)
      // const res = await submitFinanceInfo(promse)
      // if (res.success === true) {
      //   this.bank_list = res.data.TONGLIAN_BANK_LIST
      // } else {
      //   this.$message.success(res.massage)
      // }
    },
    // 绑定value值
    handlebankNameChange(value) {
      this.bankName = value.label
      if (this.secondCityName && this.secondCityName !== '请选择市') {
        this.form.setFields({ zhiBankName: '' })
        this.zhiBank = []
        this.getZhiBank()
      }
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    handleBlur() {
      console.log('blur')
    },
    handleFocus() {
      console.log('focus')
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 城市二级联动
    handleCityChange(value) {
      this.form.setFields({ zhiBankName: '' })
      this.citys.filter((x) => {
        if (x.label === value) {
          this.secondCity = x.children
          this.secondCityName = '请选择市'
        }
      })
      this.zhiBank = []
      // this.secondCity = this.citys[value]
    },
    // 查询支行
    async handleSecondCityChange() {
      this.form.setFields({ zhiBankName: '' })
      this.getZhiBank()
      this.zhiBank = []
      // this.secondCity = this.citys[value]
    },
    // 银行递归
    async getZhiBank() {
      const bankCardID = this.form.getFieldValue('bankCardID')
      const params = {
        bank: this.bankName, // 银行
        card: bankCardID, // 卡号
        city: this.secondCityName, // 城市
        key: '', // 秘钥
        page: this.page, // 页码
        province: this.cityName // 省份
      }
      const { data } = await queryBankaps(params)
      if (data.resp?.respCode === '200') {
        // this.zhiBank=data.data.record
        if (data.data?.record.length <= 10) {
          this.page += 1
          const list = data.data.record
          list.map((Item) => {
            this.zhiBank.push(Item)
          })
          this.getZhiBank()
        } else {
          const list = data.data.record
          list.map((Item) => {
            this.zhiBank.push(Item)
          })
          this.page = 1
        }
      } else {
        this.page = 1
      }
    },
    beforeUpload(file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.IDcard = reader.result
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      return false
    },
    removeIDcardJust() {
      this.IDcardJustList = []
      this.IDcardJustUrl = ''
    },
    handleIDcardJustChange({ fileList }) {
      this.IDcardJustList = fileList
      if (fileList.length > 0) {
        this.IDcardJustUrl = this.IDcardJustList[fileList.length - 1].response?.data?.url
      } else {
        this.removeIDcardJust()
      }
      fileList = []
    },
    removeIDcardBack() {
      this.IDcardBackList = []
      this.IDcardBackUrl = ''
    },
    handleIDcardBackChange({ fileList }) {
      this.IDcardBackList = fileList
      if (fileList.length > 0) {
        this.IDcardBackUrl = this.IDcardBackList[fileList.length - 1].response?.data?.url
      } else {
        this.removeIDcardBack()
      }
    },
    // 获取身份证正面信息
    async getCardsFace(newVal) {
      const _this = this
      const IDcardFace = newVal
      const img = {
        imagePath: IDcardFace
      }
      const { data } = await ocrIdFace(img)
      if (data.statusCode === 200) {
        this.IDName = data.name
        _this.form.setFieldsValue({ IDName: data.name })
        this.IDCard = data.num
        _this.form.setFieldsValue({ IDCard: data.num })
      }
    },
    // 获取身份证反面信息
    async getCardsBack(newVal) {
      const _this = this
      const IDcardBack = newVal
      const img = {
        imagePath: IDcardBack
      }
      const { data } = await ocrIdBack(img)
      if (data.statusCode === 200) {
        this.IDDate = data.end_date.slice(0, 4) + '-' + data.end_date.slice(4, 6) + '-' + data.end_date.slice(6, 8)
        _this.form.setFieldsValue({ IDDate: this.IDDate })
      }
    },
    // 自定义校验
    checkName(rule, value, callback) {
      this.password = value
      callback()
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    }
  }
}
</script>
<style lang="less" scoped>
.finContent {
  padding: 20px 0;
  .cityClass {
    display: flex;
    justify-content: space-between;
    .citys {
      width: 49%;
    }
  }
  .cityClassOne {
    height: 50px;
  }
  .idcard {
    width: 200px;
  }
  .IDcard {
    display: flex;
    margin-bottom: 10px;
    .idcardUP {
      width: 80px;
      height: 80px;
    }
    .idcardImg {
      width: 100%;
      height: 60px;
    }
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
}
.btnBottom {
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 6px;
}
.btnLeft {
  width: 120px;
}
.btnRight {
  width: 120px;
}
</style>
