<template>
  <div>
    <p class="tishi" v-if="status == 0">您的工商信息：已提交，等待审核</p>
    <p class="tishi" v-if="status == 1">
      工商信息如有不符，点击<span class="appeal" @click="appeal">立即申诉</span>反馈不符内容，
      <span class="appeal" @click="onRecord">查看申诉记录</span>
    </p>
    <div class="state">
      <div class="stateMu">
        <div class="stateMuLe">
          <div class="stateMuLeTitle">工商信息审批状态</div>
          <div class="stateMuLeState">{{ statusText }}</div>
        </div>
        <div class="stateMuRi">
          <img v-if="status == 1" class="stateImg" :src="require('@/assets/images/enterprise/tongguo 2.png')" alt="" />
          <img
            v-else-if="status == 2"
            class="stateImg"
            :src="require('@/assets/images/enterprise/butongguo 2.png')"
            alt=""
          />
          <img v-else class="stateImg" :src="require('@/assets/images/enterprise/shenhezhong 2.png')" alt="" />
        </div>
        <div class="stateMuLe w450" v-if="status == 2">
          <div class="stateMuLeTitle">审核意见</div>
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ auditReason }}</span>
            </template>
            <div class="stateMuLeState audit-reason">{{ auditReason }}</div>
          </a-tooltip>
        </div>
        <div class="stateMuLe w400" v-if="status == 2 || status == 1">
          <div class="stateMuLeTitle">工商信息审批时间</div>
          <div class="stateMuLeState">{{ auditTime | dayjs }}</div>
        </div>
      </div>
    </div>
    <a-modal wrapClassName="appeal-modal" v-model="visible" width="650px" title="立即申诉" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="handleOk"> 提交 </a-button>
      </template>
      <a-form-model ref="form" :rules="rules" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-model-item label="申诉类型" prop="indComplainType">
          <a-checkbox-group v-model="form.indComplainType">
            <a-row>
              <a-col :span="8">
                <a-checkbox value="1"> 工商信息 </a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="2"> 主营品类 </a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="3"> 企业性质 </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item label="申诉内容" prop="complaintContent">
          <a-textarea
            placeholder="请输入申诉内容"
            :rows="4"
            :max="30"
            :maxLength="500"
            v-model="form.complaintContent"
          />
          <div style="position: absolute; right: 20px; top: -5px">{{ form.complaintContent.length }}/500</div>
        </a-form-model-item>
        <a-form-model-item label="附件" prop="complaintUrls" v-if="form.indComplainType.includes('1')">
          <div>
            <s-upload v-model="form.complaintUrls" :limit="3" :multiple="true" list-type="picture-card">
              <div class="upload" v-if="form.complaintUrls.length < 3">
                <div class="plus">
                  <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                </div>
                <div class="text">上传图片</div>
              </div>
            </s-upload>
          </div>
        </a-form-model-item>
        <a-form-model-item label="主营品类" v-if="form.indComplainType.includes('2')" prop="categoryId">
          <tree-select
            :collapseTags="false"
            :normalizer="normalizer"
            :options="categoryList"
            v-model="form.categoryId"
          ></tree-select>
        </a-form-model-item>
        <a-form-model-item label="企业性质" v-if="form.indComplainType.includes('3')" prop="enterpriseNature">
          <a-radio-group
            v-model="form.enterpriseNature"
            :options="[
              { label: '生产商', value: '1' },
              { label: '贸易商', value: '2' }
            ]"
          >
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal wrapClassName="stateInfoList" @cancel="recordok" :visible="recordview" width="80%" :title="modal">
      <template slot="footer">
        <a-button key="back" @click="recordok"> 关闭 </a-button>
      </template>
      <s-table
        name="stateTable"
        ref="stateTable"
        rowKey="id"
        :columns="columns"
        :data="recordAwait"
        :isCanFilter="false"
        :isShowIndex="false"
      >
        <span slot="complaintContent" slot-scope="text">{{ text }}</span>
        <template v-slot:pic="text">
          <div v-if="!text" class="perchDiv"></div>
          <div v-else>
            <ImagePreview v-for="item in text.split(',')" :value="item" :key="item"></ImagePreview>
          </div>
        </template>
        <span slot="rejectReason" slot-scope="text" style="color: #ff6b00">{{ text }}</span>
        <span slot="complaintStatus" slot-scope="text">
          <span v-if="text === '0'">待处理</span>
          <span v-else-if="text === '1'">已处理</span>
          <span v-else>驳回</span>
        </span>
        <span slot="updateTime" slot-scope="updateTime">
          {{ updateTime | moment('YYYY/MM/DD hh:mm:ss') }}
        </span>
      </s-table>
    </a-modal>
  </div>
</template>

<script>
import Enterpriceupload from './enterpriceupload.vue'
import request from '@/utils/request'
// import moment from 'moment'
import { ImagePreview } from '@/components/index.js'
import { queryTreeAllCategory } from '@/api/user.js'

