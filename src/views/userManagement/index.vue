<template>
  <div class="userManagement-container">
    <a-card>
      <h1 class="title">
        <span>用户管理</span>
        <a-radio-group v-model="value" default-value="a" button-style="solid">
          <a-radio-button value="a" class="btn"> 卡片展示 </a-radio-button>
          <a-radio-button value="b" class="btn"> 列表展示 </a-radio-button>
        </a-radio-group>
      </h1>
      <a-form-model :model="form" layout="inline" style="height: 40px">
        <!-- <a-form-model-item label="创建时间">
          <a-range-picker v-model="queryParams.time" :allowClear="true">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-form-model-item> -->
        <!-- <a-form-model-item label="用户状态">
          <d-select v-model="queryParams.isAvailable">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">关闭</a-select-option>
            <a-select-option value="1">开启</a-select-option>
          </d-select>
        </a-form-model-item> -->
        <a-form-model-item class="add">
          <!-- <a-button type="primary" @click="handleSearch" style="margin-right: 10px"> 搜索 </a-button> -->
          <a-button type="primary" @click="adduser"> 新增用户 </a-button>
        </a-form-model-item>
      </a-form-model>
      <s-table
        ref="table"
        name="userManagementTabless"
        v-show="value === 'b'"
        rowKey="userId"
        :columns="columns"
        :data="init"
        :scroll="{ x: 1000 }"
        class="table"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
        <template slot="operations" slot-scope="scope, props">
          <div>
            <a-switch
              v-if="props.roleName !== '管理员'"
              :checked="props.isAvailable ? true : false"
              @change="handleSwitchEmployee(props)"
            />
            <span v-if="props.roleName !== '管理员'" class="star">{{ props.isAvailable ? '启用' : '禁用' }}</span>
            <a class="star" @click="addedit(props)">编辑</a>
          </div>
        </template>
      </s-table>
      <div v-show="value === 'a' && $refs.table && $refs.table.localDataSource" class="card-list">
        <div
          class="card"
          v-for="item in byPage"
          :key="item.userId"
          :class="{ 'card disabled': !item.isAvailable, card: item.isAvailable }"
        >
          <img v-if="!item.isAvailable" class="card-img" src="@/assets/images/user/disabled.png" alt="" />
          <div class="head">
            <span>{{ item.userName }}</span>
            <span>{{ item.identityCardName }}</span>
            <div class="button">
              <a v-if="item.roleName !== '管理员'" @click="handleSwitchEmployee(item)">{{
                item.isAvailable ? '禁用' : '启用 '
              }}</a>
              <a-divider v-if="item.roleName !== '管理员'" type="vertical" />
              <!-- <span class="star" @click="editUser(item)">编辑</span> -->
              <span class="star" @click="addedit(item)">编辑</span>
            </div>
          </div>
          <div class="content">
            <span>角色：</span>
            <div class="roles" v-if="item.roleName">
              <div class="tags">
                <span class="tag" v-for="i in item.roleName.split(',').slice(0, 3)" :key="i">{{ i }}</span>
              </div>
            </div>
            <div class="roles" v-else-if="item.name">
              <div class="tags">
                <span class="tag" v-for="i in item.name.split(',').slice(0, 3)" :key="i">{{ i }}</span>
              </div>
            </div>
          </div>
          <div class="content content-position">
            <span>岗位：</span>
            <div class="roles" v-if="item.positionName">
              <div class="tags">
                <span class="tag" v-for="i in item.positionName.split(',').slice(0, 3)" :key="i">{{ i }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="more" v-if="value === 'a'">
        <span class="more-span" @click="init" v-if="showBtn">查看更多</span>
        <span v-else>没有更多了 ~</span>
      </div>
    </a-card>
    <add-user
      :roleid="roleid"
      :title="title"
      :visible="visible"
      :isSuperAdmin="isSuperAdmin"
      :info="editFrom"
      @close="close"
    ></add-user>
  </div>
</template>

<script>
import moment from 'moment'
import addUser from './components/addUser.vue'
// getBiddingPurchase
import {
  queryEmployeeByPage,
  queryEmployeeById,
  updateUserStatus
  // getBiddingPurchase
} from '@/api/userManagement'
// import { updateEmployeeStatus } from '@/api/organization'
const columns = [
  {
    title: '登录用户名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '姓名',
    dataIndex: 'identityCardName',
    key: 'identityCardName'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile'
  },
  // {
  //   title: '所属部门',
  //   dataIndex: 'departmentName',
  //   key: 'departmentName'
  // },
  {
    title: '岗位',
    dataIndex: 'positionName',
    key: 'positionName'
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: '操作',
    dataIndex: 'operations',
    key: 'action',
    fixed: 'right',
    width: 150,
    scopedSlots: { customRender: 'operations' }
  }
]
export default {
  components: { addUser },
  data() {
    return {
      list: [],
      columns,
      title: '新增用户',
      visible: false,
      // 总条数
      total: '200',
      // 视图切换
      value: 'a',
      queryParams: {
        isAvailable: '',
        time: null
      },
      form: {},
      editFrom: {}, // 编辑的表单
      // 下拉框禁用
      disabled: true,
      byPage: [],
      isSuperAdmin: '',
      currentPage: 1,
      showBtn: false,
      isPlatform: 0,
      roleid: 0
    }
  },
  mounted() {
    // this.init()
  },
  watch: {
    value() {
      if (this.value === 'a') {
        this.currentPage = 1
        this.init()
      } else if (this.value === 'b') {
        this.$refs.table.refresh(true)
      }
    }
  },
  methods: {
    async init(params) {
      const { queryParams } = this
      const data = {
        ...params,
        ...queryParams
      }
      if (data.time?.length > 0) {
        const [startTime, endTime] = data.time
        data.startTime = startTime.format('YYYY-MM-DD')
        data.endTime = endTime.format('YYYY-MM-DD')
      }
      if (this.currentPage === 1) {
        this.byPage = []
      }
      if (this.value === 'a') {
        data.currentPage = this.currentPage
        data.itemsPerPage = 10
      }
      const result = await queryEmployeeByPage({ ...data, platformId: this.$store.state.permission.isPlatform })
      // if (this.$store.state.permission.isPlatform === 7 && this.currentPage === 1) {
      // const res = await getBiddingPurchase()
      // if (
      //   res.code === '0' &&
      //   res?.data?.length > 0 &&
      //   res.data.every((item) => {
      //     return item !== null
      //   })
      // ) {
      result.data.listObj = [
        // ...res.data.map((item) => {
        //   item.roleName = item?.name || ''
        //   return item
        // }),
        ...result.data.listObj
      ]
      // }
      // }
      this.currentPage++
      this.byPage = [...this.byPage, ...result.data.listObj]
      this.showBtn = true
      if (result.data.listObj.length < 10) {
        this.showBtn = false
      }
      return result
    },
    moment,
    // 关闭添加框
    adduser() {
      this.visible = true
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    infoList() {
      if (this.value === 'b') {
        this.$refs.table.refresh(true)
      } else {
        this.byPage = []
        this.currentPage = 1
        this.init({
          currentPage: 1,
          itemsPerPage: 10
        })
      }
    },
    handleSwitchEmployee({ userId, isAvailable }) {
      const vm = this
      this.$confirm({
        title: '提示',
        content: `是否要${!isAvailable ? '启用' : '禁用'}该用户?`,
        onOk: async () => {
          const res = await updateUserStatus({ id: userId, isAvailable: Number(!isAvailable) })
          if (res.code === '0') {
            vm.$message.success(!isAvailable ? '启用成功' : '禁用成功')
            vm.infoList()
          }
        },
        onCancel: () => {}
      })
    },

    // 编辑角色
    editRole() {
      this.visible = true
    },
    stopRole() {
      this.disabled = true
    },
    async editUser(item) {
      const { userId, isAvailable } = item
      const result = await queryEmployeeById({
        userId
      })
      if (result.code === '0') {
        this.visible = true
        this.editFrom = {
          ...result.data,
          userId,
          isAvailable,
          password: result?.data?.password.slice(0, 20),
          password1: result?.data?.password.slice(0, 20),
          roleList: result?.data?.roles,
          positionIds: result?.data?.positions
        }
        this.title = '编辑用户'
        this.isSuperAdmin = item.roleName
        this.infoList()
      }
    },
    addedit(item) {
      if (item.fixedRole === 1) {
        this.adduser()
        // console.log(item)
        this.roleid = item.id
      } else {
        this.editUser(item)
      }
    },
    close() {
      this.visible = false
      this.title = '新增用户'
      this.isSuperAdmin = ''
      this.currentPage = 1
      this.$refs.table.refresh(true)
    }
  }
}
</script>

<style lang="less" scoped>
.userManagement-container {
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 20px;
    span {
      display: flex;
      align-items: center;
      &::before {
        content: ' ';
        display: inline-block;
        width: 4px;
        height: 16px;
        background-image: linear-gradient(90deg, rgba(255, 107, 0, 0.3) 0%, rgba(255, 107, 0, 0.2) 100%);
        margin-right: 8px;
        border-radius: 2px;
      }
    }
  }
  .btn /deep/.ant-form-item-label {
    margin-left: 40px;
  }
  /deep/.ant-form-item-children {
    padding-right: 100px;
  }
  .table {
    margin-top: 10px;
  }
  .cardd {
    box-shadow: 5px 5px 5px 0 rgba(250, 201, 91, 0.5);
  }
  .page {
    float: right;
  }
  .foot {
    margin-top: 20px;
  }
  .add {
    position: absolute;
    right: -50px;
  }
  .usernaem {
    width: 100px;
    height: 100px;
    background-color: #0c66ff;
    margin-right: 20px;
    line-height: 100px;
    text-align: center;
    font-size: 50px;
    color: #fff;
    font-weight: 700;
    border-radius: 10px;
  }
  .card {
    display: flex;
    justify-content: flex-start;
  }
  .role {
    height: 130px;
    border-top: 1px dashed #d7d7d7;
    border-bottom: 1px dashed #d7d7d7;
    padding: 20px 0;
    margin-bottom: 10px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }
  .star {
    margin-left: 5px;
    font-size: 16px;
    line-height: 20px;
    vertical-align: middle;
  }
  /deep/.ant-select-selection--multiple {
    border: unset;
    background: #fff;
  }
  .card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    // padding-left: 100px;
    margin-top: 24px;
    .card {
      background: #ffffff;
      border: 1px solid #ffe1cc;
      border-radius: 8px;
      display: flex;
      width: 31%;
      margin-right: 20px;
      margin-bottom: 30px;
      flex-flow: column;
      // min-width: 306px;
      min-height: 170px;
      &.disabled {
        border: 1px solid #ffe1cc;
        .head {
          background-image: linear-gradient(-90deg, rgba(255, 107, 0, 0.09) 1%, rgba(255, 107, 0, 0.06) 100%);
          align-items: center;
          & > span {
            color: #999999 !important;
          }
        }
        .roles {
          .tags {
            .tag {
              background: #fff0e5;
              color: #999999;
            }
          }
        }
      }
      .head {
        padding: 24px 16px;
        border-radius: 8px 8px 0px 0px;
        background-image: linear-gradient(-90deg, rgba(255, 107, 0, 0.3) 1%, rgba(255, 107, 0, 0.2) 100%);
        display: flex;
        justify-content: space-between;
        position: relative;
        &:hover {
          .button {
            display: block;
            cursor: pointer;
          }
        }
        .button {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 0px 7px 0px 8px;
          padding: 2px 16px;
          position: absolute;
          right: 0;
          top: 0;
          display: none;
          .ant-divider {
            color: rgba(255, 107, 0, 0.6);
          }
        }
        span {
          &:first-child {
            font-size: 20px;
            color: #262626;
            font-weight: 600;
          }
          &:last-child {
            font-size: 16px;
            color: rgba(38, 38, 38, 0.8);
          }
        }
      }
      .content-position {
        padding-top: 0px !important;
      }
      .content {
        padding: 16px 18px 20px 18px;
        .tags {
          margin-top: 8px;
          .tag {
            background: rgba(255, 107, 0, 0.8);
            border-radius: 4px;
            min-width: 84px;
            max-width: 30%;
            height: 32px;
            padding: 5px 10px;
            display: inline-block;
            margin-right: 20px;
            // line-height: 32px;
            font-size: 14px;
            color: #ffffff;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
            text-align: center;
            &.tag1 {
              background: rgba(255, 107, 0, 0.1);
              border-radius: 4px;
              color: #ff6b00;
            }
          }
        }
      }
    }
  }
}
.card {
  position: relative;
}
.card-img {
  width: 82px;
  right: 20px;
  position: absolute;
  top: 30px;
}
.more {
  text-align: center;
  .more-span {
    border: 1px solid #eee;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 30px;
  }
}
// /deep/ .ant-table-fixed {
//   width: 150px !important;
// }
</style>
