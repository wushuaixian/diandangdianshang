 # <ExportFile :mode="feeBillManageImplExport"
        :params="{
          templateCode: 'paymentNoteFlowLlistExport',
          fileName: '付款记录列表',
          jsonTxt: JSON.stringify(jsonTxt),
          exportType: 'exportInvoiceInfoList'
        }"
      />
    templateCode : 后端标识码   fileName : 文件名称    jsonTxt : Object 查询条件 :mode: Function 后端不使用默认接口时传入

# 多个导出按钮
paramsList = [
  {
    name: '导出订单',
    params: {
      templateCode: 'quyerOrderListPageExport',
      jsonTxt: {},
      exportType: 'quyerOrderListPageExport',
      fileName: '采购订单导出'
    }
  },
  {
    name: '导出订单行',
    params: {
      templateCode: 'quyerOrderLineListPageExport',
      jsonTxt: {},
      exportType: 'quyerOrderLineListPageExport',
      fileName: '采购订单行导出'
    }
  }
]
