const state = {
    editorContent: ''
}

const mutations = {
    getEditorContent: (state, payload) => {
        state.editorContent = payload.editorContent
    },
    clearEditorContent: (state) => {
        state.editorContent = '';
    }
}

export default {
    state,
    mutations,
}
