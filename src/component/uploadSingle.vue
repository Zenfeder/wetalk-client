<template>
    <span class="btn btn-sm btn-default fileinput-button" :disabled="disabledSelf">
        <i :class="'fa fa-'+icon"></i>
        <span v-text="placeholdSelf"></span>
        
        <input :id="id||'uploadSingle'" type="file" name="files[]" :data-url="uploadUrl" :disabled="disabledSelf"/>
    </span>
</template>

<script>
import api from '../common/api'

export default {
    props: ['id', 'fileType', 'icon', 'maxSize', 'placehold', 'disabled'],
    data () {
        return {
            uploadUrl: api.fileUpload,

            componentId: this.id||'上传文件',
            placeholdSelf: this.placehold || '上传文件',
            disabledSelf: (this.disabled==undefined)? this.disabled:false
        }
    },
    mounted () {
        const _self = this,
            protoPlacehold = _self.placeholdSelf;

        $("#" + _self.componentId).fileupload({
            dataType: 'json',
            add (e, data) {
                let fileName = data.files[0].name,
                    size = data.files[0].size,
                    uploadFileSuffix = fileName.split('.')[fileName.split('.').length-1],
                    fileTypeList = _self.fileType.split(',');

                _self.placeholdSelf = "正在上传...";
                _self.disabledSelf = true;

                for(let i=0;i<fileTypeList.length;i++){
                    if(fileTypeList[i] == uploadFileSuffix){
                        // _self.size为KB数,例如：_self.maxSize=1024,表示1024KB，即1MB
                        if(size/1024 >_self.maxSize){
                            _self.placeholdSelf = protoPlacehold;
                            _self.disabledSelf = false;
                
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

                _self.placeholdSelf = protoPlacehold;
                _self.disabledSelf = false;

                layer.msg('文件格式不支持', {
                    time: 1200
                });
            },
            done (e, data) {
                _self.placeholdSelf = protoPlacehold;
                _self.disabledSelf = false;

                _self.$emit("upload-done", {
                    'targetId': _self.componentId,
                    'data': data.result.files[0]
                });
            }
        });
    }
}
</script>