<template>
  <div>
    <form v-if="isLoaded" @submit.prevent="handleSubmit">
      <!-- {{ formModel }} -->
      <div v-if="type === 'node'" class="node">
        <template v-if="formModel.shape === 'flow-rect'">
          <h3>审批节点配置</h3>
          <d-select
            :options="appdActorTypeOptions"
            v-model="formModel.ref.appdActorType"
            placeholder="请选择"
            @change="handleNodeOperateChange"
          >
          </d-select>
          <template v-if="formModel.ref.appdActorType === 1">
            <audit-add v-model="formModel.ref.actorList" @ok="handleSubmit" />
          </template>

          <template v-else-if="formModel.ref.appdActorType === 2">
            <div class="add-department-top">
              <a-radio-group v-model="formModel.ref.appdActorSubtype">
                <a-radio :value="1">
                  部门主管
                  <a-tooltip class="item" placement="top" title="部门主管为空时，上级部门主管审批">
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </a-radio>
                <!-- <br />
                <a-radio :value="2">
                  连续多级主管
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top"
                    content="商家（公司）主体下的组织体系内的连续多级主管审批"
                  >
                    <a-icon type="info-circle" />
                  </el-tooltip>
                </a-radio>
                <br />
                <a-radio :value="3">
                  指定部门
                  <a-tooltip class="item" effect="dark" placement="top" content="指定部门的主管审批">
                    <i class="el-icon-info" />
                  </a-tooltip>
                </a-radio> -->
                <!-- <br /> -->
              </a-radio-group>
            </div>
            <template v-if="formModel.ref.appdActorSubtype === 1">
              <organization-add v-model="formModel.ref.actorList" @ok="handleSubmit" />
            </template>
          </template>
          <template v-else-if="formModel.ref.appdActorType === 3">
            <position-add v-model="formModel.ref.actorList" @ok="handleSubmit" />
          </template>
          <h3>审批方式</h3>
          <div class="sign-wrap">
            <a-radio-group v-model="formModel.ref.appdType">
              <a-radio :value="1">或签（一名审批人同意即可）</a-radio> <br />
              <a-radio :value="2">会签（须所有审批人同意）</a-radio>
            </a-radio-group>
          </div>
        </template>
        <template v-else-if="formModel.shape === 'flow-rhombus'">
          <h3>条件配置</h3>
          <d-select v-model="formModel.label" :options="factorTypeOptions" placeholder="条件" @change="handleFactor">
            <!-- <a-select-option
              v-for="item in factorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            /> -->
          </d-select>
        </template>
      </div>
      <div v-else-if="type === 'edge'">
        <div v-if="showSelect" class="line-judge">
          <a-radio-group v-model="formModel.ref.radioVal" @change="handleEdgeChange">
            <a-radio :value="1">输入条件值</a-radio>
            <div>
              <d-select v-model="formModel.ref.id" @change="handleEdgeOperateChange">
                <a-select-option v-for="item in lineTypeOptions" :key="item.id" :value="item.id">
                  {{ item.label }}
                </a-select-option>
              </d-select>
              <a-input
                class="condition"
                v-if="formModel.ref.displayStyle === 'number'"
                v-model="formModel.ref.conditionList['0'].variableValue"
                @blur="handleEdgeChange"
              />
              <div v-else-if="formModel.ref.displayStyle === 'numberRange'" class="condition">
                <a-input
                  v-model="formModel.ref.conditionList['0'].variableValue"
                  placeholder=""
                  @blur="handleEdgeChange"
                >
                  <d-select
                    slot="addonAfter"
                    v-model="formModel.ref.conditionList['0'].operator"
                    :clearable="false"
                    style="width: 80px"
                    @change="handleEdgeChange"
                  >
                    <a-select-option value=">"> &lt; </a-select-option>
                    <a-select-option value=">="> &lt;= </a-select-option>
                  </d-select>
                </a-input>
                <div class="center">~</div>
                <a-input
                  v-model="formModel.ref.conditionList['1'].variableValue"
                  placeholder=""
                  @blur="handleEdgeChange"
                >
                  <d-select
                    slot="addonAfter"
                    v-model="formModel.ref.conditionList['1'].operator"
                    style="width: 80px"
                    @change="handleEdgeChange"
                  >
                    <a-select-option label="<" value=">"> &lt; </a-select-option>
                    <a-select-option value=">="> &gt;= </a-select-option>

                    <!-- <a-select-option label="<" value="<" />
                    <a-select-option label="<=" value="<=" /> -->
                  </d-select>
                </a-input>
              </div>
            </div>
            <a-radio :value="2">其他</a-radio>
          </a-radio-group>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { omit } from 'lodash'
