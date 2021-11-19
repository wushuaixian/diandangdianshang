<template>
  <div class="tabs">
    <a-tabs type="card" :activeKey="tabsKey" @change="callback">
      <a-tab-pane key="1" tab="工商信息">
        <TheBusiness ref="TheBusiness" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="财务信息">
        <TheFinance :data="$$(info, 'financeInfoPO')" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="经营品类">
        <TheCategory />
      </a-tab-pane>
      <a-tab-pane key="4" tab="企业概况">
        <TheComprofile :form="info.enterpriseBasicCertifyInfoVO" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="资质证书">
        <TheCertificate />
      </a-tab-pane>
      <a-tab-pane key="6" tab="联系人信息">
        <TheLinkmanInfo :list="info.contactsInfoPOS" />
      </a-tab-pane>
      <a-tab-pane key="7" tab="认证套餐">
        <ThePackList />
      </a-tab-pane>
      <a-tab-pane key="8" tab="验厂信息" v-if="$$(info, 'auditStatus') === '1'">
        <TheAuthInfo :scrollTop="scrollTop" />
      </a-tab-pane>
      <a-tab-pane key="9" tab="发票信息">
        <TheInvoice />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import {
  TheBusiness,
  TheFinance,
  TheCategory,
  TheComprofile,
  TheCertificate,
  TheLinkmanInfo,
  ThePackList,
  TheAuthInfo,
  TheInvoice
} from './components'
import { getMerchantOrgInfoDetailByOrgId } from '@/api/manage'
import { ExamineDetails, submitExamine } from '@/api/accessAudit'
import _ from 'loadsh'
export default {
  components: {
    TheBusiness,
    TheFinance,
    TheCategory,
    TheComprofile,
    TheCertificate,
    TheLinkmanInfo,
    ThePackList,
    TheAuthInfo,
    TheInvoice
  },
  data() {
    return {
      tabsKey: '1',
      info: {},
      scrollTop: null
    }
  },

  mounted() {
    if (this.$route.query.tabsKey) {
      this.tabsKey = this.$route.query.tabsKey + ''
    }
    this.getMerchantOrgInfoDetailByOrgId()
    window.addEventListener('scroll', this.scrollHander, true)
    // this.ExamineDetails()
    this.submitExamine = _.debounce(this.submitExamine, 500)
    this.$refs.TheBusiness.ExamineDetails()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHander)
  },
  methods: {
    scrollHander() {
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        document.querySelector('.ant-pro-basicLayout-content').scrollTop
    },
    async getMerchantOrgInfoDetailByOrgId() {
      const { id } = this.$route.query
      // console.log(this.$route)
      const res = await getMerchantOrgInfoDetailByOrgId({ id })
      if (res.code === '0') {
        this.info = res.data
      }
    },
    callback(e) {
      this.tabsKey = e
    },
    async submitExamine(auditStatus, auditReason) {
      const ids = [this.$route.query?.id]
      const res = await submitExamine({ ids, auditStatus, auditReason })
      if (res.success) {
        this.$message.success('审核成功')
        this.popupStatus = false
        this.$router.go(-1)
      }
    },
    ExamineDetails() {
      const that = this
      ExamineDetails({ orgId: this.$route.query.id }).then((res) => {
        that.data1 = res.data[0]
        that.ruleForm.enterpriseName = this.data1.enterpriseName
        that.data2 = res.data[1]
        this.ruleForm = { ...that.data1 }
        this.ruleForm.registrationSplicing =
          that.data1.registeredProvinceName + that.data1.registeredCityName + that.data1.registeredRegionName
        this.registrationSplicing2 = `${that.data2?.registeredProvinceName || ''}${
          that.data2?.registeredCityName || ''
        }${that.data2?.registeredRegionName || ''}`
        that.$refs.DetailForm.validate()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tabs {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 40px;
}
/deep/.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
  height: 50px;
}
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  height: 50px;
  padding: 0 30px;
  line-height: 50px;
  font-weight: 600;
}
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  border-top: 2px solid #ff6b00;
  height: 50px;
  color: #ff6b00;
}
</style>
