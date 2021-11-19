<template>
  <div class="side-bar">
    <div class="title">
      <span>场景</span>
      <div class="nav-icon">
        <a-icon class="sideBarIcon" type="plus-circle" theme="filled" @click="createScene()" />
      </div>
    </div>
    <div>
      <div v-for="(i, index) in data.sceneList" :key="index">
        <div class="imgCard" @click="changeSelectedScene(i, index)">
          <div class="imgBorder" :class="{ active: currentIndex === index }">
            <div class="deleScen" @click.stop="deleteScene(i.id, index)">
              <a-icon class="icon" type="delete" />
            </div>
            <img :src="i.coverUrl" alt="" />
          </div>
          <p>{{ i.sceneName }}</p>
        </div>
      </div>
    </div>
    <!-- 选择素材modal -->
    <select-material
      ref="selectMaterial"
      :selectMaterialParam="selectMaterialParam"
      :selectMerchantIdList="getSelectIdList"
      :merchantId="getId"
      @cancel="handleCancel"
      @create="handleCreate"
    />
  </div>
</template>

<script>
import { getSelectList, insertSelective, deleteById } from '@/api/vr'
import selectMaterial from './selectMaterial'
export default {
  components: {
    selectMaterial // 选择物料弹框
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentIndex: 0,
      // 选择素材输入参数
      selectMaterialParam: {
        // 是否展示素材弹框
        showSelectMaterial: false,
        // 当前厂商id
        manufacturerId: '',
        // 已选择的素材id
        selectedMaterialId: []
      }
    }
  },
  mounted() {},
  methods: {
    async refreshSceneList() {
      const params = { productionId: this.data.productionId }
      const res = await getSelectList(params)
      if (res.success === true) {
        this.data.sceneList = res.data
        this.selectMaterialParam.showSelectMaterial = false
      }
      this.currentIndex = 0
    },
    changeSelectedScene(sceneInfo, index) {
      if (sceneInfo.id !== this.data.checkedScene.id) {
        this.$emit('changeScene', sceneInfo)
      }
      this.currentIndex = index
    },
    createScene() {
      this.selectMaterialParam.selectedMaterialId = this.data.sceneList.map((value, index) => value.materialId)
      this.selectMaterialParam.showSelectMaterial = true
      this.selectMaterialParam.manufacturerId = this.selectMaterialParam.selectedMaterialId
      this.$refs.selectMaterial.fetch(this.data.manufacturerId)
    },
    // 在作品下新增场景
    async handleCreate(checkedMaterialList) {
      const that = this
      // const param = {
      //   productionId: this.data.productionId,
      //   materialId: checkedMaterialList,
      //   orderSort: 1
      // }
      const arr = []
      checkedMaterialList.forEach((item, index) => {
        arr.push({
          productionId: this.data.productionId,
          materialId: item,
          orderSort: index + 1
        })
      })

      const res = await insertSelective(arr)
      if (res.success) {
        that.selectMaterialParam.showSelectMaterial = false
        const params = { productionId: this.data.productionId }
        const res = await getSelectList(params)
        if (res.success === true) {
          that.data.sceneList = res.data
        }
      }
    },
    // 取消选择场景
    handleCancel() {
      this.selectMaterialParam.showSelectMaterial = false
    },
    // 根据作品id选择作品下的场景
    getScenesListByProductionId() {},
    // 删除场景
    async deleteScene(id, index) {
      const param = {
        id: id
      }
      const res = await deleteById(param)
      window.console.log(res)
      if (res.success === true) {
        const params = { productionId: this.data.productionId }
        const res = await getSelectList(params)
        if (res.success === true) {
          this.data.sceneList = res.data
          this.selectMaterialParam.showSelectMaterial = false
          if (this.currentIndex > index) {
            this.currentIndex -= 1
          } else if (this.currentIndex === index) {
            this.currentIndex = ''
          }
        }
      } else {
      }
    }
  },
  computed: {
    getId() {
      return this.data.manufacturerId
    },
    getSelectIdList() {
      return this.selectMaterialParam.selectedMaterialId
    }
  }
}
</script>

<style lang="less" scoped>
.side-bar {
  width: 180px;
  background: #fff;
  position: relative;
  overflow-y: auto;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  .sideBarIcon {
    color: #ff6b00;
    background: #fff;
    border-radius: 50%;
    font-size: 18px;
  }
}

.side-bar .title {
  padding: 10px 10px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  font-weight: 700;
  background: #d8d8d8;
  margin-bottom: 10px;
}

.side-bar .nav-con {
  overflow-x: hidden;
  overflow-y: auto;
}
.nav-con .nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}
.nav-con .nav:hover {
  background: #f5f5f5;
}

.nav-text {
  font-size: 13px;
}
.nav-text i {
  color: #999999;
  margin-right: 3px;
}
.nav-text span {
  color: #333;
}
.nav-icon {
  color: #636363;
}
.imgCard {
  .imgBorder {
    width: 140px;
    height: 140px;
    margin: 0 auto;
    border-radius: 7px;
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      object-fit: cover;
    }
    .deleScen {
      position: absolute;
      width: 100%;
      text-align: center;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      top: -22px;
      transition: all 0.5s;
    }
  }
  p {
    padding: 5px 0 5px 16px;
  }
  .active {
    border: 2px solid #ff6b00;
  }
}
.imgCard:hover {
  .deleScen {
    top: 0px;
  }
}
</style>
