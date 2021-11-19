<template>
  <div class="mid">
    <a-card type="inner" :bordered="false">
      <div class="contest">
        <div>
          <a-tabs @change="handleTabsChange">
            <a-tab-pane id="tag" v-for="(item, index) in tagData" :key="index" :tab="item.tagName">
              <div class="header">
                <a-form-model layout="inline">
                  <a-row :gutter="48">
                    <a-col :md="8">
                      <a-form-model-item label="公司名称" :labelCol="{ lg: { span: 8 } }">
                        <!-- <a-select class="Longer" v-model="list.buyerMerchantIds" placeholder="请选择" default-value="">
                              <a-select-option value="1111">1111</a-select-option>
                              <a-select-option value="2222">2222</a-select-option>
                            </a-select> -->
                        <a-select mode="multiple" class="mult" placeholder="全部" @change="handleChange">
                          <a-select-option v-for="(item, index) in getMerchant" :key="index">
                            {{ item.merchantName }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="申请组织" :labelCol="{ lg: { span: 8 } }">
                        <a-input v-model="list.applyDepartment" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="采购计划编号" :labelCol="{ lg: { span: 8 } }">
                        <a-input v-model="list.buyerPlanCode" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="物料编码" :labelCol="{ lg: { span: 8 } }">
                        <a-input v-model="list.materialCode" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="物料名称" :labelCol="{ lg: { span: 8 } }">
                        <a-input v-model="list.materialName" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="规格型号" :labelCol="{ lg: { span: 8 } }">
                        <a-input v-model="list.materialModel" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="申报人" :labelCol="{ lg: { span: 8 } }">
                        <a-input v-model="list.declarant" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="是否紧急" :labelCol="{ lg: { span: 8 } }">
                        <a-select class="Longer" v-model="list.isInstancy" placeholder="请选择" default-value="">
                          <a-select-option value="0">否</a-select-option>
                          <a-select-option value="1">是</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="创建时间" :labelCol="{ lg: { span: 8 } }">
                        <a-range-picker @change="onChange" />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-col class="middle" :md="80">
                    <span class="table-page-search-submitButtons">
                      <a-button class="marReset" @click="Reset">重置</a-button>
                      <a-button type="primary" class="margin-search" @click="search">查询</a-button>
                    </span>
                  </a-col>
                </a-form-model>
              </div>
              <a-tabs @change="callback" v-if="item.tagId == 1">
                <a-tab-pane id="tag" v-for="(it, inkey) in item.children" :key="inkey" :tab="it.childrenName">
                  <!-- button按钮分割选----待执行 -->
                  <div v-if="inkey == 0">
                    <p>
                      <a-button type="primary" @click="association">一键匹配长协</a-button>
                      <!-- 智能匹配弹框 -->
                      <a-modal
                        v-model="modalvisible"
                        title="智能匹配"
                        ok-text="确认"
                        cancel-text="取消"
                        @ok="hideModal"
                      >
                        <p>正在智能匹配长协,请稍后.....</p>
                        <a-progress type="circle" :percent="75" />
                      </a-modal>
                      <a-button style="marginLeft" @click="$router.push('/authention-message/matching contracts')"
                      >手动匹配合同</a-button
                      >
                      <a-button style="marginLeft" @click="$router.push('/authention-message/foundSearch')"
                      >创建寻源</a-button
                      >
                      <a-button class="marginLeft">匹配商城商品</a-button>
                      <a-button class="marginLeft" @click="returnModal">退回分配人</a-button>
                      <a-button class="marginLeft" @click="Others">转给他人</a-button>
                      <a-button class="marginLeft">创建合同</a-button>
                      <a-modal
                        class="modal-height"
                        v-model="returnvisible"
                        title="提示"
                        ok-text="确认"
                        cancel-text="取消"
                        @ok="returncosehideModal"
                      >
                        <p>确定将当前勾选的采购计划退回分配人?</p>
                      </a-modal>
                    </p>
                    <!-- 测试table表格 -->
                    <s-table
                      name="carryval1"
                      ref="table"
                      rowKey="id"
                      :columns="columns"
                      :data="init"
                      :scroll="{ x: 3200, y: 300 }"
                      :row-selection="rowSelection"
                    >
                      <a slot="translate" slot-scope="" @click="actionClose">关闭</a>
                    </s-table>
                  </div>
                  <!-- button按钮分割选----长协代下单 -->
                  <div v-else-if="inkey == 1">
                    <p>
                      <a-button type="primary" @click="pending">移至待执行</a-button>
                      <!-- <a-button style="marginLeft">创建订单</a-button>
                      <a-button style="marginLeft">导出</a-button> -->
                    </p>
                    <s-table
                      name="carryval2"
                      ref="table"
                      rowKey="id"
                      :columns="columns"
                      :data="init"
                      :scroll="{ x: 3200, y: 300 }"
                      :row-selection="rowSelection"
                    >
                      <a slot="translate" slot-scope="" @click="actionClose">关闭</a>
                    </s-table>
                  </div>
                  <!-- button按钮分割选----零采待下单 -->
                  <div v-else-if="inkey == 2">
                    <p>
                      <a-button type="primary" @click="pending">移至待执行</a-button>
                      <!-- <a-button style="marginLeft">创建订单</a-button>
                      <a-button style="marginLeft">导出</a-button> -->
                    </p>
                    <s-table
                      name="carryval3"
                      ref="table"
                      rowKey="id"
                      :columns="columns"
                      :data="init"
                      :scroll="{ x: 3200, y: 300 }"
                      :row-selection="rowSelection"
                    >
                      <a slot="translate" slot-scope="" @click="actionClose">关闭</a>
                    </s-table>
                  </div>
                  <!-- button按钮分割选----商城待下单 -->
                  <div v-else-if="inkey == 3">
                    <p>
                      <a-button type="primary" @click="pending">移至待执行</a-button>
                      <a-button style="marginLeft">创建订单</a-button>
                      <a-button style="marginLeft">创建合同</a-button>
                      <a-button style="marginLeft">导出</a-button>
                    </p>
                    <s-table
                      name="carryval4"
                      ref="table"
                      rowKey="id"
                      :columns="columns"
                      :data="init"
                      :scroll="{ x: 3200, y: 300 }"
                      :row-selection="rowSelection"
                    >
                      <a slot="translate" slot-scope="" @click="actionClose">关闭</a>
                    </s-table>
                  </div>
                </a-tab-pane>
              </a-tabs>
              <div id="export" v-else-if="item.tagId != 1">
                <a-button>导出</a-button>
              </div>
              <s-table
                name="carryval5"
                v-if="item.tagId != 1"
                ref="table"
                rowKey="id"
                :data="init"
                :columns="columns"
                :scroll="{ x: 1500, y: 300 }"
                :row-selection="rowSelection"
              >
                <a slot="enterpriseName" slot-scope="enterpriseName, record" @click="viewEnterprise(record)">{{
                  enterpriseName
                }}</a>
              </s-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-card>
    <!-- 点击关闭弹出框 -->
    <a-modal v-model="colsevisible" title="提示" ok-text="确认" cancel-text="取消" @ok="cosehideModal">
      <p class="amodal">确认关闭当前所选计划?</p>
      <p class="modal">
        <span class="gb-modal">关闭原因:</span>
        <a-textarea placeholder="Basic usage" :rows="4" :cols="30" />
      </p>
    </a-modal>
    <Popup :popupStatus="popupStatus" @close="closeExaminPopup" />
    <!-- @submitExamine="submitExamine" -->
  </div>
</template>

<script>
import {
  queryBuyerPlanProcessPage,
  mappingLongTermContract,
  moveToPending,
  buyerChange,
  transferToOthers,
  closePlan,
  getSupplierMerchant
  // 采购商id
  // queryplanMatchingContractPage
} from '@/api/projectCarry'
import Popup from '@/components/Popup/ExaminePopup.vue'
import { submitExamine } from '@/api/accessAudit'
const columns = [
  { title: '序号', width: 100, dataIndex: 'key', key: 'name', fixed: 'left' },
  { title: '公司名称', width: 100, dataIndex: 'name', key: 'age' },
  { title: '是否紧急', width: 100, dataIndex: 'address', key: '1' },
  { title: '采购员', width: 100, dataIndex: 'address', key: '2' },
  { title: '采购计划编号', width: 150, dataIndex: 'address', key: '3' },
  { title: '物料编码', width: 100, dataIndex: 'address', key: '4' },
  { title: '物料名称', width: 100, dataIndex: 'address', key: '5' },
  { title: '规格型号', width: 100, dataIndex: 'address', key: '6' },
  { title: '计划数量', width: 100, dataIndex: 'address', key: '7' },
  { title: '待执行数量', width: 150, dataIndex: 'address', key: '8' },
  { title: '单位', width: 100, dataIndex: 'address', key: '9' },
  { title: '历史单位', width: 100, dataIndex: 'address', key: '10' },
  { title: '申请组织', width: 100, dataIndex: 'address', key: '11' },
  { title: '使用部门', width: 100, dataIndex: 'address', key: '12' },
  { title: '备注', width: 100, dataIndex: 'address', key: '13' },
  { title: '申报人', width: 100, dataIndex: 'address', key: '14' },
  { title: '联系人', width: 100, dataIndex: 'address', key: '15' },
  { title: '联系电话', width: 100, dataIndex: 'address', key: '16' },
  { title: '原使用品牌', width: 150, dataIndex: 'address', key: '17' },
  { title: '用途', width: 100, dataIndex: 'address', key: '18' },
  { title: '审批时间', width: 100, dataIndex: 'address', key: '19' },
  { title: '附件', width: 100, dataIndex: 'address', key: '20' },
  { title: '计划项目编码', width: 150, dataIndex: 'address', key: '21' },
  { title: '计划项目名称', width: 150, dataIndex: 'address', key: '22' },
  { title: '供应商', width: 100, dataIndex: 'address', key: '23' },
  { title: '采购项目编号', width: 150, dataIndex: 'address', key: '24' },
  { title: '合同编号', width: 100, dataIndex: 'address', key: '25' },
  { title: '订单编号', width: 100, dataIndex: 'address', key: '26' },
  { title: '行号', width: 100, dataIndex: 'address', key: '27' },
  { title: '状态', width: 100, dataIndex: 'address', key: '28' },

  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    Popup,
    submitExamine
  },
  data() {
    this.columns = columns
    return {
      getMerchant: [],
      tagData: [
        {
          tagId: 1,
          tagName: '计划执行(10)',
          children: [
            { childrenId: 6, childrenName: '待执行' },
            { childrenId: 6, childrenName: '长协待下单(10)' },
            { childrenId: 6, childrenName: '零采待下单(10)' },
            { childrenId: 6, childrenName: '商城待下单(10)' }
          ]
        },
        { tagId: 2, tagName: '计划寻源(10)' },
        { tagId: 3, tagName: '计划已关闭(10)' }
      ],
      modalvisible: false,
      colsevisible: false, // 点击关闭弹出框
      returnvisible: false,
      visible: false,
      timedata: [],
      idList: [],
      popupStatus: false,
      data: {},
      // data,
      columns,
      selectedRowKeys: [],
      list: {
        buyerMerchantIds: [2106190000000510],
        applyDepartment: '',
        buyerPlanCode: '',
        materialCode: '',
        materialName: '',
        materialModel: '',
        declarant: '',
        isInstancy: '',
        beginReviewTime: '',
        endReviewTime: '',
        status: 1,
        closeStatus: 0
      },
      OthersList: [
        {
          id: 2106070000000072,
          contractType: 1
        },
        {
          id: 2106070000000073,
          contractType: 1
        }
      ],
      ContractList: {
        // 分页查询长协待下单(contractType:1)
        contractType: 1,
        currentPage: 1,
        itemsPerPage: 10
      },
      state: {
        selectedRowKeys: []
      },
      lists: [
        {
          id: 2106070000000072,
          contractType: 1
        },
        {
          id: 2106070000000073,
          contractType: 1
        }
      ],
      buyer: {
        buyerPlanItemId: [31, 32]
      }
    }
  },
  mounted() {
    this.getSupplierMerchant()
  },
  methods: {
    handleTabsChange(val) {
      console.log(val)
    },
    // 获取采购商id
    async getSupplierMerchant() {
      return getSupplierMerchant()
    },
    callback(key) {
      console.log(key)
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    actionClose(data) {
      console.log(data)
      this.colsevisible = true
    },
    // 点击关闭请求接口
    async cosehideModal() {
      this.colsevisible = false
      const data = {
        id: 35,
        applyCloseReason: '111'
      }
      return closePlan(data)
    },
    // 点击退回分配人接口
    async returnModal() {
      // this.returnvisible = true
      return buyerChange(this.buyer)
    },
    // 转给他人接口
    async Others() {
      const { OthersList } = this
      console.log(OthersList)
      const data = {
        buyerPlanItemPOList: [
          { id: 32, contractType: 1 },
          { id: 33, contractType: 1 }
        ],
        buyerUserId: 123456
      }
      return transferToOthers(data)
    },
    returncosehideModal() {
      this.returnvisible = false
    },
    // 一件匹配长协弹出modal框加进度条
    showModal() {
      this.modalvisible = true
    },
    hideModal() {
      this.modalvisible = false
    },
    confirm() {
      this.$confirm({
        title: 'Confirm',
        content: 'Bla bla ...',
        okText: '确认',
        cancelText: '取消'
      })
    },
    // 点击移至待执行接口
    async pending() {
      return moveToPending(this.lists)
    },
    // callback(v) {
    //   this.query.auditStatus = v
    //   this.$refs.table.refresh(true)
    // },
    // 跳转详情附带id
    viewEnterprise(record) {
      this.$router.push({
        name: 'SuppliersCertificationAuditDetail',
        query: {
          id: record.id
        }
      })
    },
    // 列表请求
    async init(params) {
      const { list } = this
      console.log(list)
      const data = {
        ...params,
        ...list
      }
      return queryBuyerPlanProcessPage({ ...data })
    },
    // 一键匹配长协
    async association() {
      this.$router.push({
        name: 'authention-message-Toperform'
      })
      return mappingLongTermContract()
    },
    // 打开单个审核弹框
    handleEdit(record) {
      this.popupStatus = true
      this.idList.push(record.id)
    },
    // 打开批量审核弹框
    batchhandleEdit(record) {
      this.popupStatus = true
    },
    // 关闭审核弹框
    closeExaminPopup() {
      this.popupStatus = false
    },
    // 审核确认接口
    // submitExamine(authStatus, auditReason) {
    //   if (authStatus === 1) {
    //     authStatus = '3'
    //   } else if (authStatus === 2) {
    //     authStatus = '4'
    //   }
    //   supplieraudits({ ids: this.idList, authStatus, auditReason }).then((res) => {
    //     this.idList = []
    //     this.popupStatus = false
    //     this.$refs.table.refresh(true)
    //     this.state.selectedRowKeys = []
    //   })
    // },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
    },
    // 获取查询时间
    onChange(dateString) {
      this.list.beginTime = dateString[0]
      this.list.endTime = dateString[1]
    },
    // 重置查询数据
    Reset() {
      this.timedata = []
      this.list = {
        enterpriseName: '',
        legalPersonName: '',
        authStatus: '',
        beginTime: '',
        endTime: ''
      }
    },
    handleChange(value) {
      console.log(value)
      value.forEach((item) => {
        this.list.buyerMerchantIds = [this.getMerchant[item].merchantId]
        console.log(this.list.buyerMerchantIds)
      })
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      const { selectedRowKeys } = that.state
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.state.selectedRowKeys = selectedRowKeys
          that.idList = selectedRowKeys
        },
        getCheckboxProps: (record) => {
          return {
            props: {
              disabled: record.authStatus !== '2'
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  .header {
    padding-top: 20px;
    width: 100%;
    height: auto;
    .distance {
      width: auto;
      float: left;
      .input {
        width: 200px;
      }
    }
    .middle {
      display: flex;
      justify-content: center;
      align-content: center;
    }
    .separate {
      margin-left: 10px;
    }
    .Longer {
      width: 174px;
    }
  }
  .contest {
    width: 100%;
    height: auto;
    .margin {
      width: auto;
      margin: 15px;
    }
    .green {
      width: 6px;
      height: 6px;
      background: #52c41a;
      display: inline-block;
      position: relative;
      top: -2px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .orange {
      background: #ff8720;
    }
    .red {
      background: red;
    }
  }
}
.ant-form-item {
  display: flex;
  margin-right: 0;
}
#export {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 10px;
}
.ant-progress-circle-wrap,
.ant-progress-line-wrap {
  margin-right: 8px;
  margin-bottom: 5px;
}
.margin-search {
  margin-left: 20px;
}
.marginLeft {
  margin-left: 10px;
}
.marReset {
  margin-left: 8px;
}
.mult {
  width: 174px;
}
.modal {
  display: flex;
}
.modal-height {
  height: 100px;
}
.gb-modal {
  width: 100px;
}
</style>
