<template>
  <div class="swiper-upload-main">
    <a class="left" @click="prev">
      <!-- <a-icon class="icon" type="left" /> -->
      <img :src="require('@/assets/icon/left.png')" alt="" />
    </a>
    <div class="swiper-list" ref="swiperl">
      <swiper :options="swiperOption" class="swiper-no-swiping" ref="mySwiper">
        <swiper-slide v-for="(item, index) in value" :key="index" style="width: 152px" class="in-slide">
          <div class="null">
            <a class="item" @click="ShowPreview(index)">
              <a-icon class="icon" type="eye" />
            </a>
            <a class="item" @click="Del(index)">
              <a-icon class="icon" type="delete" />
            </a>
          </div>
          <div class="img-box">
            <img :src="item" style="width: 152px; height: 152px" />
          </div>
        </swiper-slide>

        <swiper-slide
          v-for="(item, index) in fileList"
          :key="index + value.length + 1"
          style="width: 152px"
          class="in-slide"
        >
          <div class="upload-box" v-if="item.status === 'uploading'">
            <div class="upload">
              <a-spin>
                <a-icon slot="indicator" type="loading" style="font-size: 30px" spin />
              </a-spin>
              <div style="margin-top: 10px">正在上传</div>
            </div>
          </div>
        </swiper-slide>

        <swiper-slide style="width: 152px" class="in-slide-upload">
          <div class="upload-box">
            <a-upload-dragger
              :beforeUpload="beforeUpload"
              :ace="ace"
              class="upload-box"
              :showUploadList="false"
              :file-list="fileList"
              :defaultFileList="fileList"
              :multiple="true"
              :action="action"
              @change="handleChange"
              name="Filedata"
            >
              <div class="upload">
                <a-icon type="plus-circle" theme="twoTone" style="font-size: 30px" twoToneColor="#ee732e" />
                <div style="margin-top: 10px">点击/拖拽上传</div>
              </div>
            </a-upload-dragger>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <a class="right" @click="next">
      <!-- <a-icon class="icon" type="right" /> -->
      <img :src="require('@/assets/icon/right.png')" alt="" />
    </a>
    <ImagePreview :isThumbnail="false" ref="preview" />
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import ImagePreview from '@/components/ImagePreview'
import 'swiper/css/swiper.css'
import SwiperList from '../SwiperList/swiperList.vue'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    accept: {
      type: [String, Array],
      default: () => ['image/bmp', 'image/jpg', 'image/png', 'image/jpeg']
    },
    value: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: 10
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    ace() {
      return this.accept.join(',')
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    ImagePreview,
    SwiperList
  },
  data() {
    return {
      action: '/api/ouser-web/media/fileUploadToKsy',
      swiperOption: {
        slidesPerView: 'auto'
      },
      activeIndex: 0,
      fileList: [],
      previewImage: ''
    }
  },
  methods: {
    beforeUpload(file) {
      const { accept, size } = this
      const isAccept = accept instanceof Array ? accept.includes(file.type) : file.type === accept
      const isLimit = file.size / 1024 / 1024 < size
      if (!isAccept) {
        this.$message.error(`请上传正确的格式`)
        return Promise.reject(new Error(''))
      }
      if (!isLimit) {
        this.$message.error(`请上传小于${size}M文件`)
        return Promise.reject(new Error(''))
      }
      return true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
      const list = [] // fileList.filter((x) => x.status === 'done').map((x) => x?.response?.data?.url)
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].status === 'done') {
          list.push(this.fileList[i].response.data.url)
          this.fileList.splice(i, 1)
        }
      }
      this.$emit('change', [...this.value, ...list])
    },
    prev() {
      if (this.activeIndex > 0) {
        this.activeIndex--
        this.sel()
      }
    },
    next() {
      const swiperWidth = this.$refs.swiperl.clientWidth
      const itemWidth = 152 + 24
      const max = Math.floor(swiperWidth / itemWidth)
      if (this.activeIndex < this.fileList.length + this.value.length + 1 - max) {
        this.activeIndex++
        this.sel()
      }
    },
    Del(index) {
      const imglist = JSON.parse(JSON.stringify(this.value))
      imglist.splice(index, 1)
      this.$emit('change', imglist)
    },
    ShowPreview(currentIndex) {
      this.$refs.preview.customShow(this.value, currentIndex)
      // this.previewImage = this.value[index]
      // this.previewVisible = true
    },
    sel() {
      this.swiper.slideTo(this.activeIndex, 500, false)
    }
  }
}
</script>

<style lang="less">
.swiper-upload-main {
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
    img {
      width: 100%;
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
    .in-slide,
    .in-slide-upload {
      display: flex;
      margin-right: 24px;
      position: relative;
      overflow: hidden;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      .null {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 100%;
        left: 0;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transition: all 0.3s;
        .item {
          width: 26px;
          height: 26px;
          margin: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon {
            font-size: 26px;
            transition: all 0.3s;
            color: #ff6b00;
            :hover {
              color: #ff9950;
            }
          }
        }
      }
      &:hover {
        .null {
          top: 0;
        }
      }

      .img-box,
      .upload-box {
        height: 152px;
      }
      .img-box {
        overflow: hidden;
      }
      .upload-box {
        width: 100%;
        overflow: hidden;
        .ant-upload.ant-upload-drag {
          border-radius: 8px;
        }
        .upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      }
    }
    .in-slide-upload {
      border: none;
      .img-box,
      .upload-box {
        height: 154px;
        width: 154px;
      }
    }
  }
}
</style>
