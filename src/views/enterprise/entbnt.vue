<template>
  <div class="btnBottom">
    <a-button class="btnLeft" size="large"> 取消 </a-button>
    <a-button class="btnRight" size="large" type="primary"> 保存 </a-button>
  </div>
</template>

<script>
export default {
  props: {
    titleName: {
      type: String,
      default: '信息'
    }
  }
}
</script>

<style lang="less" scoped>
.btnBottom {
  position: fixed;
  bottom: 0;
  margin-top: 10px;
  background: #fff;
  width: 100%;
  padding: 20px 300px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 6px;
  transform: translateX(-20px);
  .btnLeft {
    margin-right: 20px;
    width: 120px;
  }
  .btnRight {
    width: 120px;
  }
}
</style>
