<template>
  <div>
    <a-card>
      <h1>基本信息</h1>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="供应商评分方案名称:" prop="name">
          <a-input class="C" style="margin-left: 10px" v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item ref="code" label=" 供应商评分方案编码：" prop="code">
          <a-input class="C" disabled="disabled" style="margin-left: 10px" v-model="form.code" />
        </a-form-model-item>
        <a-form-model-item label="方案类型" prop="region">
          <a-select
            :disabled="formdisabled"
            style="margin-left: 10px"
            class="C"
            v-model="form.region"
            @change="selectChange"
          >
            <a-select-option value="1"> 静态评分 </a-select-option>
            <a-select-option value="2"> 动态评分 </a-select-option>
            <a-select-option value="3"> 店铺评分 </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="状态" prop="delivery">
          <a-switch v-model="form.delivery" />
        </a-form-model-item>
      </a-form-model>
    </a-card>

    <a-card>
      <formlistQuiet
        ref="formlistQuieRulest"
        v-show="Quiet"
        @inputValuezi="formNameValue"
        :scoreWeightQuiet="scoreWeightQuiet"
        :formlistQuieRulestValue="faterDATAQuiet"
      ></formlistQuiet>
      <formlistMove
        :scoreWeightMove="scoreWeightMove"
        :formlistMoveRulestValue="faterDATAMove"
        ref="formlistMoveRulest"
        v-show="Move"
      ></formlistMove>
      <formlistShop
        :scoreWeightShop="scoreWeightShop"
        :formlistShopRulestValue="faterDATAShop"
        ref="formlistShopRulest"
        v-show="Shop"
      ></formlistShop>
      <div style="margin-top: 20px">
        <a-button type="primary" @click="onSubmit"> 保存 </a-button>
        <a-button style="margin-left: 10px" @click="$router.back()">返回</a-button>
        <a-button style="margin-left: 10px" @click="resetForm"> 重置 </a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { postContractCode, addOrUpdatePlanInfo, getScorePlanDetail, purchaseScoreCopy } from '@/api/SupplierSettings.js'
