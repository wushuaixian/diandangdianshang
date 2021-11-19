<template>
  <div>
    <a-dropdown v-if="userName" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <a-avatar
          size="small"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          class="antd-pro-global-header-index-avatar"
        />
        <span>{{ userName }}</span>
      </span>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <!-- <a-menu-item
            v-if="menu"
            key="center"
            @click="handleToCenter">
            <a-icon type="user" />
            {{ $t('menu.account.center') }}
          </a-menu-item>
          <a-menu-item
            v-if="menu"
            key="settings"
            @click="handleToSettings">
            <a-icon type="setting" />
            {{ $t('menu.account.settings') }}
          </a-menu-item>
          <a-menu-divider v-if="menu" /> -->
          <a-menu-item key="logout" @click="handleLogout">
            <a-icon type="logout" />
            退出
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { mapState } from 'vuex'
import constants from '../../config/constants.js'
export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info
    }),
    userName() {
      return this.info?.userName
    }
  },
  data() {
    return {
      constants: constants
    }
  },
  methods: {
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout(e) {
      Modal.confirm({
        title: '提示',
        content: '你确定要退出吗？',
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            location.href = '/user/login'
          })
        },
        onCancel() {}
      })
    },
    viewMessage() {
      console.log(1)
      const routeData = this.$router.resolve({
        name: 'MessageList'
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
/deep/.ant-scroll-number {
  position: relative !important;
  top: -9px !important;
  display: block !important;
  left: 30px !important;
}
</style>
