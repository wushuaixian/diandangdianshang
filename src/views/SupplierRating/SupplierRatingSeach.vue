<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!--search -->
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供  应  商" prop="orgName">
                <!-- <a-select
                  show-search
                  :value="value"
                  placeholder="请输入内容"
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
                <a-input v-model="orgName" />
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
              <a-form-model-item label="定级方式">
                <d-select :options="storeType" v-model="selectGradingValue" @change="selectGrading"> </d-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="审批状态">
                <d-select :options="auditStatus" v-model="selectstateValue" @change="selectstate"> </d-select>
              </a-form-model-item>
            </a-col> -->
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
      <s-table
        v-if="(queryParam.platformId && queryParam.entityId) || $store.state.permission.isPlatform === 1"
        ref="table"
        name="SupplierRatingSeach"
        rowKey="id"
        :scroll="{ x: 1600 }"
        :columns="columns"
        :data="init"
      >
        <template slot="isAvailable" slot-scope="record">
          <a-switch v-model="record.isAvailable" @change="(checked) => handleUpdateStatus(checked, record)"></a-switch>
        </template>
        <template slot="createTime" slot-scope="record">{{
          record.createTime | moment('YYYY-MM-DD HH:mm:ss')
        }}</template>
        <template slot="operation" slot-scope="record">
          <a-space>
            <a @click="() => see(record)">查看</a>
            <a @click="() => handleEdit(record)">申请调级</a>
          </a-space>
        </template>
      </s-table>
    </a-card>

    <a-modal
      class="AA"
      title="申请调级"
      width="60%"
      ok-text="保存"
      ok-type="取消"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="submitModal"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="供应商：">
          <a-input v-model="form.orgName" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="最后一次得分：">
          <a-input v-model="form.totalScore" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="当前等级：">
          <a-input v-model="form.gradeName" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="定级方式：">
          <a-input v-model="form.storeTypeStr" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="指定级别：" prop="Proportion">
          <d-select @change="getVendorIdProportion" :options="listB" v-model="form.Proportion"> </d-select>
        </a-form-model-item>

        <a-form-model-item>
          <span slot="label"><span class="check">*</span>附件</span>
          <s-upload
            :accept="['image/bmp', 'image/jpg', 'image/png', 'image/jpeg', 'image/tiff']"
            action="/api/back-manage-web/myContract/uploadContractAccessory"
            class="bottom"
            name="file"
            :multiple="true"
            @aschange="handleChange"
            @remove="handleRemove"
          >
            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
            <div class="message">
              <div class="other">支持格式：bmp、tiff、gif、jpg、png、jpeg，图片大小不能超过4M</div>
            </div>
          </s-upload>
        </a-form-model-item>

        <a-form-model-item label="备注">
          <a-input v-model="form.desc" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  getSupplierScorePage,
  queryPurchaseGrade,
  queryOneToThree,
  getPlatCompanyInfo,
  getScoreDetail,
  adjustLevel
} from '@/api/SupplierSettings.js'
import { getComList } from '@/api/contract'
import { updateState } from '@/api/role.js'

