<template>
  <div class="order-address" v-if="form !== null">
    <template v-if="!disableds">
      <div class="item" v-for="item in list" :key="item.id" :class="{ sel: item.id === selId }" @click="sel(item)">
        <div class="title">
          <div class="name">{{ item.personName }}</div>
          <div class="tel">{{ item.presonTelephone }}</div>
          <div class="default" v-if="item.defaultCode === 1">默认地址</div>
        </div>
        <div class="line"></div>
        <div class="content">{{ item.province }}-{{ item.city }}-{{ item.area }}-{{ item.adrress }}</div>
        <div class="btns">
          <a-button class="btn" type="link" @click.stop="editAddress(item)">编辑</a-button>
          <a-button class="btn" type="link" @click.stop="delAddress(item.id)">删除</a-button>
          <a-button class="btn" type="link" v-show="item.defaultCode !== 1" @click.stop="setDefault(item.id)">
            设为默认
          </a-button>
        </div>
        <div class="yes">
          <a-icon class="icon" type="check" />
        </div>
      </div>
    </template>

    <div v-else class="item sel">
      <div class="title">
        <div class="name">{{ type === 'DEFAULT' ? form.consigneeName : form.manualOrderInvoiceVo.userName }}</div>
        <div class="tel">{{ type === 'DEFAULT' ? form.consigneePhone : form.manualOrderInvoiceVo.mobile }}</div>
      </div>
      <div class="line"></div>
      <div class="content">
        {{ type === 'DEFAULT' ? form.goodReceiverProvince : form.manualOrderInvoiceVo.province }}
        -
        {{ type === 'DEFAULT' ? form.goodReceiverCity : form.manualOrderInvoiceVo.city }}
        -
        {{ type === 'DEFAULT' ? form.goodReceiverArea : form.manualOrderInvoiceVo.region }}
        -
        {{ type === 'DEFAULT' ? form.receiveDetailAddress : form.manualOrderInvoiceVo.exactAddress }}
      </div>
      <div class="yes">
        <a-icon class="icon" type="check" />
      </div>
    </div>
    <a v-if="!disableds" class="add" @click="addAddress">
      <div class="icon"><a-icon class="ifont" type="plus" /></div>
      <div class="text">添加地址</div>
    </a>
    <a-modal :visible="visible" :width="600" @cancel="visible = false" :destroyOnClose="true" :title="addTitle">
      <template slot="footer">
        <a-button key="back" @click="visible = false"> 取消 </a-button>
        <a-button key="submit" type="primary" :loading="saveLoading" @click="$refs[ref].Save()"> 保存 </a-button>
      </template>
      <add-address :ref="ref" :form="localform" :type="type" :saveLoading.sync="saveLoading" @update="update" />
    </a-modal>
  </div>
</template>

