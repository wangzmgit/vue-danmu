import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import storage from "@/utils/stored-data.js";
import userRoutes from "./user.js";
import spaceRoutes from "./space.js";
import adminRoutes from "./admin.js";
import uploadRoutes from "./upload.js";

Vue.use(VueRouter);

//解决重复点击报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const baseRoutes = [{
    path: '/',
    name: 'Home',
    component: Home
},
{
    path: '/login',
    name: 'Login',
    component: () =>
        import('../views/Login.vue')
},
{
    path: '/register',
    name: 'Register',
    component: () =>
        import('../views/Register.vue')
},
/**关于 */
{
    path: '/about/update',
    name: 'Update',
    component: () =>
        import('../views/about/Update.vue'),
},
{
    path: '/about/opinion',
    name: 'Opinion',
    component: () =>
        import('../views/about/Opinion.vue'),
},
/**视频 */
{
    path: '/video/VID:vid',
    name: 'Video',
    component: () =>
        import('../views/Video.vue')
},
{
    //合集播放页面
    path: '/collection/:cid',
    name: 'Collection',
    component: () =>
        import('../views/Collection.vue')
},
{
    path: '/search/:keywords',
    name: 'Search',
    component: () =>
        import('../views/Search.vue')
},
{
    path: '/video/list',
    name: 'VideoList',
    component: () =>
        import('../views/VideoList.vue')
},
{
    path: '/404',
    name: '404',
    component: () =>
        import('../views/result/404.vue')
},
{
    path: '/500',
    name: '500',
    component: () =>
        import('../views/result/500.vue')
},
{
    path: '*',
    redirect: {
        name: "404"
    }
}
]

const routes = baseRoutes.concat(userRoutes, spaceRoutes, adminRoutes, uploadRoutes);

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    //是否需要登录
    if (to.meta.auth) {
        //是否存在token
        if (storage.get('token')) {
            next();
        } else {
            router.push({ name: 'Login' });
        }
    } else if (to.meta.admin) {
        if (storage.get('admin')) {
            next();
        } else {
            router.push({ name: 'AdminLogin' });
        }
    } else {
        next();
    }
})

export default router