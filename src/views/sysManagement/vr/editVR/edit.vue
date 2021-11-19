<template>
  <div ref="imgTransf">
    <div class="capture-box" v-if="config.activeKey == '视角'">
      <i class="corner corner-tl"></i>
      <i class="corner corner-tr"></i>
      <i class="corner corner-bl"></i>
      <i class="corner corner-br"></i>
      <span class="capture-text">轻按可拖动场景</span>
    </div>
    <div class="addWindow" v-if="config.activeKey == '视角'">
      <a-button @click="jietu" type="primary"> 设定初始视角 </a-button>
    </div>
    <div id="viewer" class="viewer"></div>
  </div>
</template>

<script>
import { updatePositonById, queryBySceneId } from '@/api/vr'
// import html2canvas from 'html2canvas'
import { Viewer } from 'photo-sphere-viewer'
import MarkersPlugin from 'photo-sphere-viewer/dist/plugins/markers'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'

export default {
  // pageType 类型   productionId 作品id
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 作品数据
      productionInfo: {},
      // 全景图实体
      PSV: null,
      // 全景图热点实体
      markersPlugin: null,
      // 当前视角
      angleOfViewNow: { longitude: 0, latitude: 0 },
      factoryLink: require('@assets/images/vr/1.jpg'),
      factoryLink2: require('@assets/images/vr/2.jpg'),
      tip: require('@assets/images/vr/pin2.png'),
      ceshiImg: require('@assets/images/login/loginbg.png')
    }
  },
  methods: {
    initPhotoSphere(sceneData) {
      const that = this
      const sceneList = sceneData.hotstopList.map((item) => ({
        id: item.id,
        content: item.tooltip,
        commodityImg: item.commodityImg, // 商品图片地址信息
        commodityLinkUrl: item.commodityLinkUrl, // 商品链接信息
        commodityName: item.commodityName, // 商品名字
        commodityPrice: item.commodityPrice, // 商品价格
        createTime: item.createTime,
        width: item.width,
        height: item.height,
        hotstopId: item.id,
        hotstopType: item.hotstopType,
        image: item.image,
        latitude: item.latitude,
        longitude: item.longitude,
        linkSceneId: item.linkSceneId,
        sceneId: item.sceneId,
        tooltip: item.tooltip
      }))

      // if (this.PSV == null) {
      if (this.PSV) {
        this.PSV.destroy()
      }
      window.console.log('全景创建')
      // 全景图参数
      const svParam = {
        container: document.getElementById('viewer'),
        panorama: sceneData.materialUrl,
        size: {
          width: '100%',
          height: 'calc(100vh - 96px)'
        },
        caption: sceneData.sceneName,
        navbar: ['autorotate', 'zoom', 'caption', 'fullscreen'],
        defaultLong: sceneData.longitude ? Number(sceneData.longitude) : 0,
        defaultLat: sceneData.latitude ? Number(sceneData.latitude) : 0,
        minFov: 60,
        maxFov: 90,
        moveSpeed: 2,
        plugins: [
          [
            MarkersPlugin,
            {
              markers: sceneList
            }
          ]
        ]
      }
      console.log(svParam)
      this.PSV = new Viewer(svParam)
      // }
      //  else {
      // window.console.log('全景跳转');
      // const target = {
      //   longitude: sceneData.longitude ? Number(sceneData.longitude) : 0,
      //   latitude: sceneData.latitude ? Number(sceneData.latitude) : 0,
      // };
      // this.markersPlugin.clearMarkers();
      // this.PSV.setPanorama(sceneData.materialUrl, target, true).then(function () {
      //   that.PSV.navbar.setCaption(sceneData.sceneName);
      //   that.markersPlugin.setMarkers(sceneList);
      //   //Viewer.renderer();
      // });
      // 更新热点图
      // }

      // 热点设置
      this.markersPlugin = this.PSV.getPlugin(MarkersPlugin)

      // const switchScene = true

      // 绑定视角切换事件
      this.PSV.on('position-updated', (e, position) => {
        that.angleOfViewNow.longitude = position.longitude
        that.angleOfViewNow.latitude = position.latitude
      })

      // 绑定点击事件（点击移动热点）
      this.PSV.on('click', function (e, position) {
        // 应该由父组件传入一个当前是否在新增热点的状态值，如果为true，走如下逻辑
        if (that.config.isEditMarker) {
          // 取到所有的热点
          const markers = that.markersPlugin.markers
          // 遍历当前createType值为edit的热点，修改他的坐标
          for (const key in markers) {
            const tempData = markers[key]
            if (tempData.config.createType === 'edit') {
              // that.markersPlugin.removeMarker(key);
              tempData.longitude = position.longitude
              tempData.latitude = position.latitude
              that.markersPlugin.updateMarker(tempData)
              break
            }
          }
        }
        // 修改markerData的改变值
        that.data.markerData.longitude = position.longitude
        that.data.markerData.latitude = position.latitude
      })
    },
    // 添加热点
    addmarker(config) {
      config.longitude = this.angleOfViewNow.longitude
      config.latitude = this.angleOfViewNow.latitude
      this.markersPlugin.addMarker(config)
    },
    // 返回当前视角
    gobacks() {
      // 绑定视角切换事件
      this.PSV.animate({
        longitude: this.data.checkedScene.longitude ? this.data.checkedScene.longitude : 0,
        latitude: this.data.checkedScene.latitude ? this.data.checkedScene.latitude : 0,
        speed: '4rpm'
      }).then((d) => {
        window.console.log(d)
      })
    },
    // 修改对应热点createType属性值
    editCreateType(newVal) {
      window.console.log('提交改变')
      const markers = this.markersPlugin.markers
      for (const key in markers) {
        const tempData = markers[key]
        if (tempData.config.createType === 'edit') {
          if (newVal) {
            const tempData2 = {
              id: newVal.id,
              createType: 'show',
              longitude: newVal.longitude,
              latitude: newVal.latitude,
              image: newVal.image,
              width: newVal.width,
              height: newVal.height,
              anchor: 'bottom center',
              tooltip: newVal.content,
              data: {
                generated: true
              }
            }
            this.markersPlugin.addMarker(tempData2)
            // 新增热点后替换热点
            this.markersPlugin.removeMarker(tempData.id)
          } else {
            const id = tempData.config.id
            this.markersPlugin.updateMarker({
              id: id,
              createType: 'show'
            })
          }

          break
        }
      }
    },

    // 替换图片
    replaceImg(img) {
      const markers = this.markersPlugin.markers
      // 遍历当前createType值为edit的热点，直接移除
      for (const key in markers) {
        const tempData = markers[key]
        if (tempData.config.createType === 'edit') {
          const id = tempData.config.id
          this.markersPlugin.updateMarker({
            id: id,
            image: img
          })
          break
        }
      }
      // 修改markerData的改变值
      this.data.markerData.image = img
    },
    // 删除热点
    deleteMarker(id) {
      this.markersPlugin.removeMarker(id)
    },
    // 取消新增热点
    cancelCreateMarkers() {
      const markers = this.markersPlugin.markers
      // 遍历当前createType值为edit的热点，直接移除
      for (const key in markers) {
        const tempData = markers[key]
        if (tempData.config.createType === 'edit') {
          this.markersPlugin.removeMarker(key)
          break
        }
      }
    },
    // 取消编辑热点
    cancelEditMarkers(currentEditHotstop) {
      const markers = this.markersPlugin.markers
      // 遍历当前createType值为edit的热点，直接移除
      for (const key in markers) {
        const tempData = markers[key]
        if (tempData.config.createType === 'edit') {
          tempData.config.createType = 'show'
          tempData.longitude = currentEditHotstop.longitude
          tempData.latitude = currentEditHotstop.latitude
          this.markersPlugin.updateMarker(tempData)
          break
        }
      }
    },
    // 截图
    async jietu() {
      // const that = this;
      // html2canvas(this.$refs.imgTransf, { scale: 4, logging: false, useCORS: true }).then(function(canvas) {
      //   const imgUrl = canvas.toDataURL('png'); // 获取生成的图片的url
      //   window.console.log(imgUrl);
      //   that.data.checkedScene.jiepingUrl = imgUrl;
      // });
      const promes = {
        id: this.data.checkedScene.id,
        longitude: this.angleOfViewNow.longitude,
        latitude: this.angleOfViewNow.latitude
      }
      const that = this
      this.data.checkedScene.longitude = this.angleOfViewNow.longitude
      this.data.checkedScene.latitude = this.angleOfViewNow.latitude
      const res = await updatePositonById(promes)
      if (res.success === true) {
        that.$message.success('初始视角设定成功')
      }
    },
    // 修改热点信息
    editMarker(hotstopId) {
      // 视角转到指定的热点
      this.markersPlugin.gotoMarker(hotstopId, 3000)
      // 取到所有的热点
      const markers = this.markersPlugin.markers

      for (const key in markers) {
        const tempData = markers[key]
        if (tempData.config.id === hotstopId) {
          tempData.config.createType = 'edit'
          this.markersPlugin.updateMarker(tempData)
          break
        }
      }
    },
    // 判断当前热点是否已经包含指定id,修改热点时使用
    hasMarkerData(id) {
      const markers = this.markersPlugin.markers
      // 遍历当前createType值为edit的热点，直接移除
      for (const key in markers) {
        const tempData = markers[key]
        if (tempData.config.id === id) {
          return true
        }
      }
      return false
    }
  },
  created() {
    this.$nextTick(() => {})
  },
  mounted() {
    // this.initPhotoSphere() // 测试
  },
  watch: {
    'data.checkedScene': {
      async handler(newVal, oldVal) {
        const sceneId = newVal.id
        const params = { sceneId: sceneId }
        const { data } = await queryBySceneId(params)
        window.console.log(data)
        this.initPhotoSphere(data)
      }
    },
    'data.markerData': {
      handler(newVal, OldVal) {
        window.console.log('data.markerData')
        if (!this.hasMarkerData(newVal.id)) {
          this.addmarker(newVal)
        }
      }
    },
    'config.activekey': {
      handler(newVal, OldVal) {
        window.console.log('config.activekey')
        this.addmarker(newVal)
      }
    }
  }
}
</script>

<style scoped>
.capture-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px dotted #fff;
  pointer-events: none;
  max-width: 710px;
  max-height: 399px;
  width: 68.7%;
  padding-bottom: 38.6%;
  box-sizing: border-box;
  z-index: 99;
}
.capture-text {
  display: block;
  text-align: center;
  height: 22px;
  color: #fff;
  /* constter-spacing: 0; */
  line-height: 22px;
  text-shadow: 0 1px 2px rgb(0 0 0 / 61%);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-user-select: none;
  user-select: none;
}
.addWindow {
  position: absolute;
  left: 50%;
  bottom: 20%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  z-index: 99;
}
.corner {
  display: block;
  width: 30px;
  height: 30px;
  background: transparent;
  border-style: solid;
  border-color: #fff;
  position: absolute;
}
.corner-tl {
  top: -1px;
  left: -1px;
  border-width: 3px 0 0 3px;
}
.corner-tr {
  top: -1px;
  right: -1px;
  border-width: 3px 3px 0 0;
}
.corner-bl {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 3px 3px;
}
.corner-br {
  bottom: -1px;
  right: -1px;
  border-width: 0 3px 3px 0;
}
.viewer {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
}
</style>
