<template>
  <div>
    <div>
      <Financedetails v-if="dataStatus == 1" :data="data"></Financedetails>
    </div>
    <div v-if="dataStatus == 2">
      <Tabtitle :titleName="titleNameBan"></Tabtitle>
      <FinanceState v-if="info && $$(info, 'auditStatus') !== '0'" :info="info" />
      <div class="finContent">
        <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="选择银行">
            <a-select
              allowClear
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              show-search
              v-decorator="['bankName', { rules: validatorRules.bankName.rules, initialValue: bankInfo }]"
              placeholder="请选择银行"
              option-filter-prop="children"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              labelInValue
              @change="handlebankNameChange"
            >
              <a-select-option v-for="i in bank_list" :key="i.id">{{ i.name }}</a-select-option>
            </a-select>
            <a-tooltip style="position: absolute; top: 3px; right: -22px" placement="top">
              <template slot="title">
                <p>平台目前只支持200家银行，请在下拉菜单中选择银行</p>
              </template>
              <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
              <a-icon type="question-circle" placement="top" />
            </a-tooltip>
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
            <div class="cityClass" style="margin-top: 20px">
              <!-- 支行选择 -->
              <a-select
                allowClear
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                mode="combobox"
                style="width: 100%"
                :token-separators="[',']"
                v-decorator="[
                  'zhiBankName',
                  { rules: validatorRules.zhiBankName.rules, initialValue: data.openBankName }
                ]"
                @change="handlezhiBankChange"
              >
                <!-- @blur="handleBankBlur" -->
                <a-select-option v-for="c in zhiBank" :key="c.lname">
                  {{ c.lname }}
                </a-select-option>
              </a-select>
              <!-- 支行选择 -->
              <!--  <a-select
                model="combobox"
                allowClear
                show-search
                labelInValue
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                option-filter-prop="children"
                :filter-option="filterOption"
                placeholder="请选择支行"
                v-decorator="['zhiBankName', validatorRules.zhiBankName]"
                @change="handlezhiBankChange"
              >
                <a-select-option v-for="c in zhiBank" :key="c.bankCode" :lable="c.lname">
                  {{ c.lname }}
                </a-select-option>
              </a-select>-->
            </div>
          </a-form-item>
          <a-form-item label="银行账号">
            <a-input
              :maxLength="25"
              v-decorator="['bankCardID', { rules: validatorRules.bankCardID.rules, initialValue: data.bankNumber }]"
              autocomplete="off"
              type="number"
              placeholder="请输入银行账号"
            />
            <a-tooltip style="position: absolute; top: -57px; right: -22px" placement="top">
              <template slot="title">
                <p>找不到想要的银行信息,请手工录入</p>
              </template>
              <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
              <a-icon type="question-circle" placement="top" />
            </a-tooltip>
            <div class="bankDenger">
              银行信息直接影响贵司收款及提现功能，提交后如需修改，需提交盖章的变更申请单，请您谨慎填写！
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
              v-decorator="[
                'zhiBankCard',
                { rules: validatorRules.zhiBankCard.rules, initialValue: data.bankBranchNumer }
              ]"
              autocomplete="off"
              type="number"
              placeholder="请输入支行联行号"
            />
            <a-tooltip style="position: absolute; top: 3px; right: -22px" placement="top">
              <template slot="title">
                <p>联行号可通过客服搜索或拨打该银行的服务热线，进行人工客服查询</p>
              </template>
              <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
              <a-icon type="question-circle" placement="top" />
            </a-tooltip>
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
                show-search
                v-decorator="[
                  'certificateType',
                  {
                    rules: validatorRules.IDcardType.rules,
                    initialValue: data.certificateType ? Number(data.certificateType) : ''
                  }
                ]"
                option-filter-prop="children"
                class="idcard"
                :filter-option="filterOption"
                placeholder="请选择证件类型"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
              >
                <a-select-option key="">请选择证件类型</a-select-option>
                <a-select-option v-for="i in cardTypeList" :value="i.typeId" :key="i.typeId">
                  {{ i.typeName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <!-- 身份证正面 -->
            <a-form-item class="idCardLable" :label="doCardInfoVisible ? '法定代表人身份证' : '法定代表人证件'">
              <a-form-item>
                <div class="IDcard">
                  <s-upload
                    class="idcardUP"
                    v-decorator="[
                      'cardFace',
                      { rules: validatorRules.cardFace.rules, initialValue: data.certificateFrontUrl }
                    ]"
                    list-type="picture-card"
                    v-model="IDcardJustUrl"
                  >
                    <!-- <img class="idcardImg" v-if="IDcardJustUrl" :src="IDcardJustUrl" alt="avatar" /> -->
                    <div class="upload" v-if="!IDcardJustUrl">
                      <div class="plus">
                        <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                      </div>
                      <div class="text">上传图片</div>
                    </div>
                  </s-upload>
                  <img class="stateImg" :src="require('@/assets/images/enterprise/身份证正面.png')" alt="" />
                </div>
                <div class="uploadTishi">提示：单个上传文件最大为4M，支持JPG、JPEG、PNG</div>
              </a-form-item>
              <!-- 身份证反面 -->
              <a-form-item>
                <div class="IDcard">
                  <s-upload
                    class="idcardUP"
                    v-decorator="[
                      'cardBack',
                      {
                        rules: validatorRules.cardBack.rules,
                        initialValue: data.certificateReverseUrl
                      }
                    ]"
                    list-type="picture-card"
                    v-model="IDcardBackUrl"
                  >
                    <div class="upload" v-if="IDcardBackList.length === 0">
                      <div class="plus">
                        <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                      </div>
                      <div class="text">上传图片</div>
                    </div>
                  </s-upload>
                  <img class="stateImg" :src="require('@/assets/images/enterprise/身份证反面.png')" alt="" />
                </div>
                <div class="uploadTishi">提示：单个上传文件最大为4M，支持JPG、JPEG、PNG</div>
              </a-form-item>
            </a-form-item>
            <a-form-item label="法定代表人">
              <a-input
                v-decorator="['IDName', { rules: validatorRules.IDName.rules, initialValue: IDName }]"
                :disabled="IDName || !doCardInfoVisible ? false : true"
                placeholder="请输入法定代表人"
                autocomplete="off"
              />
            </a-form-item>
            <a-form-item label="证件号码">
              <a-input
                v-decorator="['IDCard', { rules: validatorRules.IDCard.rules, initialValue: IDCard }]"
                :disabled="IDCard || !doCardInfoVisible ? false : true"
                placeholder="请输入证件号码"
                autocomplete="off"
              />
            </a-form-item>
            <a-form-item label="证件有效期">
              <a-input
                v-decorator="['IDDate', { rules: validatorRules.IDDate.rules, initialValue: IDDate }]"
                :disabled="IDDate || !doCardInfoVisible ? false : true"
                placeholder="请输入证件有效期"
                autocomplete="off"
              />
              <a-tooltip style="position: absolute; top: 3px; right: -22px" placement="top">
                <template slot="title">
                  <p>日期格式:如 2022年1月1日请输入2022-01-01，如果为长期请直接输入“长期”</p>
                </template>
                <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
                <a-icon type="question-circle" placement="top" />
              </a-tooltip>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <fixed-box class="btnBottom">
        <a-button class="btnLeft" size="large" @click="handleCancel">取消</a-button>
        <a-button class="btnRight" size="large" type="primary" @click="addFinanceFrom">提交</a-button>
      </fixed-box>
    </div>
  </div>
