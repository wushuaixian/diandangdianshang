<template>
  <div class="category-audit editList">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParams">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商名称" prop="merchantName">
                <a-input show-time v-model="queryParams.merchantName" placeholder="请输入供应商名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="最后变更时间" prop="updateTimeEndStr">
                <a-range-picker class="width100" @change="changeTime" v-model="time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="clearParam">重置</a-button>
              <a-button type="primary" @click="fetch">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <div class="main mt-20">
      <div class="content">
        <a-tabs @change="changeHandleTab">
          <a-tab-pane key="1" tab="全部">
            <a-table
              :loading="tableLoading"
              name="checkAll"
              ref="table"
              rowKey="id"
              :columns="columns"
              :data-source="tableData"
              :pagination="pagination"
              @change="tableChange"
            >
              <template slot="productionState" slot-scope="record, text">
                <div v-if="record === 1 || record === 3">
                  <div class="green"></div>
                  审核通过
                </div>
                <div v-if="record === 0">
                  <div class="green orange"></div>
                  待审核
                </div>
                <div v-if="record === 2">
                  <div class="green red"></div>
                  驳回
                  <a-tooltip placement="top">
                    <template slot="title">
                      <p>{{ text.auditMsg }}</p>
                    </template>
                    <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
                    <a-icon type="question-circle" placement="top" />
                  </a-tooltip>
                </div>
              </template>
              <template slot="action" slot-scope="record, text">
                <a href="#" @click="showvrPage(record, text)">查看 </a>
                <a v-if="text.productionState === 0" @click="editVR(record, text)">审核</a>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已通过">
            <a-table
              :loading="tableLoading"
              name="checkYes"
              ref="table"
              rowKey="id"
              :columns="columns"
              :data-source="tableData"
              :pagination="pagination"
            >
              <template slot="productionState" slot-scope="record, text">
                <div v-if="record === 1 || record === 3">
                  <div class="green"></div>
                  审核通过
                </div>
                <div v-if="record === 0">
                  <div class="green orange"></div>
                  待审核
                </div>
                <div v-if="record === 2">
                  <div class="green red"></div>
                  驳回
                  <a-tooltip placement="top">
                    <template slot="title">
                      <p>{{ text.auditMsg }}</p>
                    </template>
                    <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
                    <a-icon type="question-circle" placement="top" />
                  </a-tooltip>
                </div>
              </template>
              <template slot="action" slot-scope="record, text">
                <a href="#" @click="showvrPage(record, text)">查看 </a>
                <a v-if="text.productionState === 0" @click="editVR(text)">审核</a>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="3" tab="未通过">
            <a-table
              :loading="tableLoading"
              name="checkNo"
              ref="table"
              rowKey="id"
              :columns="columns"
              :data-source="tableData"
              :pagination="pagination"
            >
              <template slot="productionState" slot-scope="record, text">
                <div v-if="record === 1 || record === 3">
                  <div class="green"></div>
                  审核通过
                </div>
                <div v-if="record === 0">
                  <div class="green orange"></div>
                  待审核
                </div>
                <div v-if="record === 2">
                  <div class="green red"></div>
                  驳回
                  <a-tooltip placement="top">
                    <template slot="title">
                      <p>{{ text.auditMsg }}</p>
                    </template>
                    <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
                    <a-icon type="question-circle" placement="top" />
                  </a-tooltip>
                </div>
              </template>
              <template slot="action" slot-scope="record, text">
                <a href="#" @click="showvrPage(record, text)">查看 </a>
                <a v-if="text.productionState === 0" @click="editVR(text)">审核</a>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="4" tab="待审核">
            <a-table
              :loading="tableLoading"
              name="checking"
              ref="table"
              rowKey="id"
              :columns="columns"
              :data-source="tableData"
              :pagination="pagination"
            >
              <template slot="productionState" slot-scope="text">
                <div v-if="text === 1 || text === 3">
                  <div class="green"></div>
                  审核通过
                </div>
                <div v-if="text === 0">
                  <div class="green orange"></div>
                  待审核
                </div>
                <div v-if="text === 2">
                  <div class="green red"></div>
                  驳回
                  <a-tooltip placement="top">
                    <template slot="title">
                      <p>{{ text.auditMsg }}</p>
                    </template>
                    <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
                    <a-icon type="question-circle" placement="top" />
                  </a-tooltip>
                </div>
              </template>
              <template slot="action" slot-scope="record, text">
                <a href="#" @click="showvrPage(record, text)">查看 </a>
                <a v-if="text.productionState === 0" @click="editVR(text)">审核</a>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <a-modal v-model="visible" title="审核" @ok="handleOk">
      <a-form-model :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item label="审核结果">
          <a-radio-group v-model="form.resource">
            <a-radio value="1"> 通过 </a-radio>
            <a-radio value="2"> 驳回 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="form.resource === '2'" label="驳回原因">
          <a-textarea placeholder="请输入驳回原因" v-model="form.reason" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getProductionInfo, reviewProdction } from '@/api/vr'

