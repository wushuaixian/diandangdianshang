export default {
  mounted() {
    window.print()
    window.sessionStorage.removeItem(`printDOM`)
    window.close()
  },
  render() { return (<div domPropsInnerHTML={window.sessionStorage.getItem(`printDOM`)}></div>) }
}
