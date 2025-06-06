// 看板组件
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {TaskCard, TaskInfo} from "./TaskCard.tsx";
import {Button, Card, Input, Space} from "@douyinfe/semi-ui";
import {Check, Plus, SquarePen, Trash2} from "lucide-react";
import {useState} from "react";

export interface BoardInfo {
    id: string; // 看板id
    title: string; // 看板标题
    tasks: TaskInfo[]; // 看板下的任务列表
}

export function Board(props: {
    bord:  BoardInfo,                                   // 看板信息
    onAddTask: () => void,                              // 添加新任务
    onDeleteBoard: () => void,                          // 删除看板
    onEditBoard: (name: string) => void,                // 修改看板名称
    onEditTask: (id: string, name: string, desc: string) => void,  // 修改任务内容
    onToggleComplete: (id: string) => void,             // 切换任务完成状态
    onDeleteTask: (id: string) => void,                 // 删除任务
}) {
    const { id, title, tasks } = props.bord;
    const [isEditingBoard, setIsEditingBoard] = useState(false);

    const { setNodeRef } = useSortable({id, data: {type: 'board'}});

    return (
        <div ref={setNodeRef} className={"w-100"}>
            <Card
                title={isEditingBoard ?  <Input value={title} onEnterPress={() => setIsEditingBoard(false)} onChange={props.onEditBoard} />: title}
                headerExtraContent={<Space>
                    <Button onClick={() => setIsEditingBoard(!isEditingBoard)} icon={isEditingBoard ? <Check />:<SquarePen />} />
                    <Button onClick={props.onAddTask} icon={<Plus />} />
                    <Button onClick={props.onDeleteBoard} icon={<Trash2 />} />
                </Space>}
            >
                <div className={"flex-grow flex flex-col gap-2.5"}>
                    <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEditTask={props.onEditTask}
                                onToggleComplete={props.onToggleComplete}
                                onDeleteTask={props.onDeleteTask}
                            />
                        ))}
                    </SortableContext>
                </div>
            </Card>
        </div>
    );
}
