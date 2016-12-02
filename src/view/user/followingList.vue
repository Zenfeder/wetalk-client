<template>
    <div class="content-wrapper">
        <!-- Content Header -->
        <section class="content-header">
            <h1><b v-text="username"></b><small>关注的人</small></h1>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="row">
                <h3 class="text-gray text-center" v-if="followingList.length==0"><b v-text="username"></b> 没有关注任何人</h3>
                <div v-for="(user, index) in followingList" class="col-xs-6 col-md-4 col-lg-3">
                    <div class="box box-widget widget-user">
                        <div class="widget-user-header bg-black" :style="'background:url('+user.cover +') center center;'"></div>

                        <div class="widget-user-image pointer" @click="goUserProfile(user.userId)">
                            <img class="img-circle" :src="user.avatar" alt="User Avatar">
                        </div>

                        <div class="box-footer">
                            <div class="row">
                                <div class="col-sm-12 text-center">
                                    <h4 style="margin:5px auto;">
                                        <b v-text="user.username"></b>
                                    </h4>
                                    <small v-text="user.signature||'这个人很懒，什么都没说'"></small>
                                </div>
                                <div class="col-sm-4 border-right">
                                    <div class="description-block pointer" @click="goFollowingList(user.userId, user.username)">
                                        <h5><b v-text="user.followingNum"></b></h5>
                                        <span class="description-text">关注</span>
                                    </div>
                                </div>
                                <div class="col-sm-4 text-center" style="padding-left:10px;padding-rigth:10px;">
                                    <div class="description-block" v-if="user.userId!=userIdLogin">
                                        <button class="btn btn-default btn-sm" @click="unfollow(user.userId, index)">不关注</button>
                                    </div>
                                </div>
                                <div class="col-sm-4 border-left">
                                    <div class="description-block pointer" @click="goFollowerList(user.userId, user.username)">
                                        <h5><b v-text="user.followerNum"></b></h5>
                                        <span class="description-text">粉丝</span>
                                    </div>
                                </div>
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
                this.getFollowingList();
            }
        });
    },
    data () {
        return {
            followingList: []
        }
    },
    computed: {
        userId () {
            return this.$route.params.userId;
        },
        username () {
             return this.$route.params.username;
        },
        userIdLogin () {
            return getCookie("userId").split("%22")[1];
        }
    },
    methods: {
        getFollowingList () {
            const _self = this;
            
            http({
                url: api.getFollowingList,
                type: 'post',
                data: {
                    'userId': _self.userId,
                },
                success (res) {
                    _self.followingList = res.data;
                }
            });
        },
        unfollow (userId, index) {
            const _self = this;
            
            http({
                url: api.unfollow,
                type: 'post',
                data: {
                    'userId': userId,
                },
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        _self.followingList.splice(index, 1);
                        _self.$store.dispatch('getProfileAsync');
                    });
                }
            });
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
            this.getFollowingList();
        }
    }
}
</script>