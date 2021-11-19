<template>
  <div>
    <h1>评分分值设置</h1>
    <a-form-model ref="ruleFormzi" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item ref="name" label="静态分值总权重：" prop="name">
        <a-input :min="0" :max="100" type="number" style="width: 50%" v-model="form.name" @change="inputValuezi" />
        %
      </a-form-model-item>
    </a-form-model>
    <a-table :columns="columns" :data-source="listInput.formInputArrQuiet" bordered :pagination="false">
      <div slot="Company" slot-scope="text, item, index">
        <div v-if="index % 3 === 0 && index < 21">
          <div>
            小于
            <a-input
              class="A disabled"
              :min="0"
              type="number"
              v-model="item.Moveless"
              @blur="inputMoveless(index, listInput.formInputArrQuiet[index + 2].MoveGreater, item.Moveless)"
            ></a-input>
          </div>
        </div>
        <div
          v-if="
            index === 1 || index === 4 || index === 7 || index === 10 || index === 13 || index === 16 || index === 19
          "
        >
          <div v-for="(arrQuietItem, arrQuietIndex) in item.arrQuiet" :key="'arrQuietIndex' + arrQuietIndex">
            <a-input
              class="A"
              @blur="
                inputValueMin(
                  index,
                  arrQuietItem.InputValueA,
                  listInput.formInputArrQuiet[index - 1].Moveless,
                  arrQuietIndex,
                  listInput.formInputArrQuiet[index + 1].MoveGreater
                )
              "
              :min="listInput.formInputArrQuiet[index - 1].Moveless"
              :max="listInput.formInputArrQuiet[index + 1].MoveGreater"
              type="number"
              v-model="arrQuietItem.InputValueA"
            ></a-input
            >-
            <a-input
              class="A"
              @blur="
                inputValueMax(
                  index,
                  arrQuietItem.InputValueB,
                  listInput.formInputArrQuiet[index - 1].Moveless,
                  arrQuietIndex,
                  listInput.formInputArrQuiet[index + 1].MoveGreater
                )
              "
              :min="listInput.formInputArrQuiet[index - 1].Moveless"
              :max="listInput.formInputArrQuiet[index + 1].MoveGreater"
              type="number"
              v-model="arrQuietItem.InputValueB"
            ></a-input>
          </div>
        </div>
        <div
          v-if="
            index === 2 || index === 5 || index === 8 || index === 11 || index === 14 || index === 17 || index === 20
          "
        >
          <div>
            大于
            <a-input
              class="A"
              :min="0"
              type="number"
              v-model="item.MoveGreater"
              @blur="inputMoveGreater(index, listInput.formInputArrQuiet[index - 2].Moveless, item.MoveGreater)"
            ></a-input>
          </div>
        </div>
        <div v-if="index === 21">生产型</div>
        <div v-if="index === 22">贸易型</div>
        <div v-if="index === 23">自有</div>
        <div v-if="index === 24">租赁</div>
      </div>
      <div slot="Score" slot-scope="text, item, index">
        <div v-if="index < 25">
          <div v-for="(ScoreArrItem, ScoreArrIndex) in item.ScoreArr" :key="ScoreArrIndex">
            <a-input
              class="A"
              :min="0"
              type="number"
              @change="ScoreInput(index, ScoreArrIndex, ScoreArrItem.ScoreInputValue)"
              v-model="ScoreArrItem.ScoreInputValue"
            ></a-input>
          </div>
        </div>
        <div v-if="index === 25">蚁盾风控分值 * 10</div>
        <div v-if="index === 26">供应商管理验厂分数 * 10</div>
      </div>
      <div slot="operation" slot-scope="text, item, index">
        <div v-if="index % 3 === 1 && index < 22">
          <a-button @click="addInput(index)" style="width: 10px">+</a-button>
          <a-button @click="delInput(index)" style="width: 10px; margin-left: 10px">-</a-button>
        </div>
      </div>
    </a-table>
  </div>
</template>

