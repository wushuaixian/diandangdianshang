<template>
  <div class="af-task">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :model="queryParam"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <div v-if="$hasOpeerate()">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="所属平台" prop="platformId">
                  <d-select :options="platformList" v-model="queryParam.platformId" @change="handleChange"></d-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="所属机构" prop="merchantId">
                  <d-select
                    :options="[
                      ...[
                        {
                          label: '全部',
                          value: ''
                        }
                      ],
                      ...merchantList
                    ]"
                    v-model="queryParam.merchantId"
                    show-search
                    :label-in-value="false"
                    :filterOption="handleFetch"
                  ></d-select>
                </a-form-model-item>
              </a-col>
            </div>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="适用模块" prop="model">
                <d-select
                  :options="[
                    ...[
                      {
                        label: '全部',
                        value: ''
                      }
                    ],
                    ...modelList
                  ]"
                  @change="handleModel"
                  v-model="queryParam.model"
                ></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批单据" prop="typeCode">
                <d-select
                  :options="[
                    ...[
                      {
                        label: '全部',
                        value: ''
                      }
                    ],
                    ...typeCodeList
                  ]"
                  v-model="queryParam.typeCode"
                ></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="业务单据编号" prop="bizCode">
                <a-input v-model="queryParam.bizCode" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批任务编号" prop="auditTaskId">
                <a-input v-model="queryParam.auditTaskId" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="申请人账号" prop="applyUsername">
                <a-input v-model="queryParam.applyUsername" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="申请时间" prop="applyTimeRange">
                <a-range-picker v-model="queryParam.applyTimeRange" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="buttons">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card :bordered="false">
      <a-tabs v-model="queryParam.auditStatus" @change="handleSearch">
        <a-tab-pane v-for="item of AfTaskStatusList" :key="item.value" :tab="`${item.label}(${item.count || 0})`">
        </a-tab-pane>
      </a-tabs>
      <div class="buttons">
        <a-button @click="batchAudit">批量审核通过</a-button>
        <a-button @click="batchReject">批量审核不通过</a-button>
      </div>
      <s-table
        ref="table"
        :rowSelection="rowSelection"
        rowKey="id"
        :scroll="{ x: 2000 }"
        name="afTaskTable"
        :data="getList"
        :columns="columns"
      >
        <template v-slot:auditTaskId="{ code: taskCode, auditTaskId }">
          <router-link
            :to="{
              name: 'ApprovalProcessAfTakDetail',
              params: {
                taskCode,
                auditTaskId
              }
            }"
          >
            {{ auditTaskId }}
          </router-link>
        </template>
        <template v-slot:model="model">
          <div>
            {{
              $$(
                allModelList.find((x) => x.value === model),
                'label'
              )
            }}
          </div>
        </template>
        <!-- <template v-slot:typeCode="typeCode">
          <div>
            {{
              $$(
                typeCodeList.find((x) => x.value === typeCode),
                'label'
              )
            }}
          </div>
        </template> -->

        <template v-slot:applyTime="applyTime">
          <div>
            {{ applyTime | dayjs }}
          </div>
        </template>
        <template v-slot:auditTime="auditTime">
          <div>
            {{ auditTime | dayjs }}
          </div>
        </template>
        <template v-slot:updateTime="props">
          <div v-if="props.status === 2">
            {{ props.updateTime | dayjs }}
          </div>
        </template>
        <template v-slot:action="props">
          <div>
            <a v-if="props.status === 1 && props.auditStatus === 1 && props.hasAuditRight" @click="handleAudit(props)">
              审批
            </a>
          </div>
        </template>
      </s-table>
    </a-card>
    <AuditDialog
      :visible.sync="showAuth"
      :audit-id-list="auditDialogTaskIdList"
      :audit-status="auditDialogStatus"
      @ok="handleOk"
    />
  </div>
</template>

