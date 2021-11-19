import moment from 'moment'
import DSelect from '../DSelect/index'
import { CNumber, Text, Datetime } from '@/components/Fileds/'
import './index.less'
export default {
  name: 'DSlotFileds',
  props: {
    value: {
      type: [String, Number, Object, Array]
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      // 是否禁用控件
      type: Boolean,
      default: () => false
    },
    disabledDate: {
      type: Function,
      default: null
    },
    options: {
      // type 为select 必传
      type: Array,
      default: () => []
    },
    length: {
      // 最大长度
      type: Number,
      default: 100
    },
    floatLength: {
      // 小数点后位数
      type: Number,
      default: 0
    },
    min: {
      // 最小值
      type: Number,
      default: 0
    },
    max: {
      // 最大值
      type: Number,
      default: 100000000
    }
  },
  methods: {
    handleSelectChange (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    handleTextChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  },
  render () {
    const { type } = this
    return (
      <div class="slot-fileds">
        {type === 'text' ? (
          <Text value={this.value} onChange={this.handleTextChange} length={this.length} disabled={this.disabled} />
        ) : null}
        {type === 'date' ? (
          <Datetime
            value={this.value ? moment(this.value) : null}
            onChange={this.handleTextChange}
            disabled={this.disabled}
            disabledDate={this.disabledDate}
          />
        ) : null}
        {type === 'number' ? (
          <CNumber
            value={this.value}
            min={this.min}
            max={this.max}
            floatLength={this.floatLength}
            onChange={this.handleTextChange}
            disabled={this.disabled}
          />
        ) : null}
        {type === 'select' ? (
          <DSelect
            value={this.value}
            options={this.options}
            onChange={this.handleSelectChange}
            disabled={this.disabled}
            allowClear={false}
          />
        ) : null}
      </div>
    )
  }
}

/* <a-input value={this.value} onChange={this.handleNumberChange} /> */
