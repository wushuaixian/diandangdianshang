<template>
  <div class="step">
    <div class="dian">
      <div class="item">
        <div :class="{ sel: index >= 0, d: true }"></div>
      </div>
      <div class="item"></div>
      <div class="item">
        <div :class="{ sel: index >= 1, d: true }"></div>
      </div>
      <div class="item"></div>
      <div class="item">
        <div :class="{ sel: index >= 2, d: true }"></div>
      </div>
    </div>
    <div class="line">
      <div class="inline" :style="`width:${width[index]}%`"></div>
    </div>
    <div class="text">
      <div :class="{ sel: index >= 0, item: true }">注册信息</div>
      <div class="item"></div>
      <div :class="{ sel: index >= 1, item: true }">企业信息</div>
      <div class="item"></div>
      <div :class="{ sel: index >= 2, item: true }">注册成功</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      width: [0, 50, 100]
    }
  },
  mounted() {
    console.log(this.index)
  }
}
</script>

<style lang="less" scoped>
.step {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background: #fafafa;
  border-radius: 4px;
  width: 100%;
  height: 106px;

  .dian {
    display: flex;
    flex-direction: row;
    padding: 10px;

    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .d {
        width: 16px;
        height: 16px;
        background: #e9e9e9;
        border-radius: 8px;
        z-index: 1;
        transition: background 0.5s;

        &.sel {
          background: #fd6901;
        }
      }
    }
  }

  .line {
    position: absolute;
    left: 62px;
    right: 62px;
    top: 32px;
    height: 8px;
    background: #e9e9e9;
    border-radius: 4px;

    .inline {
      height: 100%;
      border-radius: 4px;
      background: #fd6901;
      transition: width 0.5s;
    }
  }

  .text {
    display: flex;
    flex-direction: row;
    padding: 10px;
    padding-bottom: 5px;

    .item {
      flex: 1;
      text-align: center;
      font-size: 16px;
      color: #262626;
      line-height: 20px;
      font-weight: bold;
      z-index: 0;
      transition: color 0.5s;

      &.sel {
        color: #ff6b00;
      }
    }
  }
}
</style>
