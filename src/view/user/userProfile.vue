<template>
    <div class="content-wrapper">
        <!-- Main content -->
        <section class="content clearfix">
            <div class="col-md-3">
                <div class="box box-widget widget-user">
                    <div class="widget-user-header bg-black text-center" :style="'background:url('+userProfile.cover +') center center;'">
                    </div>
                    <div class="widget-user-image">
                        <img class="img-circle" :src="userProfile.avatar" alt="User Avatar">
                    </div>
                    <div class="box-footer">
                        <div class="row">
                            <div class="col-md-12 text-center margin-bottom">
                                <h3 style="margin-top:5px;">
                                    <b  v-text="userProfile.username"></b>
                                </h3>
                                <small v-text="userProfile.signature||'这个人很懒，什么都没说'"></small>
                            </div>

                            <div class="col-md-12">
                                <ul class="list-group list-group-unbordered">
                                    <li class="list-group-item pointer" @click="goFollowerList(userProfile.userId, userProfile.username)">
                                       <b>粉丝</b> 
                                       <a class="pull-right" v-text="userProfile.followerNum"></a>
                                    </li>
                                    <li class="list-group-item pointer" @click="goFollowingList(userProfile.userId, userProfile.username)">
                                        <b>关注</b> 
                                        <a class="pull-right" v-text="userProfile.followingNum"></a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-12" v-if="!isMyself">
                                <button v-if="!userProfile.followed" class="btn bg-purple btn-block" @click="follow">
                                    <b>关注Ta</b>
                                </button>
                                <button v-if="userProfile.followed" class="btn btn-default btn-block" @click="unfollow">
                                    <b>取消关注</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
              <div class="nav-tabs-custom">
                <ul class="nav nav-tabs">
                    <li class="active">
                        <a v-if="isMyself" href="#post" data-toggle="tab">我的文章</a>
                        <a v-if="!isMyself" href="#post" data-toggle="tab">Ta的文章</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="active tab-pane" id="post">
                        <div class="row">
                            <div class="col-md-12">
                                <template v-if="posts.length<=0">
                                    <h3 class="text-center text-gray">这个人啥也没写</h3>
                                </template>
                                <template v-if="posts.length>0">
                                    <!-- Post -->
                                    <div class="post" v-for="post in posts">
                                        <div class="user-block">
                                            <img class="img-circle img-bordered-sm" :src="post.avatar" alt="user image">
                                            <span class="username">
                                                <span class="no-margin"><b v-text="post.username"></b></span>
                                            </span>
                                            <span class="description">发布于- {{post.created_at | formatDate}}</span>
                                        </div>
                                        <!-- /.user-block -->
                                        <p v-html="post.content"></p>
                                        <div class="row margin-bottom" v-show="post.photos&&post.photos.length>0">
                                            <div class="col-md-2 col-xs-4 margin-bottom" v-for="photo in post.photos">
                                                <img :src="photo" style="width:100%;"/>
                                            </div>
                                        </div>
                                        <ul class="list-inline">
                                            <li>
                                                <a href="javascript:void(0);" class="link-black text-sm" v-show="!post.approved" @click="approve(post)">
                                                    <i class="fa fa-thumbs-o-up margin-r-5"></i> 赞(<small v-text="post.approves.length"></small>)
                                                </a>

                                                <a href="javascript:void(0);" class="link-black text-sm" v-show="post.approved" @click="disapprove(post)">
                                                    <i class="fa fa-thumbs-up margin-r-5"></i> 取消(<small v-text="post.approves.length"></small>)
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0);" class="link-black text-sm" v-show="!post.collected" @click="collect(post)">
                                                    <i class="fa fa-bookmark-o margin-r-5"></i> 收藏(<small v-text="post.collects.length"></small>)
                                                </a>
                                                <a href="javascript:void(0);" class="link-black text-sm" v-show="post.collected" @click="discollect(post)">
                                                    <i class="fa fa-bookmark margin-r-5"></i> 不收藏(<small v-text="post.collects.length"></small>)
                                                </a>
                                            </li>
                                            <li class="pull-right">
                                                <a href="javascript:void(0);" class="link-black text-sm" v-if="post.comments.length<1">
                                                    <i class="fa fa-comments-o margin-r-5"></i> 评论(<small v-text="post.comments.length"></small>)
                                                </a>
                                                <a href="javascript:void(0);" class="link-black text-sm" v-if="post.comments.length>0" @click="toggleComments(post)">
                                                    <i class="fa fa-comments-o margin-r-5"></i> <span v-show="!post.showComments">展开</span><span v-show="post.showComments">收起</span>评论(<small v-text="post.comments.length"></small>)
                                                </a>
                                            </li>
                                        </ul>

                                        <div class="box-footer box-comments" style="margin-bottom:5px;" v-show="post.showComments&&post.comments.length>0">
                                            <div class="box-comment" v-for="(comment, commentIndex) in post.comments">
                                                <img class="img-circle img-sm pointer" :src="comment.avatar" alt="User Image" @click="goUserProfile(comment.userId)">

                                                <div class="comment-text">
                                                    <span class="username">
                                                        <small class="pointer" v-text="comment.username" @click="goUserProfile(comment.userId)"></small>
                                                        <span class="text-muted pull-right">{{comment.created_at | formatDate}}</span>
                                                    </span>
                                                    <span v-text="comment.content"></span>
                                                </div>

                                                <a v-if="comment.userId==userIdLogin" href="javascript:void(0);" class="pull-right text-gray"
                                                @click="delComment(post, commentIndex)">
                                                    <i class="fa fa-trash" data-toggle="tooltip" data-placement="left" data-original-title="删除这条评论"></i>
                                                </a>
                                            </div>
                                            <!-- /.box-comment -->
                                        </div>

                                        <input class="form-control input-sm" type="text" v-model="post.comment" placeholder="发表评论(Enter提交)..." @keyup.enter="comment(post)">
                                    </div>
                                    <!-- /.post -->
                                </template>
                            </div>
                        </div>
                    </div>
              </div>
            </div>
        </section>
    </div>