<script>
// import { Input } from 'ant-design-vue'
// import { getQueryPurchaseGrade, postEditGrade } from '@/api/SupplierSettings.js'
export default {
  name: 'SupplierScoringScheme',
  components: {},
  props: {
    scoreWeightQuiet: {
      type: Number,
      required: true
    },
    formlistQuieRulestValue: {
      type: Array,
      required: true
    }
  },
  watch: {
    formlistQuieRulestValue(n, old) {
      if (n) {
        this.listInput.formInputArrQuiet = n
      }
    },
    scoreWeightQuiet(n, l) {
      if (n) {
        this.form.name = n
      }
    }
  },

  data() {
    return {
      listInput: {
        formInputArrQuiet: [
          {
            registerMoney: '',
            key: '1',
            Moveless: 0,
            MoveGreater: '',
            indexARR: 0,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            registerMoney: '',
            key: '2',
            Moveless: '',
            MoveGreater: '',
            indexARR: 1,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            registerMoney: '',
            key: '3',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 2,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            employeesNumber: '',
            key: '4',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 3,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            employeesNumber: '',
            key: '5',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 4,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            employeesNumber: '',
            key: '6',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 5,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            mainIncome: '',
            key: '7',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 6,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            mainIncome: '',
            key: '8',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 7,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            mainIncome: '',
            key: '9',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 8,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalAssets: '',
            key: '10',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 9,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalAssets: '',
            key: '11',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 10,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalAssets: '',
            key: '12',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 11,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalProfit: '',
            key: '13',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 12,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalProfit: '',
            key: '14',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 13,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalProfit: '',
            key: '15',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 14,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalLoad: '',
            key: '16',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 15,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalLoad: '',
            key: '17',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 16,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalLoad: '',
            key: '18',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 17,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            regToYear: '',
            key: '19',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 18,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            regToYear: '',
            key: '20',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 19,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            regToYear: '',
            key: '21',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 20,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            nature: '1',
            key: '22',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 21,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            nature: '2',
            key: '23',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 22,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            plant: '1',
            key: '24',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 23,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            plant: '0',
            key: '25',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 24,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            dingDangScore: null,
            key: '26',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 25,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            SGSFactory: null,
            key: '27',
            Moveless: '',
            MoveGreater: '',
            indexARR: 26,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
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
          dataIndex: 'name',
          align: 'center',
          width: 100,
          customRender: (value, row, index) => {
            const obj = {
              children: '静态指标',
              attrs: {}
            }
            if (index === 0) {
              obj.attrs.rowSpan = this.listInput.formInputArrQuiet.length - 2
              obj.children = '静态指标'
            }
            if (index > 0 && index < this.listInput.formInputArrQuiet.length - 2) {
              obj.attrs.rowSpan = 0
            }
            if (index === this.listInput.formInputArrQuiet.length - 2) {
              obj.children = '平台得分'
              obj.attrs.rowSpan = 2
            }
            if (index > 25) {
              obj.attrs.rowSpan = 0
            }
            // console.log(obj, 'obj')
            return obj
          }
        },
        {
          title: ' 分类子权重(%)',
          align: 'center',
          // dataIndex: 'age',
          // scopedSlots: { customRender: 'tableInput' }
          customRender: (value, row, index) => {
            const change = (e) => {
              // row.moleculeValue = e.target.value
              if (e.target.value > 100) {
                row.moleculeValue = 100
                this.$message.info('输入百分比值 不能大于100')
              } else if (e.target.value < 0) {
                row.moleculeValue = 0
                this.$message.info('输入百分比值 不能小于0')
              } else {
                row.moleculeValue = e.target.value
              }
            }

            const obj = {
              children: '',
              attrs: {}
            }
            if (index === 0) {
              obj.children = (
                <a-input
                  class="A"
                  type="number"
                  min="0"
                  max="100"
                  value={row.moleculeValue}
                  onChange={change}
                ></a-input>
              )
              obj.attrs.rowSpan = 25
            }
            if (index > 0 && index < 25) {
              obj.attrs.rowSpan = 0
            }
            if (index >= 25) {
              obj.children = (
                <a-input
                  class="A"
                  type="number"
                  min="0"
                  max="100"
                  value={row.moleculeValue}
                  onChange={change}
                ></a-input>
              )
            }

            return obj
          }
        },
        {
          title: '评分项',
          align: 'center',
          // dataIndex: 'address'
          customRender: (value, row, index) => {
            const obj = {
              children: '',
              attrs: {}
            }
            if (index === 0) {
              obj.attrs.rowSpan = 3
              obj.children = '注册资金 单位：万元'
            }
            if (index > 0 && index < 3) {
              obj.attrs.rowSpan = 0
            }
            if (index === 3) {
              obj.attrs.rowSpan = 3
              obj.children = '员工人数 单位：人'
            }
            if (index > 3 && index < 6) {
              obj.attrs.rowSpan = 0
            }
            if (index === 6) {
              obj.attrs.rowSpan = 3
              obj.children = '营业收入 单位：万元'
            }
            if (index > 6 && index < 9) {
              obj.attrs.rowSpan = 0
            }
            if (index === 9) {
              obj.attrs.rowSpan = 3
              obj.children = '资产总额 单位：万元'
            }
            if (index > 9 && index < 12) {
              obj.attrs.rowSpan = 0
            }
            if (index === 12) {
              obj.attrs.rowSpan = 3
              obj.children = '利润总额 单位：万元'
            }
            if (index > 12 && index < 15) {
              obj.attrs.rowSpan = 0
            }
            if (index === 15) {
              obj.attrs.rowSpan = 3
              obj.children = '负债总额 单位：万元'
            }
            if (index > 15 && index < 18) {
              obj.attrs.rowSpan = 0
            }
            if (index === 18) {
              obj.attrs.rowSpan = 3
              obj.children = '注册年限 单位：年'
            }
            if (index > 18 && index < 21) {
              obj.attrs.rowSpan = 0
            }
            if (index === 21) {
              obj.attrs.rowSpan = 2
              obj.children = '公司性质'
            }
            if (index === 22) {
              obj.attrs.rowSpan = 0
            }
            if (index === 23) {
              obj.attrs.rowSpan = 2
              obj.children = '办公/厂房性质'
            }
            if (index === 24) {
              obj.attrs.rowSpan = 0
            }
            if (index === 25) {
              obj.children = '叮当风控分值'
            }
            if (index === 26) {
              obj.children = 'SGS验厂'
            }

            return obj
          }
        },
        {
          title: '* 区间/单位',
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
          // width: 100,
          scopedSlots: { customRender: 'operation' }
        }
      ],

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      rules: {
        name: [{ required: true, message: '静态分值总权重', trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    show(e) {
      if (e.keyCode === 187 || e.keyCode === 189) {
        return false
      }
    },
    ScoreInput(index, ScoreArrIndex, ScoreValue) {
      // const InitValue = Number(ScoreValue)
      // if (InitValue < 0) {
      //   this.listInput.formInputArrQuiet[index].ScoreArr[ScoreArrIndex].ScoreInputValue =
      //     this.listInput.formInputArrQuiet[index].ScoreArr[ScoreArrIndex].ScoreInputValue.replace(/-/g, 0)

      //   this.$message.info('不可输入负数')
      // }
      if (ScoreValue.length > 10) {
        this.listInput.formInputArrQuiet[index].ScoreArr[ScoreArrIndex].ScoreInputValue = ScoreValue.slice(0, 10)
        return this.$message.info('输入的数字不能超过10位的数字')
      }
      if (ScoreValue === '' || ScoreValue === 0) {
        this.listInput.formInputArrQuiet[index].ScoreArr[ScoreArrIndex].ScoreInputValue = 0
        return this.$message.error('此为必填项不能为空并且不能为负数')
      }
    },
    // negative() {
    //   document.onkeydown = function () {
    //     if (window.event.keyCode === 189) {
    //       return false
    //     }
    //     if (window.event.keyCode === 187) {
    //       return false
    //     }
    //   }
    // },
    inputMoveless(index, max, val) {
      const value = Number(val)
      const maxValue = Number(max)
      if (value === '' || value < 0 || value === 0) {
        this.listInput.formInputArrQuiet[index].Moveless = 0
        return this.$message.error('此为必填项不能为空并且不能为负数')
      }
      if (val.length > 10) {
        this.listInput.formInputArrQuiet[index].Moveless = 9999999999
        return this.$message.error('输入的数字不能超过10位的数字')
      }
      if (value > maxValue && maxValue > 0) {
        this.listInput.formInputArrQuiet[index].Moveless = 0
        // this.listInput.formInputArrQuiet[index + 2].MoveGreater = this.listInput.formInputArrQuiet[index].Moveless
        return this.$message.error('不能大于设置' + maxValue + '的最大值')
      }
      let num = 0
      this.listInput.formInputArrQuiet[index + 1].arrQuiet.map((item) => {
        if (!num) {
          num = item.InputValueA
        } else {
          if (item.InputValueA < num) {
            num = item.InputValueA
          }
        }
      })
      if (value > num && num > 0) {
        // this.listInput.formInputArrQuiet[index + 1].arrQuiet = this.listInput.formInputArrQuiet[index + 1].arrQuiet.map(
        //   (item) => {
        //     item = {
        //       InputValueA: value,
        //       InputValueB: value
        //     }
        //     return item
        //   }
        // )
        this.listInput.formInputArrQuiet[index].Moveless = 0
        this.$message.error('最小值不能大于已填写区间的最小值')
      }
      // if (value === ) {
      //   console.log('!!!!!!!!!!!!!!')----

      //   this.$message.info('不能设置小于0和输入负数')
    },
    inputMoveGreater(index, min, val) {
      const value = Number(val)
      const minValue = Number(min)

      if (value === '' || value < 0 || value === 0) {
        this.listInput.formInputArrQuiet[index].MoveGreater = 0
        return this.$message.error('此为必填项不能为空并且不能为负数')
      }
      if (val.length > 10) {
        this.listInput.formInputArrQuiet[index].MoveGreater = 9999999999
        return this.$message.error('输入的数字不能超过10位的数字')
      }
      if (value < minValue) {
        this.listInput.formInputArrQuiet[index].MoveGreater = 0
        // this.listInput.formInputArrQuiet[index - 2].Moveless = value
        return this.$message.error('最大值不能小于最小值')
      }
      let num = 0
      this.listInput.formInputArrQuiet[index - 1].arrQuiet.map((item) => {
        if (item.InputValueB > num) {
          num = item.InputValueB
        }
      })
      if (value < num) {
        // this.listInput.formInputArrQuiet[index - 1].arrQuiet = this.listInput.formInputArrQuiet[index - 1].arrQuiet.map(
        //   (item) => {
        //     item = {
        //       InputValueA: item.InputValueA,
        //       InputValueB: item.InputValueA
        //     }
        //     return item
        //   }
        // )
        this.listInput.formInputArrQuiet[index].MoveGreater = num
        return this.$message.error('最大值不能小于已填写区间内的最大值')
      }
    },
    inputValueMin(index, value, min, arrQuietIndex, max) {
      const initValue = Number(value)
      const initMin = Number(min)
      const initMax = Number(max)

      if (value === '' || value < 0 || value === 0) {
        this.listInput.formInputArrQuiet[index].arrQuiet[arrQuietIndex].InputValueA = 0
        return this.$message.error('此为必填项不能为空并且不能为负数')
      }

      if (initValue < initMin) {
        this.listInput.formInputArrQuiet[index].arrQuiet[arrQuietIndex].InputValueA = initMin
        // this.listInput.formInputArrQuiet[index - 1].Moveless = initValue
        if (!initMin) {
          return this.$message.info('请先设置最小值')
        }
        return this.$message.error('不能小于最小值')
      }
      if (initValue > initMax) {
        this.listInput.formInputArrQuiet[index].arrQuiet[arrQuietIndex].InputValueA = initMax
        if (!initMax) return this.$message.info('请先设置最大值')
        return this.$message.error('不能大于设置的最大值')
        // this.listInput.formInputArrQuiet[index + 1].MoveGreater = initValue
        // return this.$message.info('大于设置的最大值，已重置最大值')
      }
    },
    inputValueMax(index, value, min, arrQuietIndex, max) {
      const initValue = Number(value)
      const initMin = Number(min)
      const initMax = Number(max)
      if (value === '' || value < 0 || value === 0) {
        this.listInput.formInputArrQuiet[index].arrQuiet[arrQuietIndex].InputValueB = 0
        return this.$message.error('此为必填项不能为空并且不能为负数')
      }
      if (initValue < initMin) {
        this.listInput.formInputArrQuiet[index].arrQuiet[arrQuietIndex].InputValueB = initMin
        return this.$message.error('不能小于设置的最小值')
        // this.listInput.formInputArrQuiet[index - 1].Moveless = initValue
        // return this.$message.info('小于设置的最小值，已重置最小值')
      }
      if (initValue > initMax) {
        this.listInput.formInputArrQuiet[index].arrQuiet[arrQuietIndex].InputValueB = initMax
        if (!initMax) return this.$message.info('请先设置最大值')
        return this.$message.error('不能大于设置的最大值')
        // this.listInput.formInputArrQuiet[index + 1].MoveGreater = initValue
        // return this.$message.info('大于设置的最大值，已重置最大值')
      }
    },

    inputValuezi(e) {
      if (e.target.valueAsNumber > 100) {
        this.form.name = 100
        this.$message.info('当前设置项不能大于100')
      }
      if (e.target.valueAsNumber < (0 || '0')) {
        this.form.name = 0
        this.$message.info('当前设置项不能小于0')
      }
      this.$emit('inputValuezi', this.form.name, this.listInput)
    },
    addInput(index) {
      this.listInput.formInputArrQuiet.forEach((item) => {
        if (item.indexARR === index) {
          item.arrQuiet.push({ id: index, InputValueA: 0, InputValueB: 0 })
          item.ScoreArr.push({ id: index, ScoreInputValue: 0 })
        }
      })
    },
    delInput(index) {
      this.listInput.formInputArrQuiet.forEach((item) => {
        if (item.indexARR === index) {
          if (item.arrQuiet.length < 2) {
            this.$message.error('最少有一组')
          } else {
            item.arrQuiet.splice(item.arrQuiet.length - 1, 1)
            item.ScoreArr.splice(item.ScoreArr.length - 1, 1)
          }
        }
      })
    },

    resetForm() {
      this.$refs.ruleFormzi.resetFields()
    },
    resetData() {
      this.resetForm()
      this.listInput = {
        formInputArrQuiet: [
          {
            registerMoney: '',
            key: '1',
            Moveless: 0,
            MoveGreater: '',
            indexARR: 0,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            registerMoney: '',
            key: '2',
            Moveless: '',
            MoveGreater: '',
            indexARR: 1,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            registerMoney: '',
            key: '3',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 2,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            employeesNumber: '',
            key: '4',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 3,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            employeesNumber: '',
            key: '5',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 4,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            employeesNumber: '',
            key: '6',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 5,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            mainIncome: '',
            key: '7',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 6,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            mainIncome: '',
            key: '8',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 7,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            mainIncome: '',
            key: '9',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 8,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalAssets: '',
            key: '10',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 9,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalAssets: '',
            key: '11',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 10,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalAssets: '',
            key: '12',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 11,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalProfit: '',
            key: '13',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 12,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalProfit: '',
            key: '14',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 13,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalProfit: '',
            key: '15',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 14,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalLoad: '',
            key: '16',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 15,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalLoad: '',
            key: '17',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 16,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            totalLoad: '',
            key: '18',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 17,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            regToYear: '',
            key: '19',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 18,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            regToYear: '',
            key: '20',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 19,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            regToYear: '',
            key: '21',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 20,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            nature: '1',
            key: '22',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 21,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            nature: '2',
            key: '23',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 22,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            plant: '1',
            key: '24',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 23,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            plant: '0',
            key: '25',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 24,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            dingDangScore: null,
            key: '26',
            Moveless: 0,
            MoveGreater: 0,
            indexARR: 25,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: 0,
                InputValueB: 0
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          },
          {
            SGSFactory: null,
            key: '27',
            Moveless: '',
            MoveGreater: '',
            indexARR: 26,
            moleculeValue: 0,
            arrQuiet: [
              {
                id: 1,
                InputValueA: '',
                InputValueB: ''
              }
            ],
            ScoreArr: [
              {
                id: '',
                ScoreInputValue: 0
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ime-disabled {
  ime-mode: disabled;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield;
}
/deep/ input[type='number']::-webkit-inner-spin-button,
/deep/ input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield;
}
/deep/ .ant-btn {
  width: 30px !important;
  min-width: 30px;
  padding: 5px;
  text-align: center;
}
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
