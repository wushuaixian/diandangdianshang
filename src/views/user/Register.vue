<template>
  <section class="register">
    <policy v-if="!isReadPolicy" />
    <div v-else class="regedit">
      <div class="left">
        <Step :index="index" />
        <div class="form">
          <div :is="components[index]"></div>
        </div>
      </div>
      <div class="right">
        <adv-svg />
        <!-- <img :src="Adv" alt="" /> -->
      </div>
    </div>
  </section>
</template>

<script>
import { Step, Step1, Step2, Step3 } from './components'
import Policy from './components/policy.vue'
import Adv from '@/assets/images/user/zhuce.png'
import AdvSvg from '@/assets/images/user/zhuce.svg?inline'
export default {
  components: { Step, Step1, Step2, Step3, Policy, AdvSvg },
  data() {
    return {
      Adv,
      index: 0,
      isReadPolicy: false,
      components: ['Step1', 'Step2', 'Step3']
    }
  },
  methods: {
    editIndex(val) {
      this.index = val
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 16px !important;
}

.register {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f6f6f6;

  .regedit {
    display: flex !important;
    flex-direction: row;
    overflow: hidden;
    width: 1020px;
    border-radius: 8px;
    background: #fff;
    color: #262626;
    margin: 20px 0 100px 0;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.05);

    .left {
      display: flex !important;
      flex-direction: column;
      padding: 40px;
      width: 640px;

      .form {
        margin-top: 30px;
      }
    }

    .right {
      display: flex !important;
      flex-direction: column;
      width: 380px;
      background-color: rgb(250, 250, 250);

      .contents {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 6px 24px;

        .title {
          font-size: 25px;
          line-height: 31px;
          margin-top: auto;
          margin-bottom: 12px;
          font-weight: bold;
        }

        .text {
          opacity: 0.8;
          font-size: 14px;
          color: #666666;
          line-height: 18px;
          margin-top: 12px;
        }
      }

      .banners {
        flex: 1;
      }
    }
  }
}
</style>