</template>

<script>
import initStyle from '../../common/initStyle'

import {getCookie} from '../../common/cookie'
import api from '../../common/api'
import http from '../../common/http'

export default {
    mounted () {
        this.$nextTick(() => {
            initStyle();

            if(this.userId){
                this.fetchUserInfoLog(()=>{
                    this.fetchUserInfo();
                    this.fetchPostList();
                });
            }
        });
    },
    data () {
        return {
            // 当前登录用户的名称、头像
            usernameLogin: '',
            avatarLogin: '',

            // 当先主页显示的用户简介
            userProfile: {},
            posts: []
        }
    },
    computed: {
        userId () {
            return this.$route.params.userId;
        },
        userIdLogin () {
            return getCookie("userId").split("%22")[1];
        },
        isMyself () {
            return (this.$route.params.userId==getCookie("userId").split("%22")[1])?true:false;
        },
        profile () {
            return this.$store.state.user.profile;
        }
    },
    methods: {
        fetchUserInfoLog (callback) {
            const _self = this;
            http({
                url: api.getUserInfo,
                type: 'get',
                data: {
                    userId: getCookie('userId'),
                },
                success(res) {
                    _self.usernameLogin = res.data.username;
                    _self.avatarLogin = res.data.avatar;
                    callback();
                }
            });
        },
        fetchUserInfo () {
            const _self = this;
            
            http({
                url: api.getUserInfoById,
                type: 'post',
                data: {
                    'userId': _self.userId,
                },
                success (res) {
                    _self.userProfile = res.data;
                }
            })
        },
        follow () {
            const _self = this;
            
            http({
                url: api.follow,
                type: 'post',
                data: {
                    'userId': _self.userId,
                },
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        _self.fetchUserInfo();
                        _self.$store.dispatch('getProfileAsync');
                    });
                }
            });
        },
        unfollow () {
            const _self = this;
            
            http({
                url: api.unfollow,
                type: 'post',
                data: {
                    'userId': _self.userId,
                },
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        _self.fetchUserInfo();
                        _self.$store.dispatch('getProfileAsync');
                    });
                }
            });
        },
        fetchPostList () {
            const _self = this;

            http({
                url: api.postListByUserId,
                type: 'post',
                data: {
                    userId: _self.userId
                },
                success (res) {
                    _self.initPostList(res.data);
                }
            });
        },
        initPostList (protoList) {
            const _self = this;

            _self.posts = [];

            for(let i=0;i<protoList.length;i++){
                let item = protoList[i];

                var flag_approved = false;
                for(let j=0;j<item.approves.length;j++){
                    if(item.approves[j].username === _self.usernameLogin){
                        flag_approved = true;
                        break;
                    }
                }
                item.approved = flag_approved;

                var flag_collected = false;
                for(let k=0;k<item.collects.length;k++){
                    if(item.collects[k].username === _self.usernameLogin){
                        flag_collected = true;
                        break;
                    }
                }
                item.collected = flag_collected;
                item.showComments = false;
                item.comment = '';

                _self.posts.push(item);
            }
        },

        toggleComments (post) {
            post.showComments = !post.showComments;
        },

        approve (post) {
            const _self = this;

            http({
                url: api.postApprove,
                type: 'post',
                data: {
                    postId: post._id,
                    username: _self.usernameLogin,
                    avatar: _self.avatarLogin
                },
                hasLoading: false,
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        post.approves.push({
                            userId: _self.userIdLogin,
                            username: _self.usernameLogin,
                            avatar: _self.avatarLogin
                        });
                        post.approved = true;
                    });
                }
            });
        },
        disapprove (post) {
            const _self = this;

            http({
                url: api.postDisapprove,
                type: 'post',
                data: {
                    postId: post._id
                },
                hasLoading: false,
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        for(let i=0;i<post.approves.length;i++){
                            if(_self.usernameLogin===post.approves[i].username){
                                post.approves.splice(i,1);
                                post.approved = false;
                                break;
                            }
                        }
                    });
                }
            });
        },
        collect (post) {
            const _self = this;

            http({
                url: api.postCollect,
                type: 'post',
                data: {
                    postId: post._id,
                    username: _self.usernameLogin,
                    avatar: _self.avatarLogin
                },
                hasLoading: false,
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        post.collects.push({
                            userId: _self.userIdLogin,
                            username: _self.usernameLogin,
                            avatar: _self.avatarLogin
                        });

                        post.collected = true;
                    });
                }
            });
        },
        discollect (post) {
            const _self = this;

            http({
                url: api.postDiscollect,
                type: 'post',
                data: {
                    postId: post._id
                },
                hasLoading: false,
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        for(let i=0;i<post.collects.length;i++){
                            if(_self.usernameLogin===post.collects[i].username){
                                post.collects.splice(i,1);
                                post.collected = false;
                                break;
                            }
                        }
                    });
                }
            });
        },
        comment (post) {
            const _self = this;

            const formData = {
                postId: post._id,
                comment: {
                    username: _self.usernameLogin,
                    avatar: _self.avatarLogin,
                    content : post.comment,
                }
            };
            
            http({
                url: api.postComment,
                type: 'post',
                data: formData,
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        post.comment = '';
                        post.showComments = true;
                        post.comments.push({
                            'commentId':res.data.commentId,
                            'userId': res.data.userId,
                            'username': res.data.username,
                            'avatar': res.data.avatar,
                            'content': res.data.content,
                            'created_at': res.data.created_at
                        });
                    });
                }
            });
        },
        delComment (post, commentIndex) {
            const _self = this;

            var layerConfirm = layer.confirm("确定删除吗？", {
                btn: ['是', '否'],
                title: false,
                closeBtn: 0,
                shadeClose: true
            }, () => {
                layer.close(layerConfirm);
                
                http({
                    url: api.postDelComment,
                    type: 'post',
                    data: {
                        postId: post._id,
                        commentId: post.comments[commentIndex].commentId,
                        userId: post.comments[commentIndex].userId
                    },
                    success (res) {
                        layer.msg(res.errorMsg, {
                            time: 1000
                        }, () => {
                            post.comments.splice(commentIndex, 1);
                        });
                    }
                })
            })
        },

        goUserProfile (userId) {
            this.$router.push({name: 'userProfile', params: {userId: userId}});
        },
        goFollowerList (userId, username) {
            this.$router.push({name: 'followerList', params: {userId: userId, username: username}});
        },
        goFollowingList (userId, username) {
            this.$router.push({name: 'followingList', params: {userId: userId, username: username}});
        }
    },
    watch: {
        userId () {
            this.fetchUserInfo();
            this.fetchPostList();
        }
    }
}
</script>

<style>
    .nav-tabs-custom>.nav-tabs>li.active{
        border-top-color: #605ca8 !important;
    }
</style>