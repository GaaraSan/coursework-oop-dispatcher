import { StorageType } from '../utils/Storage'
import { BaseManager } from './BaseManager'
import { Passenger } from './Passenger'

export class PassengerManager implements BaseManager<Passenger> {
	items: Passenger[] = []

	initializeFromStorage(
		storage: StorageType<
			{
				id: string
				firstName: string
				lastName: string
				phoneNumber: string
				passportNumber: number
				email: string
			}[]
		>
	) {
		const itemsFromStorage = storage.getItem()

		if (!itemsFromStorage) return

		this.items = itemsFromStorage.map(item => {
			const newItem = new Passenger(
				item.id,
				item.firstName,
				item.lastName,
				item.phoneNumber,
				item.passportNumber,
				item.email
			)

			return newItem
		})
	}

	add({
		firstName,
		lastName,
		phoneNumber,
		passportNumber,
		email
	}: {
		firstName: string
		lastName: string
		phoneNumber: string
		passportNumber: number
		email: string
	}) {
		const lastIdString = this.items.at(-1)?.id

		const lastId = lastIdString ? Number(lastIdString) + 1 : 0

		this.items.push(
			new Passenger(
				String(lastId),
				firstName,
				lastName,
				phoneNumber,
				passportNumber,
				email
			)
		)
	}

	remove(id: string) {
		this.items = this.items.filter(item => item.id !== id)
	}

	edit(id: string, newPassenger: Passenger) {
		const itemIndex = this.items.findIndex(item => item.id === id)

		console.log(itemIndex, id, this.items)

		if (itemIndex === undefined) return

		this.items[itemIndex] = newPassenger
	}

	getBySearch(search: string) {}
}
