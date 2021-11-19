<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <!--search -->
        <a-form-model
          layout="inline"
          ref="form"
          :model="queryParam"
          v-bind="{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供  应  商" prop="name">
                <!-- <a-select
                  show-search
                  :value="value"
                  placeholder="请输入内容"
                  style="width: 200px"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleSearch"
                  @change="selectChange"
                >
                  <a-select-option v-for="item in selectData" :value="item.id" :key="item.value">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select> -->
                <d-select
                  :options="merchantList"
                  :label-in-value="false"
                  v-model="value"
                  show-search
                  :filterOption="handleFetch"
                  :disabled="!$hasOpeerate()"
                ></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商等级">
                <d-select :options="listB" v-model="selectB" @change="supplierChangelistB"> </d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="主营类目">
                <d-select :options="listC" v-model="selectC" @change="supplierChangelistC"> </d-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核状态">
                <d-select :options="auditStatusA" v-model="selectstateValue" @change="selectstate"> </d-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48"> </a-row>

          <a-row>
            <a-col :span="24" align="center">
              <!-- <a-space align="center"> -->
              <a-button class="btn" @click="handleReset">重置</a-button>
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <!-- </a-space> -->
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>

    <a-card>
      <a-tabs default-active-key="" @change="back" v-model="selectstateValue">
        <a-tab-pane key="" :tab="valueNUBA"> </a-tab-pane>
        <a-tab-pane key="0" :tab="valueNUBB"> </a-tab-pane>
        <a-tab-pane key="10" :tab="valueNUBC"> </a-tab-pane>
        <a-tab-pane key="20" :tab="valueNUBD"> </a-tab-pane>
      </a-tabs>
      <!-- <a-button style="margin-bottom: 16px" type="primary" @click="handleAdd">添加</a-button> -->
      <s-table
        :isCanFilter="false"
        v-if="(queryParam.platformId && queryParam.entityId) || $store.state.permission.isPlatform === 1"
        ref="table"
        name="SupplierTables"
        rowKey="id"
        :scroll="{ x: 1800 }"
        :columns="columns"
        :data="init"
      >
        <div slot="orgName" slot-scope="record">
          <a @click="orgNamerouter(record)">{{ record.orgName }}</a>
        </div>
        <!--createTime-->
        <template slot="createTime" slot-scope="record">{{
          record.createTime | moment('YYYY-MM-DD HH:mm:ss')
        }}</template>
        <template slot="useAppdflow" slot-scope="record">
          <a
            href="javaScript:;"
            @click="appealClick(record)"
            v-if="record.useAppdflow === false && record.auditStatus === 0"
          >
            审 批
          </a>
        </template>
      </s-table>
    </a-card>
    <a-modal title="提交审核" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <appeal-modal ref="audio_modal" />
    </a-modal>
  </div>
</template>

