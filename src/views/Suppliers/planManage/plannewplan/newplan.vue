<template>
  <div class="new-plan">
    <a-card type="inner" :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :rules="rules"
          :model="params"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 24 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24" style="margin-bottom: 10px">
              <a-form-model-item label="公司名称">
                <d-select class="max-width" v-model="params.buyerMerchantId" :options="merchantList"></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="申请组织" prop="applyDepartment">
                <a-input :maxLength="30" v-model="params.applyDepartment" placeholder="请输入申请组织" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="使用部门">
                <a-input :maxLength="30" v-model="params.useDepartment" placeholder="请输入申请部门" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="计划类型">
                <d-select v-model="params.planType" :options="planTypeList"></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="申报人" prop="declarant">
                <a-input :maxLength="10" v-model="params.declarant" placeholder="请输入申报人" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="联系电话" prop="contact">
                <a-input :maxLength="20" v-model="params.contact" placeholder="请输入联系电话" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="采购申请编号" prop="buyerPlanCode">
                <a-input v-model="params.buyerPlanCode" placeholder="请输入采购申请编号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="计划项目编码">
                <a-input :maxLength="30" v-model="params.planProjectCode" placeholder="请输入计划项目编码" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="计划项目名称">
                <a-input :maxLength="50" v-model="params.planProjectName" placeholder="请输入计划项目名称" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" style="margin-bottom: 10px">
              <a-form-model-item label="备注" prop="remark">
                <a-input :maxLength="200" v-model="params.remark" placeholder="请输入备注" />
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8">
              <a-form-model-item label="">
                <a-col :span="8" class="ant-form-item-label"></a-col>
                <a-checkbox v-model="params.defaultBuyerUser">默认创建人为采购员</a-checkbox>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div class="table-page-search-submitButtons">
            <a-button v-if="!showHide" type="primary" @click="nextStep">下一步</a-button>
            <a-button v-else type="primary" @click="Submit">提交</a-button>
            <!-- <a-button v-if="!showHide">取消</a-button> -->
            <a-button v-if="showHide" @click="cancel()">取消</a-button>
          </div>
        </a-form-model>
      </div>
      <div v-if="showHide" class="contest">
        <div class="buttons">
          <a-button type="primary" @click="handleMaterial">选择物料</a-button>
          <a-button type="primary" @click="handlePaginationChange(), (showImport = true)">模板导入</a-button>
        </div>
        <s-table
          ref="table"
          name="newPlanTable"
          :pagination="{
            onChange: handlePaginationChange
          }"
          rowKey="id"
          :data="init"
          :columns="columns"
          :scroll="{ x: 2000, y: 300 }"
        >
          <template slot="customPlanNum">
            <span class="customPlanNum">计划数量</span>
          </template>
          <template v-for="item in inputKeys" :slot="item.key" slot-scope="props">
            <d-slot-fileds
              :type="item.type"
              :key="item.key"
              v-model="props[item.key]"
              :options="item.options"
              :floatLength="item.floatLength"
            ></d-slot-fileds>
          </template>
          <template slot="materialSource" slot-scope="record">
            <span v-show="record.materialSource === 0">物料导入</span>
            <span v-show="record.materialSource === 1">模板导入</span>
          </template>
          <template slot="accessoryUrl" slot-scope="record">
            <!-- <a v-if="record.accessoryUrl != null" @click="downloadByURL(record.accessoryUrl, record.accessoryName)">
              下载附件materialSource
            </a> -->
            <a
              v-if="record.accessoryUrl != null && record.accessoryUrl != ''"
              @click="openNewPage(record.accessoryUrl)"
            >
              查看
            </a>
          </template>
          <template v-slot:action="record">
            <a
              class="marginleft"
              v-show="record.accessoryUrl != null && record.accessoryUrl != ''"
              @click="deletefile(record)"
            >
              删除附件
            </a>
            <a @click="handleDelete(record)">删除</a>
            <!-- <a class="marginleft" @click="deleteobj(record)">删除</a> -->
            <span v-if="record.accessoryUrl === null || record.accessoryUrl === ''" @click="handlePaginationChange()">
              <s-upload-file
                :accept="null"
                disabledAccept="text/plain"
                action="/api/back-manage-web/buyerPlanItem/uploadFile"
                :file-data="{ id: record.id }"
                name="Filedata"
                @changefile="filechange"
                :showUploadList="false"
                :multiple="true"
              >
                <a class="marginleft">上传附件</a>
              </s-upload-file>
            </span>
          </template>
        </s-table>
      </div>
      <Import
        :visible.sync="showImport"
        :id="$$(dataBuyerPlanPO, 'id')"
        :merchantId="$$(dataBuyerPlanPO, 'buyerMerchantId')"
        @ok="search"
      />
      <MaterialModal
        ref="mtModal"
        :visible.sync="showMaterial"
        :merchantId="$$(dataBuyerPlanPO, 'buyerMerchantId')"
        @ok="handleOk"
      />
    </a-card>
  </div>
