<template>
	<div class="pagenation">
		<ul>
			<li @click="pre"> < </li>
			<li v-for="item in show_page_numbers" :class="{active: item==current_index}" @click="setIndex(item)">{{item}}</li>
			<li @click="next"> > </li>
		</ul>
	</div>
</template>
<script>
	export default {
		name:'pagenation',
		props:{
			current: {
				type: Number,
				default: 1
			},
			total: {
				type: Number
			},
			currentChange: {
				type: Function
			}
		},
		data: function(){
			return {
				show_page_numbers:[],
				display_limit:8,
				current_index: this.current
			}
		},
		mounted(){
			this.refreshPage();
		},
		methods:{
			refreshPage(){
				this.show_page_numbers=[];

				for(let i=1; i<=this.total; i++){
					this.show_page_numbers.push(i);
				}

		      	if (this.total <= this.display_limit) { return; }
		      	let begin = this.current_index - 3 
		      	let end = this.current_index + 3
		      	begin = begin <= 1 ? 1 : begin
		      	end = end <= this.display_limit ? this.display_limit : end
		      	begin = begin >= this.total - this.display_limit ? this.total - this.display_limit : begin
		      	end = end >= this.total ? this.total : end

		      	let arr = this.show_page_numbers.slice(begin-1,end);
		      	this.show_page_numbers = arr;

			},
			pre(){
				console.log("lll");
				let current = this.current_index;
				if(current<=1){
					return;
				}
				this.setIndex(current-1);

			},
			next(){
				console.log("kkk");
				let current = this.current_index;
				if(current>=this.total){
					return;
				}
				this.setIndex(current+1);
			},
			setIndex(index){
				this.current_index = index;
				this.refreshPage();
			}
		}
	}
</script>
<style scoped>
  li{
    list-style: none;
    display: inline-block;
    margin: 5px -0.5px;
    border: 1px solid #2c3e50;
    padding: 5px;
    min-width: 30px;
    min-height: 30px;
    line-height: 200%;
    cursor: pointer;
    transition: all 0.3s;
    user-select: none;  
  }
  .active, li:hover{
    background-color: rgba(65, 182, 131, .5);
    color: #ffffff;
    border-color: rgba(65, 182, 131, .5);
  }  
  a{
    display: inline-block;
    color: inherit;
  } 
  .clearfix{
    clear: both;
  }
</style>