<script>
import {
  getSupplierAuditPage,
  queryPurchaseGrade,
  queryOneToThree,
  getStatusNumber,
  submitAudio
} from '@/api/SupplierSettings.js'
import { getCompanyInfos } from '@/api/configgurationCenter/approvalProcess'
// import { accessAuditQuyery } from '@/api/accessAudit'
// import { deleteRole, updateState } from '@/api/role.js'
// import { getComList } from '@/api/contract'
import appealModal from './appealSubmit.vue'
export default {
  name: 'RoleManagement',
  components: {
    appealModal
  },
  data() {
    return {
      auditStatusA: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '待审核'
        },
        {
          value: '10',
          label: '审核通过'
        },
        {
          value: '20',
          label: '审核拒绝'
        }
      ],
      selectData: [],
      selectGradingValue: '1',
      selectstateValue: '',
      selectB: '',
      selectC: '',
      handleChangeURL: '',
      message: '',
      listA: [],
      listB: [],
      listC: [],
      value: '',
      valueNUBA: '',
      valueNUBB: '',
      valueNUBC: '',
      valueNUBD: '',
      selectValue: null,
      scoreName: '',
      scoreCode: '',
      auditStatus: '',
      that: this,
      platformType: [],
      organList: [],
      time: [],
      queryParam: {
        createTimeBegin: null,
        createTimeEnd: null,
        platformId: null,
        name: '',
        entityId: null
      },
      columns: [
        { title: '供应商名称', key: 'orgName', width: 390, scopedSlots: { customRender: 'orgName' } },
        { title: '主营品类', dataIndex: 'categoryName', key: 'categoryName' },
        { title: '企业性质', dataIndex: 'nature', key: 'nature' },
        { title: '静态得分', key: 'staticScore', dataIndex: 'staticScore' },
        { title: '动态得分', key: 'moveScore', dataIndex: 'moveScore' },
        { title: '店铺得分', key: 'storeScore', dataIndex: 'storeScore' },
        { title: '总分', key: 'totalScore', dataIndex: 'totalScore' },
        { title: '当前等级', key: 'currentGradeId', dataIndex: 'currentGradeName' },
        { title: '申请调整等级', key: 'futureGradeId', dataIndex: 'futureGradeName' },
        { title: '发起人', key: 'createUsername', dataIndex: 'createUsername' },
        { title: '发起时间', key: 'createTime', width: 180, scopedSlots: { customRender: 'createTime' } },
        { title: '审核状态', key: 'auditStatusStr', dataIndex: 'auditStatusStr' },
        { title: '审核', key: 'useAppdflow', fixed: 'right', scopedSlots: { customRender: 'useAppdflow' } }
      ],
      visibleModal: false,
      confirmLoading: false,
      modalTitle: '添加角色',
      form: {},

      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      visible: false, // 审核弹框是否显示
      appealRow: {},
      merchantList: []
    }
  },
  filters: {
    platformTypeFilter(value, vm) {
      const { platformType } = vm
      const platformTypeItem = platformType.find((item) => {
        return item.value === value
      })
      return platformTypeItem ? platformTypeItem.label : ''
    }
  },
  created() {},
  mounted() {
    this.AJAX()
    this.getComList()
  },
  methods: {
    selectChange(value) {
      this.value = value
    },
    async getComList() {
      const res = await getCompanyInfos(6)
      if (res.code === '0') {
        this.merchantList = res?.data?.merchantList?.map((x) => {
          return {
            label: x?.orgName,
            value: x?.id
          }
        })
      }
    },
    supplierChangelistB(value) {
      this.selectB = value
    },
    async AJAX() {
      const data2 = await queryPurchaseGrade()
      const data3 = await queryOneToThree()

      this.listB = data2.data.listObj.map((item) => {
        item.value = item.id
        item.label = item.name
        return item
      })
      this.listC = data3.data.map((item) => {
        item.value = item.id
        item.label = item.name
        return item
      })
    },
    supplierChangelistC(value) {
      this.selectC = value
    },
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },
    selectstate(value) {
      this.selectstateValue = value
      this.$refs.table.refresh(true)
    },

    orgNamerouter(record) {
      this.$router.push({ name: 'detailed', params: { id: record.id, seach: '0' } })
    },
    back(value) {
      this.selectstateValue = value
      this.$refs.table.refresh(true)
    },

    async init(pagination) {
      const params = {
        ...pagination,
        // scoreType: this.selectValue,
        merchantId: this.value,
        currentGradeId: this.selectB || '',
        categoryId: this.selectC || '',
        auditStatus: this.selectstateValue
      }
      // if(this.value ===''||this.selectB ==='' )
      const res = await getSupplierAuditPage({ ...params })

      delete params.auditStatus
      const data = await getStatusNumber(params)

      this.valueNUBA = '全部(' + data.data.total + ')'
      this.valueNUBB = '待审核(' + data.data.wait + ')'
      this.valueNUBC = '审核通过(' + data.data.pass + ')'
      this.valueNUBD = '审核驳回(' + data.data.refuse + ')'

      res.data.list.listObj.map((x) => ({
        ...x,
        nature: x.nature === 1 ? (x.nature = '生产商') : (x.nature = '贸易商')
      }))
      return Promise.resolve({
        data: res.data?.list,
        code: res.code
      })
    },

    handleReset() {
      this.value = ''
      this.selectB = ''
      this.selectC = ''
      this.selectstateValue = ''
      this.$refs.table.refresh(true)
    },

    handleEdit(row, val) {
      this.$router.push({
        name: 'foformSupplierScoringSchemermlist',
        query: { value: 1, formSelect: 1, id: row.id, nub: val }
      })
    },
    // 点击审批按钮
    appealClick(props) {
      this.appealRow = props
      this.visible = true
    },
    // 提交审核
    async handleOk() {
      await this.$refs.audio_modal.$refs.ruleForm.validate()
      const params = {
        id: this.appealRow.id,
        merchantId: this.appealRow.merchantId,
        ...this.$refs.audio_modal.formData
      }
      const res = await submitAudio(params)
      console.log(res)
      // if (res.status) {
      //   this.$message.success('审核成功')
      // } else {
      //   this.$message.success('审核失败')
      // }
      this.visible = false
      this.$refs.table.refresh(true)
    },
    // 点击关闭审核弹框
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.ant-checkbox-group {
  display: flex;
  flex-direction: column;
}
/deep/ .ant-space {
  width: 100%;
}
.check_function {
  margin-left: unset !important;
}
.btn {
  margin-right: 8px;
}
</style>