export default {
  components: {
    Enterpriceupload: Enterpriceupload, // 图片上传,
    ImagePreview
  },
  props: {
    statusText: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 1
    },
    auditReason: {
      type: String,
      default: ''
    },
    auditTime: {
      type: [String, Number],
      default: ''
    },
    enterpriseNature: {
      type: String,
      default: ''
    },
    categoryId: {
      type: Number,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        indComplainType: [],
        complaintUrls: [],
        complaintContent: '',
        categoryId: null,
        enterpriseNature: this.enterpriseNature
      },
      rules: {
        indComplainType: [{ required: true, message: '请选择申诉类型', trigger: 'change' }],
        complaintUrls: [{ type: 'array', required: true, message: '请上传附件', trigger: 'change' }],
        complaintContent: [{ required: true, message: '请输入申诉内容', trigger: 'change' }],
        categoryId: [{ required: true, message: '请选择主营品类', trigger: 'change' }],
        enterpriseNature: [{ required: true, message: '请选择主营品类', trigger: 'change' }]
      },
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || undefined,
          isDisabled: node.level !== 2
        }
      },
      categoryList: [],
      columns: [
        {
          title: '序号',
          key: 'id',
          width: 100,
          customRender: (text, item, index) => {
            return index + 1
          }
        },
        {
          title: '申诉内容',
          dataIndex: 'complaintContent',
          key: 'complaintContent',
          width: 100,
          scopedSlots: { customRender: 'complaintContent' }
        },
        {
          title: '附件',
          dataIndex: 'complaintUrl',
          key: 'complaintUrl',
          width: 100,
          scopedSlots: { customRender: 'pic' }
        },
        {
          title: '申诉状态',
          dataIndex: 'complaintStatus',
          key: 'complaintStatus',
          ellipsis: true,
          width: 100,
          scopedSlots: { customRender: 'complaintStatus' }
        },
        {
          title: '原因',
          dataIndex: 'rejectReason',
          key: 'rejectReason',
          width: 300,
          scopedSlots: { customRender: 'rejectReason' }
        },
        {
          title: '审核时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          ellipsis: true,
          width: 200,
          scopedSlots: { customRender: 'updateTime' }
        }
      ],
      recordData: [
        {
          complaintContent: '',
          complaintUrl: '',
          complaintStatus: '',
          rejectReason: '',
          updateTime: ''
        }
      ],
      modal: '',
      recordview: false,
      visible: false,
      fileList: [],
      caiActive: false,
      queryMerAll: []
    }
  },
  mounted() {
    this.modal = '申诉记录'
    this.queryAllCategory()
    // console.log(this.enterpriseNature)
    // this.form.enterpriseNature = this.enterpriseNature
  },
  watch: {
    enterpriseNature(val) {
      this.form.enterpriseNature = val
    },
    categoryId(val) {
      this.form.categoryId = val
    },
    'form.complaintUrls': function (val) {
      if (val.length > 0) {
        this.$refs.form.clearValidate('complaintUrls')
      }
    }
  },
  methods: {
    // 申诉记录触发方法
    async queryAllCategory() {
      const res = await queryTreeAllCategory()
      if (res.code === '0') {
        this.categoryList = res.data
      }
    },
    async recordAwait() {
      const result = await request({
        url: '/back-manage-web/appealAction/recordListPage',
        method: 'POST',
        data: {
          complainType: '1'
        }
      })
      console.log(result)
      return result
    },
    onRecord() {
      this.recordview = true
      this.$refs.stateTable.refresh(true)
    },
    recordok(e) {
      this.recordview = false
    },
    appeal() {
      this.visible = true
    },
    async handleOk() {
      await this.$refs.form.validate()
      const { form } = this
      const params = {
        ...form,
        complainType: '1',
        indComplainType: form.indComplainType.join(','),
        complaintUrls: form?.complaintUrls.map((x) => x?.response?.data[0]?.url)
      }
      this.handleCancel()
      this.$parent.actionAppeal(params)
    },
    handleCancel() {
      this.visible = false
      this.form = {
        indComplainType: [],
        complaintUrls: [],
        complaintContent: '',
        categoryId: null,
        enterpriseNature: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-modal {
  .ant-checkbox-group {
    width: 100%;
    line-height: inherit;
  }
}
.tishi {
  margin-top: 20px;
  font-size: 12px;
  color: #262626;

  .appeal {
    color: #ff6b00;
    padding: 0 4px;
    text-decoration: underline;
    cursor: pointer;
  }
}

.state {
  height: 80px;
  background: #fafafa;
  border-radius: 4px;
  margin-top: 10px;

  .stateMu {
    display: flex;

    .stateMuLe {
      width: 200px;
      text-align: center;
      display: inline-block;

      .stateMuLeTitle {
        color: #666666;
        margin-top: 10px;
        height: 26px;
      }

      .stateMuLeState {
        font-size: 16px;
        font-weight: 600;
        color: #262626;

        &.audit-reason {
          height: 30px;
          overflow: hidden;
          line-height: 30px;
          text-overflow: ellipsis;
          width: 200px;
          white-space: nowrap;
        }
      }
    }

    .stateMuRi {
      display: inline-block;
      width: 80px;

      .stateImg {
        width: 48px;
        height: 48px;
        margin-top: 14px;
      }
    }
  }
}

.perchDiv {
  width: 80px;
  height: 80px;
}

.w450 {
  width: 450px;
}

.w400 {
  width: 400px;
}

.imageSize {
  width: 100%;
  height: 86px;
}

.shensu /deep/label::before {
  content: '*';
  display: inline-block;
  color: #f00;
  position: relative;
  top: 2px;
  left: -3px;
}
/deep/ .ant-upload-select-picture-card {
  background: #fff !important;
}
.stateInfoList {
  /deep/.ant-table-tbody > tr > td {
    word-wrap: break-word;
    word-break: break-all;
  }
  /deep/.ant-table-fixed {
    tr {
      height: auto !important;
    }
  }
}
</style>
