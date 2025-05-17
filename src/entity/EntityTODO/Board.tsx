// 看板组件
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {TaskCard, TaskInfo} from "./TaskCard.tsx";

export interface BoardInfo {
    id: string; // 看板id
    title: string; // 看板标题
    tasks: TaskInfo[]; // 看板下的任务列表
}

export function Board(props: {
    bord:  BoardInfo,
    onAddTask: () => void,
    onDeleteBoard: () => void,
    onEditTask: (id: string, content: string) => string,
    onToggleComplete: (id: string) => void,
    onDeleteTask: (id: string) => void,
    editingTask?: TaskInfo,
    setEditingTask: (task?: TaskInfo) =>  void
}) {
    const { id, title, tasks } = props.bord;
    const { setNodeRef } = useSortable({
        id,
        data: {
            type: 'board',
        },
    });

    return (
        <div ref={setNodeRef} className="board">
            <div className="board-header">
                <div className="board-title">{title}</div>
                <div className="board-actions">
                    <button className="board-action-btn" onClick={props.onAddTask}>
                        <span role="img" aria-label="Add Task">➕</span>
                    </button>
                    <button className="board-action-btn" onClick={props.onDeleteBoard}>
                        <span role="img" aria-label="Delete Board">🗑️</span>
                    </button>
                </div>
            </div>
            <div className="tasks-container">
                <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEditTask={props.onEditTask}
                            onToggleComplete={props.onToggleComplete}
                            onDeleteTask={props.onDeleteTask}
                            editingTask={props.editingTask}
                            setEditingTask={props.setEditingTask}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
