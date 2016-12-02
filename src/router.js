import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [{
            path: '/index',
            name: 'index',
            component: require('./view/index'),
            children: [{
                path: 'discover',
                name: 'discover',
                component: require('./view/post/discover') // 新发现
            }, {
                path: 'publish',
                name: 'publish',
                component: require('./view/post/publish') // 发文章
            }, {
                path: 'collection',
                name: 'collection',
                component: require('./view/post/collection') // 收藏夹
            }, {
                path: 'myPost',
                name: 'myPost',
                component: require('./view/post/myPost') // 我的文章
            }, {
                path: 'setting',
                name: 'setting',
                component: require('./view/user/setting') // 个人信息设置
            }, {
                path: 'user/profile/:userId',
                name: 'userProfile',
                component: require('./view/user/userProfile') //  用户主页
            }, {
                path: 'user/follower/:userId/:username',
                name: 'followerList',
                component: require('./view/user/followerList') // 粉丝列表页
            }, {
                path: 'user/following/:userId/:username',
                name: 'followingList',
                component: require('./view/user/followingList') // 关注列表页
            }, {
                path: 'search/userList/:searchkey',
                name: 'seacrhUserListByName',
                component: require('./view/search/userList') //  按用户名称搜索用户列表页
            }]
        }, {
            path: '/login',
            name: 'login',
            component: resolve => require(['./view/user/login'], resolve) // 登录页
        }, {
            path: '/regist',
            name: 'regist',
            component: resolve => require(['./view/user/regist'], resolve) // 注册页
        },{
            path: '/index',
            redirect: {
                name: 'discover' // 内容页默认展示"新发现"页
            }
        }, {
            path: '*',
            redirect: {
                name: 'login' // 默认所有都跳转到登录页
            }
        }
    ]
})