export default {
  name: 'RoleManagement',
  data() {
    return {
      selectData: [],
      value: undefined,
      orgName: '',
      rules: {
        Proportion: [{ required: true, message: '必须项目不能为空', trigger: 'change' }],
        handleChangeURL: [{ required: true, message: '必须项目不能为空', trigger: 'change' }]
      },
      merchantList: [],
      parms: {
        scoreId: null,
        merchantId: null,
        totalScore: null,
        scoreType: 2,
        gradeId: null,
        futureGradeId: null,
        stampDTOS: [
          {
            url: null,
            name: null
          }
        ],
        remark: ''
      },
      selectGradingValue: '',
      selectstateValue: '',
      selectB: '',
      selectC: '',

      message: '',
      listA: [],
      listB: [],
      listC: [],
      storeType: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '自动'
        },
        {
          value: '2',
          label: '手动'
        }
      ],
      auditStatus: [
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
      PlatCompanyInfo: [],
      PurchaseGrade: [],
      OneToThree: [],
      headers: {
        authorization: 'authorization-text'
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },

      form: {
        desc: '',
        orgName: '',
        totalScore: '',
        gradeName: '',
        storeType: '',
        storeTypeStr: '',
        handleChangeURL: [],
        Proportion: ''
      },
      visible: false,
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
        { title: '供应商', dataIndex: 'orgName', width: 390, key: 'orgName' },
        { title: '主营品类', dataIndex: 'name', key: 'name' },
        { title: '企业性质', dataIndex: 'natureStr', key: 'natureStr' },
        { title: '静态评分', key: 'staticScore', dataIndex: 'staticScore' },
        { title: '动态评分', key: 'moveScore', dataIndex: 'moveScore' },
        { title: '店铺评分', key: 'storeScore', dataIndex: 'storeScore' },
        { title: '总分', key: 'totalScore', dataIndex: 'totalScore' },
        { title: '等级', key: 'gradeName', dataIndex: 'gradeName' },
        { title: '定级方式', key: 'storeTypeStr', dataIndex: 'storeTypeStr' },

        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'operation' }, width: 130 }
      ],
      visibleModal: false,
      confirmLoading: false,
      modalTitle: '添加角色',

      functionIds: [],
      addForm: {
        entityId: null,
        name: '',
        platformId: null,
        desc: '',
        isAvailable: true // 状态默认开启
      }
    }
  },

  created() {},
  mounted() {
    this.AJAX()
    // this.AJAX1()
    // this.AJAX()
    // vm.$refs.table.refresh(true)
  },
  methods: {
    selectChange(value) {
      this.value = value
    },
    async handleSearch(value) {
      if (!value) return
      const params = {
        platformId: 6,
        message: value
      }
      const res = await getPlatCompanyInfo(params)
      this.selectData = res.data.providerMerchantList
    },
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },
    async getComList(platformId) {
      const res = await getComList(platformId)
      if (res.code === '0') {
        this.merchantList = res?.data?.buyerMerchantList?.map((x) => {
          return {
            label: x?.orgName,
            value: x?.id
          }
        })
      }
    },
    /*
// 类目
 */ getVendorIdProportion(val) {
      this.parms.futureGradeId = val
    },
    async AJAX() {
      // const params = {
      //   platformId: 1,
      //   message: ''
      // }
      // const data1 = await getPlatCompanyInfo(params)
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
    /*
    // 等级
     */

    /*
    //供应商
    */
    see(row) {
      this.$router.push({ name: 'Summary', params: { id: row.id } })
    },
    async AJAX2() {
      const data = await getPlatCompanyInfo()

      this.PlatCompanyInfo = data
    },
    handleChange({ name, url }) {
      if (this.form.handleChangeURL.length >= 5) {
        this.$message.info('最多上传5个附件')
      } else {
        this.form.handleChangeURL.push({ name, url })
      }
    },
    handleRemove({ url, name }) {
      const index = this.form.handleChangeURL.findIndex((x) => x.url === url && x.name === name)
      this.form.handleChangeURL.splice(0, index)
    },
    handleCancel() {
      this.visible = false
    },

    supplierChangelistB(value) {
      this.selectB = value
    },
    supplierChangelistC(value) {
      this.selectC = value
    },
    selectGrading(value) {
      this.selectGradingValue = value
    },
    selectstate(value) {
      this.selectstateValue = value
    },

    async init(pagination) {
      const params = {
        ...pagination,
        // 兴祥说这个参数没用
        // message: this.message,

        orgName: this.orgName,
        gradeId: this.selectB,
        categoryId: this.selectC,
        // auditStatus: this.selectstateValue === '' ? null : this.selectstateValue,
        storeType: this.selectGradingValue === '' ? null : Number(this.selectGradingValue)
      }

      const AAPromise = await getSupplierScorePage({ ...params })
      AAPromise.data.listObj.forEach((item) => {
        if (item.isAvailable === 0) {
          item.isAvailable = false
        } else {
          item.isAvailable = true
        }
      })

      return AAPromise
    },

    handleReset() {
      this.orgName = ''
      this.value = ''
      this.message = ''
      this.selectB = ''
      this.selectC = ''
      this.selectGradingValue = ''
      this.selectstateValue = ''
      this.selectData = []
      this.$refs.table.refresh(true)
    },
    submitModal() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.form.handleChangeURL.length <= 0) {
            this.$message.info('请上传附件')
            return
          }
          this.parms.stampDTOS = this.form.handleChangeURL
          adjustLevel(this.parms).then((res) => {
            if (res.code === '0') {
              this.$message.success('保存成功')
              this.visible = false
            }
          })
        }
      })

      // this.handleChangeURL
    },

    async handleEdit(row) {
      this.form.orgName = ''
      this.form.totalScore = ''
      this.form.gradeName = ''
      this.form.storeType = ''
      this.form.storeTypeStr = ''
      this.form.handleChangeURL = []
      this.parms.remark = ''
      this.form.Proportion = ''

      const params = {
        id: row.id
      }
      this.visible = true
      this.parms.scoreId = row.id
      this.parms.merchantId = row.merchantId
      this.parms.totalScore = row.totalScore
      this.parms.scoreType = row.scoreType
      this.parms.gradeId = row.gradeId

      this.parms.remark = this.form.desc

      const { data } = await getScoreDetail(params)
      this.form.orgName = data.orgName
      this.form.totalScore = data.totalScore
      this.form.gradeName = data.gradeName
      this.form.storeType = data.storeType
      this.form.storeTypeStr = data.storeTypeStr
    },

    handleUpdateStatus(checked, row) {
      const params = {
        id: row.id,
        entityId: row.entityId,
        isAvailable: checked === true ? 1 : 0
      }
      updateState(params).then((res) => {
        if (res.code === '0' || res.code === 0) {
          this.$message.success('状态更新成功')
        }
      })
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
.check {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.message {
  margin-top: 10px;
}
</style>
