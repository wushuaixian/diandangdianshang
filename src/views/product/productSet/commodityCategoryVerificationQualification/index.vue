<!--
 * @Author: your name
 * @Date: 2021-07-07 14:52:01
 * @LastEditTime: 2021-07-07 15:13:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/product/productSet/commodityCategoryVerificationQualification/index.vue
-->
<template>
  <div>
    <a-card>
      <div class="checklog">
        <span class="text" @click="visible = true">查看操作日志</span>
      </div>
      <a-form-model :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="商品类目资质校验设置:">
          <a-radio-group v-model="queryParam.resource">
            <a-radio value="1"> 不校验 </a-radio>
            <a-radio value="2"> 校验 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 15, offset: 4 }">
          <a-button type="primary" @click="saveFunction">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-modal :width="800" v-model="visible" title="查看操作日志" @ok="handleOk">
      <s-table :data="getList" :columns="columns" :scroll="{ y: 500 }">
        <template v-slot:createTime="createTime">
          <div>{{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
      </s-table>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '商品类目资质校验设置',
    dataIndex: '',
    key: ''
  },
  {
    title: '操作人',
    dataIndex: '',
    key: ''
  },
  {
    title: '操作时间',
    dataIndex: '',
    key: '',
    scopedSlots: { customRender: 'createTime' }
  }
]
export default {
  data() {
    return {
      columns,
      queryParam: {},
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 15 }
    }
  },
  methods: {
    saveFunction() {
      const { queryParam } = this
      console.log('保存', queryParam)
    },
    handleOk() {
      this.visible = false
    },
    getList() {}
  }
}
</script>
<style scoped lang="less">
.checklog {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.text:hover {
  color: #ff6b00;
  cursor: pointer;
}
/deep/ .ant-card-body {
  min-height: 930px;
}
</style>
