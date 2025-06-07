import {EntityProps} from "../common/types.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import start from 'monaco-python';
import {Button, Col, Form, Row, SideSheet, withField} from "@douyinfe/semi-ui";
import JsonEditor from "../../components/JsonEditor.tsx";
import JsonView from "../../components/JsonView.tsx";
import {EntityTrigger} from "../../api/api.ts";
import {Play} from 'lucide-react';

interface CodeInfo {
    content: string
    input: string[]
    output: string[]
}

const PythonEditor = (props: {
    value?: string,
    onChange?: (value: string | undefined) => void
}) => {
    const editor = useRef<{
        onDidChangeModelContent: (handle: () => void) => void,
        getValue: () => string,
        setValue: (value: string) => void
    } | undefined>()

    const code = useCallback(async  (ele: HTMLDivElement) => {
        // 忽略ele为空的情况
        if (!ele) {return}
        const client = await start(ele, {
            value: props.value,
            // typesheds: {'stdlib/builtins.pyi': typeDeclare},
            fontSize: 16,
        });
        editor.current = client.getEditor()
        if (editor.current) {
            editor.current.onDidChangeModelContent(() => {
                props.onChange && props.onChange(editor.current?.getValue())
            })
        }
    }, [])

    useEffect(() => {
        if (props.value && editor.current && editor.current.getValue() != props.value) {
            editor.current?.setValue(props.value)
        }
    }, [props.value])

    return <div style={{ height: '80vh' }} ref={code} />
}

const FormPythonEditor = withField(PythonEditor);

export default function EntityCode(props: EntityProps<CodeInfo>) {
    const [visible, setVisible] = useState(false)
    const [runInput, setRunInput] = useState({})
    const [runOutput, setRunOutput] = useState({})

    const entityTrigger = () => {
        EntityTrigger(props.id, runInput).then(res => {
            setRunOutput(res)
        })
    }

    return <div className={"p-2"}>
        <Form initValues={props.value} onValueChange={data => props.onChange(data, data.code)}><Row gutter={5}>
            <Col span={12}><Form.TagInput field='inputs' label='输入' /></Col>
            <Col span={11}><Form.TagInput field='outputs' label='输出' /></Col>
            <Col span={1}><Form.Slot label={'执行'}><Button onClick={() => setVisible(true)} icon={<Play />} /></Form.Slot></Col>
            <Col span={24}><FormPythonEditor field='code' label='代码' /></Col>
        </Row></Form>
        <SideSheet title="代码调试" visible={visible} onCancel={() => setVisible(false)}>
            <JsonEditor height={400} value={runInput} onChange={setRunInput} />
            <Button onClick={entityTrigger} style={{ marginTop: 10, marginBottom: 10}} block>运行</Button>
            <JsonView value={runOutput} />
        </SideSheet>
    </div>
}

