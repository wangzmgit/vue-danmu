let routes = [
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
];

export default routes;