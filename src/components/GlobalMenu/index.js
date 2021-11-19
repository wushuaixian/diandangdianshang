export default {
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'inline'
    }
  },
  data() {
    return {
      collapsed: true,
      selectedKeys: [],
      cachedOpenKeys: [],
      openKeys: [],
      iframeUrl: process.env.VUE_APP_IFRAME_URL || 'http://admin.210-dd.dev.oudianyun.com/?hide#'
    }
  },
  computed: {
    rootSubmenuKeys: function rootSubmenuKeys(vm) {
      var keys = []
      vm.menus.forEach(function(item) {
        const path = item.isNew
          ? `/iframe/?url=${encodeURIComponent(`${this.iframeUrl}${item.url}`)}`
          : item.url || item.id
        return keys.push(path)
      })
      return keys
    },
    isIframe() {
      const { path } = this.$route
      return /iframe/.test(path)
    }
  },
  watch: {
    $route: function() {
      this.updateMenu()
    }
  },
  mounted() {
    this.updateMenu()
  },
  methods: {
    updateMenu() {
      const routes = this.$route.matched.concat()
      const hidden = this.$route.meta.hidden
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      //  this.selectedKeys = [routes[routes.length - 1].path]
      const openKeys = []
      if (this.isIframe) {
        if (this.$route.query?.url) {
          const [, path] = this.$route.query.url.split('#')
          openKeys.push(path)
        }
        this.openKeys = [...this.openKeys, ...openKeys]
      } else {
        if (this.mode === 'inline') {
          routes.forEach(function(item) {
            item.path && openKeys.push(item.path)
          })
        }
        this.openKeys = openKeys
      }
    },
    renderMenu() {
      const { menus } = this
      return menus?.map(x => {
        return x?.childs && x?.childs?.length > 0 ? this.renderSubMenu(x) : this.renderMenuItem(x)
      })
    },
    renderSubMenu(item) {
      return item?.childs && item?.childs?.length > 0 ? (
        <a-sub-menu key={item.url || item.id}>
          <span slot="title">
            {/* <a-icon type="user" /> */}
            {item.name}
          </span>
          {item?.childs.map(x => {
            return x.childs ? this.renderSubMenu(x) : this.renderMenuItem(x)
          })}
        </a-sub-menu>
      ) : (
        this.renderMenuItem(item)
      )
    },
    renderMenuItem(item) {
      const httpReg = /(http|https|ftp):\/\/([\w.]+\/?)\S*/
      const time = item?.url && item?.url.includes('?') ? `&t=${new Date().getTime()}` : `?t=${new Date().getTime()}`
      const url = `${this.iframeUrl}${item.url}${time}`
      const path = item.isNew ? `/iframe/?url=${encodeURIComponent(url)}` : item.url
      const handleClick = () => {
        const {
          $route: {
            query: { url: queryUrl }
          }
        } = this
        const [newIframe] = [...document.querySelectorAll('iframe')].filter(item => {
          return item.getAttribute('src') === queryUrl
        })
        if (newIframe) {
          newIframe.src = ''
          setTimeout(() => {
            newIframe.src = url
          }, 200)
        }
      }
      return httpReg.test(path) ? (
        <a-menu-item key={path}>
          <a href={path} target="_blank">
            {item.name}
          </a>
        </a-menu-item>
      ) : (
        <a-menu-item key={path} onClick={handleClick}>
          <router-link to={{ path }}>{item.name}</router-link>
        </a-menu-item>
      )
    }
  },

  render() {
    const handleOpenChange = openKeys => {
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    }
    return (
      <a-menu
        theme="dark"
        onOpenChange={handleOpenChange}
        open-keys={this.openKeys}
        mode="inline"
        collapsed={this.collapsed}
        selectedKeys={this.selectedKeys}
      >
        {this.renderMenu()}
      </a-menu>
    )
  }
}
