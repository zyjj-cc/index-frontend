import {useSortable} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import {useState} from "react";
import {Button} from "@douyinfe/semi-ui";

export interface TaskInfo {
    id: string
    content: string
    completed: boolean
}

export function TaskCard(props: {
    task: TaskInfo,
    isDragging?: boolean,
    onEditTask: (id: string, content: string) => string,
    onToggleComplete: (id: string) => void,
    onDeleteTask: (id: string) => void,
    editingTask?: TaskInfo,
    setEditingTask: (task?: TaskInfo) =>  void
}) {
    const { task, isDragging, onEditTask, onToggleComplete, onDeleteTask, editingTask, setEditingTask } = props;
    const [editContent, setEditContent] = useState(task.content);
    const isEditing = editingTask && editingTask.id === task.id;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleSaveEdit = () => {
        if (editContent.trim() === '') return;
        onEditTask(task.id, editContent);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`task-card ${task.completed ? 'completed' : ''}`}
        >
            {isEditing ? (
                <div className="task-edit">
                    <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <div className="task-actions">
                        <button onClick={handleSaveEdit}>保存</button>
                        <button onClick={() => setEditingTask()}>取消</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="task-content" {...attributes} {...listeners}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleComplete(task.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span className={task.completed ? 'completed-text' : ''}>{task.content}</span>
                    </div>
                    <div className="task-actions">
                        <Button onClick={(e) => {
                            // e.stopPropagation();
                            console.log('edit task', e, task)
                            setEditingTask(task);
                            setEditContent(task.content);
                        }}>
                            <span role="img" aria-label="Edit">✏️</span>
                        </Button>
                        <button onClick={(e) => {
                            // e.stopPropagation();
                            console.log('delete task', e, task)
                            onDeleteTask(task.id);
                        }}>
                            <span role="img" aria-label="Delete">🗑️</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
