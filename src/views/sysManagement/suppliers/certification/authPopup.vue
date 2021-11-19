<template>
  <a-modal
    :visible="popupStatus"
    :confirmLoading="confirmLoading"
    title="认证"
    @ok="handleOk"
    @cancel="closePupup"
    width="400px"
    okText="确定"
    cancelText="取消"
  >
    <p>
      <span class="title">认证结果:</span>
      <label class="m-check ui-margin">
        <input type="radio" name="remindType" value="success" v-model="radioStatus" />
        <div class="m-radio ui-pos"></div>
        <span>认证成功</span>
      </label>
    </p>
    <p class="leftSpacing">
      <label class="m-check ui-margin">
        <input type="radio" name="remindType" value="fail" v-model="radioStatus" />
        <div class="m-radio ui-pos"></div>
        <span>认证失败</span>
      </label>
    </p>
    <div class="leftSpacing text" v-if="radioStatus == 'fail'">
      <div>{{ failReason.length }} / 30</div>
      <p>
        <a-textarea :maxLength="30" v-model="failReason" />
      </p>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    popupStatus: Boolean,
    examineMode: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      failReason: '',
      radioStatus: 'success',
      confirmLoading: false
    }
  },
  methods: {
    closePupup() {
      this.$emit('close')
      setTimeout(() => {
        this.radioStatus = 'success'
        this.failReason = ''
        this.confirmLoading = false
      }, 300)
    },
    handleOk() {
      if (!(this.radioStatus === 'success') && this.failReason === '') {
        this.$message.info('请填写驳回原因')
        return
      }
      this.confirmLoading = true
      let status
      this.radioStatus === 'success' ? (status = 1) : (status = 2)
      this.$emit('submitExamine', status, this.failReason)
      this.closePupup()
      console.log(status)
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  margin-left: 59px;
  font-size: 14px;
  color: #262626;
}
.ui-middle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.m-radio {
  display: inline-block;
  position: relative;
  width: 16px;
  height: 16px;
  border: solid 1px #ccc;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 7px;
  margin-right: 8px;
  top: 3px;
}
.m-radio:after {
  .ui-middle;
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #fff;
}
.m-check {
  display: inline-block;
}
.m-check input[type='radio'] {
  display: none;
}
.m-check input[type='radio']:checked + div {
  border: solid 2px #ff6b00;
  background: #ff6b00;
}
.m-check input[type='radio']:checked + div:after {
  background-color: #fff;
}
.leftSpacing {
  margin-left: 118px;
  margin-top: 16px;
}
.ant-input {
  width: 210px;
}
.text {
  position: relative;
  div {
    position: absolute;
    right: 36px;
    bottom: 6px;
    z-index: 20;
    font-size: 14px;
    color: #cccccc;
  }
}
</style>
