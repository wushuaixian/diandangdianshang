<template>
  <div class="work-space" v-if="!$hasOpeerate()">
    <div
      class="isPerfect"
      :style="`background-image:url(${require(`@/assets/images/workspace/${
        $hasSuppliers() ? 'suppliers' : 'purchasers'
      }.png`)})`"
      @click="goPay"
    >
      <!-- <img :src="require(`@/assets/images/workspace/${$hasSuppliers() ? 'suppliers' : 'purchasers'}.png`)" alt="" /> -->
      <a-button class="payBtn ant-btn ant-btn-primary ant-btn-lg" v-if="$hasSuppliers()">立即购买</a-button>
    </div>
    <div class="info">
      <div class="left">
        <div class="company">
          <img @click="$refs.modal.edit(1)" class="avatar" :src="$$(info, 'logoUrl')" />
          <div class="enterprise">
            <div class="status">
              <span>{{ $$(info, 'userName') }}</span>
              <a-button
                size="small"
                :type="$$(info, 'authStatus') !== '3' ? 'default' : 'primary'"
                :disabled="$$(info, 'authStatus') !== '3'"
                v-if="$hasSuppliers()"
              >
                {{
                  $$(
                    authStatus.find((x) => x.value === $$(info, 'authStatus')),
                    'label'
                  )
                }}</a-button
              >
              <div style="max-width: 120px; display: none">
                <div class="accountLevel" v-if="accountLevel">
                  <img class="crown-icon" :src="accountLevel.url" />
                  {{ accountLevel.name }}
                </div>
              </div>
            </div>
            <div class="name">{{ $$(info, 'enterpriseName') }}</div>
          </div>
        </div>
        <div class="service" v-if="$hasSuppliers()">
          <a-divider type="vertical" dashed />
          <div class="box">
            <div class="head">
              <span>增值服务</span>
              <!-- <a href="">查看权益<a-icon type="right" /></a> -->
            </div>
            <div class="btn">
              <a-button type="primary" size="small" :disabled="$$(info, 'packStatus') === '0'">
                <img class="crown-icon" :src="require('@/assets/images/workspace/crown.png')" />
                vip
              </a-button>
              <router-link v-if="$$(info, 'packStatus') === '0'" :to="{ name: 'PackageApply' }"> 购买 </router-link>
            </div>
            <div class="time" v-if="$$(info, 'packStatus') === '1'">
              <span v-if="$$(info, 'packageEndTime')">有效期至：{{ $$(info, 'packageEndTime') | moment }}</span>

              <router-link v-if="$$(info, 'packStatus') === '2'" :to="{ name: 'PackageApply' }"> 续费 </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="head">
          <span>公告</span>
          <!-- <a href="">更多<a-icon type="right" /></a> -->
        </div>
        <div class="content">
          <!-- <p>机械密封(电力大连开发区热区大连开发大连开发区热区热…</p>
          <p>办公桌(万安水力发电厂)</p>
          <p>办公桌(万安水力发电厂)</p> -->
        </div>
      </div>
    </div>
    <div class="container enterprise-card">
      <div class="card-info">
        <img :src="require('@/assets/images/workspace/business.png')" alt="" />
        <div class="message">
          <span>工商信息</span>
          <span>通过营业执照上传及法人信息进行核实，以认证企业名称是否真实。</span>
          <div class="btn">
            <router-link
              :to="{
                name: 'Enterprise',
                query: {
                  tabsKey: 1
                }
              }"
            >
              {{ auditStatusText[$$(info, 'auditStatus')] }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="card-info">
        <img :src="require('@/assets/images/workspace/enterprise.png')" alt="" />
        <div class="message">
          <span>企业信息</span>
          <span>为了更好的在平台开展各项业务，请尽快完善您的企业信息。</span>
          <div class="btn">
            <router-link :to="{ name: 'Enterprise', query: { tabsKey: '2' } }">
              去完善信息<a-icon type="right" />
            </router-link>
          </div>
        </div>
      </div>
      <div class="card-info" v-if="$hasSuppliers()">
        <img :src="require('@/assets/images/workspace/auth.png')" alt="" />
        <div class="message">
          <span>申请认证</span>
          <span>您可以通过申请叮当认证来获取更多商机推荐和更高的企业认可。</span>
          <div class="btn">
            <!-- v-if="isFinace && $$(info, 'authStatus') === '0'" -->
            <a-button type="primary" size="small" @click="handleAuth">
              去认证
              <a-icon type="right" />
            </a-button>
            <a v-if="$$(info, 'authStatus') !== '-1'" @click="visible = true">查看进度<a-icon type="right" /></a>
          </div>
        </div>
      </div>
    </div>
    <a-spin>
      <!-- <a-icon slot="indicator" />-->
      <div class="container number-card">
        <div class="card-info">
          <img :src="require('@/assets/images/workspace/bid.png')" alt="" />
          <div class="message">
            <div class="title">今日投标数</div>
            <div class="num">0</div>
          </div>
        </div>
        <div class="card-info">
          <img :src="require('@/assets/images/workspace/order.png')" alt="" />
          <div class="message">
            <div class="title">今日订单数</div>
            <div class="num">0</div>
          </div>
        </div>
        <div class="card-info">
          <img :src="require('@/assets/images/workspace/money.png')" alt="" />
          <div class="message">
            <div class="title">今日收款额</div>
            <div class="num">0</div>
          </div>
        </div>
      </div>
      <div class="todo-list">
        <div class="performance">
          <div class="title">
            <span class="line"></span>
            <span>履约待办</span>
          </div>
          <div class="icon-list">
            <div class="icon">
              <img :src="require('@/assets/images/workspace/todelivered.png')" alt="" />
              <a href="">
                待发货
                <span>0</span>
                个
              </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/todelivered.png')" alt="" />
              <a href="">
                待验收
                <span>0</span>
                个
              </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/return.png')" alt="" />
              <a href="">
                待处理售后
                <span>0</span>
                个
              </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/approval_order.png')" alt="" />
              <a href="">
                待审批订单
                <span>0</span>
                个
              </a>
            </div>
          </div>
        </div>
        <div class="performance">
          <div class="title">
            <span class="line"></span>
            <span>结算待办</span>
          </div>
          <div class="icon-list">
            <div class="icon">
              <img :src="require('@/assets/images/workspace/billing.png')" alt="" />
              <a href="">
                待开票
                <span>0</span>
                个
              </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/refund.png')" alt="" />
              <a href="">
                待退票
                <span>0</span>
                个
              </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/apply.png')" alt="" />
              <a href="">
                待申请
                <span>0</span>
                个
              </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/payment.png')" alt="" />
              <a href="">
                待付款
                <span>0</span>
                个
              </a>
            </div>
          </div>
        </div>
        <div class="performance">
          <div class="title">
            <span class="line"></span>
            <span>寻源待办</span>
          </div>
          <div class="icon-list">
            <div class="icon">
              <img :src="require('@/assets/images/workspace/signup.png')" alt="" />
              <a href="">可报名 </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/offer.png')" alt="" />
              <a href="">待报价</a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/bid_open.png')" alt="" />
              <a href="">待开标</a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/closed.png')" alt="" />
              <a href="">已成交</a>
            </div>
          </div>
        </div>
        <div class="performance">
          <div class="title">
            <span class="line"></span>
            <span>信息管理</span>
          </div>
          <div class="icon-list">
            <div class="icon">
              <img :src="require('@/assets/images/workspace/information.png')" alt="" />
              <a href="">基本信息管理 </a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/certificate.png')" alt="" />
              <a href="">资质证书管理</a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/management.png')" alt="" />
              <a href="">经营范围管理</a>
            </div>
            <div class="icon">
              <img :src="require('@/assets/images/workspace/freight.png')" alt="" />
              <a href="">运费管理</a>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <a-modal width="600px" title="查看进度" @cancel="visible = false" :visible="visible" wrapClassName="progress">
      <template #footer>
        <a-button @click="handleCancel" type="primary">关闭</a-button>
      </template>
      <div class="content">
        <Steps :list="stepsList" :status="$$(info, 'authStatus')" />
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" @submit="handleSubmit">
          <a-form-item label="验厂机构">
            <a-input disabled :value="$$(info, 'factoryAuditOrg')" />
          </a-form-item>
          <a-form-item label="预计验厂时间">
            <a-input
              v-if="$$(info, 'expectFactoryAuditTime')"
              disabled
              :value="$$(info, 'expectFactoryAuditTime') | moment('YYYY-MM-DD')"
            />
            <a-input v-else disabled></a-input>
            <a style="margin-left: 10px">以实际验厂时间为准</a>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <avatar-modal :img="$$(info, 'logoUrl')" ref="modal" @ok="hanldeSaveLogoUrl" />
  </div>
</template>

<script>
import { Steps } from '@/components/Steps'
import { saveLogoUrl, checkFinanceInfo, getGrade } from '@/api/workspace'
import { mapState, mapActions } from 'vuex'
import AvatarModal from './AvatarModal'
import { IS_SUPPLIERS } from '@/store/platform-types'
export default {
  components: { Steps, AvatarModal },
  data() {
    return {
      accountLevel: {}, // 账号评级内容
      IS_SUPPLIERS,
      visible: false,
      form: {},
      financeInfo: null,
      stepsList: [
        { label: '待认证', value: '0' },
        { label: '认证中', value: '0,1,2,4' },
        { label: '认证完成', value: '3' }
      ],
      auditStatusText: ['审核中', '审核通过', '审核拒绝'],
      authStatus: [
        { label: '未认证', value: '-1' },
        { label: '待认证', value: '0' },
        { label: '验厂中', value: '1' },
        { label: '认证中', value: '2' },
        { label: '已认证', value: '3' },
        { label: '认证中', value: '4' }
      ]
      // auditText: ['待认证', '验厂中', '认证中', '认证通过', '认证不通过']
    }
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info
    }),
    isFinace() {
      return Number(this.financeInfo) === 1
    }
  },
  async mounted() {
    const getGradeInfo = await getGrade()
    if (getGradeInfo.code === '0') {
      this.accountLevel = getGradeInfo.data
    }
    if (this.$hasOpeerate()) {
      await this.GetUserInfo()
    } else {
      await this.GetInfo()
      this.checkFinanceInfo()
    }
  },
  methods: {
    ...mapActions(['GetInfo', 'GetUserInfo']),
    async checkFinanceInfo() {
      const res = await checkFinanceInfo()
      if (res.code) {
        this.financeInfo = res.data
      }
    },
    handleAuth() {
      // const { isFinace } = this
      // if (!isFinace) {
      //   this.$message.warning('请先完善银行信息')
      //   return
      // }
      this.$router.push({ name: 'PackageApply' })
    },
    // async queryFInanceInfoByMerchantId() {
    //   const res = await queryFInanceInfoByMerchantId()
    //   if (res.code === '0') {
    //     this.financeInfo = res.data
    //   }
    // },
    handleCancel() {
      this.visible = false
    },
    handleSubmit() {},
    async hanldeSaveLogoUrl(headUrl) {
      const res = await saveLogoUrl({ headUrl })
      if (res.code === '0') {
        await this.GetInfo()
      }
    },
    goPay() {
      if (this.$hasSuppliers()) {
        this.$router.push({ name: 'PackageApply' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./Workplace.less');
.accountLevel {
  height: 24px;
  padding: 0 14px;
  text-shadow: 0 1px 1px rgb(135 57 0 / 40%);
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0.88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(-270deg, #ff9336 0%, #ff6b00 100%);
  border-color: #fff;
  border-radius: 4px;
  margin-left: 15px;
}
.accountLevel img {
  width: 20px;
  height: 16px;
  margin-right: 10px;
}
.status {
  display: flex;
  align-items: center;
}
</style>
