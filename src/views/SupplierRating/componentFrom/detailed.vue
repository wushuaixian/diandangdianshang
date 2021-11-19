<template>
  <div>
    <a-card title="评分汇总">
      <!-- <span slot="extra"> 供应商信息</span> -->
      <a-card-grid style="width: 50%; height: 380px; text-align: left">
        <p>供应商信息</p>
        <p>供应商名称：{{ supplier.orgName }}</p>
        <p>申请前等级：{{ supplier.gradeName }}</p>
        <p>最后一次得分：：{{ supplier.totalScore }}</p>
        <p v-if="examineDetails">最后一次操作人：{{ supplier.updateUsername }}</p>
        <p v-if="examineDetails">最后一次操作人时间: {{ supplier.updateTime | moment('YYYY-MM-DD HH:mm:ss') }}</p>
        <p v-if="examineDetails">评分周期：{{ supplier.yearMonthStr }}</p>
        <!-- <p v-if="Details">状态：{{ supplier.yearMonthStr }}</p> -->
        <p v-if="Details">申请调整等级：{{ supplier.futureGradeName }}</p>
        <div v-if="Details" class="downLoad">
          <p class="label-name">附件：</p>
          <div class="content-box">
            <p v-for="(item, index) in supplier.stampDTOS" :key="index">
              <a @click="downLoad(item)"> {{ item.name }}</a>
            </p>
          </div>
        </div>
        <p v-if="Details">审核状态：{{ supplier.auditStatusStr }}</p>
        <p v-if="Details">备注：{{ supplier.message }}</p>
      </a-card-grid>
      <a-card-grid style="width: 50%; height: 380px; text-align: left" :hoverable="false">
        <p>静态得分：{{ supplier.staticScore }}</p>
        <p>动态得分：{{ supplier.moveScore }}</p>
        <p>店铺得分：{{ supplier.storeScore === null ? 0 : supplier.storeScore }}</p>
        <p>最终得分: {{ supplier.totalScore }}</p>
        <p v-if="examineDetails">评分周期：{{ supplier.yearMonthStr }}</p>
        <!-- <p>等级：{{ supplier.gradeName }}</p> -->
        <img style="height: 80px" :src="supplier.url" alt="" />
        <div v-if="Abutton" style="margin-top: 10px">
          <a-button @click="link">导出所有得分明细</a-button>
          <a-button style="margin-left: 20px" @click="adjustment">申请调级</a-button>
        </div>
      </a-card-grid>
    </a-card>
    <a-card>
      <a-tabs default-active-key="1" @change="back">
        <a-tab-pane key="1" tab="静态评分"> </a-tab-pane>
        <a-tab-pane key="2" tab="动态评分"> </a-tab-pane>
        <a-tab-pane key="3" tab="店铺评分"> </a-tab-pane>
      </a-tabs>
      <s-table
        ref="table"
        name="AAmyTables"
        :rowKey="
          (record, index) => {
            return index
          }
        "
        :columns="columns"
        :isCanFilter="false"
        :data="init"
      >
        <div slot="name" slot-scope="text, item">
          <a href=" javascript: void ( 0 ); ">{{ item.name }} </a>
        </div>
      </s-table>
      <a-button @click="comeBack" style="margin-top: 20px"> 返回</a-button>
    </a-card>
    <a-modal
      class="AA"
      title="申请调级"
      width="60%"
      ok-text="保存"
      ok-type="取消"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="submitModal"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :rules="rules" :model="supplier" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="供应商：">
          <a-input v-model="supplier.orgName" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="最后一次得分：">
          <a-input v-model="supplier.totalScore" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="当前等级：">
          <a-input v-model="supplier.gradeName" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="定级方式：">
          <a-input v-model="supplier.scoreTypeStr" disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="指定级别：" prop="futureGradeId">
          <d-select @change="getVendorIdProportion" :options="listB" v-model="supplier.futureGradeId"> </d-select>
        </a-form-model-item>

        <a-form-model-item label="附件" prop="stampDTOS">
          <s-upload
            action="/api/back-manage-web/myContract/uploadContractAccessory"
            class="bottom"
            name="file"
            @aschange="handleChange"
            v-model="supplier.stampDTOS"
          >
            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
          </s-upload>
          <p>支持格式：bmp、tiff、gif、jpg、png、jpeg，图片大小不能超过4M</p>
        </a-form-model-item>

        <a-form-model-item label="备注">
          <a-input v-model="parms.remark" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <appdflow-progress ref="progress" type-code="supplier_score" :biz-code="$route.params.id" />
  </div>
