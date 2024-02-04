import { FlightManager } from '../classes/FlightManager'
import { PassengerManager } from '../classes/PassengerManager'
import { Ticket } from '../classes/Ticket'
import { TicketManager } from '../classes/TicketManager'
import { FlightStorage } from '../utils/FlightStorage'
import { PassengerStorage } from '../utils/PassengerStorage'
import { TicketStorage } from '../utils/TicketStorage'
import { Button } from './Button'
import { Form } from './Form'
import { GUIFactory } from './GUIFactory'
import { Search } from './Search'
import { Table, TableItem } from './Table'

export class TicketFactory implements GUIFactory<unknown> {
	private manager
	private storage
	private search
	private currentTableRender: HTMLElement | null = null

	private passengerManager
	private flightManager

	constructor() {
		this.manager = new TicketManager()
		this.storage = new TicketStorage()
		this.search = new Search(this.onSearchChange.bind(this))

		this.passengerManager = new PassengerManager()
		this.flightManager = new FlightManager()

		this.manager.initializeFromStorage(this.storage as any)
	}

	private onSearchChange(text: string) {
		const itemsForRender = this.manager.items.filter(item => {
			const passengerInfo = this.getPassengerById(item.passenger)
			const flightInfo = this.getFlightById(item.flight)

			if (!passengerInfo || !flightInfo) return null

			const passengerHTML = [
				passengerInfo.id,
				passengerInfo.firstName,
				passengerInfo.lastName,
				passengerInfo.passportNumber
			].join('')

			const flightHTML = [
				flightInfo.id,
				flightInfo.startDate.toLocaleString('en-GB'),
				flightInfo.endDate.toLocaleString('en-GB'),
				flightInfo.fromCity,
				flightInfo.destination
			].join()

			const BIG_BIG_STRING = [item.id, item.position, flightHTML, passengerHTML]
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

			const passengerValues = this.passengerManager.items.map(item => {
				return {
					title: `${item.id} | ${item.firstName} ${item.lastName} | ${item.passportNumber}`,
					value: item.id
				}
			})

			const flightValues = this.flightManager.items.map(item => {
				return {
					title: `${item.id} | ${item.fromCity} => ${item.destination} | ${item.startDate.toLocaleString('en-GB')} => ${item.endDate.toLocaleString('en-GB')}`,
					value: item.id
				}
			})

			form.addSelect('Passenger', 'passenger', passengerValues)
			form.addSelect('Flight', 'flight', flightValues)

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

	private onDelete = (item: TableItem<string | number>[]) => {
		console.log('onDelete')
		const id = item[0]

		this.manager.remove(id.content as string)
		this.storage.setItem(this.manager.items)

		this.rerenderTable()
	}

	private onEdit = (item: TableItem<string | number>[]) => {
		const [id, passenger, flight, position] = item

		const form = new Form(
			'Update ticket',
			() => {
				form.umount()
			},
			formData => {
				this.manager.edit(
					String(id.content),
					new Ticket(
						String(id.content),
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

		const passengerValues = this.passengerManager.items.map(item => {
			return {
				title: `${item.id} | ${item.firstName} ${item.lastName} | ${item.passportNumber}`,
				value: item.id
			}
		})

		const flightValues = this.flightManager.items.map(item => {
			return {
				title: `${item.id} | ${item.fromCity} => ${item.destination} | ${item.startDate.toLocaleString('en-GB')} => ${item.endDate.toLocaleString('en-GB')}`,
				value: item.id
			}
		})

		form.addSelect(
			'Passenger',
			'passenger',
			passengerValues,
			String(passenger.id)
		)
		form.addSelect('Flight', 'flight', flightValues, String(flight.id))
		form.addInput('tel', 'Position', 'position', String(position.content))

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

	private getPassengerById(id: string) {
		this.passengerManager.initializeFromStorage(new PassengerStorage() as any)

		return this.passengerManager.items.find(item => item.id === id)
	}

	private getFlightById(id: string) {
		this.flightManager.initializeFromStorage(new FlightStorage() as any)

		return this.flightManager.items.find(item => item.id === id)
	}

	private createTable(
		items: Ticket[],
		onDelete: (item: TableItem<string | number>[]) => void,
		onEdit: (item: TableItem<string | number>[]) => void
	) {
		const HEADS = [
			{ title: 'ID', name: 'id' },
			{ title: 'Passenger', name: 'passenger' },
			{ title: 'Flight', name: 'flight' },
			{ title: 'Position', name: 'position' }
		]

		const ITEMS = items
			.map(item => {
				const passengerInfo = this.getPassengerById(item.passenger)
				const flightInfo = this.getFlightById(item.flight)

				if (!passengerInfo || !flightInfo) return null

				const passengerHTML = `
					<div class="flex gap-x-2 justify-between px-4 py-1 rounded-lg bg-emerald-200">
						<div class="flex gap-x-2">
							<div class="text-emerald-800">${passengerInfo.id}</div>
							<div class="justify-start flex gap-x-2">
								<div class="text-slate-800">${passengerInfo.firstName}</div>
								<div class="text-slate-800">${passengerInfo.lastName}</div>
							</div>
						</div>
						<div class="text-slate-500">${passengerInfo.passportNumber}</div>
					</div>
				`

				const flightHTML = `
					<div class="flex gap-x-4 justify-between px-4 py-1 rounded-lg bg-sky-200">
						<div class="flex gap-x-2">
							<div class="text-sky-800">${flightInfo.id}</div>
							<div class="justify-start flex gap-x-1">
								<div class="text-slate-800">${flightInfo.startDate.toLocaleString('en-GB')}</div>
								<div class="text-sky-400">-></div>
								<div class="text-slate-800">${flightInfo.endDate.toLocaleString('en-GB')}</div>
							</div>
						</div>
						<div class="flex gap-x-1">
							<div class="text-sky-700">${flightInfo.fromCity}</div>
							<div class="text-sky-400">-></div>
							<div class="text-sky-700">${flightInfo.destination}</div>
						</div>
					</div>
				`

				const passengerForSort = [
					passengerInfo.id,
					passengerInfo.firstName,
					passengerInfo.lastName,
					passengerInfo.passportNumber
				].join('')

				const flightForSort = [
					flightInfo.id,
					flightInfo.startDate.toLocaleString('en-GB'),
					flightInfo.endDate.toLocaleString('en-GB'),
					flightInfo.fromCity,
					flightInfo.destination
				].join()

				return [
					{ id: 'id', content: item.id, textForSort: item.id },
					{
						id: passengerInfo.id,
						content: passengerHTML,
						textForSort: passengerForSort
					},
					{
						id: flightInfo.id,
						content: flightHTML,
						textForSort: flightForSort
					},
					{ id: 'position', content: item.position, textForSort: item.position }
				]
			})
			.filter(item => item !== null) as TableItem<string>[][]

		const table = new Table(HEADS, ITEMS, onDelete, onEdit)

		return table.render()
	}

	getManager() {
		return this.manager
	}
}
