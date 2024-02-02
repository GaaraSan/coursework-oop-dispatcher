import { Button } from './Button'

export class Search {
	onSubmit: (text: string) => void

	constructor(onSubmit: (text: string) => void) {
		this.onSubmit = onSubmit
	}

	render() {
		const form = document.createElement('form')
		form.className = 'flex gap-x-2'

		const input = document.createElement('input')
		input.type = 'text'
		input.placeholder = 'Search'

		const button = new Button('Search', () => {})

		form.append(input)
		form.append(button.render())

		form.onsubmit = e => {
			e.preventDefault()

			this.onSubmit(input.value ?? '')
		}

		return form
	}
}
