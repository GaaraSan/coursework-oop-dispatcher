import { Storage } from './Storage'

export class TicketStorage {
	storage: Storage

	constructor() {
		this.storage = new Storage('ticket')
	}

	setItem(
		data: {
			passenger: string
			flight: string
			position: string
		}[]
	) {
		this.storage.setItem(JSON.stringify(data))
	}

	getItem() {
		const data = this.storage.getItem()

		return data
			? (JSON.parse(data) as {
					passenger: string
					flight: string
					position: string
				}[])
			: []
	}
}
