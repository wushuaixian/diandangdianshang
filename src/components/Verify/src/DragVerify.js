import { getSlot } from '@/utils/util'
import './DragVerify.less'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    isSlot: {
      type: Boolean,
      default: false
    },
    successText: {
      type: String,
      default: '验证成功'
    },
    height: {
      type: [Number, String],
      default: 40
    },
    width: {
      type: [Number, String],
      default: 220
    },
    circle: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: Object,
      default: () => {}
    },
    contentStyle: {
      type: Object,
      default: () => {}
    },
    barStyle: {
      type: Object,
      default: () => {}
    },
    actionStyle: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isMoving: false,
      isPassing: false,
      moveDistance: 0,
      toLeft: false,
      startTime: 0,
      endTime: 0
    }
  },
  watch: {
    isPassing (isPassing) {
      if (isPassing) {
        const { startTime, endTime } = this
        const time = (endTime - startTime) / 1000
        this.$emit('success', { isPassing, time: time.toFixed(1) })
        this.$emit('update:value', isPassing)
        this.$emit('change', isPassing)
      }
    }
  },
  computed: {
    getContentStyleRef () {
      const { height, width, contentStyle } = this
      const h = `${parseInt(height)}px`
      const w = `${parseInt(width)}px`

      return {
        height: h,
        width: w,
        ...contentStyle
      }
    },
    getActionStyleRef () {
      const { height, actionStyle } = this
      const h = `${parseInt(height)}px`
      return {
        left: 0,
        width: h,
        height: h,
        ...actionStyle
      }
    },
    getWrapStyleRef () {
      const { height, width, circle, wrapStyle } = this
      const h = parseInt(height)
      const w = `${parseInt(width)}px`
      return {
        width: w,
        height: `${h}px`,
        lineHeight: `${h}px`,
        borderRadius: circle ? h / 2 + 'px' : 0,
        ...wrapStyle
      }
    }
  },
  methods: {
    getEventPageX (e) {
      return e.pageX || e.touches[0].pageX
    },
    getOffset (el) {
      const actionWidth = parseInt(el.style.width)
      const { width } = this
      const widthNum = parseInt(width)
      const offset = widthNum - actionWidth - 6
      return { offset, widthNum, actionWidth }
    },
    handleDragStart (e) {
      if (this.isPassing) {
        return
      }

      const actionEl = this.$refs.actionElRef
      if (!actionEl) return
      this.$emit('start', e)
      this.moveDistance = this.getEventPageX(e) - parseInt(actionEl.style.left.replace('px', ''), 10)
      this.startTime = new Date().getTime()
      this.isMoving = true
    },
    handleDragOver (e) {
      const { isMoving, isPassing, moveDistance } = this
      if (isMoving && !isPassing) {
        this.$emit('end', e)
        const actionEl = this.$refs.actionElRef
        const barEl = this.$refs.barElRef
        if (!actionEl || !barEl) return
        const moveX = this.getEventPageX(e) - moveDistance
        const { offset, widthNum, actionWidth } = this.getOffset(actionEl)
        if (moveX < offset) {
          if (!this.isSlot) {
            this.resume()
          } else {
            setTimeout(() => {
              if (!this.value) {
                this.resume()
              } else {
                const contentEl = this.$rers.contentElRef
                if (contentEl) {
                  contentEl.style.width = `${parseInt(barEl.style.width)}px`
                }
              }
            }, 0)
          }
        } else {
          actionEl.style.left = `${widthNum - actionWidth}px`
          barEl.style.width = `${widthNum - actionWidth / 2}px`
          this.checkPass()
        }
        this.isMoving = false
      }
    },
    handleDragMoving (e) {
      const { isMoving, moveDistance } = this
      if (isMoving) {
        const actionEl = this.$refs.actionElRef
        const barEl = this.$refs.barElRef
        if (!actionEl || !barEl) return
        const { offset, widthNum, actionWidth } = this.getOffset(actionEl)
        const moveX = this.getEventPageX(e) - moveDistance

        this.$emit('move', {
          event: e,
          moveDistance,
          moveX
        })
        if (moveX > 0 && moveX <= offset) {
          actionEl.style.left = `${moveX}px`
          barEl.style.width = `${moveX + actionWidth / 2}px`
        } else if (moveX > offset) {
          actionEl.style.left = `${widthNum - actionWidth}px`
          barEl.style.width = `${widthNum - actionWidth / 2}px`
          if (!this.isSlot) {
            this.checkPass()
          }
        }
      }
    },
    checkPass () {
      const { isSlot } = this
      if (isSlot) {
        this.resume()
        return
      }
      this.endTime = new Date().getTime()
      this.isPassing = true
      this.isMoving = false
    },
    resume () {
      this.isMoving = false
      this.isPassing = false
      this.moveDistance = 0
      this.toLeft = false
      this.startTime = 0
      this.endTime = 0
      const actionEl = this.$refs.actionElRef
      const barEl = this.$refs.barElRef
      const contentEl = this.$refs.contentElRef
      if (!actionEl || !barEl || !contentEl) return
      this.toLeft = true
      setTimeout(() => {
        this.toLeft = false
        actionEl.style.left = '0'
        barEl.style.width = '0'
      }, 300)
      contentEl.style.width = this.width
    }
  },
  render (h) {
    const {
      getWrapStyleRef,
      getBarStyleRef,
      handleDragMoving,
      handleDragOver,
      toLeft,
      handleDragStart,
      getActionStyleRef,
      getContentStyleRef,
      $slots
    } = this
    const renderBar = () => {
      const cls = [`darg-verify-bar`]
      if (toLeft) {
        cls.push('to-left')
      }
      return <div class={cls} ref="barElRef" style={getBarStyleRef} />
    }
    const renderContent = () => {
      const cls = [`darg-verify-content`]
      const { isPassing, text, successText } = this

      isPassing && cls.push('success')

      return (
        <div class={cls} ref="contentElRef" style={getContentStyleRef}>
          {getSlot($slots, 'text', isPassing) || (isPassing ? successText : text)}
        </div>
      )
    }

    const renderAction = () => {
      const cls = [`darg-verify-action`]
      const { toLeft, isPassing } = this
      if (toLeft) {
        cls.push('to-left')
      }
      return (
        <div
          class={cls}
          onMousedown={handleDragStart}
          onTouchstart={handleDragStart}
          style={getActionStyleRef}
          ref="actionElRef"
        >
          {getSlot($slots, 'actionIcon', isPassing) ||
            (isPassing ? <a-icon type="check" /> : <a-icon type="double-right" />)}
        </div>
      )
    }
    return (
      <div
        class="darg-verify"
        ref="wrapElRef"
        style={getWrapStyleRef}
        onMousemove={handleDragMoving}
        onTouchmove={handleDragMoving}
        onMouseleave={handleDragOver}
        onMouseup={handleDragOver}
        onTouchend={handleDragOver}
      >
        {renderBar()}
        {renderContent()}
        {renderAction()}
      </div>
    )
  }
}
