<template>
  <a-modal title="套餐详情" :footer="null" width="800px" @cancel="close" :visible="visible">
    <div>
      <a-table name="setMealTableName" :data-source="tableList" :columns="columns" bordered :pagination="false">
        <template v-slot:packageName="text, { equityName, equityValue }">
          <span v-if="equityName === '影响力指数'">
            <a-rate :default-value="Number(equityValue)" allow-half disabled />
            <!-- <a-rate :name="`rate${index}`" :value="2" /> -->
          </span>
          <span v-else-if="!equityValue" style="text-algin: center">
            <a-icon type="check" />
          </span>
          <span v-else-if="equityValue">{{ equityValue }}</span>
        </template>
      </a-table>
      <!-- <table class="table">
        <tr class="table_1">
          <th colspan="1" width="8%"></th>
          <th colspan="8" width="20%">名称</th>
          <th colspan="4" width="20%" v-if="type === 4">龙头企业</th>
          <th colspan="4" width="20%" v-if="type === 3">大型企业</th>
          <th colspan="4" width="20%" v-if="type === 2">中小型企业</th>
        </tr>
        <tr class="tablTthTr">
          <td colspan="9" class="bg-org text-l">影响力指数</td>
          <td colspan="4" v-if="type === 4">
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" theme="filled" />
          </td>
          <td colspan="4" v-if="type === 3">
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" theme="filled" />
            <a-icon type="star" style="color: #ff6241" />
          </td>
          <td colspan="4" v-if="type === 2">
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
          <td colspan="8" class="bg-org1 text-l">会员年费</td>
          <td colspan="4" v-if="type === 4">
            {{ SetMealThree !== null ? SetMealThree.packageOriginalPrice : 0 | formatCurrency }}
          </td>
          <td colspan="4" v-if="type === 3">
            {{ SetMealTwo !== null ? SetMealTwo.packageOriginalPrice : 0 | formatCurrency }}
          </td>
          <td colspan="4" v-if="type === 2">
            {{ SetMealOne !== null ? SetMealOne.packageOriginalPrice : 0 | formatCurrency }}
          </td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" rowspan="3" class="bg-org1 text-l">加入门槛</td>
          <td colspan="4" rowspan="3" v-if="type === 4">
            <pre style="line-height: 30px">
合法有效的营业执照注册登记，
执照经营期限在有效期内
（大于1个月），
营业执照未处于变更中，
且同时需符合龙头商家招商标准。</pre
            >
          </td>
          <td colspan="4" rowspan="3" v-if="type === 3">
            <pre style="line-height: 30px">
合法有效的营业执照注册登记，
执照经营期限在有效期内
（大于1个月），
营业执照未处于变更中，
且同时需符合大型商家招商标准。</pre
            >
          </td>
          <td colspan="4" rowspan="3" v-if="type === 2">
            <pre style="line-height: 30px">
