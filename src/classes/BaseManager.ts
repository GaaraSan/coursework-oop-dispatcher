export interface BaseManager<T> {
	items: T[]
	add(data: unknown): void
	remove(id: string): void
	edit(id: string, newData: T): void
	getBySearch(search: string): void
}
