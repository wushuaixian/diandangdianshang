<template>
  <div class="pendingApproval">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <a-select
                  v-model="query.buyerMerchantIds"
                  class="selectClass"
                  mode="multiple"
                  placeholder="请选择公司名称"
                  optionFilterProp="children"
                >
                  <a-select-option
                    v-for="(value, index) in companyName.buyerMerchantList"
                    :key="index"
                    :value="Number(value.id)"
                  >
                    {{ value.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号">
                <a-input v-model="query.code" placeholder="请输入合同编号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同名称">
                <a-input v-model="query.name" placeholder="请输入合同名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商" style="margin-left: 15px">
                <a-select
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
                      query.providerMerchantIds = [Number(v)]
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
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同类型">
                <a-select
                  v-model="typeValue"
                  default-value="全部"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :options="contractType"
                  placeholder="请选择"
                  @change="getType"
                  :key="dataKey"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 15px" label="创建人">
                <a-input v-model="query.createUsername" placeholder="请输入创建人" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48"> </a-row>
          <a-row :gutter="48">
            <a-col :md="8">
              <a-form-model-item label="合同金额">
                <div>
                  <a-input
                    v-model="query.amountStart"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    style="width: calc(50% - 6px)"
                    placeholder="合同金额"
                  />-
                  <a-input
                    v-model="query.amountEnd"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    style="width: calc(50% - 6px)"
                    placeholder="合同金额"
                  />
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="生效日期">
                <a-range-picker @change="getData" :key="dataKey" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="截止日期">
                <a-range-picker @change="entData" :key="dataKey" />
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24"> </a-col>
            <a-col :md="24" :sm="24" class="ac">
              <a-button style="margin-right: 15px" @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <div class="bottom">
      <div>
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane :key="-1" :tab="`全部(${statusNumber.statusTotal})`"></a-tab-pane>
          <a-tab-pane :key="0" :tab="`草稿(${statusNumber[0]})`"></a-tab-pane>
          <a-tab-pane :key="1" :tab="`供应商确认中(${statusNumber[1]})`"></a-tab-pane>
          <a-tab-pane :key="2" :tab="`供应商同意(${statusNumber[2]})`"></a-tab-pane>
          <a-tab-pane :key="3" :tab="`供应商驳回(${statusNumber[3]})`"></a-tab-pane>
          <a-tab-pane :key="4" :tab="`审批中(${statusNumber[4]})`"></a-tab-pane>
          <a-tab-pane :key="5" :tab="`审批驳回(${statusNumber[5]})`"></a-tab-pane>
          <a-tab-pane :key="6" :tab="`已生效(${statusNumber[6]})`"></a-tab-pane>
          <a-tab-pane :key="7" :tab="`已失效(${statusNumber[7]})`"></a-tab-pane>
        </a-tabs>
      </div>
      <div class="contractType">
        <a-button class="ml10 mb10" type="primary" @click="daaContract">新增合同</a-button>
        <a-button
          class="ml10 mb10"
          type="primary"
          :disabled="contractIds.length === 0"
          :loading="creatOrderLoading"
          @click="createdOrder"
        >
          合同下单
        </a-button>

        <a-button class="ml10" @click="exportFile">导出</a-button>
        <a-button class="ml10" @click="viewTasksVisible = true">查看任务</a-button>

        <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
        <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="contractDataExport" />
        <!-- <ExportFile class="ml10" :params="exportParams" /> -->
      </div>
      <s-table
        v-if="bolledata"
        name="contractListTables"
        :row-selection="rowSelection"
        rowKey="id"
        ref="table"
        :scroll="{ x: 5200 }"
        :columns="columns"
        :data="init"
      >
        <template slot="amount" slot-scope="text, row">
          <span v-if="row.contractType !== '长协合同'">{{ row.amount }}</span>
        </template>
        <template slot="code" slot-scope="text">
          <a type="link" :title="text.code" @click="gotoDetails(text)">{{ text.code }}</a>
        </template>
        <template slot="effectiveTime" slot-scope="text">
          <span>{{ text | moment('yyyy-MM-DD') }}</span>
        </template>
        <template slot="expireTime" slot-scope="text">
          <span>{{ text | moment('yyyy-MM-DD') }}</span>
        </template>
        <template slot="ext9Info" slot-scope="text">
          <span>{{ text | moment('yyyy-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="ext3Info" slot-scope="text">
          <span>{{ text | moment('yyyy-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="ext5Info" slot-scope="text">
          <span>{{ text | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="invalidTime" slot-scope="text">
          <span>{{ text | moment }}</span>
        </template>
        <template slot="paymentType" slot-scope="text">
          <span v-show="text === '1'">电汇</span>
          <span v-show="text === '2'">承兑</span>
          <span v-show="text === '3'">两者皆可</span>
        </template>
        <template slot="frameBuyer" slot-scope="text">
          <span v-show="text.frameBuyer == 0">否</span>
          <span v-show="text.frameBuyer == 1">是</span>
        </template>
        <template slot="versionNo" slot-scope="text">
          <span v-show="text == 0">否</span>
          <span v-show="text == 1">是</span>
        </template>
        <template slot="upload" slot-scope="text">
          <span class="approvalButton" @click="ShowUpload(text)">{{
            text.stampPoList && text.stampPoList.length > 0 ? '查看' : '上传'
          }}</span>
        </template>
        <!-- <template slot="conteactUrl" slot-scope="text, row">
          <span v-show="row.type === 1 && row.url" class="approvalButton" @click="download(row)">下载</span>
        </template> -->
        <template slot="dismissUrl" slot-scope="text, row">
          <span v-show="row.type === 2 && row.url" class="approvalButton" @click="download(row)">下载</span>
        </template>
        <template slot="options" slot-scope="text">
          <span v-show="text.status == '草稿' || text.status == '供应商已驳回'">
            <span class="approvalButton mr20" @click="gotoUpdate(text)">编辑</span>
            <span class="approvalButton mr20" @click="showChangeSupplier(text)"> 转供应商</span>
            <span class="approvalButton mr20" @click="showDelete(text)">删除</span>
          </span>
          <span v-show="text.status == '供应商已同意'">
            <span class="approvalButton mr20" @click="showApprove(text)">提交审批</span>
          </span>
          <span v-show="text.status == '供应商确认中' || text.status == '供应商已同意'">
            <span class="approvalButton mr20" @click="showRetract(text)">撤回</span>
          </span>

          <span v-show="text.status == '采购方审批驳回'">
            <span class="approvalButton mr20" @click="gotoUpdate(text)">编辑</span>
            <span class="approvalButton mr20" @click="showChangeSupplier(text)">转供应商</span>
            <span class="approvalButton mr20" @click="showCancel(text)">作废</span>
          </span>
          <span v-show="text.status == '已生效'">
            <span class="approvalButton mr20" @click="showStop(text)">终止</span>
            <span><a @click="gotoUpdateContract(text)">变更合同</a></span>
          </span>
        </template>
      </s-table>
    </div>
    <a-modal v-model="visibleShow" title="转供应商" ok-text="确定" cancel-text="取消" @ok="hideModal">
      <p class="ac">确认将当前数据转供应商？</p>
    </a-modal>
    <a-modal v-model="visibleShowRetract" title="撤回" ok-text="确定" cancel-text="取消" @ok="hideModalRetract">
      <p class="ac">确认将当前数据撤回？</p>
    </a-modal>
    <a-modal v-model="visibleShowDelete" title="删除" ok-text="确定" cancel-text="取消" @ok="hideModalDelete">
      <p class="ac">确认将当前数据删除？</p>
    </a-modal>
    <a-modal v-model="visibleShowApprove" title="提交审批" ok-text="确定" cancel-text="取消" @ok="hideModalApprove">
      <p class="ac">确认将当前数据提交审批？</p>
    </a-modal>
    <a-modal
      :destroyOnClose="true"
      v-model="visibleShowCancel"
      title="提示"
      ok-text="确定"
      cancel-text="取消"
      @ok="hideModalCancel"
    >
      <div class="m_auto">
        <p>确认作废当前合同？</p>
        <div class="df">
          <div>作废原因:</div>
          <a-textarea
            class="w200 ml10"
            v-model="cancelvalue"
            placeholder="请输入作废原因(必填)"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </div>
      </div>
    </a-modal>
    <a-modal
      :destroyOnClose="true"
      v-model="visibleShowUpload"
      title="双章合同"
      ok-text="确定"
      cancel-text="取消"
      @ok="hideModalUpload"
    >
      <div class="ml20">
        <div class="df">
          <div class="h20">合同：</div>
          <s-upload
            class="over_hidden"
            action="/api/back-manage-web/myContract/uploadContractAccessory"
            list-type="picture"
            :multiple="true"
            name="file"
            v-model="contractStampPOList"
          >
            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
          </s-upload>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-if="visibleShowStop"
      v-model="visibleShowStop"
      title="终止合同"
      ok-text="确定"
      cancel-text="取消"
      @ok="hideModalStop"
    >
      <div class="m_auto">
        <div>确认终止当前所选合同数据？</div>
        <div class="h20"></div>
        <div class="df">
          <span>备注：</span>
          <div class="w200">
            <a-textarea
              :maxLength="30"
              v-model="contractValue"
              placeholder="请输入备注xx(必填)"
              :auto-size="{ minRows: 2, maxRows: 4 }"
            />
            <div class="h20"></div>
            <label>
              <s-upload-file
                action="/api/back-manage-web/myContract/uploadContractAccessory"
                :file-data="{ id: this.UploadId }"
                class="bottom"
                name="file"
                @change="changeCompanyUrl"
              ></s-upload-file>
            </label>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  postContractList,
  postSkipSupplier,
  postRecalSupplier,
  postdeleteContractById,
  postCancelInvalid,
  postUpdateStatus,
  postTerminateContract,
  postStatusNumber,
  uploadContract,
  creatOrder,
  exportAsyncEvent,
  exportId
  // postUpdateContract
} from '@/api/contractList'
// import ExportFile from '@/components/exportFile/'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'

import { getComList, searchCom } from '@/api/contract'
import notification from 'ant-design-vue/es/notification'
import { formatDate } from '@/utils/util'
// import ppo from 'ppo'
let timeout

export default {
  components: {
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      jsonTxt: {},
      exportCode: 0,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      creatOrderLoading: false,
      contractIds: [],
      defaultIds: [],
      fetching: false,
      supList: [],
      // 公司名称value
      contractName: [],
      // 供应商value
      supplierValue: [],
      // 合同类型value
      typeValue: [],
      // 状态数量
      statusNumber: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, statusTotal: 0 },
      // 上传附加Id
      UploadId: '',
      UploadUrl: '',
      UploadName: '',
      // 谁点击就是谁的id
      soleId: '',
      // ==============================
      // 控制转供应商modal
      visibleShow: false,
      // 控制撤回modal
      visibleShowRetract: false,
      // 控制删除modal
      visibleShowDelete: false,
      // 控制作废合同modal
      visibleShowCancel: false,
      // 控制上传合同modal
      visibleShowUpload: false,
      // 控制终止合同modaal
      visibleShowStop: false,
      // 控制提交审批modal
      visibleShowApprove: false,
      // 控制变更合同modal
      visibleShowUpdateContract: false,
      // =================================
      // 终止合同原因
      contractValue: '',
      // 终止合同附件列表
      contractStampPOList: [],
      // 作废合同原因
      cancelvalue: '',
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      // 公司名称列表集合
      companyName: [],
      // 当前列表状态
      status: null,
      query: {
        code: null,
        name: null,
        providerMerchantName: null,
        amountStart: null,
        amountEnd: null,
        createUsername: null,
        effectiveTimeStart: null,
        effectiveTimeEnd: null,
        expireTimeStart: null,
        expireTimeEnd: null,
        contractType: null,
        buyerMerchantIds: [],
        providerMerchantIds: []
      },

      // 合同类型
      contractType: [
        {
          label: '全部',
          value: null
        },
        {
          label: '长协合同',
          value: 1
        },
        {
          label: '零采合同',
          value: 2
        }
      ],
      dataKey: 1,
      bolledata: false,
      columns: [
        {
          title: '序号',
          key: 'num',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: '公司名称',
          key: 'buyerMerchantName',
          dataIndex: 'buyerMerchantName',
          width: 200
        },
        {
          title: '合同编号',
          key: 'code',
          scopedSlots: { customRender: 'code' },
          width: 200
        },
        {
          title: '合同名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '合同类型',
          key: 'contractType',
          dataIndex: 'contractType'
        },
        {
          title: '是否框架',
          key: 'frameBuyer',
          scopedSlots: { customRender: 'frameBuyer' }
        },
        {
          title: '供应商',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName',
          width: 200
        },
        {
          title: '合同金额(元)',
          key: 'amount',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status'
        },
        {
          title: '生效日期',
          key: 'effectiveTime',
          dataIndex: 'effectiveTime',
          scopedSlots: { customRender: 'effectiveTime' },
          width: 120
        },
        {
          title: '截止日期',
          key: 'expireTime',
          dataIndex: 'expireTime',
          scopedSlots: { customRender: 'expireTime' },
          width: 120
        },
        {
          title: '支付方式',
          key: 'paymentType',
          dataIndex: 'paymentType',
          scopedSlots: { customRender: 'paymentType' }
        },
        {
          title: '付款方式',
          key: 'paymentMethod',
          dataIndex: 'paymentMethod'
        },
        {
          title: '合同发起方',
          key: 'sourceType',
          dataIndex: 'sourceType'
        },
        {
          title: '是否变更',
          key: 'versionNo',
          dataIndex: 'versionNo',
          scopedSlots: { customRender: 'versionNo' }
        },
        {
          title: '创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '平台合同编号',
          key: 'platCode',
          dataIndex: 'platCode',
          width: 220
        },
        {
          title: '作废人',
          key: 'invalidPersonName',
          dataIndex: 'invalidPersonName'
        },
        {
          title: '作废时间',
          key: 'invalidTime',
          dataIndex: 'invalidTime',
          scopedSlots: { customRender: 'invalidTime' },
          width: 200
        },
        {
          title: '作废原因',
          key: 'invalidReason',
          dataIndex: 'invalidReason'
        },
        {
          title: '终止人',
          key: 'ext7Info',
          dataIndex: 'ext7Info'
        },
        {
          title: '终止时间',
          key: 'ext9Info',
          dataIndex: 'ext9Info',
          scopedSlots: { customRender: 'ext9Info' },
          width: 200
        },
        {
          title: '终止原因',
          key: 'ext8Info',
          dataIndex: 'ext8Info'
        },
        {
          title: '采购方审批人',
          key: 'ext1Info',
          dataIndex: 'ext1Info'
        },
        {
          title: '采购方审批时间',
          key: 'ext3Info',
          dataIndex: 'ext3Info',
          scopedSlots: { customRender: 'ext3Info' },
          width: 200
        },
        {
          title: '采购方审批驳回原因',
          key: 'ext6Info',
          dataIndex: 'ext6Info',
          width: 200
        },
        {
          title: '供应商确认人',
          key: 'ext4Info',
          dataIndex: 'ext4Info'
        },
        {
          title: '供应商确认时间',
          key: 'ext5Info',
          dataIndex: 'ext5Info',
          scopedSlots: { customRender: 'ext5Info' },
          width: 200
        },
        {
          title: '供应商确认驳回原因',
          key: 'ext2Info',
          dataIndex: 'ext2Info',
          width: 200
        },
        // {
        //   title: '合同附件',
        //   key: 'url',
        //   scopedSlots: { customRender: 'conteactUrl' }
        // },
        // {
        //   title: '驳回附件',
        //   key: 'url',
        //   scopedSlots: { customRender: 'dismissUrl' }
        // },
        {
          title: '双章合同',
          key: 'upload',
          scopedSlots: { customRender: 'upload' }
        },
        {
          title: '操作',
          key: 'options',
          width: 210,
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'options' }
        }
      ]
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      return {
        // selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.contractIds = selectedRowKeys
        },
        selectedRowKeys: that.contractIds
      }
    }
  },
  created() {
    this.companyNameList()
  },
  mounted() {},
  methods: {
    // 导出
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportAsyncEvent({
        templateCode: 'contractListExport',
        jsonTxt,
        exportType: 'contractDataExport',
        fileName: '采购合同列表导出'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'contractDataExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    // 列表状态数量
    async typeCount() {
      const res = await postStatusNumber(this.query)
      if (res.code === '0') {
        this.statusNumber = res.data
      }
    },
    // 公司名称列表
    async companyNameList() {
      const res = await getComList()
      if (res.code === '0') {
        this.companyName = res.data
        // this.query.buyerMerchantIds = [Number(res.data.buyerMerchantList[0].id)]
        this.query.buyerMerchantIds = [res.data.buyerMerchantList[0].id]
        this.defaultIds = [String(res.data.buyerMerchantList[0].id)]
        this.bolledata = true
        this.typeCount()
      }
    },
    async init(params) {
      const data = {
        ...params,
        ...this.query,
        status: this.status
      }
      const contractList = await postContractList({ ...data })

      this.jsonTxt = { ...data }
      return contractList
    },
    createdOrder() {
      if (this.contractIds.length > 0) {
        this.creatOrderLoading = true
        creatOrder(this.contractIds).then((res) => {
          this.creatOrderLoading = false
          if (res.code === '0') {
            this.$message.success('下单成功')
            this.$router.push({
              name: 'orderManagementBuyerOrderList'
            })
          }
        })
      }
    },
    // 重置
    handleReset() {
      this.query = {
        code: null,
        name: null,
        providerMerchantName: null,
        amountStart: null,
        amountEnd: null,
        createUsername: null,
        effectiveTimeStart: null,
        effectiveTimeEnd: null,
        expireTimeStart: null,
        expireTimeEnd: null,
        contractType: null,
        buyerMerchantIds: [this.companyName.buyerMerchantList[0].id],
        providerMerchantIds: []
      }
      this.contractName = []
      this.supplierValue = []
      this.typeValue = []
      this.dataKey++
    },
    // 查询
    search() {
      this.contractIds = []
      this.$refs.table.refresh(true)
      this.typeCount()
      // this.$forceUpdate()
    },
    // 当前查询的状态
    callback(v) {
      this.status = v === -1 ? null : v
      this.search()
    },
    // 生效时间
    getData(val) {
      if (val.length === 0) {
        this.query.effectiveTimeStart = ''
        this.query.effectiveTimeEnd = ''
        return
      }
      this.query.effectiveTimeStart = formatDate(val[0])
      this.query.effectiveTimeEnd = formatDate(val[1])
    },
    // 失效时间
    entData(val) {
      if (val.length === 0) {
        this.query.expireTimeStart = ''
        this.query.expireTimeEnd = ''
        return
      }
      this.query.expireTimeStart = formatDate(val[0])
      this.query.expireTimeEnd = formatDate(val[1])
    },
    // 合同类型
    getType(v) {
      this.query.contractType = v
    },
    // 供应商
    ChangeSupplier(v) {
      this.query.providerMerchantIds = [Number(v)]
    },
    // 跳转新增合同
    daaContract() {
      this.$router.push({ name: 'CreatContractPurchaseAddcontract' })
    },
    gotoDetails(item) {
      this.$router.push({ name: 'ContractPurchaseAddcontract', query: { id: item.id, type: 'read' } })
    },
    // 跳转修改
    gotoUpdate(item) {
      this.$router.push({ name: 'ContractPurchaseAddcontract', query: { id: item.id } })
    },
    // 跳转变更合同
    gotoUpdateContract(item) {
      this.$router.push({ name: 'ContractPurchaseAddcontract', query: { id: item.id, copy: true } })
    },
    // 显示删除modal
    showDelete(e) {
      this.soleId = e.id
      this.visibleShowDelete = true
    },
    // 确认删除
    async hideModalDelete() {
      const res = await postdeleteContractById({ id: this.soleId })
      if (res.code === '0') {
        this.visibleShowDelete = false
        this.search()
      }
    },

    // 显示转供应商modal
    showChangeSupplier(e) {
      this.soleId = e.id
      this.visibleShow = true
    },
    // 确认转供应商
    async hideModal() {
      const res = await postSkipSupplier({ id: this.soleId })
      if (res.code === '0') {
        this.visibleShow = false
        this.search()
      }
    },
    // 显示撤回modal
    showRetract(e) {
      this.soleId = e.id
      this.visibleShowRetract = true
    },
    // 确认撤回
    async hideModalRetract() {
      const res = await postRecalSupplier({ id: this.soleId })
      if (res.code === '0') {
        this.visibleShowRetract = false
        this.search()
      }
    },
    // 显示合同作废modal
    showCancel(e) {
      this.soleId = e.id
      this.visibleShowCancel = true
    },
    // 确认作废
    async hideModalCancel() {
      const params = {
        id: this.soleId + '',
        invalidReason: this.cancelvalue
      }
      if (params.invalidReason.replace(/ /g, '') === '') {
        return notification.error({
          message: '提示',
          description: '作废合同，请输入作废原因！'
        })
      }
      const res = await postCancelInvalid(params)
      if (res.code === '0') {
        this.search()
        this.visibleShowCancel = false
        this.cancelvalue = ''
      }
    },
    // 监听终止合同返回的数据
    changeCompanyUrl(e) {
      const value = {
        name: e[0].name,
        url: e[0].url
      }
      this.contractStampPOList.push(value)
    },
    // 显示终止合同modaal
    showStop(e) {
      console.log(e.id)
      this.UploadId = e.id
      this.visibleShowStop = true
    },
    // 确认终止
    async hideModalStop() {
      const params = {
        id: this.UploadId,
        remark: this.contractValue,
        contractStampPOList: this.contractStampPOList
      }
      console.log(params.remark)
      if (params.remark.replace(/ /g, '') === '') {
        return notification.error({
          message: '提示',
          description: '终止合同，请输入终止原因！'
        })
      }
      const res = await postTerminateContract(params)
      this.$message.success(res.message)
      this.visibleShowStop = false
      if (res.code === '0') {
        this.search()
        this.contractValue = ''
      }
    },
    // 显示提交审批modal
    showApprove(e) {
      this.soleId = e.id
      this.visibleShowApprove = true
    },
    // 确认提交审批
    async hideModalApprove() {
      const params = {
        status: '4',
        id: this.soleId + ''
      }
      const res = await postUpdateStatus(params)
      if (res.code === '0') {
        this.search()
      }
      this.visibleShowApprove = false
    },
    // 显示上传合同modal
    ShowUpload(e) {
      this.contractStampPOList = e?.stampPoList?.filter((x) => x.type === 0) || []
      this.UploadId = e.id
      this.visibleShowUpload = true
    },
    // 监听上传附件返回的url
    // changeUploadContract(e) {
    //   const params = {
    //     url: e.url,
    //     name: e.name,
    //     id: ppo.uuid()
    //   }
    //   this.contractStampPOList.push(params)
    // },
    // 确认上传
    async hideModalUpload() {
      const { contractStampPOList } = this
      const stampPOList = contractStampPOList.map((x) => {
        const url = x?.url || x?.response?.data?.url || x?.response?.data[0]?.url
        const name = x?.name || x?.response?.data?.name || x?.response?.data[0]?.name
        return {
          url,
          name
        }
      })
      const updateParams = {
        contractId: this.UploadId,
        stampPOList
      }
      const res = await uploadContract(updateParams)
      if (res.code === '0') {
        this.$message.success('保存成功')
        this.visibleShowUpload = false
        this.contractStampPOList = []
        this.$refs.table.refresh()
      }
    },
    // 显示附件下载model
    async download(e) {
      const response = await fetch(e.url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = e.stampName
      a.click()
      a.remove()
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      timeout = setTimeout(() => {
        searchCom(value).then((ret) => {
          this.fetching = false
          this.supList = ret.data.providerMerchantList
        })
      }, 300)
    }
  }
}
</script>
<style lang="less" scoped>
.pendingApproval {
  width: 100%;
  .bottom {
    background: #ffffff;
    margin-top: 20px;
    padding: 24px;
  }
}

.approvalButton {
  cursor: pointer;
  color: #ff6b00;
}
.ml10 {
  margin-left: 10px;
}
.ml20 {
  margin-left: 20px;
}
.mr20 {
  margin-right: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.df {
  display: flex;
}
.Upload {
  width: 100%;
  height: 100%;
}
.w200 {
  width: 200px;
}
.h20 {
  height: 20px;
  line-height: 30px;
}
.ac {
  text-align: center;
}
.m_auto {
  transform: translate(100px, 0px);
  width: 100%;
  height: 100%;
}
.over_hidden {
  width: 320px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.selectClass {
  height: 32px;
  overflow-y: scroll;
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>
