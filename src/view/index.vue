<template>
    <div>
        <top-bar></top-bar>
        <side-bar></side-bar>
        <router-view></router-view>
        
        <footer class="main-footer">
            <div class="pull-right">
                <b>陈果</b>
            </div>
            <strong>Copyright &copy; 2016 <a href="#">weTalk</a></strong>  版权所有.
        </footer>
    </div>
</template>

<script>
import {getCookie} from '../common/cookie' 

import topBar from '../component/topBar'
import sideBar from '../component/sideBar'
import api from '../common/api'

export default {
	mounted () {
        if(!getCookie('userId')){
            this.$router.push({name: 'login'});
        }

        this.http(api.getUserInfo).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err)
        });
    },
    components: {
        topBar,
        sideBar
    },
    computed: {
        profile () {
            return this.$store.state.user.profile;
        }
    },
    methods: {
        http (URL) {
            return new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.open('GET', URL, true);
                req.onload = function () {
                    if (req.status === 200) {
                        resolve(JSON.parse(req.responseText));
                    } else {
                        reject(new Error(req.statusText));
                    }
                };
                req.onerror = function () {
                    reject(new Error(req.statusText));
                };
                req.send();
            });
        }
    }
}
</script>
