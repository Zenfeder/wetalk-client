import api from '../../common/api'

const state = {
    filesData: []
}

const mutations = {
    getFilesData: (state, payload) => {
        let item = {
            name: payload.file.name,
            originalName: payload.file.originalName,
            url: api.host+'uploads/'+payload.file.name,
            size: 8007
        };

        state.filesData.push(item);
    },
    removeFileMulti: (state, payload) => {
        state.filesData.splice(payload.index, 1);
    },
    clearFilesData: (state) => {
        state.filesData = [];
    },

}

const getters = {
    filesDataCount: (state) => {
        return state.filesData.length
    },
    filesUrl: (state, getters) => {
        let filesUrlArr = [];
        for(let i=0;i<getters.filesDataCount;i++){
            filesUrlArr.push(state.filesData[i].url);
        }

        return filesUrlArr;
    }
}

export default {
    state,
    mutations,
    getters
}
