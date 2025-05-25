import {useSortable} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import {useState} from "react";
import {Button, Checkbox, Input, SideSheet, Space} from "@douyinfe/semi-ui";
import {Check, Ellipsis, SquarePen, Trash2} from "lucide-react";
import MarkDown from "../../components/MarkDown.tsx";

export interface TaskInfo {
    id: string
    name: string
    desc: string
    completed: boolean
}

export function TaskCard(props: {
    task: TaskInfo,
    isDragging?: boolean,
    onEditTask: (id: string, content: string, desc: string) => void,
    onToggleComplete: (id: string) => void,
    onDeleteTask: (id: string) => void,
}) {
    const { task, isDragging, onEditTask, onToggleComplete, onDeleteTask } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [taskDescVisible, setTaskDescVisible] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    return (
        <>
            <div ref={setNodeRef} style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
            }}>
                <div className={"flex w-full justify-between"}>
                    {isEditing ? <Input value={task.name} onChange={(text) => onEditTask(task.id, text, task.desc)}/> :
                        <Checkbox
                            checked={task.completed}
                            onChange={() => onToggleComplete(task.id)}
                            disabled={isEditing}
                            extra={<span className={task.completed ? "line-through" : ""}>{task.desc ? task.desc.split('\n')[0] : ''}</span>}
                        >
                            <span
                                {...attributes}
                                {...listeners}
                                className={task.completed ? "line-through" : ""}
                            >
                                {task.name}
                            </span>
                        </Checkbox>}
                    <Space className="ml-2">
                        <Button onClick={() => setIsEditing(!isEditing)} size={"small"}
                            icon={isEditing ? <Check/> : <SquarePen/>}/>
                        <Button onClick={() => setTaskDescVisible(true)} icon={<Ellipsis/>} size={"small"}/>
                        <Button onClick={() => onDeleteTask(task.id)} size={"small"} icon={<Trash2/>}/>
                    </Space>
                </div>
            </div>
            <SideSheet closeOnEsc width={'50vw'} title={task.name} visible={taskDescVisible} onCancel={() => setTaskDescVisible(false)}>
                <MarkDown value={task.desc} onChange={(text) => onEditTask(task.id, task.name, text)} />
            </SideSheet>
        </>
    );
}
