import {host} from '../../config/host'

export default {
	host: host,
	
    regist: host + 'user/regist', // 注册 post
    sendVerifyCode: host + 'user/sendVerifyCode', // 发送验证码 post
    verify: host + 'user/verify', // 验证 post
    login: host + 'user/login', // 登录认证 post
    logout: host + 'user/logout', // 退出 post
    setting: host + 'user/setting', // 修改个人信息 post
    getUserInfo: host + 'user/profile', // 获取当前登录用户的基本信息 get
    getUserInfoById: host + 'user/profile/by/userId', // 根据userId获取用户个人简介 post
    follow: host + 'user/follow', // 关注某人
    unfollow: host + 'user/unfollow', // 关注某人
    getFollowingList: host + 'user/getFollowingList', // 获取关注列表
    getFollowerList: host + 'user/getFollowerList', // 获取粉丝列表

    postPublish: host + 'post/publish', //  发布文章 post
    postAllList: host + 'post/all/list',// 获取所有文章列表 post
    postFollowingList: host + 'post/following/list',// 获取关注的人以及自己的文章列表 post
    postListByUserId: host + 'post/list/by/userId', // 按userId获取文章列表 post
    postApprove: host + 'post/approve',// 点赞 post
    postDisapprove: host + 'post/disapprove',// 取消点赞 post
    postCollect: host + 'post/collect',// 收藏 post
    postDiscollect: host + 'post/discollect',// 取消收藏 post
    postComment: host + 'post/comment', // 评论文章 post
    postDelComment: host + 'post/delComment', // 删除评论 post

    postCollectedList: host + 'post/collected/list', // 收藏列表 post
    postMyList: host + 'post/my/list', // 我的文章列表 post
    postRemove: host + 'post/remove', // 删除文章 post

    searchUserListByName: host + 'search/userListByName', // 按名称搜索用户列表 post
    
    fileUpload: host + 'upload', // 文件上传 post
}
