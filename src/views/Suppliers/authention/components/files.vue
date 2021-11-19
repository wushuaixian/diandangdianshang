<template>
  <div class="files-main">
    <swiper-list :list="list" :width="236" v-slot:default="{ item }">
      <div class="img-box">
        <ImagePreview :value="item.certificateUrl" :width="236" :height="169" />
        <div class="content">
          <div class="title">
            <div class="name">{{ item.certificateType }}</div>
            <div class="state" v-if="item.certificationStatus === '0'">未认证</div>
            <div class="state" v-else>已认证</div>
          </div>
          <div class="endtime">有效期至：{{ item.issueEndTime | moment }}</div>
        </div>
      </div>
    </swiper-list>
  </div>
</template>

<script>
import { qualificationList } from '@/api/supplieAuthAdmin'
import swiperList from '@/components/SwiperList/swiperList.vue'
import ImagePreview from '@/components/ImagePreview'
export default {
  components: { swiperList, ImagePreview },
  created() {
    this.BindData()
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    async BindData() {
      const res = await qualificationList()
      if (res.code === '0') {
        this.list = res.data.listObj
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.files-main {
  width: 100%;
  .img-box {
    width: 236px;
    height: 260px;
    display: flex;
    flex-direction: column;
    .img {
      width: 236px;
      height: 169px;
    }
    .content {
      background: rgba(255, 107, 0, 0.04);
      height: 91px;
      display: flex;
      flex-direction: column;
      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 11px;
        margin-left: 8px;
        .name {
          font-size: 18px;
          color: #262626;
          width: 150px;

          overflow: hidden;
          height: 30px;
          text-overflow: ellipsis;
        }
        .state {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 17px;
          margin-left: 8px;
          background: rgba(187, 187, 187, 0.24);
          border-radius: 2px;
          font-size: 12px;
          color: #999999;
        }
      }
      .endtime {
        font-size: 12px;
        color: #999999;
        margin-top: 8px;
        margin-left: 8px;
      }
    }
  }
}
</style>
