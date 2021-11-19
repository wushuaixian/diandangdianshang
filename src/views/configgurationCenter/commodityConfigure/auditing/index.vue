
<template>
  <a-card>
    <div class="appeal-manage-list">
      <a-tabs :default-active-key="activated">
        <a-tab-pane key="1" tab="平台维度"> <Category /> </a-tab-pane>
        <a-tab-pane key="2" tab="类目维度"> <Platform /> </a-tab-pane>
        <a-tab-pane key="3" tab="供应商维度"> <Supplier /> </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import Category from './category/index.vue'
import Platform from './platform/index.vue'
import Supplier from './supplier/index.vue'

export default {
  components: { Category, Platform, Supplier },
  data() {
    return {
      activated: '1'
    }
  },
  created() {
    this.activated = this.$route.params.activated || '2'
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}
</style>
