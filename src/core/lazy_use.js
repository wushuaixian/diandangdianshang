import Vue from 'vue'

// base library
import {
  ConfigProvider,
  Layout,
  Input,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Select,
  Card,
  Form,
  FormModel,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Icon,
  Badge,
  Popover,
  Dropdown,
  List,
  Avatar,
  Breadcrumb,
  Steps,
  Spin,
  Menu,
  Drawer,
  Tooltip,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Upload,
  Progress,
  Skeleton,
  Popconfirm,
  PageHeader,
  Result,
  Statistic,
  Descriptions,
  Space,
  message,
  notification,
  Pagination,
  Tree,
  Transfer,
  Empty,
  Affix,
  Timeline,
  Cascader,
  Rate,
  Anchor
} from 'ant-design-vue'

// ext library
import VueCropper from 'vue-cropper'
import infiniteScroll from 'vue-infinite-scroll'
import Dialog from '@/components/Dialog'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'
import PermissionHelper from '@/core/permission/permission'
import './directives/action'
import './directives/platform'
// import STable from '@/components/_global/STable'
// import DSelect from '@/components/_global/DSelect'
// import DSlotFileds from '@/components/_global/DSlotFileds'
// import FixedBox from '@/components/_global/FixedBox'
// import HeaderTitle from '@/components/_global/HeaderTitle'
// import SImport from '@/components/_global/SImport'
// import SUpload from '@/components/_global/SUpload'
// import SUploadFile from '@/components/_global/SUploadFile'
// import TreeSelect from '@/components/_global/TreeSelect'
Vue.use(Anchor)
Vue.use(Affix)
Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Breadcrumb)
Vue.use(Steps)
Vue.use(Spin)
Vue.use(Menu)
Vue.use(Drawer)
Vue.use(Tooltip)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Skeleton)
Vue.use(Popconfirm)
Vue.use(PageHeader)
Vue.use(Result)
Vue.use(Statistic)
Vue.use(Descriptions)
Vue.use(Space)
Vue.use(Pagination)
Vue.use(Tree)
Vue.use(Transfer)
Vue.use(Empty)
Vue.use(Timeline)
Vue.use(Cascader)
Vue.use(Rate)

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning

Vue.use(Dialog) // this.$dialog func
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(PermissionHelper)
Vue.use(VueCropper)
Vue.use(infiniteScroll)
// Vue.component(STable.name, STable)
// Vue.component(DSelect.name, DSelect)
// Vue.component(DSlotFileds.name, DSlotFileds)
// Vue.component(FixedBox.name, FixedBox)
// Vue.component(HeaderTitle.name, HeaderTitle)
// Vue.component(SImport.name, SImport)
// Vue.component(SUpload.name, SUpload)
// Vue.component(SUploadFile.name, SUploadFile)
// Vue.component(TreeSelect.name, TreeSelect)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] NOTICE: Antd use lazy-load.')
