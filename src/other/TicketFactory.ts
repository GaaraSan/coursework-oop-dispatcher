import { Ticket } from '../classes/Ticket'
import { TicketManager } from '../classes/TicketManager'
import { TicketStorage } from '../utils/TicketStorage'
import { Button } from './Button'
import { Form } from './Form'
import { GUIFactory } from './GUIFactory'
import { Search } from './Search'
import { Table } from './Table'

export class TicketFactory implements GUIFactory<unknown> {
	private manager
	private storage
	private search
	private currentTableRender: HTMLTableElement | null = null

	constructor() {
		this.manager = new TicketManager()
		this.storage = new TicketStorage()
		this.search = new Search(this.onSearchChange.bind(this))

		this.manager.initializeFromStorage(this.storage as any)
	}

	private onSearchChange(text: string) {
		const itemsForRender = this.manager.items.filter(item => {
			const BIG_BIG_STRING = Object.values(item)
				.map(element => {
					if (element instanceof Date) {
						return element.toISOString().split('T')[0]
					}

					return String(element)
				})
				.join('')
				.toLowerCase()

			return BIG_BIG_STRING.includes(text.toLowerCase())
		})

		this.rerenderTable(itemsForRender)
	}

	getSearchForRender() {
		return this.search.render()
	}

	createOpenFormButton() {
		const callback = () => {
			const form = new Form(
				'Add new ticket',
				() => {
					form.umount()
				},
				formData => {
					this.manager.add({
						passenger: formData.passenger,
						flight: formData.flight,
						position: formData.position
					})

					this.rerenderTable()
					this.storage.setItem(this.manager.items)

					form.umount()
				}
			)

			form.addInput('text', 'Passenger:', 'passenger')
			form.addInput('text', 'Flight:', 'flight')
			form.addInput('tel', 'Position:', 'position')

			form.mount()
		}

		return new Button(
			'Create ticket',
			callback,
			`mt-2 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 w-auto hover:bg-slate-300 transition`
		).render()
	}

	private rerenderTable(items?: Ticket[]) {
		const itemsForRender = items ?? this.manager.items

		const newTable = this.createTable(
			itemsForRender,
			this.onDelete.bind(this),
			this.onEdit.bind(this)
		)

		this.currentTableRender?.replaceWith(newTable)
		this.currentTableRender = newTable
	}

	private onDelete = (item: (string | number)[]) => {
		console.log('onDelete')
		const id = item[0]

		this.manager.remove(id as string)
		this.storage.setItem(this.manager.items)

		this.rerenderTable()
	}

	private onEdit = (item: (string | number)[]) => {
		const [id, passenger, flight, position] = item

		const form = new Form(
			'Update ticket',
			() => {
				form.umount()
			},
			formData => {
				this.manager.edit(
					String(id),
					new Ticket(
						String(id),
						formData.passenger,
						formData.flight,
						formData.position
					)
				)

				this.rerenderTable()
				this.storage.setItem(this.manager.items)

				form.umount()
			},
			'update'
		)

		form.addInput('text', 'Passenger', 'passenger', String(passenger))
		form.addInput('text', 'Flight', 'flight', String(flight))
		form.addInput('tel', 'Position', 'position', String(position))

		form.mount()
	}

	getTableForRender() {
		this.currentTableRender = this.createTable(
			this.manager.items,
			this.onDelete.bind(this),
			this.onEdit.bind(this)
		)

		return this.currentTableRender
	}

	private createTable(
		items: Ticket[],
		onDelete: (item: (string | number)[]) => void,
		onEdit: (item: (string | number)[]) => void
	) {
		const HEADS = ['ID', 'Passenger', 'Flight', 'Position']

		const ITEMS = items.map(item => {
			return [item.id, item.passenger, item.flight, item.position]
		})

		const table = new Table(HEADS, ITEMS, onDelete, onEdit)

		return table.render()
	}

	getManager() {
		return this.manager
	}
}
