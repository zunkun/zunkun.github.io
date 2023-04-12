---
title: React静态文件生成
date: '2023-04-12'
udate: '2023-04-12'
---
# React静态文件生成
React 使用 JSX语法，不能直接在html中运行，因此搭建 React 的运行环境。 这就需要 react , react-dom, babel。这三个文件可以从 cdn 引入，如果 静态文件有分享离线需求，则需要从本地引入。

## 搭建本地开发环境
### 引入React运行环境
1. 安装 react, react-dom, @babel/standalone

```bash
$ npm install react react-dom @babel/standalone
```
2. 引入script文件
```html
<script src="./node_modules/react/umd/react.production.min.js"></script>
<script src="./node_modules/react-dom/umd/react-dom.production.min.js"></script>
<script src="./node_modules/@babel/standalone/babel.min.js"></script>
```
说明：这三个文件也可以CDN引入

### 编写 React JSX 代码

在 script 设置 type="text/babel", 里面是 React JSX 语法编写代码。

```html
<script type="text/babel"></script>
```

### 数据文件引入

从 script 中引入 `data.js` 文件，这里使用了 globalThis 赋值到全局 window 里面。

如果是 ES MODULE 文件，则需要从服务中引入，本地引入则不支持 file 协议。

```html
<script src="./data.js"></script>
```

### 引入Less样式
```bash
$ npm install less
```
引入 less 文件，注意下面连个文件的顺序
```html
<link
	rel="stylesheet/less"
	type="text/css"
	href="./public/css/style.less"
/>
<script src="./node_modules/less/dist/less.min.js"></script>
```

## 搭建本地静态环境
1. 复制 `*.min.js` 文件 到 `public` 目录下，引入
```html
<script src="./public/js/react.production.min.js"></script>
<script src="./public/js/react-dom.production.min.js"></script>
<script src="./public/js/babel.min.js"></script>
```


2. 编译 less 到 css
执行命令

```bash
$ lessc style.less style.css
```
引入 css 文件
```html
<link rel="stylesheet" href="./public/css/style.css" />
```

3. 调整后head代码
```html
<script src="./public/js/react.production.min.js"></script>
<script src="./public/js/react-dom.production.min.js"></script>
<script src="./public/js/babel.min.js"></script>
<script src="./data.js"></script>
```


## 完整代码
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>React Static HTML</title>
		<!-- <script src="./node_modules/react/umd/react.production.min.js"></script>
		<script src="./node_modules/react-dom/umd/react-dom.production.min.js"></script>
		<script src="./node_modules/@babel/standalone/babel.min.js"></script>
		<link
			rel="stylesheet/less"
			type="text/css"
			href="./public/css/style.less"
		/>
		<script src="./node_modules/less/dist/less.min.js"></script> -->

		<script src="./public/js/react.production.min.js"></script>
		<script src="./public/js/react-dom.production.min.js"></script>
		<script src="./public/js/babel.min.js"></script>
		<script src="./data.js"></script>
		<link rel="stylesheet" href="./public/css/style.css" />
	</head>
	<body>
		<div id="app"></div>

		<script type="text/babel" data-type="module">
			function UserInfo(props) {
				const { user = {} } = props;
				return (
					<div>
						<div class='name'>name: {user?.name}</div>
						<div class='city'>city: {user?.city}</div>
					</div>
				);
			}

			function App() {
				return (
					<div class='layout'>
						<div class='sidemenu'></div>
						<div class='content'>
							<UserInfo user={userInfo || {}} />
						</div>
					</div>
				);
			}

			ReactDOM.render(<App />, document.querySelector('#app'));
		</script>
	</body>
</html>


```
