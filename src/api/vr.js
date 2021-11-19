import request from '@/utils/request'
// import mrequest from '@/utils/mrequest'

const VRApi = {
  // VR作品编辑..........................................................
  createProduction: '/dingdang-virtual-reality-web/productionInfo/createProduction', // 创建作品
  editProdction: '/dingdang-virtual-reality-web/productionInfo/editProdction', // 编辑作品
  deleteProduction: '/dingdang-virtual-reality-web/productionInfo/deleteProduction', // 删除作品
  productionPreviewInMid: '/dingdang-virtual-reality-web/productionInfo/productionPreviewInMid', // 作品详情
  queryBySceneId: '/dingdang-virtual-reality-web/sceneMid/queryBySceneId', // 获取选中场景信息
  insertSelective: '/dingdang-virtual-reality-web/sceneMid/insertSelective', // 增加场景
  queryMakersBySceneId: '/dingdang-virtual-reality-web/hotstopMid/queryMakersBySceneId', // 获取热点信息
  selectList: '/dingdang-virtual-reality-web/icon/selectList', // 图标列表
  saveHotstop: '/dingdang-virtual-reality-web/hotstopMid/saveHotstop', // VR热点添加
  setFirstScene: '/dingdang-virtual-reality-web/sceneMid/setFirstScene', // 设为初始场景
  getSelectList: '/dingdang-virtual-reality-web/sceneMid/selectList', // 查询场景列表
  updatePositonById: '/dingdang-virtual-reality-web/sceneMid/updatePositonById', // 初始化视角
  deleteById: '/dingdang-virtual-reality-web/sceneMid/deleteById', // 删除场景
  deleteMarker: '/dingdang-virtual-reality-web/hotstopMid/delete', // 删除热点
  editProductionMid: '/dingdang-virtual-reality-web/productionInfo/editProductionMid', // 修改作品信息
  saveAndClose: '/dingdang-virtual-reality-web/productionInfo/saveAndClose', // 保存并关闭
  closeProduction: '/dingdang-virtual-reality-web/productionInfo/closeProduction', // 关闭不保存
  // VR素材库...............................................................
  batchDel: '/dingdang-virtual-reality-web/vrIcon/batchDel', // 删除图片列表
  queryVrMaterials: '/dingdang-virtual-reality-web/vrmaterial/queryVrMaterials', // 获取素材库图片列表
  queryMerchantOrgInfos: '/dingdang-virtual-reality-web/merchantOrgInfo/queryMerchantOrgInfos', //  获取供应商列表
  deleteMaterialById: '/dingdang-virtual-reality-web/vrmaterial/deleteMaterialById', // 删除素材库图片
  updataMaterialName: '/dingdang-virtual-reality-web/vrmaterial/updataMaterialName', // 修改素材库图片名称
  // VR编辑列表................................................................
  getProductionInfo: '/dingdang-virtual-reality-web/productionInfo/getProductionInfo', // 分页查询审批列表
  // VR审核列表................................................................
  reviewProdction: '/dingdang-virtual-reality-web/productionInfo/reviewProdction' // 作品审批接口
}
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL
// 图片上传
export const uploadImg = API_BASE_URL + '/dingdang-virtual-reality-web/file/signalUpload'
// 图片上传 单个
export const signalUploadImg = API_BASE_URL + '/dingdang-virtual-reality-web/file/uploadSignalFile'

// 作品审批接口
export function reviewProdction(params) {
  return request({
    url: VRApi.reviewProdction,
    method: 'post',
    data: params
  })
}

// 分页查询审批列表
export function getProductionInfo(params) {
  return request({
    url: VRApi.getProductionInfo,
    method: 'post',
    data: params
  })
}
// 修改素材库图片名称
export function editIconTilte(data) {
  return request({
    url: VRApi.updataMaterialName,
    method: 'post',
    data
  })
}
// 删除素材库图片
export function delIcon(data) {
  return request({
    url: VRApi.deleteMaterialById,
    method: 'post',
    data
  })
}
// 获取供应商列表
export function getMerchantList(data) {
  return request({
    url: VRApi.queryMerchantOrgInfos,
    method: 'post',
    data
  })
}
// 获取素材库图片列表
export function getIconList(data) {
  return request({
    url: VRApi.queryVrMaterials,
    method: 'post',
    data
  })
}
// 删除图片列表
export function delIconOne(data) {
  return request({
    url: VRApi.batchDel,
    method: 'post',
    data
  })
}

// VR编辑接口/..................................................................................................
// 创建作品
export function createProduction(data) {
  return request({
    url: VRApi.createProduction,
    method: 'post',
    data
  })
}
// 编辑作品

