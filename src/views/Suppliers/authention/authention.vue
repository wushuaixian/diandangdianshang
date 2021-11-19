<template>
  <section class="authention-index">
    <div class="content">
      <div class="title">
        <div class="icon"></div>
        <div class="text">认证信息</div>
      </div>
      <div class="com">
        <div class="form">
          <a-form-model v-bind="layout">
            <a-form-model-item label="验厂机构">
              <a-input :disabled="true" :value="info.factoryAuditOrg" />
            </a-form-model-item>
            <a-form-model-item label="预计验厂时间">
              <a-input :disabled="true" :value="info.expectFactoryAuditTime | moment" />
            </a-form-model-item>
            <a-form-model-item label="验厂工单号">
              <a-input :disabled="true" :value="info.factoryAuditNo" />
            </a-form-model-item>
            <div v-if="['3'].includes(info.authStatus)">
              <a-form-model-item label="实际验厂时间">
                <a-input :disabled="true" :value="info.realFactoryAuditTime | moment" />
              </a-form-model-item>
              <a-form-model-item label="综合评分">
                <a-input :disabled="true" :value="info.compositeScore" />
              </a-form-model-item>
              <a-form-model-item :label="info.enterpriseNature === '1' ? '设备评分' : '库存评分'">
                <a-input :disabled="true" :value="info.deviceScore" />
              </a-form-model-item>
              <a-form-model-item label="验厂报告">
                <ImagePreview :value="info.factoryAuditReportUrl" />
              </a-form-model-item>
              <a-form-model-item label="考察结果说明">
                <a-input type="textarea" :value="info.remark" :disabled="true" />
              </a-form-model-item>
              <a-form-model-item style="margin-left: 150px">
                <a-button v-if="info.vrUrl" type="primary" size="large" @click="handlePreviewVr"> 查看企业VR </a-button>
              </a-form-model-item>
              <a-form-model-item style="margin-left: 150px">
                <router-link :to="{ name: 'authention-message-detail' }">查看详情</router-link>
              </a-form-model-item>
            </div>
          </a-form-model>
        </div>
        <div class="dun">
          <div class="image">
            <img
              class="img"
              v-if="['3'].includes(info.authStatus)"
              :src="require('@/assets/images/apply/false.png')"
              alt=""
            />
            <img class="img" v-else :src="require('@/assets/images/apply/true.png')" alt="" />
          </div>
          <div class="state">实际信息以认证报告为准</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getDetail } from '@/api/authention'
import { ImagePreview } from '@/components'
export default {
  components: { ImagePreview },
  data() {
    return {
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      info: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await getDetail()
      if (res.code === '0') {
        this.info = res.data
        this.info.vrUrl = decodeURIComponent(this.info.vrUrl)
      }
    },
    handlePreviewVr() {
      if (!this.info.vrUrl) return
      window.open(this.info.vrUrl)
    }
  }
}
</script>

<style lang="less" scoped>
.authention-index {
  width: 1010px;
  .content {
    padding: 24px 20px;
    background: #fff;
    border-radius: 8px;
    margin: 20px 0;
    .title {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: solid 1px #e5e5e5;
      padding-bottom: 8px;
      .icon {
        background-image: linear-gradient(-179deg, #ff8720 0%, #ff6241 100%);
        border-radius: 2px;
        height: 16px;
        width: 4px;
      }
      .text {
        margin-left: 8px;
        font-size: 16px;
        color: #262626;
        line-height: 20px;
        font-weight: bold;
      }
    }
    .com {
      padding: 24px 0;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      .form {
        flex: 1;
        .image {
          width: 80px;
          height: 80px;
          border: 1px solid #e5e5e5;
          border-radius: 2px;
        }
      }
      .dun {
        width: 240px;
        height: 202px;
        background: #ffffff;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        margin: 0 63px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .image {
          height: 140px;
          padding-bottom: 20px;
          .img {
            height: 100%;
          }
        }
        .state {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #262626;
          text-align: right;
          line-height: 18px;
        }
      }
    }
  }
}
</style>