合法有效的营业执照注册登记，
执照经营期限在有效期内
（大于1个月），
营业执照未处于变更中，
且同时需符合中型商家招商标准。</pre
            >
          </td>
        </tr>
        <tr class="tablTthTr"></tr>
        <tr class="tablTthTr"></tr>
        <tr class="tablTthTr">
          <td colspan="9" class="bg-org text-l">企业身份标识</td>
          <td colspan="4" v-if="type === 4">各级专属标识</td>
          <td colspan="4" v-if="type === 3">各级专属标识</td>
          <td colspan="4" v-if="type === 2">各级专属标识</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="1" rowspan="3" class="bg-org">
            <div class="text-v">
              <img :src="require('@/assets/images/authention/DdAuthentication.png')" alt />
              <div>叮当认证</div>
            </div>
          </td>
          <td colspan="8" class="bg-org text-l">VR制作</td>
          <td colspan="4" v-if="type === 4">首充专享</td>
          <td colspan="4" v-if="type === 3">首充专享</td>
          <td colspan="4" v-if="type === 2">首充专享</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">免费验厂</td>
          <td colspan="4" v-if="type === 4">首充专享</td>
          <td colspan="4" v-if="type === 3">首充专享</td>
          <td colspan="4" v-if="type === 2">首充专享</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">资质认证</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2">
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
          <td colspan="8" class="bg-org1 text-l">短信费</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">专属客服通道</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">商学院基础课程</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">专享商学院培训</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">自营特惠券</td>
          <td colspan="4" v-if="type === 4">返30000元券</td>
          <td colspan="4" v-if="type === 3">返10000元券</td>
          <td colspan="4" v-if="type === 2">返2000元券</td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="1" rowspan="7" class="bg-org">
            <div class="text-v">
              <img :src="require('@/assets/images/authention/jrfu.png')" alt />
              <div>金融服务</div>
            </div>
          </td>
          <td colspan="8" class="bg-org text-l">放款时间</td>
          <td colspan="4" v-if="type === 4">T+1</td>
          <td colspan="4" v-if="type === 3">T+3</td>
          <td colspan="4" v-if="type === 2">T+7</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">融资服务费（借款到账时一次性收取）</td>
          <td colspan="4" v-if="type === 4">免收</td>
          <td colspan="4" v-if="type === 3">免收</td>
          <td colspan="4" v-if="type === 2">0.1%-0.19%</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">快速贴息服务</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">延期服务（延期还款申请）</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">金融还款优惠券</td>
          <td colspan="4" v-if="type === 4">返30000元券</td>
          <td colspan="4" v-if="type === 3">返10000元券</td>
          <td colspan="4" v-if="type === 2">返2000元券</td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">融资利率（日利率）</td>
          <td colspan="4" v-if="type === 4">0.015%-0.025%</td>
          <td colspan="4" v-if="type === 3">0.02%-0.028%</td>
          <td colspan="4" v-if="type === 2">0.025%-0.03%</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">最高融资额度</td>
          <td colspan="4" v-if="type === 4">1000万</td>
          <td colspan="4" v-if="type === 3">500万</td>
          <td colspan="4" v-if="type === 2">100万</td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="1" rowspan="5" class="bg-org1">
            <div class="text-v">
              <img :src="require('@/assets/images/authention/xcfw.png')" alt />
              <div>现场服务</div>
            </div>
          </td>
          <td colspan="8" class="bg-org1 text-l">代理收货入库体验次数</td>
          <td colspan="4" v-if="type === 4">3</td>
          <td colspan="4" v-if="type === 3">2</td>
          <td colspan="4" v-if="type === 2">1</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">代理收货入库正式服务</td>
          <td colspan="4" v-if="type === 4">200/次</td>
          <td colspan="4" v-if="type === 3">180/次</td>
          <td colspan="4" v-if="type === 2">170/次</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">代理测绘次数</td>
          <td colspan="4" v-if="type === 4">1</td>
          <td colspan="4" v-if="type === 3">1</td>
          <td colspan="4" v-if="type === 2">0</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">现场质量异议协理次数</td>
          <td colspan="4" v-if="type === 4">2</td>
          <td colspan="4" v-if="type === 3">1</td>
          <td colspan="4" v-if="type === 2">0</td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">专属服务代表</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3"></td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="1" rowspan="5" class="bg-org">
            <div class="text-v">
              <img :src="require('@/assets/images/authention/shangji@3x.png')" alt />
              <div>商机洞察</div>
            </div>
          </td>
          <td colspan="8" class="bg-org text-l">商机强提醒</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">询价专属推荐</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">参标默认勾选</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3"></td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">自然搜索排名加权</td>
          <td colspan="4" v-if="type === 4">
            <pre>
按平台会员排序规则
（同等条件优先）</pre
            >
          </td>
          <td colspan="4" v-if="type === 3">
            <pre>
按平台会员排序规则
（同等条件优先）</pre
            >
          </td>
          <td colspan="4" v-if="type === 2">
            <pre>
按平台会员排序规则
（同等条件优先）</pre
            >
          </td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">深度洽谈接待</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3"><img class="img" src="@/assets/images/gou.png" alt /></td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="1" rowspan="3" class="bg-org1">
            <div class="text-v">
              <img :src="require('@/assets/images/authention/xuanchuan@3x.png')" alt />
              <div>宣传推广</div>
            </div>
          </td>
          <td colspan="8" class="bg-org1 text-l">行业推介会</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">专属广告位</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="8" class="bg-org1 text-l">集采招标优先入围</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>

        <tr class="tablTthTr">
          <td colspan="1" rowspan="4" class="bg-org">
            <div class="text-v">
              <img :src="require('@/assets/images/authention/shuju@3x.png')" alt />
              <div>数据分析</div>
            </div>
          </td>
          <td colspan="8" class="bg-org text-l">行业分析报告</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">中标分析报告</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
        </tr>
        <tr class="tablTthTr">
          <td colspan="8" class="bg-org text-l">专属投标指导</td>
          <td colspan="4" v-if="type === 4">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 3">
            <img class="img" src="@/assets/images/gou.png" alt />
          </td>
          <td colspan="4" v-if="type === 2"></td>
        </tr>
      </table> -->
    </div>
  </a-modal>
