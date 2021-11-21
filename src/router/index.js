import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cookies from "js-cookie";

Vue.use(VueRouter)

//解决重复点击报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [{
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
{
    path: '/space',
    name: 'Space',
    meta: { auth: true },
    component: () =>
        import('../views/space/Space.vue'),
    redirect: '/space/home',
    children: [
        {
            path: '/space/home',
            name: 'SpaceHome',
            meta: { auth: true },
            component: () =>
                import('../views/space/SpaceHome.vue'),
        },
        {
            path: '/space/collect',
            name: 'Collect',
            meta: { auth: true },
            component: () =>
                import('../views/space/Collect.vue'),
        },
        {
            path: '/space/messages',
            name: 'Messages',
            meta: { auth: true },
            component: () =>
                import('../views/space/messages/Messages.vue'),
            redirect: '/space/messages/announce',
            children: [
                {
                    path: '/space/messages/announce',
                    name: 'Announce',
                    meta: { auth: true },
                    component: () =>
                        import('../views/space/messages/Announce.vue'),
                },
                {
                    path: '/space/messages/message',
                    name: 'UserMessage',
                    meta: { auth: true },
                    component: () =>
                        import('../views/space/messages/UserMessage.vue'),
                },
            ]
        },
        {
            path: '/space/setting',
            name: 'Setting',
            meta: { auth: true },
            component: () =>
                import('../views/space/setting/Setting.vue'),
            redirect: '/space/setting/info',
            children: [
                {
                    path: '/space/setting/info',
                    name: 'SettingInfo',
                    meta: { auth: true },
                    component: () =>
                        import('../views/space/setting/Info.vue'),
                },
                {
                    path: '/space/setting/security',
                    name: 'SettingSecurity',
                    meta: { auth: true },
                    component: () =>
                        import('../views/space/setting/Security.vue'),
                },
            ]
        },
        {
            path: '/space/following',
            name: 'Following',
            meta: { auth: true },
            component: () =>
                import('../views/space/Follow.vue'),
        },
        {
            path: '/space/followers',
            name: 'Followers',
            meta: { auth: true },
            component: () =>
                import('../views/space/Follow.vue'),
        },
    ]
},
{
    path: '/user/:uid',
    name: 'User',
    component: () =>
        import('../views/user/User.vue'),
    redirect: '/user/:uid/video',
    children: [
        {
            path: '/user/:uid/video',
            name: 'UserVideo',
            component: () =>
                import('../views/user/Video.vue'),
        },
        {
            path: '/user/:uid/following',
            name: 'UserFollowing',
            component: () =>
                import('../views/user/UserFollow.vue'),
        },
        {
            path: '/user/:uid/followers',
            name: 'UserFollowers',
            meta: { auth: true },
            component: () =>
                import('../views/user/UserFollow.vue'),
        },
    ]
},
{
    path: '/admin/login',
    name: 'AdminLogin',
    component: () =>
        import('../views/admin/Login.vue'),
},
/**关于 */
{

    path: '/about/update',
    name: 'Update',
    component: () =>
        import('../views/about/Update.vue'),

},
{
    path: '/admin',
    name: 'Admin',
    component: () =>
        import('../views/admin/AdminHome.vue'),
    redirect: '/admin/info',
    children: [
        {
            path: '/admin/info',
            name: 'AdminInfo',
            component: () =>
                import('../views/admin/AdminInfo.vue'),
        },
        {
            path: '/admin/user',
            name: 'AdminUser',
            component: () =>
                import('../views/admin/AdminUser.vue'),
        },
        {
            path: '/admin/video',
            name: 'AdminVideo',
            component: () =>
                import('../views/admin/AdminVideo.vue'),
        },
        {
            path: '/admin/review',
            name: 'AdminReview',
            component: () =>
                import('../views/admin/AdminReview.vue'),
        },
        {
            path: '/admin/announce',
            name: 'AdminAnnounce',
            component: () =>
                import('../views/admin/AdminAnnounce.vue'),
        },
        {
            path: '/admin/carousel',
            name: 'AdminCarousel',
            component: () =>
                import('../views/admin/AdminCarousel.vue'),
        },
    ]
},
{
    path: '/upload',
    name: 'Upload',
    meta: { auth: true },
    component: () =>
        import('../views/upload/Upload.vue'),
    redirect: '/upload/video',
    children: [
        {
            path: '/upload/video/:vid?',
            name: 'UploadVideoHome',
            meta: { auth: true },
            component: () =>
                import('../views/upload/UploadVideoHome.vue'),
        },
        {
            path: '/upload/collection/caeate/:id?',
            name: 'CreateCollection',
            meta: { auth: true },
            component: () =>
                import('../views/upload/CreateCollection.vue'),
        },
        {
            path: '/upload/collection/view',
            name: 'ViewCollection',
            meta: { auth: true },
            component: () =>
                import('../views/upload/ViewCollection.vue'),
        },
        {
            path: '/upload/collection/content/:id',
            name: 'CollectionContent',
            meta: { auth: true },
            component: () =>
                import('../views/upload/CollectionContent.vue'),
        },
    ]
},
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

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    //是否需要登录
    if (to.meta.auth) {
        //是否存在token
        if (Cookies.get('token')) {
            next();
        } else {
            router.push({ name: 'Login' });
        }
    } else {
        next();
    }
})

export default router