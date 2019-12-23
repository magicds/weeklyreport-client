import Vue from 'vue';
import App from './App.vue';
// import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './registerServiceWorker';
import router from './router';
import store from './store';
import fetchData from './util/fetch';
import './style/style.scss';

// Vue.use(ViewUI);

import {
  Button,
  ButtonGroup,
  Table,
  Input,
  InputNumber,
  Form,
  FormItem,
  Select,
  Option,
  OptionGroup,
  DatePicker,
  Tag,
  Icon,
  Card,
  Row,
  Col,
  BackTop,
  Avatar,
  Alert,
  Tree,
  Radio,
  RadioGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Modal,
  Message,
  Notice
} from 'view-design';

Vue.component('Button', Button);
Vue.component('ButtonGroup', ButtonGroup);
Vue.component('Table', Table);
Vue.component('Input', Input);
Vue.component('i-input', Input);
Vue.component('InputNumber', InputNumber);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Select', Select);
Vue.component('i-select', Select);
Vue.component('Option', Option);
Vue.component('i-option', Option);
Vue.component('OptionGroup', OptionGroup);
Vue.component('DatePicker', DatePicker);
Vue.component('Tag', Tag);
Vue.component('Icon', Icon);
Vue.component('Card', Card);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('i-col', Col);
Vue.component('BackTop', BackTop);
Vue.component('Avatar', Avatar);
Vue.component('Alert', Alert);
Vue.component('Tree', Tree);
Vue.component('Radio', Radio);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Modal', Modal);

Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;
Vue.prototype.$Notice = Notice;
window.iViewNotice = Notice;

Vue.config.productionTip = false;
Vue.prototype.$fetch = fetchData;

// 全局过滤器
Vue.filter('toInt', function(v = '') {
  return parseInt(v.toFixed(0), 10);
});
Vue.filter('toPercent', function(v = 0) {
  return (v * 100).toFixed(0) + '%';
});
Vue.filter('shortName', function(v = '') {
  return v.substr(-2);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
