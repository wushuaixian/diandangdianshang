import './steps.less'
export default {
  name: 'Steps',
  props: {
    status: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentIndex() {
      const current = this.list.findIndex(x => x.value.includes(this.status))
      return current
    }
  },
  render(h) {
    const { list, currentIndex } = this
    const lastIndex = list.length
    return (
      <div class="steps-box">
        {list.map((x, i) => {
          return (
            <div
              key={x.value}
              class={{
                'steps-item': i <= currentIndex,
                'steps-item disable': i > currentIndex
              }}
            >
              <div class="steps-item-container">
                <div class="steps-item-icon">
                  <span class="steps-icon">{i + 1}</span>
                </div>
                <div class="steps-item-content">{x.label}</div>
                {x?.other ? <div class="steps-item-other-box"><div class="steps-item-other">{x?.other}</div></div> : null}
              </div>
              {i !== lastIndex ? <div class="line"></div> : null}
            </div>
          )
        })}
      </div>
    )
  }
}
