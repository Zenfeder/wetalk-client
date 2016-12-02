<template>
    <div class="content-wrapper">
        <!-- Content Header -->
        <section class="content-header"></section>

        <!-- Main content -->
        <section class="content clearfix">
            <div class="row">
                <div class="col-md-12">
                    <template v-if="posts.length<=0">
                        <h3 class="text-center text-gray">客官, 你啥也没写啊</h3>
                    </template>
                    <div class="box box-default" v-if="posts.length>0">
                        <div class="box-body">
                            <!-- Post -->
                            <div class="post" v-for="(post,postIndex) in posts">
                                <div class="user-block">
                                    <img class="img-circle img-bordered-sm pointer" :src="post.avatar" alt="user image"  @click="goUserProfile(post.userId)">
                                    <span class="username">
                                        <span class="no-margin pointer" @click="goUserProfile(post.userId)"><b v-text="post.username"></b></span>
                                        <a href="javascript:void(0);" class="pull-right btn-box-tool" data-toggle="tooltip" data-placement="left" data-original-title="删除该文章" @click="delPost(post, postIndex)"><i class="fa fa-trash text-gray"></i></a>
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'

import api from '../../common/api'
import http from '../../common/http'
import {getCookie} from '../../common/cookie'
import deepClone from '../../common/deepClone'

export default {
    mounted () {
        this.$nextTick(() => {
            initStyle();
        });

        this.fetchUserProfile(() => {
            this.fetchPostList();
        });
    },
    data () {
        return {
            username: '',
            userId:'',
            avatar: '',
            posts: []
        }
    },
    computed: {
        profile () {
            return this.$store.state.user.profile;
        },
        userIdLogin () {
            return getCookie("userId").split("%22")[1];
        },
    },
    methods: {
        fetchUserProfile (callback) {
            const _self = this;
            http({
                url: api.getUserInfo,
                type: 'get',
                data: {
                    userId: getCookie('userId'),
                },
                success(res) {
                    _self.username = res.data.username;
                    _self.avatar = res.data.avatar;
                    _self.userId = res.data.userId;

                    callback();
                }
            });
        },
        fetchPostList () {
            const _self = this;

            http({
                url: api.postMyList,
                type: 'post',
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
                    if(item.approves[j].username === _self.username){
                        flag_approved = true;
                        break;
                    }
                }
                item.approved = flag_approved;

                var flag_collected = false;
                for(let k=0;k<item.collects.length;k++){
                    if(item.collects[k].username === _self.username){
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
                    username: _self.profile.username,
                    avatar: _self.profile.avatar
                },
                hasLoading: false,
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        post.approves.push({
                            userId: _self.userId,
                            username: _self.username,
                            avatar: _self.avatar
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
                            if(_self.username===post.approves[i].username){
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
                    username: _self.profile.username,
                    avatar: _self.profile.avatar
                },
                hasLoading: false,
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        post.collects.push({
                            userId: _self.userId,
                            username: _self.username,
                            avatar: _self.avatar
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
                            if(_self.username===post.collects[i].username){
                                post.collects.splice(i,1);
                                post.collected = false;
                                break;
                            }
                        }
                    });
                }
            });
        },
        delPost (post, postIndex) {
            const _self = this;

            var layerConfirm = layer.confirm("确定删除吗？", {
                btn: ['是', '否'],
                title: false,
                closeBtn: 0,
                shadeClose: true
            }, () => {
                layer.close(layerConfirm);
                
                http({
                    url: api.postRemove,
                    type: 'post',
                    data: {
                        postId: post._id
                    },
                    hasLoading: false,
                    success (res) {
                        layer.msg(res.errorMsg, {
                            time: 1000
                        }, () => {
                            _self.posts.splice(postIndex, 1);
                        });
                    }
                });
            })
        },
        comment (post) {
            const _self = this;

            const formData = {
                postId: post._id,
                comment: {
                    username : _self.username,
                    avatar : _self.avatar,
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
    }
}
</script>