// import { Input } from 'ant-design-vue'
import formlistQuiet from '@/views/SupplierRatingSetting/componentForm/formlist/formlistQuiet.vue'
import formlistMove from '@/views/SupplierRatingSetting/componentForm/formlist/formlistMove.vue'
import formlistShop from '@/views/SupplierRatingSetting/componentForm/formlist/formlistShop.vue'
export default {
  name: 'SupplierScoringScheme',
  components: {
    formlistQuiet,
    formlistMove,
    formlistShop
  },
  data() {
    return {
      scoreWeightQuiet: 0,
      scoreWeightShop: 0,
      scoreWeightMove: 0,
      flag: false,
      faterDATAMove: [],
      faterDATAShop: [],
      faterDATAQuiet: [],
      formdisabled: false,
      Quiet: true,
      Move: false,
      Shop: false,
      form: {
        name: '',
        code: '',
        region: '1',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      rules: {
        name: [
          { required: true, message: '供应商评分方案名称', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入2-30个字符', trigger: 'blur' }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change'
          }
        ],
        resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
      }
    }
  },
  created() {
    // this.form.delivery = this.$route.query.delivery

    if (this.$route.query.formSelect === 0) {
      this.formdisabled = false
    } else {
      this.formdisabled = true
    }
  },
  mounted() {
    const params = this.$route.query
    const data = {
      id: params.id
    }
    const val = params.nub
    if (Number(params.value)) {
      if (val === '1') {
        this.EdittableData(data)
        this.code()
      } else {
        this.EdittableData(data)
      }
    } else {
      // this.tabledata()
      this.code()
    }
    // this.$refs.myinput.addEventListener('input', function (event) {
    //   event.target.value = event.target.value.replace(/\-/g, '')
    // })
    // this.$refs.myinput
  },
  methods: {
    formNameValue(val, listData) {
      console.log(val, 'val', listData)
    },
    EdittableData(data) {
      getScorePlanDetail(data).then((res) => {
        const { data } = res
        this.form.name = data.scoreName
        this.form.code = data.scoreCode
        this.flag = true

        if (data.scoreType === 1) {
          this.form.region = '1'
          this.scoreWeightQuiet = data.scoreWeight
          // console.log(JSON.parse(data.scoreRule), 'JSON.parse(data.scoreRule)')
          // this.$set(this.$refs.formlistQuieRulest.listInput, 'formInputArrQuie', JSON.parse(data.scoreRule))
          // this.$refs.formlistQuieRulest.listInput.formInputArrQuie = JSON.parse(data.scoreRule)
          this.faterDATAQuiet = JSON.parse(data.scoreRule)
        } else if (data.scoreType === 2) {
          this.scoreWeightMove = data.scoreWeight
          this.form.region = '2'
          this.faterDATAMove = JSON.parse(data.scoreRule)
        } else {
          this.scoreWeightShop = data.scoreWeight
          this.form.region = '3'
          this.faterDATAShop = JSON.parse(data.scoreRule)
        }

        if (data.isAvailable === '1') {
          this.form.delivery = true
        } else {
          this.form.delivery = false
        }
      })
    },
    code() {
      postContractCode().then((res) => {
        const { data } = res
        this.form.code = data
      })
    },
    selectChange(val) {
      if (val === '1') {
        this.Quiet = true
        this.Move = false
        this.Shop = false
      } else if (val === '2') {
        this.Quiet = false
        this.Move = true
        this.Shop = false
      } else {
        this.Quiet = false
        this.Move = false
        this.Shop = true
      }
    },
    addInput(index) {
      this.formInputArr.forEach((item) => {
        if (item.indexARR === index) {
          item.arr.push({ InputValue: '' })
        }
      })
    },
    delInput(index) {
      this.formInputArr.forEach((item) => {
        if (item.indexARR === index) {
          if (item.arr.length <= 1) {
            this.$message.error('最少有一组')
          } else {
            item.arr.splice(item.arr.lenght - 1, 1)
          }
        }
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          ;(this.Quiet
            ? this.$refs.formlistQuieRulest.$refs.ruleFormzi
            : this.Move
            ? this.$refs.formlistMoveRulest.$refs.ruleForm
            : this.$refs.formlistShopRulest.$refs.ruleForm
          ).validate(async (validzi) => {
            if (validzi) {
              const params = {
                scoreName: this.form.name,
                scoreCode: this.form.code,
                scoreType: 1,
                id: this.$route.query.id,
                scoreWeight: '50',
                isAvailable: '1',
                scoreRule: ''
              }
              if (this.Quiet) {
                params.scoreType = 1
                params.scoreWeight = this.$refs.formlistQuieRulest.form.name
                console.log(this.$refs.formlistQuieRulest.listInput.formInputArrQuiet)
                const num =
                  Number(this.$refs.formlistQuieRulest.listInput.formInputArrQuiet[0].moleculeValue) +
                  Number(this.$refs.formlistQuieRulest.listInput.formInputArrQuiet[25].moleculeValue) +
                  Number(this.$refs.formlistQuieRulest.listInput.formInputArrQuiet[26].moleculeValue)
                console.log(num)
                if (num > 100) {
                  this.$message.info('分类子权重百分比和不能大于100%')
                  return
                }
                params.scoreRule = JSON.stringify(this.$refs.formlistQuieRulest.listInput.formInputArrQuiet)
              } else if (this.Move) {
                params.scoreType = 2
                params.scoreWeight = this.$refs.formlistMoveRulest.form.name
                params.scoreRule = JSON.stringify(this.$refs.formlistMoveRulest.listInput.formInputArrMove)
              } else {
                params.scoreType = 3
                params.scoreWeight = this.$refs.formlistShopRulest.form.name
                params.scoreRule = JSON.stringify(this.$refs.formlistShopRulest.listInput.formInputArrShop)
                // if (
                //   this.$refs.formlistShopRulest?.listInput?.formInputArrShop.some((item, index) => {
                //     return index < 3 && !item.ScoreInput
                //   }) ||
                //   this.$refs.formlistShopRulest?.listInput?.formInputArrShop.some((item, index) => {
                //     return item.ScoreArr.some((i) => {
                //       return !i.ScoreInputValue && i.key !== '10'
                //     })
                //   })
                // ) {
                //   this.$message.error('没有完成必填项目')
                //   return
                // }
              }
              if (this.$route.query.value === 0) {
                delete params.id
              }

              // if (this.$route.query.nub === 0) {
              //   await addOrUpdatePlanInfo(params).then((res) => {
              //     console.log(res, 'res')
              //     this.$message.success('保存成功')
              //     this.$router.go(-1)
              //   })
              // }

              if (this.$route.query.nub === 1) {
                delete params.id
                await purchaseScoreCopy(params).then((res) => {
                  if (res.code === '-2') return this.$message.error(res.message)
                  this.$message.success('保存成功')
                  this.$router.go(-1)
                })
              } else {
                await addOrUpdatePlanInfo(params).then((res) => {
                  if (res.code === '-2') return this.$message.error(res.message)
                  this.$message.success('保存成功')
                  this.$router.go(-1)
                })
              }
            }
            // else {
            //   this.$message.error('没有完成必填项目')
            //   return false
            // }
          })
        }
        //  else {
        //   this.$message.error('没有完成必填项目')
        //   return false
        // }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$refs.formlistQuieRulest.resetData()
      this.$refs.formlistMoveRulest.resetData()
      this.$refs.formlistShopRulest.resetData()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .AhrB {
  margin-top: 0 !important;
}
/deep/ .Ahr {
  color: rgb(223, 223, 223);
  background: #ececec;
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
