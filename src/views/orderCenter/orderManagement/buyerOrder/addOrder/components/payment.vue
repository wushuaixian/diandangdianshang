<template>
  <div class="add-order-invoice" v-if="form !== null">
    <div class="l">
      <a-radio-group
        class="radio"
        name="radioGroup"
        :disabled="disableds"
        v-model="form.manualOrderPaymentList[0].paymentType"
        :default-value="1"
      >
        <a-radio :value="1"> 账期 </a-radio>
        <a-radio :value="2"> 分阶段 </a-radio>
      </a-radio-group>
      <div class="box" v-if="form.manualOrderPaymentList[0].paymentType === 1">
        <div class="title">结算账期</div>
        <div class="content">
          <a-form-model
            ref="paymentforms"
            :model="form.manualOrderPaymentList[0]"
            :rules="rules"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 14 }"
          >
            <a-form-model-item label="账期结算名称" prop="paymentName">
              <a-input
                placeholder="请填写账期结算名称"
                :disabled="disableds"
                v-model="form.manualOrderPaymentList[0].paymentName"
              />
            </a-form-model-item>
            <a-form-model-item label="账期结算类型" prop="paymentDaysType">
              <a-select
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                v-model="form.manualOrderPaymentList[0].paymentDaysType"
                :disabled="disableds"
                placeholder="请选择账期结算类型"
                @change="
                  () => {
                    form.manualOrderPaymentList[0].month = null
                    form.manualOrderPaymentList[0].day = null
                  }
                "
              >
                <a-select-option
                  v-for="(item, key, index) in $store.state.order.paymentDaysType"
                  :key="index"
                  :disabled="disableds"
                  :value="Number(key)"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item
              label="选择时间"
              prop="day"
              v-if="[1, 2].includes(form.manualOrderPaymentList[0].paymentDaysType)"
            >
              <a-cascader
                :disabled="disableds"
                :options="option[form.manualOrderPaymentList[0].paymentDaysType]"
                placeholder="请选择"
                :value="[form.manualOrderPaymentList[0].month, form.manualOrderPaymentList[0].day]"
                @change="handleChangeMonth"
              />
            </a-form-model-item>
            <a-form-model-item
              label="选择时间"
              prop="month"
              v-if="[3, 4].includes(form.manualOrderPaymentList[0].paymentDaysType)"
            >
              <a-cascader
                :disabled="disableds"
                :options="option[form.manualOrderPaymentList[0].paymentDaysType]"
                placeholder="请选择"
                :value="[form.manualOrderPaymentList[0].month, form.manualOrderPaymentList[0].day]"
                @change="handleChangeMonth"
              />
            </a-form-model-item>
            <a-form-model-item label="选择时间" prop="day" v-if="form.manualOrderPaymentList[0].paymentDaysType === 6">
              <a-input-number
                :disabled="disableds"
                style="width: 100%"
                placeholder="请输入"
                :formatter="(value) => `${value}天`"
                :max="36500"
                :min="0"
                v-model="form.manualOrderPaymentList[0].day"
              ></a-input-number>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <div class="table" v-else>
        <a-table
          ref="purchasersTable"
          size="small"
          :dataSource="form.manualOrderPaymentList[0].phasePayment"
          :pagination="false"
          :columns="columns"
        >
          <template v-for="item in inputKeys" :slot="item.key" slot-scope="props">
            <d-slot-fileds
              :disabled="disableds"
              :type="item.type"
              :min="item.min"
              :max="item.max"
              :options="item.options"
              :floatLength="item.floatLength"
              :key="item.key"
              v-model="props[item.key]"
              @change="handleChange(item.key)"
            ></d-slot-fileds>
          </template>
          <template v-if="!disableds" slot="opera" slot-scope="props, i, index">
            <a-button
              v-if="form.manualOrderPaymentList[0].phasePayment.length < 4"
              style="min-width: 0; padding: 0 4px"
              type="link"
              @click="handleAddLine(index)"
            >
              <a-icon type="plus" />
            </a-button>
            <a-button
              v-if="form.manualOrderPaymentList[0].phasePayment.length > 1"
              style="min-width: 0; padding: 0 4px"
              type="link"
              @click="handleDelLine(index)"
            >
              <a-icon type="close" />
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <div class="r">
      <div class="title">支付方式</div>
      <a-radio-group
        class="radio"
        :disabled="disableds"
        v-model="form.manualOrderPaymentList[0].payType"
        name="radioGroup"
        :default-value="1"
      >
        <a-radio :value="1"> 电汇 </a-radio>
        <a-radio :value="2"> 承兑汇票 </a-radio>
        <!-- <a-radio :value="3"> 两者皆是 </a-radio> -->
      </a-radio-group>
    </div>
  </div>
</template>

