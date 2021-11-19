import QRCode from 'qrcode'
import notification from 'ant-design-vue/es/notification'

export async function generateQR(text) {
  try {
    return await QRCode.toDataURL(text)
  } catch (err) {
    notification.error({
      message: '提示',
      description: '生成二维码失败'
    })
  }
}
