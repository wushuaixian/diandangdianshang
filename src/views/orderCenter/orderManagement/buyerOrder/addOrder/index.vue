<template>
  <div class="addOrder">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="icon-box"><img class="logo" :src="item.logo" alt="" /></div>
      <div class="title">
        {{ item.name }}
        <span class="text" v-text="item.name"></span>
      </div>
      <a-button type="primary" class="btn" @click="GoAdd(item)">点击进入</a-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: '计划导入', logo: require('@/assets/images/order/plan.png'), purchaseOrderSource: 1 },
        { name: '项目导入', logo: require('@/assets/images/order/project.png'), purchaseOrderSource: 3 },
        { name: '合同导入', logo: require('@/assets/images/order/contract.png'), purchaseOrderSource: 4 },
        { name: '手工创建', logo: require('@/assets/images/order/default.png'), purchaseOrderSource: 5 }
      ]
    }
  },
  methods: {
    GoAdd(item) {
      this.$router.push({
        name: 'orderManagementAddBuyerOrder',
        query: { purchaseOrderSource: item.purchaseOrderSource }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.addOrder {
  background: #ffffff;
  border-radius: 8px;
  padding: 32px 16px;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 114px);
  .item {
    background: #ffffff;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 16px;
    width: 240px;
    height: 306px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    &:hover {
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
    }
    .icon-box {
      width: 80px;
      height: 80px;
      background: rgba(255, 176, 119, 0.1);
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: -3px 4px 6px 3px rgba(255, 103, 1, 0.2) inset, -2px 8px 8px rgba(255, 103, 1, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      .logo {
        margin-top: 2px;
        width: 40px;
        height: 40px;
      }
    }
    .title {
      font-family: PingFangSC-Semibold;
      font-weight: bold;
      font-size: 24px;
      color: rgba(0, 0, 0, 0);
      line-height: 24px;
      position: relative;
      margin-top: 22px;
      .text {
        color: #262626;
        display: block;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        left: 0;
        bottom: 0;
      }
      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 6px;
        background: #ee702e;
        position: absolute;
        bottom: 0;
      }
    }
    .btn {
      margin-top: 48px;
      width: 100px;
      height: 32px;
    }
  }
}
</style>