</template>

<script>
import Tabtitle from './tabtitle.vue'
import Entbnt from './entbnt.vue'
import Financedetails from './financedetails.vue'
import FinanceState from './compontents/financeState'
import { randomNum } from '@/utils/util'
import {
  listmulti,
  queryBankaps,
  ocrIdFace,
  ocrIdBack,
  queryFInanceInfoByMerchantId,
  submitFinanceInfo
} from '@/api/enterprise'
import citys from './area_mini.json'
export default {
  components: {
    Tabtitle: Tabtitle, // 导航标题
    Entbnt: Entbnt, // 底部按钮
    Financedetails: Financedetails,
    FinanceState
  },
  data() {
    return {
      bankInfo: {},
      info: null,
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
      zhiBankName: '', // 支行名称
      cardTypeList: [
        { typeId: 1, typeName: '身份证' },
        { typeId: 2, typeName: '护照' },
        { typeId: 4, typeName: '港澳居民往来内地通行证' },
        { typeId: 5, typeName: '台胞证' }
      ],
      doCardInfoVisible: true,
      IDcardJustList: [],
      previewJustVisible: false,
      IDcardJustUrl: '',
      IDcardBackList: [],
      fetching: false,
      previewBackVisible: false,
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
              message: '请输入银行卡号'
            },
            {
              validator: this.checkCardID // 自定义的校验函数
            }
          ],
          trigger: 'blur' // 触发方式失去焦点
        },
        zhiBankName: {
          rules: [
            {
              required: true,
              message: '请选择支银行'
            }
          ]
        },
        zhiBankCard: {
          rules: [
            {
              required: true,
              message: '请选择输入支行编号'
            },
            {
              validator: this.checkBankCard // 自定义的校验支行号位数
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
        IDcardType: {
          rules: [
            {
              required: true,
              message: '请选择证件类型'
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
        cardBack: {
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
            },
            {
              validator: this.checkIDCard // 自定义的校验函数
            }
          ]
        },
        IDDate: {
          rules: [
            {
              required: true,
              message: '请输入证件有效日期'
            },
            {
              validator: this.checkIDDate // 校验组日期格式
            }
          ],
          trigger: 'blur' // 触发方式失去焦点
        }
      }
    }
  },
  watch: {
    IDcardJustUrl: {
      handler(newVal, oldVal) {
        if (this.doCardInfoVisible) {
          if (newVal && newVal !== '') {
            this.getCardsFace(newVal)
          } else {
            this.form.setFieldsValue({ IDName: '' })
            this.form.setFieldsValue({ IDCard: '' })
            this.IDName = ''
            this.IDCard = ''
          }
        }
      }
    },
    IDcardBackUrl: {
      handler(newVal, oldVal) {
        if (this.doCardInfoVisible) {
          if (newVal && newVal !== '') {
            this.getCardsBack(newVal)
          } else {
            this.form.setFieldsValue({ IDDate: '' })
            this.IDDate = ''
          }
        }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {})
  },
  async created() {
    await this.getListmulti()
    this.getdata()
    this.citys = citys
  },
  mounted() {
    setTimeout(this.getUserName, 1000)
  },
  methods: {
    handleCancel() {
      this.$router.go(-1)
    },
    async getUserName() {
      const userName = this.$store.state.user.info.enterpriseName

      this.form.setFieldsValue({ userName: userName })
    },
    // 获取企业银行信息
    async getdata() {
      const { data } = await queryFInanceInfoByMerchantId()
      this.info = data
      if (!data) {
        this.dataStatus = 2 // 从新录入
        return
      }
      if (data && data.auditStatus !== '3') {
        this.dataStatus = 1
        this.data = data
      } else if (data.auditStatus === '3') {
        this.data = data
        this.dataStatus = 2 // 从新录入
        this.cityName = data?.openBankProvince
        this.secondCityName = data?.openBankCity
        // if (data?.certificateType === '1') {
        //   this.getCardsFace(data?.certificateFrontUrl)
        //   this.getCardsBack(data?.certificateReverseUrl)
        //   this.doCardInfoVisible = true
        // } else {
        this.IDName = data.legalPersonName
        this.IDCard = data.certificateNumber
        this.IDDate = data.certificateValid
        this.doCardInfoVisible = false
        // }
        this.IDcardJustUrl = data?.certificateFrontUrl
        this.IDcardBackUrl = data?.certificateReverseUrl
        const bank = this.bank_list.find((x) => x.name === data?.bankName)
        this.bankInfo = { label: bank?.name, value: bank?.id }
        this.handlebankNameChange({ label: bank?.name, value: bank?.id })
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
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.addFinance(values)
      })
    },

    // 获取银行
    async addFinance(values) {
      const promse = {
        bankName: this.bankName,
        bankNumber: values.bankCardID,
        openBankProvince: this.cityName,
        openBankCity: this.secondCityName,
        openBankName: values.zhiBankName,
        bankAccountName: values.userName,
        bankBranchNumer: values.zhiBankCard,
        certificateType: values.certificateType,
        certificateFrontUrl: this.IDcardJustUrl,
        certificateReverseUrl: this.IDcardBackUrl,
        legalPersonName: values.IDName,
        certificateNumber: values.IDCard,
        certificateValid: values.IDDate
      }
      // const data = await checkFinanceInfo(promse)
      // console.log(data)
      const that = this
      // if (data.data === 'OK') {
      //   // 0直接走submit  因为submit直接通过
      //   const data = await submitFinanceInfo(promse)
      //   this.$message.success(data.data)
      //   this.getdata()
      // } else {
      this.$confirm({
        // 非0直接走submit  因为submit直接通过
        title: '请确认银行信息与法人信息是否填写正确?',
        content: (h) => <div style="color:red;"></div>,
        onOk: async () => {
          const data = await submitFinanceInfo(promse)
          that.$message.success(data.data)
          that.getdata()
        },
        onCancel() {},
        class: 'test'
      })
      // }
    },
    // 绑定value值
    handlebankNameChange({ label }) {
      this.bankName = label
      this.form.setFieldsValue({ zhiBankCard: '' })
      if (this.secondCityName && this.secondCityName !== '请选择市') {
        this.form.setFields({ zhiBankName: '' })
        this.zhiBank = []
        this.getZhiBank()
      }
    },
    handleChange(value) {
      if (value === 1) {
        this.doCardInfoVisible = true
      } else {
        this.doCardInfoVisible = false
      }
    },
    handleBlur() {},
    handleFocus() {},
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
      this.form.setFieldsValue({ zhiBankCard: '' })
      // this.secondCity = this.citys[value]
    },
    // 查询支行
    async handleSecondCityChange() {
      this.form.setFields({ zhiBankName: '' })
      this.getZhiBank()
      this.zhiBank = []
      // this.secondCity = this.citys[value]
    },

    // 获取支行名字
    async handlezhiBankChange(value) {
      const item = this.zhiBank.find((x) => x.lname === value)
      if (item) {
        this.form.setFieldsValue({ zhiBankCard: item?.bankCode })
      }
      // else {
      //   this.form.setFieldsValue({ zhiBankCard: randomNum(0, 9999999999) })
      // }
    },
    handleBankBlur() {
      const lname = this.form.getFieldValue('zhiBankName')
      const item = this.zhiBank.find((x) => x.lname === lname)
      if (!item) {
        this.form.setFieldsValue({ zhiBankCard: randomNum(0, 1000000000000) })
      }
    },
    // 银行递归
    async getZhiBank() {
      const bankCardID = this.form.getFieldValue('bankCardID')
      // const bankId = this.form.getFieldValue('bankName')
      const bank = this.bank_list.find((x) => x.name === this.bankName)
      const params = {
        bank: bank?.name, // 银行
        card: bankCardID, // 卡号
        city: this.secondCityName, // 城市
        key: '', // 秘钥
        page: this.page, // 页码
        province: this.cityName // 省份
      }
      const { data } = await queryBankaps(params)
      // this.zhiBank = data.data.record
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
      } else {
        _this.form.setFields({ cardFace: { value: IDcardFace, errors: [new Error('请上传正确清晰的身份证照片')] } })
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
      } else {
        _this.form.setFields({ cardBack: { value: IDcardBack, errors: [new Error('请上传正确清晰的身份证照片')] } })
      }
    },
    // 自定义校验
    checkCardID(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        const pattern =
          /^([0-9]{1})(\d{5}|\d{6}|\d{7}|\d{8}|\d{9}|\d{10}|\d{11}|\d{12}|\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|\d{20}|\d{21}|\d{22}|\d{23}|\d{24})$/
        const str = value.replace(/\s+/g, '')
        if (!pattern.test(str)) {
          callback(new Error('银行卡格式不正确!'))
        } else {
          callback()
        }
      }
    },
    checkBankCard(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        const pattern = /(^\d{12}$)/
        const str = value.replace(/\s+/g, '')
        if (!pattern.test(str)) {
          callback(new Error('支行号格式不正确!'))
        } else {
          callback()
        }
      }
    },

    checkIDCard(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (this.doCardInfoVisible) {
          const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          const str = value.replace(/\s+/g, '')
          if (!pattern.test(str)) {
            callback(new Error('身份证格式不正确!'))
          } else {
            callback()
          }
        } else {
          const pattern = /[^\u00-\uFF]/
          const str = value.replace(/\s+/g, '')
          if (pattern.test(str)) {
            callback(new Error('证件格式不正确!'))
          } else {
            callback()
          }
          callback()
        }
      }
    },
    checkIDDate(rule, value, callback) {
      const IDstr = value.indexOf('长期')
      if (!value) {
        callback()
      } else if (IDstr >= 0) {
        callback()
      } else {
        const pattern = /^([0-9]{4}-[0-9]{2}-[0-9]{2}$)/
        const str = value.replace(/\s+/g, '')
        if (!pattern.test(str)) {
          callback(new Error('日期格式:如 2022年1月1日请输入2022-01-01，如果为长期请直接输入“长期”'))
        } else {
          const expireTime = Date.parse(new Date(value))
          const nowTime = Date.parse(new Date())
          console.log(expireTime, nowTime)
          if (expireTime < nowTime) {
            callback(new Error('到期时间不能小于当前时间'))
          } else {
            callback()
          }
        }
      }
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
    // height: 50px;
    margin-top: 5px;
  }
  .idcard {
    width: 200px;
  }
  .IDcard {
    display: flex;
    // margin-bottom: 10px;
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
.idCardLable /deep/.ant-form-item-label::before {
  content: '*';
  color: rgb(240, 13, 13);
  display: inline-block;
  position: relative;
  top: 2px;
  right: 3px;
}
/deep/.ant-upload-list-picture-card .ant-upload-list-item {
  width: 80px;
  height: 80px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
.bankDenger {
  color: #ff6e04;
}
// .state {
//   height: 80px;
//   background: #fafafa;
//   border-radius: 4px;
//   margin-top: 10px;
//   .stateMu {
//     display: flex;
//     .stateMuLe {
//       width: 200px;
//       text-align: center;
//       display: inline-block;
//       .stateMuLeTitle {
//         color: #666666;
//         margin-top: 10px;
//         height: 26px;
//       }
//       .stateMuLeState {
//         font-size: 16px;
//         font-weight: 600;
//         color: #262626;
//         &.audit-reason {
//           height: 30px;
//           overflow: hidden;
//           line-height: 30px;
//           text-overflow: ellipsis;
//           width: 200px;
//           white-space: nowrap;
//         }
//       }
//     }
//     .stateMuRi {
//       display: inline-block;
//       width: 80px;
//       .stateImg {
//         width: 48px;
//         height: 48px;
//         margin-top: 14px;
//       }
//     }
//   }
// }
</style>
