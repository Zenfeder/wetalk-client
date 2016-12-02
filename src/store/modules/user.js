import http from '../../common/http'
import {getCookie} from '../../common/cookie'
import api from '../../common/api'

const state = {
    profile: {
        username: '',
        email: '',
        password: '',
        signature: '',
        avatar: '',
        cover: '',
        status: '',
        isActive: '',
        followingNum: '',
        followerNum: '',
        created: ''
    }
}

const mutations = {
    initProfile: (state, payload) => {
        state.profile = payload.profile;
    }
}

const actions = {
    getProfileAsync: (context) => {
        http({
            url: api.getUserInfo,
            type: 'get',
            data: {
                userId: getCookie('userId'),
            },
            hasLoading: false,
            success(res) {
                context.commit('initProfile', {
                	profile: res.data
                });
            }
        });
    }
}

export default {
    state,
    mutations,
    actions
}
