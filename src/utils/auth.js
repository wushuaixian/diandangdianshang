import cookie from './cookie'
import { ACCESS_TOKEN, PLATFORM_ID } from '@/store/mutation-types'
// 删除缓存
export function cleanLoginInfo() {
  cookie.removeItem('isPlatform')
  cookie.remove(ACCESS_TOKEN)
  cookie.remove(PLATFORM_ID)
}
