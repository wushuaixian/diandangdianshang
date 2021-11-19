<template>
  <div>
    <div class="tabs">
      <a-tabs type="card" :activeKey="tabsKey" @change="callback">
        <!-- v-if="$hasPlatform(IS_PURCCHASEERS)"  判断商家类型 -->
        <a-tab-pane key="1" tab="工商信息">
          <Business></Business>
        </a-tab-pane>
        <a-tab-pane key="2" tab="财务信息">
          <Finance />
        </a-tab-pane>
        <a-tab-pane key="3" tab="经营品类" v-if="$hasSuppliers()">
          <Category />
        </a-tab-pane>
        <a-tab-pane key="4" tab="企业概况" v-if="$hasSuppliers()">
          <Comprofile></Comprofile>
        </a-tab-pane>
        <a-tab-pane key="5" tab="资质证书" v-if="$hasSuppliers()">
          <Certificate />
        </a-tab-pane>
        <a-tab-pane key="6" tab="联系人信息">
          <LinkmanInfo></LinkmanInfo>
        </a-tab-pane>
        <a-tab-pane key="7" tab="发票信息">
          <Invoice></Invoice>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import Business from './business.vue'
import Finance from './finance.vue'
import Comprofile from './comprofile.vue'
import Certificate from './certificate.vue'
import { IS_SUPPLIERS } from '@/store/platform-types'
import LinkmanInfo from './linkmanInfo.vue'
import Category from './category.vue'
import Invoice from './Invoice.vue'
export default {
  components: {
    Business: Business,
    Finance: Finance,
    Comprofile,
    Certificate,
    LinkmanInfo,
    Category,
    Invoice
  },
  data() {
    return {
      IS_SUPPLIERS,
      tabsKey: '1'
    }
  },

  mounted() {
    if (this.$route.query.tabsKey) {
      this.tabsKey = this.$route.query.tabsKey + ''
    }
  },
  methods: {
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
.tabs::before {
  content: '*';
  display: inline-block;
  left: 140px;
  position: relative;
  top: 40px;
  z-index: 1000;
  color: #ff1515;
}
</style>
