import './index.less'
export default {
  name: 'HeaderTitle',
  render(h) {
    const slot = Object.keys(this.$slots).length > 0 ? this.$slots.default : {}
    return <div class="head-title">{...slot}</div>
  }
}
