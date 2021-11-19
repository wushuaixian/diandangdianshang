import store from '@/store'
import { IS_SUPPLIERS, IS_PURCCHASEERS, IS_OPEERATE } from '@/store/platform-types'
export const PERMISSION_ENUM = {
  add: { key: 'add', label: '新增' },
  delete: { key: 'delete', label: '删除' },
  edit: { key: 'edit', label: '修改' },
  query: { key: 'query', label: '查询' },
  get: { key: 'get', label: '详情' },
  enable: { key: 'enable', label: '启用' },
  disable: { key: 'disable', label: '禁用' },
  import: { key: 'import', label: '导入' },
  export: { key: 'export', label: '导出' }
}

/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param Vue
 */
function plugin(Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth &&
    Object.defineProperties(Vue.prototype, {
      $auth: {
        get() {
          const _this = this
          return permissions => {
            const [permission, action] = permissions.split('.')
            const permissionList = _this.$store.getters.roles.permissions
            return (
              permissionList
                .find(val => {
                  return val.permissionId === permission
                })
                .actionList.findIndex(val => {
                  return val === action
                }) > -1
            )
          }
        }
      }
    })

  !Vue.prototype.$enum &&
    Object.defineProperties(Vue.prototype, {
      $enum: {
        get() {
          // const _this = this;
          return val => {
            let result = PERMISSION_ENUM
            val &&
              val.split('.').forEach(v => {
                result = (result && result[v]) || null
              })
            return result
          }
        }
      }
    })
  !Vue.prototype.$hasPlatform &&
    Object.defineProperties(Vue.prototype, {
      $hasPlatform: {
        get() {
          // const _this = this;
          return val => {
            return store?.state?.permission?.platformList?.includes(val)
          }
        }
      }
    })
  // 是否为供应商
  !Vue.prototype.$hasSuppliers &&
    Object.defineProperties(Vue.prototype, {
      $hasSuppliers: {
        get() {
          // const _this = this;
          return val => {
            const type = val || store?.state?.permission?.isPlatform
            return type === IS_SUPPLIERS
          }
        }
      }
    })
  // 是否为采购商
  !Vue.prototype.$hasPurcchaseers &&
    Object.defineProperties(Vue.prototype, {
      $hasPurcchaseers: {
        get() {
          // const _this = this;
          return val => {
            const type = val || store?.state?.permission?.isPlatform
            return type === IS_PURCCHASEERS
          }
        }
      }
    })
  // 是否为运营
  !Vue.prototype.$hasOpeerate &&
    Object.defineProperties(Vue.prototype, {
      $hasOpeerate: {
        get() {
          // const _this = this;
          return val => {
            const type = val || store?.state?.permission?.isPlatform
            return type === IS_OPEERATE
          }
        }
      }
    })
}

export default plugin
