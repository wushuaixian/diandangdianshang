import { queryArea } from '@/api/area'
export default {
  props: {
    parentCode: {
      type: String | Number,
      default: null
    },
    value: {
      type: String | Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    parentCode(val) {
      if (val) {
        this.getList()
      }
    }
  },
  methods: {
    async getList() {
      const { parentCode } = this
      const res = await queryArea({
        parentCode
      })
      if (res.code === '0') {
        this.list = res.data
      }
    },
    handleChange(val) {
      const { list } = this
      const item = list.find(x => x.code === val)
      this.$emit('input', val)
      this.$emit('change', { ...item })
    }
  },
  render(h) {
    const { list, disabled } = this
    return (
      <div class="city">
        <a-select
          disabled={disabled}
          allowClear
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder="请选择"
          onChange={this.handleChange}
          value={this.value}
        >
          <a-select-option value={''}>请选择</a-select-option>
          {list.map(item => {
            return (
              <a-select-option key={item.code} value={item.code}>
                {item.name}
              </a-select-option>
            )
          })}
        </a-select>
      </div>
    )
  }
}
