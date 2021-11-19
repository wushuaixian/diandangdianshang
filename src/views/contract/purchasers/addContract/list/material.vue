<template>
  <div class="material">
    <div class="import">
      <a-button
        v-show="sourceType != 1 && sourceType != 2"
        class="btns"
        @click="importMaterial"
        :disabled="Number(basicForm.buyerMerchantId) == 0 || $$($route.query, 'type') === 'read'"
      >
        物料池导入
      </a-button>
      <a-button
        v-show="sourceType != 1 && sourceType != 2"
        class="btns"
        @click="importFile(1)"
        :disabled="$$($route.query, 'type') === 'read'"
      >
        模板导入
      </a-button>
      <a-button
        v-show="sourceType != 1"
        class="btns"
        @click="showAddForm"
        :disabled="$$($route.query, 'type') === 'read'"
      >
        手动添加
      </a-button>
    </div>
    <s-table
      name="purchasersTables"
      ref="purchasersTable"
      :list="imp.list"
      :customPage="true"
      :scroll="{ x: 2000, y: 460 }"
      :columns="columns"
      @change="hanelChangePage"
    >
      <template slot="customcontractMaterialNum">
        <span class="xing">数量</span>
      </template>
      <template slot="custompriceWithTax">
        <span class="xing">含税单价</span>
      </template>
      <template slot="customtaxRate">
        <span class="xing">税率%</span>
      </template>
      <template slot="taxAmount" slot-scope="record">
        {{ record.taxAmount ? record.taxAmount : sumTotal(record.contractMaterialNum, record.priceWithTax) }}
      </template>
      <template slot="taxAmountWithout" slot-scope="record">
        {{
          record.taxAmountWithout ? record.taxAmountWithout : sum_total(record.contractMaterialNum, record.priceWith)
        }}
      </template>
      <template slot="priceWith" slot-scope="record">
        {{ record.priceWith ? record.priceWith : sum_price(record.priceWithTax, record.taxRate) }}
      </template>
      <template slot="customdeliveryTime">
        <span class="xing">交货日期</span>
      </template>
      <template slot="customdeliveryDays">
        <span class="xing">交货天数</span>
      </template>
      <template v-for="col in col" :slot="col.key" slot-scope="text, record, i">
        <div :key="col.key">
          <a-date-picker
            v-if="col.type == 'date'"
            :value="text ? moment(text) : null"
            :disabled="$$($route.query, 'type') === 'read'"
            @change="(date, datestr) => handleChangeDate(datestr, i, col)"
          />
          <a-input
            v-else-if="col.type === 'code'"
            :maxLength="30"
            :value="text"
            :disabled="$$($route.query, 'type') === 'read'"
            @change="(e) => handleChange(e, i, col)"
          ></a-input>
          <a-input
            v-else
            :maxLength="col.type == 'text' ? 100 : 10"
            :value="text"
            :disabled="$$($route.query, 'type') === 'read'"
            @change="(e) => handleChange(e, i, col)"
          />
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, i">
        <a-select
          v-if="sourceType === 1"
          :value="record.status"
          style="width: 100px"
          :disabled="$$($route.query, 'type') === 'read'"
          @change="(v) => handleChangeStatus(v, i)"
        >
          <a-select-option :value="1"> 签订 </a-select-option>
          <a-select-option :value="2"> 暂不签订 </a-select-option>
          <a-select-option :value="3"> 关闭 </a-select-option>
        </a-select>
        <a-button v-else @click="handleDelRow(i)" :disabled="$$($route.query, 'type') === 'read'" type="link">
          删除
        </a-button>
      </template>
      <template slot="footer" v-if="Number(basicForm.contractType) === 2">
        <div class="footer-box">
          <div class="l">合同金额：</div>
          <div class="r">{{ contractAamount }}元</div>
        </div>
      </template>
    </s-table>

    <a-modal
      :title="imp.title"
      :visible="imp.importVisible"
      :confirm-loading="imp.importLoading"
      :before-upload="beforeUpload"
      :okText="imp.importLoading ? '正在上传' : '确定'"
      @ok="handleOkImport"
      @cancel="handleCancelImport"
      :width="620"
    >
      <div class="file-box">
        <div class="file-name">导入文件：</div>
        <a-upload
          accept=".xls,.xlsx"
          class="file-list"
          :file-list="imp.fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          @change="handleChangeImport"
        >
          <a-button> <a-icon type="upload" /> 上传文件 </a-button>
        </a-upload>
      </div>
      <div class="file-box">
        <div class="file-name">导入模板下载：</div>
        <a class="file-text" @click="dowlod">点击下载</a>
      </div>
      <div class="file-box">
        <div class="file-name">温馨提示：</div>
        <div class="file-text">
          <div class="item">1. 支持xlsx格式的excel文件，大小≤2M，建议物料条数≤5000条。</div>
          <div class="item">2. 物料名称、单位、含税单价、税率（%）必填，否则将导入失败。</div>
          <div class="item">
            3.交货日期：零采合同的交货日期必填；交货日期的单元格格式为文本；请依如下格式输入：2021-07-09
          </div>
          <div class="item">4.交货天数：长协合同的交货天数必填</div>
        </div>
      </div>
    </a-modal>
    <MaterialModal :visible.sync="visible" :merchantId="Number(basicForm.buyerMerchantId)" @ok="ok"></MaterialModal>
    <a-modal v-model="visibleShowDelete" title="删除" ok-text="确定" cancel-text="取消" @ok="hideModalDelete">
      <p style="text-align: center">确认将当前数据删除？</p>
    </a-modal>

    <a-modal v-model="addForm.visible" title="添加物料明细" @cancel="handelCancelAdd" :footer="null" :width="800">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model
            layout="inline"
            ref="addFormModel"
            :model="addForm"
            :rules="rules"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 14 }"
          >
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-model-item label="物料编码" prop="materialCode">
                  <a-input v-model="addForm.materialCode" placeholder="请填写物料编码" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="物料名称" prop="materialName">
                  <a-input v-model="addForm.materialName" placeholder="请填写物料名称" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="规格型号" prop="materialModel">
                  <a-input v-model="addForm.materialModel" placeholder="请填写规格型号" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="数量"
                  :prop="basicForm.contractType === 1 && basicForm.frameBuyer === 0 ? '' : 'contractMaterialNum'"
                >
                  <a-input-number
                    v-model="addForm.contractMaterialNum"
                    :max="999999"
                    :min="0"
                    :precision="2"
                    style="width: 100%"
                    placeholder="请填写数量"
                    @change="handelChangePrice"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="单位" prop="mpMeasurementUnit">
                  <a-input v-model="addForm.mpMeasurementUnit" placeholder="请填写单位" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="含税单价" prop="priceWithTax">
                  <a-input-number
                    v-model="addForm.priceWithTax"
                    :max="99999999999"
                    :min="0"
                    :precision="2"
                    style="width: 100%"
                    placeholder="请填写含税单价"
                    @change="handelChangePrice"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="税率%" prop="taxRate">
                  <a-input-number
                    v-model="addForm.taxRate"
                    :max="100"
                    :min="0"
                    :precision="2"
                    style="width: 100%"
                    placeholder="请填写税率（%）"
                    @change="handelChangePrice"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="未税单价" prop="priceWith">{{ addForm.priceWith }}</a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="未税金额" prop="taxAmountWithout">
                  {{ addForm.taxAmountWithout }}
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="含税金额" prop="taxAmount">{{ addForm.taxAmount }} </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24" v-if="basicForm.contractType === 2">
                <a-form-model-item label="交货日期" prop="deliveryTime">
                  <a-date-picker
                    placeholder="请选择交货日期"
                    style="width: 100%"
                    :value="addForm.deliveryTime ? moment(addForm.deliveryTime) : null"
                    @change="(date, datestr) => (addForm.deliveryTime = datestr)"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24" v-if="basicForm.contractType === 1 && basicForm.frameBuyer === 0">
                <a-form-model-item label="交货天数" prop="deliveryDays">
                  <a-input-number
                    :min="0"
                    :max="99999"
                    style="width: 100%"
                    v-model="addForm.deliveryDays"
                    placeholder="请填写交货天数"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="生产厂家或品牌" prop="manufacturer">
                  <a-input v-model="addForm.manufacturer" placeholder="请填写生产厂家或品牌" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="12">
                <a-form-model-item label="申请组织" prop="applyDepartment">
                  <a-input v-model="addForm.applyDepartment" placeholder="请填写申请组织" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12">
                <a-form-model-item label="计划编号" prop="planItemCode">
                  <a-input v-model="addForm.planItemCode" placeholder="请填写计划单号" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12">
                <a-form-model-item label="备注" prop="remark">
                  <a-input v-model="addForm.remark" placeholder="请填写备注" :maxLength="300" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24">
                <a-form-model-item label="质保期" prop="ext1Info">
                  <a-input v-model="addForm.ext1Info" placeholder="请填写质保期" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="订单号" prop="ext2Info">
                  <a-input v-model="addForm.ext2Info" placeholder="请填写订单号" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="材质" prop="ext3Info">
                  <a-input v-model="addForm.ext3Info" placeholder="请填写材质" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="服务内容" prop="ext4Info">
                  <a-input v-model="addForm.ext4Info" placeholder="请填写服务内容" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="工期/服务期" prop="ext5Info">
                  <a-input v-model="addForm.ext5Info" placeholder="请填写工期/服务期" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item :wrapper-col="{ span: 0, offset: 9 }">
                  <a-button type="primary" @click="addList"> 添加 </a-button>
                  <a-button style="margin-left: 10px" @click="handelCancelAdd"> 取消 </a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/contract'
