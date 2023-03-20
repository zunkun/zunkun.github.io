---
title: Antd InputTextArea联想输入
date: '2023-03-20'
udate: '2023-03-20'
---
# Antd InputTextArea联想输入

## 代码

```jsx
import { useState, useEffect } from 'react';
import { Form, Input, List } from 'antd';
import { debounce } from 'lodash';
import styles from './Index.module.less';

type DataItem = {
	label: string;
	value: string;
};

const datMap: { [key in string]: DataItem[] } = {};

const num = 20 + Math.floor(Math.random() * 20);
const data: DataItem[] = [];
const data2: DataItem[] = [];
for (let i = 0; i < num; i++) {
	data.push({
		label: '测试1-' + (i + 1),
		value: '测试1-' + (i + 1),
	});

	data2.push({
		label: '测试2-' + (i + 1),
		value: '测试2-' + (i + 1),
	});

	datMap[' '] = data;
	datMap['【'] = data2;
}

const keyTagMap: { [key in string]: string } = {};

const IndexComponent = () => {
	// 是否在输入中文
	let isComposition = false;
	const [searchState, setSearchState] = useState({
		search: false, // 是否在搜索
		searchType: '', // 搜索输入类型
		list: [] as DataItem[],
		startPos: 0, // 开始位置
		closed: false, // 是否输入结束符号
		preStr: '', // 开始之前字符串
		afterStr: '', // 开始之后字符串
	});
	const [form] = Form.useForm();

	const queryKey = async (
		keyword: string,
		searchType: string,
	): Promise<DataItem[]> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const list = datMap[searchType].filter((dataitem) => {
					return dataitem.value.indexOf(keyword) > -1;
				});

				resolve(list);
			}, 500);
		});
	};

	const keylists = [
		{
			key: ' ',
			closetag: ' ',
			list: queryKey,
		},
		{
			key: '【',
			closetag: '】',
			list: queryKey,
		},
	];

	function init() {
		keylists.forEach((item) => {
			keyTagMap[item.key] = item.closetag;
		});
	}

	function clearSearchState() {
		setSearchState({
			search: false,
			searchType: '',
			list: [],
			startPos: 0,
			closed: false,
			preStr: '',
			afterStr: '',
		});
	}
	useEffect(() => {
		init();
	}, []);

	const onPickItem = (value: string) => {
		const str = searchState.closed
			? searchState.preStr + value + searchState.afterStr
			: searchState.preStr +
			  value +
			  keyTagMap[searchState.searchType] +
			  searchState.afterStr;

		// 这个地方无效，不知道为什么
		form?.setFieldsValue({ ...form.getFieldsValue(), description2: str });
	};

	const queryList = async (
		keyword: string,
		searchType: string,
	): Promise<DataItem[]> => {
		console.log(
			'查询接口： searchType = ' + searchType + ' keyword= ' + keyword,
		);
		const keyItem = keylists.find((item) => item.key === searchType);
		if (!keyItem) return [];
		if (!keyword) return datMap[searchType];
		return keyItem.list(keyword, searchType);
	};

	const onInputWord = (target: Event['target']) => {
		if (isComposition) return;
		const { selectionStart, selectionEnd } = target;
		// eslint-no-check
		const strValue = target?.value || '';
		const inputWord = strValue[selectionStart - 1];

		console.log({ selectionStart, selectionEnd, strValue, inputWord });
		// 无关紧要输入，不查询
		if (!searchState.search && !keyTagMap[inputWord]) return;

		// 关闭查询，查询中遇到当前输入类型的结束字符
		if (
			searchState.search &&
			keyTagMap[searchState.searchType] === inputWord &&
			searchState.startPos !== selectionStart
		) {
			console.log(`输入结束字符，关闭搜索`);
			clearSearchState();
			return;
		}

		if (searchState.search && selectionStart < searchState.startPos) {
			console.log('光标位置小于搜索开始位置，关闭搜索');
			clearSearchState();
			return;
		}

		let { searchType, startPos, closed, preStr, afterStr } = searchState;

		// 定义是否是新输入：
		// 1. 当前不在查询状态
		// 2. 在查询状态，遇到新的开始查询开始条件
		// 比如 "【" 遇到了空格 " ", 但是 空格遇到空格会在上面的关闭条件中过滤掉，因为空格的结束符号也是空格， 如果【遇到【， 则也可以看作是重新查询
		const isNewSearch = !searchState.search || keyTagMap[inputWord];
		if (isNewSearch) {
			searchType = inputWord;
			startPos = selectionStart;
			closed = strValue[selectionEnd] === keyTagMap[searchType];
			preStr = strValue.slice(0, selectionStart);
			afterStr = strValue.slice(selectionEnd);
		}

		console.log({ preStr, afterStr });

		const keyword = strValue.slice(startPos, selectionEnd);

		return queryList(keyword, searchType).then((list) => {
			setSearchState({
				...searchState,
				search: true,
				searchType,
				startPos,
				list,
				closed,
				preStr,
				afterStr,
			});
		});
	};

	const debounceFun = debounce(onInputWord, 500);

	const handleComposition = () => {
		isComposition = !isComposition;
	};

	return (
		<div>
			<Form form={form}>
				<Form.Item label='测试' name='description2'>
					<Input.TextArea
						onInput={(e) => debounceFun(e.target)}
						onCompositionStart={handleComposition}
						onCompositionEnd={handleComposition}
					/>
					{searchState.search && searchState.list.length ? (
						<div className={styles.wrapper}>
							<List
								dataSource={searchState.list}
								bordered
								header={null}
								footer={null}
								renderItem={(item) => (
									<List.Item
										className={styles.listitem}
										onClick={() => onPickItem(item.value)}>
										{item.value}
									</List.Item>
								)}
							/>
						</div>
					) : null}
				</Form.Item>
			</Form>
		</div>
	);
};

export default IndexComponent;

```
