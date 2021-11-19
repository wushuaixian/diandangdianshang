<template>
  <div class="auditSettings">
    <a-card>
      <h2>审核设置</h2>
      <header-title>
        <span>应付审核</span>
      </header-title>
      <s-table rowKey="sceneType" name="homePageTable" ref="table" :columns="columns" :customPage="true" :list="list">
        <template slot="sceneType" slot-scope="text">
          <div class="height">
            {{ type.find((item) => item.value === text.sceneType).label }}
          </div>
        </template>
        <template slot="approvalConfig" slot-scope="text">
          <a-radio-group :options="plainOptions" v-model="text.approvalConfig" />
        </template>
        <template slot="feeAmt" slot-scope="text">
          <div v-show="text.approvalConfig === 2">
            <span>≥ </span>
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              style="height: 25px; width: 150px"
              v-model="text.feeAmt"
            />
          </div>
          <div v-show="text.approvalConfig !== 2">_</div>
        </template>
      </s-table>
      <header-title>
        <span>付款审核</span>
      </header-title>
      <s-table rowKey="sceneType" name="homePageTable" ref="table" :columns="columns" :customPage="true" :list="list1">
        <template slot="sceneType" slot-scope="text">
          <div class="height">
            {{ type.find((item) => item.value === text.sceneType).label }}
          </div>
        </template>
        <template slot="approvalConfig" slot-scope="text">
          <a-radio-group :options="plainOptions" v-model="text.approvalConfig" />
        </template>
        <template slot="feeAmt" slot-scope="text">
          <div v-show="text.approvalConfig === 2">
            <span>≥ </span>
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="text.feeAmt"
              style="height: 25px; width: 150px"
            />
          </div>
          <div v-show="text.approvalConfig !== 2">_</div>
        </template>
      </s-table>
      <p class="center"><a-button type="primary" @click="save1">保存</a-button></p>
    </a-card>
  </div>
</template>
<script>
import { setExamine, querySetExamine } from '@/api/fince'
export default {
  components: {},
  data() {
    return {
      plainOptions: [
        { label: '否', value: 1 },
        { label: '是', value: 2 }
      ],
      type: [
        {
          value: 1,
          label: '套餐费'
        },
        {
          value: 11,
          label: '寻源保证金缴纳'
        },
        {
          value: 12,
          label: '标书费'
        },
        {
          value: 13,
          label: '平台保证金缴纳'
        },
        {
          value: 14,
          label: '寻源保证金退还'
        },
        {
          value: 15,
          label: '平台保证金退还'
        },
        {
          value: 16,
          label: '罚款'
        }
      ],
      list: [
        {
          sceneType: 1,
          approvalConfig: 1,
          feeAmt: null,
          billType: 1
        },
        {
          sceneType: 11,
          approvalConfig: 1,
          feeAmt: null,
          billType: 1
        },
        {
          sceneType: 12,
          approvalConfig: 1,
          feeAmt: null,
          billType: 1
        },
        {
          sceneType: 13,
          approvalConfig: 1,
          feeAmt: null,
          billType: 1
        },
        {
          sceneType: 14,
          approvalConfig: 1,
          feeAmt: null,
          billType: 1
        },
        {
          approvalConfig: 1,
          billType: 2,
          feeAmt: null,
          sceneType: 15
        },
        {
          sceneType: 16,
          approvalConfig: 1,
          feeAmt: null,
          billType: 1
        }
      ],
      list1: [
        {
          sceneType: 1,
          approvalConfig: 1,
          feeAmt: null,
          billType: 2
        },
        {
          sceneType: 11,
          approvalConfig: 1,
          feeAmt: null,
          billType: 2
        },
        {
          sceneType: 12,
          approvalConfig: 1,
          feeAmt: null,
          billType: 2
        },
        {
          sceneType: 13,
          approvalConfig: 1,
          feeAmt: null,
          billType: 2
        },
        {
          approvalConfig: 1,
          billType: 2,
          feeAmt: null,
          sceneType: 15
        },
        {
          sceneType: 14,
          approvalConfig: 1,
          feeAmt: null,
          billType: 2
        },
        {
          sceneType: 16,
          approvalConfig: 1,
          feeAmt: null,
          billType: 2
        }
      ],
      columns: [
        {
          title: '类型',
          key: 'sceneType',
          scopedSlots: { customRender: 'sceneType' }
        },
        {
          title: '审核设置',
          key: 'approvalConfig',
          scopedSlots: { customRender: 'approvalConfig' }
        },
        {
          title: '金额(元)',
          key: 'feeAmt',
          scopedSlots: { customRender: 'feeAmt' }
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // save() {
    //   setExamine(this.list).then((res) => {
    //     if (res.code === '0') {
    //       this.$message.success('保存成功')
    //     }
    //   })
    // },
    getData() {
      querySetExamine().then((res) => {
        this.list = res.data.filter((item) => item.billType === 1)
        this.list1 = res.data.filter((item) => item.billType === 2)
      })
    },
    save1() {
      setExamine([...this.list1, ...this.list]).then((res) => {
        if (res.code === '0') {
          this.$message.success('保存成功')
          this.getData()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.height {
  height: 25px;
  line-height: 25px;
}
.center {
  text-align: center;
  margin-top: 20px;
}
</style>
