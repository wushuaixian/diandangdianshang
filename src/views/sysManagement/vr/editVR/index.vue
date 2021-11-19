<template>
  <div class="content">
    <Navbar class="navbar" :data="data">
      <div class="vr-tool">
        <div class="navCard" @click="showVR()">
          <img class="navBack" :src="require('@/assets/images/vr/yulan.svg')" alt="" />
          <div>预览</div>
        </div>
        <div class="navCard" @click="saveVR()">
          <img class="navBack" :src="require('@/assets/images/vr/baocun.svg')" alt="" />
          <div v-if="type === 1">保存并关闭</div>
          <div v-if="type === 2">保存并审核</div>
        </div>
        <!-- <div class="navCard" @click="share()">
          <img class="navBack" :src="require('@/assets/images/vr/fenxiang.svg')" alt="" />
          <div>分享</div>
        </div> -->
        <!-- <a-button type="primary" @click="showPrview">预览</a-button>
        <a-button type="default">保存</a-button> -->
      </div>
      <!-- <a-modal v-model="visibleShare" :footer="null" title="VR分享">
        <p>分享功能需要复制下面链接进行分享</p>
        <textarea class="shareText" name="" id="" rows="5">
http://47.92.52.8:18200/#/?productionId=087a848588a35315f3214d3a64fda3a8</textarea
        >
      </a-modal> -->
    </Navbar>
    <div class="main-content">
      <Sidebar ref="Sidebar" :data="data" @changeScene="changeScene" />
      <div class="view">
        <Edit ref="Edit" :data="data" :config="config"></Edit>
      </div>
      <SideControl
        class="side-control"
        @addBiao="addBiao"
        @cancelCreateMarkers="cancelCreateMarkers"
        @cancelEditMarkers="cancelEditMarkers"
        @setMarkerData="setMarkerData"
        :data="data"
        :config="config"
      ></SideControl>
    </div>
    <!--预览作品界面-->
    <!-- <Preview
      ref="preview"
      :visible="showPreview"
      :productionId="previewProductionId"
      :previewRefreshParam="previewRefreshParam"
      @closePreview="closePreview"
    /> -->
  </div>
</template>

<script>
import { productionPreviewInMid, saveAndClose } from '@/api/vr'
import Navbar from './navbar'
import Sidebar from './sidebar'
import SideControl from './sideControl'
import Edit from './edit'
// import Preview from '../showVR/index.vue'

