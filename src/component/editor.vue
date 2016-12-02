<template>
    <div class="col-md-12" id="editor-wrap">
        <span>写点儿什么吧...</span>
    </div>
</template>

<script>
export default {
    mounted () {
        const _self = this;

        this.$nextTick(() => {
            var container = $("#editor-wrap").get(0);

            wangEditor.config.printLog = false;

            var editor = new wangEditor(container);

            editor.config.emotionsShow = 'icon';

            editor.config.emotions = {
                'default': {
                    title: '默认',  
                    data: '/lib/wangEditor/emotions.xl.data'
                }
            };

            editor.config.menus = [
                // 'source',
                // '|',
                'bold',
                'underline',
                'italic',
                'strikethrough',
                // 'eraser',
                'forecolor',
                'quote',
                '|',
                'head',
                'unorderlist',
                'orderlist',
                'alignleft',
                'aligncenter',
                'alignright',
                '|',
                'link',
                'unlink',
                'emotion',
                '|',
                'undo',
                'redo',
                'fullscreen'
            ];
            editor.create();

            editor.onchange = function () {
                const that = this;

                _self.$store.commit('getEditorContent', {
                    editorContent: that.$txt.html()
                });
            };
        });
    },
    props: ['id', 'placeholder', 'fileType', 'disabled']
}
</script>
<style>
    .wangEditor-container{
        border-left: none;
        border-right: none;
    }
    #editor-wrap{
        background:#fff;
        margin-top:0;
        padding:5px;
        border-bottom:1px solid #ccc;
        height:450px;
        max-height:600px;
    }
</style>