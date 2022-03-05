import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import config from './config';
import VueLazyload from 'vue-lazyload';
import "./assets/iconfont/iconfont.css";
import {
    Button,
    Affix,
    Avatar,
    Carousel,
    Divider,
    DatePicker,
    Menu,
    Modal,
    Input,
    Icon,
    Pagination,
    Upload,
    Steps,
    Switch,
    FormModel,
    Radio,
    message,
    notification,
    Skeleton,
    Result,
    Select,
    Progress,
    Timeline
} from "ant-design-vue";

Vue.use(Menu);
Vue.use(VueLazyload);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('./assets/error.png'),
    loading: require('./assets/loading.gif'),
    attempt: 1
})
Vue.prototype.$success = Modal.success;
Vue.prototype.$message = message;
Vue.prototype.$config = config;
Vue.prototype.$notification = notification;

Vue.component(Button.name, Button);
Vue.component(Affix.name, Affix);
Vue.component(Avatar.name, Avatar);
Vue.component(Carousel.name, Carousel);
Vue.component(Divider.name, Divider);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Modal.name, Modal);
Vue.component(Input.name, Input);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Icon.name, Icon);
Vue.component(Pagination.name, Pagination);
Vue.component(Upload.name, Upload);
Vue.component(Upload.Dragger.name, Upload.Dragger);
Vue.component(Steps.name, Steps);
Vue.component(Steps.Step.name, Steps.Step);
Vue.component(Switch.name, Switch);
Vue.component(FormModel.name, FormModel);
Vue.component(FormModel.Item.name, FormModel.Item);
Vue.component(Radio.name, Radio);
Vue.component(Radio.Group.name, Radio.Group);
Vue.component(Radio.Button.name, Radio.Button);
Vue.component(Skeleton.name, Skeleton);
Vue.component(Result.name, Result);
Vue.component(Select.name, Select);
Vue.component(Select.Option.name, Select.Option);
Vue.component(Progress.name, Progress);
Vue.component(Timeline.name, Timeline);
Vue.component(Timeline.Item.name, Timeline.Item);

Vue.config.productionTip = false;

Vue.directive('title', {
    inserted: function (el) {
        document.title = el.dataset.title
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

console.log(
    `%c 版本号：4.4.2 %c 适用后端版本:4.4.2 %c`,
    'background:rgb(244,167,89) ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:rgb(30,152,255) ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent'
)

var content = `在这里看源码，不如直接加入开发
Gitee:  https://gitee.com/wzmgit/vue-danmu
Github:  https://github.com/wangzmgit/vue-danmu
`
console.log(content);