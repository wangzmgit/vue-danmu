let routes = [
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () =>
            import('../views/admin/Login.vue'),
    },
    {
        path: '/admin',
        name: 'Admin',
        meta: { admin: true },
        component: () =>
            import('../views/admin/AdminHome.vue'),
        redirect: '/admin/dashboard',
        children: [
            {
                path: '/admin/dashboard',
                name: 'AdminDashboard',
                meta: { admin: true },
                component: () =>
                    import('../views/admin/AdminDashboard.vue'),
            },
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
            {
                path: '/admin/partition',
                name: 'AdminPartition',
                component: () =>
                    import('../views/admin/AdminPartition.vue'),
            },
            {
                path: '/admin/opinion',
                name: 'AdminOpinion',
                component: () =>
                    import('../views/admin/AdminOpinion.vue'),
            },
        ]
    },
];

export default routes;