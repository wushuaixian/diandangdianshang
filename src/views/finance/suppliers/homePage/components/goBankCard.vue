<template>
  <div id="goBackCard">
    <a-modal title="提示" :visible="visible" :footer="null" @cancel="handleCancel" :closable="false">
      <div></div>
      <div class="finance">银行账户未完善, 请前往<span class="text">企业信息-财务信息</span>完善相关信息</div>
      <p class="foot">
        <router-link :to="{ name: 'Enterprise', query: { tabsKey: '2' } }">
          <a-button type="primary">去完善</a-button>
        </router-link>
      </p>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {}
  },
  methods: {
    go() {
      this.$router.push({
        name: 'Enterprise',
        query: {
          tabsKey: 2
        }
      })
    },
    handleCancel() {}
  }
}
</script>
<style lang="less" scoped>
.go {
  color: #ff6b00;
  cursor: pointer;
}
.close {
  width: 100%;
  text-align: right;
}
.finance {
  padding: 20px 50px;
  text-align: center;
  .text {
    color: #ff6b00;
  }
}
.foot {
  text-align: center;
}
</style>
<style lang="less">
</style>
