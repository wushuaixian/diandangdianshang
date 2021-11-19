<template>
  <div>
    <h1>评分分值设置</h1>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item ref="name" label="店铺分值总权重：" prop="name">
        <a-input
          style="width: 50%"
          v-model="form.name"
          @blur="
            () => {
              $refs.name.onFieldBlur()
            }
          "
        />
        %
      </a-form-model-item>
    </a-form-model>
    <a-table :columns="columns" :data-source="listInput.formInputArrShop" bordered :pagination="false">
      <div slot="inputA" slot-scope="text, item, index">
        <div v-if="index < 3">
          <a-input type="number" :min="0" v-model="item.ScoreInput"></a-input>
        </div>
      </div>
      <div slot="Company" slot-scope="text, item, index">
        <div v-if="index === 0">每1个</div>
        <div v-if="index === 1">每满1万</div>
        <div v-if="index === 2">每1次</div>
        <div v-if="index === 3">每1次</div>
        <div v-if="index === 4">每满1千</div>
        <div v-if="index === 5">每1个</div>
        <div v-if="index === 6">小于 <a-input class="A" type="number" :min="0" v-model="item.Moveless"></a-input></div>
        <div v-if="index === 7">
          <div v-for="(CompanyArrItem, CompanyArrindex) in item.CompanyArr" :key="'CompanyArrindex' + CompanyArrindex">
            <a-input class="AA" type="number" :min="0" v-model="CompanyArrItem.CompanyArrInputA"></a-input>-
            <a-input class="AA" type="number" :min="0" v-model="CompanyArrItem.CompanyArrInputB"></a-input>
          </div>
        </div>
        <div v-if="index === 8">
          大于 <a-input class="A" type="number" :min="0" v-model="item.MoveGreater"></a-input>
        </div>
        <div></div>
      </div>
      <div slot="Score" slot-scope="text, item, index">
        <div v-if="index !== 9">
          <div v-if="index < 6">
            <div v-for="(ScoreArrItem, ScoreArrIndex) in item.ScoreArr" :key="'ScoreArrIndex' + ScoreArrIndex">
              <a-input type="number" v-model="ScoreArrItem.ScoreInputValue"></a-input>
            </div>
          </div>
          <div v-if="index > 5 && index < 9">
            <div v-for="(ScoreArrItem, ScoreArrIndex) in item.ScoreArr" :key="'ScoreArrIndex' + ScoreArrIndex">
              <a-input class="A" type="number" v-model="ScoreArrItem.ScoreInputValue"></a-input> * X
            </div>
          </div>
        </div>
        <div v-if="index === 9">评分 * 10%</div>
      </div>
      <div slot="upperLimit" slot-scope="text, item, index">
        <div v-if="index < 2">
          <a-input :min="0" type="number" v-model="item.upperLimitInput"></a-input>
        </div>
      </div>
      <div slot="operation" slot-scope="text, item, index">
        <div v-if="index === 7">
          <a-button @click="addInput(index)" style="width: 30px">+</a-button>
          <a-button @click="delInput(index)" style="width: 30px; margin-left: 10px">-</a-button>
        </div>
      </div>
    </a-table>
  </div>
</template>

