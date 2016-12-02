<template>
    <header class="main-header">
        <router-link :to="{name: 'discover'}" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini"><small>weTalk</small></span>
            <!-- logo for regular state and mobile devices -->
            <span class="logo-lg"><b>we</b>Talk</span>
        </router-link>
       
        <!-- Header Navbar -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
          
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                          <img :src="profile.avatar" class="user-image" alt="User Image">
                          <span class="hidden-xs" v-text="profile.username"></span>
                        </a>

                        <ul class="dropdown-menu">
                            <div class="box box-widget widget-user" style="margin-bottom:0;">
                                <div @click="goUserProfile(profile.userId)" class="widget-user-header bg-black text-center pointer" :style="'background:url('+profile.cover +') center center;'">
                                    <h3 class="widget-user-username" v-text="profile.username"></h3>
                                    <h5 class="widget-user-desc" v-text="profile.signature||'这个人很懒，什么都没说'"></h5>
                                </div>

                                <div class="widget-user-image pointer" @click="goUserProfile(profile.userId)">
                                    <img class="img-circle" :src="profile.avatar" alt="User Avatar">
                                </div>

                                <div class="box-footer">
                                    <div class="row">
                                        <div class="col-xs-6 border-right">
                                            <div class="description-block pointer" @click="goFollowerList(profile.userId, profile.username)">
                                                <b style="font-size:18px;" v-text="profile.followerNum"></b>&nbsp;粉丝
                                            </div>
                                        </div>

                                        <div class="col-xs-6 border-right">
                                            <div class="description-block pointer"  @click="goFollowingList(profile.userId, profile.username)">
                                                <b style="font-size:18px;" v-text="profile.followingNum"></b>&nbsp;关注
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         
                            <!-- Menu Footer-->
                            <li class="user-footer">
                                <div class="pull-left">
                                    <router-link :to="{name: 'setting'}">
                                        <a href="#" class="btn btn-default btn-sm btn-flat"><i class="fa fa-pencil"></i><span>&nbsp;修改信息</span></a>
                                    </router-link>
                                </div>
                                <div class="pull-right">
                                    <a href="javascript:void(0)" class="btn btn-default btn-sm btn-flat" @click="logout"><i class="fa fa-power-off"></i><span>&nbsp;退出</span></a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import {getCookie, deleteCookie} from '../common/cookie'

// import io from 'socket.io-client'

// const socket = io(api.host)
// socket.on('serverEmit', function (msg) {
//     console.log("服务端来信："+msg);
//     socket.emit('clientEmit', "I'm a message from client.");
// });

export default {
    mounted () {
        if(!getCookie('userId')){
            this.$router.push({name: 'login'});
        }else{
            this.$store.dispatch('getProfileAsync');
        }
    },
    data () {
        return {
            username: ''
        }
    },
    methods: {
        logout () {
            const _self = this;

            var layerConfirm = layer.confirm("确定退出吗？", {
                btn: ['是', '否'],
                title: false,
                closeBtn: 0,
                shadeClose: true
            }, () => {
                layer.close(layerConfirm);
                http({
                    url: api.logout,
                    type: 'post',
                    success (res) {
                        _self.$router.push({name: 'login'});
                    }
                });
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
    computed: {
        profile () {
            return this.$store.state.user.profile;
        }
    },
    // sockets: {
    //     // connect () {
    //     //     console.log('Socket connected!');
    //     // },
    //     // serverEmit () {
    //     //     console.log("服务端来信："+msg);
    //     //     this.$socket.emit('clientEmit', "I'm a message from client.");
    //     // }
    // }
}
</script>