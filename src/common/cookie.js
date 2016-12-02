/**
 * [设置cookie]
 * @param  {Object}   cookies  [要写入document.cookie中的对象]
 * @param  {Function} callback [cookie设置成功的回调函数]
 */
function setCookie(cookies, callback) {
	var now = new Date();
	var time = now.getTime();
	var expireTime = time + 1000*3600*24; // 单位为毫秒，故这里的cookie生命周期设置为24小时
	now.setTime(expireTime);
	
	for (let key in cookies) {
		document.cookie = key + '=' + cookies[key] + ';expires=' + now.toGMTString() + ';path=/';
	}

	callback();
}

/**
 * [按名称获取cookie的值]
 * @param  {String} cookieName [cookie名称]
 * @return {String}            [cookie的值]
 */
function getCookie(cookieName) {
	var cookies = {},
		cookieArr = document.cookie.split(';'),
		currentCookie = '';

	for (let i = 0; i < cookieArr.length; i++) {
		currentCookie = cookieArr[i];

		if(currentCookie.indexOf('=')>-1){
			cookies[currentCookie.split('=')[0].trim()] = currentCookie.split('=')[1].trim();
		}
	}

	if(typeof cookies[cookieName.trim()] != undefined){
		return cookies[cookieName.trim()];
	}
	else{
		return false;
	}
}

/**
 * [删除cookie]
 * @param  {Function} callback [删除成功的回调函数]
 */
function deleteCookie(callback) {
	var cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}

	callback();
}

export {setCookie, getCookie, deleteCookie};