<template>
  <div class="inancialInfo">
    <ul class="navigationBar">
      <li :class="{ jump: jumpNum == 1 }" @click="jumpFun(1)">验厂信息</li>
      <li :class="{ jump: jumpNum == 5 }" @click="jumpFun(5)"><span style="color: red">*</span>审核条款</li>
      <!-- <li :class="{ jump: jumpNum == 2 }" @click="jumpFun(2)">经营品类</li> -->
      <li :class="{ jump: jumpNum == 3 }" @click="jumpFun(3)">资质证书</li>
      <li :class="{ jump: jumpNum == 4 }" @click="jumpFun(4)">工商信息</li>
    </ul>
    <BusinessCategory v-if="jumpNum == 2" />
    <QualificationCertificate v-if="jumpNum == 3" />
    <FactoryInspectionInformation ref="FactoryInspectionInformation" v-if="jumpNum == 1" />
    <BusinessInfo v-if="jumpNum == 4" />
    <AuditClause v-if="jumpNum == 5" />
  </div>
</template>
<script>
// import certificate from '@/views/enterprise/certificate.vue'
import BusinessCategory from './BusinessCategory'
import QualificationCertificate from './QualificationCertificate'
import FactoryInspectionInformation from './FactoryInspectionInformation'
import BusinessInfo from './BusinessInfo.vue'
import AuditClause from './AuditClause.vue'
export default {
  data() {
    return {
      jumpNum: 1,
      enterpriseNature: '' // 企业性质
    }
  },
  methods: {
    jumpFun(value) {
      this.jumpNum = value
    }
  },
  components: {
    BusinessCategory,
    QualificationCertificate,
    FactoryInspectionInformation,
    BusinessInfo,
    AuditClause
  }
}
</script>
<style lang='less' scoped>
.inancialInfo {
  background: #ffffff;
  overflow: hidden;
  padding: 24px 25px;
  padding-top: 24px;
  margin-bottom: 60px;
  .navigationBar {
    padding: 0;
    height: 48px;
    border-bottom: 1px solid #e5e5e5;
    li {
      width: 120px;
      height: 48px;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      text-align: center;
      line-height: 48px;
      float: left;
      margin-left: 4px;
      &:first-child {
        margin-left: -1px;
      }
      &:hover {
        cursor: pointer;
        color: #ff6b00;
      }
    }
    .jump {
      border: none;
      border-top: 2px solid #ff6b00;
      border-left: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      color: #ff6b00;
      background: #ffffff;
    }
  }
}
</style>
