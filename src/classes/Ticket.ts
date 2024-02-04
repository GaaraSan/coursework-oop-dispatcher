export class Ticket {
	id: string
	passenger: string
	flight: string
	position: string

	constructor(id: string, passenger: string, flight: string, position: string) {
		this.id = id
		this.passenger = passenger
		this.flight = flight
		this.position = position
	}
}
