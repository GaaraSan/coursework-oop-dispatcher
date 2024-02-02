import { Passenger } from '../classes/Passenger'
import { Storage } from './Storage'

export class PassengerStorage {
	storage: Storage

	constructor() {
		this.storage = new Storage('passenger')
	}

	setItem(data: Passenger[]) {
		this.storage.setItem(JSON.stringify(data))
	}

	getItem() {
		const data = this.storage.getItem()

		return data ? (JSON.parse(data) as Passenger[]) : []
	}
}
