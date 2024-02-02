import { Flight } from '../classes/Flight'
import { FlightManager } from '../classes/FlightManager'
import { FlightStorage } from '../utils/FlightStorage'
import { Button } from './Button'
import { Form } from './Form'
import { GUIFactory } from './GUIFactory'
import { Search } from './Search'
import { Table } from './Table'

export class FlightFactory implements GUIFactory<unknown> {
	private storage
	private manager
	private search
	private currentTableRender: HTMLTableElement | null = null

	constructor() {
		this.manager = new FlightManager()
		this.storage = new FlightStorage()
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
				'Add new flight',
				() => {
					form.umount()
				},
				formData => {
					this.manager.add({
						fromCity: formData.fromCity,
						destination: formData.destination,
						startDate: new Date(formData.startDate),
						endDate: new Date(formData.endDate),
						price: Number(formData.price),
						seatsCount: Number(formData.seatsCount)
					})

					this.rerenderTable()
					this.storage.setItem(this.manager.items)

					form.umount()
				}
			)

			form.addInput('text', 'From city', 'fromCity')
			form.addInput('text', 'Destination', 'destination')
			form.addInput('date', 'Start date', 'startDate')
			form.addInput('date', 'End date', 'endDate')
			form.addInput('number', 'Price', 'price')
			form.addInput('number', 'Seats count', 'seatsCount')

			form.mount()
		}

		return new Button(
			'Create flight',
			callback,
			`mt-2 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 w-auto hover:bg-slate-300 transition`
		).render()
	}

	private rerenderTable(items?: Flight[]) {
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
		this.rerenderTable()
		this.storage.setItem(this.manager.items)
	}

	private onEdit = (item: (string | number | Date)[]) => {
		const [id, fromCity, destination, startDate, endDate, price, seatsCount] =
			item

		const form = new Form(
			'Update flight',
			() => {
				form.umount()
			},
			formData => {
				this.manager.edit(
					String(id),
					new Flight(
						String(id),
						formData.fromCity,
						formData.destination,
						new Date(formData.startDate),
						new Date(formData.endDate),
						Number(formData.price),
						Number(formData.seatsCount)
					)
				)

				this.rerenderTable()
				this.storage.setItem(this.manager.items)

				form.umount()
			},
			'update'
		)

		console.log(startDate, new Date(startDate))

		form.addInput('string', 'From city:', 'fromCity', String(fromCity))
		form.addInput('string', 'Destination:', 'destination', String(destination))
		form.addInput(
			'date',
			'Start date:',
			'startDate',
			new Date(startDate).toISOString().split('T')[0]
		)
		form.addInput(
			'date',
			'End date:',
			'endDate',
			new Date(endDate).toISOString().split('T')[0]
		)
		form.addInput('number', 'Price:', 'price', String(price))
		form.addInput('number', 'Seats count:', 'seatsCount', String(seatsCount))

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
		items: Flight[],
		onDelete: (item: (string | number)[]) => void,
		onEdit: (item: (string | number)[]) => void
	) {
		const HEADS = [
			'ID',
			'City from',
			'Destination',
			'Start date',
			'End date',
			'Price',
			'Seats count'
		]

		const ITEMS = items.map(item => {
			return [
				item.id,
				item.fromCity,
				item.destination,
				item.startDate.toISOString().split('T')[0],
				item.endDate.toISOString().split('T')[0],
				item.price,
				item.seatsCount
			]
		})

		const table = new Table(HEADS, ITEMS, onDelete, onEdit)

		return table.render()
	}

	getManager() {
		return this.manager
	}
}
