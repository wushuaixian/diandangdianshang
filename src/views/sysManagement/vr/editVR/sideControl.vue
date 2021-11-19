<template>
  <div>
    <a-tabs :default-active-key="config.activeKey" @change="tabs">
      <!-- 视角 -->
      <a-tab-pane key="视角" tab="视角">
        <div class="oneTitle">初始场景</div>
        <div class="reDianContent">
          <div>
            <!-- <img :src="i.image" alt="" /> -->
          </div>
          <a-button class="reDianBtn margin20" type="primary" @click="setFirstScene"> 设为初始场景 </a-button>
        </div>
        <div class="oneTitle">初始视角</div>
        <!-- <div class="borderImg">
          <img class="jietu" :src="data.checkedScene.jiepingUrl ? data.checkedScene.jiepingUrl : ''" alt="" />
        </div> -->
        <div class="reDianContent">
          <a-button class="reDianBtn margin20" type="primary" @click="goBack"> 回到初始视角 </a-button>
        </div>
      </a-tab-pane>
      <!-- 热点 -->
      <a-tab-pane key="热点" tab="热点" force-render>
        <!-- 热点列表 -->
        <div v-if="activeAdd">
          <div class="reDianContent">
            <a-button class="reDianBtn" type="primary" @click="addRe"> 添加热点 </a-button>
          </div>
          <div class="markerList">
            <div v-for="(i, index) in markerList" :key="index">
              <img :src="i.image" alt="" />
              <span>{{ i.tooltip }}</span>
              <!-- <span v-if="i.commodityName && i.commodityName != ''">{{ i.commodityName }}</span> -->
              <a-icon class="icon" @click="deleteM(i.id)" type="delete" />
              <a-icon class="icon" type="edit" @click="editM(i)" />
            </div>
          </div>
        </div>
        <!-- 热点编辑 -->
        <div v-if="activeEdit">
          <div>
            <div class="oneTitle">热点功能</div>
            <div class="active">
              <div class="tubiao">
                <a-select
                  class="width230"
                  placeholder="请选择切换功能"
                  style="width: 230px; margin: 20px 10px"
                  v-model="hotstopType"
                  @change="handleChangeQie"
                >
                  <a-select-option :key="index" :value="parseInt(item.value)" v-for="(item, index) in hotstopTypeList">
                    {{ item.title }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="oneTitle">选择图标</div>
            <div>
              <div class="tubiao">
                <div
                  class="iconBg"
                  :class="iconActive == index ? 'iconBor' : ''"
                  v-for="(i, index) in iconList"
                  :key="index"
                  @click="add(i.imgUrl, index)"
                >
                  <img :src="i.imgUrl" alt="" />
                </div>
              </div>
            </div>
            <!-- 切换热点 -->
            <div v-if="hotstopType === 1">
              <div class="oneTitle">热点名称</div>
              <div>
                <div class="tubiao">
                  <div>
                    <a-input class="width230" placeholder="请输入热点名称" v-model="tooltip" />
                  </div>
                </div>
              </div>
              <div class="oneTitle">目标场景</div>
              <div>
                <div class="tubiao reDianContent">
                  <!-- <a-select
                    class="width230"
                    placeholder="请选择目标场景"
                    style="width: 230px; margin: 20px 10px"
                    @change="handleChange"
                    v-model="linkSceneId"
                  >
                    <a-select-option v-for="(i, index) in data.sceneList" :key="index" :value="i.id">
                      {{ i.sceneName }}
                    </a-select-option>
                  </a-select> -->
                  <a-button class="reDianBtn margin20" type="primary" @click="showMarkerSceneList()">
                    选择目标场景
                  </a-button>
                  <div class="mubiao">{{ linkSceneName }}</div>
                </div>
              </div>
              <Selectmarker
                :sceneList="data.sceneList"
                :markerVisable="markerVisable"
                @createOk="createOk"
                @create="create"
              ></Selectmarker>
            </div>
            <!-- 商品热点 -->
            <div v-if="hotstopType === 2">
              <div class="oneTitle">商品名称</div>
              <div>
                <div class="tubiao">
                  <div>
                    <a-input class="width230" placeholder="请输入商品名称" v-model="goodsName" />
                  </div>
                </div>
              </div>
              <div class="oneTitle">商品价格</div>
              <div>
                <div class="tubiao">
                  <div>
                    <a-input class="width230" placeholder="请输入商品价格" v-model="goodsPrice" />
                  </div>
                </div>
              </div>
              <div class="oneTitle">商品图片</div>
              <div class="goodsImg">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  :action="action"
                  :headers="headers"
                  :data="dataImg"
                  :file-list="fileList"
                  :showUploadList="{ showPreviewIcon: false }"
                  :beforeUpload="handleBeforeUpload"
                  @change="handleChangeImg"
                >
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传图片</div>
                  </div>
                </a-upload>
              </div>
              <div class="oneTitle">商品链接</div>
              <div>
                <div class="tubiao">
                  <div>
                    <a-textarea class="width230" :rows="4" placeholder="请输入商品链接" v-model="goodsUrl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottomBtn">
            <a-button @click="cancelCreateMarkers">取消</a-button>
            <a-button type="primary" @click="confirmMarker"> 确认 </a-button>
          </div>
        </div>
      </a-tab-pane>
      <!-- 信息 -->
      <a-tab-pane key="信息" tab="信息">
        <div class="oneTitle">作品名称</div>
        <div>
          <div class="tubiao">
            <div>
              <a-textarea class="width230" placeholder="请输入作品名称" v-model="data.productionName" />
            </div>
          </div>
        </div>
        <div class="oneTitle">封面图</div>
        <div class="titleImg">
          <div>
            <a-upload
              name="file"
              list-type="picture-card"
              :action="action"
              :headers="headers"
              :data="dataImg"
              :showUploadList="{ showPreviewIcon: false }"
              :remove="handleFileRemove2"
              :file-list="fileList2"
              @change="handleChange2"
            >
              <div v-if="fileList2.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </div>
        </div>
        <div class="oneTitle">简介</div>
        <div>
          <div class="tubiao">
            <div>
              <a-textarea class="width230" :rows="4" placeholder="请输入作品简介" v-model="data.productionDesc" />
            </div>
          </div>
        </div>
        <!-- <div class="oneTitle">作品链接</div>
        <div>
          <div class="tubiao">
            <div>
              <a-textarea class="width230" :rows="4" v-model="data.linkUrl" disabled />
            </div>
          </div>
        </div> -->
        <div class="bottomBtn">
          <a-button class="kuanban" type="primary" @click="editProdcution"> 确认修改 </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import {
  saveHotstop,
  queryMakersBySceneId,
  deleteMarker,
  selectList,
  getHotstopTypeList,
  setFirstScene,
  uploadImg,
  editProductionMid
} from '@/api/vr'
import Selectmarker from './selectMarker'
export default {
  components: { Selectmarker },
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
      action: uploadImg,
      headers: {
        'X-Access-Token': this.$store.state.user.token
      },
      dataImg: {
        type: ''
      },
      showFile: true, // 修改默认图片状态
      fileList: [],
      fileListtype: true,
      fileList2: [],
      titleImage: '',
      activeAdd: true,
      activeEdit: false,
      iconList: [],
      tooltip: '', // 名字
      hotstopType: undefined, // 热点类型
      linkSceneId: '', // 目标路径
      linkSceneName: '', // 目标路径名字
      goodsName: '',
      goodsUrl: '',
      goodsImage: '',
      goodsPrice: '',
      iconActive: null, // 热点选中状态
      markerVisable: false, // 热点跳转场景状态切换
      // 当前编辑热点id
      hotstopId: '',
      markerList: [],
      // 热点类型列表
      hotstopTypeList: [
        { title: '场景', value: 1 },
        { title: '商品', value: 2 }
      ],
      // 编辑热点标识
      editHotstopFlag: false,
      // 当前编辑热点
      currentEditHotstop: {}
    }
  },
  watch: {
    'data.checkedScene': {
      handler(newVal, oldVal) {
        if (this.config.activeKey === '热点') {
          this.tabs('热点')
        } else {
          this.getMarkers()
        }
      }
    },
    'data.coverUrl': {
      handler(newVal, oldVal) {
        this.getfilelist(newVal)
      }
    }
  },
  methods: {
    // 设置为第一场景
    async setFirstScene() {
      const params = {
        id: this.data.checkedScene.id
      }
      const that = this
      const res = await setFirstScene(params)
      if (res.success === true) {
        that.$message.success('初始场景设置成功')
        that.$parent.refreshSceneList()
      } else {
        that.$message.error('初始场景设置失败')
      }
    },
    handleBeforeUpload(file, fileList) {
      // this.fileList = fileList;
      return new Promise((resolve, reject) => {
        if (this.fileList.length > 0) {
          this.$message.warning('最多只能上传一张！')
          this.fileListtype = false
        }
        resolve(true)
        this.showFile = false
      })
    },
    handleChangeImg(e) {
      if (e && e.fileList) {
        this.fileList = e.fileList
      }
    },
    handleFileRemove(file) {
      this.fileListtype = false
    },
    getHotstopTypeList() {
      const that = this
      getHotstopTypeList({ code: 'VR_HOTSTOP_TYPE' }).then((res) => {
        that.hotstopTypeList = res
        console.log(this.hotstopTypeList)
      })
    },
    async getIconList() {
      const res = await selectList()
      if (res.success === true) {
        this.iconList = res.data
      }
    },
    // 修改tabs视角
    tabs(activeKey) {
      this.config.activeKey = activeKey
      this.activeAdd = true
      this.activeEdit = false
      this.iconActive = null
      this.config.isEditMarker = false
      if (this.editHotstopFlag) {
        this.editHotstopFlag = false
        this.$emit('cancelEditMarkers', this.currentEditHotstop)
      } else {
        this.$emit('cancelCreateMarkers')
      }
      this.getMarkers()
    },
    // 回到初始视角
    goBack() {
      this.$parent.goback()
    },
    // 添加热点
    addRe() {
      this.activeAdd = false
      this.activeEdit = true
      this.config.isEditMarker = false
      // 添加热点前置空
      this.tooltip = '' // 名字
      this.hotstopType = undefined // 类型
      this.linkSceneId = '' // 目标路径
      this.linkSceneName = '' // 目标路径名字
      this.goodsImage = '' // 商品图片地址信息
      this.goodsUrl = '' // 商品链接信息
      this.goodsName = '' // 商品名字
      this.goodsPrice = '' // 商品价格
      this.fileList = []
      this.hotstopId = ''
      this.markerList = []
      this.$emit('addIsEditMarker')
    },
    // 取消创建热点
    cancelCreateMarkers() {
      // 置空热点数据信息
      this.hotstopType = ''
      this.tooltip = ''
      this.goodsImage = '' // 商品图片地址信息
      this.goodsUrl = '' // 商品链接信息
      this.goodsName = '' // 商品名字
      this.goodsPrice = '' // 商品价格
      this.fileList = []
      this.linkSceneId = ''
      this.hotstopId = ''

      this.activeAdd = true
      this.activeEdit = false
      this.isEditMarker = false
      this.config.isEditMarker = false
      if (this.editHotstopFlag) {
        this.editHotstopFlag = false
        this.$emit('cancelEditMarkers', this.currentEditHotstop)
      } else {
        this.$emit('cancelCreateMarkers')
      }
      this.getMarkers()
    },
    // 获取标记点
    async getMarkers() {
      const id = this.data.checkedScene.id
      const pramse = {
        sceneId: id
      }
      const res = await queryMakersBySceneId(pramse)
      window.console.log(res)
      if (res.success === true) {
        this.markerList = res.data
      }
    },
    // 添加标记点
    add(img, index) {
      this.iconActive = index
      this.$emit('addBiao', img)
    },
    handleChangeQie(value) {
      this.hotstopType = value
    },
    // handleChange(value) {
    //   this.linkSceneId = value
    // },
    showMarkerSceneList() {
      this.markerVisable = true
    },
    create() {
      this.markerVisable = false
    },
    createOk(item) {
      this.markerVisable = false
      this.linkSceneId = item.id
      this.linkSceneName = item.sceneName
    },
    // 确认创建标记点
    async confirmMarker() {
      if (!this.hotstopType || this.hotstopType === '') {
        this.$message.warning('热点功能不能为空')
        return
      }
      if (!this.data.markerData.image || this.data.markerData.image === '') {
        this.$message.warning('请选择热点图片')
        return
      }
      if (this.hotstopType === 1) {
        if (!this.tooltip || this.tooltip === '') {
          this.$message.warning('热点名称不能为空')
          return
        }
        if (!this.linkSceneId || this.linkSceneId === '') {
          this.$message.warning('目标场景不能为空')
          return
        }
      } else {
        if (!this.goodsName || this.goodsName === '') {
          this.$message.warning('商品名称不能为空')
          return
        }
        if (!this.goodsPrice || this.goodsPrice === '') {
          this.$message.warning('商品价格不能为空')
          return
        }
        if (!this.fileList[0]?.response || !this.fileList[0]?.response === '') {
          this.$message.warning('图片地址不能为空')
          return
        }
        if (!this.goodsUrl || this.goodsUrl === '') {
          this.$message.warning('商品链接不能为空')
          return
        }
      }
      const pramse = {
        productionId: this.data.productionId,
        createTime: '',
        commodityImg: this.fileList[0]?.response, // 商品图片地址信息
        commodityLinkUrl: this.goodsUrl, // 商品链接信息
        commodityName: this.goodsName, // 商品名字
        commodityPrice: this.goodsPrice, // 商品价格
        width: this.data.markerData.width,
        height: this.data.markerData.height,
        hotstopId: '',
        hotstopType: this.hotstopType,
        image: this.data.markerData.image,
        latitude: this.data.markerData.latitude,
        linkSceneId: this.linkSceneId,
        longitude: this.data.markerData.longitude,
        sceneId: this.data.checkedScene.id,
        tooltip: this.goodsName && this.goodsName !== '' ? this.goodsName : this.tooltip
      }
      if (this.hotstopId && this.hotstopId !== '') {
        pramse.id = this.hotstopId
      }
      const res = await saveHotstop(pramse)
      console.log(res)
      if (res.success === true) {
        this.activeAdd = true
        this.activeEdit = false
        // 刷新热点列表
        this.getMarkers()
        // 修改新增热点的状态和id(改成数据库中的id)
        if (this.editHotstopFlag) {
          this.$parent.editCreateType()
        } else {
          this.$parent.editCreateType(res.data)
        }
        this.editHotstopFlag = false
        this.showFile = true
      }
      this.isEditMarker = false
      this.config.isEditMarker = false
    },
    // 删除标记点
    deleteM(id) {
      const pramse = {
        id: id
      }
      const that = this
      this.$confirm({
        title: '是否删除当前热点?',
        okText: '是',
        okType: 'primary',
        cancelText: '否',
        onOk: async () => {
          const res = await deleteMarker(pramse)
          if (res.success === true) {
            that.getMarkers()
            that.$parent.deleteMarker(id)
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },

    // 修改标记点(视角移动到指定标记点，并将指定标记点置为可修改状态)
    editM(hotstop) {
      if (!this.config.isEditMarker) {
        this.currentEditHotstop = JSON.parse(JSON.stringify(hotstop)) // 深拷贝;
        this.editHotstopFlag = true
        // 视角转到指定的热点上，并使指定热点可以移动
        this.$parent.editMarker(hotstop.id)
        // 展示编辑热点表单
        this.activeAdd = false
        this.activeEdit = true
        this.config.isEditMarker = true
        // 赋值,显示当前选中的热点信息
        this.fileList = [
          { uid: '-1', name: 'image.png', status: 'done', url: hotstop.commodityImg, response: hotstop.commodityImg }
        ]
        this.hotstopType = hotstop.hotstopType
        this.tooltip = hotstop.tooltip
        this.linkSceneId = hotstop.linkSceneId
        this.hotstopId = hotstop.id
        this.goodsName = hotstop.commodityName
        this.goodsUrl = hotstop.commodityLinkUrl
        this.goodsImage = hotstop.commodityImg
        this.goodsPrice = hotstop.commodityPrice
        // 设置当前选中的热点信息
        this.$emit('setMarkerData', hotstop)
      } else {
        this.$message.warning('请保存当前编辑热点')
      }
    },
    getfilelist(url) {
      this.fileList2 = []
      this.fileList2.push({ uid: '-1', name: 'image.png', status: 'done', url: url })
    },
    handleFileRemove2() {
      this.fileList2 = []
    },
    // 作品信息修改
    handleChange2({ fileList }) {
      this.fileList2 = fileList
    },
    async editProdcution() {
      const pramse = {
        productionId: this.data.productionId,
        productionName: this.data.productionName,
        productionDesc: this.data.productionDesc, // 作品描述
        coverUrl: this.fileList2[0].response // 封面图
      }
      const res = await editProductionMid(pramse)
      if (res.success === true) {
        this.$message.success('修改成功')
      }
    }
  },
  created() {
    this.getIconList()
    // this.getHotstopTypeList()
  }
}
</script>

<style lang="less" scoped>
.oneTitle {
  padding-left: 20px;
}
.oneTitle::before {
  content: '';
  width: 4px;
  height: 16px;
  display: inline-block;
  border-radius: 2px;
  background: #ff6b00;
  position: relative;
  top: 3px;
  left: -10px;
}
.borderImg {
  width: 230px;
  height: 150px;
  border: 1px solid rgb(255, 150, 150);
  border-radius: 4px;
  margin: 10px auto;
}
.reDianContent {
  text-align: center;
  .reDianBtn {
    width: 90%;
    margin: 0 auto;
  }
  .margin20 {
    margin: 20px 0;
  }
}
.goodsImg {
  padding: 10px 20px;
}
.tubiao {
  margin-left: 10px;
  .iconBor {
    border: 1px solid #ff6b00;
  }
  div {
    margin: 10px;
    display: inline-block;
    background: #ccc;
    border-radius: 4px;
    img {
      width: 40px;
      height: 40px;
    }
    .width230 {
      width: 230px;
    }
  }
  .mubiao {
    background: #ececec;
    padding: 5px 0;
    width: 90%;
  }
  .activeBorder {
    border: 1px solid rgb(255 77 79);
  }
}
.bottomBtn {
  text-align: center;
  margin: 40px 0;
  .ant-btn {
    margin: 0 10px;
    width: 100px;
  }
  .kuanban {
    margin: 0;
    width: 230px;
  }
}
.markerList {
  padding: 15px 15px 0 15px;
  div {
    margin-top: 10px;
    img {
      background: #ccc;
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }
    span {
      width: 120px;
      height: 30px;
      display: inline-block;
      margin-left: 10px;
    }
    .icon {
      font-size: 18px;
      padding: 10px 0 10px 10px;
      float: right;
      color: #ff6b00;
    }
  }
}

.jianImg {
  width: 100%;
  height: 100%;
}
.jietu {
  width: 100%;
  height: 100%;
}
.linshiImg {
  height: 66px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 230px;
  margin-left: 18px;
}
.cmImg {
  height: 60px;
  width: 60px;
  padding: 7px;
}
.titleImg {
  margin: 20px;
  height: 150px;
}
.titleImg /deep/.ant-upload-list-picture-card .ant-upload-list-item {
  width: 230px;
  height: 150px;
}
/deep/ .ant-tabs {
  overflow-y: scroll;
  height: 100%;
}
/deep/ .ant-tabs-nav .ant-tabs-tab {
  font-weight: 600;
}
</style>
