<template>
  <div class="aftask-detail">
    <a-card>
      <div class="row">
        <div class="left">
          <div>状态</div>
          <!-- <div class="status">{{ taskInfo.status | statusStr }}</div> -->
          <div class="status">{{ taskInfo.statusStr }}</div>
          <div class="button" v-if="taskInfo.status === 1 && taskInfo.auditStatus === 1 && taskInfo.hasAuditRight">
            <a-button type="primary" @click="handleAudit">审批</a-button>
          </div>
        </div>
        <div class="right">
          <div class="title">
            审批任务单号：{{ taskInfo.auditTaskId }}
            <a-icon type="copy" v-clipboard:copy="taskInfo.auditTaskId" v-clipboard:success="clipboardSuccess" />
          </div>
          <div class="table-page-search-wrapper-custom">
            <a-form-model
              layout="inline"
              v-bind="{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }"
            >
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="所属平台">
                    <!-- <Ellipsis :length="15"> {{ taskInfo.merchantName }}</Ellipsis> -->
                    {{ platformIdJson[taskInfo.platformId] }}
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="所属机构">
                    <Ellipsis :length="15"> {{ taskInfo.merchantName }}</Ellipsis>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="适用模块">
                    {{ $$(taskInfo, 'modelStr') }}
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="审批单据">
                    {{
                      $$(
                        typeCodeList.find((x) => x.value === taskInfo.typeCode),
                        'label'
                      )
                    }}
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="申请人">
                    {{ taskInfo.applyUsername }}
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="申请时间">
                    {{ taskInfo.applyTime | dayjs }}
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="业务单据编号">
                    <a @click="toDetail">{{ taskInfo.bizCode }}</a>
                    <a-icon type="copy" v-clipboard:copy="taskInfo.bizCode" v-clipboard:success="clipboardSuccess" />
                    <div class="btn">{{ auditStatusJson[taskInfo.auditStatus] }}</div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </div>
      </div>
    </a-card>
    <appdflow-progress ref="progress" :task-code="taskCode" />
    <AuditDialog
      :visible.sync="showAuth"
      :audit-id-list="auditDialogTaskIdList"
      :audit-status="auditDialogStatus"
      @ok="init"
    />
  </div>
</template>

