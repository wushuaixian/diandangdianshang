<template>
  <section class="contract-add">
    <div class="box" v-show="step === 1">
      <header-title class="header-title">
        <span>基本信息</span>
      </header-title>
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model
            layout="inline"
            ref="form1"
            :model="BasicForm"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <BasicForm v-model="BasicForm" :platformId="platformId" :isCopy="isCopy" :sourceType="sourceType" />
          </a-form-model>
        </div>
      </a-card>
      <header-title class="header-title">
        <span>模板信息</span>
      </header-title>
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model
            layout="inline"
            ref="form2"
            :model="TemplateForm"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <TemplateForm
              :platformId="platformId"
              v-model="TemplateForm"
              :merchantId="Number(BasicForm.buyerMerchantId)"
              @editTemplateType="editTemplateType"
            />
          </a-form-model>
        </div>
      </a-card>
      <div v-show="BasicForm.contractType === 1 || BasicForm.contractType === 2">
        <header-title class="header-title">
          <span>物料清单</span>
        </header-title>
        <Material
          :platformId="platformId"
          v-model="MaterialList"
          ref="Material"
          :basicForm="BasicForm"
          :sourceType.sync="sourceType"
          :isShowImport="isShowImport"
        />
      </div>
      <div class="file">
        <div class="file-name">附件：</div>
        <a-upload
          v-if="$$($route.query, 'type') !== 'read'"
          action="/api/back-manage-web/myContract/uploadContractAccessory"
          name="file"
          :file-list="fileList"
          @change="handleChangeFile"
        >
          <a-button> <a-icon type="upload" /> 上传文件 </a-button>
        </a-upload>
        <div class="file-list" v-else>
          <a-button type="link" class="item" v-for="(item, index) in fileList" :key="index" @click="download(item)">
            <a-icon type="paper-clip" />
            <div class="name">{{ item.name }}</div>
            <div class="tag" v-if="Number(item.type) === 0">双章合同附件</div>
            <div class="tag" v-else-if="Number(item.type) === 1">合同附件</div>
            <div class="tag" v-else-if="Number(item.type) === 2">驳回附件</div>
            <div class="tag" v-else-if="Number(item.type) === 3">终止附件</div>
          </a-button>
        </div>
      </div>
    </div>
    <WithTemplate
      :platformId="platformId"
      v-if="step === 2"
      v-model="preview"
      :materialList="MaterialList"
      :contractContent="AjaxForm.contractContent"
      :contractType="BasicForm.contractType"
    />
    <WithFunc
      :platformId="platformId"
      v-if="step === 3"
      v-model="preview"
      :materialList="MaterialList"
      :defaultFunc="AjaxForm.contractVariable"
      :contractType="BasicForm.contractType"
    />
    <a-modal v-model="closeForm.visible" title="确认关闭当前中标项目明细？" :footer="null">
      <a-form-model
        ref="closeForm"
        :model="closeForm"
        :rules="{
          reason: [{ required: true, message: '请填写关闭原因', trigger: 'blur' }]
        }"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item label="关闭原因" prop="reason">
          <a-input v-model="closeForm.reason" type="textarea" :rows="5" />
        </a-form-model-item>
        <a-form-model-item label="附件">
          <s-upload-file
            fileName="file"
            action="/api/back-manage-web/myContract/uploadContractAccessory"
            @change="(v) => changeCloseFile(v)"
          ></s-upload-file>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="CloseFormOK"> 确认关闭 </a-button>
          <a-button style="margin-left: 10px" @click="() => (closeForm.visible = false)"> 取消 </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <div class="foot-btn" v-show="step === 1">
      <a-button class="btns" @click="$router.back(-1)">返回</a-button>
      <a-button class="btns" type="primary" @click="Next" :loading="nextLoading">下一步</a-button>
    </div>
    <div class="foot-btn" v-show="step !== 1">
      <a-button class="btns" @click="$router.back(-1)">返回</a-button>
      <a-button class="btns" @click="step = 1">上一步</a-button>
      <a-button
        class="btns"
        v-show="$$($route.query, 'type') !== 'read'"
        type="primary"
        :loading="saveLoading"
        @click="Save"
      >
        保存
      </a-button>
      <a-button class="btns" @click="printContract">打印</a-button>
    </div>

    <a-modal v-model="visible" title="合同打印" :width="794">
      <template slot="footer">
        <a-button key="back" @click="() => (visible = false)"> 关闭 </a-button>
        <a-button type="primary" @click="printContract"> 打印 </a-button>
      </template>
      <div id="contractPreviewDom" ref="print">
        <div class="content contract-preview-dom" v-html="preview.previewDom"></div>
      </div>
    </a-modal>
  </section>
