import './index.less'
export default {
  name: 'FixedBox',
  render(h) {
    return <div class="fixed-box">{...this.$slots.default}</div>
  }
}