<script>
import AddAddress from './addAddress.vue'
import * as api from '@/api/orderCenter'
import { getAllAddressForm, setDefaultUserAddressForm, deleteAddressForm } from '@/api/recevingAddress'
export default {
  created() {
    if (!this.disableds) {
      this.BindData()
    }
  },
  watch: {
    'form.userAddressId': {
      handler() {
        if (this.type === 'DEFAULT') {
          this.selId = Number(this.form.userAddressId)
        }
      },
      deep: true
    },
    'form.manualOrderInvoiceVo.invoiceAddressId': {
      handler() {
        if (this.type === 'INVOICE' && this.form.manualOrderInvoiceVo.invoiceAddressId) {
          this.selId = Number(this.form.manualOrderInvoiceVo.invoiceAddressId)
        }
      },
      deep: true
    }
  },
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    type: {
      type: String,
      default: 'DEFAULT'
    },
    form: {
      type: Object,
      default: null
    },
    disableds: {
      type: Boolean,
      default: false
    }
  },
  components: { AddAddress },
  data() {
    return {
      selId: null,
      visible: false,
      list: [],
      ref: `localform${new Date().getTime().toString()}`,
      localform: null,
      saveLoading: false,
      addTitle: ''
    }
  },
  methods: {
    sel(item) {
      this.selId = item.id
      if (this.type === 'DEFAULT') {
        this.form.userAddressId = item.id
        this.form.consigneeName = item.personName
        this.form.consigneePhone = item.presonTelephone
        this.form.goodReceiverProvinceCode = item.provinceCode
        this.form.goodReceiverProvince = item.province // 收货人省份
        this.form.goodReceiverCityCode = item.cityCode // 收货人城市code
        this.form.goodReceiverCity = item.city // 收货人城市
        this.form.goodReceiverAreaCode = item.areaCode // 收货人四级区域code
        this.form.goodReceiverArea = item.area // 收货人四级区域
        this.form.receiveDetailAddress = item.adrress // 详细地址
      } else if (this.type === 'INVOICE') {
        this.form.manualOrderInvoiceVo.invoiceAddressId = item.id
        this.form.manualOrderInvoiceVo.userName = item.personName
        this.form.manualOrderInvoiceVo.mobile = item.presonTelephone
        this.form.manualOrderInvoiceVo.provinceCode = item.provinceCode
        this.form.manualOrderInvoiceVo.cityCode = item.cityCode // 收货人城市code
        this.form.manualOrderInvoiceVo.regionCode = item.areaCode // 收货人四级区域code
        this.form.manualOrderInvoiceVo.exactAddress = item.adrress // 详细地址
        this.form.manualOrderInvoiceVo.goodReceiverProvinceName = item.province
        this.form.manualOrderInvoiceVo.goodReceiverCityName = item.city
        this.form.manualOrderInvoiceVo.goodReceiverAreaName = item.area
      }
    },
    clear() {
      this.selId = null
      if (this.type === 'DEFAULT') {
        this.form.userAddressId = null
        this.form.consigneeName = ''
        this.form.consigneePhone = ''
        this.form.goodReceiverProvinceCode = ''
        this.form.goodReceiverProvince = '' // 收货人省份
        this.form.goodReceiverCityCode = '' // 收货人城市code
        this.form.goodReceiverCity = '' // 收货人城市
        this.form.goodReceiverAreaCode = '' // 收货人四级区域code
        this.form.goodReceiverArea = '' // 收货人四级区域
        this.form.receiveDetailAddress = '' // 详细地址
      } else if (this.type === 'INVOICE') {
        this.form.manualOrderInvoiceVo.invoiceAddressId = null
        this.form.manualOrderInvoiceVo.userName = ''
        this.form.manualOrderInvoiceVo.mobile = ''
        this.form.manualOrderInvoiceVo.provinceCode = ''
        this.form.manualOrderInvoiceVo.cityCode = '' // 收货人城市code
        this.form.manualOrderInvoiceVo.regionCode = '' // 收货人四级区域code
        this.form.manualOrderInvoiceVo.exactAddress = '' // 详细地址
        this.form.manualOrderInvoiceVo.goodReceiverProvinceName = ''
        this.form.manualOrderInvoiceVo.goodReceiverCityName = ''
        this.form.manualOrderInvoiceVo.goodReceiverAreaName = ''
      }
    },
    update() {
      this.BindData()
      this.visible = false
    },
    BindData() {
      if (this.type === 'DEFAULT') {
        getAllAddressForm().then((res) => {
          if (res.code === '0') {
            this.list = res.data.map((x) => ({
              id: x.id,
              personName: x.userName,
              adrress: x.detailAddress,
              presonTelephone: x.mobile,
              provinceCode: x.provinceCode,
              cityCode: x.cityCode,
              areaCode: x.regionCode,
              province: x.provinceName,
              city: x.cityName,
              area: x.regionName,
              defaultCode: x.isDefault
            }))
            if (this.list.length > 0) {
              if (this.selId === null) {
                this.sel(this.list[0])
              } else {
                const item = this.list[this.list.map((x) => Number(x.id)).indexOf(Number(this.selId))]
                if (item) this.sel(item)
                else this.clear()
              }
            }
          }
        })
      } else {
        api.getAddressList().then((res) => {
          if (res.code === '0') {
            this.list = res.data
            if (this.list.length > 0) {
              if (this.selId === null) {
                this.sel(this.list[0])
                console.log(this.list[0])
              } else {
                const item = this.list[this.list.map((x) => Number(x.id)).indexOf(Number(this.selId))]
                if (item) this.sel(item)
                else this.clear()
              }
            }
          }
        })
      }
    },
    addAddress() {
      this.addTitle = `新增${this.type === 'DEFAULT' ? '收货' : '发票'}地址信息`
      this.localform = {
        id: null,
        personName: '',
        adrress: '',
        presonTelephone: '',
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        province: '',
        city: '',
        area: ''
      }
      this.visible = true
    },
    editAddress(item) {
      this.addTitle = `编辑${this.type === 'DEFAULT' ? '收货' : '发票'}地址信息`
      this.localform = { ...item }
      this.visible = true
    },
    delAddress(id) {
      if (this.type === 'DEFAULT') {
        deleteAddressForm({ id: id }).then((res) => {
          if (res.code === '0') {
            this.$message.success('删除地址成功')
            if (this.selId === id) {
              this.clear()
            }
            this.BindData()
          }
        })
      } else {
        api.setDelAddress(id).then((res) => {
          if (res.code === '0') {
            this.$message.success('删除地址成功')
            if (this.selId === id) {
              this.clear()
            }
            this.BindData()
          }
        })
      }
    },
    setDefault(id) {
      if (this.type === 'DEFAULT') {
        setDefaultUserAddressForm({ id: id }).then((res) => {
          if (res.code === '0') {
            this.$message.success('设置默认地址成功')
            this.BindData()
          }
        })
      } else {
        api.setDefaultAddress(id).then((res) => {
          if (res.code === '0') {
            this.$message.success('设置默认地址成功')
            this.BindData()
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order-address {
  display: flex;
  flex-direction: row;
  box-sizing: content-box;
  flex-wrap: wrap;
  .item,
  .add {
    margin-right: 24px;
    margin-top: 24px;
    width: 340px;
    height: 150px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    padding: 16px;
    transition: all 0.3s;
    overflow: hidden;
    &:hover {
      background: #f8f8f8;
      .btns {
        opacity: 1;
      }
    }
    .title {
      display: flex;
      flex-direction: row;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #262626;
      .name {
        margin-right: 24px;
      }
      .default {
        margin-left: auto;
      }
    }
    .line {
      height: 1px;
      margin: 15.5px 0;
      background: #d8d8d8;
      width: 100%;
    }
    .content {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 20px;
      color: #666666;
      height: 40px;
    }
    .btns {
      display: flex;
      flex-direction: row;
      margin-top: 3px;
      opacity: 0;
      transition: all 0.3s;
      .btn {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #1890ff;
        line-height: 18px;
        padding: 0;
        margin: 0;
        margin-right: 24px;
        min-width: 0;
        &:last-child {
          margin-left: auto;
          margin-right: 0;
        }
      }
    }
  }
  .item {
    position: relative;
    &.sel {
      background: #fcf0e6;
      color: #fd6901;
      border-color: #fd6901;
      .yes {
        top: 0;
        right: 0;
      }
    }
    .yes {
      transition: all 0.3s;
      display: block;
      height: 0px;
      width: 0px;
      position: absolute;
      top: -14px;
      right: -14px;
      color: #fff;
      border: 14px solid;
      border-color: #fd6901 #fd6901 transparent transparent;
      .icon {
        position: absolute;
        font-size: 10px;
        top: -10px;
        right: -11px;
      }
    }
  }
  .add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 0;
    &:hover {
      .icon {
        border: solid 1px #d8d8d8;
      }
    }
    .icon {
      width: 40px;
      height: 40px;
      background: #f4f4f4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      border: solid 1px #f4f4f4;
      .ifont {
        font-size: 24px;
        color: #cccccc;
      }
    }
    .text {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      margin-top: 8px;
    }
  }
}
</style>
