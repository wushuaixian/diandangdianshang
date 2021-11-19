<template>
  <div class="qualificationCertificate">
    <div class="content">
      <div class="title">
        <div class="icon"></div>
        <div class="text">资质证书</div>
      </div>
    </div>
    <!-- <header-title>
      <span>资质证书</span>
    </header-title> -->
    <div class="addQualifications" v-if="isSubmit">
      <a-button type="primary" @click="handleAdd">添加资质</a-button>
    </div>
    <s-table
      ref="table"
      name="qualificationCertificateTable"
      rowKey="id"
      :columns="columns"
      :scroll="{ x: 1600 }"
      :data="init"
    >
      <template slot="authStatus" slot-scope="text">
        <span v-show="text.certificationStatus == 0">未认证</span>
        <span v-show="text.certificationStatus == 1">已认证</span>
        <span v-show="text.certificationStatus == 2">
          认证不通过
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text.authReason }}</span>
            </template>
            <a-icon type="question-circle" placement="top" />
          </a-tooltip>
        </span>
      </template>
      <template slot="certificate" slot-scope="text">
        <ImagePreview :width="40" :height="40" :value="$$(text, 'certificateUrl')" />
      </template>
      <template slot="issueBeginTime" slot-scope="text">
        <span>{{ text.issueBeginTime | moment }}</span>
      </template>
      <template slot="issueEndTime" slot-scope="text">
        <span>{{ text.issueEndTime | moment }}</span>
      </template>
      <template slot="operation" slot-scope="text">
        <div class="operations" v-if="isSubmit">
          <span style="color: #1890ff" @click="edit(text)" v-if="text.certificationStatus === '0'">编辑</span>
          <span style="color: #1890ff" @click="deleteQualifications(text.id)">删除</span>
          <span style="color: #1890ff" @click="authentication(text.id)" v-if="text.certificationStatus === '0'">
            认证
          </span>
        </div>
      </template>
    </s-table>
    <!-- <AddPopup
      :addPopupvisible="addPopupvisible"
      @close="addPopupvisible = false"
      @addQualifications="addQualifications"
    /> -->
    <Addcreat
      :certificationStatus="1"
      :type="type"
      :merchantId="merchantId"
      :info="info"
      v-if="isShowAddCert"
      :visible="visible"
      @update="handleRefresh"
      @close="closeAddCert"
    />
    <ExaminePopup :popupStatus.sync="popupStatus" @submitExamine="submitAuth" />
  </div>
</template>
<script>
import {
  qualificationCertificate,
  addQualifications,
  deleteQualifications,
  updateQualifications,
  getMerchantOrgInfoDetail
} from '@/api/supplieAuthAdmin'
// import authPopup from './authPopup'
import Addcreat from '@/views/enterprise/compontents/addcreat.vue'
// import { formatDate } from '@/utils/util'
import { ImagePreview, ExaminePopup } from '@/components/'
import AddPopup from './AddPopup'
import moment from 'moment'
export default {
  components: {
    AddPopup,
    ImagePreview,
    Addcreat,
    ExaminePopup
  },
  data() {
    return {
      form: {},
      type: '',
      visible: false,
      isShowAddCert: false,
      info: {},
      popupStatus: false,
      addPopupvisible: false,
      editData: {},
      merchantId: this.$route.params.id,
      columns: [
        {
          title: '资质类型',
          dataIndex: 'certificateType',
          width: 150,
          key: 'qualificationsType'
        },
        {
          title: '证书编号',
          width: 120,
          dataIndex: 'certificateNumber',
          key: 'certificatNumber'
        },
        {
          title: '颁发机构',
          width: 120,
          dataIndex: 'issueAuthority',
          key: 'issuingAuthority'
        },
        {
          title: '颁发日期',
          scopedSlots: { customRender: 'issueBeginTime' },
          width: 120,
          key: 'issuingDate'
        },
        {
          title: '有效期至',
          scopedSlots: { customRender: 'issueEndTime' },
          width: 120,
          key: 'validity'
        },
        {
          title: '证书附件',
          key: 'certificate',
          width: 100,
          scopedSlots: { customRender: 'certificate' }
        },
        {
          title: '认证状态',
          width: 100,
          key: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  computed: {
    isSubmit() {
      return !['2', '3'].includes(this.form?.authStatus)
    }
  },
  mounted() {
    this.getMerchantOrgInfoDetail()
  },
  methods: {
    async getMerchantOrgInfoDetail() {
      const { merchantId: orgId } = this
      const res = await getMerchantOrgInfoDetail({ orgId })
      if (res.code === '0') {
        this.form = res.data
      }
    },
    closeAddCert() {
      this.info = null
      this.visible = false
      setTimeout(() => {
        this.isShowAddCert = false
      }, 300)
    },
    addQualifications(params) {
      const { merchantId } = this
      addQualifications({ ...params, merchantId }).then((res) => {})
    },
    async init(params) {
      const { query, merchantId } = this
      var data = {
        ...params,
        ...query,
        merchantId
      }
      return qualificationCertificate({ ...data })
    },
    handleRefresh() {
      this.$refs.table.refresh(true)
    },
    // 1 添加 2 编辑
    deleteQualifications(id) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: async () => {
          deleteQualifications({ id }).then((res) => {
            if (res.code === '0') {
              this.$message.success('删除成功')
              this.$refs.table.refresh(true)
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    updateQualifications(params) {
      updateQualifications({ ...params }).then((res) => {
        if (res.code === '0') {
          this.$message.success('操作成功')
          this.$refs.table.refresh(true)
        }
      })
    },
    handleAdd() {
      this.visible = true
      this.isShowAddCert = true
    },
    edit(editData) {
      this.info = {
        ...editData,
        issueBeginTime: editData.issueBeginTime ? moment(editData.issueBeginTime) : null,
        issueEndTime: moment(editData.issueEndTime)
      }
      this.visible = true
      this.isShowAddCert = true
      this.type = 'edit'
      console.log(editData)
      // this.addcreatStatus = 2
      // this.editData = editData
      // this.addPopupvisible = true
    },
    authentication(id) {
      // this.updateQualifications(params)
      this.id = id
      this.popupStatus = true
    },
    submitAuth(status, value) {
      this.updateQualifications({ authReason: value, id: this.id, certificationStatus: status })
    }
  }
}
</script>
<style lang='less' scoped>
.qualificationCertificate {
  width: 100%;
  .title {
    span:first-child {
      background-image: linear-gradient(-180deg, #ff8323 0%, #ff663e 100%);
      border-radius: 2px;
      width: 2px;
    }
  }
  .addQualifications {
    height: 32px;
    margin-bottom: 16px;
    .addQualificationsButton {
      background: #ff6b00;
      border-radius: 2px;
      color: #ffffff;
      &:hover {
        color: #ffffff;
      }
    }
  }
}
.content {
  background: #fff;
  border-radius: 8px;
  margin: 20px 0;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: solid 1px #e5e5e5;
    padding-bottom: 8px;
    .icon {
      background-image: linear-gradient(-179deg, #ff8720 0%, #ff6241 100%);
      border-radius: 2px;
      height: 16px;
      width: 4px;
    }
    .text {
      margin-left: 8px;
      font-size: 16px;
      color: #262626;
      line-height: 20px;
      font-weight: bold;
    }
  }
}

.operations {
  span:nth-child(3) {
    margin-left: 10px;
  }
  span:nth-child(2) {
    margin-left: 10px;
  }
  span:hover {
    cursor: pointer;
  }
}
</style>
