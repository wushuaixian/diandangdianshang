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
        <a-radio-button :value="0" disabled> 订单详情 </a-radio-button>
        <a-radio-button :value="1" disabled> 审批进度 </a-radio-button>
      </a-radio-group>
    </div>
    <div v-if="mode === 0" class="header">
      <div class="l">
        <div class="state-title">状态</div>
        <div class="status">
          {{ status.orderStatusJson[form.confirmStatus] }}
        </div>
        <div class="state canceller" v-if="form.confirmStatus === 1041">驳回原因: {{ form.remark || '无' }}</div>
        <div class="btn">
          <span
            v-for="(i, index) in status.orderDetailBtn.filter((record) => {
              return record.status.includes(form.confirmStatus)
            })"
            :key="index"
          >
            <a-button :type="i.type" @click="clickFunction(i.function)">{{ i.text }}</a-button>
          </span>
        </div>
        <!-- <div class="state">{{ status[form.confirmStatus] }}</div> -->
        <!-- <div class="state canceller" v-if="form.confirmStatus === 9000">取消人: {{ form.orderCanceOperateId }}</div> -->
        <!-- <div class="btns" v-if="!disableds">
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
        </div> -->
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
    <batchConfirmationModal ref="batchConfirmationModal" @ok="reload"></batchConfirmationModal>
    <a-modal v-model="visible" title="提示">
      <div>订单确认</div>
      <div slot="footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" @click="updateStatusFn(false)">订单驳回</a-button>
        <a-button type="primary" @click="updateStatusFn(true)">订单确认</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Steps } from '@/components/Steps'
import { orderDetail } from '@/config/orderStatus'
import { updateStatus } from '@/api/orderCenter'
import batchConfirmationModal from '../orderDetailComponents/batchConfirmationModal'

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
  created() {
    console.log(this.form)
  },
  components: { Steps, batchConfirmationModal },
  data() {
    return {
      mode: 0,
      billStatus: '',
      visible: false,
      stepsList: [
        // { label: '待提交', value: '1011' },
        // { label: '提交订单', value: '1030' },
        // { label: '供应商确认', value: '1031' },
        // { label: '采购商审核完成', value: '1050' },
        // { label: '供应商发货', value: '7' },
        // { label: '入库完成', value: '8' },
        // { label: '订单完成', value: '9' }
        { label: '供应商待确认', value: '1030' },
        { label: '供应商已确认', value: '1031' },
        { label: '供应商待审核', value: '1040' },
        { label: '供应商已审核', value: '1050' },
        { label: '采购商已审核', value: '1062' },
        { label: '供应商发货', value: '1060' },
        { label: '订单完成', value: '1999' }

        // {
        //   value: '1030',
        //   label: '待确认'
        // },
        // {
        //   value: '1031',
        //   label: '已确认'
        // },
        // {
        //   value: '1032',
        //   label: '未通过'
        // },
        // {
        //   value: '1040',
        //   label: '待审核'
        // },
        // {
        //   value: '1041',
        //   label: '审核驳回'
        // },
        // {
        //   value: '1050',
        //   label: '审核通过'
        // },
        // {
        //   value: '1060',
        //   label: '已发货'
        // }
      ],
      status: orderDetail
      // status: {
      //   1030: '待确认',
      //   1041: '已驳回',
      //   1050: '待审核',
      //   1062: '审核通过',
      //   1063: '审核驳回',
      //   9000: '已取消',
      //   1011: '待提交'
      // }
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message.success('复制成功')
    },
    batchConfirmation() {
      this.$refs.batchConfirmationModal.init([this.$route.query.orderCode])
    },
    clickFunction(fn) {
      this[fn]()
    },
    sureOrder() {
      this.visible = true
      // this.$confirm({
      //   title: '确认订单',
      //   okText: '确认订单',
      //   cancelText: '订单驳回',
      //   // content: `导出任务创建成功,任务编码: ${result.data}`,
      //   async onOk() {
      //     const result = await updateStatus({
      //       orderStatus: 1031,
      //       orderCode: vm.$route.query.orderCode
      //     })
      //     if (result.code === '0') {
      //       vm.$message.success('订单确认成功')
      //       vm.$emit('resetOrder')
      //       // vm.$refs.orderListTable.refresh(true)
      //     }
      //   },
      //   async onCancel() {
      //     const result = await updateStatus({
      //       orderStatus: 1032,
      //       orderCode: vm.$route.query.orderCode
      //     })
      //     if (result.code === '0') {
      //       vm.$message.success('订单驳回成功')
      //       vm.$emit('resetOrder')
      //       // vm.$refs.orderListTable.refresh(true)
      //     }
      //   }
      // })
    },
    async updateStatusFn(bool) {
      const vm = this
      if (bool) {
        const result = await updateStatus({
          orderStatus: 1031,
          orderCode: vm.$route.query.orderCode
        })
        if (result.code === '0') {
          vm.$message.success('订单确认成功')
          vm.$emit('resetOrder')
          // vm.$refs.orderListTable.refresh(true)
        }
      } else {
        const result = await updateStatus({
          orderStatus: 1032,
          orderCode: vm.$route.query.orderCode
        })
        if (result.code === '0') {
          vm.$message.success('订单驳回成功')
          vm.$emit('resetOrder')
          // vm.$refs.orderListTable.refresh(true)
        }
      }
      this.visible = false
    },
    reload() {
      location.reload()
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
.status {
  margin: 10px 0px;
  font-weight: 600;
}
</style>
