<template>
  <div class="af-process">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          v-bind="{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }"
          layout="inline"
          ref="ruleForm"
          :model="queryParam"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批流ID" prop="id">
                <a-input v-model="queryParam.id" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批流名称" prop="name">
                <a-input v-model="queryParam.name" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="状态" prop="isAvailable">
                <d-select :options="ApprovalProcessStatusList" v-model="queryParam.isAvailable"></d-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批形式" prop="auditType">
                <d-select :options="auditTypeList" v-model="queryParam.auditType"></d-select>
              </a-form-model-item>
            </a-col>
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
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
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
      <a-tabs v-model="queryParam.isAvailable" @change="handleSearch">
        <a-tab-pane
          v-for="item of ApprovalProcessStatusList"
          :key="item.value"
          :tab="`${item.label}(${item.count || 0})`"
        >
        </a-tab-pane>
      </a-tabs>
      <div class="buttons">
        <a-button type="primary" @click="showAddProcess = true">新增审批流</a-button>
      </div>
      <s-table ref="table" rowKey="id" :scroll="{ x: 2000 }" name="afProcessTable" :data="getList" :columns="columns">
        <template v-slot:isAvailable="props">
          <a-switch :checked="Boolean(props.isAvailable)" @click="handleSwitchChange(props)" />
        </template>
        <template v-slot:auditType="auditType">
          <div>
            {{
              $$(
                auditTypeList.find((x) => x.value === auditType),
                'label'
              )
            }}
          </div>
        </template>
        <template v-slot:typeCode="typeCode">
          <div>
            {{
              $$(
                allTypeCodeList.find((x) => x.value === typeCode),
                'label'
              )
            }}
          </div>
        </template>
        <template v-slot:platformId="platformId">
          {{
            $$(
              platformList.find((x) => x.value === platformId),
              'label'
            )
          }}
        </template>
        <template v-slot:createTime="createTime">
          <div v-if="createTime">{{ createTime | dayjs }}</div>
        </template>
        <template v-slot:updateTime="updateTime">
          <div v-if="updateTime">{{ updateTime | dayjs }}</div>
        </template>
        <template v-slot:action="props">
          <div>
            <router-link
              v-if="props.isAvailable !== 1"
              :to="{ name: 'ApprovalProcessAfProcessEdit', params: { id: props.id } }"
            >
              编辑
            </router-link>

            <a v-if="props.isAvailable !== 1" @click="handleDelete(props)">删除</a>
          </div>
        </template>
        <template v-slot:id="id">
          <router-link :to="{ name: 'ApprovalProcessAfProcessDetail', params: { id } }">
            {{ id }}
          </router-link>
        </template>
      </s-table>
    </a-card>
    <Add :visible.sync="showAddProcess" v-if="showAddProcess" @ok="handleSearch" />
  </div>
</template>

