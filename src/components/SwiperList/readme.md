、、示例
import swiperList from '@/components/SwiperList/swiperList.vue'
<swiper-list :list="list" :width="236" v-slot:default="{item}">
  <div>
    {{ item.name }}
  </div>
</swiper-list>
