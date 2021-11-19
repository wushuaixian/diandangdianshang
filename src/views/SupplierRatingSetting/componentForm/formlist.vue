<template>
  <div>
    <a-card>
      <h1>基本信息</h1>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="供应商等级占比方案名称：" prop="name">
          <a-input
            class="A"
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="code" label=" 供应商等级占比方案编码：" prop="code">
          <a-input
            class="A"
            disabled="disabled"
            v-model="form.code"
            @blur="
              () => {
                $refs.code.onFieldBlur()
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item label="状态" prop="delivery">
          <a-switch v-model="form.delivery" />
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card>
      <h1>设置占比及分值</h1>
      <a-table
        style="margin: 20px 0"
        :rowKey="
          (record, index) => {
            return index
          }
        "
        :columns="columns"
        :pagination="false"
        :data-source="data"
        size="small"
      >
        <div slot="tableInput" slot-scope="text, record, index">
          <div v-if="index !== data.length - 1 && index !== 0">
            <span>排名不低于前</span>
            <a-input
              v-model="record.proportion"
              style="width: 200px; display: inline-block; margin-left: 10px"
              :min="0"
              type="number"
              @change="inputValueMin(index, record.proportion)"
            />
          </div>
          <div v-else-if="index === 0">人工调级，无需设置</div>
          <div v-else>新注册(未验厂、未评分之前)、或不满足其他档次条件时，自动计入E级，无需设置</div>
        </div>
        <div slot="Score" slot-scope="text, record, index" style="padding 0 20px">
          <div v-if="index !== data.length - 1 && index !== 0">
            <span>评分不低于</span>
            <a-input
              v-model="record.score"
              style="width: 200px; display: inline-block; margin: 0 10px"
              :min="0"
              :max="9999999999"
              type="number"
              @change="inputValueMax(index, record.score)"
            />分
          </div>
          <div v-else-if="index === 0">人工调级，无需设置</div>
          <div v-else>新注册(未验厂、未评分之前)、或不满足其他档次条件时，自动计入E级，无需设置</div>
        </div>
      </a-table>

      <a-button type="primary" @click="onSubmit"> 保存 </a-button>
      <a-button style="margin-left: 10px" @click="$router.back()">返回</a-button>
      <a-button style="margin-left: 10px" @click="resetForm"> 重置 </a-button>
    </a-card>
  </div>
</template>

<script>
import {
  getQueryPurchaseGrade,
  postAddOrUpdateGradeProportionPlan,
  postScorePlanDetail,
  postContractCode,
  copy
} from '@/api/SupplierSettings.js'

export default {
  name: 'SupplierScoringScheme',
  components: {},
  data() {
    return {
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: '等级名称',
          dataIndex: 'gradeName',
          align: 'center',
          width: 100
        },
        {
          title: '供应商评分排名占比（%）',
          align: 'center',
          // dataIndex: 'age',
          scopedSlots: { customRender: 'tableInput' }
        },
        {
          title: '分值限定',
          align: 'center',
          // dataIndex: 'address',
          scopedSlots: { customRender: 'Score' }
        }
      ],
      data: [
        {
          key: '1',
          gradeName: '1',
          // age: 32,
          planId: '1',
          gradeConfigId: '2',
          proportion: null,
          score: null
        },
        {
          key: '2',
          gradeName: '2',
          // age: 42,
          planId: '1',
          gradeConfigId: '2',
          proportion: '0',
          score: '0'
        },
        {
          key: '3',
          gradeName: '3',
          // age: 32,
          planId: '1',
          gradeConfigId: '2',
          proportion: '0',
          score: '0'
        },
        {
          key: '4',
          gradeName: '4',
          // age: 32,
          planId: '1',
          gradeConfigId: '2',
          proportion: '0',
          score: '0'
        },
        {
          key: '5',
          gradeName: '5',
          // age: 32,
          planId: '1',
          gradeConfigId: '2',
          proportion: '0',
          score: '0'
        },
        {
          key: '6',
          gradeName: '6',
          // age: 32,
          planId: '1',
          gradeConfigId: '2',
          proportion: null,
          score: null
        }
      ],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        name: '',
        code: '',
        region: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '供应商等级占比方案名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '请输入2-20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    document.onkeydown = function () {
      if (window.event.keyCode === 189) {
        return false
      }
      if (window.event.keyCode === 187) {
        return false
      }
    }

    const params = this.$route.params
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
      this.tabledata()
      this.code()
    }
  },
  methods: {
    // onFieldBlur(e) {
    //   if (e.target.value.length > 20) {
    //     e.target.value = e.target.value.slice(0, 20)
    //     this.$message.error('名称输入不能大于20')
    //   }
    // },
    inputValueMin(index, value) {
      const InputValue = Number(value)
      if (InputValue < 0) {
        this.data[index].proportion = 0
        this.$message.error('输入的值不能小于0 且不能为负数')
      }
      if (value.length > 10) {
        this.data[index].proportion = value.slice(0, 10)
        this.$message.info('输入的数字不能超过10位的数字')
      }
    },
    inputValueMax(index, value) {
      const InputValue = Number(value)
      if (InputValue < 0) {
        this.data[index].score = 0
        this.$message.error('输入的值不能小于0 切不能为负数')
      }
      if (value.length > 10) {
        this.data[index].score = value.slice(0, 10)
        this.$message.info('输入的数字不能超过10位的数字')
      }
    },
    code() {
      postContractCode().then((res) => {
        const { data } = res
        this.form.code = data
      })
    },
    async EdittableData(id) {
      await this.tabledata()
      const { data } = await postScorePlanDetail(id)
      this.form.name = data.name
      this.form.code = data.code
      if (data.isAvailable === '0' || data.isAvailable === 0) {
        this.form.delivery = false
      } else {
        this.form.delivery = true
      }
      const { gradeProportionVOS } = data
      this.data = this.data.map((x) => {
        const info = gradeProportionVOS.find((c) => c.gradeConfigId === x.gradeConfigId)
        return {
          ...x,
          ...info
        }
      })
    },
    async tabledata() {
      const { data } = await getQueryPurchaseGrade()

      for (let i = 0; i < this.data.length; i++) {
        for (let D = 0; D < data.listObj.length; D++) {
          if (i === D) {
            this.data[i].gradeName = data.listObj[D].name
            this.data[i].gradeConfigId = data.listObj[D].id
          }
        }
      }
    },

    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let validProportion = true
          let validscore = true
          this.data.forEach((item, index) => {
            if (index !== 0 && index !== this.data.length - 1) {
              if (item.proportion <= 0) {
                return (validProportion = false)
              } else if (item.score <= 0) {
                return (validscore = false)
              } else {
                validProportion = true
                validscore = true
              }
            }
          })
          if (validProportion === false) {
            this.$message.error('供应商评分排名占比的输入框为必填项目请检查后再点击保存')
          } else if (validscore === false) {
            this.$message.error('分值限定的输入框为必填项目请检查后再点击保存')
          } else {
            const {
              $route: {
                params: { id }
              },
              data
            } = this
            const proportionDTOS = data.filter((x) => x.score)
            const params = {
              name: this.form.name,
              code: this.form.code,
              id: Number(id) || null,
              isAvailable: '',
              proportionDTOS
            }
            if (this.form.delivery) {
              params.isAvailable = '1'
            } else {
              params.isAvailable = '0'
            }

            if (Number(this.$route.params.nub) === 0) {
              const { code } = await postAddOrUpdateGradeProportionPlan(params)

              if (code === '0') {
                this.$message.success('保存成功')
                setTimeout(() => {
                  this.$router.go(-1)
                }, 1000)
              } else {
                // this.$message.error('保存失败有重复的值')
              }
            } else {
              params.id = ''
              const { code } = await copy(params)
              if (code === '0') {
                this.$message.success('保存成功')
                setTimeout(() => {
                  this.$router.go(-1)
                }, 1000)
              }
            }
          }
        }
      })
    },
    resetForm() {
      this.form.name = ''
      this.form.delivery = false
      this.data.forEach((item, index) => {
        if (index !== 0 || index !== this.data.length - 1) {
          item.score = 0
          item.proportion = 0
        }
      })
      this.$message.info('已重置')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .A {
  width: 60%;
}
</style>
