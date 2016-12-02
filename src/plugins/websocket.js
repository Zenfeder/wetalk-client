import io from 'socket.io-client'
import api from '../common/api'

const socket = io(api.host)
var websocket = {
    install: ''
}

websocket.install = function(Vue, options) {
    // 添加实例方法
    Vue.prototype.emit = function(eventName, data) {
        socket.emit(eventName, data)
    }

    Vue.prototype.on = function(eventName, callback) {
        socket.on(eventName, function(data) {
            callback(data)
        })
    }
}

export default websocket
