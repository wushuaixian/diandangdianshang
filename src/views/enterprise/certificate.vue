<template>
  <div>
    <Tabtitle :titleName="titleName"></Tabtitle>
    <!-- <header-title text="资质证书" /> -->
    <div class="cretiticate">
      <div class="img-box" v-for="item in list" :key="item.id">
        <div class="delete" @click="handleDelete(item)" v-if="item.certificationStatus === '0'">
          <a-icon type="delete" />
        </div>
        <ImagePreview :value="item.certificateUrl" :width="236" :height="169" />
        <div class="content">
          <div class="title">
            <div class="name">{{ item.certificateType }}</div>
            <div
              :class="{ state: ['0', '2'].includes(item.certificationStatus), auth: item.certificationStatus === '1' }"
            >
              {{ certificationStatusList[item.certificationStatus] }}
            </div>
            <!-- <a-button disabled size="small">
              {{ item.certificationStatus == '0' ? '未认证' : '已认证' }}
            </a-button> -->
            <div class="button">
              <a @click="handleEdit(item)" v-if="item.certificationStatus == '0'">编辑</a>
              <a @click="handleCheck(item)">查看</a>
            </div>
          </div>
          <div class="endtime">有效期至：{{ item.issueEndTime | moment('YYYY-MM-DD') }}</div>
        </div>
      </div>
      <a class="addcert" @click="showAddCert">
        <div>
          <img :src="require('@/assets/images/enterprise/分组 8@2x.png')" class="add" />
        </div>
        <h1 class="addtext">添加资质</h1>
      </a>
    </div>
    <addcert
      v-if="isShowAddCert"
      :type="type"
      :info="info"
      :visible="visible"
      @update="BindData"
      @close="closeAddCert"
    ></addcert>
  </div>
</template>
<script>
import addcert from './compontents/addcreat.vue'
import Tabtitle from './tabtitle.vue'
import Entbnt from './entbnt.vue'
import ImagePreview from '@/components/ImagePreview'
import { qualificationList, deleteQualifications } from '@/api/supplieAuthAdmin'
import moment from 'moment'
export default {
  created() {
    this.BindData()
  },
  components: {
    Entbnt: Entbnt, // 底部按钮
    Tabtitle: Tabtitle, // 导航标题
    addcert: addcert,
    ImagePreview
  },
  data() {
    return {
      type: '',
      certificationStatusList: ['未认证', '已认证', '认证不通过'],
      list: [],
      titleName: '资质证书',
      visible: false,
      isShowAddCert: false,
      info: null
    }
  },
  methods: {
    handleEdit(info) {
      this.info = {
        ...info,
        issueBeginTime: info.issueBeginTime ? moment(info.issueBeginTime) : null,
        issueEndTime: moment(info.issueEndTime)
      }
      this.type = 'edit'
      this.visible = true
      this.isShowAddCert = true
    },
    handleCheck(info) {
      this.info = {
        ...info,
        issueBeginTime: info.issueBeginTime ? moment(info.issueBeginTime) : null,
        issueEndTime: moment(info.issueEndTime)
      }
      this.type = 'check'
      this.visible = true
      this.isShowAddCert = true
    },
    async handleDelete({ id }) {
      this.$confirm({
        title: '提示',
        content: '确认删除吗?',
        onOk: async () => {
          const res = await deleteQualifications({ id })
          if (res.code === '0') {
            this.$message.success('删除成功!')
            this.BindData()
          }
        },
        onCancel() {
          console.log('Cancel')
        },
        class: 'test'
      })
    },
    BindData() {
      qualificationList().then((ret) => {
        if (ret.code === '0') {
          this.list = ret.data.listObj
        }
      })
    },
    showAddCert() {
      this.type = 'edit'
      this.info = null
      this.visible = true
      this.isShowAddCert = true
    },
    closeAddCert() {
      this.visible = false
      setTimeout(() => {
        this.isShowAddCert = false
      }, 300)
    }
  }
}
</script>

<style lang="less" scoped>
.cretiticate {
  padding-top: 20px;

  display: flex;
  flex-direction: row;
  box-sizing: content-box;
  flex-wrap: wrap;
  .cert,
  .addcert {
    display: block;
    width: 100%;
    border-radius: 10px;
    border: 2px solid #eeeeee;
    padding-top: 10px;
    overflow: hidden;

    margin-left: 20px;
    margin-bottom: 20px;
  }
  .addcert {
    width: 236px;
    height: 260px;
    border: 2px dashed #eeee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .addtext {
      margin-top: 10px;
      text-align: center;
      font-size: 24px;
      color: #ff6b00;
    }
  }
  /deep/.contant {
    background-color: #fff9f5;
    width: 100%;
    height: 100px;
    padding: 15px 10px;
    .certname {
      font-weight: 700;
    }
    .certstate {
      margin-left: 20px;
      background-color: #ffd7ba;
      color: #ff6b00;
      padding: 2px 10px;
      border-radius: 5px;
    }
    .certtime {
      margin-top: 10px;
    }
  }
}

.img-box {
  width: 236px;
  height: 260px;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  position: relative;
  &:hover {
    border: 1px solid rgba(255, 107, 0, 0.3);
    border-radius: 8px;
    .delete {
      display: block;
    }
  }
  .delete {
    display: none;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.64);
    border-radius: 50%;
    position: absolute;
    line-height: 40px;
    text-align: center;
    right: 5px;
    top: 5px;
    i {
      color: #fff;
    }
  }
  .img {
    width: 236px;
    height: 169px;
  }
  .content {
    background: rgba(255, 107, 0, 0.04);
    height: 91px;
    display: flex;
    flex-direction: column;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 11px;
      margin-left: 8px;
      .name {
        font-size: 18px;
        color: #262626;
        width: 80px;
        overflow: hidden;
        height: 30px;
        text-overflow: ellipsis;
      }

      .state,
      .auth {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px 5px;
        font-size: 12px;
        margin-left: 8px;
        background: rgba(187, 187, 187, 0.24);
        border-radius: 2px;
        font-size: 12px;
        color: #999999;
        &.auth {
          background-image: linear-gradient(-270deg, #ff9336 0%, #ff6b00 100%);
          border-color: #fff;
          color: #fff;
        }
      }

      .button {
        margin-left: 20px;
        a + a {
          margin-left: 5px;
        }
      }
    }
    .endtime {
      font-size: 12px;
      color: #999999;
      margin-top: 8px;
      margin-left: 8px;
    }
  }
}
</style>
