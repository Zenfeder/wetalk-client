<template>
    <div class="content-wrapper">
        <!-- Content Header -->
        <section class="content-header">
            <h4>
                搜索"<span class="text-green" v-text="searchkey"></span>"的结果
            </h4>
        </section>

        <!-- Main content -->
        <section class="content clearfix">
            <div class="col-md-12 no-padding">
                <div class="box box-default">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{userList.length}}位用戶符合搜索条件</h3>
                    </div>
                    
                    <div class="box-body no-padding">
                        <h3 v-if="userList.length==0" class="text-center text-gray">没有搜索符合条件的结果</h3>
                        <ul v-if="userList.length>0" class="users-list clearfix">
                            <li v-for="item in userList" @click="goUserProfile(item.userId)" class="pointer">
                                <img :src="item.avatar" alt="头像" class="profile-user-img img-responsive img-circle">
                                <p class="users-list-name" v-text="item.username"></p>
                            </li>
                        </ul>
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

export default {
    mounted () {
        this.$nextTick(() => {
            initStyle();

            if(this.searchkey){
                this.fetchUserList();
            }
        });
    },
    data () {
        return {
            userList: []
        }
    },
    computed: {
        searchkey () {
            return this.$route.params.searchkey;
        }
    },
    methods: {
        fetchUserList () {
            const _self = this;
            
            http({
                url: api.searchUserListByName,
                type: 'post',
                data: {
                    'username': _self.searchkey,
                },
                success (res) {
                    _self.userList = res.data;
                }
            });
        },
        goUserProfile (userId) {
            this.$router.push({name: 'userProfile', params: {userId: userId}});
        },
    },
    watch: {
        searchkey () {
            this.fetchUserList();
        }
    }
}
</script>

<style>
    @media (min-width: 992px){
        .users-list li{
            width:20%;
            text-align:center;
        }
        .users-list li img{
            width: 60% !important;
        }
    }
    @media (min-width: 1200px){
        .users-list li{
            width:20%;
            text-align:center;
        }
        .users-list li img{
            width: 50% !important;
        }
    }
</style>