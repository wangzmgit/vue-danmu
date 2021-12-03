let routes = [
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
];

export default routes;