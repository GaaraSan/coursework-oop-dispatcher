import { FlightFactory } from './other/FlightFactory'
import { GUIFactory } from './other/GUIFactory'
import { PassengerFactory } from './other/PassengerFactory'
import { Tabs } from './other/Tabs'
import { TicketFactory } from './other/TicketFactory'

export class App {
	root: Element

	private factory: GUIFactory<any>
	private tabs: Tabs

	constructor(rootId: string) {
		this.root = document.querySelector(rootId)!

		const tabs = new Tabs()

		const addPassengerTab = () => {
			this.factory = new PassengerFactory()
			this.tabs.setActive('Passenger')
			this.render()
		}

		const addTicketTab = () => {
			this.factory = new TicketFactory()
			this.tabs.setActive('Ticket')
			this.render()
		}

		const addFlightTab = () => {
			this.factory = new FlightFactory()
			this.tabs.setActive('Flight')
			this.render()
		}

		tabs.addTab('Passenger', addPassengerTab)
		tabs.addTab('Ticket', addTicketTab)
		tabs.addTab('Flight', addFlightTab)

		this.tabs = tabs

		this.factory = new PassengerFactory()
		this.tabs.setActive('Passenger')
		this.render()
	}

	render() {
		this.root.innerHTML = ''
		this.root.className = 'm-4'
		this.root.append(this.tabs.getForRender())
		this.root.append(this.factory.createOpenFormButton())
		this.root.append(this.factory.getSearchForRender())
		this.root.append(this.factory.getTableForRender())
	}
}
