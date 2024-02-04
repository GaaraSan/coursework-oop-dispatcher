import { Flight } from '../classes/Flight'
import { Storage } from './Storage'

export class FlightStorage {
	storage: Storage

	constructor() {
		this.storage = new Storage('flight')
	}

	setItem(data: Flight[]) {
		this.storage.setItem(JSON.stringify(data))
	}

	getItem() {
		const data = this.storage.getItem()

		return data ? (JSON.parse(data) as Flight[]) : []
	}
}
