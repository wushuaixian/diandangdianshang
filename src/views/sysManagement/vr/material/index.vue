<template>
  <div>
    <a-card>
      <div class="h40">
        <a-breadcrumb>
          <a-breadcrumb-item v-for="(i, index) of navigationList" :key="index">
            <i class="btnPointer" @click="getFolder(i.type, i.id)">{{ i.name }}</i>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="filter-container flex">
        <div class="customUpload">
          <a-upload
            name="file"
            :multiple="true"
            :data="handlerUploadData"
            :action="uploadImg"
            :headers="headers"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :showUploadList="false"
            @change="handleUploadChange"
          >
            <a-button type="primary" :disabled="disabled"><a-icon type="upload"></a-icon> 上传 </a-button>
          </a-upload>
        </div>
        <a-select
          show-search
          label-in-value
          placeholder="请选择供应商"
          class="width300px"
          :filter-option="filterOption"
          @change="selectChange"
        >
          <a-select-option v-for="item in merchantList" :key="item.merchantId">{{ item.merchantName }}</a-select-option>
        </a-select>
      </div>
      <div class="picture-list">
        <a-list
          class="width100"
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 6 }"
          :data-source="pictureList"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card
              :bodyStyle="{ background: '#F9F9F9', padding: '10px' }"
              hoverable
              @mouseenter="mouseenter($event)"
              @mouseleave="mouseleave($event)"
            >
              <div slot="cover" class="iconStyle">
                <div>
                  <a-icon class="margin-10" type="edit" @click="editOne(item)"></a-icon>
                  <a-icon class="margin-10" type="delete" @click="deleteOne(item.id)"></a-icon>
                </div>
              </div>
              <div v-if="item.status == 'error'" slot="cover" class="backgroundFFF">
                <def-svg class="defSvg"></def-svg>
              </div>
              <a-spin v-if="item.status == 'loading'" slot="cover" tip="Loading..." class="spin">
                图片上传中...
              </a-spin>
              <img
                v-if="item.coverUrl"
                slot="cover"
                alt="example"
                width="245px"
                height="219px"
                :src="item.coverUrl ? item.coverUrl : item.url"
              />
              <div solt="title" class="font-14">{{ item.materialName ? item.materialName : '图片上传中' }}</div>
              <a-card-meta>
                <template slot="description" class="background999">
                  {{ item.createTime ? $options.filters['moment'](item.createTime) : '图片上传中' }}
                </template>
              </a-card-meta>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </a-card>
    <a-modal title="重命名" v-model="visibleTitle" @cancel="cancelTitle" @ok="editTitle">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="新名称">
          <a-input v-model="deitTitle" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import defSvg from '@assets/images/shibai.svg?inline'