export default {
  components: {
    Navbar,
    Sidebar,
    SideControl,
    Edit
    // Preview
  },
  data() {
    return {
      visibleShare: false,
      data: {
        // 项目名称
        prodcutionName: '',
        // 厂商名称
        manufacturerName: '',
        // 项目图片
        coverUrl: '',
        // 作品id
        productionId: this.$route.params.id,
        // 场景信息
        sceneList: [],
        // 当前显示的场景信息
        checkedScene: {},
        // 创建或者编辑热点信息
        markerData: {},
        // 厂商id
        manufacturerId: '',
        // 作品链接
        linkUrl: ''
      },
      config: {
        // 页面类型，传递给vr显示面板
        pageType: 'edit',
        // 是否新增热点
        isEditMarker: false,
        activeKey: '视角'
      },
      // 作品信息，根据id查询出来的作品信息
      productionDataInfo: {},
      // 作品基本信息
      productionInfo: {},
      // 作品配置信息
      productionConfigInfo: {},
      // 是否展示预览页面
      showPreview: false,
      // 预览界面的作品id
      previewProductionId: '',
      // 预览界面刷新参数
      previewRefreshParam: '',
      type: 1
    }
  },
  created() {
    this.$nextTick(() => {
      this.config.pageType = this.$route.query.type
      this.data.productionId = this.$route.params.id
      this.queryProducitonInfoById()
    })
  },
  methods: {
    showVR() {
      window.open(this.data.linkUrl, '_blank')
    },
    async saveVR() {
      if (this.type === '1') {
        const pramas = {
          productionId: this.data.productionId,
          handleType: 1
        }
        const res = await saveAndClose(pramas)
        if (res.success === true) {
          // this.$store.dispatch('ACTION_VR_INFO', res.data)
          this.$router.go(-1)
        }
      } else {
        const pramas = {
          productionId: this.data.productionId,
          handleType: 2
        }
        const res = await saveAndClose(pramas)
        if (res.success === true) {
          // this.$store.dispatch('ACTION_VR_INFO', res.data)
          this.$router.go(-1)
        }
      }
    },
    // share() {
    //   this.visibleShare = true
    // },
    refreshSceneList() {
      this.$refs.Sidebar.refreshSceneList()
    },
    // 关闭作品预览
    closePreview() {
      this.showPreview = false
    },
    // 作品预览
    showPrview() {
      this.previewProductionId = this.data.productionId
      this.showPreview = true
      this.previewRefreshParam = Date.parse(new Date())
    },
    // 根据作品id查询作品信息，包含热点信息，场景信息，作品基本信息，作品配置信息
    async queryProducitonInfoById() {
      const params = { productionId: this.data.productionId }
      const res = await productionPreviewInMid(params)
      window.console.log(res)
      if (res.success === true) {
        const result = res.data
        this.data.sceneList = result.sceneVOList
        this.data.checkedScene = result.firstScene
        this.data.manufacturerName = result.merchantName
        this.data.productionName = result.productionName
        this.data.productionDesc = result.productionDesc
        this.data.coverUrl = result.coverUrl
        this.data.manufacturerId = result.merchantId
        this.data.linkUrl = result.linkUrl
      }
    },
    changeScene(sceneInfo) {
      this.data.checkedScene = sceneInfo
    },
    // 获取uuid
    guid2() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
    },
    // 新增热点
    addBiao(img) {
      if (this.config.isEditMarker === false) {
        this.config.isEditMarker = true
        this.data.markerData = {
          id: this.guid2(),
          createType: 'edit',
          longitude: 0,
          latitude: 0,
          image: img,
          width: 40,
          height: 40,
          anchor: 'bottom center',
          tooltip: '标记点',
          data: {
            generated: true
          }
        }
      } else {
        this.$refs.Edit.replaceImg(img)
      }
    },
    // 改变isEditMarker

    // 删除热点
    deleteMarker(id) {
      this.$refs.Edit.deleteMarker(id)
    },
    // 取消新增热点
    cancelCreateMarkers() {
      this.$refs.Edit.cancelCreateMarkers()
    },
    // 取消编辑热点
    cancelEditMarkers(currentEditHotstop) {
      this.$refs.Edit.cancelEditMarkers(currentEditHotstop)
    },
    // 返回视图窗口
    goback() {
      this.$refs.Edit.gobacks()
    },
    // 完成修改editcreateType值为非edit
    editCreateType(newVal) {
      this.$refs.Edit.editCreateType(newVal)
    },
    // 修改热点信息
    editMarker(id) {
      this.$refs.Edit.editMarker(id)
    },
    // 设置markerData
    setMarkerData(markerData) {
      this.data.markerData = markerData
    }
  },
  watch: {
    $route: {
      handler(newValue) {
        if (newValue.query[0] === 'E') {
          this.type = 2
        } else {
          this.type = 1
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 100%;
}
.main-content {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 56px);
  background: #f0f0f0;
  padding: 20px;
}
.view {
  flex: 1 1;
  position: relative;
  background: #e0e0e0;
  margin-right: 20px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.side-control {
  width: 270px;
  height: 100%;
  position: relative;
  background: #fff;
  border-radius: 8px;
  /deep/.ant-tabs {
    overflow-y: auto;
  }
}
.navbar {
  .vr-tool {
    display: flex;
    .navCard {
      text-align: center;
      padding: 0 20px;
      cursor: pointer;
    }
    .ant-btn {
      margin-left: 8px;
    }
  }
}
.shareText {
  width: 100%;
  border: 1px solid #e4e2e2;
  border-radius: 4px;
  resize: none;
}
.side-bar::-webkit-scrollbar,
.side-control /deep/.ant-tabs::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
  // width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  // height: 10px;
}
.side-bar::-webkit-scrollbar-thumb,
.side-control /deep/.ant-tabs::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgb(180, 180, 180);
}
.side-bar::-webkit-scrollbar-track,
.side-control /deep/.ant-tabs::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(58, 57, 57, 0.2);
  background: rgba(119, 119, 119, 0.1);
  border-radius: 10px;
}
</style>
