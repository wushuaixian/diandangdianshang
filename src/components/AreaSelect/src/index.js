import Province from './province'
import City from './city'
import Region from './region'
import './index.less'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    weight: {
      type: Number,
      default: 3 // 权重 最低为2 最高为3
    },
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      province: '',
      city: '',
      region: '',
      provinceInfo: null,
      cityInfo: null,
      regionInfo: null
    }
  },
  watch: {
    value(val) {
      this.setDefault()
    }
  },
  mounted() {
    this.setDefault()
  },
  methods: {
    setDefault() {
      const { value } = this
      if (value.length > 0) {
        const [province, city, region] = value
        this.province = province || ''
        this.city = city || ''
        this.region = region || ''
      } else {
        this.province = ''
        this.city = ''
        this.region = ''
      }
    },
    handleProvinceChange(item) {
      this.provinceInfo = item
      this.province = item?.code || ''
      const { province, provinceInfo } = this
      const value = [...[province].filter(x => x)]
      this.city = ''
      this.region = ''
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('update:selected', [provinceInfo])
    },
    handleCityChange(item) {
      this.cityInfo = item
      this.city = item?.code
      // this.region = ''
      const { province, city, provinceInfo } = this
      const value = [...[province, city].filter(x => x)]
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('update:selected', [provinceInfo, item])
    },
    handleRegionChange(item) {
      this.region = item?.code || ''
      const { province, city, region, provinceInfo, cityInfo } = this
      const value = [...[province, city, region].filter(x => x)]
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('update:selected', [provinceInfo, cityInfo, item])
    }
  },
  render(h) {
    const { weight, disabled } = this
    return (
      <div class="area-select">
        <Province disabled={disabled} value={this.province} onChange={this.handleProvinceChange} />
        {weight >= 2 ? (
          <City disabled={disabled} value={this.city} parentCode={this.province} onChange={this.handleCityChange} />
        ) : null}
        {weight >= 3 ? (
          <Region disabled={disabled} value={this.region} parentCode={this.city} onChange={this.handleRegionChange} />
        ) : null}
      </div>
    )
  }
}
