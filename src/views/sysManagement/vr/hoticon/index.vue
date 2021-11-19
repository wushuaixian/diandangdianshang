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
            action="http://172.31.30.163:8002/vrIcon/add"
            :headers="headers"
            :file-list="fileList"
            :showUploadList="false"
            @change="handleUploadChange"
          >
            <a-button type="primary"><a-icon type="upload" ></a-icon> 上传 </a-button>
          </a-upload>
        </div>
        <a-select
          show-search
          style="width: 200px"
          option-filter-prop="children"
          :filter-option="filterOption"
        >
          <a-select-option value="jack">
            Jack
          </a-select-option>
          <a-select-option value="lucy">
            Lucy
          </a-select-option>
        </a-select>
      </div>
      <div class="picture-list clear">
        <div class="picture-item" v-for="(item, index) in pictureListLoad" :key="index" >
          <a-card :bodyStyle="{background:'#F9F9F9',padding:'10px'}" hoverable style="border-radius:10px 10px 0 0;" @mouseenter="mouseenter($event)" @mouseleave="mouseleave($event)" >
            <div slot="cover" class="iconStyle">
              <div>
                <a-icon style="margin:0px 10px" type="edit"></a-icon>
                <a-icon style="margin:0px 10px" type="delete"></a-icon>
              </div>
            </div>
            <img
              v-if="item.status=='done'"
              slot="cover"
              alt="example"
              :src="item.response.url"
            />
            <div slot="cover" style="height:100px;background:#E9E9E9;position:relative"><def-svg class="defSvg"></def-svg></div>
            <!--<div solt="title" style="font-size:14px;margin-bottom:6px">素材</div>
            <a-card-meta >
              <template slot="description" style="color:#999999;font-size:12px">
                2020.06.25
              </template>
            </a-card-meta>-->
          </a-card>
        </div>
        <div class="picture-item" v-for="(item, index) in pictureList" :key="index" >
          <a-card :bodyStyle="{background:'#F9F9F9',padding:'10px'}" hoverable style="border-radius:10px 10px 0 0;" @mouseenter="mouseenter($event)" @mouseleave="mouseleave($event)" >
            <div slot="cover" class="iconStyle">
              <div>
                <a-icon style="margin:0px 10px" type="delete" @click="deleteOne(item.iconId)"></a-icon>
              </div>
            </div>
            <img
              v-if="item.iconPath"
              slot="cover"
              alt="example"
              height="100px"
              :src="item.iconPath"
            />
            <div v-else slot="cover" style="height:100px;background:#E9E9E9;position:relative"><def-svg class="defSvg"></def-svg></div>
            <!--<div solt="title" style="font-size:14px;margin-bottom:6px">素材</div>
            <a-card-meta >
              <template slot="description" style="color:#999999;font-size:12px">
                2020.06.25
              </template>
            </a-card-meta>-->
          </a-card>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import defSvg from '@assets/images/shibai.svg?inline'
import { getIconList, delIconOne } from '@/api/vr.js'
export default {
  data() {
    return {
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
      pictureListLoad: [], // 预加载图片列表
      pictureList: [], // 图片数据
      visible: false,
      config: {},
      timer: null,
      oldTimestamp: 0
    }
  },
  components: {
    defSvg
  },
  created() {
    this.getIcon()
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
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleOk() {
      this.visible = true
    },
    handleSubmit() {

    },
    mouseenter($event) {
      $event.currentTarget.className = 'ant-card ant-card-bordered ant-card-hoverable active'
    },
    mouseleave($event) {
      $event.currentTarget.className = 'ant-card ant-card-bordered ant-card-hoverable leave'
    },
    showModal() { // 上传文件素材方法
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
    handleChange(e) {
      window.console.log(e)
    },
    handleUploadChange(info) {
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 成功上传`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      } else if (info.file.status === 'loading') {
        this.$message.error(`${info.file.name} 上传中`)
      }
      this.fileList = info.fileList
    },
    deleteOne(id) {
      const param = { ids: id }
      delIconOne(param).then((res) => {
        console.log('1')
      })
    },
    getIcon() {
      const data = {}
      getIconList(data).then((res) => {
        console.log(res)
        this.pictureList = res.data
      })
    }
  },
  watch: {
    fileList: function (newVal) {
      this.pictureListLoad = newVal
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('请求接口')
      }, 1000)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
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
  content:".";
  display:block;
  height:0;
  overflow:hidden;
  clear:both
}
.picture-list{
  display:flex;
  justify-content:flex-start;
  flex-wrap:wrap;
}
.picture-item{
  width:100px;
  margin: 0 21px 21px;
  overflow:hidden;
}
.picture-item{
  /deep/.ant-card-cover{
    position:relative;
    overflow:hidden
  }
}
.iconStyle {
    position:absolute;
    background:rgba(0,0,0,0.5);
    width:100%;
    height:30px;
    line-height:30px;
    top:70px;
    right:0px;
    font-size:20px;
    transform:translateY(30px);
    display:flex;
    justify-content:flex-end;
    color:#fff;
    z-index:2
  }
.active {
  .iconStyle {
    transform:translateY(0);
    animation: drop 1s;
    display:flex;
  }
}
.leave{
  .iconStyle{
    transform:translateY(30px);
    animation: dropLeave 1s;
  }
}
.flex{
  display:flex;
  justify-content: space-between
}
.defSvg{
  position:absolute;
  top:24px;
  left:21px
}

@keyframes drop {
  from {
    transform:translateY(60px)
  }
  to {
    transform:translateY(0px)
  }
}
@keyframes dropLeave {
  from {
    transform:translateY(0px)
  }
  to {
    transform:translateY(30px)
  }
}

</style>
