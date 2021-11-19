<template>
  <div class="mid">
    <a @click="bumint">转移物料</a>
    <a-modal
      destroy-on-close
      :visible="popupStatus"
      title="转移物料"
      @ok="handleOk"
      @cancel="closePupup"
      width="600px"
      okText="确定"
      cancelText="取消"
    >
      <p>
        <span class="title">公司名称:{{ merchantName }}</span>
      </p>
      <p>
        <span class="title">采购员:{{ fileData.identityCardName }}</span>
      </p>
      <p>
        <span class="title">可转移类目:</span>
        <s-table
          name="importBox"
          :row-selection="rowSelection"
          :showSizeChanger="false"
          :data="init"
          :columns="columns"
          rowKey="materialCategoryId"
          :isCanFilter="false"
        ></s-table>
      </p>
      <formbox @sonfather="sonfathers($event)" :ids="ids" />
    </a-modal>
  </div>
</template>

<script>
import { getMaterialByUser, transferMaterial } from '@/api/supplier'
import formbox from './formbox.vue'
export default {
  components: { formbox },
  props: {
    fileData: {
      type: Object,
      default: () => {}
    },
    ids: {
      type: String,
      default: () => {}
    },
    merchantName: {
      type: String,
      default: () => {}
    }
  },
  data() {
    return {
      objlck: {
        buyerUserId: '',
        newBuyerUserId: '',
        materialCategoryId: []
      },
      visible: false,
      columns: [
        {
          title: '物料类目',
          dataIndex: 'fullNamePath'
        }
      ],
      column: [
        {
          title: '选择',
          dataIndex: 'fullNamePath'
        },
        {
          title: '序号',
          dataIndex: 'fullNamePath'
        },
        {
          title: '姓名',
          dataIndex: 'identityCardName'
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '组织',
          dataIndex: 'fullNamePath'
        },
        {
          title: '已分配物料类目',
          dataIndex: 'fullNamePath'
        }
      ],
      popupStatus: false,
      failReason: '',
      radioStatus: this.defaultValue || 1,
      list: { buyerUserId: '' },
      terdata: {
        currentPage: 1,
        itemsPerPage: 10,
        merchantId: 19090515210263,
        likeName: '测试'
      }
    }
  },
  watch: {
    popupStatus(val) {
      if (val) {
        this.failReason = ''
        this.radioStatus = 1
      }
    }
  },
  methods: {
    sonfathers(value) {
      this.objlck.newBuyerUserId = value.id
      this.objlck.buyerUserName = value.identityCardName
    },
    bumint() {
      this.list.buyerUserId = this.fileData?.buyerUserId
      this.popupStatus = true
    },
    async init(pagination) {
      const { buyerUserId } = this.list
      const data = {
        buyerUserId
      }
      return getMaterialByUser(data)
    },
    Reset() {
      this.popupStatus = true
      this.materialSource = 0
    },
    closePupup() {
      this.popupStatus = false
    },
    handleOk() {
      if (this.objlck.materialCategoryId?.length <= 0) {
        this.$message.warning('请选择至少一条转移类目数据')
        return
      } else if (this.objlck?.newBuyerUserId?.length <= 0) {
        this.$message.warning('请选择至少一条采购员')
        return
      }
      this.objlck.buyerUserId = this.fileData?.buyerUserId
      // this.popupStatus = false
      this.getList()
    },
    async getList() {
      const obj = {
        buyerUserId: this.objlck?.buyerUserId,
        materialCategoryIds: this.objlck.materialCategoryId,
        newBuyerUserId: String(this.objlck?.newBuyerUserId),
        newBuyerUserName: String(this.objlck?.buyerUserName)
      }
      try {
        const data = await transferMaterial(obj)
        if (data.code === '0') {
          this.$emit('search')
        }
        this.objlck.materialCategoryId = []
        this.objlck.newBuyerUserId = ''
        this.popupStatus = false
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      // const { selectedRowKeys } = that.state
      return {
        // selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          const array = []
          for (let index = 0; index < selectedRows.length; index++) {
            array.push(selectedRows[index].materialCategoryId)
          }
          that.objlck.materialCategoryId = array
          // that.state.selectedRowKeys = selectedRowKeys
          // that.idList = selectedRowKeys
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  .margin {
    margin: 20px;
  }
  .SearchName {
    text-align: center;
    display: flex;
    align-items: center;
    span {
      margin-left: 60px;
    }
    .nameSearchIpt {
      width: 300px;
    }
  }
}
// .bottom {
//   width: 147px;
//   margin-left: 10px;
// }
// .title {
//   margin-left: 20px;
//   font-size: 14px;
//   color: #262626;
// }
// .ui-middle {
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
// }
// .m-radio {
//   display: inline-block;
//   position: relative;
//   width: 16px;
//   height: 16px;
//   border: solid 1px #ccc;
//   border-radius: 50%;
//   cursor: pointer;
//   margin-left: 7px;
//   margin-right: 8px;
//   top: 3px;
// }
// .m-radio:after {
//   .ui-middle;
//   content: '';
//   width: 6px;
//   height: 6px;
//   border-radius: 50%;
//   background-color: #fff;
// }
// .m-check {
//   display: inline-block;
// }
// .m-check input[type='radio'] {
//   display: none;
// }
// .m-check input[type='radio']:checked + div {
//   border: solid 2px #ff6b00;
//   background: #ff6b00;
// }
// .m-check input[type='radio']:checked + div:after {
//   background-color: #fff;
// }
// .leftSpacing {
//   margin-left: 118px;
//   margin-top: 16px;
// }
// .ant-input {
//   width: 210px;
// }
// .text {
//   position: relative;
//   div {
//     position: absolute;
//     right: 36px;
//     bottom: 6px;
//     z-index: 20;
//     font-size: 14px;
//     color: #cccccc;
//   }
// }
</style>
