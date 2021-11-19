<template>
  <a-modal
    title="添加资质"
    :visible="addPopupvisible"
    :width="600"
    cancelText="取消"
    okText="确定"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <ul class="addPopupList">
      <li>
        <span>*</span>
        <span>资质类型: </span
        ><a-select
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          default-value="IOS9001质量体系认证"
          @change="selectQualificationsType"
          class="inp"
        >
          <a-select-option value="IOS9001质量体系认证"> IOS9001质量体系认证 </a-select-option>
          <a-select-option value="IOS14001环境管理质量体系认证"> IOS14001环境管理质量体系认证</a-select-option>
          <a-select-option value="IOS10012测量管理体系认证"> IOS10012测量管理体系认证 </a-select-option>
          <a-select-option value="职业健康安全管理体系认证"> 职业健康安全管理体系认证 </a-select-option>
          <a-select-option value="特种设备制造许可证"> 特种设备制造许可证 </a-select-option>
          <a-select-option value="特种设备设计许可证"> 特种设备设计许可证 </a-select-option>
          <a-select-option value="特种设备安装改造维修许可证"> 特种设备安装改造维修许可证 </a-select-option>
          <a-select-option value="安全生产许可证"> 安全生产许可证 </a-select-option>
          <a-select-option value="危险品经营资质证书"> 危险品经营资质证书 </a-select-option>
          <a-select-option value="危险化学品使用许可证"> 危险化学品使用许可证 </a-select-option>
          <a-select-option value="危险化学品运输许可证"> 危险化学品运输许可证 </a-select-option>
          <a-select-option value="非药品类易制毒化学品经营备案证明"> 非药品类易制毒化学品经营备案证明 </a-select-option>
          <a-select-option value="防爆合格证"> 防爆合格证 </a-select-option>
          <a-select-option value="计量器具批准证书"> 计量器具批准证书 </a-select-option>
          <a-select-option value="制造计量器具许可证"> 制造计量器具许可证 </a-select-option>
          <a-select-option value="道路运输经营许可证"> 道路运输经营许可证 </a-select-option>
          <a-select-option value="全国工业产品生产许可证"> 全国工业产品生产许可证 </a-select-option>
          <a-select-option value="辐射安全许可证"> 辐射安全许可证 </a-select-option>
          <a-select-option value="放射性同位素许可证"> 放射性同位素许可证 </a-select-option>
          <a-select-option value="中国国家强制性产品认证证书（CCC）">
            中国国家强制性产品认证证书（CCC）
          </a-select-option>
          <a-select-option value="消防系统产品资质许可证"> 消防系统产品资质许可证 </a-select-option>
          <a-select-option value="电气防爆产品许可证"> 电气防爆产品许可证 </a-select-option>
          <a-select-option value="特种压力表许可证"> 特种压力表许可证 </a-select-option>
          <a-select-option value="起重电气许可证"> 起重电气许可证 </a-select-option>
          <a-select-option value="印制商标单位证书"> 印制商标单位证书 </a-select-option>
          <a-select-option value="安全阀门生产许可证"> 安全阀门生产许可证 </a-select-option>
          <a-select-option value="冶金标准样品认可证"> 冶金标准样品认可证 </a-select-option>
          <a-select-option value="成品油批发经营许可"> 成品油批发经营许可 </a-select-option>
          <a-select-option value="食盐批发许可证"> 食盐批发许可证 </a-select-option>
          <a-select-option value="建筑业企业资质证书"> 建筑业企业资质证书 </a-select-option>
        </a-select>
      </li>
      <li>
        <span>*</span><span>证书编号: </span
        ><a-input v-model="certificateNo" placeholder="请输入证书编号" class="inp" />
      </li>
      <li>
        <span>*</span><span>颁发日期: </span
        ><a-date-picker @change="getAwardDate" :key="AwardDateKey" placeholder="请选择颁发日期" class="inp" />
      </li>
      <li>
        <span>*</span><span>证书名称: </span
        ><a-input v-model="certificateName" placeholder="请输入证书名称" class="inp" />
      </li>
      <li>
        <span>*</span><span>颁发机构: </span><a-input v-model="mechanism" placeholder="请输入颁发机构" class="inp" />
      </li>
      <li>
        <span>*</span><span>有效期至: </span
        ><a-date-picker @change="getEffective" :key="effectiveKey" placeholder="请选择有效期" class="inp" />
      </li>
      <li>
        <span>*</span><span>证书上传: </span>
        <div class="uploadButton" v-if="!ImgUrl" @click="clickUpload">
          <div class="garden">
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="showImg" v-if="ImgUrl" @click="clickUpload">
          <img :src="ImgUrl" alt="" id="show" style="width: 80px" />
        </div>
        <input
          id="uploadImg"
          type="file"
          ref="uploadImg"
          accept="image/jpg,image/jpeg,image/bmp,image/gif,image/pdf,image/png"
          v-show="false"
          @change="uploadImg"
        />
        <div class="remarks">
          <p>支持格式：bmp、tiff、gif、jpg、png、jpeg、pdf</p>
          <p>资质证书尺寸请勿小于600*400PX</p>
        </div>
      </li>
    </ul>
  </a-modal>
