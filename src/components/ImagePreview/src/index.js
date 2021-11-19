import './index.less'

export default {
  props: {
    value: {
      type: String | Array,
      default: ''
    },
    width: {
      type: Number,
      default: 80
    },
    height: {
      type: Number,
      default: 80
    },
    isThumbnail: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPreview: false,
      currIndex: 0,
      lastTime: 0,
      timer: null,
      defaultList: [],
      rotateValue: 0,
      scaleValue: 1,
      clientX: 0,
      clientY: 0,
      offsetLeft: 0,
      offsetTop: 0,
      isDown: false,
      imgActive: 0
    }
  },
  computed: {
    list() {
      const { value, defaultList, isThumbnail } = this
      return isThumbnail ? (value instanceof Array ? value : [value]) : defaultList
    },
    src() {
      const { value } = this
      return value instanceof Array ? value[0] : value
    },
    getRotate() {
      return this.rotateValue
    },
    isPdf() {
      const { src } = this
      return src?.includes('pdf')
    },
    isImage() {
      const { src } = this
      const type = src?.substring(src.length - 5)
      const isImage = ['bmp', 'jpg', 'png', 'jpeg', 'gif'].some(x => {
        if (type?.toLocaleLowerCase()?.includes(x)) {
          return true
        }
      })
      return isImage
    }
  },
  methods: {
    mousedown(e) {
      this.imgActive = 1
      e.preventDefault()
      this.clientX = e.clientX // 鼠标距左边的距离
      this.clientY = e.clientY
      this.offsetLeft = e.target.offsetLeft // 元素距左边的距离
      this.offsetTop = e.target.offsetTop
      this.isDown = true
      console.log(e.clientX, e.clientY, e.target.offsetLeft, e.target.offsetTop)
    },
    mousemove(e) {
      e.preventDefault()
      window.d = e.target
      if (this.isDown) {
        const x = e.clientX - (this.clientX - this.offsetLeft) + 'px'
        const y = e.clientY - (this.clientY - this.offsetTop) + 'px'
        console.log(x, y)
        // e.target.style.transform = `translate(${x},${y})`
        e.target.style.marginLeft = x
        e.target.style.marginTop = y
        // e.target.style.left = x
        // e.target.style.top = y
      } else {
        return false
      }
    },
    mouseup(e) {
      e.preventDefault()
      this.$nextTick(() => {
        this.isDown = false
      })
    },
    setContainer() {
      this.$nextTick(() => {
        const body = document.querySelector('body')
        if (body.append) {
          body.append(this.$refs.previewWrapper)
        } else {
          body.appendChild(this.$refs.previewWrapper)
        }
      })
    },
    customShow(list, currentIndex) {
      this.defaultList = list
      this.currIndex = Number(currentIndex)
      this.showPreview = true
      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', this.fnScroll, false)
      }
      window.onmousewheel = document.onmousewheel = this.fnScroll
      this.setContainer()
    },
    handlePreview() {
      this.showPreview = true
      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', this.fnScroll, false)
      }
      window.onmousewheel = document.onmousewheel = this.fnScroll
      this.setContainer()
    },
    handlePreviewPdf() {
      window.open(this.src)
    },
    handleClose() {
      this.showPreview = false
      this.removeScrollListener()
    },
    removeScrollListener() {
      if (document.addEventListener) {
        document.removeEventListener('DOMMouseScroll', this.fnScroll, false)
      }
      window.onmousewheel = document.onmousewheel = null
    },
    changeIndex(index) {
      const len = this.list.length
      this.currIndex = (index + len) % len
    },
    handleScaleIn() {
      this.imgActive = 0
      this.scaleValue = this.scaleValue + 0.5
    },
    handleRedo() {
      this.imgActive = 0
      this.rotateValue = this.rotateValue + 90
    },
    fnScroll(event) {
      let direct = 0
      const time = new Date().getTime()
      const e = event || window.eventwindow.event
      this.lastTime = time
      if (e.wheelDelta) {
        direct = e.wheelDelta
      } else if (e.detail) {
        direct = e.detail
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (direct > 0) {
          this.changeIndex(this.currIndex - 1)
        } else if (direct < 0) {
          this.changeIndex(this.currIndex + 1)
        }
      }, 80)
    },
    handleScaleOut() {
      this.imgActive = 0
      this.scaleValue = this.scaleValue === 0.5 ? this.scaleValue : this.scaleValue - 0.5
    },
    handleDownload() {
      const { isThumbnail, list, currIndex } = this
      if (!isThumbnail) {
        const url = list[currIndex]
        window.open(url, 'download')
      } else {
        window.open(this.value, 'download')
      }
    }
  },
  render(h) {
    const { showPreview, width, height, currIndex, list, isThumbnail, src, isImage, isPdf, imgActive } = this
    const isShowButton = list.length > 1
    const style = url => {
      return {
        'background-image': `url(${url})`,
        transform: `rotate(${this.rotateValue}deg) scale(${this.scaleValue},${this.scaleValue})`
      }
    }
    return (
      <div class="image-preview">
        {isThumbnail && isImage ? (
          <div class="img-content" onClick={this.handlePreview}>
            <img src={src} width={width} height={height} />
          </div>
        ) : null}
        {isPdf ? (
          <div class="img-content" onClick={this.handlePreviewPdf}>
            <embed src={src} width={width} height={height} alt="example" />
          </div>
        ) : null}
        {showPreview ? (
          <div class="image-preview-wrapper" ref="previewWrapper" onScroll={this.fnScroll}>
            <div class="preview-body">
              {list.map((x, i) => {
                return (
                  <div
                    class="preview-image"
                    class={{
                      'preview-image active': i === currIndex,
                      'preview-image image-prev': i < currIndex,
                      'preview-image image-next': i > currIndex
                    }}
                    key={i}
                  >
                    <img
                      class="imagePreview"
                      class={{
                        'imagePreview imagePreviewAnimate': imgActive === 0,
                        imagePreview: imgActive === 1
                      }}
                      style={style(x)}
                      src={x}
                      onmousedown={e => this.mousedown(e)}
                      onmousemove={e => this.mousemove(e)}
                      onmouseleave={e => this.mouseup(e)}
                      onMouseout={e => this.mouseup(e)}
                      onmouseup={e => this.mouseup(e)}
                    />
                  </div>
                )
              })}
            </div>
            {isShowButton ? (
              <div class="btn-preview preview-left" onClick={() => this.changeIndex(currIndex - 1)}>
                <a-icon type="left" />
              </div>
            ) : null}
            {isShowButton ? (
              <div class="btn-preview preview-right" onClick={() => this.changeIndex(currIndex + 1)}>
                <a-icon type="right" />
              </div>
            ) : null}
            {list.length > 1 ? (
              <div class="preview-tail">
                <div class="thumbnail-list clearfix" style={'transform: translateX(-' + 83 * currIndex + 'px);'}>
                  {list.map((x, i) => {
                    return (
                      <div
                        class="thmub-unit"
                        key={i}
                        style={'background-image: url(' + x + ')'}
                        onClick={() => this.changeIndex(i)}
                      ></div>
                    )
                  })}
                </div>
                {isShowButton ? <div class="thumb-pointer"></div> : null}
              </div>
            ) : null}

            <div class="preview-close" onClick={this.handleClose}>
              <a-icon type="close" />
            </div>
            {
              <div class="button">
                <a-icon type="zoom-in" onClick={this.handleScaleIn} />
                <a-icon type="zoom-out" onClick={this.handleScaleOut} />
                <a-icon type="redo" onClick={this.handleRedo} />
                <a-icon type="download" onClick={this.handleDownload} />
              </div>
            }
          </div>
        ) : null}
      </div>
    )
  }
}
