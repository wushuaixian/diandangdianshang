
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <MYcheckLog></MYcheckLog>
        <br /><br />

        <a-form-model layout="inline" ref="ruleForm">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-model-item label="自主创建商品审核设置">
                <a-radio-group v-model="seletList1.auditStatus" @change="changeCustom">
                  <label> <a-radio :value="1"> 审核 </a-radio></label>
                  <label> <a-radio :value="2"> 不审核 </a-radio></label>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="物料创建商品审核设置">
                <a-radio-group v-model="seletList2.auditStatus" @change="changeMateriel">
                  <label> <a-radio :value="1"> 审核 </a-radio></label>
                  <label> <a-radio :value="2"> 不审核 </a-radio></label>
                  <label> <a-radio :value="3"> 部分审核 </a-radio></label>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48" v-if="seletList2.auditStatus === 3">
            <a-col :md="24" :sm="24">
              <a-form-model-item label="无需审核价格浮动区间">
                <a-input-number
                  @blur="blurPriceUpward"
                  :maxLength="2"
                  v-model="seletList2.priceUpward"
                  style="width: 169px"
                ></a-input-number>
                % 至
                <a-input-number
                  @blur="blurPriceDownward"
                  :maxLength="2"
                  v-model="seletList2.priceDownward"
                  style="width: 169px"
                ></a-input-number>
                %
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <a-row :gutter="48">
          <br /><br /><br /><br /><br />
          <a-col :md="8" :sm="24" class="button">
            <a-button type="primary" @click="save">保存</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
import { postSelect, postAdd } from '@/api/goodsConfigure'

import MYcheckLog from './my-checkLog.vue'

export default {
  components: { MYcheckLog },
  data() {
    return {
      priceUpward: '',
      priceDownward: '',
      seletList1: {
        auditStatus: 1,
        auditType: 1,
        companyId: 2930033,
        isDeleted: 0,
        priceDownward: null,
        priceUpward: null
      },
      seletList2: {
        auditStatus: 1,
        auditType: 1,
        companyId: 2930033,
        isDeleted: 0,
        priceDownward: null,
        priceUpward: null
      }
    }
  },
  created() {
    this.getPostSelect()
  },
  methods: {
    // 初始化查询
    getPostSelect() {
      postSelect().then((res) => {
        console.log(res)
        if (res.data.length !== 0) {
          this.seletList1 = res.data[0]
          this.seletList2 = res.data[1]
        }
      })
    },
    // 监听单选选中
    changeCustom(e) {
      this.seletList1.auditStatus = e.target.value
    },
    // 监听单选选中
    changeMateriel(e) {
      console.log('value ' + typeof e.target.value)
      this.seletList2.auditStatus = e.target.value
    },

    blurPriceUpward(e) {
      if (+e.target.ariaValueNow < 1) {
        this.seletList2.priceUpward = 0
      }
    },
    blurPriceDownward(e) {
      if (+e.target.ariaValueNow < 1) {
        this.seletList2.priceDownward = 0
      }
    },
    // 保存
    save() {
      console.log(this.seletList2.priceUpward)
      const params = [{ ...this.seletList1 }, { ...this.seletList2 }]
      // if (this.seletList2.auditStatus === 3) {
      //   if (
      //     this.seletList2.priceUpward.replace(/ /g, '') === '' ||
      //     this.seletList2.priceUpward === null ||
      //     this.seletList2.priceDownward.replace(/ /g, '') === '' ||
      //     this.seletList2.priceDownward === null
      //   ) {
      //     return notification.error({
      //       message: '提示',
      //       description: '请输入标书金额！'
      //     })
      //   }
      // }
      postAdd(params).then((res) => {
        if (res.code === '0') {
          this.getPostSelect()
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}
</style>
