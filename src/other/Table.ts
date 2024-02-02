import { Button } from './Button'

export class Table<T> {
	heads: string[]
	items: T[][]
	onDelete: (item: T[]) => void
	onEdit: (item: T[]) => void

	constructor(
		heads: string[],
		items: T[][],
		onDelete: (item: T[]) => void,
		onEdit: (item: T[]) => void
	) {
		this.heads = heads
		this.items = items
		this.onDelete = onDelete
		this.onEdit = onEdit
	}

	private getTableElements(item: T[]) {
		return item.map(elementText => {
			const td = document.createElement('td')

			td.className = 'border px-4 py-2'
			td.textContent = String(elementText)

			return td
		})
	}

	private getTableHeadElements = (heads: string[]) => {
		return heads.map(head => {
			const th = document.createElement('th')

			th.className = 'bg-slate-100 font-medium border px-4 py-2'
			th.textContent = String(head)

			return th
		})
	}

	render() {
		const itemsForRender = this.items.map(item => {
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

		const table = document.createElement('table')
		table.className = 'mt-2'

		const headsForRender = this.getTableHeadElements(this.heads)

		const thead = document.createElement('thead')
		thead.append(...headsForRender)

		const tbody = document.createElement('tbody')
		tbody.append(...itemsForRender)

		table.append(thead, tbody)

		return table
	}
}
