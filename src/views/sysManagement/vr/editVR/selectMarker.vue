<template>
  <div class="ant-modal-header" ref="refModel">
    <a-modal
      width="1000px"
      title="目标场景"
      :visible="markerVisable"
      centered
      :bodyStyle="modelCss"
      @cancel="cancleMarker()"
      @ok="createMarker()"
    >
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }" :data-source="sceneList">
        <a-list-item class="items" slot="renderItem" slot-scope="items, index">
          <a-card
            class="card-con"
            :body-style="{ padding: '0px 0px 0px 0px' }"
            :class="sceneActive == index ? 'sBor' : ''"
            @click="getSceneId(items, index)"
          >
            <template>
              <div class="card-body-con">
                <div
                  v-if="items.status == 'error'"
                  slot="cover"
                  style="height: 160px; background: #e9e9e9; position: relative"
                ></div>
                <img slot="cover" alt="example" width="100%" height="160px" :src="items.coverUrl" />
              </div>
              <a-card-meta class="contentTitle" :title="items.sceneName">
                <template slot="description">
                  {{ items.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
                </template>
              </a-card-meta>
            </template>
          </a-card>
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    markerVisable: {
      type: Boolean,
      default: false // 1 创建作品 2 添加选中场景
    },
    sceneList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      modelCss: {
        height: '500px',
        'overflow-y': 'scroll'
      },
      sceneActive: null,
      item: {}
    }
  },
  methods: {
    getSceneId(item, index) {
      this.sceneActive = index
      this.item = item
    },
    // 点击确定
    createMarker() {
      if (this.item) {
        this.$emit('createOk', this.item)
        this.clearCheckedItem()
      } else {
        this.$message.warning('请选择一个场景')
      }
    },
    // 点击取消
    cancleMarker() {
      this.$emit('create')
      this.sceneActive = null
    }
  },
  mounted() {},
  components: {},
  watch: {}
}
</script>
<style lang="less" scope>
.sBor {
  border: 2px solid #ff6b00;
}
.card-con {
  box-shadow: 0px 0px 14px #ddd;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
}
.checkXuan {
  padding: 5px;
  position: absolute;
  right: 5px;
}
.contentTitle {
  padding: 15px;
  line-height: 16px;
}
/deep/ .ant-checkbox-inner {
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border: 2px solid #ffffff;
}
.card-body-con {
  position: relative;
  overflow: hidden;
}
.iconStyle {
  position: absolute;
  top: 139px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(30px);
}
.active {
  .iconStyle {
    animation: drop 0.5s;
    transform: translateY(0);
    display: flex;
  }
}
.leave {
  .iconStyle {
    animation: dropLeave 0.5s;
    transform: translateY(30px);
  }
}
.items {
  height: 240px;
}
@keyframes drop {
  from {
    transform: translateY(30px);
  }
  to {
    transform: translateY(0px);
  }
}
@keyframes dropLeave {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(30px);
  }
}
</style>
