<template>
    <div class="content-wrapper">
        <!-- Content Header -->
        <section class="content-header"></section>

        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="photography">
                        <editor></editor>
                        <upload-multi icon="camera" max-size="1024" max-number="12" file-type="jpg,png,jpeg" placehold="上传图片（最多12张）"></upload-multi>
                    
                        <button class="btn bg-purple btn-block btn-flat" @click="submit"><i class="fa fa-check"></i> 发&nbsp;&nbsp;布</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import uploadMulti from '../../component/uploadMulti'
import editor from '../../component/editor'
import deepClone from '../../common/deepClone'

import api from '../../common/api'
import http from '../../common/http'

export default {
    mounted () {
        this.$nextTick(() => {
            initStyle();
        });
    },
    components: {
        uploadMulti,
        editor
    },
    computed: {
        photos () {
            return this.$store.getters.filesUrl;
        },
        editorContent () {
            return this.$store.state.editor.editorContent;
        }
    },
    methods: {
        submit () {
            const _self = this;

            const formData = {
                content: _self.editorContent,
                photos: _self.photos
            };

            http({
                url: api.postPublish,
                type: 'post',
                data: formData,
                success (res) {
                    layer.msg("发布成功", {
                        time: 1200
                    }, () => {
                        _self.$router.push({name: 'discover'});
                    });
                }
            });
        }
    }
}
</script>