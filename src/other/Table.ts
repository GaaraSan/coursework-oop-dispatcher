import { Button } from './Button'

interface TableHead {
	title: string
	name: string
}

export interface TableItem<T> {
	id: string
	content: T
	textForSort: number | string
}

const SORT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
<path fill="var(--table-sort-color-1)" d="M11.36 2.306zM4.894 13.17a.927.927 0 0 0-.64 1.596l7.104 6.796a.927.927 0 0 0 1.282 0l7.104-6.796a.927.927 0 0 0-.64-1.596H4.895zm2.31 1.853h9.59L12 19.609l-4.795-4.586z"/>
<path fill="var(--table-sort-color-2)" d="M11.966 2.33a.934.934 0 0 0-.612.258l-7.16 6.849a.934.934 0 0 0 .646 1.608h14.32a.934.934 0 0 0 .646-1.608l-7.16-6.849a.934.934 0 0 0-.68-.258zM12 4.555l4.833 4.623H7.167L12 4.555z"/></svg>
`

export class Table<T> {
	heads: TableHead[]
	items: TableItem<T>[][]
	onDelete: (item: TableItem<T>[]) => void
	onEdit: (item: TableItem<T>[]) => void
	sortFunction: (a: TableItem<T>[], b: TableItem<T>[]) => number
	sortComunnsModes: Record<number, undefined | 'asc' | 'desc'> = {}

	constructor(
		heads: TableHead[],
		items: TableItem<T>[][],
		onDelete: (item: TableItem<T>[]) => void,
		onEdit: (item: TableItem<T>[]) => void
	) {
		this.heads = heads
		this.items = items
		this.onDelete = onDelete
		this.onEdit = onEdit
		this.sortFunction = this.sortFunctionNoSort.bind(this)
		this.sortComunnsModes = {}
	}

	private sortFunctionNoSort(a: TableItem<T>[], b: TableItem<T>[]): number {
		console.log(this.sortComunnsModes)

		for (let [key, value] of Object.entries(this.sortComunnsModes)) {
			if (value === undefined) continue

			const index = Number(key)

			const aValue = a[index].textForSort
			const bValue = b[index].textForSort

			if (aValue === bValue) continue

			const aValueAsNumber = Number(aValue)
			const bValueAsNumber = Number(bValue)

			if (!isNaN(aValueAsNumber) && !isNaN(bValueAsNumber)) {
				if (value === 'desc') {
					return aValueAsNumber < bValueAsNumber ? 1 : -1
				}

				return bValueAsNumber < aValueAsNumber ? 1 : -1
			}

			if (value === 'desc') {
				return aValue < bValue ? 1 : -1
			}

			return bValue < aValue ? 1 : -1
		}

		return 0
	}

	private toggleSortMode(index: number) {
		if (this.sortComunnsModes[index] === undefined) {
			this.sortComunnsModes[index] = 'desc'
			return
		}

		if (this.sortComunnsModes[index] === 'desc') {
			this.sortComunnsModes[index] = 'asc'
			return
		}

		if (this.sortComunnsModes[index] === 'asc') {
			delete this.sortComunnsModes[index]
			return
		}
	}

	private getTableElements(items: TableItem<T>[]) {
		return items.map(item => {
			const td = document.createElement('td')

			td.className = 'border px-4 py-2'
			td.innerHTML = String(item.content)

			return td
		})
	}

	private getTableHeadElements(heads: TableHead[]) {
		return heads.map((head, index) => {
			const th = document.createElement('th')

			th.className = 'bg-slate-100 font-medium border px-4 py-2 cursor-pointer'

			const wrapper = document.createElement('div')
			wrapper.className = 'flex items-center'

			const sortButton = document.createElement('button')
			sortButton.className = 'text-slate-400 scale-[0.8]'
			sortButton.innerHTML = SORT_SVG

			sortButton.style.setProperty('--table-sort-color-1', 'currentcolor')
			sortButton.style.setProperty('--table-sort-color-2', 'currentcolor')

			if (this.sortComunnsModes[index] === 'desc') {
				sortButton.style.setProperty('--table-sort-color-1', '#f472b6')
			}

			if (this.sortComunnsModes[index] === 'asc') {
				sortButton.style.setProperty('--table-sort-color-2', '#f472b6')
			}

			wrapper.append(sortButton)

			const text = document.createTextNode(String(head.title))
			wrapper.append(text)

			th.append(wrapper)

			th.onclick = () => {
				this.toggleSortMode(index)

				this.rerenderTable()
			}

			return th
		})
	}

	table: HTMLElement | null = null

	rerenderTable() {
		const newTable = this.render()

		this.table?.replaceWith(newTable)
		this.table = newTable
	}

	render() {
		console.log('render', Object.keys(this.sortComunnsModes).length)

		const itemsAfterSort =
			Object.keys(this.sortComunnsModes).length > 0
				? this.items.toSorted(this.sortFunction)
				: this.items

		const itemsForRender = itemsAfterSort.map(item => {
			const tableElements = this.getTableElements(item)

			const deleteButton = new Button(
				'D',
				() => {
					this.onDelete(item)
				},
				'ml-1 w-[30px] h-[30px] bg-red-200 rounded-md border border-red-400 hover:bg-red-300 hover:bg-red-300 transition '
			)

			const editButton = new Button(
				'E',
				() => {
					this.onEdit(item)
				},
				'w-[30px] h-[30px] bg-sky-200 rounded-md border border-sky-400 hover:bg-sky-300 hover:bg-red-300 transition '
			)

			const tr = document.createElement('tr')

			tr.append(...tableElements)

			const td = document.createElement('td')
			td.className = 'px-1'

			const div = document.createElement('div')
			div.className = 'flex gap-x-1 items-center justify-center'

			div.append(deleteButton.render())
			div.append(editButton.render())

			td.append(div)
			tr.append(td)

			return tr
		})

		const scrollTableWrapper = document.createElement('div')
		scrollTableWrapper.className =
			'max-[750px]:overflow-x-scroll max-[750px]:pb-4'

		const table = document.createElement('table')
		table.className = 'mt-2 win-w-[1200px]'

		const headsForRender = this.getTableHeadElements(this.heads)

		const thead = document.createElement('thead')
		thead.append(...headsForRender)

		const tbody = document.createElement('tbody')
		tbody.append(...itemsForRender)

		table.append(thead, tbody)

		scrollTableWrapper.append(table)

		if (!this.table) {
			this.table = scrollTableWrapper
		}

		return scrollTableWrapper
	}
}