<script>
import {
  getModelTypeList,
  getListMulti,
  getCompanyInfos,
  getAfTaskConfigList
} from '@/api/configgurationCenter/approvalProcess'
import { AfTaskStatusList, platformList } from '@/config/constant'
import { getTaskList, getCountList } from '@/api/configgurationCenter/approvalTask'
import AuditDialog from '../components/EditorAuditDialog/AuditDialog.vue'
import { mapState } from 'vuex'
export default {
  components: { AuditDialog },
  data() {
    return {
      platformList,
      showAuth: false,
      auditDialogTaskIdList: [],
      auditDialogStatus: null,
      queryParam: {
        applyTimeRange: [],
        time: [],
        auditStatus: '',
        model: '',
        typeCode: '',
        platformId: '',
        merchantId: ''
      },
      modelList: [],
      allModelList: [],
      typeCodeList: [],
      AfTaskStatusList,
      columns: [
        {
          title: '审批任务编号',
          key: 'auditTaskId',
          scopedSlots: { customRender: 'auditTaskId' }
        },
        { title: '申请人', dataIndex: 'applyUsername', key: 'applyUsername' },
        { title: '所属机构', dataIndex: 'merchantName', key: 'merchantName' },
        {
          title: '适用模块',
          dataIndex: 'model',
          key: 'model',
          scopedSlots: {
            customRender: 'model'
          }
        },
        {
          title: '审批单据',
          dataIndex: 'typeName',
          key: 'typeName'
          // scopedSlots: {
          //   customRender: 'typeCode'
          // }
        },
        { title: '业务单据编号', dataIndex: 'bizCode', key: 'bizCode' },
        {
          title: '审批状态',
          dataIndex: 'statusStr',
          key: 'statusStr'
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          key: 'applyTime',
          scopedSlots: { customRender: 'applyTime' }
        },
        {
          title: '当前账号审批时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
          scopedSlots: { customRender: 'auditTime' }
        },
        {
          title: '单据审批完成时间',
          key: 'updateTime',
          scopedSlots: { customRender: 'updateTime' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectRows: [],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRows = selectRows
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.status !== 1 || record.auditStatus !== 1 || !record.hasAuditRight
          }
        })
      },
      merchantList: [],
      ListMulti: [
        { value: 'APPDFLOW_MODEL_PLAT', label: 1 },
        { value: 'APPDFLOW_MODEL_PURCHASE', label: 7 },
        { value: 'APPDFLOW_MODEL_SUPPLIER', label: 6 }
      ]
    }
  },
  mounted() {
    this.getAllListMulti()
    this.getListMulti()
    this.getCountList()
    // this.getComList()
    // this.getAfTypeConfigList()
  },
  computed: {
    ...mapState({
      isPlatform: (state) => state.permission.isPlatform
    })
  },
  methods: {
    handleChange(val) {
      this.getComList(val)
    },
    async getComList(platformId) {
      const res = await getCompanyInfos(platformId)
      if (res.code === '0') {
        this.merchantList =
          res?.data?.merchantList?.map((x) => {
            return {
              label: x?.orgName,
              value: x?.id
            }
          }) || []
      }
    },
    async handleModel() {
      const {
        queryParam: { platformId, model },
        isPlatform
      } = this
      const res = await getModelTypeList({ platformId: platformId || isPlatform, model })
      if (res.code === '0') {
        this.typeCodeList =
          res?.data?.map((x) => {
            return {
              label: x?.name,
              value: x?.code
            }
          }) || []
      }
    },
    async getCountList() {
      const { queryParam: filters } = this
      const res = await getCountList({ filters })
      if (res.code === '0') {
        const count = res.data.length > 0 ? res.data.map((x) => x.count)?.reduce((n, m) => n + m) : 0
        this.AfTaskStatusList = this.AfTaskStatusList.map((x) => {
          return {
            ...x,
            count: x.value !== '' ? res.data.find((c) => c.auditStatus === Number(x.value))?.count || 0 : count
          }
        })
      }
    },
    async getList({ currentPage: page, itemsPerPage: limit }) {
      const { queryParam: filters } = this
      const data = {
        page,
        limit,
        filters: { ...filters }
      }
      if (data.filters?.time?.length > 0) {
        const [startAuditTime, endAuditTime] = data.filters.time
        data.filters.startAuditTime = `${startAuditTime.format('YYYY-MM-DD')} 00:00:00`
        data.filters.endAuditTime = `${endAuditTime.format('YYYY-MM-DD')} 23:59:59`
      }
      if (data.filters?.applyTimeRange?.length > 0) {
        const [startApplyTime, endApplyTime] = data.filters.applyTimeRange
        data.filters.startApplyTime = `${startApplyTime.format('YYYY-MM-DD')} 00:00:00`
        data.filters.endApplyTime = `${endApplyTime.format('YYYY-MM-DD')} 23:59:59`
      }
      return getTaskList(data)
    },
    async getListMulti() {
      const { ListMulti, isPlatform } = this
      const key = ListMulti.find((x) => x.label === isPlatform)?.value
      const data = { categories: [key] }
      const res = await getListMulti(data)
      if (res.code === '0') {
        this.modelList =
          res?.data[key]?.map((x) => {
            return {
              label: x?.name,
              value: x?.code
            }
          }) || []
      }
    },
    async getAllListMulti() {
      const res = await getAfTaskConfigList()
      if (res.code === '0') {
        this.allModelList =
          res?.data?.APPDFLOW_MODEL_PLAT?.map((x) => {
            return {
              label: x?.name,
              value: x?.code
            }
          }) || []
      }
    },
    handleSearch() {
      this.$refs.table.refresh(true)
      this.getCountList()
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
      this.merchantList = []
    },
    handleAudit(row) {
      this.showAuth = true
      this.auditDialogTaskIdList = [row.auditTaskId]
      this.auditDialogStatus = 2
    },
    async batchAudit() {
      if (this.selectRows.length === 0) {
        return this.$message.warning(this.$t('至少选择一条数据'))
      }
      this.showAuth = true
      this.auditDialogTaskIdList = this.selectRows.map((x) => x?.auditTaskId)
      this.auditDialogStatus = 2
    },
    async batchReject() {
      if (this.selectRows.length === 0) {
        return this.$message.warning(this.$t('至少选择一条数据'))
      }
      this.showAuth = true
      this.auditDialogTaskIdList = this.selectRows.map((x) => x?.auditTaskId)
      this.auditDialogStatus = 3
    },
    handleOk() {
      if (this.auditDialogTaskIdList.length > 0) {
        this.auditDialogTaskIdList = []
        this.auditDialogStatus = null
        this.selectRows = []
      }
      this.$refs.table.refresh()
      this.getCountList()
    },
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    }
  }
}
</script>

<style lang="less" scoped>
.af-task {
  .table-page-search-wrapper-custom {
    .buttons {
      text-align: center;
    }
  }
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .buttons {
    margin-bottom: 20px;
  }
}
</style>
