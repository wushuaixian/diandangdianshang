<template>
  <div class="contract">
    <swiper-list :list="list" v-slot:default="{ item }">
      <div class="img-box">
        <img class="img" :src="item.img" />
      </div>
    </swiper-list>
  </div>
</template>

<script>
import swiperList from '@/components/SwiperList/swiperList.vue'
export default {
  components: { swiperList },
  data() {
    return {
      list: [
        {
          img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180728%2F661ce14e1fc54c99a9c355de1dc3ce85.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625744439&t=3b8917a30746bf96ec3426758d602dff'
        },
        {
          img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180728%2F661ce14e1fc54c99a9c355de1dc3ce85.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625744439&t=3b8917a30746bf96ec3426758d602dff'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.contract {
  width: 100%;
  padding: 20px 0;
  .img-box {
    width: 200px;
    height: 152px;
    .img {
      width: 200px;
      height: 152px;
    }
  }
}
</style>
