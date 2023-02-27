---
title: createElement和innerHTML性能对比2
---

# createElement和innerHTML性能对比2
代码

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>测试性能</title>
	</head>
	<body>
		<div class="" id="app1"></div>
		<div class="" id="app2"></div>
		<div class="" id="app3"></div>

		<script>
			let times = 10000;
			function testTimeByInnerHTML(times = 0) {
				let startTime = new Date();
				let root = document.getElementById('app1');

				for (let i = 0; i < times; i++) {
					root.innerHTML += '<div>测试测试1</div>';
				}

				console.log('用时： ' + (new Date() - startTime) / 1000);
			}

			function testTimeByArrayInnerHTML(times = 0) {
				let startTime = new Date();
				let root = document.getElementById('app2');
				let arr = [];

				for (let i = 0; i < times; i++) {
					arr.push('<div>测试测试2</div>');
				}

				root.innerHTML = arr.join('');

				console.log('用时2： ' + (new Date() - startTime) / 1000);
			}

			function testTimeByCreateElement(times = 0) {
				let startTime = new Date();

				let root = document.getElementById('app3');
				for (let i = 0; i < times; i++) {
					let elem = document.createElement('div');
					elem.textContent = '测试测试3';

					root.appendChild(elem);
				}

				console.log('用时3： ' + (new Date() - startTime) / 1000);
			}

			testTimeByInnerHTML(times);
			testTimeByArrayInnerHTML(times);
			testTimeByCreateElement(times);
		</script>

		<style>
			#app1 {
				width: 30%;
				height: 100vh;
				border: 1px solid red;
				float: left;
			}

			#app2 {
				width: 30%;
				height: 100vh;

				border: 1px solid green;
				margin-left: 40px;

				float: left;
			}

			#app3 {
				width: 30%;
				height: 100vh;

				border: 1px solid blue;
				margin-left: 40px;

				float: left;
			}
		</style>
	</body>
</html>
```

总结：在插入多条数据中， 配合array 的innerHTML 和 element.createElement差不多，甚至性能更好。而使用innerHTML拼接，简直是性能灾难。直接能把浏览器弄崩溃。