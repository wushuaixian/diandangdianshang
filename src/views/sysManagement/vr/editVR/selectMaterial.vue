<template>
  <div class="ant-modal-header" ref="refModel">
    <a-modal
      width="1000px"
      :visible="selectMaterialParam.showSelectMaterial"
      centered
      :bodyStyle="modelCss"
      @cancel="cancleCreateProduction()"
      @ok="createProduction()"
    >
      <template slot="title">
        <span>选取素材</span>
        <a-upload
          name="file"
          :multiple="true"
          :data="handlerUploadData"
          :action="uploadImg"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :showUploadList="false"
          @change="handleUploadChange"
        >
          <a-button type="primary" style="margin-left: 30px"><a-icon type="upload"></a-icon> 上传 </a-button>
        </a-upload>
      </template>
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }" :data-source="materialList">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card
            class="card-con"
            :body-style="{ padding: '0px 0px 0px 0px' }"
            @mouseenter="mouseenter($event)"
            @mouseleave="mouseleave($event)"
          >
            <template>
              <div class="card-body-con">
                <a-checkbox
                  class="checkXuan"
                  @change="selectMaterial"
                  :value="item.id"
                  :disabled="item.disabled"
                  :checked="item.checked"
                  name="type"
                >
                </a-checkbox>
                <div
                  v-if="item.status == 'error'"
                  slot="cover"
                  style="height: 160px; background: #e9e9e9; position: relative"
                >
                  <def-svg class="defSvg"></def-svg>
                </div>
                <a-spin
                  v-if="item.status == 'loading'"
                  slot="cover"
                  tip="Loading..."
                  style="height: 160px; width: 100%; text-align: center"
                >
                  图片上传中...
                </a-spin>
                <img v-if="item.coverUrl" slot="cover" alt="example" width="100%" height="160px" :src="item.coverUrl" />
                <!-- <div slot="cover" class="iconStyle">
                  <div>
                    <a-icon style="margin: 0px 10px; color: #fff" type="delete" @click="deleteOne(item.id)"></a-icon>
                  </div>
                </div>-->
              </div>
              <a-card-meta class="contentTitle" :title="item.materialName ? item.materialName : '图片上传中'">
                <template slot="description">
                  {{ item.createTime ? mountjs(item.createTime) : '图片上传中' }}
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
import { getIconList, delIcon, signalUploadImg } from '@/api/vr'
import defSvg from '@assets/images/shibai.svg?inline'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: '1' // 1 创建作品 2 添加选中场景
    },
    selectMaterialParam: {
      type: Object,
      default: () => {}
    },
    merchantId: {
      // 选中场景ID
      type: String,
      default: ''
    },
    // 外部选中的素材
    selectMerchantIdList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      uploadImg: signalUploadImg,
      modal1Visible: true,
      modal2Visible: true,
      // 素材列表
      materialList: [],
      // 选中的素材列表
      checkedMaterialList: [],
      // 素材列表查询参数
      param: {
        materialName: '',
        manufactureId: ''
      },
      fileList: [],
      modelCss: {
        height: '500px',
        'overflow-y': 'scroll'
      }
    }
  },
  methods: {
    setModal1Visible(modal1Visible) {
      this.modal1Visible = modal1Visible
    },
    // 勾选素材
    selectMaterial(e) {
      const checkedId = e.target.value
      console.log(e)
      if (e.target.checked) {
        this.checkedMaterialList.push(checkedId)
        const temp = this.materialList.find((item) => item.id === checkedId)
        temp.checked = true
        this.$forceUpdate()
      } else {
        this.checkedMaterialList.splice(this.checkedMaterialList.findIndex((item) => item === checkedId))
        const temp = this.materialList.find((item) => item.id === checkedId)
        temp.checked = false
        this.$forceUpdate()
      }
    },
    // 点击确定
    createProduction() {
      if (this.checkedMaterialList.length > 0) {
        this.$emit('create', this.checkedMaterialList)
        this.checkedMaterialList = []
        this.clearCheckedItem()
      } else {
        this.$message.warning('请选择一个素材')
      }
    },
    // 点击取消
    cancleCreateProduction() {
      this.checkedMaterialList = []
      this.clearCheckedItem()
      this.$emit('cancel')
    },
    // 判断是否可以勾选
    judgeIsDisabled(materialId) {
      if (this.selectMaterialParam.selectedMaterialId.length > 0) {
        const flag = this.selectMaterialParam.selectedMaterialId.includes(materialId)
        return flag
      }
      return false
    },
    // 清空勾选项
    clearCheckedItem() {
      const tempArr = []
      for (const item of this.materialList) {
        item.checked = false
        tempArr.push(item)
      }
      this.materialList = tempArr
    },
    // 上传文件之前带上id
    handlerUploadData(file) {
      const data = {
        merchantId: this.merchantId
      }
      return data
    },
    // 在上传文件之前将文件列表暂存到素材列表中
    beforeUpload(info) {
      const obj = {
        lastModified: info.lastModified,
        name: info.name,
        size: info.size,
        type: info.type,
        status: 'loading',
        uid: info.uid,
        webkitRelativePath: info.webkitRelativePath
      }
      this.materialList.unshift(obj)
    },
    // 此方法在文件上传中 上传成功 上传失败均会调用
    handleUploadChange(info) {
      if (info.file.status === 'done') {
        this.changePictureStatus(info.file.uid, 'done', info.file.response)
        this.$message.success(`${info.file.name} 成功上传`)
        // return true
      } else if (info.file.status === 'error') {
        this.changePictureStatus(info.file.uid, 'error')
        this.$message.error(`${info.file.name} 上传失败`)
        // return false
      }
      this.fileList = info.fileList
    },
    // 遍历数据列表 改变状态
    changePictureStatus(id, status, itemInfo) {
      this.materialList.forEach((item, index) => {
        if (item.status) {
          if (id === item.uid) {
            item.status = status
            if (status === 'done') {
              Object.assign(item, itemInfo.data)
            }
          }
        }
      })
    },
    // 将时间戳改为时间
    mountjs(text) {
      if (typeof text === 'number') {
        text = Number(text)
        const y = new Date(text).getUTCFullYear()
        const m = new Date(text).getMonth() + 1
        const d = new Date(text).getDate()
        const h = new Date(text).getHours()
        const mm = new Date(text).getMinutes()
        const s = new Date(text).getSeconds()
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
      } else {
        return '正在上传中'
      }
    },
    mouseenter($event) {
      $event.target.className = 'card-con ant-card ant-card-bordered active'
    },
    mouseleave($event) {
      $event.target.className = 'card-con ant-card ant-card-bordered leave'
    },
    deleteOne(id) {
      console.log(id)
      const that = this
      this.$confirm({
        // 非0直接走submit  因为submit直接通过
        title: '确认是否要删除?',
        content: (h) => <div style="color:red;"></div>,
        async onOk() {
          delIcon({ merchantId: that.merchantId, id: id }).then((res) => {
            console.log(res)
            that.$message.success('888')
          })
        },
        onCancel() {},
        class: 'test'
      })
    },
    fetch(id) {
      getIconList({ merchantId: id }).then((res) => {
        this.materialList = res.data
        for (const item of this.materialList) {
          item.checked = false
        }
        this.contrastChecked()
      })
    },
    contrastChecked() {
      this.materialList.forEach((item) => {
        for (const arrItem of this.selectMerchantIdList) {
          if (arrItem === item.id) {
            item.checked = true
            item.disabled = true
          }
        }
      })
    }
  },
  mounted() {},
  components: {
    defSvg
  },
  watch: {
    'selectMaterialParam.manufacturerId': {
      handler(newVal, oldVal) {
        const that = this
        that.param.manufactureId = newVal
        // selectMaterialByManufactureId(that.param).then((res) => {
        //   if (res.success) {
        //     if (res.result) {
        //       that.materialList = res.result.map((item) => ({
        //         materialId: item.materialId,
        //         checked: false,
        //         disabled: that.judgeIsDisabled(item.materialId),
        //         coverUrl: item.coverUrl,
        //         materialName: item.materialName,
        //         creationTime: item.creationTime
        //       }))
        //     }
        //   }
        // })
      }
    },
    selectMerchantIdList: {
      handler(newVal) {
        this.contrastChecked()
      }
    }
  }
}
</script>
<style lang="less" scope>
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
.defSvg {
  position: absolute;
  top: 67px;
  left: 40%;
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
