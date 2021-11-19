<template>
  <div class="tabs">
    <a-tabs type="card" :activeKey="tabsKey" @change="callback">
      <a-tab-pane key="1" tab="工商信息">
        <TheBusiness :businessDetail="info" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="财务信息">
        <TheFinance :data="$$(info, 'financeInfoPO')" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="联系人">
        <TheLinkmanInfo :list="info.contactsInfoPOS" />
      </a-tab-pane>
      <a-tab-pane key="9" tab="发票信息">
        <TheInvoice />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { TheBusiness, TheFinance, TheLinkmanInfo, TheInvoice } from '../../suppliers/manage/components'
import { getMerchantOrgInfoDetailByOrgId } from '@/api/manage'
export default {
  components: {
    TheBusiness,
    TheFinance,
    TheLinkmanInfo,
    TheInvoice
  },
  data() {
    return {
      tabsKey: '1',
      info: {}
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
      const { id } = this.$route.params
      const res = await getMerchantOrgInfoDetailByOrgId({ id })
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
</style>
