import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Tooltip,
  Menu,
  Submenu,
  MenuItem,
  Table,
  TableColumn,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Select,
  Option,
  MessageBox,
  Dialog,
  Cascader,
  Upload,
  Image
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Tooltip)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Cascader)
Vue.use(Upload)
Vue.use(Image)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
