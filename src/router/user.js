let routes = [
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
                meta: { auth: true },
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
];

export default routes;