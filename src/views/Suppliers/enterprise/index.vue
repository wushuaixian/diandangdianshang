<template>
  <div>
    <div class="tabs">
      <a-tabs type="card"
              change="callback">
        <a-tab-pane key="1"
                    tab="工商信息">
          <Business></Business>
        </a-tab-pane>
        <a-tab-pane key="2"
                    tab="财务信息">
          <Finance></Finance>
        </a-tab-pane>
        <a-tab-pane key="4"
                    tab="企业概况">
          <Comprofile></Comprofile>
        </a-tab-pane>
        <a-tab-pane key="5"
                    tab="联系人信息">
          <LinkmanInfo></LinkmanInfo>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import Business from './business.vue'
import Finance from './finance.vue'
import Comprofile from './comprofile.vue'
import LinkmanInfo from './linkmanInfo.vue'
export default {
  components: {
    Business: Business,
    Finance: Finance,
    Comprofile,
    LinkmanInfo
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    callback(e) {}
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