export default {
  data() {
    return {
      columns,
      queryParams: {
        companyName: '',
        updateTimeEndStr: null,
        productionStates: [0, 1, 2, 3, 4]
      },
      time: null,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        total: 10
      },
      form: {
        resource: '1',
        reason: ''
      },
      visible: false,
      tableLoading: false,
      tableData: [],
      select: {}
    }
  },
  methods: {
    async fetch() {
      this.tableLoading = true
      const page = {
        currentPage: this.pagination.current,
        itemsPerPage: this.pagination.pageSize
      }
      await getProductionInfo({ ...this.queryParams, ...page, checkoutState: 1 }).then((res) => {
        this.tableData = res.data.listObj
        this.pagination.total = res.data.total
        this.tableLoading = false
      })
    },
    handleOk() {
      const parmar = {
        id: this.select.id,
        productionState: this.form.resource,
        auditMsg: this.form.reason
      }
      reviewProdction(parmar).then((res) => {
        this.fetch()
        this.visible = false
      })
    },
    clearParam() {
      this.queryParams = {
        companyName: '',
        updateTimeBeginStr: null,
        updateTimeEndStr: null,
        productionStates: [0, 1, 2, 3, 4]
      }
      this.time = null
      this.fetch()
    },
    tableChange(pagination) {
      this.pagination = { ...pagination }
      this.fetch()
    },
    changeHandleTab(key) {
      switch (key) {
        case '1':
          this.queryParams.productionStates = [0, 1, 2, 3] // 全部
          break
        case '2':
          this.queryParams.productionStates = [1, 3, 4] // 已通过
          break
        case '3':
          this.queryParams.productionStates = [2] // 未通过
          break
        case '4':
          this.queryParams.productionStates = [0] // 待审核
          break
      }
      this.pagination = {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        total: 10
      }
      this.fetch()
    },
    editVR(record, text) {
      this.select = text
      this.visible = true
    },
    showvrPage(record, text) {
      window.open(text.linkUrl, '_blank')
    },
    changeTime(date, dateString) {
      this.queryParams.updateTimeBeginStr = dateString[0]
      this.queryParams.updateTimeEndStr = dateString[1]
      this.time = date
    }
  },
  mounted() {
    this.fetch()
  }
}
const columns = [
  {
    title: '企业名',
    dataIndex: 'merchantName'
  },
  {
    title: 'VR制作人',
    dataIndex: 'createUsername'
  },
  {
    title: '最后变更时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    customRender: (text, record, index) => {
      const y = new Date(text).getUTCFullYear()
      const m = new Date(text).getMonth() + 1
      const d = new Date(text).getDate()
      const h = new Date(text).getHours()
      const mm = new Date(text).getMinutes()
      const s = new Date(text).getSeconds()
      return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }
  },
  {
    title: '审核状态',
    dataIndex: 'productionState',
    scopedSlots: { customRender: 'productionState' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]
</script>
<style lang="less" scoped>
.editList {
  & .header {
    width: 100%;
    border-radius: 8px;
    background-color: #fff;
    padding: 24px;
    & .button {
      margin-top: 16px;
      text-align: center;
    }
    .Longer {
      width: 174px;
    }
  }

  & .main {
    width: 100%;
    border-radius: 8px;
    background-color: #fff;
    & .content {
      padding: 24px;
      & .pagin {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

.mt-20 {
  margin-top: 20px;
}
.mt-24 {
  margin-top: 24px;
}
.mr-16 {
  margin-right: 16px;
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
.width100 {
  width: 100%;
}
.button {
  text-align: center;
}
.red {
  background: red;
}
</style>
