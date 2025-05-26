import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkDown (props: {
    value: string,
}) {
    return <Markdown remarkPlugins={[remarkGfm]}>{props.value}</Markdown>
}
