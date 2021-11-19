<template>
  <a-modal
    destroy-on-close
    :visible="popupStatus"
    title="审核"
    @ok="handleOk"
    @cancel="closePupup"
    width="800px"
    okText="确定"
    cancelText="取消"
  >
    <p>
      <span class="title">审核结果:</span>
      <label class="m-check ui-margin">
        <input type="radio" name="remindType" :value="1" v-model="radioStatus" />
        <div class="m-radio ui-pos"></div>
        <span>审核通过</span>
      </label>
    </p>
    <p class="leftSpacing">
      <label class="m-check ui-margin">
        <input type="radio" name="remindType" :value="2" v-model="radioStatus" />
        <div class="m-radio ui-pos"></div>
        <span>审核驳回</span>
      </label>
    </p>
    <a-select class="leftSpacing text" placeholder="请选择话术分类" v-if="radioStatus == 2" v-model="fenlei" style="width: 610px" @change="getLibrayList">
      <a-select-option v-for="(item, index) in copyList" :key="index" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-select class="leftSpacing text" placeholder="请选择话术" v-if="radioStatus == 2" v-model="fenleiDetail" style="width: 610px" @change="handleChange">
      <a-select-option v-for="(item, index) in list.listObj" :key="index" :value="item.content">
        {{ item.content }}
      </a-select-option>
    </a-select>
    <div class="leftSpacing text" v-if="radioStatus == 2">
      <div>{{ failReason.length }} / 30</div>
      <p>
        <a-textarea style="width: 610px" :maxLength="30" v-model="failReason" />
      </p>
    </div>
  </a-modal>
</template>
<script>
import notification from 'ant-design-vue/es/notification'
import { getLibrayList, rejectLibrayList } from '@/api/rejectLibray'
export default {
  props: {
    popupStatus: Boolean,
    defaultValue: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      failReason: '',
      radioStatus: this.defaultValue || 1,
      typeId: '',
      list: [],
      copyList: [],
      fenlei: undefined,
      fenleiDetail: undefined
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
    this.init()
  },
  methods: {
    closePupup() {
      this.$emit('update:popupStatus', false)
    },
    handleOk() {
      if (this.radioStatus === 2) {
        if (this.failReason.replace(/ /g, '') === '') {
          notification.error({
            message: '提示',
            description: '审核驳回，请输入驳回原因！'
          })
        } else {
          this.submer()
        }
      } else {
        this.submer()
      }
    },
    submer() {
      this.$emit('submitExamine', this.radioStatus, this.failReason.replace(/ /g, ''))
      this.$emit('update:popupStatus', false)
    },
    // 获取话术分类
    async init() {
      this.loading = true
      const res = await rejectLibrayList({
        name: ''
      }).finally(() => (this.loading = false))
      if (res.code === '0') {
        this.copyList = res.data
        this.typeId = res.data[0].id
      }
    },
    async getLibrayList(typeId) {
      this.fenleiDetail = undefined
      const queryParam = {
        typeId: typeId,
        currentPage: 1,
        itemsPerPage: 999999999,
        isAvailable: 0
      }
      const { data } = await getLibrayList({ ...queryParam })
      this.list = data
    },
    handleChange(val) {
      this.failReason = val
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
