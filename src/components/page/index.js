import page from './page.vue'

page.install = function(Vue){
	Vue.component('pagenation', page);
}

export default page