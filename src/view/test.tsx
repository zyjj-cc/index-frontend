import EntityTodo from "../entity/EntityTODO";

const data = {
    'board-1': {
        id: 'board-1',
        title: '待办事项',
        tasks: [
            { id: 'task-1', content: '完成项目文档', completed: false },
            { id: 'task-2', content: '准备周会演示', completed: false },
            { id: 'task-3', content: '回复客户邮件', completed: false },
        ],
    },
    'board-2': {
        id: 'board-2',
        title: '进行中',
        tasks: [
            { id: 'task-4', content: '设计新功能原型', completed: false },
            { id: 'task-5', content: '修复登录页面bug', completed: false },
        ],
    },
    'board-3': {
        id: 'board-3',
        title: '已完成',
        tasks: [
            { id: 'task-6', content: '代码审查', completed: true },
            { id: 'task-7', content: '部署新版本', completed: true },
        ],
    },
}

export default function Test() {
    const onChange = (data: any) => {
        console.log('on change', data)
    }

    return <EntityTodo id={'0'} value={data} onChange={onChange} />
}