import { list } from '@/api/configgurationCenter/approvalProcess'
import AuditAdd from '../AuditAdd'
import OrganizationAdd from '../OrganizationAdd'
import PositionAdd from '../PositionAdd'
export default {
  name: 'DetailForm',
  components: { AuditAdd, OrganizationAdd, PositionAdd },
  props: {
    type: {
      type: String,
      default: null
    },
    typeCode: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isLoaded: false,
      formModel: {},
      appdActorTypeOptions: [
        {
          value: 1,
          label: '指定审批人'
        },
        {
          value: 2,
          label: '组织部门'
        },
        {
          value: 3,
          label: '岗位'
        }
      ],
      factorTypeOptions: [
        {
          label: '商品数量',
          res: []
        },
        {
          label: '订单金额',
          res: []
        }
      ],
      lineTypeOptions: [],
      selectVal: '',
      showSelect: false,
      detail: []
    }
  },

  created() {
    const formModel = this.root.propsAPI.getSelected()[0].getModel()
    if (this.type === 'edge') {
      this.formModel = Object.assign(
        {},
        {
          label: '',
          ref: {
            type: 1,
            displayStyle: null,
            radioVal: 1,
            conditionList: []
          }
        },
        formModel
      )
    } else {
      this.formModel = Object.assign(
        {},
        {
          shape: 'flow-smooth',
          ref: {
            appdType: 1, // 审批方式 1: 或签 2: 会签
            appdActorType: 1, // 审批人员类型 1: 指定审批人 2: 组织部门 3: 岗位
            appdActorSubtype: 1, // 审判人员子类型 1: 部门主管 2: 连续多级主管 3: 指定部门
            actorList: []
          }
        },
        formModel
      )
    }
  },
  watch: {
    formModel: function (val) {
      console.log(val)
    }
  },
  async mounted() {
    const { data } = await list({
      filters: {
        typeCode: this.typeCode
      }
    })
    if (data) {
      this.showSelect = true
    }
    const factorTypeOptions = Object.keys(data)
    this.factorTypeOptions = factorTypeOptions.map((x) => {
      return {
        label: x,
        value: x,
        res: data[x]
      }
    })
    this.detail = data
    const factor = this.getFlowData()
    const nodes = factor.nodes
    const node = nodes.find((item) => {
      if (item.id === this.formModel.source) {
        return item
      }
    })
    // 当前是线，获取父节点的node信息保留到lineTypeOptions
    if (this.type === 'edge' && node && node.label) {
      this.lineTypeOptions = data[node.label]
      if (this.formModel.ref.conditionList && this.formModel.ref.conditionList.length === 0) {
        const lineTypeOption = this.lineTypeOptions[0]

        this.updateEdgeByLineTypeOption(lineTypeOption)
      }
    }

    this.isLoaded = true
  },
  methods: {
    updateEdgeByLineTypeOption(lineTypeOption) {
      if (lineTypeOption.displayStyle === 'numberRange') {
        const [operatorLeft, operatorRight] = lineTypeOption.operator.split(',')
        this.$set(this.formModel.ref, 'conditionList', [
          {
            variableId: lineTypeOption.id,
            operator: operatorLeft,
            variableValue: null
          },
          {
            variableId: lineTypeOption.id,
            operator: operatorRight,
            variableValue: null
          }
        ])
        this.$set(this.formModel.ref, 'radioVal', 1)
        this.formModel.ref.id = lineTypeOption.id
        this.formModel.ref.displayStyle = lineTypeOption.displayStyle
      } else if (lineTypeOption.displayStyle === 'number') {
        this.$set(this.formModel.ref, 'conditionList', [
          {
            variableId: lineTypeOption.id,
            operator: lineTypeOption.operator,
            variableValue: null
          }
        ])
        this.formModel.ref.id = lineTypeOption.id
        this.formModel.ref.displayStyle = lineTypeOption.displayStyle
        this.$set(this.formModel.ref, 'radioVal', 1)
      }
      this.handleSubmit()
    },
    getFlowData() {
      return this.root.editor.getCurrentPage().getGraph().save()
    },
    handleSubmit(e, item) {
      const { getSelected, executeCommand, update } = this.root.propsAPI
      const { formModel } = this
      setTimeout(() => {
        const item = getSelected()[0]
        if (!item) return
        executeCommand(() => {
          // this is for duplicate node in mind chart
          update(item, { ...omit(formModel, 'children') })
        })
      }, 0)
    },
    removeEdgeData() {
      setTimeout(() => {
        const { nodes, edges } = this.getFlowData()
        // 当前节点this.formModel
        const connectEdges = edges?.filter((x) => x.source === this.formModel.id)
        if (connectEdges) {
          connectEdges.forEach((edge) => {
            edge.label = null
            edge.ref.id = null
            edge.ref.conditionList = []
          })
        }
        this.root.propsAPI.read({
          nodes,
          edges
        })
      }, 0)
    },
    handleFactor(e) {
      this.handleSubmit()
      this.removeEdgeData()
    },
    handleNodeOperateChange() {
      this.formModel.ref.actorList = []
    },
    handleEdgeChange() {
      if (this.formModel.ref.radioVal === 1) {
        if (this.formModel.ref.displayStyle === 'number') {
          this.formModel.label = [
            this.formModel.ref.conditionList['0'].operator,
            this.formModel.ref.conditionList['0'].variableValue || ''
          ].join('')
        } else if (this.formModel.ref.displayStyle === 'numberRange') {
          this.formModel.label = [
            this.formModel.ref.conditionList['0'].operator === '>' ? '(' : '[',
            this.formModel.ref.conditionList['0'].variableValue || '',
            ',',
            this.formModel.ref.conditionList['1'].variableValue || '',
            this.formModel.ref.conditionList['1'].operator === '<' ? ')' : ']'
          ].join('')
        }
      } else {
        this.formModel.label = '其他'
      }

      this.handleSubmit()
    },
    handleEdgeOperateChange(e) {
      const lineTypeOption = this.lineTypeOptions.find((item) => {
        return e === item.id
      })

      this.updateEdgeByLineTypeOption(lineTypeOption)
      this.handleEdgeChange()
    }
  },

  inject: ['root']
}
</script>
<style lang="less" scoped>
.node {
  h3 {
    margin: 23px 0;
  }
}
.add-department-top {
  display: inline-block;
  margin-top: 20px;
}
.add-department-top,
.sign-wrap {
  .ant-radio-wrapper {
    line-height: 36px;
    min-width: 1rem;
  }
}
.line-judge label {
  margin-top: 20px;
}
.line-judge label:nth-child(1) {
  margin-bottom: 20px;
}
.condition {
  margin-top: 20px;
  display: flex;
  align-items: center;
  .ant-input-group-wrapper {
    width: 120px;
    /deep/.ant-input-wrapper {
      .ant-input-group-addon {
        padding: 0;
        .d-select {
          width: 100%;
        }
      }
    }
  }
}
.center {
  display: inline-block;
  width: 20px;
  height: 20px;
  font-size: 14px;
  text-align: center;
}
</style>
