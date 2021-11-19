/*
 * @Author: your name
 * @Date: 2021-06-27 01:05:35
 * @LastEditTime: 2021-06-27 17:24:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/constants.js
 */
export default {
  /**
   * 平台
   */
  //  platformType: [
  //   {
  //     label: '运营平台', value: 1
  //   },
  //   {
  //     label: '供应商平台', value: 6
  //   }, {
  //     label: '采购商平台', value: 7
  //   }
  // ],
  platformType: {
    1: [
      {
      label: '运营平台', value: 1
      },
      {
        label: '供应商平台', value: 6
      }, {
        label: '采购商平台', value: 7
      }
    ],
    6: [
      {
        label: '供应商平台', value: 6
      }
    ],
    7: [
      {
        label: '采购商平台', value: 7
      }
    ]
  },
  /**
   * 员工状态
   */
  staffStatus: [
    {
      label: '不可用', value: 0
    },
    {
      label: '可用', value: 1
    }
  ],
  /**
   * 员工管理=》用户类型
   */
  userTypes: [
    {
      label: '内部', value: 0
    },
    {
      label: '外部', value: 1
    }
  ],
  sexList: [
    {
      label: '男', value: 1
    },
    {
      label: '女', value: 2
    }
  ]
}