</template>
<script>
export default {
  props: {
    addPopupvisible: Boolean
  },
  data() {
    return {
      ImgUrl: '',
      qualificationsType: '',
      certificateNo: '',
      awardDate: '',
      certificateName: '',
      mechanism: '',
      effective: '',
      AwardDateKey: 1,
      effectiveKey: 1
    }
  },
  methods: {
    handleOk() {
      const params = {
        certificateType: this.qualificationsType,
        certificateName: this.certificateName,
        certificateNumber: this.certificateNo,
        issueAuthority: this.mechanism,
        issueBeginTime: this.awardDate,
        issueEndTime: this.effective,
        certificateUrl: '',
        certificationStatus: 1,
        merchantId: 2106060000000119
      }
      this.$emit('addQualifications', params)
    },
    handleCancel() {
      this.$emit('close')
      setTimeout(() => {
        this.ImgUrl = ''
        this.qualificationsType = ''
        this.certificateNo = ''
        this.awardDate = ''
        this.certificateName = ''
        this.mechanism = ''
        this.effective = ''
        this.AwardDateKey++
        this.effectiveKey++
      })
    },
    getFileExt(fileName) {
      const num = fileName.lastIndexOf('.')
      const fileNameLen = fileName.length
      const fileType = fileName.substring(num + 1, fileNameLen)
      return fileType.toLowerCase()
    },
    clickUpload() {
      this.$refs.uploadImg.value = null
      this.$refs.uploadImg.click()
    },
    uploadImg(e) {
      const that = this
      console.log(e.target.files[0].type)
      if (e.target.files[0]) {
        const str = this.getFileExt(e.target.files[0].name)
        console.log(str)
        if (str !== 'bmp' && str !== 'tiff' && str !== 'gif' && str !== 'jpg' && str !== 'jpeg' && str !== 'pdf') {
          return // 报错信息
        }
        var reads = new FileReader()
        reads.readAsDataURL(e.target.files[0])
        reads.onload = function (e) {
          const image = new Image()
          image.src = e.target.result
          image.onload = () => {
            if (image.width < 600 || image.height < 400) {
              alert('图片尺寸不匹配')
            } else {
              that.ImgUrl = e.target.result
            }
          }
        }
        // document.getElementById('show').src = e.target.result
      }
      const params = new FormData()
      params.append('file', e.target.files[0])
    },
    selectQualificationsType(e) {
      console.log(e)
      this.qualificationsType = e
    },
    getAwardDate(data, dateString) {
      this.awardDate = data['_d']
      console.log(data)
    },
    getEffective(data, dateString) {
      this.effective = data['_d']
    }
  }
}
</script>
<style lang="less" scoped>
.addPopupList {
  li {
    height: 32px;
    margin-bottom: 16px;
    .inp {
      width: 436px;
      height: 32px;
    }
  }
  li span:nth-child(1) {
    color: #ff8720;
  }
  li span:nth-child(2) {
    font-size: 14px;
  }
  li:last-child {
    height: 75px;
  }
}
.uploadButton {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  display: inline-block;
  vertical-align: -64px;
  position: relative;
  .garden {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 107, 0, 0.1);
    position: absolute;
    top: 50%;
    margin-top: -16px;
    left: 50%;
    margin-left: -16px;
    & div:nth-child(1) {
      width: 3px;
      height: 16px;
      background: #ff6b00;
      position: absolute;
      left: 50%;
      margin-top: 8px;
      margin-left: -1px;
    }
    & div:nth-child(2) {
      width: 16px;
      height: 3px;
      background: #ff6b00;
      top: 50%;
      margin-top: 14px;
      margin-left: 8px;
    }
  }
  &:hover {
    cursor: pointer;
  }
}
.remarks {
  display: inline-block;
  vertical-align: -60px;
  margin-left: 10px;
  p {
    margin-bottom: 4px;
    font-size: 12px;
    color: #999999;
  }
}
.showImg {
  width: 80px;
  height: 80px;
  line-height: 80px;
  display: inline-block;
  vertical-align: text-top;
}
</style>
