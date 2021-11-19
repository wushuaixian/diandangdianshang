<template>
  <div class="files-main">
    <swiper-list v-if="list.length > 0" :list="list" v-slot:default="{ item }">
      <div class="img-box">
        <ImagePreview :value="item.photoUrl" :width="200" :height="152" />
      </div>
    </swiper-list>
    <a-empty v-else />
  </div>
</template>

<script>
import { getMerchantOrgInfoDetail } from '@/api/supplieAuthAdmin'
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
      const res = await getMerchantOrgInfoDetail()
      if (res.code === '0') {
        this.list = res.data.companyPictureCheckInfoPOList
      }
    }
  }
}
</script>

<style lang="less" scoped>
.files-main {
  width: 100%;
  .img-box {
    width: 200px;
    height: 152px;
  }
}
</style>
