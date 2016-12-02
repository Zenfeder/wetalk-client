<template>
    <div>
        <div class="col-xs-12 text-center fileinput-button" style="padding:40px 0;background:#fdffff;">
            <i :class="'fa fa-'+icon" style="font-size:30px;"></i>
            <br>
            <span v-text="placehold"></span>
            
            <input :id="id||'uploadMulti'" type="file" name="files[]" :data-url="uploadUrl" :disabled="disabled" multiple />
        </div>

        <div id="progress" class="col-xs-12 no-padding">
            <div class="bar" style="width: 0%;"></div>
        </div>

        <div class="col-xs-12 no-padding img-preview clearfix" v-if="files.length>0" style="border:1px dotted #ccc;">
            <template v-for="item in files">
                <img :src="item.url" style="height:50px; margin: 0 2px 2px 0;" />
            </template>
        </div>
    </div>
</template>

<script>
import api from '../common/api'

export default {
    props: ['id', 'fileType', 'icon', 'maxNumber', 'maxSize', 'placehold', 'disabled'],
    mounted () {
        const _self = this,
            compId = _self.id || 'uploadMulti';

        var loading;

        _self.$store.commit('clearFilesData');

        $("#"+compId).fileupload({
            dataType: 'json',
            add (e, data) {
                if(_self.filesCount>_self.maxNumber-1){
                    layer.msg('最多只能上传'+_self.maxNumber+'张哦～');
                    return;
                }else{
                    loading =  layer.load(1);

                    let fileName = data.files[0].name,
                        size = data.files[0].size,
                        uploadFileSuffix = fileName.split('.')[fileName.split('.').length-1];

                    let fileTypeList = _self.fileType.split(',');

                    for(let i=0;i<fileTypeList.length;i++){
                        if(fileTypeList[i] == uploadFileSuffix){
                            // _self.size为KB数,例如：_self.maxSize=1024,表示1024KB，即1MB
                            if(size/1024 >_self.maxSize){
                                layer.close(loading);
                                layer.msg('文件格不能大于'+_self.maxSize+'KB', {
                                    time: 1200
                                });
                                return;
                            }else{
                                data.submit();
                                return;
                            }
                        }
                    }

                    layer.close(loading);
                    layer.msg('文件格式不支持', {
                        time: 1200
                    });
                }
            },
            progressall (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .bar').css(
                    'width',
                    progress + '%'
                );
            },
            done (e, data) {
                layer.close(loading);

                _self.$store.commit('getFilesData', {
                    file: data.result.files[0]
                });
            }
        });
    },
    data () {
        return {
            uploadUrl: api.fileUpload
        }
    },
    computed: {
        files () {
            return this.$store.state.uploadMulti.filesData;
        },
        filesCount () {
            return this.$store.getters.filesDataCount;
        }
    },
}
</script>
<style>
    .bar {
        height: 2px;
        background: #3c763d;
    }
</style>