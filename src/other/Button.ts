export class Button {
	className: string
	textContent: string
	callback: (e: MouseEvent) => void

	constructor(
		textContent: string,
		callback: (e: MouseEvent) => void,
		className: string | null = null
	) {
		this.className =
			className ??
			`px-4 py-2 rounded-lg text-slate-800 bg-slate-200 w-auto hover:bg-slate-300 transition`
		this.textContent = textContent
		this.callback = callback
	}

	render() {
		const button = document.createElement('button')
		button.className = this.className
		button.textContent = this.textContent

		button.addEventListener('click', this.callback)

		return button
	}
}
