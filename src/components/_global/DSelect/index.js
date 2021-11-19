import { SelectProps } from 'ant-design-vue/es/select/'
import './index.less'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  name: 'DSelect',
  props: Object.assign({}, SelectProps, {}),
  methods: {
    handleChange(val) {
      this.$emit('change', val)
      this.$emit('input', val)
      this.$emit('update:open', false)
    },
    popupContainer(triggerNode) {
      return triggerNode.parentNode
    },
    handleSearch(val) {
      this.$emit('search', val)
    }
  },
  render(h) {
    const props = {}
    Object.keys(SelectProps).forEach(k => {
      if (k === 'getPopupContainer' && !this.getPopupContainer) {
        props.getPopupContainer = this.popupContainer
        return props[k]
      }
      if (k === 'allowClear' && this.allowClear === undefined) {
        props.allowClear = true
        return props[k]
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    return (
      <div class="d-select-wrapper" ref="select">
        <a-select
          class="d-select"
          placeholder="请选择"
          value={this.value}
          options={this.options}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          {...{ props }}
        >
          {Object.keys(this.$slots).map(name => (
            <template slot={name}>{this.$slots[name]}</template>
          ))}
        </a-select>
      </div>
    )
  }
}