export function editProdction(data) {
  return request({
    url: VRApi.editProdction,
    method: 'post',
    data
  })
}
// 删除作品
export function deleteProduction(data) {
  return request({
    url: VRApi.deleteProduction,
    method: 'post',
    data
  })
}
// 作品详情
export function productionPreviewInMid(data) {
  return request({
    url: VRApi.productionPreviewInMid,
    method: 'post',
    data
  })
}
// 通过场景id获取场景信息
export function queryBySceneId(params) {
  return request({
    url: VRApi.queryBySceneId,
    method: 'get',
    params
  })
}
// VR获取热点信息
export function queryMakersBySceneId(params) {
  return request({
    url: VRApi.queryMakersBySceneId,
    method: 'get',
    params
  })
}
// VR获取热点信息
export function selectList() {
  return request({
    url: VRApi.selectList,
    method: 'get'
  })
}
// VR热点添加
export function saveHotstop(data) {
  return request({
    url: VRApi.saveHotstop,
    method: 'post',
    data
  })
}
// 设置当前场景为初始场景
export function setFirstScene(data) {
  return request({
    url: VRApi.setFirstScene,
    method: 'post',
    data
  })
}

// 查询场景列表
export function getSelectList(data) {
  return request({
    url: VRApi.getSelectList,
    method: 'post',
    data
  })
}
// 修改初始视角
export function updatePositonById(data) {
  return request({
    url: VRApi.updatePositonById,
    method: 'post',
    data
  })
}
// 删除场景
export function deleteById(data) {
  return request({
    url: VRApi.deleteById,
    method: 'post',
    data
  })
}
// 删除标记点
export function deleteMarker(data) {
  return request({
    url: VRApi.deleteMarker,
    method: 'post',
    data
  })
}

// 修改作品详细信息
export function editProductionMid(data) {
  return request({
    url: VRApi.editProductionMid,
    method: 'post',
    data
  })
}
// 修改作品详细信息
export function saveAndClose(data) {
  return request({
    url: VRApi.saveAndClose,
    method: 'post',
    data
  })
}
// 修改作品详细信息
export function closeProduction(data) {
  return request({
    url: VRApi.closeProduction,
    method: 'post',
    data
  })
}
// 在作品下新增场景
export function insertSelective(data) {
  return request({
    url: VRApi.insertSelective,
    method: 'post',
    data
  })
}

// ..............................................................................
export function fetchList(params) {
  return request({
    url: '/vr/vrMaterial/list',
    method: 'get',
    params
  })
}
// 根据厂商id查询素材库
export function getMaterialLibraryByOrgId(params) {
  return request({
    url: '/vr/vrMaterialLibrary/getMaterialPage',
    method: 'get',
    params
  })
}

// 根据厂商id查询文件夹里面的素材
export function getFolderNumByFolderId(params) {
  return request({
    url: '/vr/vrFolder/pageSelectFolderAndMaterialByFolderId',
    method: 'get',
    params
  })
}

// 素材信息新增
export function vrMaterialAdd(data) {
  return request({
    url: '/vr/vrMaterial/add',
    method: 'post',
    data
  })
}
// 素材编辑
export function vrMaterialEdit(data) {
  return request({
    url: '/vr/vrMaterial/edit',
    method: 'put',
    data
  })
}
// 文件夹新增
export function vrFolderAdd(data) {
  return request({
    url: '/vr/vrFolder/add',
    method: 'post',
    data
  })
}
// 文件夹编辑
export function vrFolderEdit(data) {
  return request({
    url: '/vr/vrFolder/edit',
    method: 'put',
    data
  })
}
// 文件夹下面数据查询
export function vrFindFolder(params) {
  return request({
    url: 'vr/vrFolder/queryMaterialAndFolderNumByFolderId',
    method: 'get',
    params
  })
}
// 素材删除
export function vrMaterialDelete(params) {
  return request({
    url: '/vr/vrMaterial/delete',
    method: 'delete',
    params
  })
}
// 文件夹删除
export function vrFolderDelete(params) {
  return request({
    url: '/vr/vrFolder/delete',
    method: 'delete',
    params
  })
}
// 根据厂商id和作品名称分页查询作品列表
export function queryPageListByNameAndManufactureId(params) {
  return request({
    url: 'vr/vrProduction/queryPageListByNameAndManufactureId',
    method: 'get',
    params
  })
}
// 根据名称和厂商id查询所有素材
export function selectMaterialByManufactureId(params) {
  return request({
    url: 'vr/vrMaterial/selectMaterialByManufactureId',
    method: 'get',
    params
  })
}

// 根据作品id查询作品下的场景信息
export function selectScenesByProduction(params) {
  return request({
    url: 'vr/vrProduction/getSceneListByProductionId',
    method: 'get',
    params
  })
}

// 获取图表
// export function getIcon(params) {
//   return request({
//     url: 'vr/vrIcon/list',
//     method: 'get',
//     params
//   })
// }

// 获取场景类型列表
export function getHotstopTypeList(params) {
  return request({
    url: 'sys/api/queryDictItemsByCode',
    method: 'get',
    params
  })
}
