<!--
 * @Author: your name
 * @Date: 2021-07-30 10:52:06
 * @LastEditTime: 2021-08-12 19:56:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/buyerOrder/paymentMethodSettings/components/phased.vue
-->
<template>
  <div>
    <a-table ref="purchasersTable" size="small" :dataSource="phasePayment" :pagination="false" :columns="columns">
      <template v-for="item in inputKeys" :slot="item.key" slot-scope="props">
        <d-slot-fileds
          :disabled="false"
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
      <template slot="opera" slot-scope="props, i, index">
        <a-button
          v-if="phasePayment.length < 4"
          style="min-width: 0; padding: 0 4px"
          type="link"
          @click="handleAddLine(index)"
        >
          <a-icon type="plus" />
        </a-button>
        <a-button
          v-if="phasePayment.length > 1"
          style="min-width: 0; padding: 0 4px"
          type="link"
          @click="handleDelLine(index)"
        >
          <a-icon type="close" />
        </a-button>
      </template>
    </a-table>
  </div>
</template>
<script>
import Enum from '@/components/_util/enum'
export default {
  props: {
    params: {
      type: String,
      default: () => null
    }
  },
  mounted() {
    if (this.params) {
      this.phasePayment = JSON.parse(this.params)
    }
  },
  data() {
    return {
      queryParams: {},
      columns: [
        { title: '付款条件', key: 'type', scopedSlots: { customRender: 'type' }, width: 100 },
        { title: '付款时间（天）', key: 'day', scopedSlots: { customRender: 'day' } },
        { title: '付款比例（%）', key: 'percent', scopedSlots: { customRender: 'percent' } },
        { title: '', key: 'opera', scopedSlots: { customRender: 'opera' }, width: 70 }
      ],
      phasePayment: [
        { type: 1, day: '', percent: '' },
        { type: 2, day: '', percent: '' },
        { type: 3, day: '', percent: '' },
        { type: 4, day: '', percent: '' }
      ],
      inputKeys: [
        {
          key: 'type',
          type: Enum.SELECT,
          options: this.getOptions()
          // options: [
          //   { value: 1, label: '下单后' },
          //   { value: 2, label: '发货后' },
          //   { value: 3, label: '入库后' },
          //   { value: 4, label: '质保金' }
          // ]
        },
        { key: 'day', type: Enum.NUMBER, floatLength: 0, min: 0 },
        { key: 'percent', type: Enum.NUMBER, floatLength: 0, max: 100, min: 0 }
      ]
    }
  },
  methods: {
    getOptions() {
      const { phasePayment } = this
      return [
        { value: 1, label: '下单后', disabled: !!phasePayment?.find((x) => x.type === 1) || true },
        { value: 2, label: '发货后', disabled: !!phasePayment?.find((x) => x.type === 2) || true },
        { value: 3, label: '入库后', disabled: !!phasePayment?.find((x) => x.type === 3) || true },
        { value: 4, label: '质保金', disabled: !!phasePayment?.find((x) => x.type === 4) || true }
      ]
    },
    isEnableSelect(index, key) {
      return (index === 0 || index === this.phasePayment.length - 1) && key === 'type'
    },
    handleAddLine(index) {
      for (let i = 1; i <= 4; i++) {
        const type = this.phasePayment[i - 1]?.type || 0
        if (type !== i) {
          this.phasePayment.splice(i - 1, 0, { type: i, day: '', percent: '' })
          this.handleChange('type')
          return
        }
      }
      // this.phasePayment.splice(index, 0, {
      //   type: this.phasePayment[index].type,
      //   day: '',
      //   percent: ''
      // })
    },
    handleDelLine(index) {
      this.phasePayment.splice(index, 1)
      this.inputKeys.find((x) => x.key === 'type').options = this.getOptions()
    },
    handleChange(key) {
      if (key === 'type') {
        this.inputKeys.find((x) => x.key === 'type').options = this.getOptions()
        const source = [...this.phasePayment]
        this.phasePayment = []
        for (let i = 1; i <= 4; i++) {
          source.map((x) => {
            if (x.type === i) {
              this.phasePayment.push(x)
            }
          })
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
</style>
