
export interface EntityProps<T> {
    id: string
    value: T
    onChange: (data: T, desc?: string) => void
}
