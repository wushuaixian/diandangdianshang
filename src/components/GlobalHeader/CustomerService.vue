<!--
 * @Author: your name
 * @Date: 2021-07-25 14:30:52
 * @LastEditTime: 2021-07-25 15:49:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/components/GlobalHeader/customerService.vue
-->
<template>
  <div class="serve">
    <img @click="openZhiChi" class="img" src="@/assets/images/robot.png" alt="" />
  </div>
</template>
<script>
import { getCsTekGroupIdaa } from '@/api/serve/index'
import { mapState } from 'vuex'
import Cookie from '@/utils/cookie'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    console.log(this.user, 'user')
  },
  methods: {
    async openZhiChi() {
      const ut = Cookie.get('ut')
      const { user } = this
      // if (!ut) {
      //   return
      // }
      const params = {
        storeId: 0 // storeId是店铺  如果没有是平台
      }
      const {
        data: { msgTitle, csTekGroupId, channelCode }
      } = await getCsTekGroupIdaa(params)
      const param = {
        ut: ut,
        msgTitle: msgTitle || '',
        storeId: 0,
        channelCode: channelCode || ''
        // logoUrl: res.data && res.data.logoUrl ? res.data.logoUrl : ''
      }
      // sysnum 后续要替换成叮当的 客服sysnum b59f0cae9891452ea61aaefce4062759
      window.open(
        'https://chaten.sobot.com/chat/pc/v2/index.html?sysnum=d0cdb276d9f14b9ba0200827c4e15620&channelid=3&groupid=' +
          csTekGroupId +
          '&ut=' +
          ut +
          '&msgTitle=' +
          msgTitle +
          '&channelCode=' +
          channelCode +
          '&tel=' +
          user.isBindMobile +
          '&uname=' +
          user.info.userName +
          '&face=' +
          user.info.logoUrl +
          '&realname=' +
          user.info.userName +
          '&params=' +
          param
        // '&partnerid=' +
        // $rootScope.userInfo.userId
      )
    }
  }
}
</script>
<style scoped lang="less">
.serve {
  margin-right: 20px;
}
.img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
</style>