<script>
import { getTaskList } from '@/api/configgurationCenter/approvalTask'
import { getAfTypeConfigList } from '@/api/configgurationCenter/approvalProcess'
import AuditDialog from '../components/EditorAuditDialog/AuditDialog.vue'
const statusMap = {
  0: '放弃',
  1: '待审批',
  // 1: this.$t('审批中'),
  2: '审批通过',
  3: '审批不通过',
  4: '审批异常'
}
const auditStatusJson = {
  1: '审批中',
  2: '审批通过',
  3: '审批不通过'
}
const platformIdJson = {
  1: '运营平台',
  6: '采购商平台',
  7: '供应商平台'
}
export default {
  components: { AuditDialog },
  data() {
    return {
      showAuth: false,
      auditDialogTaskIdList: [],
      auditDialogStatus: null,
      auditStatusJson,
      platformIdJson,
      taskCode: this.$route.params?.taskCode,
      auditTaskId: this.$route.params?.auditTaskId,
      taskInfo: {},
      modelList: [],
      typeCodeList: [],
      actions: () =>
        new Map([
          [
            // 运营方付款单
            /^plat_payment_bill$/gi,
            ({ bizId: id }) => {
              this.$router.push({
                name: this.$hasOpeerate() ? 'SysPaymentManageDetail' : 'PaymentManageDetail',
                params: { id }
              })
            }
          ],
          [
            // 运营方应付单
            /^plat_fee_bill$/gi,
            ({ bizId: id }) => {
              this.$router.push({
                name: this.$hasOpeerate() ? 'SysSupplierPayableManageDetail' : 'SuppliersPaymentManageDetail',
                params: { id }
              })
            }
          ],
          [
            // 供应方付款单  采购方付款单
            /^.*_payment_bill$/gi,
            ({ bizId: id }) => {
              this.$router.push({
                name: this.$hasOpeerate() ? 'SysPaymentManageDetail' : 'PaymentManageDetail',
                params: { id }
              })
            }
          ],
          [
            // 供应方应付单  运营方应付单
            /^.*_fee_bill$/gi,
            ({ bizId: id }) => {
              this.$router.push({
                name: this.$hasOpeerate() ? 'SysSupplierPayableManageDetail' : 'SupplierPayableManageDetail',
                params: { id }
              })
            }
          ],
          [
            // 销售合同
            /^supplier_contract$/gi,
            ({ bizId: id }) => {
              this.$router.push({
                name: 'ContractSuppliersShowContract',
                query: { id, type: 'read' }
              })
            }
          ],
          [
            // 采购合同
            /^contract$/gi,
            ({ bizId: id }) => {
              this.$router.push({
                name: 'ContractPurchaseAddcontract',
                query: { id, type: 'read' }
              })
            }
          ],
          [
            // 采购商订单详情
            /^so$/gi,
            ({ bizCode: id }) => {
              this.$router.push({
                name: 'SysOrderOrderListDetails',
                query: { orderCode: id, type: 'read' }
              })
            }
          ],
          [
            // 采购计划
            /^buyer_plan$/gi,
            ({ bizCode: id, bizId: code }) => {
              this.$router.push({
                name: 'MerchantsPurchaseManagPlanDetail',
                query: { id, code }
              })
            }
          ],
          [
            // 供应商评分调级
            /^supplier_score$/gi,
            ({ bizCode: id, bizId: code }) => {
              this.$router.push({
                name: 'detailed',
                params: { id, seach: 0 }
              })
            }
          ]
        ])
      /**
        supplier_score 供应商评分调级
        inquiry_project_bid 询比价定标结果
      */
    }
  },
  mounted() {
    this.init()
    this.getAfTypeConfigList()
  },
  filters: {
    statusStr(status) {
      return statusMap[status] || '未知'
    }
  },
  methods: {
    async init() {
      const { taskCode: code, auditTaskId } = this
      const res = await getTaskList({
        page: 1,
        limit: 1,
        filters: { code, auditTaskId }
      })
      if (res.code === '0') {
        this.taskInfo = res?.data[0]
      }
    },
    clipboardSuccess() {
      this.$message.success('复制成功')
    },
    async getAfTypeConfigList() {
      const res = await getAfTypeConfigList()
      if (res.code === '0') {
        this.typeCodeList = res?.data?.map((x) => {
          return {
            label: x?.name,
            value: x?.code
          }
        })
      }
    },
    handleAudit() {
      const {
        taskInfo: { auditTaskId }
      } = this
      this.showAuth = true
      this.auditDialogTaskIdList = [auditTaskId]
      this.auditDialogStatus = 2
    },
    toDetail() {
      const {
        taskInfo,
        taskInfo: { typeCode },
        actions
      } = this
      console.log(typeCode)
      const [, goDetail] = [...actions()].find(([key, value]) => key.test(typeCode))
      goDetail(taskInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.aftask-detail {
  .row {
    display: flex;
    .left {
      text-align: center;
      color: rgb(102, 102, 102);
      width: 15%;
      .status {
        margin-top: 18px;
        margin-bottom: 15px;
        font-size: 1.2em;
        color: rgb(38, 38, 38);
      }
    }
    .right {
      width: 85%;
      border-left: 1px solid rgb(238, 245, 249);
      padding-left: 30px;
      .title {
        font-weight: bold;
        font-size: 1.1em;
        i {
          margin-left: 10px;
        }
      }
      .table-page-search-wrapper-custom {
        margin-top: 20px;
        i {
          margin-left: 10px;
        }
      }
    }
  }
}
.btn {
  font-size: 12px;
  line-height: 20px;
  padding: 0px 8px;
  color: #e7a23d;
  border-radius: 6px;
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
  border: 1px solid #ffa39e;
  background-color: #fef0ef;
}
</style>
