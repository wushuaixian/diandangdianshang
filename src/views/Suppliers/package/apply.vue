<template>
  <div class="authention-apply-main">
    <div class="cards">
      <div class="item" v-for="item of packageList" :key="item.id">
        <div class="item-img">
          <img class="img" :src="item.packageUrl" alt />
        </div>
        <div class="package-name">{{ item.packageName }}</div>
        <div class="price-box">
          <div class="price">{{ item.packageDiscountPrice | formatCurrency }}</div>
          <div class="name">元/年</div>
        </div>
        <div>
          原价:<del>{{ item.packageOriginalPrice | formatCurrency }}</del>
        </div>
        <div class="btn-box" v-if="isUse === item.id">
          <a-button class="btns">正在使用</a-button>
        </div>
        <div class="btn-box" v-if="!isUse">
          <!-- v-if="isUse !== item.id && !SetMealStatus"-->
          <a-button
            class="btns"
            :disabled="SetMealStatus"
            @click="enterprisePayment(item.id, 1, item.packageDiscountPrice)"
          >
            立即支付
          </a-button>
          <a-button
            class="btns"
            :disabled="SetMealStatus"
            @click="enterprisePayment(item.id, 2, item.packageDiscountPrice)"
          >
            转财务付
          </a-button>
        </div>
      </div>
    </div>
    <div style="color: #ff6b4a; margin-bottom: 5px; width: 940px; text-align: center">
      温馨提示：凡2021年9月1日前购买套餐的用户，将享受“超级加长版”优惠政策，即有效期自选购之日起，至2022年10月31日止。
    </div>
    <div style="color: #ff6b4a; margin-bottom: 5px; width: 940px; text-align: center">
      2021年9月1日（含）后购买套餐的用户，套餐有效期恢复正常，即自选购之日起，12个月（一年期）。
    </div>
    <div style="color: #ff6b4a; margin-bottom: 5px; width: 940px; text-align: center">
      注：套餐内权益功能持续更新中，敬请期待...
    </div>
    <!-- <div class="con">
      <div class="content">
        <table class="table">
          <tr class="table_1">
            <th colspan="10" width="20%">名称</th>
            <th colspan="4" width="20%">龙头企业</th>
            <th colspan="4" width="20%">大型企业</th>
            <th colspan="4" width="20%">中小型企业</th>
          </tr>
          <tr class="tablTthTr">
            <td colspan="10" class="bg-org text-l">影响力指数</td>
            <td colspan="4">
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
            </td>
            <td colspan="4">
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" />
            </td>
            <td colspan="4">
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
              <a-icon type="star" style="color: #ff6241" theme="filled" />
            </td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="1" rowspan="4" class="bg-org1">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/zsfuwu.png')" alt />
                <div>会员条件</div>
              </div>
            </td>
            <td colspan="9" class="bg-org1 text-l">会员年费</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" rowspan="3" class="bg-org1 text-l">加入门槛</td>
            <td colspan="4" rowspan="3">
              <div style="padding: 0px 15px; line-height: 30px">
                合法有效的营业执照注册登记，<br />
                执照经营期限在有效期内 <br />（大于1个月），<br />
                营业执照未处于变更中，<br />
                且同时需符合龙头商家招商标准。
              </div>
            </td>
            <td colspan="4" rowspan="3">
              <div style="padding: 0px 15px; line-height: 30px">
                合法有效的营业执照注册登记，<br />
                执照经营期限在有效期内 <br />（大于1个月），<br />
                营业执照未处于变更中，<br />
                且同时需符合大型商家招商标准。
              </div>
            </td>
            <td colspan="4" rowspan="3">
              <div style="padding: 0px 15px; line-height: 30px">
                合法有效的营业执照注册登记，<br />
                执照经营期限在有效期内 <br />（大于1个月），<br />
                营业执照未处于变更中，<br />
                且同时需符合中型商家招商标准。
              </div>
            </td>
          </tr>
          <tr class="tablTthTr"></tr>
          <tr class="tablTthTr"></tr>
          <tr class="tablTthTr">
            <td colspan="10" class="bg-org text-l">企业身份标识</td>
            <td colspan="4">各级专属标识</td>
            <td colspan="4">各级专属标识</td>
            <td colspan="4">各级专属标识</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="1" rowspan="3" class="bg-org">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/DdAuthentication.png')" alt />
                <div>叮当认证</div>
              </div>
            </td>
            <td colspan="9" class="bg-org text-l">VR制作</td>
            <td colspan="4">首充专享</td>
            <td colspan="4">首充专享</td>
            <td colspan="4">首充专享</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">免费验厂</td>
            <td colspan="4">首充专享</td>
            <td colspan="4">首充专享</td>
            <td colspan="4">首充专享</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">资质认证</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="1" rowspan="5" class="bg-org1">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/zsfuwu.png')" alt />
                <div>专享服务</div>
              </div>
            </td>
            <td colspan="9" class="bg-org1 text-l">短信费</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">专属客服通道</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">商学院基础课程</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">专享商学院培训</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">自营特惠券</td>
            <td colspan="4">返30000元券</td>
            <td colspan="4">返10000元券</td>
            <td colspan="4">返2000元券</td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="1" rowspan="7" class="bg-org">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/jrfu.png')" alt />
                <div>金融服务</div>
              </div>
            </td>
            <td colspan="9" class="bg-org text-l">放款时间</td>
            <td colspan="4">T+1</td>
            <td colspan="4">T+3</td>
            <td colspan="4">T+7</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">融资服务费（借款到账时一次性收取）</td>
            <td colspan="4">免收</td>
            <td colspan="4">免收</td>
            <td colspan="4">0.1%-0.19%</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">快速贴息服务</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">延期服务（延期还款申请）</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">金融还款优惠券</td>
            <td colspan="4">返30000元券</td>
            <td colspan="4">返10000元券</td>
            <td colspan="4">返2000元券</td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">融资利率（日利率）</td>
            <td colspan="4">0.015%-0.025%</td>
            <td colspan="4">0.02%-0.028%</td>
            <td colspan="4">0.025%-0.03%</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">最高融资额度</td>
            <td colspan="4">1000万</td>
            <td colspan="4">500万</td>
            <td colspan="4">100万</td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="1" rowspan="5" class="bg-org1">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/xcfw.png')" alt />
                <div>现场服务</div>
              </div>
            </td>
            <td colspan="9" class="bg-org1 text-l">代理收货入库体验次数</td>
            <td colspan="4">3</td>
            <td colspan="4">2</td>
            <td colspan="4">1</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">代理收货入库正式服务</td>
            <td colspan="4">200/次</td>
            <td colspan="4">180/次</td>
            <td colspan="4">170/次</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">代理测绘次数</td>
            <td colspan="4">1</td>
            <td colspan="4">1</td>
            <td colspan="4">0</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">现场质量异议协理次数</td>
            <td colspan="4">2</td>
            <td colspan="4">1</td>
            <td colspan="4">0</td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">专属服务代表</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
            <td colspan="4"></td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="1" rowspan="5" class="bg-org">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/shangji@3x.png')" alt />
                <div>商机洞察</div>
              </div>
            </td>
            <td colspan="9" class="bg-org text-l">商机强提醒</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">询价专属推荐</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">参标默认勾选</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
            <td colspan="4"></td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">自然搜索排名加权</td>
            <td colspan="4">
              <div>
                按平台会员排序规则<br />
                （同等条件优先）
              </div>
            </td>
            <td colspan="4">
              按平台会员排序规则 <br />
              同等条件优先）
            </td>
            <td colspan="4">
              按平台会员排序规则 <br />
              同等条件优先）
            </td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">深度洽谈接待</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="1" rowspan="3" class="bg-org1">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/xuanchuan@3x.png')" alt />
                <div>宣传推广</div>
              </div>
            </td>
            <td colspan="9" class="bg-org1 text-l">行业推介会</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">专属广告位</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="9" class="bg-org1 text-l">集采招标优先入围</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>

          <tr class="tablTthTr">
            <td colspan="1" rowspan="4" class="bg-org">
              <div class="text-v">
                <img :src="require('@/assets/images/authention/shuju@3x.png')" alt />
                <div>数据分析</div>
              </div>
            </td>
            <td colspan="9" class="bg-org text-l">行业分析报告</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">中标分析报告</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
          </tr>
          <tr class="tablTthTr">
            <td colspan="9" class="bg-org text-l">专属投标指导</td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4">
              <img class="img" src="@/assets/images/gou.png" alt />
            </td>
            <td colspan="4"></td>
          </tr>
        </table>
      </div>
    </div> -->
    <a-table class="table" :columns="columns" :data-source="tableList" bordered :pagination="false">
      <template v-for="(v, i) in tableList" :slot="`packageName${i}`" slot-scope="text, item">
        <span :key="i" v-if="item.equityName === '影响力指数'">
          <a-rate :default-value="Number(item[`equityValue${i}`])" allow-half disabled />
          <!-- <a-rate :name="`rate${index}`" :value="2" /> -->
        </span>
        <span
          :key="i"
          v-else-if="item[`equityValue${i}`] === '' && item[`isPossess${i}`] === '1'"
          style="text-algin: center"
        >
          <a-icon type="check" />
        </span>
        <span :key="i" v-else-if="item[`equityValue${i}`] !== '' && item[`isPossess${i}`] === '1'">{{ text }}</span>
      </template>
    </a-table>
    <GoActivation :visible="goActivationVisible" @Deactivation="Deactivation" @close="goActivationVisible = false" />
    <GoBankCard :visible="goBankCardVisible" />
    <Popup
      :visible="popupVisible"
      :statusNum="statusNum"
      @close="popupVisible = false"
      :getPhone="getPhone"
      @resetStatus="resetStatus"
      stop="stop"
    />
    <SingContract :visible="singContractVisible" @close="closeSingContract" :url="url" />
    <PackagePopUp ref="PackagePopUp" :data1="data1" :numItem="numItem" @enterprisePayment="enterprisePayment" />
  </div>
