export class Flight {
	id: string
	fromCity: string
	destination: string
	startDate: Date
	endDate: Date
	price: number
	seatsCount: number

	constructor(
		id: string,
		fromCity: string,
		destination: string,
		startDate: Date,
		endDate: Date,
		price: number,
		seatsCount: number
	) {
		this.id = id
		this.fromCity = fromCity
		this.destination = destination
		this.startDate = startDate
		this.endDate = endDate
		this.price = price
		this.seatsCount = seatsCount
	}
}