</template>
<script>
import {
  submitReview,
  createBuyerPlanPO,
  getSupplierMerchant,
  findBuyerPlanVOById,
  deleteBuyerPlanItem,
  deleteFile,
  updatePlanItem
} from '@/api/supplier'
import _ from 'loadsh'
import Import from './Import'
import { planTypeList, instancyList, materialSourceText } from '@/config/constant'
import { MaterialModal } from '@/components/'
import { addPlanItemByMaterial } from '@/api/plan'
import Enum from '@/components/_util/enum'

export default {
  components: {
    Import,
    MaterialModal
  },
  data() {
    return {
      instancyList,
      inputKeys: [
        { key: 'planNum', type: Enum.NUMBER, floatLength: 4 },
        { key: 'formerlyPrice', type: Enum.NUMBER, floatLength: 2 },
        { key: 'formerlyBrand', type: Enum.TEXT },
        { key: 'purpose', type: Enum.TEXT },
        { key: 'remark', type: Enum.TEXT },
        { key: 'applyDepartment', type: Enum.TEXT },
        { key: 'useDepartment', type: Enum.TEXT },
        { key: 'declarant', type: Enum.TEXT },
        { key: 'contact', type: Enum.TEXT },
        { key: 'isInstancy', type: Enum.SELECT, options: instancyList?.filter((x) => x.value !== '') },
        { key: 'planItemCode', type: Enum.TEXT },
        { key: 'planProjectItemCode', type: Enum.TEXT },
        { key: 'planProjectItemName', type: Enum.TEXT }
      ],
      rules: {
        buyerPlanCode: [
          { required: true, message: '请输入采购计划编号', trigger: 'change' }
          // { max: 30, message: '最多允许输入30个字符', trigger: 'blur' }
        ],
        applyDepartment: [
          { required: true, message: '请输入申请组织', trigger: 'change' },
          { max: 30, message: '最多允许输入30个字符', trigger: 'blur' }
        ],
        useDepartment: [
          // { required: true, message: '请输入申请部门', trigger: 'change' },
          { max: 30, message: '最多允许输入30个字符', trigger: 'blur' }
        ],
        declarant: [
          { required: true, message: '请输入申报人', trigger: 'change' },
          { max: 10, message: '最多允许输入10个字符', trigger: 'blur' }
        ],
        planProjectCode: [
          // { required: true, message: '请输入计划项目编码', trigger: 'change' },
          { max: 30, message: '最多允许输入30个字符', trigger: 'blur' }
        ],
        planProjectName: [
          // { required: true, message: '请输入计划项目名称', trigger: 'change' },
          { max: 50, message: '最多允许输入50个字符', trigger: 'blur' }
        ],
        contact: [
          // { required: true, message: '请输入联系电话', trigger: 'change' },
          { max: 20, message: '最多允许输入20个字符', trigger: 'blur' }
        ]
        // remark: [{ max: 200, message: '最多允许输入200个字符', trigger: 'blur' }]
      },
      planTypeList,
      showMaterial: false,
      showImport: false,
      merchantList: [],
      showHide: false,
      columns: [
        {
          title: '物料编码',
          dataIndex: 'materialCode',
          key: 'materialCode',
          width: 200
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          key: 'materialName',
          width: 200
        },
        {
          title: '规格型号',
          dataIndex: 'materialModel',
          key: 'materialModel',
          width: 200
        },
        {
          title: '单位',
          dataIndex: 'mpMeasurementUnit',
          key: 'mpMeasurementUnit',
          width: 200
        },
        {
          headerTitle: '计划数量',
          slots: { title: 'customPlanNum' },
          key: 'planNum',
          width: 200,
          scopedSlots: { customRender: 'planNum' }
        },
        {
          title: '历史单价(元)',
          key: 'formerlyPrice',
          width: 200,
          scopedSlots: { customRender: 'formerlyPrice' }
        },
        {
          title: '原使用品牌',
          key: 'formerlyBrand',
          width: 200,
          scopedSlots: { customRender: 'formerlyBrand' }
        },
        {
          title: '用途',
          key: 'purpose',
          width: 200,
          scopedSlots: { customRender: 'purpose' }
        },
        {
          title: '备注',
          key: 'remark',
          width: 200,
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '申请组织',
          key: 'applyDepartment',
          width: 200,
          scopedSlots: { customRender: 'applyDepartment' }
        },
        {
          title: '使用部门',
          key: 'useDepartment',
          width: 200,
          scopedSlots: { customRender: 'useDepartment' }
        },
        {
          title: '申报人',
          key: 'declarant',
          width: 200,
          scopedSlots: { customRender: 'declarant' }
        },
        {
          title: '联系电话',
          key: 'contact',
          width: 200,
          scopedSlots: { customRender: 'contact' }
        },
        {
          title: '物料来源',
          key: 'materialSource',
          dataIndex: 'materialSource',
          width: 200,
          customRender: (text) => {
            return materialSourceText[text]
          }
        },
        {
          title: '是否紧急',
          key: 'isInstancy',
          width: 100,
          scopedSlots: { customRender: 'isInstancy' }
        },
        {
          title: '计划编号',
          key: 'planItemCode',
          width: 200,
          scopedSlots: { customRender: 'planItemCode' }
        },
        {
          title: '计划项目编码',
          key: 'planProjectItemCode',
          width: 200,
          scopedSlots: { customRender: 'planProjectItemCode' }
        },
        {
          title: '计划项目名称',
          key: 'planProjectItemName',
          width: 200,
          scopedSlots: { customRender: 'planProjectItemName' }
        },
        {
          title: '附件',
          width: 100,
          key: 'accessoryUrl',
          scopedSlots: { customRender: 'accessoryUrl' }
        },
        {
          title: '操作',
          // dataIndex: 'action',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      params: {
        buyerMerchantId: '',
        buyerMerchantName: '',
        buyerPlanCode: '',
        planType: '3',
        applyDepartment: '',
        useDepartment: '',
        declarant: '',
        contact: '',
        planProjectCode: '',
        planProjectName: '',
        // remark: '',
        defaultBuyerUser: false
      },
      dataBuyerPlanPO: {
        // id: 739,
        // buyerMerchantId: 2106200000000503
      }
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    this.Submit = _.debounce(this.Submit, 800)
  },
  methods: {
    async handleMaterial() {
      if (await this.handlePaginationChange()) {
        this.showMaterial = true
      }
    },
    async filechange(e) {
      if (e.code === '0') {
        this.$message.success('上传成功')
        await this.handlePaginationChange()
        this.$refs.table.refresh(true)
      }
    },
    async deletefile(e) {
      const data = await deleteFile({ id: e.id })
      if (data.code === '0') {
        await this.handlePaginationChange()
        this.$refs.table.refresh(true)
      }
    },
    async handleDelete({ id }) {
      await this.handlePaginationChange()
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {
          // await this.handlePaginationChange()
          const result = await deleteBuyerPlanItem({ id })
          if (result.code === '0') {
            this.$message.success(result.message || '删除成功')
            this.$refs.table.refresh(true)
          }
        },
        onCancel() {}
      })
    },
    async handlePaginationChange() {
      const buyerPlanItemPOList = this.$refs?.table.localDataSource
      if (buyerPlanItemPOList.length <= 0) return true
      const res = await updatePlanItem(buyerPlanItemPOList)

      if (res.code === '0') {
        return true
        //   this.$message.success('数据已为您自动保存')
      }
    },
    cancel() {
      this.$refs.form.resetFields()
      // this.params.buyerPlanCode = null
      this.params.planType = '3'
      this.params.defaultBuyerUser = false
      this.getList()
      this.showHide = false
    },
    // 获取采购商数据
    async getList() {
      const res = await getSupplierMerchant()
      if (res.code === '0') {
        const [item] = res?.data
        this.params.buyerMerchantName = item?.merchantName
        this.params.buyerMerchantId = item?.merchantId
        this.merchantList = res?.data.map((x) => {
          return {
            value: x.merchantId,
            label: x.merchantName
          }
        })
      }
    },
    // 下一步
    async nextStep() {
      const { params } = this
      await this.$refs.form.validate()
      const data = {
        ...params,
        defaultBuyerUser: Number(params?.defaultBuyerUser)
      }
      const res = await createBuyerPlanPO(data)
      if (res.code === '0') {
        this.dataBuyerPlanPO = res?.data
        this.showHide = true
      }
    },
    // 提交按钮
    async Submit() {
      if (this.$refs?.table.localDataSource?.length <= 0) {
        this.$message.warning('请导入数据')
        return
      }
      const { params } = this
      const data = {
        ...params,
        defaultBuyerUser: Number(params?.defaultBuyerUser)
      }
      const buyerPlanItemPOList = this.$refs?.table.localDataSource
      const res = await submitReview({ ...this.dataBuyerPlanPO, ...data, buyerPlanItemPOList })
      if (res.code === '0') {
        this.$router.push({
          name: 'MerchantsPurchaseManageIstribution'
        })
      }
    },
    async init(pagination) {
      const { params } = this
      const { id } = this.dataBuyerPlanPO
      const { currentPage } = pagination
      const { itemsPerPage } = pagination
      const data = {
        id,
        currentPage,
        itemsPerPage
      }

      const result = await findBuyerPlanVOById(data)
      const res = {
        data: {
          listObj: result?.data?.listObj?.map((i) => {
            return {
              ...params,
              ...i,
              planProjectItemName: i.planProjectItemName ? i.planProjectItemName : params.planProjectName,
              planProjectItemCode: i.planProjectItemCode ? i.planProjectItemCode : params.planProjectCode
            }
          }),
          total: result.data.total
        }
      }
      return res
    },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
    },
    async handleOk(materialVOS) {
      const {
        dataBuyerPlanPO: { id, buyerMerchantId }
      } = this
      const res = await addPlanItemByMaterial({ id, buyerMerchantId, materialVOS })
      if (res.code === '0') {
        this.search()
      }
      this.$refs.mtModal.$refs.form.resetFields()
    },
    openNewPage(url) {
      this.dowlod(url)
      window.open(url)
    },
    async dowlod(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = name
      a.click()
      a.remove()
    }
  }
}
</script>
<style lang="less" scoped>
.new-plan {
  .table-page-search-submitButtons {
    text-align: center;
    .ant-btn + .ant-btn {
      margin-left: 20px;
    }
  }
  .s-table {
    .customPlanNum {
      display: flex;
      align-items: center;
      &::before {
        content: '*';
        color: red;
        margin-right: 5px;
      }
    }
  }
  .buttons {
    margin-bottom: 20px;
    .ant-btn + .ant-btn {
      margin-left: 20px;
    }
  }
  .s-upload-file {
    float: left;
  }
  .marginleft {
    // width: 100px;
    // display: flex;
    // justify-content: center;
    // float: left;
    margin-right: 10px;
  }
}
.max-width {
  width: 100%;
  // min-width: 200px;
}
/deep/ .ant-form-item-control-wrapper {
  min-width: 0px;
}
/deep/ .ant-select-selection-selected-value {
  // width: 150px;
  // min-width: 100px;
  width: 100%;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
</style>
