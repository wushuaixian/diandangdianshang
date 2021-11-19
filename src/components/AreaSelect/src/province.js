import { queryArea } from '@/api/area'
export default {
  props: {
    value: {
      type: String | Number,
      default: ''
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
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await queryArea({
        parentCode: 100000
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
      <div class="province">
        {list.length > 0 ? (
          <a-select
            disabled={disabled}
            allowClear
            getPopupContainer={triggerNode => triggerNode.parentNode}
            value={this.value}
            placeholder="请选择"
            onChange={this.handleChange}
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
        ) : null}
      </div>
    )
  }
}
