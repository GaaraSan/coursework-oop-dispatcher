export interface StorageType<T> {
	getItem: () => T
	setItem: (data: T[]) => void
}

export interface InnerStorageType {
	getItem: (key: string) => string
	setItem: (key: string, value: string) => void
}

export class Storage {
	key: string
	innerStorage: InnerStorageType

	constructor(
		key: string,
		innerStorage: InnerStorageType = localStorage as unknown as InnerStorageType
	) {
		this.key = key
		this.innerStorage = innerStorage
	}

	getItem() {
		return this.innerStorage.getItem(this.key)
	}

	setItem(value: string) {
		this.innerStorage.setItem(this.key, value)
	}
}
