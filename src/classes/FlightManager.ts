import { StorageType } from '../utils/Storage'
import { BaseManager } from './BaseManager'
import { Flight } from './Flight'

export class FlightManager implements BaseManager<Flight> {
	items: Flight[] = []

	initializeFromStorage(
		storage: StorageType<
			{
				fromCity: string
				destination: string
				startDate: string
				endDate: string
				price: number
				seatsCount: number
			}[]
		>
	) {
		const itemsFromStorage = storage.getItem()

		if (!itemsFromStorage) return

		let id = 0

		this.items = itemsFromStorage.map(item => {
			const newItem = new Flight(
				String(id),
				item.fromCity,
				item.destination,
				new Date(item.startDate),
				new Date(item.endDate),
				Number(item.price),
				Number(item.seatsCount)
			)

			id++

			return newItem
		})
	}

	add({
		fromCity,
		destination,
		startDate,
		endDate,
		price,
		seatsCount
	}: {
		fromCity: string
		destination: string
		startDate: Date
		endDate: Date
		price: number
		seatsCount: number
	}) {
		const lastIdString = this.items.at(-1)?.id

		const lastId = lastIdString ? Number(lastIdString) + 1 : 0

		this.items.push(
			new Flight(
				String(lastId),
				fromCity,
				destination,
				startDate,
				endDate,
				price,
				seatsCount
			)
		)
	}

	remove(id: string) {
		this.items = this.items.filter(item => item.id !== id)
	}

	edit(id: string, newElement: Flight) {
		const itemIndex = this.items.findIndex(item => item.id === id)

		if (itemIndex === undefined) return

		this.items[itemIndex] = newElement
	}

	getBySearch(search: string) {}
}
