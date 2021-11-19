export default {
  name: 'Icon',

  props: ['type', 'isToolBar'],

  render() {
    const { type } = this
    if (this.isToolBar) {
      const type = require('./images/' + this.type + '.png')
      return (
        <img src={`${type}`} width='17px' height='17px' style='marginRight:30px'/>
      )
    } else {
      return (
        <i class='action'>
          <svg width='1em' height='1em' fill='currentColor'>
            <use xlinkHref={`#${type}`}/>
          </svg>
        </i>
      )
    }
  }
}
