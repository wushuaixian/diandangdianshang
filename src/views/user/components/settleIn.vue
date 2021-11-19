<template>
  <a-modal
    :visible="visable"
    :title="title"
    :bodyStyle="{ padding: 0 }"
    :width="960"
    :height="634"
    on-ok="handleOk"
    @cancel="cancel"
  >
    <template slot="footer">
      <div class="btn-box">
        <a-button v-if="sec > 0" class="btn" type="primary" size="large" html-type="submit" disabled>
          同意并继续 {{ sec }}s
        </a-button>
        <a-button v-else class="btn" type="primary" size="large" html-type="submit" @click="readAgreeMent">
          同意并继续
        </a-button>
      </div>
    </template>
    <div @scroll="scrollEvent" class="content" style="height: 350px" v-html="dom"></div>
  </a-modal>
</template>

<script>
import * as api from '@/api/configgurationCenter/operatedConfigure/platformTerms/agreement.js'
export default {
  watch: {
    visable: {
      handler(val, oldVal) {
        if (val) {
          this.init()
        }
      },
      deep: true
    }
  },
  props: {
    visable: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.init()
    api.getAgreementDetailWithType('1').then((res) => {
      if (res.code === '0') {
        this.dom = res.data.content
        this.title = res.data.title
      }
    })
  },
  data() {
    return {
      sec: 15,
      timeid: null,
      dom: '',
      title: ''
    }
  },
  methods: {
    scrollEvent(e) {
      if (e.srcElement.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - 100) {
        clearInterval(this.timeid)
        this.sec = 0
      }
    },
    init() {
      this.sec = 15
      clearInterval(this.timeid)
      this.timeid = setInterval(() => {
        if (this.sec > 0) {
          this.sec--
        }
      }, 1000)
    },
    cancel() {
      this.visable = false
    },
    readAgreeMent() {
      this.$parent.$parent.isReadPolicy = true
    },
    Close() {
      this.$router.push('/user/login')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  overflow: auto;
  padding: 10px 30px;
  .default,
  .message {
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 22px;
    margin-top: 8px;
    margin-bottom: 10px;
  }
  .default {
    text-indent: 2em;
  }
  .title {
    font-size: 14px;
    color: #262626;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: bold;
    margin-top: 10px;
  }
  .titleCenter {
    text-align: center;
  }
  .line {
    font-weight: bold;
    color: #262626;
    text-decoration: underline;
  }
  .bold {
    font-weight: bold;
    color: #262626;
  }
}

.btn-box {
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    width: 240px;
  }
}
</style>
