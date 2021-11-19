<template>
  <div class="ant-modal-header" ref="refModel">
    <div id="viewer"></div>
    <div class="content">
      <div class="linshi" v-for="(i, index) in scensList" :key="index" @click="editUrl(i, index)">
        <img class="imgList" :class="{ active: currentIndex === index }" :src="i.coverUrl" alt="" />
        <p>{{ i.sceneName }}</p>
      </div>
    </div>
    <a-modal title="商品" :visible.sync="visibleGoods" width="300px">
      <div>
        <img class="goodsImg" slot="cover" :src="commodityImg" alt="" />
      </div>
      <p class="goodsName">{{ commodityName }}</p>
      <p class="goodsPrice">{{ commodityPrice }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="handleOk">购 买</el-button>
      </span>
    </a-modal>
  </div>
</template>
<script>
import { Viewer } from 'photo-sphere-viewer'
import MarkersPlugin from 'photo-sphere-viewer/dist/plugins/markers'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'
export default {
  // props: ['data'],
  data() {
    return {
      currentIndex: 0,
      productionDataInfo: null,
      visibleGoods: false,
      commodityImg: '', // 商品图片地址信息
      commodityLinkUrl: '', // 商品链接信息
      commodityName: '', // 商品名字
      commodityPrice: '', // 商品价格
      // 场景列表
      scensList: [],
      modelCss: {
        height: '600px'
      },
      // 全景图实体
      PSV: null,
      // 全景图热点实体
      markersPlugin: null,
      // 当前视角
      angleOfViewNow: { longitude: 0, latitude: 0 }
    }
  },
  methods: {
    // 初始化场景
    initPhotoSphere(sceneData) {
      const that = this
      console.log(sceneData)
      let hotstopList = []
      if (sceneData.hotstopDtoList && sceneData.hotstopDtoList.length > 0) {
        hotstopList = sceneData.hotstopDtoList.map((item) => ({
          id: item.id,
          markerType: item.hotstopType,
          // content: item.content,
          commodityImg: item.commodityImg, // 商品图片地址信息
          commodityLinkUrl: item.commodityLinkUrl, // 商品链接信息
          commodityName: item.commodityName, // 商品名字
          commodityPrice: item.commodityPrice, // 商品价格
          createTime: item.createTime,
          width: item.width,
          height: item.height,
          hotstopId: item.hotstopId,
          hotstopType: item.hotstopType,
          image: item.image,
          latitude: item.latitude,
          linkSceneId: item.linkSceneId,
          longitude: item.longitude,
          sceneId: item.sceneId,
          tooltip: item.tooltip
        }))
      }

      const self = this
      if (this.PSV == null) {
        window.console.log('全景参数')
        // 全景图参数
        const svParam = {
          container: document.getElementById('viewer'),
          // panorama: sceneData.materialUrl,
          panorama: require('@/assets/images/logo.png'),
          size: {
            width: '100%',
            height: '100%'
          },
          caption: sceneData.sceneName,
          // navbar: ['autorotate', 'zoom', 'markers', 'caption', 'fullscreen'],
          navbar: [
            'autorotate',
            'zoom',
            'markersList',
            {
              content: '💬',
              title: 'Show all tooltips',
              className: 'custom-button',
              onClick: function () {
                self.markersPlugin.toggleAllTooltips()
              }
            },
            'caption',
            'fullscreen'
          ],
          autorotateSpeed: '1rpm', // 旋转速度
          defaultLong: sceneData.longitude ? Number(sceneData.longitude) : 0, // 初始视角
          defaultLat: sceneData.latitude ? Number(sceneData.latitude) : 0, // 初始视角
          // thetaOffset: 2000,
          minFov: 60, // 最小视野,在1-179之间
          maxFov: 90, // 最大视野,在1-179之间
          // latitude_range: [Math.PI / 3, -Math.PI / 3],
          // speed: 2,
          autorotateDelay: 1000,
          moveSpeed: 2, // 鼠标拖动旋转速度
          plugins: [
            [
              MarkersPlugin,
              {
                markers: hotstopList
              }
            ]
          ]
        }
        this.PSV = new Viewer(svParam)
      } else {
        that.markersPlugin.clearMarkers()
        const target = {
          longitude: sceneData.longitude ? Number(sceneData.longitude) : 0,
          latitude: sceneData.latitude ? Number(sceneData.latitude) : 0,
          autorotateDelay: 1000
        }
        this.PSV.setPanorama(sceneData.materialUrl, target, true).then(function () {
          that.PSV.navbar.setCaption(sceneData.sceneName)
          that.markersPlugin.setMarkers(hotstopList)
        })
      }

      // 热点设置
      this.markersPlugin = this.PSV.getPlugin(MarkersPlugin)

      // const switchScene = true
      // 切换热点
      this.PSV.once('ready', () => {
        this.markersPlugin.on('select-marker', (e, marker) => {
          console.log(e)
          console.log(marker)
          if (marker.config.hotstopType) {
            switch (marker.config.hotstopType) {
              case 1: {
                // 场景切换热点
                this.changeScenes(marker.config.linkSceneId)
                break
              }
              case 2: {
                // 商品热点
                this.showCommodity(marker.config)
                break
              }
            }
          }
        })
      })
    },

    // 切换场景
    changeScenes(targetSceneId) {
      const index = this.scensList.findIndex((item) => item.sceneId === targetSceneId)
      this.currentIndex = index
      const scene = this.scensList.filter((item) => item.sceneId === targetSceneId)
      this.initPhotoSphere(scene[0])
    },
    editUrl(i, index) {
      this.currentIndex = index
      const scene = this.scensList.filter((item) => item.sceneId === i.sceneId)
      this.initPhotoSphere(scene[0])
    },

    getList() {
      // productionId=562e42ea4998bb25e3e038eef51110d9
      const id = this.$route.query.productionId
      const pramse = {
        id: id
      }
      this.axios.get('/vr/vrProduction/selectByProductionId', { params: pramse }).then((res) => {
        window.console.log(res)
        const result = res.data.result
        this.productionDataInfo = result
        this.scensList = result.sceneDtoList
        this.data.name = result.manufacturerName
        const firstScene = result.firstScene
        this.initPhotoSphere(firstScene)
      })
    },
    // 展示商品
    showCommodity(data) {
      window.console.log(data)
      this.visibleGoods = true
      this.commodityImg = data.commodityImg // 商品图片地址信息
      this.commodityLinkUrl = data.commodityLinkUrl // 商品链接信息
      this.commodityName = data.commodityName // 商品名字
      this.commodityPrice = data.commodityPrice // 商品价格
      // const h = this.$createElement;
      // this.$confirm({
      //   content: h('div', {}, [h('p', 'some messages...some messages...'), h('p', 'some messages...some messages...')]),
      //   onOk() {}
      // });
    },
    handleOk(e) {
      window.open(this.commodityLinkUrl)
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.ant-modal-header {
  width: 100%;
  height: calc(100% - 60px);
  .goodsImg {
    width: 100%;
    border-radius: 6px;
  }
  .goodsPrice {
    font-size: 18px;
    color: rgb(240, 45, 45);
    font-weight: 600;
  }
}
.content {
  position: fixed;
  top: 60px;
  background: rgba(0, 0, 0, 0.3);
  color: #ffff;
  left: 0px;
  z-index: 100;
  padding: 10px;
  font-size: 12px;
  width: 120px;
  height: calc(100% - 119px);
  text-align: center;
  overflow-y: scroll;

  // 横向样式

  // position: fixed;
  // bottom: 60px;
  // background: rgba(0, 0, 0, 0.3);
  // color: #ffff;
  // left: calc(50% - 400px);
  // z-index: 100;
  // padding: 10px;
  // font-size: 12px;
  // width: 800px;
  // height: 130px;
  // text-align: center;
  // overflow-x: scroll;
  // white-space: nowrap;
  .linshi {
    display: inline-block;
    margin-right: 10px;
  }
  .imgList {
    width: 100px;
    height: 80px;
    border-radius: 4px;
    border: 2px solid #ccc;
  }
  .active {
    border: 3px solid rgb(252, 46, 46);
  }
}

.content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
  // width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  // height: 10px;
}
.content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgb(43, 91, 114);
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
.content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(75, 75, 75, 0.1);
  border-radius: 10px;
}
/deep/.el-dialog__body {
  padding: 10px 20px;
}
</style>
