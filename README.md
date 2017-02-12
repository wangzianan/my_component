# 前言 
最近在研究vue 2.0，看了很多组件库，当需求很多的时候，一个或两个组件库可能不能够满足我们的需求，自己能够手写一个组件的能力很有必要。看了官网和几个教程，发现写的不是令人满意，我决定写一份简单明了的教程，希望对你有帮助。
# 代码使用 
1. npm install (如果太慢建议 cnpm install)
2. npm run dev

# 项目初始化 #
## 1.初始化一个vue的项目
新手推荐先使用vue的脚手架(vue-cli),除非你已经很了解webpack了（关于webpack后续我也会写一些，敬请关注）。

vue-cli有几个模版，我们先使用一个简单点的webpack-simple。
```
 vue init webpack-simple my_component
```
一路回车敲下去，会生成一个项目，里面包含了package.json，webpack.config.js,src目录和一些其他文件
## 2.项目的配置
本文先假设你对npm的的配置和webpack了解，它们的配置不在本文的讨论内容中，直接粘贴我的配置信息即可。
### package.json:
```
{
  "name": "my_component",
  "description": "A Vue.js project",
  "version": "1.0.0",
  "author": "Darcy_Wang <wangziangis@gmail.com>",
  "private": true,
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --open --hot",
    "build": "cross-env NODE_ENV=production webpack --progress --hide-modules"
  },
  "dependencies": {
    "vue": "^2.1.0"
  },
  "devDependencies": {
    "babel-core": "^6.0.0",
    "babel-loader": "^6.0.0",
    "babel-preset-es2015": "^6.0.0",
    "cross-env": "^3.0.0",
    "css-loader": "^0.25.0",
    "file-loader": "^0.9.0",
    "style-loader": "^0.13.1",
    "vue-loader": "^10.0.0",
    "vue-template-compiler": "^2.1.0",
    "webpack": "^2.2.0",
    "webpack-dev-server": "^2.2.0"
  }
}
```

### webpack.config.js:
```
var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test:/\.css$/,
        loader:'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

```

# 组件
vue中的组件是最重要的概念，它表现为一个单体文件，以‘.vue’为扩展名,里面包含：
- template (html标签，组件的整体结构)
- script (javascript脚本，用于定义组件，实现组件的内部逻辑)
- style（css样式,一般都是scoped,防止样式污染全局）。

其中script比较重要，作为一个vue的组件它主要包含以下几个基本部分：
- name (组件的名称，使用组件时将把name作为标签名```<name></name>```）
- props (组件的属性,用于接收传入的参数,在组件中可以用```this.prop_name```方式引用)
- data (组件的初始化数据，定义一个返回一个对象的函数)
- methods (组件的方法)
- created,mounted等 (组件的生命周期函数)

组件还需要编写一个install方法，用于安装这个组件到Vue的对象中，执行Vue.use(component)，会调用这个方法
## 1.组件的编写
下面以一个简单的分页组件为例，介绍组件的编写。
### 首先,创建组件文件。
在src下创建一个components文件夹，包含文件夹page，page中包含index.js,page.vue如下目录结构：
```
src
-components
--page
---index.js
---page.vue
```
components用于放置组件的集合，page包含组件的文件，index.js组件的注册文件，page.vue组件的内容

### 然后编写组件的具体内容
直接参考以下代码：
```
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
```
### 最后编写组件的注册文件
index.js文件如下：
```
import page from './page.vue'

page.install = function(Vue){
	Vue.component('pagenation', page);
}

export default page
```
至此，一个组件已经开发完成了，下面就差使用啦

## 2.组件的使用
组件的使用有好几种方式，下面仅介绍一种简单的方式。
在使用组件的那个文件中先把组件导入，然后调用Vue.use(),对，就是这么简单。
比如在App.vue中使用该组件。

在script中写如下代码：
```
import page from './components/page'
import Vue from 'vue'

Vue.use(page);
```
在template中写如下代码：
```
<pagenation :current="2" :total="40" :currentChange="whenChange"></pagenation>
```
App.vue最终这个样子:
```
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1></h1>
    <pagenation :current="2" :total="40" :currentChange="whenChange"></pagenation>
  </div>
</template>

<script>
import page from './components/page'
import Vue from 'vue'

Vue.use(page);

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    whenChange(item){
      console.log(item);
    }
  }
}
</script>

<style>

</style>

```
保存，根目录下运行```npm run dev```，你已经在使用自己的组件了

初次之外修改下，package.json，添加一个"main":"dist/your_component_compile_path"，运行```npm publish```你就可以把这个模块发布到npm上，别人可以通过```npm install your_component_name```方式安装你的组件



