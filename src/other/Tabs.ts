import { Button } from './Button'

interface Tab {
	title: string
	callback: () => void
	active: boolean
}

export class Tabs {
	private tabs: Tab[] = []

	addTab(title: string, callback: () => void) {
		this.tabs.push({
			title,
			callback,
			active: false
		})
	}

	setActive(title: string) {
		this.tabs = this.tabs.map(tab => {
			if (tab.title === title) {
				return {
					...tab,
					active: true
				}
			}

			return {
				...tab,
				active: false
			}
		})
	}

	private generateButton(tabInfo: Tab) {
		return new Button(
			tabInfo.title,
			tabInfo.callback,
			`px-4 py-2 rounded-lg text-slate-800 bg-slate-200 w-auto hover:bg-slate-300 transition  ${tabInfo.active ? 'bg-red-200' : ''}`
		).render()
	}

	getForRender() {
		const div = document.createElement('div')
		div.className = 'flex gap-x-2'

		const buttons = this.tabs.map(tab => this.generateButton(tab))

		div.append(...buttons)

		return div
	}
}
