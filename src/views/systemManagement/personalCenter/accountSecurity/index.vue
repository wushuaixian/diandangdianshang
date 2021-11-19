<!--
 * @Author: your name
 * @Date: 2021-07-09 23:11:33
 * @LastEditTime: 2021-07-29 02:10:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/personalCenter/accountSecurity/index.vue
-->
<template>
  <div>
    <a-card v-if="!editPassword">
      <header-title class="header-title">
        <span>账号安全信息</span>
      </header-title>
      <ul class="item-box">
        <li class="item" v-for="(item, index) in list" :key="index">
          <div class="item-left">
            <div class="top">{{ item.title }}</div>
            <div class="bottom">{{ item.message }}</div>
          </div>
          <a
            class="item-right"
            @click=";(editPassword = true), ((stepsComponents = item.components), (active = index))"
          >
            修改
          </a>
        </li>
      </ul>
    </a-card>
    <a-card class="card" v-if="editPassword">
      <a-steps progress-dot :current="current">
        <a-step v-for="(item, index) in stepsList" :key="index">
          <template slot="title">
            <span :class="{ color: current >= index }">{{ item.text }}</span>
          </template>
        </a-step>
      </a-steps>
      <div
        class="components-box"
        :is="stepsComponents[current]"
        :title="list[active].title"
        @stepChange="stepChange"
      ></div>
    </a-card>
  </div>
</template>
<script>
import { Step1, Step2, Step3, UpdateMobilStep2 } from './components/index'
export default {
  components: {
    Step1,
    Step2,
    Step3,
    UpdateMobilStep2
  },
  data() {
    return {
      editPassword: false,
      current: 0,
      active: 0,
      stepsComponents: ['Step1', 'Step2', 'Step3'],
      stepsList: [
        {
          components: 'Step1',
          text: '身份验证'
        },
        {
          components: 'Step2',
          text: '设置操作'
        },
        {
          components: 'Step3',
          text: '完成'
        }
      ],
      list: [
        {
          title: '登录密码',
          message: '建议定期更改密码，以保账户安全',
          components: ['Step1', 'Step2', 'Step3']
        },
        {
          title: '更换手机号',
          message: '建议定期更改手机号，以保账户安全',
          components: ['Step1', 'updateMobilStep2', 'Step3']
        }
      ]
    }
  },
  methods: {
    stepChange() {
      this.current++
      if (this.current === 2) {
        this.$store.dispatch('Logout').then(() => {
          // location.href = '/user/login'
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-steps-dot {
  margin-top: 20px;
  background: #fafafa;
  padding-top: 30px;
  padding-bottom: 20px;
}
.form {
  margin-top: 40px;
}
.input {
  display: inline-block;
  width: 300px;
  margin-right: 20px;
}
.card {
  min-height: 600px;
  .components-box {
    width: 80%;
    margin: 0 auto;
    margin-top: 48px;
  }
}
.item-box {
  padding-left: 0px;
  .item {
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 14px;
    border-bottom: 1px solid #eeeeee;
    .item-left {
      .top {
        font-size: 14px;
        margin-bottom: 6px;
      }
      .bottom {
        color: #999999;
        line-height: 20px;
        font-size: 14px;
      }
    }
    .item-right {
      font-weight: 400;
      margin-right: 20px;
      // color: #1890ff;
      line-height: 20px;
      cursor: pointer;
    }
  }
}
.color {
  color: #ff6b00;
}
/deep/ .ant-steps-icon-dot {
  width: 16px !important;
  height: 16px !important;
}
/deep/ .ant-steps-item-tail {
  height: 8px !important;
}
/deep/ .ant-steps-item-tail::after {
  height: 8px !important;
  margin-left: 16px !important;
}
</style>
