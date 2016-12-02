<!-- 登录 -->
<template>
    <div style="height:100% !important;">
        <div class="register-box">
            <div class="register-logo">
                <h1 class="text-purple"><i class="fa fa-comments"></i> WeTalk</h1>
            </div>
            
            <div class="register-box-body">
                <p class="login-box-msg text-purple"><i class="fa fa-user"></i> 欢迎新用户</p>

                <div>
                    <!-- 第一步 -->
                    <template v-if="currentStep==1">
                        <div class="form-group has-feedback">
                            <input type="email" name="email" class="form-control" placeholder="邮箱" v-model="userInfo.email">
                            <span class="fa fa-envelope form-control-feedback"></span>
                        </div>
                        <div class="form-group has-feedback">
                            <div class="input-group">     
                                <input type="text" class="form-control" placeholder="验证码"  @keyup.enter="nextTep" v-model="userInfo.verifyCode"/>
                                <div class="input-group-btn">
                                    <button class="btn btn-default btn-flat" @click="sendVerifyCode" :disabled="sendCode.status==0">{{sendCode.text}}</button>
                                </div> 
                            </div>
                        </div>

                        <div v-if="errorMsg" class="form-group">
                            <span class="text-red" v-text="errorMsg"></span>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <button  class="btn bg-purple btn-block" @click="nextTep" :disabled="!userInfo.email.trim()||!userInfo.verifyCode.trim()||!isEmail">下一步</button>
                            </div>
                        </div>
                    </template>

                    <!-- 第二步 -->
                    <template v-if="currentStep==2">
                        <div class="form-group has-feedback">
                            <input type="text" name="username" class="form-control" placeholder="昵称" v-model="userInfo.username">
                            <span class="fa fa-user form-control-feedback"></span>
                        </div>
                        <div class="form-group has-feedback">
                            <input type="password" name="password" class="form-control" placeholder="密码" v-model="userInfo.password">
                            <span class="fa fa-lock form-control-feedback"></span>
                        </div>
                        <div class="form-group has-feedback">
                            <input type="password" name="password" class="form-control" placeholder="确认密码" v-model="userInfo.confirm" :disabled="!userInfo.password.trim()" @keyup.enter="regist">
                            <span class="fa fa-lock form-control-feedback"></span>
                        </div>
                        <div v-if="errorMsg" class="form-group">
                            <span class="text-red" v-text="errorMsg"></span>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <button  class="btn bg-purple btn-block" @click="regist" :disabled="!userInfo.username.trim()||!userInfo.password.trim()||!userInfo.confirm.trim()"><i class="fa fa-sign-in"></i> 注册</button>
                            </div>
                        </div>
                    </template>
                </div>

                <small class="text-purple">已有账号？<router-link :to="{name: 'login'}">直接登录</router-link></small>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../common/api'
import http from '../../common/http'
import {hex_md5} from '../../common/md5'
import {getCookie} from '../../common/cookie'
import {isEmail} from '../../common/regexp'

export default {
    data () {
        return {
            userInfo: {
                email: '',
                verifyCode: '',
                username: '',
                password: '' ,
                confirm: ''
            },

            isEmail: false,

            currentStep: 1,

            sendCode: {
                time: 60,
                text: '获取验证码',
                status: 1,
                success: false
            },

            errorMsg: ''
        }
    },
    methods: {
        // 验证码发送倒计时
        countdown () {
            this.sendCode.status = 0;

            const countTime = setInterval(()=>{
                if(this.sendCode.time <= 1){
                    this.sendCode.time= 60;
                    this.sendCode.status = 1;
                    this.sendCode.text = "获取验证码";
                    clearInterval(countTime);

                    return;
                }
                this.sendCode.time--;
                this.sendCode.text = '重新获取('+this.sendCode.time+')';
            }, 1000);
        },
        // 获取验证码
        sendVerifyCode () {
            const _self = this;

            if(!_self.userInfo.email.trim()){
                layer.msg("请输入邮箱地址", {
                    time: 1200
                });
                return;
            }
            if(!_self.isEmail){
                layer.msg("邮箱格式不正确", {
                    time: 1200
                });
                return;
            }

            _self.countdown();

            http({
                url: api.sendVerifyCode,
                type: 'post',
                data: {
                    email: _self.userInfo.email
                },
                success (res) {
                    _self.sendCode.success = true;

                    layer.msg("<i class='fa fa-check'></i> 验证码已发至你的邮箱", {
                        time: 1800
                    });
                },
                fail (res){
                    layer.msg(res.errorMsg, {
                        time: 1500
                    });
                },
                error () {
                    layer.msg("验证码获取失败", {
                        time: 1500
                    });
                }
            });
        },
        nextTep () {
            const _self = this;

            if(!_self.sendCode.success){
                layer.msg("请先获取验证码", {
                    time: 1200
                });
                return;
            }

            http({
                url: api.verify,
                type: 'post',
                data: {
                    'email': _self.userInfo.email,
                    'verifyCode': _self.userInfo.verifyCode
                },
                success (res) {
                    _self.errorMsg = '';
                    _self.currentStep = 2;
                },
                fail (res){
                    layer.msg("验证码不正确", {
                        time: 1500
                    });
                }
            });
        },
        regist () {
            const _self = this;

            if(_self.userInfo.password != _self.userInfo.confirm){
                layer.msg("两次密码输入不一致", {
                    time: 1200
                });
                return;
            }

            http({
                url: api.regist,
                type: 'post',
                data: {
                    'email': _self.userInfo.email.trim(),
                    'username': _self.userInfo.username.trim(),
                    'avatar': api.host + 'uploads/default.jpg',
                    'cover': api.host + 'uploads/defaultCover.png',
                    'password': hex_md5(_self.userInfo.password)
                },
                success (res) {
                    _self.errorMsg = '';

                    layer.msg("<i class='fa fa-check'></i> 恭喜, 注册成功", {
                        time: 1500
                    }, () => {
                        if(getCookie('userId')){
                            _self.$router.push({name: 'discover'});
                        }
                    });
                },
                fail (res){
                    layer.msg(res.errorMsg, {
                        time: 1500
                    });
                }
            });
        }
    },
    watch: {
        userInfo: {
            handler (newVal) {
                this.errorMsg = '';
                this.isEmail = true;

                if(!isEmail(newVal.email)){
                    this.errorMsg = "邮件格式不正确";
                    this.isEmail = false;
                }

                if(!newVal.email.trim()){
                    this.errorMsg = '';
                }

                if(newVal.confirm.trim()&&(newVal.password.trim()!=newVal.confirm.trim())){
                    this.errorMsg = '两次密码输入不一致';
                }
            },
            deep: true
        }
    }
}
</script>