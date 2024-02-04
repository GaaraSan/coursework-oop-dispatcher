import { StorageType } from '../utils/Storage'
import { BaseManager } from './BaseManager'
import { Ticket } from './Ticket'

export class TicketManager implements BaseManager<Ticket> {
	items: Ticket[] = []

	initializeFromStorage(
		storage: StorageType<
			{
				id: string
				passenger: string
				flight: string
				position: string
			}[]
		>
	) {
		const itemsFromStorage = storage.getItem()

		if (!itemsFromStorage) return

		this.items = itemsFromStorage.map(item => {
			const newItem = new Ticket(
				item.id,
				item.passenger,
				item.flight,
				item.position
			)

			return newItem
		})
	}

	add({
		passenger,
		flight,
		position
	}: {
		passenger: string
		flight: string
		position: string
	}) {
		const lastIdString = this.items.at(-1)?.id

		const lastId = lastIdString ? Number(lastIdString) + 1 : 0

		this.items.push(new Ticket(String(lastId), passenger, flight, position))
	}

	remove(id: string) {
		this.items = this.items.filter(item => item.id !== id)
	}

	edit(id: string, newElement: Ticket) {
		const itemIndex = this.items.findIndex(item => item.id === id)

		if (itemIndex === undefined) return

		this.items[itemIndex] = newElement
	}

	getBySearch(search: string) {}
}
