import { StorageType } from '../utils/Storage'
import { BaseManager } from './BaseManager'
import { Passenger } from './Passenger'

export class PassengerManager implements BaseManager<Passenger> {
	items: Passenger[] = [
		new Passenger(
			'1',
			'Delphine',
			'Kovacek',
			'385-201-3239',
			53529,
			'delphine@gmail.com'
		),
		new Passenger(
			'2',
			'Joan',
			'Huels',
			'894-736-9782',
			62907,
			'joan@gmail.com'
		),
		new Passenger(
			'3',
			'Graciela',
			'Botsford',
			'875-892-5002',
			59441,
			'graciela@gmail.com'
		),
		new Passenger(
			'4',
			'Marisol',
			'Hegmann',
			'890-237-1592',
			82568,
			'marisol@gmail.com'
		),
		new Passenger(
			'5',
			'Carolina',
			'Kertzmann',
			'995-805-2774',
			72128,
			'carolina@gmail.com'
		),
		new Passenger(
			'6',
			'Melvin',
			'Jaskolski',
			'891-381-4774',
			92615,
			'melvin@gmail.com'
		),
		new Passenger(
			'7',
			'Corrine',
			'Schulist',
			'589-497-9412',
			87695,
			'corrine@gmail.com'
		),
		new Passenger(
			'8',
			'Derick',
			'Glover',
			'680-974-4140',
			96553,
			'derick@gmail.com'
		)
	]

	initializeFromStorage(
		storage: StorageType<
			{
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

		let id = 0

		this.items = itemsFromStorage.map(item => {
			const newItem = new Passenger(
				String(id),
				item.firstName,
				item.lastName,
				item.phoneNumber,
				item.passportNumber,
				item.email
			)

			id++

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
