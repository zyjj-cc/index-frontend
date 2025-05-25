
export interface EntityProps<T> {
    id: string
    value: T
    onChange: (data: T) => void
}