import { getIconList, getMerchantList, delIcon, editIconTilte, signalUploadImg } from '@/api/vr.js'
export default {
  data() {
    return {
      uploadImg: signalUploadImg,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      navigationList: [{ name: '叮当电商素材库', id: '1', type: '2' }],
      action: '',
      headers: {
        authorization: 'authorization-text'
      },
      data: {
        type: ''
      },
      fileList: [],
      pictureList: [], // 图片数据
      merchantList: [], // 供应商列表
      visible: false,
      visibleTitle: false,
      config: {},
      temp: '',
      selectMerchart: { key: 0 },
      editId: null,
      deitTitle: null,
      fetching: false,
      disabled: true
    }
  },
  components: {
    defSvg
  },
  created() {
    this.fetchUser()
  },
  methods: {
    getFolder(type, id) {
      if (type === 2) {
        this.folderId = ''
        this.listData.pageNo = 1 // 新建返回首页
        // this.materialNum = 0;
        this.getList()
      } else {
        this.folderId = id
        this.listData.pageNo = 1 // 新建返回首页
        // this.materialFolderNum = 0;
        this.getFolderChildList()
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleOk() {
      this.visible = true
    },
    handleSubmit() {},
    mouseenter($event) {
      $event.currentTarget.className = 'ant-card ant-card-bordered ant-card-hoverable border-radius active'
    },
    mouseleave($event) {
      $event.currentTarget.className = 'ant-card ant-card-bordered ant-card-hoverable border-radius leave'
    },
    showModal() {
      // 上传文件素材方法
      this.visible = true
      // this.type = type
      // this.config = {}
      // this.config.manufactureId = this.param.manufactureId
      // const item = this.manufactureList.filter((item) => item.manufactureId === this.param.manufactureId)
      // this.config.libraryId = item[0].libraryId
      // this.edit = false
    },
    handleFileRemove(file) {
      this.fileListtype = false
    },
    handleChange(e) {},
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
    changePictureStatus(id, status, itemInfo) {
      this.pictureList.forEach((item, index) => {
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
    beforeUpload(file) {
      const obj = {
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'loading',
        uid: file.uid,
        webkitRelativePath: file.webkitRelativePath
      }
      this.pictureList.unshift(obj)
      // return new Promise((resolve, reject) => {

      //   resolve(file)
      //   // resolve(info)
      // })
    },
    selectChange(value) {
      console.log(value)
      this.selectMerchart = value
      this.getMerchant({ merchantName: value.label })
    },
    deleteOne(id) {
      const that = this
      this.$confirm({
        title: '确认是否要删除?',
        content: (h) => <div style="color:red;"></div>,
        async onOk() {
          await delIcon({ id: id, isDeleted: 1 })
          that.$message.success('删除成功')
          that.getIcon(that.selectMerchart.key)
        },
        onCancel() {},
        class: 'test'
      })
    },
    editOne(item) {
      this.visibleTitle = true
      this.editId = item.id
      this.deitTitle = item.materialName
    },
    cancelTitle() {
      this.visibleTitle = false
    },
    fetchUser(value) {
      if (value !== '') {
        this.getMerchant()
      }
    },
    getIcon(id) {
      const data = { merchantId: id }
      getIconList(data).then((res) => {
        this.pictureList = res.data
      })
    },
    // 获取供应商列表
    async getMerchant(data) {
      await getMerchantList(data).then((res) => {
        this.merchantList = res.data
        this.fetching = false
      })
    },
    editTitle() {
      const data = { id: this.editId, materialName: this.deitTitle }
      editIconTilte(data).then((res) => {
        if (res.success === true) {
          this.$message.success('修改成功')
          this.getIcon(this.selectMerchart.key)
        } else {
          this.$message.error(res.message)
        }
        this.visibleTitle = false
      })
    },
    handlerUploadData(file) {
      const data = {
        merchantId: this.selectMerchart.key
      }
      return data
    }
  },
  watch: {
    selectMerchart: {
      handler(newVal) {
        if (newVal.key === '') {
          this.disabled = true
        } else {
          this.disabled = false
        }
        this.getIcon(newVal.key)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.filter-container {
  margin-bottom: 20px;
}
.h40 {
  height: 40px;
}
.btnPointer {
  cursor: pointer;
}
.card-con {
  position: relative;
  border: 5px solid #f4f4f4;
  background: #f4f4f4;
  border-radius: 5px;
}
.icon-delete {
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 18px;
}
.icon-edit {
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 18px;
  right: 30px;
}
.icon-folder {
  font-size: 7em;
  color: #eac547;
}
.card-body-con {
  display: flex;
  background: #fff;
  padding: 10px;
  justify-content: center;
  align-items: center;
  height: 120px;
  margin-bottom: 15px;
  overflow: hidden;
}
.clear:after {
  content: '.';
  display: block;
  height: 0;
  overflow: hidden;
  clear: both;
}
.picture-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.picture-list {
  /deep/.ant-card-cover {
    position: relative;
    overflow: hidden;
  }
}
.iconStyle {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 30px;
  line-height: 30px;
  top: 219px;
  right: 0px;
  font-size: 20px;
  display: flex;
  justify-content: flex-end;
  color: #fff;
  z-index: 2;
}
.active {
  .iconStyle {
    animation: drop 0.5s;
    top: 189px;
  }
}
.leave {
  .iconStyle {
    animation: dropLeave 0.5s;
    top: 219px;
    display: none;
  }
}
.flex {
  display: flex;
  justify-content: space-between;
}
.defSvg {
  position: absolute;
  top: 84px;
  left: 37%;
}
.margin-10 {
  margin: 0 10px;
}
.backgroundFFF {
  height: 219px;
  background: #e9e9e9;
  position: relative;
}
.width100 {
  width: 100%;
}
.width300px {
  width: 300px;
}
.border-radius {
  border-radius: 10px 10px 0 0;
}
.spin {
  height: 219px;
  width: 100%;
  text-align: center;
}
.font-14 {
  font-size: 14px;
  margin-bottom: 6px;
}
.background999 {
  color: #999999;
  font-size: 12px;
}
@keyframes drop {
  from {
    top: 219px;
  }
  to {
    top: 189px;
  }
}
@keyframes dropLeave {
  from {
    top: 189px;
  }
  to {
    top: 219px;
  }
}
</style>