</template>

<script>
import * as api from '@/api/contract'
import moment from 'moment'
import BasicForm from './form/basic.vue'
import TemplateForm from './form/template.vue'
import Material from './list/material.vue'
import WithFunc from './template/withFunc.vue'
import WithTemplate from './template/withTemplate.vue'

export default {
  components: { BasicForm, TemplateForm, Material, WithFunc, WithTemplate },
  created() {
    this.id = this.$route.query?.id
    this.isCopy = this.$route.query?.copy
    this.sourceType = Number(this.$route.query?.sourceType) > 0 ? Number(this.$route.query?.sourceType) : 0
    if (this.id) {
      api.getContractDetail(this.id).then((res) => {
        if (res.code === '0') {
          this.MaterialList.lowerContractTotal = Number(res.data.lowerContractTotal)
          this.MaterialList.upperContractTotal = res.data.upperContractTotal
          if (res.data.itemPOList?.length) {
            this.MaterialList.list = res.data.itemPOList.map((m) => ({
              ...m,
              deliveryTime: m.deliveryTime ? moment(m.deliveryTime).format('yyyy-MM-DD') : null,
              taxAmount: m.taxAmount || (Number(m.contractMaterialNum) * Number(m.priceWithTax)).toFixed(2),
              priceWith: m.priceWith || (Number(m.priceWithTax) / (1 + Number(m.taxRate) / 100)).toFixed(2),
              status: m.status || 1
            }))
            this.sourceType = Number(this.MaterialList.list[0].sourceType)
          }
          this.BasicForm.buyerMerchantId = Number(res.data.buyerMerchantId)
          this.BasicForm.buyerMerchantName = res.data.buyerMerchantName
          this.BasicForm.providerMerchantId = Number(res.data.providerMerchantId)
          this.BasicForm.providerMerchantName = res.data.providerMerchantName
          this.BasicForm.contractType = Number(res.data.contractType)
          this.BasicForm.frameBuyer = res.data.frameBuyer
          this.BasicForm.paymentType = Number(res.data.paymentType)
          this.BasicForm.paymentMethod = Number(res.data.paymentMethod)
          this.BasicForm.paymentDays = res.data.paymentDays
          this.BasicForm.progressPayment = res.data.progressPayment
          this.BasicForm.name = res.data.name
          this.BasicForm.code = res.data.code
          this.BasicForm.effectiveTime = res.data.effectiveTime ? moment(res.data.effectiveTime) : null
          this.BasicForm.expireTime = res.data.expireTime ? moment(res.data.expireTime) : null
          this.TemplateForm.isUseTemplate = Number(res.data.buyerContractTemplateId) > 0 ? 1 : 0
          this.TemplateForm.buyerContractTemplateId = Number(res.data.buyerContractTemplateId)
          this.preview.contractContent = res.data.contractContent
          try {
            this.preview.funcList = JSON.parse(res.data.contractVariable)
          } catch (err) {}
          try {
            this.AjaxForm.contractVariable = JSON.parse(res.data.contractVariable)
          } catch (err) {}
          this.AjaxForm.contractContent = res.data.contractContent
          this.AjaxForm.buyerContractTemplateId = Number(res.data.buyerContractTemplateId)
          if (!this.isCopy) {
            if (this.$route.query?.type === 'read') {
              this.fileList = [
                ...res.data.contractStampPOList.map((m) => ({
                  uid: String(-m.id),
                  name: m.name,
                  type: m.type,
                  status: 'default',
                  url: m.url
                }))
              ]
            } else {
              this.fileList = res.data.contractStampPOList
                .filter((x) => Number(x.type) === 1)
                .map((m) => ({
                  uid: String(-m.id),
                  name: m.name,
                  type: m.type,
                  status: 'default',
                  url: m.url
                }))
            }
          }
          this.$forceUpdate()
          this.isEditTemplate = false
        }
      })
    } else {
      this.isShowImport = true
    }

    if (this.sourceType === 1) {
      api.getMaterialListWithSign(this.$route.query.ids.split(',').map((x) => Number(x))).then((res) => {
        if (res.code === '0') {
          this.MaterialList.list = res.data.contractPurchaseSignItemVOS.map((m) => ({
            ...m,
            deliveryTime: m.deliveryTime ? moment(m.deliveryTime).format('yyyy-MM-DD') : null,
            taxAmount: m.taxAmount || (Number(m.contractMaterialNum) * Number(m.priceWithTax)).toFixed(2),
            priceWith: m.priceWith || (Number(m.priceWithTax) / (1 + Number(m.taxRate) / 100)).toFixed(2),
            status: m.status || 1
          }))
          this.BasicForm.buyerMerchantId = res.data.buyerMerchantId
          this.BasicForm.buyerMerchantName = res.data.buyerMerchantName
          this.BasicForm.providerMerchantId = res.data.providerMerchantId
          this.BasicForm.providerMerchantName = res.data.providerMerchantName
          this.BasicForm.contractType = res.data.contractType
          this.BasicForm.frameBuyer = res.data.frameBuyer
          this.BasicForm.paymentType = res.data.paymentType
          this.BasicForm.paymentMethod = res.data.paymentMethod
          this.BasicForm.paymentDays = res.data.paymentDays
          this.BasicForm.progressPayment = res.data.progressPayment
        }
      })
    }
    if (this.sourceType === 2) {
      api.getMaterialListWithPlan(this.$route.query.ids.split(',').map((x) => Number(x))).then((res) => {
        if (res.code === '0') {
          this.MaterialList.list = res.data.itemPOList.map((m) => ({
            ...m,
            deliveryTime: m.deliveryTime ? moment(m.deliveryTime).format('yyyy-MM-DD') : null
          }))
          this.BasicForm.buyerMerchantId = Number(res.data.buyerMerchantId)
          this.$forceUpdate()
        }
      })
    }
  },
  props: {
    platformId: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      printObj: {
        id: 'contractPreviewDom',
        popTitle: '打印',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      visible: false,
      id: null,
      isCopy: false, // 是否为变更合同
      isShowImport: false, // 是否显示导入按钮
      sourceType: 0, // 合同来源 0.默认（手动创建）1.待签合同，2.计划执行，3.物料池导入，4.模板导入
      // 线上获取的表单（原始数据，不能修改）
      AjaxForm: {
        contractContent: '', // 原始模板DOM字符串
        contractVariable: [], // 原始变量列表
        buyerContractTemplateId: null // 原始模板ID
      },
      moment,
      isEditTemplate: true, // 是否变更模板
      step: 1,
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      // 基本信息表单
      BasicForm: {
        buyerMerchantId: '', // 公司ID
        buyerMerchantName: '', // 公司名称
        providerMerchantId: '', // 供应商ID
        providerMerchantName: '', // 供应商
        contractType: '', // 合同类型 1长协合同 2零采合同
        frameBuyer: 0, // 是否框架采购 0.否 1.是
        paymentType: 1, // 支付方式 1电汇 2承兑 3两者皆可
        paymentMethod: 1, // 付款方式 1账期 2分阶段支付
        paymentDays: '', // 账期（天）
        progressPayment: '', // 分阶段支付
        name: '', // 合同名称
        code: '', // 合同编号
        effectiveTime: null, // 合同签订日期
        expireTime: null // 合同截止日期
      },
      // 模板信息表单
      TemplateForm: {
        isUseTemplate: 1, // 是否使用模板 0.不使用 1.使用
        buyerContractTemplateId: null // 模板ID
      },
      form: {}, // 表单提交预留
      rules: {
        buyerMerchantId: [{ required: true, message: '请选择公司', trigger: 'change' }],
        providerMerchantId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        providerMerchantName: [{ required: true, message: '请输入供应商', trigger: 'change' }],
        contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        paymentType: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        paymentMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
        paymentDays: [{ required: true, message: '请填写账期', trigger: 'change' }],
        progressPayment: [{ required: true, message: '请填写分阶段支付', trigger: 'change' }],
        code: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请填写合同编号'))
              } else {
                api.checkContractCode(this.BasicForm.buyerMerchantId, this.id, this.BasicForm.code).then((ret) => {
                  if (ret.data === 0) {
                    callback()
                  } else {
                    callback(new Error(ret.message))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ],
        effectiveTime: [{ required: true, message: '请选择合同签订日期', trigger: 'change' }],
        expireTime: [{ required: true, message: '请选择合同截止日期', trigger: 'change' }],
        frameBuyer: [{ required: true, message: '请选择是否框架采购', trigger: 'change' }],
        buyerContractTemplateId: [{ required: true, message: '请选择合同模板', trigger: 'change' }]
      },
      // 模板预览相关
      preview: {
        funcList: [], // 模板中的变量列表
        previewDom: '', // 模板预览DOM字符串（渲染后）
        contractContent: '' // 模板DOM字符串（渲染前）
      },
      defaultFileList: [],
      // 物料明细相关
      MaterialList: {
        list: [], // 物料明细列表
        lowerContractTotal: 0, // 物料明细小写金额总计
        upperContractTotal: '', // 物料明细大写金额总计
        number: 0, // 导入类型 0.物料池导入，1.模板导入
        title: '物料池导入', // 导入标题
        importVisible: false, // 是否显示导入框
        importLoading: false, // 是否正在上传文件
        fileList: [] // 模板文件
      },
      // 关闭提示框表单
      closeForm: {
        visible: false, // 是否显示提示框
        reason: '', // 关闭原因
        enclosureUrl: '', // 关闭原因附件URL
        enclosureName: '' // 关闭原因附件名称
      },
      files: [],
      fileList: [], // 合同上传文件列表
      nextLoading: false, // 下一步按钮加载状态
      saveLoading: false // 保存按钮是否加载中
    }
  },
  methods: {
    PrintC() {
      this.visible = true
    },
    printContract() {
      sessionStorage.setItem('printDOM', this.preview.previewDom.replace(/{(.*?)}/g, ''))
      const { href } = this.$router.resolve({ name: `print` })
      window.open(href, '_blank')
    },
    async download(e) {
      const response = await fetch(e.url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = e.name
      a.click()
      a.remove()
    },
    changeCloseFile(v) {
      this.closeForm.enclosureName = v[0]?.name || ''
      this.closeForm.enclosureUrl = v[0]?.url || ''
    },
    editTemplateType() {
      this.preview.contractContent = ''
      this.AjaxForm.contractVariable = null
      this.isEditTemplate = true
    },
    handleChangeFile(o) {
      this.fileList = o.fileList
    },
    Validate(callback) {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.$refs.form2.validate((valid) => {
            if (valid) {
              let isTrue = true
              if (
                this.MaterialList.list.length > 0 &&
                ((this.BasicForm.contractType === 1 && this.BasicForm.frameBuyer === 0) ||
                  this.BasicForm.contractType === 2)
              ) {
                for (let i = 0; i < this.MaterialList.list.length; i++) {
                  // 是否填写`数量`
                  let isContractMaterialNum =
                    isNaN(this.MaterialList.list[i].contractMaterialNum) ||
                    this.MaterialList.list[i].contractMaterialNum === ''
                  // 是否填写`含税单价`
                  const isPriceWithTax =
                    !this.MaterialList.list[i].priceWithTax ||
                    isNaN(this.MaterialList.list[i].priceWithTax) ||
                    this.MaterialList.list[i].priceWithTax === ''
                  // 是否填写`税率`
                  const isTaxRate =
                    !this.MaterialList.list[i].taxRate ||
                    isNaN(this.MaterialList.list[i].taxRate) ||
                    this.MaterialList.list[i].taxRate === ''
                  let isDeliveryTime = !this.MaterialList.list[i].deliveryTime
                  let isDeliveryDays =
                    isNaN(this.MaterialList.list[i].deliveryDays) ||
                    this.MaterialList.list[i].deliveryDays === '' ||
                    this.MaterialList.list[i].deliveryDays === null ||
                    Number(this.MaterialList.list[i].deliveryDays) < 0
                  if (this.BasicForm.contractType === 1 && this.BasicForm.frameBuyer === 0) {
                    // 数量非必填，交货天数必填
                    isContractMaterialNum = false
                    isDeliveryTime = false
                  } else if (this.BasicForm.contractType === 2) {
                    // 数量必填，交货日期必填
                    isDeliveryDays = false
                  }
                  if (isContractMaterialNum || isPriceWithTax || isTaxRate || isDeliveryTime || isDeliveryDays) {
                    isTrue = false
                    this.$message.warning('请正确填写物料清单必填项')
                    return
                  }
                }
              } else {
                if (this.BasicForm.contractType === 1 && this.BasicForm.frameBuyer === 1) {
                  isTrue = true
                } else {
                  isTrue = false
                  this.$message.warning('请导入物料清单')
                }
              }
              if (isTrue) {
                callback()
              }
            } else {
              this.$message.info('请填写必填项')
            }
          })
        } else {
          this.$refs.form2.validate((valid) => {
            if (!valid) {
              return false
            }
          })
          this.$message.info('请填写必填项')
        }
      })
    },
    importFunc(resData) {
      for (const item in resData) {
        for (let i = 0; i < this.preview.funcList.length; i++) {
          if (this.preview.funcList[i].code === String(item)) {
            this.preview.funcList[i].value = resData[item] || ''
          }
        }
      }
      for (let i = 0; i < this.preview.funcList.length; i++) {
        if (this.preview.funcList[i].name === '合同类型') {
          this.preview.funcList[i].value = this.BasicForm.contractType === 1 ? '长协合同' : '零采合同'
        }
        if (this.preview.funcList[i].name === '是否框架采购') {
          this.preview.funcList[i].value = this.BasicForm.frameBuyer === 1 ? '是' : '否'
        }
        if (this.preview.funcList[i].name === '支付方式') {
          this.preview.funcList[i].value =
            this.BasicForm.paymentType === 1 ? '电汇' : this.BasicForm.paymentType === 2 ? '承诺' : '两者皆可'
        }
        if (this.preview.funcList[i].name === '付款方式') {
          this.preview.funcList[i].value = this.BasicForm.paymentMethod === 1 ? '账期' : '分阶段支付'
        }
        if (this.preview.funcList[i].name === '账期（天）') {
          this.preview.funcList[i].value = this.BasicForm.paymentDays
        }
        if (this.preview.funcList[i].name === '分阶段支付') {
          this.preview.funcList[i].value = this.BasicForm.progressPayment
        }
        if (this.preview.funcList[i].name === '合同名称') {
          this.preview.funcList[i].value = this.BasicForm.name
        }
        if (this.preview.funcList[i].name === '合同编号') {
          this.preview.funcList[i].value = this.BasicForm.code
        }
        if (this.preview.funcList[i].name === '合同签订日期') {
          this.preview.funcList[i].value = this.BasicForm.effectiveTime
            ? moment(this.BasicForm.effectiveTime).format('yyyy-MM-DD')
            : ''
        }
        if (this.preview.funcList[i].name === '合同截止日期') {
          this.preview.funcList[i].value = this.BasicForm.expireTime
            ? moment(this.BasicForm.expireTime).format('yyyy-MM-DD')
            : ''
        }
        if (this.preview.funcList[i].name === '合同税率%') {
          this.preview.funcList[i].value = this.MaterialList.list[0]?.taxRate || '0'
        }
        if (this.preview.funcList[i].name === '小写合同金额') {
          this.preview.funcList[i].value = this.MaterialList.lowerContractTotal
        }
        if (this.preview.funcList[i].name === '大写合同金额') {
          this.preview.funcList[i].value = this.MaterialList.upperContractTotal
        }
      }
    },
    Next() {
      this.Validate(() => {
        if (this.sourceType === 1) {
          if (this.MaterialList.list.filter((x) => x.status === 3).length > 0) {
            this.closeForm.visible = true
          } else {
            this.Continue()
          }
        } else {
          this.Continue()
        }
      })
    },
    CloseFormOK() {
      this.$refs.closeForm.validate((valid) => {
        if (valid) {
          this.Continue()
          this.closeForm.visible = false
        }
      })
    },
    Continue() {
      if (Number(this.TemplateForm.isUseTemplate) > 0) {
        // 如果没有做模板或类型的变更，则取合同详情中的模板
        if (
          Number(this.AjaxForm.buyerContractTemplateId) > 0 &&
          Number(this.AjaxForm.buyerContractTemplateId) === Number(this.TemplateForm.buyerContractTemplateId) &&
          this.isEditTemplate === false
        ) {
          // 模板原始内容
          this.preview.contractContent = this.AjaxForm.contractContent
          // 模板原始变量列表
          this.preview.funcList = this.AjaxForm.contractVariable
          this.nextLoading = true
          api.getComDetail(this.BasicForm.buyerMerchantId, this.BasicForm.providerMerchantId).then((ret) => {
            this.nextLoading = false
            if (ret.code === '0') {
              this.importFunc(ret.data)
              this.step = 3
            }
          })
        } else {
          this.nextLoading = true
          Promise.all([
            api.getTemplateDetail(this.TemplateForm.buyerContractTemplateId),
            api.getComDetail(this.BasicForm.buyerMerchantId, this.BasicForm.providerMerchantId)
          ]).then((res) => {
            this.nextLoading = false
            if (res[0].code === '0') {
              this.preview.contractContent = res[0].data.contractContent
              this.preview.funcList = JSON.parse(res[0].data?.templateVariable)?.map((m) => ({ ...m, value: '' }))
            }
            if (res[1].code === '0') {
              this.importFunc(res[1].data)

              this.step = 3
            }
          })
        }
      } else {
        this.step = 2
      }
    },
    Save() {
      this.form = { ...this.TemplateForm, ...this.BasicForm, contractContentShow: this.preview.previewDom }
      this.form.contractStampPOList = this.fileList.map((m) => {
        if (m.status === 'done') {
          if (m.response.code === '0') {
            if (m.response.data.length > 0) {
              return { url: m.response.data[0].url, name: m.response.data[0].name, type: 1 }
            }
          }
        } else if (m.status === 'default') {
          return { url: m.url, name: m.name, type: 1 }
        }
      })
      if (this.step === 3) {
        // for (let i = 0; i < this.preview.funcList.length; i++) {
        //   if (
        //     String(this.preview.funcList[i].value).trim() === '' &&
        //     Number(this.preview.funcList[i].name) >= 1 &&
        //     Number(this.preview.funcList[i].name) <= 30
        //   ) {
        //     this.$message.info(`请填写${this.preview.funcList[i].name}`)
        //     return
        //   }
        // }
        this.form.contractVariable = JSON.stringify(this.preview.funcList)
      } else {
        this.form.contractVariable = ''
      }
      this.form.contractContent = this.preview.contractContent
      this.form.contractItemPOList = this.MaterialList.list
      this.form.effectiveTime =
        this.form.effectiveTime === null ? '' : moment(this.form.effectiveTime).format('yyyy-MM-DD')
      this.form.expireTime = this.form.expireTime === null ? '' : moment(this.form.expireTime).format('yyyy-MM-DD')
      if (this.$route.query.copy) {
        this.saveLoading = true
        api.setCopyContract({ ...this.form, id: this.id }).then((ret) => {
          this.saveLoading = false
          if (ret.code === '0') {
            this.$router.push({ name: 'ContractPurchaseContractList' })
            this.$message.success('变更成功')
          }
        })
      } else if (Number(this.id) > 0) {
        this.saveLoading = true
        api.editContract({ ...this.form, id: this.id }).then((ret) => {
          this.saveLoading = false
          if (ret.code === '0') {
            this.$router.push({ name: 'ContractPurchaseContractList' })
            this.$message.success('保存成功')
          }
        })
      } else {
        if (this.sourceType > 0) {
          this.form.sourceType = this.sourceType
        }
        if (this.sourceType === 1) {
          this.form = { ...this.form, ...this.closeForm, purchaseSignItemPOS: this.MaterialList.list }
          this.saveLoading = true
          api.addContractWithSign(this.form).then((ret) => {
            this.saveLoading = false
            if (ret.code === '0') {
              this.$router.push({ name: 'ContractPurchaseContractList' })
              this.$message.success('保存成功')
            }
          })
        } else {
          this.saveLoading = true
          api.addContract(this.form).then((ret) => {
            this.saveLoading = false
            if (ret.code === '0') {
              this.$router.push({ name: 'ContractPurchaseContractList' })
              this.$message.success('保存成功')
            }
          })
        }
      }
    }
  },
  watch: {
    'BasicForm.contractType': {
      deep: true,
      handler() {
        this.$refs.Material.changeForm()
      }
    },
    'BasicForm.frameBuyer': {
      deep: true,
      handler() {
        this.$refs.Material.changeForm()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.contract-add {
  .box {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(154, 170, 180, 0.2);
    margin-bottom: 64px;
    .file {
      display: flex;
      flex-direction: row;
      margin-top: 16px;
      .file-name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #262626;
        text-align: right;
        line-height: 34px;
      }
      .file-list {
        width: 400px;
        .item {
          margin: 2px;
          padding: 4px;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          transition: all 0.3s;
          color: #666;
          &:hover {
            background: #f4f4f4;
            border-radius: 2px;
            color: #ff6b00;
            .tag {
              border: solid 1px #ff9e59;
            }
          }
          .name {
            padding-left: 2px;
            flex: 1;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .tag {
            transition: border 0.3s;
            background: #f4f4f4;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 6px;
            border-radius: 2px;
            font-size: 10px;
            height: 20px;
            padding: 0 10px;
            border: solid 1px #f4f4f4;
          }
        }
      }
    }
  }
  .foot-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 10;
    bottom: 0;
    right: 0;
    height: 64px;
    background: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    width: calc(100% - 256px);
    .btns {
      margin: 10px;
      height: 40px !important;
      width: 100px !important;
    }
  }
}
</style>
