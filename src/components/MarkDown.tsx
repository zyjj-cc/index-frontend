import Vditor from "vditor";
import "vditor/dist/index.css";
import {useEffect, useRef} from "react";
import {UploadFile} from "../api/api.ts";


export default function MarkDown (props: {
    value: string,
    onChange?: (value: string) => void,
}) {
    const vditor = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!vditor.current) {return}
        const editor = new Vditor(vditor.current, {
            toolbar: ["undo", "redo", "|", "headings", "bold", "italic", "strike", "|", "line", "quote", "list", "ordered-list", "check", "outdent", "indent", "code", "inline-code", "upload", "link", "table", "fullscreen"],
            cache: {id: 'vditor'},
            mode: 'wysiwyg',
            input: props.onChange,
            preview: {
                hljs: {
                    style: 'github-dark',
                    lineNumber: true,
                }
            },
            upload: {
                handler: (files: File[]) => {
                    if (!files.length) {return "请上传文件"}
                    const file = files[0];
                    UploadFile(file).then((data) => editor.insertValue(`![${file.name}](${data})`))
                    return null
                },
            },
            after() {editor.setValue(props.value)},
        })


        return () => {
            editor.destroy()
        }
    }, [])


    return <div className={"w-full"} ref={vditor} />
}
