import { BaseManager } from '../classes/BaseManager'

export interface GUIFactory<T> {
	createOpenFormButton(): string | Node
	getSearchForRender(): HTMLFormElement
	getTableForRender(): HTMLTableElement
	getManager(): BaseManager<T>
}
