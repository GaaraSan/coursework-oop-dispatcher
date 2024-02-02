import { Passenger } from '../classes/Passenger'
import { PassengerManager } from '../classes/PassengerManager'
import { PassengerStorage } from '../utils/PassengerStorage'
import { Button } from './Button'
import { Form } from './Form'
import { GUIFactory } from './GUIFactory'
import { Search } from './Search'
import { Table } from './Table'

export class PassengerFactory implements GUIFactory<Passenger> {
	private manager
	private storage
	private search
	private currentTableRender: HTMLTableElement | null = null

	constructor() {
		this.manager = new PassengerManager()
		this.storage = new PassengerStorage()
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
				'Add new passenger',
				() => {
					form.umount()
				},
				formData => {
					this.manager.add({
						firstName: formData.firstName,
						lastName: formData.lastName,
						phoneNumber: formData.phoneNumber,
						passportNumber: Number(formData.passportNumber),
						email: formData.email
					})

					this.rerenderTable()
					this.storage.setItem(this.manager.items)

					form.umount()
				}
			)

			form.addInput('text', 'First name:', 'firstName')
			form.addInput('text', 'Last name:', 'lastName')
			form.addInput('tel', 'Phone number:', 'phoneNumber')
			form.addInput('number', 'Passport number:', 'passportNumber')
			form.addInput('email', 'Email:', 'email')

			form.mount()
		}

		return new Button(
			'Create passenger',
			callback,
			`mt-2 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 w-auto hover:bg-slate-300 transition`
		).render()
	}

	private rerenderTable(items?: Passenger[]) {
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

	private onEdit = (item: (string | number)[]) => {
		const [id, firstName, lastName, phoneNumber, passportNumber, email] = item

		const form = new Form(
			'Update passenger',
			() => {
				form.umount()
			},
			formData => {
				this.manager.edit(
					String(id),
					new Passenger(
						String(id),
						formData.firstName,
						formData.lastName,
						formData.phoneNumber,
						Number(formData.passportNumber),
						formData.email
					)
				)

				this.rerenderTable()
				this.storage.setItem(this.manager.items)

				form.umount()
			},
			'update'
		)

		form.addInput('text', 'First name:', 'firstName', String(firstName))
		form.addInput('text', 'Last name:', 'lastName', String(lastName))
		form.addInput('tel', 'Phone number:', 'phoneNumber', String(phoneNumber))
		form.addInput(
			'number',
			'Passport number:',
			'passportNumber',
			String(passportNumber)
		)
		form.addInput('email', 'Email:', 'email', String(email))

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
		items: Passenger[],
		onDelete: (item: (string | number)[]) => void,
		onEdit: (item: (string | number)[]) => void
	) {
		const HEADS = [
			'ID',
			'First name',
			'Last name',
			'Phone number',
			'Passport number',
			'Email'
		]

		const ITEMS = items.map(item => {
			return [
				item.id,
				item.firstName,
				item.lastName,
				item.phoneNumber,
				item.passportNumber,
				item.email
			]
		})

		const table = new Table(HEADS, ITEMS, onDelete, onEdit)

		return table.render()
	}

	getManager() {
		return this.manager
	}
}