<script>
// import { Input } from 'ant-design-vue'
export default {
  name: 'SupplierScoringScheme',
  components: {},
  props: {
    scoreWeightShop: {
      type: Number,
      required: true
    },
    formlistShopRulestValue: {
      type: Array,
      required: true
    }
  },
  watch: {
    formlistShopRulestValue(n, old) {
      if (n) {
        this.listInput.formInputArrShop = n
      }

      console.log(n, 'new')
    },
    scoreWeightShop(n, l) {
      if (n) {
        this.form.name = n
      }
    }
  },
  data() {
    return {
      listInput: {
        formInputArrShop: [
          {
            key: '1',
            ScoringItems: 'SKU总数量',
            indexARR: 0,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '2',
            ScoringItems: '总成交金额',
            indexARR: 1,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '3',
            ScoringItems: '总成交次数',
            indexARR: 2,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '4',
            ScoringItems: '卖家转买家次数',
            indexARR: 3,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '5',
            ScoringItems: '卖家转买家金额',
            indexARR: 4,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '6',
            ScoringItems: '串码成功数',
            indexARR: 5,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '7',
            ScoringItems: '物料SKU 上传时效单位：天',
            indexARR: 6,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '8',
            ScoringItems: '',
            indexARR: 7,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: 0,
                CompanyArrInputB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '9',
            ScoringItems: '',
            indexARR: 8,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '10',
            ScoringItems: '平台续费',
            indexARR: 9,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          }
        ]
      },

      form: {
        name: '',
        region: 0,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      columns: [
        {
          title: '评分项分类',
          align: 'center',
          width: 100,
          customRender: (value, row, index) => {
            const obj = {
              children: '店铺指标',
              attrs: {}
            }
            if (index === 0) {
              obj.attrs.rowSpan = this.listInput.formInputArrShop.length - 1
            }
            if (index >= 1 && index < this.listInput.formInputArrShop.length - 1) {
              console.log(this.listInput.formInputArrShop.length, 'this.listInput.formInputArrMove.length ')
              obj.attrs.rowSpan = 0
            }
            if (index === 9) {
              obj.children = '续费福利'
            }

            return obj
          }
        },
        {
          title: '评分项',
          align: 'center',
          dataIndex: 'ScoringItems',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 6) {
              obj.attrs.rowSpan = 3
            }
            if (index === 7) {
              obj.attrs.rowSpan = 0
            }
            if (index === 8) {
              obj.attrs.rowSpan = 0
            }
            return obj
          }
        },
        {
          title: '* 基础分',
          align: 'center',
          scopedSlots: { customRender: 'inputA' }
        },
        {
          title: ' 区间/单位',
          align: 'center',
          width: 230,
          // dataIndex: 'CompanyText',
          scopedSlots: { customRender: 'Company' }
        },
        {
          title: '*分值',
          align: 'center',
          scopedSlots: { customRender: 'Score' }
        },
        {
          title: '*上限',
          align: 'center',
          scopedSlots: { customRender: 'upperLimit' }
        },
        {
          title: '操作',
          align: 'center',
          width: 115,
          scopedSlots: { customRender: 'operation' }
        }
      ],

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      rules: {
        name: [
          { required: true, message: '供应商等级占比方案名称不能为空', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入2-30个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  mounted() {
    // this.$refs.myinput.addEventListener('input', function (event) {
    //   event.target.value = event.target.value.replace(/\-/g, '')
    // })
    // this.$refs.myinput
  },
  methods: {
    addInput(index) {
      this.listInput.formInputArrShop.forEach((item) => {
        if (item.indexARR === index) {
          item.CompanyArr.push({ id: index, CompanyArrInputA: 0, CompanyArrInputB: 0 })
          item.ScoreArr.push({ id: index, ScoreInputValue: 0 })
        }
      })
    },
    delInput(index) {
      this.listInput.formInputArrShop.forEach((item) => {
        if (item.indexARR === index) {
          if (item.CompanyArr.length < 2) {
            this.$message.error('最少有一组')
          } else {
            item.CompanyArr.splice(item.CompanyArr.length - 1, 1)
            item.ScoreArr.splice(item.ScoreArr.length - 1, 1)
          }
        }
      })
    },

    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    resetData() {
      this.resetForm()
      this.listInput = {
        formInputArrShop: [
          {
            key: '1',
            ScoringItems: 'SKU总数量',
            indexARR: 0,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '2',
            ScoringItems: '总成交金额',
            indexARR: 1,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '3',
            ScoringItems: '总成交次数',
            indexARR: 2,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '4',
            ScoringItems: '卖家转买家次数',
            indexARR: 3,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '5',
            ScoringItems: '卖家转买家金额',
            indexARR: 4,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '6',
            ScoringItems: '串码成功数',
            indexARR: 5,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '7',
            ScoringItems: '物料SKU 上传时效单位：天',
            indexARR: 6,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '8',
            ScoringItems: '',
            indexARR: 7,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: 0,
                CompanyArrInputB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '9',
            ScoringItems: '',
            indexARR: 8,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          },
          {
            key: '10',
            ScoringItems: '平台续费',
            indexARR: 9,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreInput: 0,
            upperLimitInput: 0,
            CompanyArr: [
              {
                CompanyArrInputA: null,
                CompanyArrInputB: null
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ],
            Score: ''
          }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .AhrB {
  margin-top: 0 !important;
}
/deep/ .Ahr {
  color: #ececec !important;
  background: #ececec !important;
}
/deep/ .AA {
  display: inline-block;
  width: 80px;
}
/deep/ .B {
  width: 150px;
}
/deep/ .C {
  width: 300px;
}
/deep/ .divtable {
  border-bottom: 1px solid #ececec;
  padding-bottom: 10px;
}
/deep/ .divtableA {
  padding-top: 10px;
}
/deep/ .ant-btn {
  width: 30px !important;
  min-width: 30px;
  padding: 5px;
  text-align: center;
  display: inline-block;
}
</style>
