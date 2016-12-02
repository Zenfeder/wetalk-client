<template>
    <div class="content-wrapper">
        <!-- Content Header -->
        <section class="content-header">
            <h4>
                <i class="fa fa-pencil"></i> 修改个人信息
            </h4>
        </section>

        <!-- Main content -->
        <section class="content clearfix">
            <div class="col-md-12 form-horizontal no-padding">
                <div class="form-group">
                    <label class="col-md-4 control-label">用户名:</label>
                    <div class="col-md-4">
                        <input type="text" name="username" class="form-control input-sm" placeholder="请输入用户名" v-model="formData.username">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">个性签名:</label>
                    <div class="col-md-4">
                        <input type="text" name="signature" class="form-control input-sm" placeholder="请填写个性签名" v-model="formData.signature">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">新密码:</label>
                    <div class="col-md-4">
                        <input type="password" name="password" class="form-control input-sm" placeholder="请输入新密码" v-model="formData.passwordNew">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">确认新密码:</label>
                    <div class="col-md-4">
                        <input type="password" name="password" class="form-control input-sm" placeholder="请再次输入新密码" v-model="formData.passwordConfirm">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">头像:</label>
                    <div class="col-md-4">
                        <div class="col-md-6 no-padding">
                            <upload-single id="upload-avatar" max-size="500" file-type="jpg,png,jpeg" icon="smile-o" placehold="更换头像" @upload-done="getAvatarData"></upload-single>
                        </div>
                        
                        <div class="col-md-12 no-padding" v-if="formData.avatar!=''">
                            <img :src="formData.avatar" class="img-circle" style="width:100%; max-width:60px;" />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">封面图片:</label>
                    <div class="col-md-4">
                        <div class="col-md-6 no-padding">
                            <upload-single id="upload-cover" max-size="1024" file-type="jpg,png,jpeg" icon="photo" placehold="更换封面" @upload-done="getCoverData"></upload-single>    
                        </div>
                        <div class="col-md-12 no-padding" v-if="formData.cover!=''">
                            <img :src="formData.cover" style="width:100%; max-width:280px;"/>
                        </div>
                        
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-4 col-md-offset-4">
                        <button class="btn btn-sm bg-purple" :disabled="!formData.username.trim()" @click="submit"><i class="fa fa-check"></i> 提交</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- modal 确认密码 -->
        <div class="modal fade" tabindex="-1" role="dialog" id="modalConfirmPsd">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">确认权限</h4>
                    </div>
                    <div class="modal-body">
                        <input type="password" class="form-control input-sm" placeholder="请输入您的旧密码" v-model="formData.passwordOld"/>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-sm bg-purple" @click="submitConfirm" :disabled="!formData.passwordOld.trim()"><i class="fa fa-check"></i> 确定</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- ./modal 确认密码 -->
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'

import api from '../../common/api'
import http from '../../common/http'
import {hex_md5} from '../../common/md5'

import uploadSingle from '../../component/uploadSingle'

export default {
    mounted () {
        this.$nextTick(() => {
            initStyle();
        });
        this.getUserInfo();
    },
    components: {
        uploadSingle,
    },
    data () {
        return {
            formData: {
                username: '',
                passwordNew: '',
                passwordConfirm: '',
                passwordOld: '',
                signature: '',
                avatar: '',
                cover: ''
            }
        }
    },
    methods: {
        getAvatarData (data) {
            this.formData.avatar = data.data.url;
        },
        getCoverData (data) {
            this.formData.cover = data.data.url;
        },
        getUserInfo () {
            const _self = this;

            http({
                url: api.getUserInfo,
                type: 'get',
                success (res) {
                    _self.formData.username = res.data.username;
                    _self.formData.signature = res.data.signature;
                    _self.formData.avatar = res.data.avatar;
                    _self.formData.cover = res.data.cover;
                }
            });
        },
        submit () {
            const _self = this;

            if(_self.formData.passwordNew.trim()!==_self.formData.passwordConfirm.trim()){
                layer.msg("两次密码输入不一致", {
                    time: 1500
                },() => {
                    _self.formData.passwordConfirm = '';
                });
            }else{
                $("#modalConfirmPsd").modal("show");
            }
        },
        submitConfirm () {
            const _self = this;

            var newPsd = (_self.formData.passwordNew.trim()=='')? '':hex_md5(_self.formData.passwordNew.trim());

            http({
                url: api.setting,
                type: 'post',
                data: {
                    username: _self.formData.username,
                    passwordNew: newPsd,
                    passwordOld: hex_md5(_self.formData.passwordOld),
                    signature: _self.formData.signature,
                    avatar: _self.formData.avatar,
                    cover: _self.formData.cover
                },
                success (res) {
                    layer.msg(res.errorMsg, {
                        time: 1000
                    }, () => {
                        $("#modalConfirmPsd").modal("hide");
                        _self.$store.dispatch('getProfileAsync');
                        _self.getUserInfo();
                    });
                }
            });
        }
    }
}
</script>