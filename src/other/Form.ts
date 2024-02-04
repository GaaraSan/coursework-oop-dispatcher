export class Form {
	title: string
	onClose: () => void
	onSubmit: (formData: Record<string, string>) => void
	type: 'create' | 'update' = 'create'
	intialData: Record<string, string>

	private inputs: HTMLLabelElement[] = []
	private mountedForm: HTMLDivElement | null = null
	private root = document.querySelector('#app') as Element

	constructor(
		title: string,
		onClose: () => void,
		onSubmit: (formData: Record<string, string>) => void,
		type: 'create' | 'update' = 'create',
		intialData: Record<string, string> = {}
	) {
		this.title = title
		this.onClose = onClose
		this.onSubmit = onSubmit
		this.type = type
		this.intialData = intialData
	}

	addInput(type: string, name: string, innerValue: string, value: string = '') {
		const labelElement = document.createElement('label')
		labelElement.className = 'flex justify-between items-center gap-x-2'

		const labelTextNode = document.createTextNode(name)
		labelElement.appendChild(labelTextNode)

		const inputElement = document.createElement('input')
		inputElement.className = 'p-1 border rounded'

		inputElement.type = type
		inputElement.name = innerValue
		inputElement.value = value

		labelElement.appendChild(inputElement)
		this.inputs.push(labelElement)
	}

	addSelect(
		title: string,
		name: string,
		options: {
			title: string
			value: string
		}[],
		defaultValue?: string
	) {
		const labelElement = document.createElement('label')
		labelElement.className = 'flex justify-between items-center gap-x-2'

		const labelTextNode = document.createTextNode(title)
		labelElement.appendChild(labelTextNode)

		const select = document.createElement('select')
		select.className = 'p-1 border rounded'
		select.name = name

		const optionsElement = options.map(option => {
			const optionElement = document.createElement('option')

			optionElement.textContent = option.title
			optionElement.value = option.value

			return optionElement
		})

		select.append(...optionsElement)

		if (defaultValue) select.value = defaultValue

		labelElement.appendChild(select)
		this.inputs.push(labelElement)
	}

	mount() {
		const wrapper = document.createElement('div')
		wrapper.className = `absolute left-0 w-full h-full top-[${document.documentElement.scrollTop}px]`
		document.body.style.overflow = 'hidden'

		const content = document.createElement('div')
		content.className =
			'm-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'

		const backdrop = document.createElement('div')
		backdrop.className = `absolute left-0 w-full h-full bg-slate-500 opacity-40`

		backdrop.onclick = () => this.onClose()

		wrapper.append(backdrop)

		const formElement = document.createElement('form')
		formElement.className =
			'flex flex-col gap-y-4 p-4 rounded-md shadow-md bg-white'

		const title = document.createElement('h2')
		title.className = 'text-xl text-center'
		title.textContent = this.title

		formElement.append(title)

		const inputGroupElement = document.createElement('div')
		inputGroupElement.className = 'flex flex-col gap-y-2'

		inputGroupElement.append(...this.inputs)
		formElement.appendChild(inputGroupElement)

		formElement.onsubmit = e => {
			e.preventDefault()

			const data = Object.fromEntries(new FormData(formElement).entries())

			this.onSubmit(data as Record<string, string>)
		}

		const buttonElement = document.createElement('button')
		buttonElement.className =
			'rounded-md bg-green-200 text-green-800 py-2 hover:bg-green-300'

		buttonElement.appendChild(
			document.createTextNode(this.type === 'update' ? 'Update' : 'Create')
		)
		formElement.appendChild(buttonElement)
		content.appendChild(formElement)

		wrapper.append(content)

		this.mountedForm = wrapper
		this.root.append(wrapper)

		return wrapper
	}

	umount() {
		this.mountedForm?.remove()
		document.body.style.overflow = 'auto'
	}
}
