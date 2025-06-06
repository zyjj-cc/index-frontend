import {EntityProps} from "../common/types.ts";
import {useEffect, useState} from "react";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners, DragStartEvent, DragEndEvent, DragOverEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {Board, BoardInfo} from "./Board.tsx";
import {TaskCard, TaskInfo} from "./TaskCard.tsx";
import {Button, Input} from "@douyinfe/semi-ui";

type TodoInfo = { [key: string]: BoardInfo }

const convertToText = (info: TodoInfo): string => {
    let result = ""
    for (const boardId in info) {
        const board = info[boardId];
        const task = board.tasks.map((task) => `* [${task.completed? "x" : " "}] ${task.name}\n${task.desc}`).join("\n");
        result += `# ${board.title}\n${task}\n\n`;
    }
    return result
}

export default function EntityTodo(props: EntityProps<TodoInfo>) {
    // 初始看板数据
    const [boards, setBoards] = useState<TodoInfo>(props.value);
    const [activeId, setActiveId] = useState<string>();
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [isEditingBoard, setIsEditingBoard] = useState(false);

    // 配置传感器
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 找到任务所在的看板
    const findBoardByTaskId = (taskId: string): {boardId: string, taskIndex: number} => {
        for (const boardId in boards) {
            const board = boards[boardId];
            const taskIndex = board.tasks.findIndex((task) => task.id === taskId);
            if (taskIndex !== -1) {
                return { boardId, taskIndex };
            }
        }
        return {boardId: "", taskIndex: -1};
    };

    // 处理拖动开始事件
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    // 处理拖动结束事件
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(undefined);
            return;
        }

        // 如果目标与源相同，不执行任何操作
        if (active.id === over.id) {
            setActiveId(undefined);
            return;
        }

        // 查找任务所在的看板
        const { boardId: sourceBoardId, taskIndex: sourceTaskIndex } = findBoardByTaskId(active.id as string);

        // 检查目标是否为看板
        if ((over.id as string).startsWith('board-')) {
            // 将任务从源看板移动到目标看板
            setBoards((prev) => {
                const newBoards = { ...prev };
                const task = newBoards[sourceBoardId].tasks[sourceTaskIndex];

                // 从源看板中删除任务
                newBoards[sourceBoardId].tasks.splice(sourceTaskIndex, 1);

                // 添加到目标看板
                newBoards[over.id].tasks.push(task);

                return newBoards;
            });
        } else {
            // 查找目标任务所在的看板
            const { boardId: targetBoardId, taskIndex: targetTaskIndex } = findBoardByTaskId(over.id as string);

            // 如果是同一个看板内的排序
            if (sourceBoardId === targetBoardId) {
                setBoards((prev) => {
                    const newBoards = { ...prev };
                    newBoards[sourceBoardId].tasks = arrayMove(
                        newBoards[sourceBoardId].tasks,
                        sourceTaskIndex,
                        targetTaskIndex
                    );
                    return newBoards;
                });
            } else {
                // 跨看板移动
                setBoards((prev) => {
                    const newBoards = { ...prev };
                    const task = newBoards[sourceBoardId].tasks[sourceTaskIndex];

                    // 从源看板中删除任务
                    newBoards[sourceBoardId].tasks.splice(sourceTaskIndex, 1);

                    // 添加到目标看板的特定位置
                    newBoards[targetBoardId].tasks.splice(targetTaskIndex, 0, task);

                    return newBoards;
                });
            }
        }

        setActiveId(undefined);
    };

    // 处理拖动经过事件
    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;

        // 如果目标与源相同，不执行任何操作
        if (active.id === over.id) return;

        // 查找任务所在的看板
        const { boardId: sourceBoardId, taskIndex: sourceTaskIndex } = findBoardByTaskId(active.id as string);

        // 检查目标是否为看板
        if ((over.id as  string).startsWith('board-') && !(active.id as string).startsWith('board-')) {
            setBoards((prev) => {
                // 如果任务已经在目标看板的末尾，不执行任何操作
                if (
                    sourceBoardId === over.id &&
                    sourceTaskIndex === prev[sourceBoardId].tasks.length - 1
                ) {
                    return prev;
                }

                const newBoards = { ...prev };
                const task = newBoards[sourceBoardId].tasks[sourceTaskIndex];

                // 从源看板中删除任务
                newBoards[sourceBoardId].tasks.splice(sourceTaskIndex, 1);

                // 添加到目标看板
                newBoards[over.id].tasks.push(task);

                return newBoards;
            });
        } else if (!(over.id as string).startsWith('board-') && !(active.id as string).startsWith('board-')) {
            // 查找目标任务所在的看板
            const { boardId: targetBoardId, taskIndex: targetTaskIndex } = findBoardByTaskId(over.id as string);

            // 如果源和目标不在同一个看板
            if (sourceBoardId !== targetBoardId) {
                setBoards((prev) => {
                    const newBoards = { ...prev };
                    const task = newBoards[sourceBoardId].tasks[sourceTaskIndex];

                    // 从源看板中删除任务
                    newBoards[sourceBoardId].tasks.splice(sourceTaskIndex, 1);

                    // 添加到目标看板的特定位置
                    newBoards[targetBoardId].tasks.splice(targetTaskIndex, 0, task);

                    return newBoards;
                });
            }
        }
    };

    // 获取拖动中的任务内容
    const getActiveTask = ():TaskInfo | undefined => {
        if (!activeId) return undefined;

        const { boardId } = findBoardByTaskId(activeId);
        if (!boardId) return undefined;

        const taskIndex = boards[boardId].tasks.findIndex(task => task.id === activeId);
        return boards[boardId].tasks[taskIndex];
    };

    // 添加新看板
    const handleAddBoard = () => {
        if (newBoardTitle.trim() === '') return;

        const newBoardId = `board-${Date.now()}`;
        setBoards((prev) => ({
            ...prev,
            [newBoardId]: {
                id: newBoardId,
                title: newBoardTitle,
                tasks: [],
            },
        }));

        setNewBoardTitle('');
        setIsEditingBoard(false);
    };

    // 添加新任务
    const handleAddTask = (boardId: string) => {
        const newTaskId = `task-${Date.now()}`;
        const task = {
            id: newTaskId,
            name: '新任务',
            desc: '',
            completed: false,
        }
        setBoards((prev) => {
            const newBoards = { ...prev };
            newBoards[boardId].tasks.push(task);
            return newBoards;
        });
    };

    // 编辑任务
    const handleEditTask = (taskId: string, name: string, desc: string) => {
        const { boardId } = findBoardByTaskId(taskId);

        setBoards((prev) => {
            const newBoards = { ...prev };
            const taskIndex = newBoards[boardId].tasks.findIndex(task => task.id === taskId);
            newBoards[boardId].tasks[taskIndex].name = name;
            newBoards[boardId].tasks[taskIndex].desc = desc;
            return newBoards;
        });
    };

    // 切换任务完成状态
    const toggleTaskComplete = (taskId: string) => {
        const { boardId } = findBoardByTaskId(taskId);

        setBoards((prev) => {
            const newBoards = { ...prev };
            const taskIndex = newBoards[boardId].tasks.findIndex(task => task.id === taskId);
            newBoards[boardId].tasks[taskIndex].completed = !newBoards[boardId].tasks[taskIndex].completed;
            return newBoards;
        });
    };

    // 删除任务
    const handleDeleteTask = (taskId: string) => {
        const { boardId, taskIndex } = findBoardByTaskId(taskId);

        setBoards((prev) => {
            const newBoards = { ...prev };
            newBoards[boardId].tasks.splice(taskIndex, 1);
            return newBoards;
        });
    };

    // 删除看板
    const handleDeleteBoard = (boardId: string) => {
        setBoards((prev) => {
            const newBoards = { ...prev };
            delete newBoards[boardId];
            return newBoards;
        });
    };

    // 修改看板信息
    const handleEditBoard = (boardId: string, newTitle: string) => {
        setBoards((prev) => {
            const newBoards = {...prev };
            newBoards[boardId].title = newTitle;
            return newBoards;
        });
    }

    // 看板变化时自动触发修改
    useEffect(() => {
        if (boards) {
            props?.onChange(boards, convertToText(boards))
        }
    }, [boards])

    return (
        <div className="flex flex-col w-full">
            <div className={"w-80  mb-5"}>
                {isEditingBoard ? (
                    <div className={"flex gap-2"}>
                        <Input
                            type="text"
                            value={newBoardTitle}
                            onChange={(text) => setNewBoardTitle(text)}
                            placeholder="输入看板名称"
                            autoFocus
                        />
                        <Button onClick={handleAddBoard}>添加</Button>
                        <Button onClick={() => setIsEditingBoard(false)}>取消</Button>
                    </div>
                ) : (
                    <Button onClick={() => setIsEditingBoard(true)}>添加新看板</Button>
                )}
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <div className={"flex gap-2"}>
                    {Object.values(boards).map((board) => (
                        <Board
                            key={board.id}
                            bord={board}
                            onAddTask={() => handleAddTask(board.id)}
                            onEditBoard={(title) => handleEditBoard(board.id, title)}
                            onEditTask={handleEditTask}
                            onToggleComplete={toggleTaskComplete}
                            onDeleteTask={handleDeleteTask}
                            onDeleteBoard={() => handleDeleteBoard(board.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <TaskCard
                            task={getActiveTask()!}
                            isDragging
                            onEditTask={() => {}}
                            onToggleComplete={() => {}}
                            onDeleteTask={() => {}}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

        </div>
    );
}
