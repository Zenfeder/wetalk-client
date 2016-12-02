export default (Vue) => {
	// 字符串转置
	Vue.filter('reverse', value => {
	  return value.split('').reverse().join('')
	});
	// 日期格式化
	Vue.filter('formatDate', timestamp => {

		if (timestamp==''||timestamp==null) {
			return '';
		} else {
			const date = new Date(timestamp-0);

			let year = date.getFullYear(),
				month = ((date.getMonth()+1) > 9) ? (date.getMonth()+1) : ('0' + (date.getMonth()+1).toString()),
				day = (date.getDate() > 9) ? date.getDate() : ('0' + date.getDate().toString()),
				hour = (date.getHours() > 9) ? date.getHours() : ('0' + date.getHours().toString()),
				minute = (date.getMinutes() > 9) ? date.getMinutes() : ('0' + date.getMinutes().toString()),
				second = (date.getSeconds() > 9) ? date.getSeconds() : ('0' + date.getSeconds().toString());

			return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
		}
	})
}