<!--
 * @Author: your name
 * @Date: 2021-06-22 23:16:38
 * @LastEditTime: 2021-07-25 15:44:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/components/GlobalHeader/RightContent.vue
-->
<template>
  <div :class="wrpCls">
    <customer-service v-if="isShowCustomerService" />
    <div class="switch" v-if="platformList.length >= 2" @click="hanleClick()">
      <a-icon type="swap" />
      <span>切换{{ isPlatform === IS_SUPPLIERS ? '买家' : '卖家' }}工作平台</span>
    </div>
    <message-header class="message-header" />
    <avatar-dropdown :menu="showMenu" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import CustomerService from './CustomerService'
import MessageHeader from './MessageHeader'
import SelectLang from '@/components/SelectLang'
import { mapState, mapActions } from 'vuex'
import { refreshFrontPlatform } from '@/api/user'
import { IS_SUPPLIERS, IS_PURCCHASEERS } from '@/store/platform-types'
import { PLATFORM_ID } from '@/store/mutation-types'
import cookie from '@/utils/cookie'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    MessageHeader,
    CustomerService
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      IS_SUPPLIERS,
      IS_PURCCHASEERS,
      showMenu: true
    }
  },
  computed: {
    ...mapState({
      platformList: (state) => state.permission.platformList,
      isPlatform: (state) => state.permission.isPlatform,
      isShowCustomerService: (state) => state.permission.isShowCustomerService
    }),
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true
      }
    }
  },
  methods: {
    ...mapActions(['refreshFrontPlatform']),
    async hanleClick() {
      const platformId = this.isPlatform === IS_SUPPLIERS ? IS_PURCCHASEERS : IS_SUPPLIERS
      cookie.setItem('isPlatform', platformId)
      cookie.set(PLATFORM_ID, platformId)
      await refreshFrontPlatform({
        ut: cookie.getItem('ut'),
        platformId
      })
      const res = await this.refreshFrontPlatform({ platformId })
      if (res) {
        location.href = '/'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ant-pro-global-header-index-right {
  display: flex;
  align-items: center;
  cursor: pointer;
  .switch {
    background: rgba(255, 107, 0, 0.1);
    border-radius: 16px;
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    color: #ff6b00;
    span {
      margin-left: 8px;
    }
  }
}
.message-header {
}
</style>
