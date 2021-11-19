<template>
  <div class="auditClause" v-if="tableData.length > 0">
    <header-title class="header-title">
      <span>{{ tableData[0].headName }}</span>
    </header-title>
    <a-table :columns="base" :data-source="tableData[0].items" :pagination="false" rowKey="id" bordered>
      <div slot="customTitle">考核分数 <span class="c-red">(0分-不合格；3分-达标；4分-优秀；5分-非常棒)</span></div>
      <template slot="score" slot-scope="text, record, index, data">
        <div>
          <a-input
            :disabled="isSubmit"
            @keyup="(e) => keyup(e.target.value, record, index, data)"
            :min="0"
            :max="5"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入考核分数"
          ></a-input>
        </div>
      </template>
      <template slot="truth" slot-scope="text, record, index, data">
        <div>
          <a-textarea
            :disabled="isSubmit"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入实际情况"
            :autosize="true"
          ></a-textarea>
        </div>
      </template>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[1].headName }}</span>
    </header-title>
    <a-table :columns="quality" :data-source="tableData[1].items" :pagination="false" rowKey="id" bordered>
      <div slot="customTitle">考核分数 <span class="c-red">(0分-不合格；3分-达标；4分-优秀；5分-非常棒)</span></div>
      <template slot="score" slot-scope="text, record, index, data">
        <div>
          <a-input
            :disabled="isSubmit"
            @keyup="(e) => keyup(e.target.value, record, index, data)"
            :min="0"
            :max="5"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入考核分数"
          ></a-input>
        </div>
      </template>
      <template slot="truth" slot-scope="text, record, index, data">
        <div>
          <a-textarea
            :disabled="isSubmit"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入实际情况"
            :autosize="true"
          ></a-textarea>
        </div>
      </template>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[2].headName }}</span>
    </header-title>
    <a-table :columns="research" :data-source="tableData[2].items" :pagination="false" rowKey="id" bordered>
      <div slot="customTitle">考核分数 <span class="c-red">(0分-不合格；3分-达标；4分-优秀；5分-非常棒)</span></div>
      <template slot="score" slot-scope="text, record, index, data">
        <div>
          <a-input
            :disabled="isSubmit"
            @keyup="(e) => keyup(e.target.value, record, index, data)"
            :min="0"
            :max="5"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入考核分数"
          ></a-input>
        </div>
      </template>
      <template slot="truth" slot-scope="text, record, index, data">
        <div>
          <a-textarea
            :disabled="isSubmit"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入实际情况"
            :autosize="true"
          ></a-textarea>
        </div>
      </template>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[3].headName }}</span>
    </header-title>
    <a-table :columns="product" :data-source="tableData[3].items" :pagination="false" rowKey="id" bordered>
      <div slot="customTitle">考核分数 <span class="c-red">(0分-不合格；3分-达标；4分-优秀；5分-非常棒)</span></div>
      <template slot="score" slot-scope="text, record, index, data">
        <div>
          <a-input
            :disabled="isSubmit"
            @keyup="(e) => keyup(e.target.value, record, index, data)"
            :min="0"
            :max="5"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入考核分数"
          ></a-input>
        </div>
      </template>
      <template slot="truth" slot-scope="text, record, index, data">
        <div>
          <a-textarea
            :disabled="isSubmit"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入实际情况"
            :autosize="true"
          ></a-textarea>
        </div>
      </template>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[4].headName }}</span>
    </header-title>
    <a-table :columns="sale" :data-source="tableData[4].items" :pagination="false" rowKey="id" bordered>
      <div slot="customTitle">考核分数 <span class="c-red">(0分-不合格；3分-达标；4分-优秀；5分-非常棒)</span></div>
      <template slot="score" slot-scope="text, record, index, data">
        <div>
          <a-input
            :disabled="isSubmit"
            @keyup="(e) => keyup(e.target.value, record, index, data)"
            :min="0"
            :max="5"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入考核分数"
          ></a-input>
        </div>
      </template>
      <template slot="truth" slot-scope="text, record, index, data">
        <div>
          <a-textarea
            :disabled="isSubmit"
            :value="text"
            @change="(e) => handleChange(e.target.value, record, index, data)"
            placeholder="请输入实际情况"
            :autosize="true"
          ></a-textarea>
        </div>
      </template>
    </a-table>
    <fixed-box class="btnBottom" v-if="!isSubmit">
      <a-button class="btnRight" type="primary" size="large" @click="saveReviewList">保存</a-button>
    </fixed-box>
  </div>
</template>

<script>
import { reviewList, reviewListSave } from '@/api/supplieAuthAdmin'
export default {
  // name: 'AuditClause',
  data() {
    return {
      base: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[0].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { slots: { title: 'customTitle' }, dataIndex: 'score', width: 30, scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      quality: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[1].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { slots: { title: 'customTitle' }, dataIndex: 'score', width: 30, scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      research: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[2].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { slots: { title: 'customTitle' }, dataIndex: 'score', width: 30, scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      product: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[3].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { slots: { title: 'customTitle' }, dataIndex: 'score', width: 30, scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      sale: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[4].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { slots: { title: 'customTitle' }, dataIndex: 'score', width: 20, scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      tableData: [],
      merchantId: this.$route.params.id,
      isShow: false,
      enterpriseNature: this.$store.state.enterpriseNature
    }
  },
  computed: {
    isSubmit() {
      return ['2', '3'].includes(this.$route.params.authStatus)
    }
  },
  created() {
    this.getReviewList()
    // console.log(this.isSubmit)
    // console.log(this.$route.params.authStatus)
  },
  methods: {
    handleChange(value, record, column, data) {
      record[data.key] = value
      console.log(this.tableData)
    },
    keyup(value, record, column, data) {
      if (value.length === 1) {
        value = value.replace(/[^0-5]/g, '')
      } else {
        value = ''
      }
      record[data.key] = value
    },
    // 认证审核列表
    async getReviewList() {
      const params = {
        merchantId: this.merchantId,
        enterpriseNature: this.enterpriseNature
      }
      const { data } = await reviewList(params)
      this.tableData = data
    },
    // 保存审核列表
    async saveReviewList() {
      const params = {
        merchantId: this.merchantId,
        reviewList: this.tableData
      }
      const { data } = await reviewListSave(params)
      console.log(data)
      this.$message.success('保存成功')
    },
    // 表格合并
    getRowSpanCount(data, key, target) {
      if (!Array.isArray(data)) return 1
      data = data.map((_) => _[key])
      let preValue = data[0]
      const res = [[preValue]]
      let index = 0
      for (let i = 1; i < data.length; i++) {
        if (data[i] === preValue) {
          res[index].push(data[i])
        } else {
          index += 1
          res[index] = []
          res[index].push(data[i])
          preValue = data[i]
        }
      }
      const arr = []
      res.forEach((_) => {
        const len = _.length
        for (let i = 0; i < len; i++) {
          arr.push(i === 0 ? len : 0)
        }
      })
      return arr[target]
    }
  }
}
</script>

<style lang="less" scoped>
.auditClause {
  width: 100%;
  background: #ffffff;
  .header-title {
    margin-top: 30px;
    margin-bottom: 10px;
  }
}
.c-red {
  color: red !important;
}
</style>
