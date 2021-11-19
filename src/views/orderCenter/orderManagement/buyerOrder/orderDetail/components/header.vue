<template>
  <div v-if="form !== null">
    <div class="step"><Steps :list="stepsList" :status="String(form.confirmStatus)" /></div>
    <div class="type">
      <a-radio-group
        :disabled="form.confirmStatus === 1011"
        button-style="solid"
        v-model="mode"
        :style="{ marginBottom: '8px' }"
      >
        <a-radio-button :value="0"> 订单详情 </a-radio-button>
        <a-radio-button :value="1" :disabled="![1050, 1062, 1063, 9000].includes(form.confirmStatus)">
          审批进度
        </a-radio-button>
      </a-radio-group>
    </div>
    <div v-if="mode === 0" class="header">
      <div class="l">
        <div class="state-title">状态</div>
        <div class="state">{{ status[form.confirmStatus] }}</div>
        <div class="state canceller" v-if="form.confirmStatus === 9000">取消人: {{ form.orderCanceOperateId }}</div>
        <div class="state canceller" v-if="form.confirmStatus === 1041">驳回原因: {{ form.remark || '无' }}</div>
        <div class="btns" v-if="!disableds">
          <a-button
            class="btn"
            v-if="[1011, 1030, 1041, 1063].includes(Number(form.confirmStatus))"
            @click="$parent.Cancel()"
          >
            取消订单
          </a-button>
          <a-button
            class="btn"
            v-if="[1011, 1041, 1063].includes(Number(form.confirmStatus))"
            @click="$parent.Save(1011)"
          >
            保存订单
          </a-button>
          <a-button
            class="btn"
            v-if="[1011].includes(Number(form.confirmStatus))"
            @click="$parent.Save(1030)"
            type="primary"
          >
            提交订单
          </a-button>
          <a-button
            class="btn"
            v-if="[1041, 1063].includes(Number(form.confirmStatus))"
            @click="$parent.Save(1030)"
            type="primary"
          >
            重新提交
          </a-button>
        </div>
      </div>
      <div class="r">
        <div class="title">
          <div class="name">订单编号：{{ form.orderCode }}</div>
          <a class="copy" v-clipboard:copy="form.orderCode" v-clipboard:success="clipboardSuccess">
            <a-icon type="copy" />
          </a>
          <div class="tag" v-if="$$(form.orderLabel, 'length') > 0">{{ form.orderLabel }}</div>
        </div>
        <div class="items">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="12">
                <a-form-item label="订单来源">{{ form.purchaseOrderSourceStr }}</a-form-item>
              </a-col>
              <a-col :md="12">
                <a-form-item label="订单类型">{{ form.orderTypeStr }}</a-form-item>
              </a-col>
              <a-col :md="12">
                <a-form-item label="下单人">{{ form.userName }}</a-form-item>
              </a-col>
              <a-col :md="12">
                <a-form-item label="下单备注">{{ form.orderRemarkUser }}</a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
    <div>
      <appdflow-progress v-if="mode === 1" ref="progress" typeCode="so" :bizCode="form.orderCode" />
    </div>
  </div>
</template>

<script>
import { Steps } from '@/components/Steps'
export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    disableds: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  components: { Steps },
  data() {
    return {
      mode: 0,
      billStatus: '',
      stepsList: [
        { label: '待提交', value: '1011' },
        { label: '提交订单', value: '1030' },
        { label: '供应商确认', value: '1031,1050' },
        { label: '采购商审核完成', value: '4,1062' },
        { label: '供应商发货', value: '6' },
        { label: '入库完成', value: '8' },
        { label: '订单完成', value: '9' }
      ],
      status: {
        1030: '待确认',
        1041: '已驳回',
        1050: '待审核',
        1062: '审核通过',
        1063: '审核驳回',
        9000: '已取消',
        1011: '待提交'
      }
    }
  },
  // mounted() {
  //   this.listModuleSwitcherByKey()
  // },
  methods: {
    // async listModuleSwitcherByKey() {
    //   const res = await listModuleSwitcherByKey({ key: 'appdflow.switch' })
    //   if (res.code === '0') {
    //     this.isSwitch = Boolean(res.data?.on)
    //   }
    // },
    clipboardSuccess() {
      this.$message.success('复制成功')
    }
  }
}
</script>

<style lang="less" scoped>
.step {
  padding: 10px 43px;
  border-bottom: solid 1px #e5e5e5;
  padding-bottom: 31px;
  margin-bottom: 24px;
}
.type {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 24px;
  margin-left: 30px;
}
.header {
  display: flex;
  flex-direction: row;
  .l {
    width: 232px;
    margin-right: 24px;
    border-right: solid 1px #f1f2f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    .state-title {
      font-size: 14px;
      color: #666666;
      letter-spacing: 0;
      text-align: center;
      line-height: 18px;
    }
    .state {
      margin-top: 16px;
      font-size: 20px;
      color: #262626;
      letter-spacing: 0;
      text-align: center;
      line-height: 24px;
      font-weight: bold;
    }
    .canceller {
      font-size: 16px;
      font-weight: 400;
    }
    .btns {
      display: flex;
      flex-direction: row;
      box-sizing: content-box;
      flex-wrap: wrap;
      align-items: center;
      width: 192px;
      margin-top: 8px;
      .btn {
        width: 80px;
        height: 32px;
        margin: 8px;
        padding: 0;
      }
    }
  }
  .r {
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      .name {
        font-size: 16px;
        color: #262626;
        letter-spacing: 0;
        line-height: 18px;
        font-weight: bold;
      }
      .copy {
        color: #ff6b00;
        font-size: 16px;
        margin-left: 14px;
      }
      .tag {
        margin-left: 14px;
        line-height: 18px;
        text-align: center;
        background: #ff6b00;
        border-radius: 2px;
        width: 32px;
        height: 18px;
        font-size: 14px;
        color: #ffffff;
      }
    }
    .items {
      margin-top: 12px;
    }
  }
}
</style>
