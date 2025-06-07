import {BrainCircuit, Code, FileJson, FileText, Folder, LetterText, ListTodo, Table} from "lucide-react";

export interface EntityProps<T> {
    id: string
    value: T
    onChange: (data: T, desc?: string) => void
}

export const entityTypeMap = new Map<number, {label: string, icon: any}>([
    [0, {label: '文件夹', icon: <Folder />}],
    [1, {label: '文本', icon: <LetterText />}],
    [2, {label: '知识库', icon: <BrainCircuit />}],
    [3, {label: '表格', icon: <Table />}],
    [4, {label: 'TODO', icon: <ListTodo />}],
    [5, {label: '代码', icon: <Code />}],
    [6, {label: 'JSON', icon: <FileJson />}],
    [7, {label: 'MarkDown', icon: <FileText />}],
])
