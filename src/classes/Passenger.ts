export class Passenger {
	id: string
	firstName: string
	lastName: string
	phoneNumber: string
	passportNumber: number
	email: string

	constructor(
		id: string,
		firstName: string,
		lastName: string,
		phoneNumber: string,
		passportNumber: number,
		email: string
	) {
		this.id = id
		this.firstName = firstName
		this.lastName = lastName
		this.phoneNumber = phoneNumber
		this.passportNumber = passportNumber
		this.email = email
	}
}
