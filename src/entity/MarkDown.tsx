import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {UploadFile} from "../api/api.ts";
import {EntityProps} from "./common.ts";

const mdParser = new MarkdownIt(/* Markdown-it options */);

interface MdInfo {
    content: string
}

export default function MarkDown(props: EntityProps<MdInfo>) {
    return  <MdEditor
        style={{ height: '100%' }}
        onImageUpload={UploadFile}
        value={props.data.content}
        onChange={(data) => props.onChange({content: data.text})}
        renderHTML={text => mdParser.render(text)}
    />
}
