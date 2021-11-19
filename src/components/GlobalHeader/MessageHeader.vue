<template>
  <div>
    <a-badge :count="tabledata.unReadTotal" @click="viewMessage" />
    <a-icon style="font-size: 18px; margin-right: 20px; margin-left: 20px" type="bell" @click="viewMessage" />
  </div>
</template>

<script>
// import { Modal } from 'ant-design-vue'
import { mapState } from 'vuex'
import constants from '../../config/constants.js'
import { msgCenterEventLog } from '@/api/message'
export default {
  name: 'AvatarDropdown',
  props: {},
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
      constants: constants,
      query: {
        msgName: '',
        msgIsRead: '',
        pageNum: '1',
        pageSize: '10'
      },
      ut: this.getCookie('ut'),
      tabledata: {}
    }
  },
  watch: {
    $route: 'getPath'
  },
  created() {
    this.getMsgCenterEventLog()
  },
  methods: {
    getPath() {
      this.getMsgCenterEventLog()
    },
    async getMsgCenterEventLog() {
      const data = await msgCenterEventLog(this.query, this.ut)
      this.tabledata = data
    },
    // 取ut值
    getCookie(name) {
      let cookieValue = null
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim()
          // 判断这个cookie的参数名是不是我们想要的
          if (cookie.substring(0, name.length + 1) === name + '=') {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
            break
          }
        }
      }
      return cookieValue
    },
    viewMessage() {
      const routeData = this.$router.resolve({
        name: 'MessageList'
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-scroll-number {
  position: relative !important;
  top: -9px !important;
  display: block !important;
  left: 30px !important;
}
</style>
