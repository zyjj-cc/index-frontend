import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {UploadFile} from "../api/api.ts";
import {EntityProps} from "./common.ts";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MdInfo {
    content: string
}

export default function EntityMarkDown(props: EntityProps<MdInfo>) {
    return  <MdEditor
        style={{ height: '100%' }}
        view={{menu: true, md: false, html: true}}
        onImageUpload={UploadFile}
        defaultValue={props.value.content}
        onChange={(data) => props.onChange({content: data.text})}
        renderHTML={text => <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>}
    />
}