</template>

<script>
import { PackagePopUp } from './components'
import Popup from '@/views/finance/suppliers/paymentManagement/Popup'
import SingContract from '@/views/finance/suppliers/paymentManagement/signContract'
import { getPackageIsNo, personalEnterprisePayment, queryAllPackInfoEquity, queryPackInfoEquity } from '@/api/supplier'
import {
  accountStatus,
  checkFinanceInfo,
  queryFincePhone,
  signAContract,
  paymentManagementStatus
} from '@/api/fince.js'
import {
  setNewTableList
  // setNewTableColums
} from './setNewTableList'
import GoActivation from './goActivation'
import GoBankCard from '@/views/finance/suppliers/homePage/components/goBankCard'
import JSEncrypt from 'jsencrypt'
import md5 from 'md5'

export default {
  components: {
    GoActivation,
    GoBankCard,
    Popup,
    SingContract,
    PackagePopUp
  },
  data() {
    return {
      popupVisible: false,
      columns: [],
      tableList: [],
      statusNum: 1,
      getPhone: '',
      singContractVisible: false,
      CallbackStatus: null,
      status: true,
      url: '',
      merchantId: '',
      messageAmount: 300,
      serviceFeeAmount: '',
      serviceFeeType: 1,
      list: [],
      isUse: false,
      SetMealStatus: false,
      isRecharge: false,
      goActivationVisible: false,
      isShowFinanceModel: false,
      goBankCardVisible: false,
      data1: {},
      numItem: {},
      listRightColums: [],
      serviceFeeList: [
        {
          name: '月卡',
          value: 1,
          price: 600
        },
        {
          name: '季卡',
          value: 2,
          price: 1500
        },
        {
          name: '年卡',
          value: 3,
          price: 5000
        }
      ],
      packageList: []
    }
  },
  async mounted() {
    this.getPackageIsNo()
    this.handleRecharge()
    this.checkFinanceInfo()
    await this.queryPackInfoEquity()
    this.queryAllPackInfoEquity()
  },
  methods: {
    setNewTableColums(list, data, e) {
      const nameColums = data.map((item, index) => {
        const newColums = {
          title: item.packageName,
          dataIndex: `equityValue${index}`,
          key: `equityValue${index}`,
          scopedSlots: { customRender: `packageName${index}` }
        }
        return newColums
      })
      const columns = [
        {
          title: '名称',
          colSpan: 2,
          dataIndex: 'equityType',
          customCell(value, index) {
            return {
              style: {
                'background-color': value.background
              }
            }
          },
          customRender: (value, row, index) => {
            const { length } = list.filter((item) => {
              return row.equityType === item.equityType
            })
            const { tableList } = e
            return {
              children: (
                <div class="div">
                  <img class="img" src={require('@/assets/images/authention/zsfuwu.png')} />
                  <div class="span">{value}</div>
                </div>
              ),
              attrs: {
                rowSpan: row.equityType === tableList[index - 1]?.equityType && tableList[index - 1] ? 0 : length
              }
            }
          }
        },
        {
          title: '名称',
          colSpan: 0,
          dataIndex: 'equityName',
          customCell(value, index) {
            return {
              style: {
                'background-color': value.background
              }
            }
          }
        },
        ...nameColums
      ]
      return columns
    },
    async getPackageIsNo() {
      const res = await getPackageIsNo()
      if (res.code === '0') {
        this.packageList = res.data?.packageInfoList.filter((x) => x.packageStatus !== '1')
        this.SetMealStatus = res.data.paymentStatus
        this.isUse = res.data.packageId
      }
    },
    async queryPackInfoEquity() {
      const res = await queryPackInfoEquity({})
      if (res.code === '0') {
        const { data } = res
        this.listRightColums = data
      }
      return true
    },
    async queryAllPackInfoEquity() {
      const res = await queryAllPackInfoEquity({})
      if (res.code === '0') {
        this.tableList = setNewTableList(res.data, this.listRightColums)
        this.columns = this.setNewTableColums(this.tableList, this.listRightColums, this)
      }
    },
    onChange(e) {
      this.serviceFeeType = e.target.value
    },
    async handleRecharge() {
      const res = await accountStatus()
      if (res.code === '0') {
        const { password, phone, protocol } = res.data
        this.isRecharge = password && phone && protocol
      }
    },
    async checkFinanceInfo() {
      const result = await checkFinanceInfo()
      if (result.code !== '0') {
        this.isShowFinanceModel = true
      }
    },
    enterprisePayment(id, type, moeny) {
      this.data1 = {
        type: type,
        moeny: moeny,
        id: id
      }
      if (!moeny) {
        return this.$message.info('网络错误')
      }
      // id 4,3,2
      // type 1个人 2企业
      // money 钱
      if (type === 1) {
        if (this.isShowFinanceModel) {
          this.goBankCardVisible = true
        } else if (!this.isRecharge) {
          // this.goActivationVisible = true
          this.goActivationVisible = true
        } else {
          // this.goBankCardVisible = true
          personalEnterprisePayment({ packageId: id, type: type }).then((res) => {
            if (res.data.validPackageOrder) {
              this.$router.push({
                name: 'FinancePaymentCashier',
                params: {
                  orderCode: res.data.orderNo,
                  id: 1,
                  paymentBalance: moeny,
                  payerType: 1,
                  paymentBillCode: '1',
                  mergePaymentType: 0
                }
              })
            } else {
              this.numItem = res.data
              this.$refs['PackagePopUp'].init()
            }
          })
        }
      } else {
        if (this.isShowFinanceModel) {
          this.goBankCardVisible = true
          return
        }
        const timestamp = Date.parse(new Date())
        const nonceStr = this.randomString()
        const PUBLIC_KEY =
          'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
        const encryptor = new JSEncrypt()
        // 设置公钥
        encryptor.setPublicKey(PUBLIC_KEY)
        // 加密数据
        const sign = encryptor.encrypt(
          md5(String(`feeAmt=${moeny}&nonceStr=${nonceStr}&timestamp=${timestamp}&type=${2}`))
        )

        personalEnterprisePayment({
          packageId: id + '',
          type: 2,
          nonceStr: nonceStr,
          timestamp: timestamp,
          sign: sign
        }).then((res) => {
          if (res.code === '0') {
            this.numItem = res.data
            console.log(res)
            this.$refs['PackagePopUp'].init()
          }
          // this.$router.push({ name: 'SupplierPayableManage', params: { orderCode: res.data.orderNo } })
        })
      }
    },
    // 随机字符串
    randomString() {
      var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var result = ''
      for (var i = 17; i > 0; --i) result += str[Math.floor(Math.random() * str.length)]
      return result
    },
    async buy(price, name) {
      if (price === 59800) {
        window.open('/user/cashier')
      } else if (price === 19800) {
        window.open('/user/cashier2')
      } else {
        window.open('/user/cashier3')
      }
      // const data = {
      //   messageAmount: this.messageAmount,
      //   serviceFeeType: this.serviceFeeType,
      //   serviceFeeAmount: this.serviceFeeList[this.serviceFeeType - 1].price,
      //   packageId: packageId
      // }
      // const ret = await addPackageOrder(data)
      // if (ret.code === '0') {

      //   // this.$router.push('/user/cashier/' + ret.data.orderNo)
      // }
    },
    // 去激活传入
    async Deactivation() {
      clearInterval(this.CallbackStatus)
      await accountStatus().then((res) => {
        if (!res.data.protocol) {
          signAContract({
            jumpUrl: 'http://www.baidu.com',
            ut: this.getcookie('ut')
          }).then((res) => {
            if (res.code === '0') {
              this.url = res.data
              this.singContractVisible = true
              this.CallbackStatus = setInterval(() => {
                accountStatus().then((res) => {
                  if (res.data.protocol) {
                    this.singContractVisible = false
                    clearInterval(this.CallbackStatus)
                    return this.Deactivation()
                  }
                })
              }, 2000)
            }
          })
        } else if (!res.data.phone) {
          paymentManagementStatus().then((res) => {
            if (res.code === '0') {
              if (res.data.phoneType === 3) {
                this.statusNum = 3
                this.popupVisible = true
              } else if (res.data.phoneType === 4) {
                this.$message.info('重新绑定手机号审核中！')
              } else if (res.data.phoneType === 5) {
                this.statusNum = 11
                this.popupVisible = true
              } else {
                this.statusNum = 1
                this.popupVisible = true
              }
            }
          })
        } else if (!res.data.password) {
          queryFincePhone().then((res) => {
            if (res.code === '0') {
              this.getPhone = res.data + ''
            }
          })
          this.statusNum = 2
          this.popupVisible = true
        } else {
          this.isRecharge = true
          this.popupVisible = false
          this.$message.info('激活完成!')
        }
      })
    },
    getcookie(objname) {
      var arrstr = document.cookie.split('; ')
      for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split('=')
        if (temp[0] === objname) return unescape(temp[1])
      }
    },
    resetStatus(val) {
      if (val === 0) {
        this.Deactivation()
      }
    },
    closeSingContract() {
      this.singContractVisible = false
      clearInterval(this.CallbackStatus)
    }
  }
}
</script>

