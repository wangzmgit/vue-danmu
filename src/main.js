import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import router from './router';
import store from './store';
import "./assets/iconfont/iconfont.css"

Vue.config.productionTip = false;

Vue.use(Antd);

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