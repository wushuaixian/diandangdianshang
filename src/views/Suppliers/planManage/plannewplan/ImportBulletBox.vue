<template>
  <div class="mid">
    <a-button class="margin" type="primary" @click="Reset"> 物料池导入 </a-button>
    <a-button class="margin" type="primary"> 模板导入 </a-button>
    <a-modal
      destroy-on-close
      :visible="popupStatus"
      title="审核"
      @ok="handleOk"
      @cancel="closePupup"
      width="400px"
      okText="确定"
      cancelText="取消"
    >
      <p>
        <span class="title">审核结果:</span>
        <label class="m-check ui-margin">
          <s-upload-file class="bottom" :file-data="list" v-model="url" name="file"></s-upload-file>
        </label>
      </p>
      <p>
        <span class="title">审核结果:</span>
        <a-button class="bottom">下载</a-button>
      </p>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    merchantId: {
      type: String,
      default: () => {}
    },
    planId: {
      type: String,
      default: () => {}
    }
  },
  data() {
    return {
      url: '',
      popupStatus: false,
      failReason: '',
      radioStatus: this.defaultValue || 1,
      list: {
        planId: '',
        materialSource: '0',
        merchantId: ''
      }
    }
  },
  watch: {
    popupStatus(val) {
      if (val) {
        this.failReason = ''
        this.radioStatus = 1
      }
    }
  },
  mounted() {
    this.list.planId = this.planId
    this.list.merchantId = this.merchantId
  },
  methods: {
    Reset() {
      this.popupStatus = true
      this.materialSource = 0
    },
    closePupup() {
      this.popupStatus = false
    },
    handleOk() {
      this.popupStatus = false
      this.$emit('Refresh')
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  .margin {
    margin: 20px;
  }
}
.bottom {
  width: 147px;
  margin-left: 10px;
}
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
