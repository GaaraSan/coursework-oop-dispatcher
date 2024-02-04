import { faker } from '@faker-js/faker'
import { App } from './App'
import { PassengerStorage } from './utils/PassengerStorage'
import { FlightStorage } from './utils/FlightStorage'
import { TicketStorage } from './utils/TicketStorage'

const app = new App('#app')

app.render()

// @ts-expect-error
window.initialize = () => {
	const passengerStorage = new PassengerStorage()
	const flightStorage = new FlightStorage()
	const ticketStorage = new TicketStorage()

	const passengers = Array.from({ length: 100 })
		.fill(null)
		.map(() => ({
			id: String(
				faker.number.int({
					min: 0,
					max: 9999999
				})
			),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			phoneNumber: faker.phone.number('+38(0##)###-##-##'),
			passportNumber: faker.number.int({
				max: 9999999,
				min: 1000000
			}),
			email: faker.internet.email()
		}))

	const flights = Array.from({ length: 100 })
		.fill(null)
		.map(() => {
			const startDate = faker.date.between({
				from: '2024-02-05T00:00:00.000Z',
				to: '2025-02-05T00:00:00.000Z'
			})

			const endDate = new Date(
				startDate.getTime() +
					faker.number.int({
						max: 6 * 60,
						min: 50
					}) *
						1000 *
						60
			)

			return {
				id: String(
					faker.number.int({
						min: 0,
						max: 9999999
					})
				),
				fromCity: faker.location.cityName(),
				destination: faker.location.cityName(),
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				price: faker.number.int({
					max: 2000,
					min: 100
				}),
				seatsCount: faker.number.int({
					max: 200,
					min: 50
				})
			}
		})

	passengerStorage.setItem(passengers)
	flightStorage.setItem(flights)

	const tickets = Array.from({ length: 100 })
		.fill(null)
		.map(() => {
			const randomFlight = flights[Math.floor(Math.random() * flights.length)]
			const randomPassengerId =
				passengers[Math.floor(Math.random() * passengers.length)].id

			console.log(randomFlight.id, randomPassengerId)
			return {
				id: String(
					faker.number.int({
						min: 0,
						max: 9999999
					})
				),
				passenger: randomPassengerId,
				flight: randomFlight.id,
				position: String(
					faker.number.int({
						min: 0,
						max: randomFlight.seatsCount
					})
				)
			}
		})

	console.log(tickets)

	ticketStorage.setItem(tickets)
}
