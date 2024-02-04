import { Flight } from '../classes/Flight'
import { FlightManager } from '../classes/FlightManager'
import { TicketManager } from '../classes/TicketManager'
import { FlightStorage } from '../utils/FlightStorage'
import { TicketStorage } from '../utils/TicketStorage'
import { Button } from './Button'
import { Form } from './Form'
import { GUIFactory } from './GUIFactory'
import { Search } from './Search'
import { Table, TableItem } from './Table'

export class FlightFactory implements GUIFactory<unknown> {
	private storage
	private manager
	private search
	private ticketManager: TicketManager
	private currentTableRender: HTMLElement | null = null

	constructor() {
		this.manager = new FlightManager()
		this.storage = new FlightStorage()

		this.ticketManager = new TicketManager()
		this.ticketManager.initializeFromStorage(new TicketStorage() as any)

		this.search = new Search(this.onSearchChange.bind(this))

		this.manager.initializeFromStorage(this.storage as any)
	}

	private onSearchChange(text: string) {
		const itemsForRender = this.manager.items.filter(item => {
			const BIG_BIG_STRING = Object.values(item)
				.map(element => {
					if (element instanceof Date) {
						return element.toLocaleString('en-GB')
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

	private onDelete = (item: TableItem<string | number>[]) => {
		console.log('onDelete')
		const id = item[0]

		this.manager.remove(id.content as string)
		this.rerenderTable()
		this.storage.setItem(this.manager.items)
	}

	private onEdit = (item: TableItem<string | number | Date>[]) => {
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
						String(id.content),
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

		console.log(startDate, new Date(startDate.content))

		form.addInput('string', 'From city:', 'fromCity', String(fromCity.content))
		form.addInput(
			'string',
			'Destination:',
			'destination',
			String(destination.content)
		)

		form.addInput(
			'datetime-local',
			'Start date:',
			'startDate',
			new Date(
				new Date(startDate.id).getTime() -
					new Date(startDate.id).getTimezoneOffset() * 60000
			)
				.toISOString()
				.slice(0, -5)
		)
		form.addInput(
			'datetime-local',
			'End date:',
			'endDate',
			new Date(
				new Date(endDate.id).getTime() -
					new Date(endDate.id).getTimezoneOffset() * 60000
			)
				.toISOString()
				.slice(0, -5)
		)
		form.addInput('number', 'Price:', 'price', String(price.content))
		form.addInput(
			'number',
			'Seats count:',
			'seatsCount',
			String(seatsCount.content)
		)

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
		onDelete: (item: TableItem<string | number>[]) => void,
		onEdit: (item: TableItem<string | number>[]) => void
	) {
		const HEADS = [
			{ title: 'ID', name: 'id' },
			{ title: 'City from', name: 'cityFrom' },
			{ title: 'Destination', name: 'destination' },
			{ title: 'Start date', name: 'startDate' },
			{ title: 'End date', name: 'endDate' },
			{ title: 'Price', name: 'price' },
			{ title: 'Seats count', name: 'seatsCount' },
			{ title: 'Free seats', name: 'freeSeatsCount' }
		]

		const ITEMS = items.map(item => {
			const ticketsItemsByFlightIdFiltered = this.ticketManager.items.filter(
				ticket => ticket.flight === item.id
			)

			return [
				{ id: 'id', content: item.id, textForSort: item.id },
				{ id: 'fromCity', content: item.fromCity, textForSort: item.fromCity },
				{
					id: 'destination',
					content: item.destination,
					textForSort: item.destination
				},
				{
					id: item.startDate.toISOString(),
					content: item.startDate.toLocaleString('en-GB'),
					textForSort: item.startDate.toLocaleString('en-GB')
				},
				{
					id: item.endDate.toISOString(),
					content: item.endDate.toLocaleString('en-GB'),
					textForSort: item.endDate.toLocaleString('en-GB')
				},
				{ id: 'price', content: item.price, textForSort: item.price },
				{
					id: 'seatsCount',
					content: item.seatsCount,
					textForSort: item.seatsCount
				},
				{
					id: 'seatsCount',
					content: item.seatsCount - ticketsItemsByFlightIdFiltered.length,
					textForSort: item.seatsCount - ticketsItemsByFlightIdFiltered.length
				}
			]
		})

		const table = new Table<string | number>(HEADS, ITEMS, onDelete, onEdit)

		return table.render()
	}

	getManager() {
		return this.manager
	}
}