import { MaterialModal } from '@/components'
import { convertCurrency } from '@/utils/util'
import moment from 'moment'
const rules = {
  materialName: [{ required: true, message: '请填写物料名称', trigger: 'change' }],
  contractMaterialNum: [{ required: true, message: '请填写数量', trigger: 'change' }],
  mpMeasurementUnit: [{ required: true, message: '请填写单位', trigger: 'change' }],
  priceWithTax: [{ required: true, message: '含税单价(元)', trigger: 'change' }],
  taxRate: [{ required: true, message: '请填写税率', trigger: 'change' }],
  deliveryTime: [{ required: true, message: '请选择交货日期', trigger: 'change' }],
  deliveryDays: [{ required: true, message: '请填写交货天数', trigger: 'change' }]
}
const columns = {
  col: [
    { key: 'contractMaterialNum', type: 'float', min: 1, max: 9999 },
    // { key: 'priceWith', type: 'price', min: 0 },
    { key: 'priceWithTax', type: 'price', min: 0 },
    { key: 'taxRate', type: 'float', min: 0, max: 100 },

    { key: 'deliveryTime', type: 'date' },
    { key: 'deliveryDays', type: 'int', min: 0 },
    { key: 'manufacturer', type: 'text' },
    { key: 'applyDepartment', type: 'text' },
    { key: 'remark', type: 'text' },
    { key: 'planItemCode', type: 'code' },

    { key: 'ext1Info', type: 'text' },
    { key: 'ext2Info', type: 'text' },
    { key: 'ext3Info', type: 'text' },
    { key: 'ext4Info', type: 'text' },
    { key: 'ext5Info', type: 'text' }
  ],
  columns: [
    {
      title: '序号',
      width: 70,
      fixed: 'left',
      align: 'center',
      dataIndex: 'index',
      key: 'index',
      scopedSlots: { customRender: 'index' }
    },
    { title: '物料编码', width: 140, key: 'materialCode', dataIndex: 'materialCode' },
    { title: '物料名称', width: 160, key: 'materialName', dataIndex: 'materialName' },
    { title: '规格型号', width: 400, key: 'materialModel', dataIndex: 'materialModel' },
    {
      headerTitle: '数量',
      slots: { title: 'customcontractMaterialNum' },
      width: 100,
      dataIndex: 'contractMaterialNum',
      key: 'contractMaterialNum',
      scopedSlots: { customRender: 'contractMaterialNum' }
    },
    { title: '单位', width: 80, align: 'center', key: 'mpMeasurementUnit', dataIndex: 'mpMeasurementUnit' },
    {
      headerTitle: '含税单价(元)',
      slots: { title: 'custompriceWithTax' },
      width: 160,
      dataIndex: 'priceWithTax',
      key: 'priceWithTax',
      scopedSlots: { customRender: 'priceWithTax' }
    },
    {
      headerTitle: '税率%',
      slots: { title: 'customtaxRate' },
      width: 100,
      key: 'taxRate',
      dataIndex: 'taxRate',
      scopedSlots: { customRender: 'taxRate' }
    },
    {
      title: '未税单价',
      width: 100,
      key: 'priceWith',
      scopedSlots: { customRender: 'priceWith' }
    },
    {
      title: '未税金额(元)',
      width: 100,
      align: 'center',
      key: 'taxAmountWithout',
      scopedSlots: { customRender: 'taxAmountWithout' }
    },
    {
      title: '含税金额(元)',
      width: 100,
      align: 'center',
      key: 'taxAmount',
      scopedSlots: { customRender: 'taxAmount' }
    },

    {
      headerTitle: '交货日期',
      slots: { title: 'customdeliveryTime' },
      width: 160,
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      scopedSlots: { customRender: 'deliveryTime' }
    },
    {
      headerTitle: '交货天数',
      slots: { title: 'customdeliveryDays' },
      width: 100,
      key: 'deliveryDays',
      dataIndex: 'deliveryDays',
      scopedSlots: { customRender: 'deliveryDays' }
    },
    {
      title: '申请组织',
      width: 120,
      key: 'applyDepartment',
      dataIndex: 'applyDepartment',
      scopedSlots: { customRender: 'applyDepartment' }
    },
    {
      title: '采购申请编号',
      width: 120,
      key: 'buyerPlanCode',
      dataIndex: 'buyerPlanCode',
      scopedSlots: { customRender: 'buyerPlanCode' }
    },
    {
      title: '计划编号',
      width: 120,
      key: 'planItemCode',
      dataIndex: 'planItemCode',
      scopedSlots: { customRender: 'planItemCode' }
    },
    {
      title: '生产厂家或品牌',
      width: 180,
      key: 'manufacturer',
      dataIndex: 'manufacturer',
      scopedSlots: { customRender: 'manufacturer' }
    },
    { title: '备注', width: 250, key: 'remark', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } },

    {
      title: '质保期(月)',
      width: 200,
      key: 'ext1Info',
      dataIndex: 'ext1Info',
      scopedSlots: { customRender: 'ext1Info' }
    },
    { title: '订单号', width: 200, key: 'ext2Info', dataIndex: 'ext2Info', scopedSlots: { customRender: 'ext2Info' } },
    { title: '材质', width: 200, key: 'ext3Info', dataIndex: 'ext3Info', scopedSlots: { customRender: 'ext3Info' } },
    {
      title: '服务内容',
      width: 200,
      key: 'ext4Info',
      dataIndex: 'ext4Info',
      scopedSlots: { customRender: 'ext4Info' }
    },
    {
      title: '工期/服务期',
      width: 200,
      key: 'ext5Info',
      dataIndex: 'ext5Info',
      scopedSlots: { customRender: 'ext5Info' }
    },
    {
      title: '',
      align: 'center',
      fixed: 'right',
      key: 'action',
      width: 140,
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' }
    }
  ]
}
export default {
  components: { MaterialModal },
  model: {
    prop: 'imp',
    event: 'change'
  },
  props: {
    isShowImport: {
      type: Boolean,
      default: false
    },
    imp: {
      type: Object,
      default: () => ({
        list: [],
        lowerContractTotal: 0,
        upperContractTotal: '',
        number: 0, // 导入类型 0.物料池导入，1.模板导入
        title: '物料池导入',
        importVisible: false,
        importLoading: false,
        fileList: [],
        table: ''
      })
    },
    basicForm: {
      type: Object,
      default: () => {}
    },
    sourceType: {
      type: Number,
      default: 0
    }
  },
  created() {
    if (this.$route.query?.type === 'read') {
      this.columns.splice(this.columns.length - 1, 1)
    }
  },
  data() {
    return {
      current: 0,
      pageSize: 10,
      index: null,
      visible: false,
      rules,
      ...columns,
      moment,
      visibleShowDelete: false,
      addForm: {
        visible: false,
        id: null,
        materialCode: '', // 物料编码
        materialName: '', // 物料名称
        materialModel: '', // 规格型号
        contractMaterialNum: '', // 数量
        mpMeasurementUnit: '', // 单位
        priceWithTax: '', // 含税单价
        taxRate: '', // 税率
        priceWith: '0.00', // 未税单价
        taxAmountWithout: '0.00', // 未税金额
        taxAmount: '0.00', // 含税金额
        deliveryTime: '', // 交货日期
        deliveryDays: '', // 交货天数
        manufacturer: '', // 生产厂家或品牌
        applyDepartment: '', // 申请组织
        planItemCode: '', // 计划编号
        remark: '', // 备注
        ext1Info: '', // 质保期
        ext2Info: '', // 订单号
        ext3Info: '', // 材质
        ext4Info: '', // 服务内容
        ext5Info: '', // 工期/服务期
        sourceType: 4
      }
    }
  },
  watch: {
    'imp.list': {
      deep: true,
      handler() {
        this.priceCount()
      }
    }
  },
  computed: {
    contractAamount() {
      return this.totalNum(this.imp.list)
    }
  },
  methods: {
    hanelChangePage(pagination) {
      console.log(pagination.pagination)
      this.current = Number(pagination.pagination.current) - 1
      this.pageSize = Number(pagination.pagination.pageSize)
    },
    handelChangePrice() {
      this.addForm.taxAmount = (Number(this.addForm.contractMaterialNum) * Number(this.addForm.priceWithTax)).toFixed(2)
      this.addForm.priceWith = (Number(this.addForm.priceWithTax) / (1 + Number(this.addForm.taxRate) / 100)).toFixed(2)
      this.addForm.taxAmountWithout = (
        Number(this.addForm.contractMaterialNum) * Number(this.addForm.priceWith)
      ).toFixed(2)
    },
    handelCancelAdd() {
      this.$refs.addFormModel.resetFields()
      this.addForm.visible = false
    },
    showAddForm() {
      if (this.$refs.addFormModel !== undefined) {
        this.$refs.addFormModel.resetFields()
      }
      this.addForm.visible = true
    },
    addList() {
      this.$refs.addFormModel.validate((v) => {
        if (v) {
          this.imp.list.push({ ...this.addForm })
          this.addForm.visible = false
          this.$refs.addFormModel.resetFields()
        }
      })
    },
    changeForm() {
      const downColumns = JSON.parse(JSON.stringify(columns.columns))
      // 长协合同&非框架
      if (this.basicForm.contractType === 1 && this.basicForm.frameBuyer === 0) {
        downColumns[4].title = '数量'
        delete downColumns[4].slots
        downColumns.splice(11, 1)
      } else if (this.basicForm.contractType === 1 && this.basicForm.frameBuyer === 1) {
        downColumns[4].title = '数量'
        delete downColumns[4].slots
        downColumns[6].title = '含税单价(元)'
        delete downColumns[6].slots
        downColumns[7].title = '税率%'
        delete downColumns[7].slots
        downColumns[11].title = '交货日期'
        delete downColumns[11].slots
        downColumns[12].title = '交货天数'
        delete downColumns[12].slots
        downColumns.splice(11, 1)
      } else if (this.basicForm.contractType === 2) {
        downColumns.splice(12, 1)
      }
      this.columns = downColumns
    },
    ok(list) {
      this.imp.list = [
        ...this.imp.list,
        ...list.map((m) => ({
          id: null,
          materialCode: m.code,
          materialName: m.name,
          materialModel: m.materialModel,
          contractMaterialNum: '',
          mpMeasurementUnit: m.mpMeasurementUnit,
          priceWithTax: '',
          taxRate: '',
          priceWith: 0,
          taxAmountWithout: 0,
          taxAmount: 0,
          ext1Info: '',
          ext2Info: '',
          ext3Info: '',
          ext4Info: '',
          ext5Info: '',
          sourceType: 3
        }))
      ]
      this.$emit('update:sourceType', 3)
    },

    async dowlod() {
      const response = await fetch('/api/back-manage-web/myContract/downloadExcelTemplate?number=1')
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = '物料清单导入模板'
      a.click()
      a.remove()
    },
    importMaterial() {
      this.visible = true
    },
    handleRemove() {
      this.imp.fileList = []
      this.$forceUpdate()
    },
    beforeUpload(file) {
      this.imp.fileList = [file]
      return false
    },
    importFile(index) {
      this.imp.number = index
      this.imp.title = index === 0 ? '物料池导入' : '模板导入'
      this.imp.importLoading = false
      this.imp.importVisible = true
      this.imp.fileList = []
    },
    handleCancelImport() {
      this.imp.importVisible = false
    },
    handleOkImport() {
      if (this.imp.fileList.length > 0) {
        this.imp.importLoading = true
        const { fileList } = this.imp
        const formData = new FormData()
        formData.append('file', fileList[0])
        formData.append('number', 1)
        api.importFile(formData).then((ret) => {
          this.imp.importLoading = false
          if (ret.code === '0') {
            this.imp.list = [
              ...this.imp.list,
              ...ret.data.contractItemDots.map((m) => ({
                ...m,
                deliveryTime: m.deliveryTime ? moment(m.deliveryTime).format('yyyy-MM-DD') : null
              }))
            ]
            this.$emit('update:sourceType', 4)
            this.imp.lowerContractTotal = Number(ret.data.lowerContractTotal)
            this.imp.upperContractTotal = ret.data.upperContractTotal
            this.$forceUpdate()
            this.handleCancelImport()
            if (ret.data?.stringList?.length > 0) {
              this.$notification.error({
                message: '导入成功，但是有错误',
                description: (h) => ret.data?.stringList.map((x) => h('div', x))
              })
            }
          }
        })
      } else {
        this.$message.info('请选择要导入的文件')
      }
    },
    handleChangeImport(file) {
      if (file.file.status !== 'removed') {
        this.imp.fileList = [file.file]
      } else {
        this.imp.fileList = []
      }
    },
    handleChangeStatus(value, index) {
      index = index + this.pageSize * this.current
      this.imp.list[index].status = value
      this.$forceUpdate()
    },
    handleChangeDate(value, index, col) {
      index = index + this.pageSize * this.current
      const { key } = col
      this.imp.list[index][key] = value
      this.$forceUpdate()
    },
    handleChange(e, index, col) {
      index = index + this.pageSize * this.current
      const { key, type, max, min } = col
      this.imp.list[index][key] = e?.target?.value
      let newVal = e?.target?.value
      if (type === 'int') {
        if (newVal === '' || isNaN(Number(e?.target?.value))) newVal = ''
        else if (Math.floor(e?.target?.value) > max) newVal = max
        else if (Math.floor(e?.target?.value) < min) newVal = min
        else if (newVal === '-') newVal = '-'
        else newVal = newVal.replace(/[^\d]/g, '')
      } else if (type === 'float' || type === 'price') {
        newVal = newVal
          .replace(/[^\d.]/g, '')
          .replace(/\.{4,}/g, '.')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
        if (type === 'float') newVal = newVal.replace(/^(-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3')
        else if (type === 'price') newVal = newVal.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        newVal = newVal.replace(/^\./g, '')
      }
      this.imp.list[index][key] = newVal
      if (key === 'contractMaterialNum' || key === 'priceWithTax' || key === 'taxRate') {
        this.imp.list[index].taxAmount = (
          Number(this.imp.list[index].contractMaterialNum) * Number(this.imp.list[index].priceWithTax)
        ).toFixed(2)
        console.log(`${this.imp.list[index].priceWithTax}/(1+${this.imp.list[index].taxRate}/100)`)
        this.imp.list[index].priceWith = (
          Number(this.imp.list[index].priceWithTax) /
          (1 + Number(this.imp.list[index].taxRate) / 100)
        ).toFixed(2)
        this.imp.list[index].taxAmountWithout = (
          Number(this.imp.list[index].contractMaterialNum) * Number(this.imp.list[index].priceWith)
        ).toFixed(2)

        this.priceCount()
      }
      this.$forceUpdate()
    },
    priceCount() {
      let lowerContractTotal = 0
      for (let i = 0; i < this.imp.list.length; i++) {
        lowerContractTotal += Number(this.imp.list[i].taxAmount)
      }
      this.imp.lowerContractTotal = lowerContractTotal.toFixed(2)
      this.imp.upperContractTotal = convertCurrency(this.imp.lowerContractTotal)
    },
    handleDelRow(index) {
      index = index + this.pageSize * this.current
      this.index = index
      this.visibleShowDelete = true
    },
    // 确认删除
    hideModalDelete() {
      this.visibleShowDelete = false
      this.imp.list.splice(this.index, 1)
      this.pageSize = 10
      this.current = 0
    },
    sum_price(priceWithTax, taxRate) {
      // 未税单价
      let num = 0
      if (priceWithTax && taxRate) {
        num = (Number(priceWithTax) / (1 + Number(taxRate) / 100)).toFixed(2)
      }
      return num
    },
    sum_total(contractMaterialNum, priceWith) {
      // 未税金额
      let num = 0
      if (contractMaterialNum && priceWith) {
        num = (Number(contractMaterialNum) * Number(priceWith)).toFixed(2)
      }
      return num
    },
    sumTotal(contractMaterialNum, priceWithTax) {
      // 含税金额
      let num = 0
      if (contractMaterialNum && priceWithTax) {
        num = (Number(contractMaterialNum) * Number(priceWithTax)).toFixed(2)
      }
      return num
    },
    totalNum(list) {
      let num = 0
      list.map((item) => {
        if (item.taxAmount) {
          num += Number(item.taxAmount)
        } else {
          if (item.contractMaterialNum && item.priceWithTax) {
            num += (Number(item.contractMaterialNum) * Number(item.priceWithTax)).toFixed(2) - 0
          }
        }
      })
      return num
    }
  }
}
</script>

<style lang="less" scoped>
.import {
  margin: 16px 0;
  .btns {
    margin-right: 8px;
  }
}
.file-box {
  display: flex;
  flex-direction: row;
  margin: 8px 0;
  .file-name {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #262626;
    text-align: right;
    line-height: 34px;
    width: 140px;
  }
  .file-text {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 34px;
    width: 530px;
    .item {
      line-height: 20px;
      margin-top: 7px;
    }
  }
  .file-list {
    width: 530px;
  }
}

.footer-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: PingFangSC-Regular;
  .l {
    font-size: 14px;
    color: #262626;
    line-height: 18px;
    margin-left: auto;
  }
  .r {
    font-size: 14px;
    color: #ee732e;
    line-height: 18px;
  }
}
.s-table {
  .xing {
    display: flex;
    align-items: center;
    &::before {
      content: '*';
      color: red;
      margin-right: 5px;
    }
  }
}
</style>
