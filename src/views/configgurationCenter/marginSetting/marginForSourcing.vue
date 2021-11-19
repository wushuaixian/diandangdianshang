<!--
 * @Author: your name
 * @Date: 2021-06-19 14:33:38
 * @LastEditTime: 2021-07-05 14:50:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/marginSetting/marginForSourcing.vue
-->
<template>
  <div>
    <a-card>
      <div class="right-log" v-if="tabsKey === '1'">
        <span class="right" @click="visible = true">查看操作日志</span>
      </div>
      <a-tabs :default-active-key="tabsKey" @change="tabsCallback">
        <a-tab-pane key="1" tab="平台维度">
          <!-- 平台维度  start -->
          <a-form :form="platform">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="采购商寻源保证金下限金额"
            >
              <a-input-number
                v-decorator="[
                  'purchaserLowerAmount',
                  {
                    rules: [
                      { required: true, message: '请输入采购商寻源保证金下限金额' },
                      {
                        pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                        message: '最多输入10位数字(支持两位小数)',
                        trigger: 'change'
                      }
                    ]
                  }
                ]"
                :step="0.01"
                :maxLength="10"
                :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
                :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
                placeholder="请输入采购商寻源保证金下限金额"
                @change="handlePurchaserLowerAmount"
              />
              元
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
                  <a-input v-model="purchasersForm.purchaserName" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" label="采购商编码">
                  <a-input v-model="purchasersForm.purchaserCode" />
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="创建时间"
                >
                  <a-date-picker
                    v-model="purchasersForm.createTimeStart"
                    :disabled-date="disabledStartDate"
                    show-time
                    format="YYYY-MM-DD"
                    placeholder=""
                    @openChange="handleStartOpenChange"
                  />
                  <span class="picker-span">至</span>
                  <a-date-picker
                    v-model="purchasersForm.createTimeEnd"
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
                <a-button @click="resetPurchasersForm"> 重置 </a-button>
                <a-button type="primary" @click="purchasersList({ isTrue: true })"> 查询 </a-button>
              </a-form-item>
            </a-row>
          </a-form>
          <div>
            <a-button class="set-btn" type="primary" @click="goSetAllocationOfTender"> 添加设置 </a-button>
            <s-table
              ref="purchasersTable"
              name="marginForSourcingTable"
              :columns="purchasersColumns"
              :data="purchasersList"
              rowKey="id"
              :scroll="{ x: 1500 }"
            >
              <template slot="createTimeDb" slot-scope="scope">
                <div>{{ scope | moment('YYYY-MM-DD HH:mm:ss') }}</div>
              </template>
              <template slot="operation" slot-scope="text, record, i">
                <a class="btn-class" @click="editOperation(text, record, i)">编辑</a>
                <a class="btn-class" @click="deleteOperation(text, record, i)">删除</a>
              </template>
            </s-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 日志弹窗 -->
    <a-modal title="查看操作日志" :width="850" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <s-table
        ref="table"
        name="marginForSourcing"
        :columns="columns"
        :data="getList"
        rowKey="id"
        :scroll="{ y: 300 }"
        :pagination="true"
        :isCanFilter="false"
      >
        <template slot="updateTime" slot-scope="scope">
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
  findPlatformSourceDeposit,
  savePlatformSourceDeposit,
  findPlatformSourceDepositLog,
  findBuyerSourceDeposit,
  deleteBuyerSourceDepositById
} from '@/api/configgurationCenter'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 }
}
const plainOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]
export default {
  name: 'MarginForSourcing',
  data() {
    return {
      visible: false,
      formItemLayout,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '采购商寻源保证金下限金额(元)',
          dataIndex: 'purchaserLowerAmount',
          key: 'purchaserLowerAmount',
          width: 250,
          align: 'center'
        },
        {
          title: '操作人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          width: 150,
          align: 'center'
        },
        {
          title: '操作时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          scopedSlots: { customRender: 'updateTime' },
          width: 200,
          align: 'center'
        }
      ],
      platform: this.$form.createForm(this, {
        ...{ name: 'updataAllocation' },
        purchaserLowerAmount: null
      }),
      purchasersForm: {
        purchaserName: '',
        purchaserCode: '',
        createTimeStart: undefined,
        createTimeEnd: undefined
      },
      tabsKey: this.$route?.query?.tabsKey || '1',
      endOpen: '',
      purchasersColumns: [
        {
          title: '采购商名称',
          dataIndex: 'purchaserName',
          key: 'purchaserName'
        },
        {
          title: '采购商编码',
          dataIndex: 'purchaserCode',
          key: 'purchaserCode'
        },
        {
          title: '采购商寻源保证金下限金额(元)',
          dataIndex: 'purchaserLowerAmount',
          key: 'purchaserLowerAmount'
        },
        {
          title: '创建人',
          dataIndex: 'createUsername',
          key: 'createUsername'
        },
        {
          title: '创建时间',
          dataIndex: 'createTimeDb',
          key: 'createTimeDb',
          width: 200,
          scopedSlots: { customRender: 'createTimeDb' }
        },
        {
          title: '操作',
          key: 'action',
          width: 110,
          scopedSlots: { customRender: 'operation' }
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
      const result = await findPlatformSourceDeposit()
      if (result.code === '0' && result.data) {
        this.platform.setFieldsValue({
          purchaserLowerAmount: result.data[0].purchaserLowerAmount
        })
      }
    },
    async purchasersList(params) {
      if (params.isTrue) {
        this.$refs.purchasersTable.refresh(true)
        return
      }
      this.purchasersForm.createTimeStart = this.purchasersForm?.createTimeStart
        ? moment(this.purchasersForm?.createTimeStart).format('YYYY-MM-DD')
        : undefined
      this.purchasersForm.createTimeEnd = this.purchasersForm?.createTimeStart
        ? moment(this.purchasersForm?.createTimeEnd).format('YYYY-MM-DD')
        : undefined
      const result = await findBuyerSourceDeposit({
        ...{ depositConfigType: '2', dimensionType: '2' },
        ...this.purchasersForm,
        ...params
      })
      result.data.listObj = result.data.data
      result.data.listObj.forEach((item) => {
        // operation.forEach((v) => {
        //   // v = { ...v, ...item }
        //   v = Object.assign(v, item)
        // })
        // this.$set(item, 'operation', operation)
      })
      return result
    },
    async getList(params) {
      const result = await findPlatformSourceDepositLog({
        currentPage: params.currentPage,
        itemsPerPage: params.itemsPerPage
      })
      if (result.code === '0' && result.data) {
        result.data.data.map((item, index) => {
          this.$set(item, 'index', index + 1)
        })
        result.data.listObj = result.data.data
        result.data.total = result.data?.total
        return result
      }
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
      this.platform.chargeOrNot = e.target.value
    },
    async submitBtn() {
      this.platform.validateFields(async (err, values) => {
        if (err) {
          return
        }
        const result = await savePlatformSourceDeposit({
          depositConfigType: '1',
          dimensionType: '1',
          ...values
        })
        if (result.code === '0') {
          this.$message.success(result.message)
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
      const endValue = this.purchasersForm.createTimeEnd
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.purchasersForm.createTimeStart
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    resetPurchasersForm() {
      this.purchasersForm = {
        purchaserName: '',
        purchaserCode: '',
        createTimeStart: undefined,
        createTimeEnd: undefined
      }
    },
    goSetAllocationOfTender() {
      this.$router.push({
        name: 'SetPlatformMargin'
      })
    },
    handlePurchaserLowerAmount(value) {
      if (!value) return
      this.platform.setFieldsValue({
        purchaserLowerAmount: value
      })
    },
    editOperation(call, params, i) {
      this.$router.push({
        name: 'UpdataPlatformMargin',
        params: {
          id: params.id,
          price: params.purchaserLowerAmount
        }
      })
    },
    async deleteOperation(call, params, i) {
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {
          const result = await deleteBuyerSourceDepositById({ id: params.id })
          if (result.code === '0') {
            this.$message.success(result.message)
            this.$refs.purchasersTable.refresh(true)
          }
        },
        onCancel() {}
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
.btn-class {
  color: #888;
  cursor: pointer;
  margin-right: 10px;
  color: #ff6b00;
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
</style>