</template>
<script>
import { queryPackageOrdeitem } from '@/api/supplier'
// import { getItemTableList } from './setNewTableList'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      SetMealThree: null,
      SetMealTwo: null,
      SetMealOne: null,
      tableList: [],
      columns: []
    }
  },
  async mounted() {
    // getPackageIsNo().then((res) => {
    //   console.log(res)
    //   for (let i = 0; i < res.data.packageInfoList.length; i++) {
    //     if (res.data.packageInfoList[i].packageName === '行业头部企业战略合作套餐') {
    //       this.SetMealThree = res.data.packageInfoList[i]
    //     } else if (res.data.packageInfoList[i].packageName === '大型企业套餐') {
    //       this.SetMealTwo = res.data.packageInfoList[i]
    //     } else if (res.data.packageInfoList[i].packageName === '中小型企业套餐') {
    //       this.SetMealOne = res.data.packageInfoList[i]
    //     }
    //   }
    // })
    const {
      data: { itemVOS, packageName }
    } = await queryPackageOrdeitem({
      orderNo: this.type
    })
    const { list, columns } = await this.getItemTableList(itemVOS, packageName, this)
    this.tableList = list
    this.columns = columns
  },
  methods: {
    close() {
      this.$emit('close')
    },
    getItemTableList(dataList, packageName, e) {
      const list = dataList.map((item, index) => {
        if ((index / 2) % 1) {
          item['background'] = 'rgba(255, 107, 0, 0.06)'
        } else {
          item['background'] = 'rgba(255, 107, 0, 0.16)'
        }
        if (item.equityType === dataList[index - 1]?.equityType && dataList[index - 1] && index !== 0) {
          item['background'] = dataList[index - 1].background
        }
        item.rowSpan = dataList.filter((i) => {
          return i.equityType === item.equityType
        }).length
        return item
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
        {
          title: packageName,
          colSpan: 1,
          dataIndex: 'equityValue',
          scopedSlots: { customRender: 'packageName' }
        }
      ]
      return { list, columns }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-table-thead {
  tr {
    th {
      // background-image: linear-gradient(-270deg, #ff8720 0%, #ff6241 100%);
      background: #ff8720;
      color: #fff;
    }
  }
}
/deep/ .ant-table-tbody {
  text-align: center;
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
// .table {
//   font-family: PingFangSC-Regular;
//   font-size: 14px;
//   color: #262626;
//   letter-spacing: 0;
//   line-height: 18px;
//   width: 100%;
//   .table_1 {
//     background-image: linear-gradient(-270deg, #ff8720 0%, #ff6241 100%);
//     height: 48px;
//     font-family: PingFangSC-Medium;
//     font-size: 14px;
//     color: #ffffff;
//     letter-spacing: 0;
//     text-align: center;
//     line-height: 18px;
//   }
//   .tablTthTr {
//     height: 48px;
//     text-align: center;
//     line-height: 48px;
//     font-family: PingFangSC-Regular;
//     font-size: 14px;
//     color: #262626;
//     letter-spacing: 0;
//     td {
//       border: 1px solid #e5e5e5;
//     }
//     .img {
//       width: 16px;
//     }
//   }
//   .bg-org {
//     background: rgba(255, 107, 0, 0.16);
//     border: 1px solid rgba(255, 255, 255, 0.8) !important;
//     border-left: none !important ;
//   }
//   .bg-org1 {
//     background: rgba(255, 107, 0, 0.06);
//     border: 1px solid rgba(255, 255, 255, 0.32) !important;
//     border-left: none !important ;
//   }
//   .text-l {
//     text-align: left;
//     font-family: PingFangSC-Regular;
//     font-size: 14px;
//     color: #262626;
//     letter-spacing: 0;
//     line-height: 14px;
//     padding-left: 8px;
//     border-bottom: 1px solid rgba(255, 255, 255, 0.8) !important;
//   }
//   .text2 {
//     line-height: 18px;
//   }

//   .text-v {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     padding: 0 12px;
//     img {
//       width: 24px;
//       height: 24px;
//       margin-bottom: 8px;
//     }
//     div {
//       font-family: PingFangSC-Medium;
//       font-size: 14px;
//       color: #ff6b00;
//       letter-spacing: 0;
//       width: 14px;
//       line-height: 18px;
//       font-weight: bold;
//     }
//     .text-x {
//       font-size: 14px;
//       line-height: 14px;
//       font-family: PingFangSC-Regular;
//       font-weight: normal !important;
//       color: #262626 !important;
//     }
//     .price {
//       color: #ff6b00 !important;
//       font-family: PingFangSC-Medium;
//       font-size: 40px;
//       letter-spacing: 0;
//       line-height: 48px;
//     }
//   }
// }
</style>
