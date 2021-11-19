<template>
  <div class="state">
    <div class="stateMu">
      <div class="stateMuLe">
        <div class="stateMuLeTitle">财务信息信息审批状态</div>
        <div class="stateMuLeState">{{ statusText[$$(info, 'auditStatus')] }}</div>
      </div>
      <div class="stateMuRi">
        <img
          v-if="$$(info, 'auditStatus') === '1'"
          class="stateImg"
          :src="require('@/assets/images/enterprise/tongguo 2.png')"
          alt=""
        />
        <img
          v-else-if="$$(info, 'auditStatus') === '3'"
          class="stateImg"
          :src="require('@/assets/images/enterprise/butongguo 2.png')"
          alt=""
        />
        <img v-else class="stateImg" :src="require('@/assets/images/enterprise/shenhezhong 2.png')" alt="" />
      </div>
      <div class="stateMuLe w450" v-if="$$(info, 'auditStatus') === '3' && $$(info, 'auditReason')">
        <div class="stateMuLeTitle">审核意见</div>
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ $$(info, 'auditReason') }}</span>
          </template>
          <div class="stateMuLeState audit-reason">{{ $$(info, 'auditReason') }}</div>
        </a-tooltip>
      </div>
      <div class="stateMuLe w400" v-if="['1', '3'].includes($$(info, 'auditStatus')) && $$(info, 'updateTime')">
        <div class="stateMuLeTitle">财务信息审批时间</div>
        <div class="stateMuLeState">{{ $$(info, 'updateTime') | dayjs }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      statusText: ['审核中', '审核通过', '', '审核失败']
    }
  },
  mounted() {
    console.log(this.statusText[this?.info?.auditStatus])
  }
}
</script>

<style lang="less" scoped>
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
</style>
<style lang="less" scoped>
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
</style>