<script>
import Enum from '@/components/_util/enum'
const rules = {
  paymentName: [{ required: true, message: '请填写账期结算名称', trigger: 'change' }],
  paymentDaysType: [{ required: true, message: '请选择账期结算类型', trigger: 'change' }],
  month: [{ required: true, message: '请选择', trigger: 'change' }],
  day: [{ required: true, message: '请选择', trigger: 'change' }]
}
export default {
  created() {
    this.BindOption()
  },
  model: { prop: 'form', event: 'change' },
  props: { form: { type: Object, default: null }, disableds: { type: Boolean, default: false } },
  data() {
    return {
      rules,
      option: { 1: [], 2: [], 3: [], 4: [] },
      columns: [
        { title: '付款条件', key: 'type', scopedSlots: { customRender: 'type' }, width: 100 },
        { title: '付款时间（天）', key: 'day', scopedSlots: { customRender: 'day' } },
        { title: '付款比例（%）', key: 'percent', scopedSlots: { customRender: 'percent' } },
        { title: '', key: 'opera', scopedSlots: { customRender: 'opera' }, width: 70 }
      ],
      inputKeys: [
        {
          key: 'type',
          type: Enum.SELECT,
          options: this.getOptions()
        },
        { key: 'day', type: Enum.NUMBER, floatLength: 0, min: 0 },
        { key: 'percent', type: Enum.NUMBER, floatLength: 0, max: 100, min: 0 }
      ]
    }
  },
  methods: {
    getOptions() {
      const {
        form: {
          manualOrderPaymentList: [item]
        }
      } = this
      return [
        { value: 1, label: '下单后', disabled: !!item?.phasePayment?.find((x) => x.type === 1) },
        { value: 2, label: '发货后', disabled: !!item?.phasePayment?.find((x) => x.type === 2) },
        { value: 3, label: '入库后', disabled: !!item?.phasePayment?.find((x) => x.type === 3) },
        { value: 4, label: '质保金', disabled: !!item?.phasePayment?.find((x) => x.type === 4) }
      ]
    },
    isEnableSelect(index, key) {
      return (index === 0 || index === this.form.manualOrderPaymentList[0].phasePayment.length - 1) && key === 'type'
    },
    BindOption() {
      for (let i = 1; i <= 12; i++) {
        const children = []
        let days = 28
        if ([1, 3, 5, 7, 8, 10, 12].includes(i)) days = 31
        else if ([4, 6, 9, 11].includes(i)) days = 30
        for (let j = 1; j <= days; j++) children.push({ value: j, label: `${j}号` })
        this.option[1].push({ value: i, label: `${i}月`, children: children })
      }
      for (let i = 1; i <= 3; i++) {
        const children = []
        for (let j = 1; j <= 28; j++) children.push({ value: j, label: `${j}号` })
        this.option[2].push({ value: i, label: `第${i}个月`, children: children })
      }
      for (let i = 1; i <= 28; i++) {
        this.option[3].push({ value: i, label: `${i}号` })
      }
      for (let i = 1; i <= 7; i++) {
        const week = ['一', '二', '三', '四', '五', '六', '日']
        this.option[4].push({ value: i, label: `周${week[i - 1]}` })
      }
    },
    handleChangeMonth(v) {
      this.form.manualOrderPaymentList[0].month = v[0] || null
      this.form.manualOrderPaymentList[0].day = v[1] || null
    },
    handleChange(key) {
      if (key === 'type') {
        this.inputKeys.find((x) => x.key === 'type').options = this.getOptions()
        const source = [...this.form.manualOrderPaymentList[0].phasePayment]
        this.form.manualOrderPaymentList[0].phasePayment = []
        for (let i = 1; i <= 4; i++) {
          source.map((x) => {
            if (x.type === i) {
              this.form.manualOrderPaymentList[0].phasePayment.push(x)
            }
          })
        }
      }
    },
    handleAddLine(index) {
      for (let i = 1; i <= 4; i++) {
        const type = this.form.manualOrderPaymentList[0]?.phasePayment[i - 1]?.type || 0
        if (type !== i) {
          this.form.manualOrderPaymentList[0].phasePayment.splice(i - 1, 0, { type: i, day: '', percent: '' })
          this.handleChange('type')
          return
        }
      }
      // const currentKeys = this.form.manualOrderPaymentList[0].phasePayment.map((x) => x.type)
      // const options = this.getOptions()
      // const item = options.find((x) => !currentKeys.includes(x.value))
      // const currentItem = {
      //   type: item?.value,
      //   day: '',
      //   percent: ''
      // }
      // if (item.value === 1) {
      //   // 下单后
      //   this.form.manualOrderPaymentList[0].phasePayment.unshift({ ...currentItem })
      // } else if (currentKeys.includes(4)) {
      //   // 质保金
      //   const lastIndex = this.form.manualOrderPaymentList[0].phasePayment?.length
      //   this.form.manualOrderPaymentList[0].phasePayment.splice(
      //     index,
      //     lastIndex === options.length ? lastIndex - 1 : 0,
      //     { ...currentItem }
      //   )
      // } else {
      //   this.form.manualOrderPaymentList[0].phasePayment.push(currentItem)
      // }
      // this.inputKeys.find((x) => x.key === 'type').options = this.getOptions()
    },
    handleDelLine(index) {
      this.form.manualOrderPaymentList[0].phasePayment.splice(index, 1)
      this.inputKeys.find((x) => x.key === 'type').options = this.getOptions()
    }
  }
}
</script>

<style lang="less">
.add-order-invoice {
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  .l {
    border-right: solid 1px #f1f2f5;
    > .radio {
      margin-left: 24px;
    }
    .box {
      margin: 24px 24px 10px 0;
      border: 1px solid #eeeeee;
      .title {
        height: 46px;
        width: 100%;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #262626;
        line-height: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 16px;
        background: #f9f9f9;
        width: 512px;
      }
      .content {
        margin: 24px 0;
        .ant-form {
          .ant-form-item {
            margin-bottom: 12px;
          }
        }
      }
      .flex-d-r {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
        .name {
          margin-left: 10px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #262626;
          text-align: right;
          line-height: 18px;
        }
      }
    }
    .table {
      width: 514px;
      margin: 24px 24px 24px 0;
    }
  }
  .r {
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #262626;
      line-height: 20px;
      margin-left: 24px;
    }
    > .radio {
      margin-left: 48px;
      margin-top: 16px;
    }
  }
}
</style>