</template>

<script>
import { postMonthScoreDetai, adjustLevel, queryPurchaseGrade, getScoreAuditDetail } from '@/api/SupplierSettings.js'
// import MyTable from './tableS'
export default {
  name: 'RoleManagement',
  components: {},
  data() {
    return {
      Details: false,
      examineDetails: false,
      Abutton: false,
      listB: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      confirmLoading: false,
      parms: {
        scoreId: null,
        merchantId: null,
        totalScore: null,
        scoreType: 2,
        gradeId: null,
        futureGradeId: null,
        stampDTOS: '',
        remark: ''
      },
      form: {
        desc: '',
        orgName: '',
        totalScore: '',
        gradeName: '',
        storeType: '',
        storeTypeStr: ''
      },
      visible: false,
      backTabs: '1',
      supplier: {
        message: '',
        auditStatusStr: '',
        orgName: '',
        gradeName: '',
        totalScore: '',
        updateUsername: '',
        futureGradeName: '',
        currentGradeName: '',
        updateTime: '',
        yearMonthStr: '',
        staticScore: '',
        storeScore: '',
        scoreTypeStr: '',
        stampDTOS: '',
        staticScoreDetail: [],
        moveScoreDetail: [],
        storeScoreDetail: [],
        remark: ''
      },
      datainit: [],
      rules: {
        futureGradeId: [{ required: true, message: '必须项目不能为空', trigger: 'change' }],
        stampDTOS: [{ required: true, message: '必须项目不能为空', trigger: 'change' }]
      },

      columns: [
        {
          title: '得分项',
          // dataIndex: 'yearMonthStr',
          key: 'name',
          // scopedSlots: { customRender: 'name' }
          dataIndex: 'name'
        },
        {
          title: '值',
          dataIndex: 'value',
          key: 'value'
        },
        {
          title: '得分',
          dataIndex: 'score',
          key: 'score'
        }
      ]
    }
  },
  created() {},
  async mounted() {
    // this.init()
    const data2 = await queryPurchaseGrade()
    this.listB = data2.data.listObj.map((item) => {
      item.value = item.id
      item.label = item.name
      return item
    })

    if (this.$route.params.seach === '1') {
      this.Abutton = true
      this.Details = false
      this.examineDetails = true
    } else {
      this.Abutton = false
      this.Details = true
      this.examineDetails = false
    }
    // vm.$refs.table.refresh(true)
  },
  methods: {
    // async AuditListOfSupplierPromotionLink(params) {
    //   const { data } = await getScoreAuditDetail(params)
    //   this.supplier.orgName = data.orgName
    //   this.supplier.gradeName = data.currentGradeName
    //   this.supplier.totalScore = data.totalScore
    //   this.supplier.futureGradeName = data.futureGradeName
    //   this.supplier.auditStatusStr = data.auditStatusStr
    //   this.supplier.message = data.message
    //   this.supplier.staticScore = data.staticScore
    //   this.supplier.moveScore = data.moveScore
    //   this.supplier.storeScore = data.storeScore
    //   this.supplier.totalScore = data.totalScore
    //   this.supplier.stampDTOS = data.stampPOS
    //   this.supplier.staticScoreDetail = data.staticScoreDetail
    //   this.supplier.moveScoreDetail = data.moveScoreDetail
    //   this.supplier.storeScoreDetail = data.storeScoreDetail
    // },
    async link() {
      const response = await fetch(
        `/api/back-manage-web/audit/exportScoreItem?exportType=${this.backTabs}&id=${parseInt(this.$route.params.id)}`
      )
      // const  data1 = await exportScoreItem()
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = '导出所有得分明细.xlsx'
      a.click()
      a.remove()
    },
    adjustment() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    getVendorIdProportion(val) {
      this.parms.futureGradeId = val
    },

    handleChange(info) {
      this.parms.stampDTOS = [
        {
          name: info.name,
          url: info.url
        }
      ]
      this.handleChangeURL = info
    },
    submitModal() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.parms.scoreId = Number(this.$route.params.id)
          adjustLevel(this.parms).then((res) => {
            if (res.code === '0') {
              this.$message.success('保存成功')
              this.visible = false
            }
          })
        } else {
          this.$message.error('必填项目不能为空')
          return false
        }
      })

      // this.handleChangeURL
    },
    comeBack() {
      this.$router.go(-1)
    },
    back(value) {
      if (value === '0') {
        value = null
      }
      this.backTabs = value

      // this.query.auditStatus = value
      this.$refs.table.refresh(true)
    },
    yearMonthStr(item) {
      this.$router.push({
        name: '',
        params: {
          id: item.id
        }
      })
    },
    async init(params) {
      const res = {
        ...params,
        id: parseInt(this.$route.params.id)
      }
      let data = null
      let arrData = []
      if (this.$route.params.seach === '1') {
        data = await postMonthScoreDetai({ ...res })

        this.supplier.orgName = data.data.orgName
        this.supplier.gradeName = data.data.gradeName
        this.supplier.totalScore = data.data.totalScore
        this.supplier.staticScore = data.data.staticScore
        this.supplier.updateUsername = data.data.updateUsername
        this.supplier.updateTime = data.data.updateTime
        this.supplier.moveScore = data.data.moveScore
        this.supplier.yearMonthStr = data.data.yearMonthStr
        this.supplier.storeScore = data.data.storeScore
        this.supplier.url = data.data.gradeUrl
        this.parms.merchantId = data.data.merchantId
        this.parms.gradeId = data.data.gradeId
        console.log(this.supplier.url)
        this.supplier.scoreTypeStr = data.data.scoreTypeStr

        if (this.backTabs === '1') {
          arrData = JSON.parse(data.data.staticScoreDetail) || []
        } else if (this.backTabs === '2') {
          arrData = JSON.parse(data.data.moveScoreDetail) || []
        } else {
          arrData = JSON.parse(data.data.storeScoreDetail) || []
        }
      } else {
        const params = {
          id: this.$route.params.id
        }

        const { data } = await getScoreAuditDetail(params)
        this.supplier.orgName = data.orgName
        this.supplier.gradeName = data.currentGradeName
        this.supplier.totalScore = data.totalScore
        this.supplier.futureGradeName = data.futureGradeName
        this.supplier.auditStatusStr = data.auditStatusStr
        this.supplier.message = data.message
        this.supplier.staticScore = data.staticScore
        this.supplier.moveScore = data.moveScore
        this.supplier.storeScore = data.storeScore
        this.supplier.totalScore = data.totalScore
        this.supplier.stampDTOS = data.stampPOS
        this.supplier.url = data.gradeUrl
        this.supplier.staticScoreDetail = data.staticScoreDetail
        this.supplier.moveScoreDetail = data.moveScoreDetail
        this.supplier.storeScoreDetail = data.storeScoreDetail
        console.log(data)
        if (this.backTabs === '1') {
          arrData = JSON.parse(this.supplier.staticScoreDetail) || []
        } else if (this.backTabs === '2') {
          arrData = JSON.parse(this.supplier.moveScoreDetail) || []
        } else {
          arrData = JSON.parse(this.supplier.storeScoreDetail) || []
        }
      }
      // staticScoreDetail

      // console.log(data, 'data')
      // this.datainit = data.data.cycleVOS

      const result = {
        data: {
          listObj: arrData,
          total: arrData.length
        }
      }

      return result
    },
    // 附件下载
    async downLoad(e) {
      const response = await fetch(e.url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = e.name
      a.click()
      a.remove()
    }
  }
}
</script>

<style scoped lang="less">
.downLoad {
  display: flex;
  .label-name {
    width: 42px;
  }
  .content-box {
    flex: 1;
    max-width: calc(100% - 42px);
    a {
      display: inline-block;
      max-width: 100%;
      word-wrap: break-word;
    }
  }
}
</style>
