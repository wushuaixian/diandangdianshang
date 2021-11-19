<template>
  <div>
    <h1>评分分值设置</h1>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item ref="name" label="动态分值总权重：" prop="name">
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
    <a-table :columns="columns" :data-source="listInput.formInputArrMove" bordered :pagination="false">
      <div slot="inputA" slot-scope="text, item, index">
        <div v-if="index === 0">
          <a-input type="number" @blur="inputAA" v-model="listInput.winningBaseScore" :value="0" :min="0" />
        </div>
        <div v-if="index === 1">
          <a-input type="number" @blur="inputBB" v-model="listInput.deliveryBaseScore" :value="0" :min="0" />
        </div>
        <div v-if="index === 2">
          <a-input type="number" @blur="inputCC" v-model="listInput.destroyBaseScore" :value="0" :min="0" />
        </div>
      </div>
      <div slot="Company" slot-scope="text, items, index">
        <div v-if="index === 0 || index < 3">每1次</div>
        <!-- <div v-if="index === 3">小于<a-input class="A" type="number" :value="0" :min="0" /></div> -->
        <div v-else>
          <div
            v-for="(item, formInputArrMoveindex) in listInput.formInputArrMove"
            :key="'indexA' + formInputArrMoveindex"
          >
            <div></div>
            <div v-if="index === item.indexARR && [3, 6, 10].includes(index)">
              小于<a-input
                class="A"
                type="number"
                v-model="item.Moveless"
                @blur="inputMoveless(index, items.Moveless)"
                :min="0"
              />
            </div>
            <div v-if="index === item.indexARR && !(index === 9 || index === 10 || index === 13)">
              <!-- {{ index }} {{ item.indexARR }} -->
              <div
                style="margin-bottom: 10px"
                v-for="(arrMoveItem, arrMoveIndex) in item.arrMove"
                :key="'indexB' + arrMoveIndex"
              >
                <a-input class="A" type="number" v-model="arrMoveItem.InputValueA" :value="0" :min="0" />-
                <a-input class="A" type="number" v-model="arrMoveItem.InputValueB" :value="0" :min="0" />
              </div>
            </div>
            <div v-if="index === item.indexARR && [5, 9, 13].includes(index)">
              大于<a-input
                class="A"
                type="number"
                v-model="item.MoveGreater"
                :min="0"
                @blur="inputMoveGreater(index, items.MoveGreater)"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="Score" slot-scope="text, item, index">
        <div v-for="(itemARR, indexARR) in listInput.formInputArrMove" :key="'indexARR' + indexARR">
          <div v-if="index === itemARR.indexARR">
            <div
              style="margin-bottom: 10px"
              v-for="(itemScoreArr, ScoreArrindex) in itemARR.ScoreArr"
              :key="'ScoreArrindex' + ScoreArrindex"
            >
              <a-input class="A" type="number" v-model="itemScoreArr.ScoreInputValue" :value="0" :min="0" />
            </div>
          </div>
        </div>
      </div>
      <div slot="operation" slot-scope="text, item, index">
        <div v-if="index === 4 || index === 7 || index === 8 || index === 11 || index === 12">
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
    scoreWeightMove: {
      type: Number,
      required: true
    },
    formlistMoveRulestValue: {
      type: Array,
      required: true
    }
  },
  watch: {
    formlistMoveRulestValue(n, old) {
      if (n) {
        this.listInput.formInputArrMove = n
      }
    },
    scoreWeightMove(n, l) {
      if (n) {
        this.form.name = n
      }
    }
  },
  data() {
    return {
      listInput: {
        winningBaseScore: 0,
        deliveryBaseScore: 0,
        destroyBaseScore: 0,
        formInputArrMove: [
          {
            key: '1',
            indexARR: 0,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '2',
            indexARR: 1,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '3',
            indexARR: 2,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '4',
            indexARR: 3,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '5',
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
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '6',
            indexARR: 5,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '7',
            indexARR: 6,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '8',
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
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '9',
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

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '10',
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

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '11',
            indexARR: 10,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '12',
            indexARR: 11,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '13',
            indexARR: 12,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '14',
            indexARR: 13,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
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
              children: '动态指标',
              attrs: {}
            }
            if (index === 0) {
              obj.attrs.rowSpan = this.listInput.formInputArrMove.length
            }
            if (index >= 1) {
              obj.attrs.rowSpan = 0
            }
            return obj
          }
        },
        {
          title: '评分项',
          align: 'center',
          customRender: (value, row, index) => {
            const obj = {
              children: '',
              attrs: {}
            }
            if (index === 0) {
              obj.children = '报价中标次数'
            }
            if (index === 1) {
              obj.children = '交货及时订单次数'
            }
            if (index === 2) {
              obj.children = '毁标次数'
            }
            if (index === 3) {
              obj.children = '罚款单位：次'
              obj.attrs.rowSpan = 3
            }
            if (index > 3 && index < 6) {
              obj.attrs.rowSpan = 0
            }
            if (index === 6) {
              obj.children = '罚款单位：元'
              obj.attrs.rowSpan = 4
            }
            if (index > 6 && index < 10) {
              obj.attrs.rowSpan = 0
            }
            if (index === 10) {
              obj.children = '冻结账号单位：天'
              obj.attrs.rowSpan = 4
            }
            if (index > 10) {
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
          // dataIndex: 'address1',
          scopedSlots: { customRender: 'Company' }
        },
        {
          title: '*分值',
          align: 'center',
          scopedSlots: { customRender: 'Score' }
        },
        {
          title: '操作',
          align: 'center',
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
    // 最小值
    inputMoveless(index, val) {
      const value = Number(val)
      // const maxValue = Number(max)

      if (value === '' || value === 0 || value < 0) {
        this.listInput.formInputArrMove[index].Moveless = 0
        this.$message.error('此为必填项不能为空并且不能为负数')
      }
      if (val.length > 10) {
        this.listInput.formInputArrMove[index].Moveless = 9999999999
        this.$message.error('输入的数字不能超过10位的数字')
      }
      this.listInput.formInputArrMove[index].Moveless = value
    },
    // 最大值
    inputMoveGreater(index, val) {
      console.log(index)
      console.log(val)
      const value = Number(val)
      // const maxValue = Number(max)

      if (value === '' || value === 0 || value < 0) {
        this.listInput.formInputArrMove[index].MoveGreater = 0
        this.$message.error('此为必填项不能为空并且不能为负数')
      }
      if (val.length > 10) {
        this.listInput.formInputArrMove[index].MoveGreater = 9999999999
        this.$message.error('输入的数字不能超过10位的数字')
      }
      this.listInput.formInputArrMove[index].MoveGreater = value
    },
    inputCC() {
      if (this.listInput.destroyBaseScore.length > 10) {
        this.listInput.destroyBaseScore = this.listInput.destroyBaseScore.slice(0, 10)
        // this.listInput.winningBaseScore = Number(val)
        this.$message.error('输入的数字不能超过10位的数字')
      }
    },
    inputBB() {
      if (this.listInput.deliveryBaseScore.length > 10) {
        this.listInput.deliveryBaseScore = this.listInput.deliveryBaseScore.slice(0, 10)
        // this.listInput.winningBaseScore = Number(val)
        this.$message.error('输入的数字不能超过10位的数字')
      }
    },
    inputAA() {
      if (this.listInput.winningBaseScore.length > 10) {
        this.listInput.winningBaseScore = this.listInput.winningBaseScore.slice(0, 10)
        // this.listInput.winningBaseScore = Number(val)
        this.$message.error('输入的数字不能超过10位的数字')
      }
    },
    addInput(index) {
      this.listInput.formInputArrMove.forEach((item) => {
        if (item.indexARR === index) {
          item.arrMove.push({ id: index, InputValueA: '', InputValueB: '' })
          item.ScoreArr.push({ id: index, ScoreInputValue: '' })
        }
      })
    },
    delInput(index) {
      this.listInput.formInputArrMove.forEach((item) => {
        if (item.indexARR === index) {
          if (item.arrMove.length < 2) {
            this.$message.error('最少有一组')
          } else {
            item.arrMove.splice(item.arrMove.length - 1, 1)
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
        winningBaseScore: 0,
        deliveryBaseScore: 0,
        destroyBaseScore: 0,
        formInputArrMove: [
          {
            key: '1',
            indexARR: 0,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '2',
            indexARR: 1,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '3',
            indexARR: 2,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '4',
            indexARR: 3,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '5',
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
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '6',
            indexARR: 5,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '7',
            indexARR: 6,
            Moveless: '',
            MoveGreater: '',
            arrMove: [],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '8',
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
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '9',
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

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '10',
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

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '11',
            indexARR: 10,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '12',
            indexARR: 11,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '13',
            indexARR: 12,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
              }
            ],
            Score: ''
          },
          {
            key: '14',
            indexARR: 13,
            Moveless: '',
            MoveGreater: '',
            arrMove: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],

            ScoreArr: [
              {
                id: '',
                ScoreInputValue: ''
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
/deep/ .A {
  display: inline-block;
  width: 120px;
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
</style>
