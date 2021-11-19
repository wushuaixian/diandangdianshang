<template>
  <div class="tabs">
    <a-tabs type="card" :activeKey="tabsKey" @change="callback">
      <a-tab-pane key="1" tab="工商信息">
        <TheBusiness :edit="edit" :businessDetail="info" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="财务信息">
        <TheFinance
          v-if="$route.params.id"
          :edit="edit"
          :merchantId="$route.params.id"
          :data="info.financeInfoPO || {}"
        />
      </a-tab-pane>
      <a-tab-pane key="3" tab="经营品类" v-if="departmentType === '1'">
        <TheCategory :edit="edit" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="企业概况" v-if="departmentType === '1'">
        <TheComprofile :edit="edit" :form="info.enterpriseBasicCertifyInfoVO" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="资质证书" v-if="departmentType === '1'">
        <TheCertificate v-if="$route.params.id" :merchantId="$route.params.id" :edit="edit" />
      </a-tab-pane>
      <a-tab-pane key="6" tab="联系人信息">
        <TheLinkmanInfo
          v-if="$route.params.id"
          :merchantId="$route.params.id"
          :edit="edit"
          :list="info.contactsInfoPOS"
        />
      </a-tab-pane>
      <!-- <a-tab-pane key="7" tab="认证套餐">
        <ThePackList :list="info.contactsInfoPOS" />
      </a-tab-pane> -->
      <!-- <a-tab-pane key="8" tab="认证信息" v-if="$$(info, 'authStatus') === '1' && v-if="departmentType === '1'"">
        <TheAuthInfo :edit="edit" />
      </a-tab-pane> -->
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
  TheAuthInfo
} from './components'
import { getBusinessDetail } from '@/api/enterprise'
export default {
  components: {
    TheBusiness,
    TheFinance,
    TheCategory,
    TheComprofile,
    TheCertificate,
    TheLinkmanInfo,
    ThePackList,
    TheAuthInfo
  },
  data() {
    return {
      tabsKey: '1',
      info: {},
      edit: this.$route?.params?.edit !== '1',
      departmentType: this.$route?.params?.departmentType
    }
  },

  mounted() {
    if (this.$route.query.tabsKey) {
      this.tabsKey = this.$route.query.tabsKey + ''
    }
    this.getMerchantOrgInfoDetailByOrgId()
  },
  methods: {
    async getMerchantOrgInfoDetailByOrgId() {
      const { id } = this.$route?.params
      const res = await getBusinessDetail({ merchantId: id })
      if (res.code === '0') {
        this.info = res.data
      }
    },
    callback(e) {
      this.tabsKey = e
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
.class-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .save-btn {
    margin-right: 20px;
  }
}
</style>
