<template>
  <div class="authInfo">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input placeholder="请输入企业名称" v-model="queryParam.enterpriseName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="验厂工单号" prop="workOrderNo">
                <a-input placeholder="请输入验厂工单号" v-model="queryParam.factoryAuditNo" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="法定代表人" prop="legalPersonName">
                <a-input placeholder="请输入法定代表人" v-model="queryParam.legalPersonName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button class="reset" @click="reset">重置</a-button>
                <a-button type="primary" @click="queryButton">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>

    <a-card>
      <div class="bottom">
        <a-tabs v-model="queryParam.authStatus" @change="handleTabsChange">
          <a-tab-pane v-for="item in authStatusList" :key="item.value" :tab="item.label" />
        </a-tabs>
        <div class="bottomButton">
          <a-button v-if="false">批量导出</a-button>
          <a-button @click="showAddSupplier">添加认证供应商</a-button>
        </div>
        <s-table
          :columns="columns"
          name="certificationTables"
          :data="init"
          ref="table"
          rowKey="id"
          :scroll="{ x: 2100 }"
        >
          <template v-slot:enterpriseName="props">
            <router-link
              :to="{ name: 'SuppliersCertificationDetail', params: { id: props.id, authStatus: props.authStatus } }"
            >
              {{ props.enterpriseName }}
            </router-link>
          </template>
          <template slot="sumAmount" slot-scope="text">
            <div v-if="text.sumAmount">¥{{ text.sumAmount }}</div>
          </template>
          <template v-slot:expectFactoryAuditTime="props"> {{ props | moment('YYYY-MM-DD') }} </template>
          <template v-slot:realFactoryAuditTime="props">
            {{ props | moment('YYYY-MM-DD') }}
          </template>
          <template v-slot:payTime="props">
            {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-slot:submitTime="props">
            {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-slot:authStatus="text">
            <span v-if="$$(text, 'authStatus') !== '4'">
              {{
                $$(
                  authStatusList.find((x) => x.value === text),
                  'label'
                )
              }}
            </span>
            <!-- <div v-else-if="$$(text, 'authStatus') === '4' && !text.content">
            {{ authStatusList.find((x) => x.value === $$(text, 'authStatus')).label }}
          </div> -->
            <a-tooltip placement="top" v-else>
              <template slot="title">
                <p>{{ text.auditReason }}</p>
              </template>
              {{
                $$(
                  authStatusList.find((x) => x.value === text),
                  'label'
                )
              }}
              <a-icon type="question-circle" />
            </a-tooltip>
          </template>
          <template v-slot:action="text">
            <a v-if="text.authStatus == 0" class="bluetext" style="color: #ff6b00" @click="factoryInspection(text.id)">
              指定验厂
            </a>
          </template>
        </s-table>
      </div>
    </a-card>
    <listPopup :listPopupvisible="listPopupvisible" @close="listPopupvisible = false" :id="id" @ok="queryButton" />
    <AddSupplier
      v-if="isShowAddSupplier"
      :popupStatus="addSupplierVisit"
      @update="$refs.table.refresh(true)"
      @close="closeAddSupplierPopup"
    />
    <listPopup :listPopupvisible="listPopupvisible" @close="listPopupvisible = false" :id="id" @ok="queryButton" />
    <AddSupplier :popupStatus="addSupplierVisit" @close="closeAddSupplierPopup" />
  </div>
</template>
<script>
import { supplieAuthAdminQuyery } from '@/api/supplieAuthAdmin'
import AddSupplier from './AddSupplier'
import listPopup from './listPopup'
import { authStatusList } from '@/config/constant'
export default {
  components: {
    listPopup,
    AddSupplier
  },
  data() {
    return {
      authStatusList,
      id: '',
      listPopupvisible: false,
      pageNumber: 10,
      selectedRowKeys: [],
      queryParam: {
        enterpriseName: '',
        factoryAuditNo: '',
        authStatus: '',
        legalPersonName: '',
        time: null
      },
      columns: [
        {
          title: '企业名称',
          key: 'enterpriseName',
          scopedSlots: { customRender: 'enterpriseName' },
          fixed: 'left',
          width: 220
        },
        {
          title: '购买套餐',
          key: 'packageName', // packageName
          dataIndex: 'packageName',
          width: 200
        },
        {
          title: '套餐金额',
          key: 'sumAmount',
          // dataIndex: 'sumAmount',
          scopedSlots: { customRender: 'sumAmount' },
          width: 200
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'businessLicenceNo',
          key: 'businessLicenceNo',
          width: 170
        },
        { title: '法定代表人', dataIndex: 'legalPersonName', key: 'legalPersonName', width: 150 },
        {
          title: '认证状态',
          width: 120,
          dataIndex: 'authStatus',
          key: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        },
        { title: '指定验厂机构', dataIndex: 'factoryAuditOrg', key: 'factoryAuditOrg', width: 180 },
        {
          title: '预计验厂时间',
          width: 180,
          dataIndex: 'expectFactoryAuditTime',
          key: 'expectFactoryAuditTime',
          scopedSlots: { customRender: 'expectFactoryAuditTime' }
        },
        {
          title: '实际验厂时间',
          width: 180,
          dataIndex: 'realFactoryAuditTime',
          key: 'realFactoryAuditTime',
          scopedSlots: { customRender: 'realFactoryAuditTime' }
        },
        { title: '验厂工单号', dataIndex: 'factoryAuditNo', key: 'factoryAuditNo', width: 150 },
        {
          title: '申请时间',
          dataIndex: 'payTime',
          key: 'payTime',
          width: 200,
          scopedSlots: { customRender: 'payTime' }
        },
        {
          title: '提交时间',
          dataIndex: 'submitTime',
          key: 'submitTime',
          width: 200,
          scopedSlots: { customRender: 'submitTime' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      addSupplierVisit: false,
      isShowAddSupplier: false
    }
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
        data.payStartTime = beginTime
        data.payEndTime = endTime
      }
      return supplieAuthAdminQuyery({ ...data })
    },
    handleTabsChange() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.$refs.form.resetFields()
    },
    queryButton() {
      this.$refs.table.refresh(true)
    },
    factoryInspection(id) {
      this.id = id
      this.listPopupvisible = true
    },
    jumpDetails(value) {
      this.$router.push({
        name: 'SuppliersCertificationDetail',
        query: {
          id: value.id
        }
      })
    },
    showAddSupplier() {
      this.addSupplierVisit = true
      this.isShowAddSupplier = true
    },
    closeAddSupplierPopup() {
      this.addSupplierVisit = false
      setTimeout(() => {
        this.isShowAddSupplier = false
      }, 300)
    }
  }
}
</script>
<style lang="less" scoped>
.authInfo {
  width: 100%;
  .button {
    text-align: center;
  }
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .bottomButton {
    margin-bottom: 20px;
  }
}
</style>
