<template>
  <div class="exportFile">
    <template v-if="paramsList.length > 0 && showExport">
      <a-button class="button" v-for="(item, index) in paramsList" :key="index" @click="exportFile(item)">
        {{ item.name }}
      </a-button>
    </template>
    <template v-else>
      <a-button class="button" v-if="showExport" @click="exportFile()">导出</a-button>
    </template>
    <a-button class="button" v-if="showExportTask" @click="viewTasksVisible = true">{{ exportTaskText }}</a-button>
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks
      :visible="viewTasksVisible"
      @close="viewTasksVisible = false"
      :taskType="$$(params, 'exportType')"
      :taskTypeList="$$(params, 'exportTypeList') ? params.exportTypeList : paramsList.map((x) => x.params.exportType)"
    />
  </div>
</template>
<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { exportInvoice, exportId } from '@/api/fince'
export default {
  components: {
    SystemctlTips,
    ViewTasks
  },
  props: {
    exportTaskText: {
      type: String,
      default: '查看任务'
    },
    params: {
      type: Object,
      default: () => {}
    },
    paramsList: {
      type: Array,
      default: () => []
    },
    mode: {
      type: Function,
      default: exportInvoice
    },
    showExport: {
      type: Boolean,
      default: true
    },
    showExportTask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      exportCode: 0,
      templateCode: ''
    }
  },
  methods: {
    exportFile(item) {
      const that = this
      const { params } = item || this
      this.mode({
        ...params,
        jsonTxt: JSON.stringify(params.jsonTxt)
        // templateCode: this.templateCode,
        // jsonTxt,
        // exportType: 'exportInvoiceInfoList',
        // fileName: this.fileName
      }).then((res) => {
        if (res.code === '0') {
          this.$message.success('创建任务成功!')
          this.$emit('export')
          const taskType = params.taskType ? params.taskType : params.templateCode
          exportId({ taskType }).then((res) => {
            if (res.code === '0' && res.data) {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.exportFile {
  display: inline-block;
  .button {
    margin-right: 10px;
  }
}
</style>
