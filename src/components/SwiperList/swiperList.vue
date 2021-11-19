<template>
  <div class="swiper-list-main">
    <a class="left" @click="prev">
      <a-icon class="icon" type="left" />
    </a>
    <div class="swiper-list" ref="swiperl">
      <swiper :options="swiperOption" class="swiper-no-swiping" ref="mySwiper">
        <swiper-slide v-for="(item, index) in list" :key="index" :style="'width:' + width + 'px;'" class="in-slide">
          <slot :item="item" />
        </swiper-slide>
        <swiper-slide v-if="showAdd" :style="'width:' + width + 'px;'" class="in-slide">
          <a class="addcert" :style="'height:' + height + 'px;'" @click="CallBackAdd">
            <div>
              <img :src="require('@/assets/images/enterprise/分组 8@2x.png')" class="add" />
            </div>
            <h1 class="addtext">添加资质</h1>
          </a>
        </swiper-slide>
      </swiper>
    </div>
    <a class="right" @click="next">
      <a-icon class="icon" type="right" />
    </a>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  props: {
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    list: {
      type: Array,
      default: () => []
    },
    showAdd: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto'
      },
      activeIndex: 0
    }
  },
  methods: {
    CallBackAdd() {
      this.$emit('onAdd')
    },
    prev() {
      if (this.activeIndex > 0) {
        this.activeIndex--
        this.sel()
      }
    },
    next() {
      const swiperWidth = this.$refs.swiperl.clientWidth
      const itemWidth = this.width + 24
      const max = Math.floor(swiperWidth / itemWidth)
      if (this.activeIndex < this.list.length - max) {
        this.activeIndex++
        this.sel()
      }
    },
    sel() {
      this.swiper.slideTo(this.activeIndex, 500, false)
    }
  }
}
</script>

<style lang="less" scoped>
.swiper-list-main {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    .icon {
      font-size: 30px;
      color: #dbdbdb;
    }
    &:hover {
      .icon {
        color: #ff6b00;
      }
    }
  }
  .swiper-list {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
    flex: 1;
    .in-slide {
      overflow: hidden;
      margin-right: 24px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      .addcert {
        display: block;
        width: 100%;
        border-radius: 10px;
        padding-top: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .addtext {
          margin-top: 10px;
          text-align: center;
          font-size: 24px;
          color: #ff6b00;
        }
      }
    }
  }
}
</style>
