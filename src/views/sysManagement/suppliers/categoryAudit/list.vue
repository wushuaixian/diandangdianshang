<template>
  <div class="category-audit">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input v-model="queryParam.enterpriseName" placeholder="请输入供应商名称" width="210" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="经营品类">
                <a-select allowClear v-model="queryParam.categoryId" class="inp">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="审核状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option v-for="(item, i) in statusList" :value="!i ? '' : String(i)" :key="i">{{
                    item
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间">
                <a-range-picker v-model="queryParam.submitTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="企业性质" prop="enterpriseNature">
                <a-select allowClear v-model="queryParam.enterpriseNature" class="inp">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="1"> 生产商 </a-select-option>
                  <a-select-option value="2"> 贸易商 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="Reset">重置</a-button>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <a-tabs v-model="queryParam.auditStatus" @change="handleTabsChange">
        <a-tab-pane v-for="item in statusList" :key="item.value" :tab="item.label" />
      </a-tabs>
      <div class="queryResults_button">
        <a-button
          class="reset"
          @click="
            auditStyle = 2
            popupStatus = true
          "
          :disabled="ids.length <= 0"
        >
          批量审核</a-button
        >
      </div>
      <s-table
        name="categoryaudit"
        ref="table"
        :columns="columns"
        :scroll="{ x: 1600 }"
        :data="init"
        :row-selection="{
          onChange: onSelectChange,
          getCheckboxProps: (record) => {
            return {
              props: {
                disabled: record.auditStatus !== '1' || record.isMaincategory !== '0'
              }
            }
          }
        }"
        rowKey="id"
      >
        >
        <template v-slot:name="props, item">
          <div>
            <a @click="viewEnterprise(item)"> {{ props }}{{ item.isMaincategory === '1' ? '(主营品类)' : '' }} </a>
          </div>
        </template>
        <span v-if="auditTime" slot="auditTime" slot-scope="auditTime">
          {{ auditTime | moment('YYYY-MM-DD HH:mm:ss') }}</span
        >
        <template slot="createTime" slot-scope="createTime">
          {{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:auditStatus="props">
          <a-tooltip placement="top" v-if="props.auditStatus === '3'">
            <template slot="title">
              <span>{{ props.message }}</span>
            </template>
            <a-badge
              :color="statusColor[props.auditStatus]"
              :text="
                $$(
                  statusList.find((x) => x.value === props.auditStatus),
                  'label'
                )
              "
            />
            <a-icon type="question-circle" style="margin-left: 10px" />
          </a-tooltip>
          <a-badge
            v-else
            :color="statusColor[props.auditStatus]"
            :text="
              $$(
                statusList.find((x) => x.value === props.auditStatus),
                'label'
              )
            "
          />
        </template>
        <template slot="action" slot-scope="props">
          <a @click="viewComments(props.merchantId, props.id)" style="margin-right: 10px">查看审核意见</a>
          <a
            v-if="props.auditStatus === '1' && props.isMaincategory !== '1'"
            @click="handleAudit(props, props.merchantId)"
          >
            审核
          </a>
        </template>
        <template v-slot:businessLicenceUrl="props">
          <ImagePreview :value="props" :width="40" :height="40" />
        </template>
        <span slot="enterpriseNature" slot-scope="enterpriseNature">
          <span v-if="enterpriseNature === '1'">生产商</span>
          <span v-if="enterpriseNature === '2'">贸易商</span>
        </span>
      </s-table>
    </a-card>
    <ExaminePopup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
    <ListPopup
      v-if="viewCommentsStatus"
      :visible.sync="viewCommentsStatus"
      :id="id"
      :newId="newId"
      type="品类审核"
      @close="viewCommentsStatus = false"
    />
  </div>
</template>
<script>
import { supplierAuditList, auditCategoryList } from '@/api/categoryaudit'
import * as userAPI from '@/api/user'
import ListPopup from '@/views/sysManagement/suppliers/certificationAudit/listPopup'
import { ExaminePopup, ImagePreview } from '@/components/'
import { statusColor } from '@/store/platform-types'
import _ from 'loadsh'
export default {
  components: {
    ExaminePopup,
    ImagePreview,
    ListPopup
  },
  created() {
    this.BindData()
  },
  data() {
    return {
      viewCommentsStatus: false,
      statusColor,
      statusList: [
        { label: '全部', value: '' },
        { label: '待审核', value: '1' },
        { label: '审核通过', value: '2' },
        { label: '审核不通过', value: '3' }
      ],
      popupStatus: false,
      ids: [],
      id: null,
      newId: null,
      merchantId: '',
      categoryList: [],
      auditStyle: 1, // 1为单审核 2为批量审核
      singleId: 0,
      queryParam: {
        enterpriseName: '',
        name: '',
        auditStatus: '',
        time: [],
        categoryId: '',
        submitTime: null,
        enterpriseNature: ''
      },
      columns: [
        {
          title: '经营品类',
          dataIndex: 'name',
          fixed: 'left',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '企业名称',
          dataIndex: 'enterpriseName',
          fixed: 'left',
          key: 'enterpriseName'
        },
        {
          title: '企业性质',
          dataIndex: 'enterpriseNature',
          key: 'enterpriseNature',
          scopedSlots: { customRender: 'enterpriseNature' }
        },
        {
          title: '提交时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
          width: 200,
          scopedSlots: { customRender: 'auditTime' }
        },
        {
          title: '审核人',
          dataIndex: 'updateUsername',
          key: 'updateUsername'
        },
        {
          title: '营业执照',
          dataIndex: 'businessLicenceUrl',
          key: 'businessLicenceUrl',
          scopedSlots: { customRender: 'businessLicenceUrl' }
        },
        {
          title: '审核状态',
          key: 'tags',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.submitExamine = _.debounce(this.submitExamine, 500)
  },
  methods: {
    async init(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      if (data.submitTime) {
        const [beginTime, endTime] = data.submitTime
        data.submitStartTime = beginTime
        data.submitEndTime = endTime
      }
      return supplierAuditList({
        ...data
      })
    },
    viewComments(id, newId) {
      this.id = id
      this.newId = newId
      this.viewCommentsStatus = true
    },
    handleTabsChange() {
      this.ids = []
      this.$refs.table.refresh(true)
    },
    async BindData() {
      userAPI.queryMerAllCategory().then((ret) => {
        this.categoryList = ret.data
      })
    },
    onSelectChange(selectedRowKeys) {
      this.ids = selectedRowKeys
    },
    viewEnterprise(record) {
      this.$router.push({
        name: 'CategoryAuditDetail',
        params: {
          id: record.id,
          merchantId: record.merchantId
        }
      })
    },
    Reset() {
      this.queryParam = {
        name: '',
        enterpriseName: '',
        auditStatus: '',
        time: [],
        categoryId: '',
        submitEndTime: null,
        enterpriseNature: ''
      }
    },
    handleAudit({ id }, merchantId) {
      this.auditStyle = 1
      this.merchantId = merchantId
      this.popupStatus = true
      this.singleId = id
    },
    async submitExamine(status, message) {
      let idlist = []
      const { ids, singleId, auditStyle } = this
      if (auditStyle === 1 && status === 1) {
        idlist = [singleId]
        if (this.ids.includes(singleId)) {
          this.ids.splice(
            this.ids.findIndex((item) => item === singleId),
            1
          )
        }
      } else {
        idlist = ids
      }
      const res = await auditCategoryList({
        ids: idlist,
        status: status === 1 ? 2 : 3,
        message,
        merchantId: this.merchantId
      })
      if (res.code === '0') {
        this.$message.success('审核成功')
        this.$refs.table.refresh(true)
        this.selectedRowKeys = []
      }
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style lang="less" scoped>
.category-audit {
  .button {
    text-align: center;
  }
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .queryResults_button {
    margin-bottom: 20px;
  }
}
</style>