<style lang="less" scoped>
.item-img {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  .img {
    width: auto !important;
    height: auto !important;
    max-width: 100% !important;
    max-height: 210px !important;
    margin: 0 auto !important;
  }
}
.authention-apply-main {
  box-sizing: border-box;
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .cards {
    padding: 33px 25px;
    width: 1000px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #ffffff;
    .item {
      overflow: hidden;
      width: 260px;
      // height: 340px;
      padding-bottom: 10px;
      background: #ffffff;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      margin: 10px;
      align-items: center;
      position: relative;
      .item-img {
        width: 100%;
      }
      // .img {
      //   width: 100%;
      //   max-width: 260px;
      //   height: 80%;
      // }
      .package-name {
        // position: absolute;
        // top: 120px;
        // left: 50%;
        // transform: translate(-50%, 0%);
        width: 100%;
        margin-top: 20px;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        line-height: 20px;
        text-shadow: 0 1px 2px #862800;
      }
      .price-box {
        display: flex;
        flex-direction: row;
        margin-top: 20px;
        .price {
          font-family: PingFangSC-Medium;
          font-size: 40px;
          color: #ff6b00;
          letter-spacing: 0;
        }
        .name {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #000000;
          letter-spacing: 0;
          padding-top: 24px;
          font-weight: bold;
          margin-left: 1px;
        }
      }
      .btn-box {
        display: flex;
        flex-direction: row;
        margin-top: 10px;
        .btns {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 88px;
          height: 32px;
          background-image: linear-gradient(270deg, #ff9336 0%, #ff6b00 100%);
          border-radius: 2px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #ffffff;
          margin: 0 6px;
        }
      }
      .other {
        width: 188px;
        border-top: dashed 1px #eee;
        margin-top: 22.5px;
        padding: 18px 6px 12px 0px;
        .other-item {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #6a707d;
          line-height: 12px;
          .icon {
            color: #ff6b00;
            font-size: 8px;
            margin-right: 5px;
            line-height: 12px;
          }
        }
      }
    }
  }
  .con {
    padding: 7px 10px 30px 10px;
    width: 960px;
    .content {
      .table {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #262626;
        letter-spacing: 0;
        line-height: 18px;
        width: 100%;
        .table_1 {
          background-image: linear-gradient(-270deg, #ff8720 0%, #ff6241 100%);
          height: 48px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          line-height: 18px;
        }
        .tablTthTr {
          height: 48px;
          text-align: center;
          line-height: 48px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #262626;
          letter-spacing: 0;
          td {
            border: 1px solid #e5e5e5;
          }
          .img {
            width: 16px;
          }
        }
        .bg-org {
          background: rgba(255, 107, 0, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.8) !important;
          border-left: none !important ;
        }
        .bg-org1 {
          background: rgba(255, 107, 0, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.32) !important;
          border-left: none !important ;
        }
        .text-l {
          text-align: left;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #262626;
          letter-spacing: 0;
          line-height: 14px;
          padding-left: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.8) !important;
        }
        .text2 {
          line-height: 18px;
        }

        .text-v {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          img {
            width: 24px;
            height: 24px;
            margin-bottom: 8px;
          }
          div {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #ff6b00;
            letter-spacing: 0;
            width: 14px;
            line-height: 18px;
            font-weight: bold;
          }
          .text-x {
            font-size: 14px;
            line-height: 14px;
            font-family: PingFangSC-Regular;
            font-weight: normal !important;
            color: #262626 !important;
          }
          .price {
            color: #ff6b00 !important;
            font-family: PingFangSC-Medium;
            font-size: 40px;
            letter-spacing: 0;
            line-height: 48px;
          }
        }
      }
    }
  }
}
.radio-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.table {
  width: 1000px;
  margin-bottom: 100px;
}
/deep/ .ant-table-thead {
  tr {
    th {
      // background: linear-gradient(-270deg, #ff8720 0%, #ff6241 100%) !important;
      background: #ff8720;
      color: #fff !important;
      text-align: center !important;
    }
  }
}
/deep/ .anticon-check {
  color: #ff8720;
  font-size: 16px;
  margin: 0 auto;
  display: block;
}
/deep/ .ant-rate {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
}
/deep/ .ant-rate-star {
  color: #ff8720;
  text-align: center;
}
/deep/ .ant-table-tbody {
  text-align: center;
}
.div {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.img {
  width: 25px;
  height: 25px;
  margin-bottom: 10px;
}
.span {
  writing-mode: vertical-lr;
  text-align: center;
  line-height: 25px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ff6b00;
  // letter-spacing: 0;
  width: 14px;
  // line-height: 18px;
  font-weight: 700;
}
</style>
