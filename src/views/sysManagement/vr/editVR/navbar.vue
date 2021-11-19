<template>
  <div class="navbar">
    <div>
      <img class="navBack" :src="require('@/assets/images/vr/fanhui.svg')" @click="goback" alt="" srcset="" />
      <span class="navTitle">{{ data.manufacturerName }}</span>
    </div>
    <!-- <a-icon type="close-square" style="font-size: 22px" @click="$router.go(-1)" /> -->
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { closeProduction } from '@/api/vr'
export default {
  components: {
    closeProduction
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    async goback() {
      const pramas = {
        productionId: this.data.productionId
      }
      const res = await closeProduction(pramas)
      if (res.success === true) {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 66px;
  padding: 0 20px;
  background: #ffffff;
  color: #333;
  .navTitle {
    float: right;
    margin-left: 20px;
    line-height: 24px;
    font-size: 18px;
  }
  .navBack {
    cursor: pointer;
  }
}
</style>
