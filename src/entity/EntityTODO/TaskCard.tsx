import {useSortable} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import {useState} from "react";
import {Button, Checkbox, Input, SideSheet, Space, Popover} from "@douyinfe/semi-ui";
import {Check, Ellipsis, SquarePen, Trash2} from "lucide-react";
import MarkDownEditor from "../../components/MarkDownEditor.tsx";
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
                    {isEditing ? <Input value={task.name} onEnterPress={() => setIsEditing(false)} onChange={(text) => onEditTask(task.id, text, task.desc)}/> :
                        <Checkbox
                            checked={task.completed}
                            onChange={() => onToggleComplete(task.id)}
                            disabled={isEditing}
                            extra={
                                <Popover
                                    content={
                                        <div onClick={(e) => e.stopPropagation()} className={"p-6"}>
                                            <MarkDown value={task.desc} />
                                        </div>
                                    }
                                >
                                    <span className={task.completed ? "line-through" : ""}>{task.desc ? task.desc.split('\n')[0] : ''}</span>
                                </Popover>
                            }
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
                        <Button
                            onClick={() => setIsEditing(!isEditing)} size={"small"}
                            icon={isEditing ? <Check/> : <SquarePen/>}
                        />
                        <Button onClick={() => setTaskDescVisible(true)} icon={<Ellipsis/>} size={"small"}/>
                        <Button onClick={() => onDeleteTask(task.id)} size={"small"} icon={<Trash2/>}/>
                    </Space>
                </div>
            </div>
            <SideSheet closeOnEsc width={'50vw'} title={task.name} visible={taskDescVisible} onCancel={() => setTaskDescVisible(false)}>
                <MarkDownEditor value={task.desc} onChange={(text) => onEditTask(task.id, task.name, text)} />
            </SideSheet>
        </>
    );
}
