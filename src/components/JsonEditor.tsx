import {useCallback, useEffect, useRef} from "react";
import JSONEditor from "jsoneditor";
import 'jsoneditor/dist/jsoneditor.css'
import {isEqual} from "lodash-es";

export default function JsonEditor(props: {
    value?: any,
    onChange?: (data: any) => void
    height?: number
}) {
    const jsonEditor = useRef<JSONEditor | null>(null)
    const json  = useRef()

    const editorRef = useCallback((ele: HTMLDivElement) => {
        if (!ele || jsonEditor.current) return
        jsonEditor.current = new JSONEditor(ele, {
            statusBar: false,
            onChange: () => {
                try {
                    const value = jsonEditor.current?.get()
                    json.current = value
                    props.onChange && props.onChange(value)
                } catch (e) {
                    console.log('[jsonEditor] error', e)
                }
            }
        })
        jsonEditor.current.setMode('code')
        jsonEditor.current.set({})
    }, [])

    // 只有当editor有值的时候才更新
    useEffect(() => {
        if (jsonEditor.current && !isEqual(props.value, json.current)) {
            jsonEditor.current.set(props.value)
        }
    }, [props.value])

    return <div style={{height: props.height ? props.height : '100%', width: '100%'}} ref={editorRef}/>
}
