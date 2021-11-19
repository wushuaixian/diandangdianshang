<template>
  <div>
    <a-card>
      <div class="right-log" v-if="tabsKey === '1'">
        <span class="right" @click=";[(visible = true), $refs.table.refresh(true)]">查看操作日志</span>
      </div>
      <a-tabs :default-active-key="tabsKey" @change="tabsCallback">
        <a-tab-pane key="1" tab="平台维度">
          <!-- 平台维度  start -->
          <a-form :form="allocationPlatform">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="是否收费">
              <a-radio-group
                :options="plainOptions"
                v-decorator="[
                  'chargeOrNot',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择是否收费'
                      }
                    ]
                  }
                ]"
                @change="onChangeOrNot"
              />
            </a-form-item>
            <a-form-item
              v-show="showInput"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="标书费金额"
            >
              <a-input-number
                v-decorator="[
                  'price',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入标书费金额'
                      },
                      {
                        pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                        message: '最多输入10位数字(支持两位小数)',
                        trigger: 'change'
                      }
                    ]
                  }
                ]"
                :step="0.01"
                :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
                :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
                :max="999999999"
                @change="changePrice($event)"
              />
              <span class="ant-form-item-children-span">元</span>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="{ span: 8, offset: 4 }">
              <a-button class="submit-btn" type="primary" @click="submitBtn"> 保存 </a-button>
            </a-form-item>
          </a-form>
          <!-- 平台维度  end -->
        </a-tab-pane>
        <a-tab-pane key="2" tab="采购商维度">
          <a-form :form="purchasersForm" layout="inline">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" label="采购商名称">
                  <a-input v-model="purchasersForm.purchasersName" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" label="采购商编码">
                  <a-input v-model="purchasersForm.purchasersCode" />
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="创建时间"
                >
                  <a-date-picker
                    v-model="purchasersForm.purchasersCreateTime"
                    :disabled-date="disabledStartDate"
                    show-time
                    format="YYYY-MM-DD"
                    placeholder=""
                    @openChange="handleStartOpenChange"
                  />
                  <span class="picker-span">至</span>
                  <a-date-picker
                    v-model="purchasersForm.purchasersEndTime"
                    :disabled-date="disabledEndDate"
                    show-time
                    format="YYYY-MM-DD"
                    placeholder=""
                    @openChange="handleEndOpenChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-form-item class="search-btn">
                <a-button type="primary" @click="searchList"> 查询 </a-button>
                <a-button @click="resetPurchasersForm"> 重置 </a-button>
              </a-form-item>
            </a-row>
          </a-form>
          <div>
            <a-button class="set-btn" type="primary" @click="goSetAllocationOfTender"> 添加设置 </a-button>
            <s-table
              name="purchasersTable"
              ref="purchasersTable"
              :columns="purchasersColumns"
              :data="purchasersList"
              rowKey="id"
              :pagination="true"
            >
              <template slot="createTime" slot-scope="scope">
                <div>{{ scope | moment('YYYY-MM-DD HH:mm:ss') }}</div>
              </template>
              <template slot="operation" slot-scope="text, record, i">
                <span class="btn-class" @click="editOperation(text, record, i)">编辑</span>
                <span class="btn-class" @click="deleteOperation(text, record, i)">删除</span>
              </template>
            </s-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 日志弹窗 -->
    <a-modal title="查看操作日志" :width="850" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <s-table
        name="logsTable"
        ref="table"
        :columns="columns"
        :data="getList"
        rowKey="id"
        :scroll="{ x: 850 }"
        :pagination="true"
        :isCanFilter="false"
      >
        <template slot="tenderStatus" slot-scope="scope">
          <div>{{ plainOptionsJson[scope] }}</div>
        </template>
        <template slot="createTime" slot-scope="scope">
          <div>{{ scope | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
      </s-table>
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'
import {
  findUnifyTenderPO,
  SaveUnifyTenderPO,
  selectUnifyTenderLogPO,
  selectAll,
  deleteByIds
} from '@/api/configgurationCenter'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}
const plainOptions = [
  { label: '是', value: '0' },
  { label: '否', value: '1' }
]
const plainOptionsJson = {
  0: '开启',
  1: '关闭'
}
export default {
  name: 'AllocationOfTenderSetIndex',
  data() {
    return {
      visible: false,
      formItemLayout,
      plainOptionsJson,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center'
        },
        {
          title: '是否收费',
          dataIndex: 'tenderStatus',
          key: 'tenderStatus',
          scopedSlots: { customRender: 'tenderStatus' },
          align: 'center'
        },
        {
          title: '标书费金额(元)',
          dataIndex: 'tenderAmount',
          key: 'tenderAmount',
          align: 'center'
        },
        {
          title: '操作人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          align: 'center'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        }
      ],
      // allocationPlatform: {
      //   chargeOrNot: 0, // 是否收费
      //   price: null // 标书费
      // },
      allocationPlatform: this.$form.createForm(this, { name: 'allocationOfTenderSetIndex', price: null }),
      purchasersForm: {
        purchasersName: null,
        purchasersCode: null,
        purchasersCreateTime: undefined,
        purchasersEndTime: undefined
      },
      tabsKey: this.$route?.query?.tabsKey || '1',
      endOpen: '',
      id: null,
      showInput: false,
      purchasersColumns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName',
          align: 'center'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode',
          align: 'center'
        },
        {
          title: '标书费金额(元)',
          dataIndex: 'tenderAmount',
          key: 'tenderAmount',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 110,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      plainOptions
    }
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { data } = await findUnifyTenderPO()
      this.id = data.id
      if (data.tenderStatus === '0') {
        this.showInput = true
      } else {
        this.showInput = false
      }
      this.allocationPlatform.setFieldsValue({ chargeOrNot: data.tenderStatus, price: data.tenderAmount })
    },
    async getList(params) {
      const result = await selectUnifyTenderLogPO({
        ...params
      })
      // const res = {
      //   data: {
      //     listObj: result.data.data
      //   }
      // }
      result.data.listObj = result.data?.data
      result.data.total = result.data?.total
      result.data.listObj.map((item, index) => {
        this.$set(item, 'index', index + 1)
      })
      return result
    },
    async purchasersList(params) {
      const paramsInfo = {
        ...params
      }
      if (this.purchasersForm.purchasersCreateTime) {
        paramsInfo.createTime = moment(this.purchasersForm.purchasersCreateTime).format('YYYY-MM-DD')
      }
      if (this.purchasersForm.purchasersEndTime) {
        paramsInfo.endTime = moment(this.purchasersForm?.purchasersEndTime).format('YYYY-MM-DD')
      }
      if (this.purchasersForm.purchasersName) {
        paramsInfo.enterpriseName = this.purchasersForm?.purchasersName
      }
      if (this.purchasersForm.purchasersCode) {
        paramsInfo.orgCode = this.purchasersForm?.purchasersCode
      }
      console.log(paramsInfo, this.purchasersForm.purchasersCode)
      const result = await selectAll(paramsInfo)
      const res = {
        data: {
          listObj: result.data,
          total: result.total
        }
      }
      return res
    },

    // 关闭弹窗
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.visible = false
    },
    // tabs切换
    tabsCallback(key) {
      this.tabsKey = key
    },
    // change是否收费
    onChangeOrNot(e) {
      if (e.target.value === '0') {
        this.showInput = true
      } else {
        this.showInput = false
      }
      this.allocationPlatform.chargeOrNot = e.target.value
    },
    async submitBtn() {
      this.allocationPlatform.validateFields(async (err, value) => {
        if (!err) {
          const result = await SaveUnifyTenderPO({
            id: this.id,
            tenderAmount: value.price,
            tenderStatus: value.chargeOrNot
          })
          if (result.code === '0') {
            this.$message.success(result.message)
          }
        }
      })
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    disabledStartDate(startValue) {
      const endValue = this.purchasersForm.purchasersEndTime
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.purchasersForm.purchasersCreateTime
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    searchList() {
      this.$refs.purchasersTable.refresh(true)
    },
    resetPurchasersForm() {
      this.purchasersForm = {
        purchasersName: null,
        purchasersCode: null,
        purchasersCreateTime: null,
        purchasersEndTime: null
      }
    },
    goSetAllocationOfTender() {
      this.$router.push({
        name: 'SetAllocationOfTender'
      })
    },
    changePrice(e) {
      if (!e) return
      this.allocationPlatform.setFieldsValue({ price: e })
    },
    async deleteOperation(call, params, i) {
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {
          const result = await deleteByIds({ id: params.id })
          if (result.code === '0') {
            this.$message.success(result.message || '删除成功')
            this.$refs.purchasersTable.refresh(true)
          }
        },
        onCancel() {}
      })
    },
    editOperation(call, params, i) {
      this.$router.push({
        name: 'UpdataAllocationOfTender',
        params: {
          id: params.id,
          price: params.tenderAmount
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.right-log:hover {
  color: #ff6b00;
}
.right-log {
  text-align: right;
  cursor: pointer;
}
/deep/ .ant-form-item-children {
  white-space: nowrap;
  .ant-form-item-children-span {
    margin-left: 5px;
  }
}
.picker-span {
  margin: 0px 20px;
}
.search-btn {
  display: block;
  text-align: center;
  margin-top: 30px;
  .ant-btn {
    margin: 0px 10px;
  }
}
.set-btn {
  margin: 20px 0px;
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
.btn-class {
  color: #888;
  cursor: pointer;
  margin-right: 10px;
  color: #ff6b00;
}
/deep/ .ant-modal-body {
  max-height: 600px;
  overflow: scroll;
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
</style>
