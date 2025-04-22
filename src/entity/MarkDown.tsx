import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {UploadFile} from "../api/api.ts";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function MarkDown() {
    return  <MdEditor
        style={{ height: '500px' }}
        onImageUpload={UploadFile}
        renderHTML={text => mdParser.render(text)}
    />
}