<script>
import { ApprovalProcessStatusList, auditTypeList, platformList } from '@/config/constant'
import {
  getAfTypeConfigList,
  getafProcessList,
  existEnableProcess,
  updateStatus,
  countList,
  deleteAfProcess,
  getListMulti,
  getCompanyInfos,
  getModelTypeList
} from '@/api/configgurationCenter/approvalProcess'
// import { getComList } from '@/api/contract'
import Add from './add'
import { mapState } from 'vuex'
export default {
  components: { Add },
  data() {
    return {
      columns: [
        { title: '审批流ID', dataIndex: 'id', key: 'id', scopedSlots: { customRender: 'id' } },
        { title: '审批流名称', dataIndex: 'name', key: 'name' },
        {
          title: '状态',
          key: 'isAvailable',
          scopedSlots: {
            customRender: 'isAvailable'
          }
        },
        {
          title: '审批形式',
          dataIndex: 'auditType',
          key: 'auditType',
          scopedSlots: {
            customRender: 'auditType'
          }
        },
        {
          title: '所属平台',
          dataIndex: 'platformId',
          key: 'platformId',
          scopedSlots: {
            customRender: 'platformId'
          },
          show: this.$hasOpeerate()
        },
        { title: '所属机构', dataIndex: 'merchantName', key: 'merchantName' },
        {
          title: '适用模块',
          dataIndex: 'modelStr',
          key: 'modelStr'
        },
        {
          title: '审批单据',
          dataIndex: 'typeCode',
          key: 'typeCode',
          scopedSlots: {
            customRender: 'typeCode'
          }
        },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '创建人', dataIndex: 'createUsername', key: 'createUsername' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '修改人', dataIndex: 'updateUsername', key: 'updateUsername' },
        { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', scopedSlots: { customRender: 'updateTime' } },
        { title: '操作', fixed: 'right', key: 'action', scopedSlots: { customRender: 'action' } }
      ],
      ApprovalProcessStatusList,
      auditTypeList,
      platformList,
      queryParam: {
        time: [],
        isAvailable: '',
        auditType: '',
        model: '',
        typeCode: '',
        platformId: '',
        merchantId: ''
      },
      showAddProcess: false,
      modelList: [],
      typeCodeList: [],
      allTypeCodeList: [],
      merchantList: [],
      ListMulti: [
        { value: 'APPDFLOW_MODEL_PLAT', label: 1 },
        { value: 'APPDFLOW_MODEL_PURCHASE', label: 7 },
        { value: 'APPDFLOW_MODEL_SUPPLIER', label: 6 }
      ]
    }
  },
  mounted() {
    this.getAllTypeCode()
    this.getListMulti()
    this.getCountList()
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
    async getList({ currentPage: page, itemsPerPage: limit }) {
      const { queryParam: filters, isPlatform: platformId } = this
      const data = {
        page,
        limit,
        filters: { ...filters },
        platformId
      }
      if (data.filters?.time?.length > 0) {
        const [startCreateTime, endCreateTime] = data.filters.time
        data.filters.startCreateTime = `${startCreateTime.format('YYYY-MM-DD')} 00:00:00`
        data.filters.endCreateTime = `${endCreateTime.format('YYYY-MM-DD')} 23:59:59`
        Reflect.deleteProperty(data.filters, 'time')
      }
      return getafProcessList(data)
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
    async getCountList() {
      const { queryParam: filters } = this
      const res = await countList({ filters })
      if (res.code === '0') {
        const count = res.data.length > 0 ? res.data.map((x) => x.count).reduce((n, m) => n + m) : 0
        this.ApprovalProcessStatusList = this.ApprovalProcessStatusList.map((x) => ({
          ...x,
          count: x.value !== '' ? res.data.find((c) => c.code === x.value)?.count || 0 : count
        }))
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
    async getAllTypeCode() {
      const res = await getAfTypeConfigList()
      if (res.code === '0') {
        this.allTypeCodeList =
          res?.data?.map((x) => {
            return {
              label: x?.name,
              value: x?.code
            }
          }) || []
      }
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
    handleSearch() {
      this.$refs.table.refresh(true)
      this.getCountList()
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
      this.merchantList = []
    },
    async handleSwitchChange(props) {
      const { id, merchantId, typeCode, isAvailable } = props
      if (isAvailable === 1) {
        this.$confirm({
          title: '提示',
          content: '确认停用数据吗？',
          onOk: async () => {
            this.updateStatus(props)
          },
          onCancel: () => {}
        })
      } else {
        const res = await existEnableProcess({ id, merchantId, typeCode })
        if (res?.data) {
          this.$confirm({
            title: '提示',
            content: '已经存在启用状态的该单据类型审批流配置，若启用该数据，原启用状态下的数据将停用，确认启用数据吗？',
            onOk: async () => {
              this.updateStatus(props)
            },
            onCancel() {}
          })
        } else {
          this.updateStatus(props)
        }
      }
    },
    async updateStatus(data) {
      const res = await updateStatus({ ...data })
      if (res.code === '0') {
        this.handleSearch()
      }
    },
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },
    async handleDelete({ id }) {
      this.$confirm({
        title: '提示',
        content: '是否删除当前审批流',
        onOk: async () => {
          const ids = [id]
          const res = await deleteAfProcess(ids)
          if (res.code === '0') {
            this.$message.success('删除成功')
            this.handleSearch()
          }
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.af-process {
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
