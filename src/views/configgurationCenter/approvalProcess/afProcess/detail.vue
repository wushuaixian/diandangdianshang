<template>
  <v-g-editor ref="flowChart" class="af-process-detail">
    <a-card :bordered="false" title="基本信息">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :model="info"
          v-bind="{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批流ID">
                {{ $$(info, 'id') }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批流名称">
                {{ $$(info, 'name') }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="状态" v-if-="info">
                {{ info.isAvailable | statusText(ApprovalProcessStatusList) }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批形式">
                {{
                  $$(
                    auditTypeList.find((x) => x.value === $$(info, 'auditType')),
                    'label'
                  )
                }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="$hasOpeerate()">
              <a-form-model-item label="所属平台">
                {{
                  $$(
                    platformList.find((x) => x.value === $$(info, 'platformId')),
                    'label'
                  )
                }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="所属机构">
                <Ellipsis :length="25"> {{ $$(info, 'merchantName') }}</Ellipsis>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="适用模块">
                {{ $$(info, 'modelStr') }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批单据">
                {{
                  $$(
                    typeCodeList.find((x) => x.value === $$(info, 'typeCode')),
                    'label'
                  )
                }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="备注">
                {{ $$(info, 'remark') }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建人">
                {{ $$(info, 'createUsername') }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间">
                <span v-if="$$(info, 'createTime')">{{ $$(info, 'createTime') | dayjs }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <!-- <div class="af-process-detail__sidebar">
      <flow-item-panel />
    </div> -->
    <div class="af-process-detail__container">
      <!-- <div class="af-process-detail__toolbar">
        <flow-toolbar />
      </div> -->
      <div class="af-process-detail__main">
        <flow v-if="isLoaded" :data="flowChartData" :on-node-click="handleNodeClick" :graph="{ mode: 'readOnly' }" />
      </div>
    </div>
    <!-- <div class="af-process-detail__panel">
      <flow-detail-panel :type-code="$$(info, 'typeCode')" />
    </div> -->
    <!-- <flow-context-menu /> -->
    <!-- <register-edge :config="customEdgeConfig" name="custom-polyline" extend="flow-polyline" /> -->
  </v-g-editor>
</template>

<script>
import { getById, getAfTypeConfigList, saveNode, getListMulti } from '@/api/configgurationCenter/approvalProcess'
import { ApprovalProcessStatusList, auditTypeList, platformList } from '@/config/constant'
import VGEditor, { Flow, RegisterEdge } from 'vg-editor'
import { FlowToolbar } from '../components/EditorToolbar'
import { FlowItemPanel } from '../components/EditorItemPanel'
import { FlowDetailPanel } from '../components/EditorDetailPanel'
import EditorMinimap from '../components/EditorMinimap'
import { FlowContextMenu } from '../components/EditorContextMenu'
import { groupBy } from '@/utils/util'
import { mapState } from 'vuex'
export default {
  components: {
    VGEditor,
    Flow,
    FlowToolbar,
    FlowItemPanel,
    FlowDetailPanel,
    EditorMinimap,
    FlowContextMenu,
    RegisterEdge
  },
  filters: {
    statusText(val, list) {
      return list.find((x) => x.value === val)?.label
    }
  },
  provide() {
    return {
      info: null
    }
  },
  data() {
    return {
      saveImg: require('./images/save.png'),
      checkImg: require('./images/check.png'),
      id: this.$route.params.id,
      info: null,
      ApprovalProcessStatusList,
      auditTypeList,
      platformList,
      modelList: [],
      typeCodeList: [],
      saveReadOnly: false,
      customEdgeConfig: {
        getActivedStyle(item) {
          return {
            lineWidth: 3
          }
        },
        getSelectedStyle(item) {
          return {
            lineWidth: 3
          }
        }
      },
      isLoaded: false,
      flowChartData: {}
    }
  },
  mounted() {
    this.getById()
    this.getAfTypeConfigList()
  },
  computed: {
    ...mapState({
      isPlatform: (state) => state.permission.isPlatform
    }),
    provideInfo() {
      return this.info
    }
  },
  methods: {
    async getListMulti() {
      const data = ['APPDFLOW_MODEL']
      const res = await getListMulti(data)
      if (res.code === '0') {
        this.modelList = [
          ...[
            {
              label: '全部',
              value: ''
            }
          ],
          ...res?.data?.APPDFLOW_MODEL?.map((x) => {
            return {
              label: x?.name,
              value: x?.code
            }
          })
        ]
      }
    },
    async getById() {
      const { id } = this
      const res = await getById({ id })
      if (res.code === '0') {
        this.isLoaded = true
        this.info = res.data
        this._provided.info = res.data
        this.flowChartData = res.data?.content
      }
    },
    async getAfTypeConfigList() {
      const res = await getAfTypeConfigList()
      if (res.code === '0') {
        this.typeCodeList = res?.data?.map((x) => {
          return {
            label: x?.name,
            value: x?.code
          }
        })
      }
    },
    async handleSave() {
      const handleCheck = await this.handleCheck() // 保存调用检测方法
      if (!handleCheck) {
        return
      }
      const saveData = this.$refs.flowChart.editor.getCurrentPage().getGraph().save()
      const data = await saveNode({
        id: this.id,
        content: saveData
      })
      if (data.code === '0') {
        this.$message.success('保存成功')
        this.$router.push({
          name: 'ApprovalProcessAfProcessList'
        })
      } else {
        this.$message.error(data.message)
      }
    },
    handleCheck() {
      let checkResult = true
      const graphData = this.$refs.flowChart.editor.getCurrentPage().getGraph().save()
      const checkStartNode = this.checkStartNode(graphData) // 检测开始节点
      const checkEndNode = this.checkEndNode(graphData) // 检测结束节点
      const checkOtherEdges = this.checkOtherEdges(graphData.edges) // 检测线上有两个其他
      const checkSectionLines = this.checkSectionLines(graphData) // 检测条件线上的范围
      if (!checkStartNode || !checkEndNode || !checkOtherEdges || !checkSectionLines) {
        checkResult = false
      }
      return checkResult
    },
    checkStartNode(params) {
      let checkStartNode = true
      const startNodes = params.nodes.filter((x) => {
        if (x.ref.type === 0) {
          return x
        }
      })
      if (startNodes.length > 1) {
        this.$message.warning('开始节点有且只能有一个')
        checkStartNode = false
      }
      return checkStartNode
    },
    checkEndNode(params) {
      let checkEndNode = true
      const endNodes = params.nodes.filter((x) => {
        if (x.ref.type === 3) {
          return x
        }
      })
      if (endNodes.length > 1) {
        this.$message.warning('结束节点有且只能有一个')
        checkEndNode = false
      }
      return checkEndNode
    },
    checkOtherEdges(params) {
      let checkOtherEdges = true
      const edgesSource = groupBy(params, 'source')

      const otherFactor = Object.values(edgesSource)

      otherFactor.forEach((item) => {
        // 同源条件线 下面有2个其他
        const others = item.filter((x) => x.ref && x.ref.radioVal === 2)

        if (others.length > 1) {
          this.$message.warning('有多个其他')
          checkOtherEdges = false
        }
      })
      return checkOtherEdges
    },
    checkSectionLines(params) {
      let checkOtherLines = true
      const list = params.nodes.filter((x) => {
        // 条件节点
        if (x.ref.type === 1) {
          x.line = []
          // 有几根线
          params.edges.forEach((y) => {
            if (x.id === y.source) {
              x.line.push(y.ref.conditionList)
              x.linelabel = y.label
            }
          })
          return x
        }
      })
      list.forEach((x) => {
        const sectionlist = []
        if (x.line.length > 1) {
          x.line.forEach((y) => {
            const section = {}
            if (y.length > 1) {
              y.forEach((z) => {
                if (z.operator === '>=') {
                  section.start = parseFloat(z.variableValue)
                } else if (z.operator === '>') {
                  section.start = parseFloat(z.variableValue) + 0.00001
                } else if (z.operator === '<=') {
                  section.end = parseFloat(z.variableValue)
                } else if (z.operator === '<') {
                  section.end = parseFloat(z.variableValue) - 0.00001
                }
              })
            } else if (y.length === 1) {
              if (y[0].operator === '>=') {
                section.start = parseFloat(y[0].variableValue)
                section.end = 99999999
              } else if (y[0].operator === '>') {
                section.start = parseFloat(y[0].variableValue) + 0.00001
                section.end = 99999999
              } else if (y[0].operator === '<=') {
                section.start = -99999999
                section.end = parseFloat(y[0].variableValue)
              } else if (y[0].operator === '<') {
                section.start = -99999999
                section.end = parseFloat(y[0].variableValue) - 0.00001
              }
            }
            section.label = y.linelabel
            sectionlist.push(section)
          })
          sectionlist.sort((a, b) => {
            return a.start - b.start
          })
          for (let i = 1; i < sectionlist.length; i++) {
            if (sectionlist[i].start <= sectionlist[i - 1].end) {
              this.$message.warning(x.label + '条件区间存在条件数值交集！')
              checkOtherLines = false
            }
          }
          return checkOtherLines
        }
      })
      return checkOtherLines
    },
    handleNodeClick(e) {}
  }
}
</script>

<style lang="less" scoped>
.af-process-detail {
  .ant-form-item {
    margin-bottom: 10px;
  }
  .ant-card {
    margin-bottom: 20px;
  }
  .ant-btn-text {
    padding: 0 8px;
    border: 0;
    height: 0;
  }
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  overflow: hidden;
  &__sidebar {
    position: absolute;
    top: 300px;
    left: 0;
    bottom: 0;
    width: 200px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    &__item {
      margin-bottom: 16px;
    }
  }
  &__container {
    position: absolute;
    top: 300px;
    left: 0px;
    // right: 302px;
    width: 100%;
    bottom: 0;
    background-color: #fff;
  }
  &__main {
    position: absolute;
    top: 45px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &__panel {
    position: absolute;
    top: 300px;
    right: 0;
    bottom: 0;
    width: 300px;
    background-color: #fff;
    padding: 0 20px;
  }
}
.af-process-detail {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  overflow: hidden;
  &__sidebar {
    position: absolute;
    top: 300px;
    left: 0;
    bottom: 0;
    width: 200px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    &__item {
      margin-bottom: 16px;
    }
  }
  &__container {
    position: absolute;
    top: 300px;
    left: 0px;
    // right: 302px;
    bottom: 0;
    background-color: #fff;
  }
  &__main {
    position: absolute;
    top: 45px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &__panel {
    position: absolute;
    top: 300px;
    right: 0;
    bottom: 0;
    width: 300px;
    background-color: #fff;
    padding: 0 20px;
  }
}
</style>
