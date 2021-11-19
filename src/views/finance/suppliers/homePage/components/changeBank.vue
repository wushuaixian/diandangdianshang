<template>
  <a-modal
    title="更改银行账户申请"
    width="600px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="提交"
  >
    <div class="finContent">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
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
              placeholder="请输入支行名称"
              style="width: 100%"
              :token-separators="[',']"
              v-decorator="[
                'zhiBankName',
                { rules: validatorRules.zhiBankName.rules, initialValue: data.openBankName }
              ]"
              @change="handlezhiBankChange"
            >
              <a-select-option v-for="c in zhiBank" :key="c.lname">
                {{ c.lname }}
              </a-select-option>
            </a-select>
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
            <a-icon type="question-circle" placement="top" />
          </a-tooltip>
          <!-- <div class="bankDenger">
          银行信息直接影响贵司收款及提现功能，提交后如需修改，需提交盖章的变更申请单，请您谨慎填写！
        </div> -->
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
        <a-form-item label="授权函">
          <div class="uploadBox">
            <s-upload
              v-model="fileUrl"
              action="/api/back-manage-web/media/uploadFile"
              v-decorator="['fileUrl', { rules: validatorRules.fileUrl.rules, fileUrl }]"
              class="supload"
              fileName="Filedata"
              list-type="picture"
            >
              <a-button style="width: 150px"> <a-icon type="upload" /> 上传授权函 </a-button>
            </s-upload>
            <a-button @click.stop="templateDownload" style="margin-left: 20px">
              <a-icon type="download" />授权函模板下载
            </a-button>
            <!-- <button @click="$refs.file.click()">上传</button>
            <input type="file" ref="file" @change="xx" /> -->
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import { queryBankaps, listmulti, queryFInanceInfoByMerchantId } from '@/api/enterprise'
import { changeBank } from '@/api/fince'
import axios from 'axios'
import citys from '@/views/enterprise/area_mini.json'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  // 省 province 市city 开户支行 openBankName   //银行名称 paymentBank  // 开户名称 bankAccountName(公司名称) //银行编号 openBankNo //授权函地址 authorizationUrl

  data() {
    return {
      bankInfo: '',
      fileUrl: '',
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
        fileUrl: {
          rules: [
            // rules是验证规则，
            {
              required: true, // 是否为必填，否则将会出现提示信息
              message: '请上传授权函' // 当输入框为空时，呈现出的提示信息
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
        }
      }
    }
  },
  watch: {},
  beforeCreate() {
    this.form = this.$form.createForm(this, {})
  },
  async created() {
    await this.getListmulti()
    // this.getdata()
    this.citys = citys
  },
  mounted() {
    setTimeout(this.getUserName, 1000)
  },
  methods: {
    handleOk() {
      this.addFinanceFrom()
    },
    handleCancel() {
      this.form.resetFields()
      this.$emit('close')
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
        if (data?.certificateType === '1') {
          this.getCardsFace(data?.certificateFrontUrl)
          this.getCardsBack(data?.certificateReverseUrl)
          this.doCardInfoVisible = true
        } else {
          this.doCardInfoVisible = false
        }
        this.IDcardJustUrl = data?.certificateFrontUrl
        this.IDcardBackUrl = data?.certificateReverseUrl
        const bank = this.bank_list.find((x) => x.name === data?.bankName)
        this.bankInfo = { label: bank?.name, value: bank?.id }
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
      // 省 province 市city 开户支行 openBankName   //银行名称 paymentBank  // 开户名称 bankAccountName(公司名称)
      // 银行编号 openBankNo //授权函地址 authorizationUrl
      const promse = {
        paymentBank: this.bankName,
        paymentCard: values.bankCardID,
        province: this.cityName,
        city: this.secondCityName,
        openBankName: values.zhiBankName,
        bankAccountName: values.userName,
        openBankNo: values.zhiBankCard,
        authorizationUrl: this.fileUrl
      }
      changeBank({ ...promse }).then((res) => {
        if (res.code === '0') {
          this.$emit('close')
          this.$message.success('银行卡更换申请提交成功！')
          console.log(res)
        }
      })
      console.log(promse)
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
    // 自定义校验
    checkCardID(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        const pattern = /^([0-9]{1})(\d{5}|\d{6}|\d{7}|\d{8}|\d{9}|\d{10}|\d{11}|\d{12}|\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|\d{20}|\d{21}|\d{22}|\d{23}|\d{24})$/
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
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    xx(e) {
      console.log()
      var file = new FormData()
      file.append('Filedata', this.$refs.file.files[0])
      axios.post('/api/back-manage-web/media/uploadFile', file)
    },
    async templateDownload(url) {
      const response = await fetch(
        'https://public-2020.ks3-cn-shanghai.ksyun.com/dev/back-manage-web/1628480589223_98.74458793235817_7c43175e-eb56-44f8-9933-f45803f02d82.doc'
      )
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = '变更函模板'
      a.click()
      a.remove()
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
.supload {
  width: 150px;
  display: inline-block;
  .left {
    margin-left: -10px;
  }
}
.uploadBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
</style>
