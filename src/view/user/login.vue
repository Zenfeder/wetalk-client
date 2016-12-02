<!-- 登录 -->
<template>
    <div style="height:100% !important;">
        <div class="login-box">
            <div class="login-logo">
                <h1 class="text-purple"><i class="fa fa-comments"></i> WeTalk</h1>
            </div>
            
            <div class="login-box-body">
                <p class="login-box-msg text-purple"><i class="fa fa-user"></i> 用户登录</p>

                <div>
                    <div class="form-group has-feedback">
                        <input type="text" name="username" class="form-control" placeholder="用户名或邮箱" v-model="userInfo.emailOrUsername">
                        <span class="fa fa-user form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="password" name="password" class="form-control" placeholder="密码" v-model="userInfo.password" @keyup.enter='login'>
                        <span class="fa fa-lock form-control-feedback"></span>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <button  class="btn bg-purple btn-block btn-flat" @click="login" :disabled="!userInfo.emailOrUsername.trim()||!userInfo.password.trim()"><i class="fa fa-sign-in"></i> 登录</button>
                        </div>
                    </div>
                </div>
                
                <small class="text-purple">还没账号？<router-link :to="{name: 'regist'}">马上注册</router-link></small>
            </div>
           
        </div>
    </div>
</template>

<script>
import api from '../../common/api'
import http from '../../common/http'
import {hex_md5} from '../../common/md5'
import {setCookie, getCookie} from '../../common/cookie'

export default {
    mounted () {
        if(getCookie('userId')){
            this.$router.push({name: 'discover'});
        }
    },
    data () {
        return {
            userInfo: {
                emailOrUsername: '',
                password: ''
            }
        }
    },
    methods: {
        login () {
            const _self = this;

            if(!_self.userInfo.emailOrUsername.trim()){
                layer.msg("请输入用户名或邮箱", {
                    time: 1500
                });
                return;
            }
            if(!_self.userInfo.password.trim()){
                layer.msg("请输入密码", {
                    time: 1500
                });
                return;
            }

            http({
                url: api.login,
                type: 'post',
                data: {
                    emailOrUsername: _self.userInfo.emailOrUsername.trim(),
                    password: hex_md5(_self.userInfo.password)
                },
                success (res) {
                    if(getCookie('userId')){
                        _self.$router.push({name: 'discover'});
                    }
                },
                fail (res){
                    layer.msg(res.errorMsg, {
                        time: 1500
                    });
                }
            });
        }
    }
}
</script>
