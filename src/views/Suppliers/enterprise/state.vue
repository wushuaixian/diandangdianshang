<template>
  <div>
    <p class="tishi" v-if="status == 2">您的工商信息：已提交，等待审核</p>
    <p class="tishi" v-if="status == 0">
      工商信息如有不符，点击<span class="appeal" @click="appeal">立即申诉</span>反馈不符内容
    </p>
    <div class="state">
      <div class="stateMu">
        <div class="stateMuLe">
          <div class="stateMuLeTitle">工商信息审批状态</div>
          <div class="stateMuLeState">{{ statusText }}</div>
        </div>
        <div class="stateMuRi">
          <img
            v-if="status == 2"
            class="stateImg"
            :src="require('@/assets/images/enterprise/shenhezhong 2.png')"
            alt=""
          />
          <img
            v-else-if="status == 0"
            class="stateImg"
            :src="require('@/assets/images/enterprise/butongguo 2.png')"
            alt=""
          />
          <img v-else class="stateImg" :src="require('@/assets/images/enterprise/tongguo 2.png')" alt="" />
        </div>
        <div class="stateMuLe w450" v-if="status == 0">
          <div class="stateMuLeTitle">审核意见</div>
          <div class="stateMuLeState">{{ auditReason }}</div>
        </div>
        <div class="stateMuLe w400" v-if="status == 0 || status == 1">
          <div class="stateMuLeTitle">工商信息提交审批时间</div>
          <div class="stateMuLeState">{{ auditTime }}</div>
        </div>
      </div>
    </div>
    <a-modal v-model="visible" title="立即申诉" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="handleOk"> 保存 </a-button>
      </template>
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="申诉内容">
          <a-textarea placeholder="请输入申诉内容" class="w330" :rows="4" :max="30" v-model="appealText" />
        </a-form-item>
        <a-form-item label="附件">
          <a-upload
            name="Filedata"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/api/back-manage-web/media/uploadFile"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img class="imageSize" v-if="complaintUrl" :src="complaintUrl" alt="avatar" />
            <div v-else>
              <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Enterpriceupload from './enterpriceupload.vue'

export default {
  components: {
    Enterpriceupload: Enterpriceupload // 图片上传
  },
  props: {
    statusText: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 1
    },
    auditReason: {
      type: String,
      default: ''
    },
    auditTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      appealText: '',
      complaintUrl: ''
    }
  },
  methods: {
    appeal() {
      this.visible = true
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
      var params = {
        complaintContent: this.appealText,
        complaintUrl: ''
      }
      this.$parent.actionAppeal(params)
    },
    handleCancel(e) {
      console.log(e)
      this.visible = false
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        console.log('info', info)
        this.complaintUrl = info.file.response.data.url
      }
    },
    beforeUpload(file, fileList) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      console.log(fileList)
      return isJpgOrPng && isLt2M
    }
  }
}
</script>

<style lang="less" scoped>
.tishi {
  margin-top: 20px;
  font-size: 12px;
  color: #262626;
  .appeal {
    color: #ff6b00;
    padding: 0 4px;
    text-decoration: underline;
    cursor: pointer;
  }
}
.state {
  height: 80px;
  background: #fafafa;
  border-radius: 4px;
  margin-top: 10px;
  .stateMu {
    display: flex;
    .stateMuLe {
      width: 200px;
      text-align: center;
      display: inline-block;
      .stateMuLeTitle {
        color: #666666;
        margin-top: 10px;
        height: 26px;
      }
      .stateMuLeState {
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }
    }
    .stateMuRi {
      display: inline-block;
      width: 80px;
      .stateImg {
        width: 48px;
        height: 48px;
        margin-top: 14px;
      }
    }
  }
}
.w450 {
  width: 450px;
}
.w400 {
  width: 400px;
}
.w330 {
  width: 330px;
}
.imageSize {
  width: 200px;
  height: 200px;
}
textarea.ant-input {
  width: 330px !important;
  max-width: none;
}
</style>
