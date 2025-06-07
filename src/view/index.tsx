import {EntityIcon} from "../entity/EntityDirectory";
import {EntityInfo} from "../api/model.ts";
import {FC, useCallback, useEffect, useState} from "react";
import {EntityGetList, EntitySearch} from "../api/api.ts";
import "react-cmdk/dist/cmdk.css";
import CommandPalette from "react-cmdk";
import {debounce} from "lodash-es";
import {Button, Form, Space, Table} from '@douyinfe/semi-ui';
import {entityTypeMap} from "../entity/common/types.tsx";
import dayjs from 'dayjs';
import {EntityDeleteButton, EntityEditButton, EntityOpenButton} from "../components/EntityEdit.tsx";

const entityConvert = (entity_type: number) : FC => {
    return () => EntityIcon({entity_type})
}

export default function Index() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [searchKeyword, setSearchKeyword] = useState<string>('' )
    const [searchEntityList, setSearchEntityList] = useState<EntityInfo[]>([])
    const [entityList, setEntityList] = useState<EntityInfo[]>([])
    // 分页配置
    const [pagination, setPagination] = useState<{
        current: number,
        size: number,
        total: number,
        name?: string,
        entity_type?: number,
        random?: number,
    }>({
        current: 1,
        size: 10,
        total: 0,
    })

    // 搜索防抖
    const keywordSearch = useCallback(debounce(
        (keyword: string) => EntitySearch(keyword).then(setSearchEntityList),
        500
    ), []);

    useEffect(() => {
        // 定义键盘事件处理函数
        const handleKeyDown = (event: KeyboardEvent) => {
            // 检查按下的是否是空格键
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                setDialogOpen(true)
            }
        };

        // 添加事件监听器到 document
        document.addEventListener('keydown', handleKeyDown);

        // 组件卸载时移除事件监听器（防止内存泄漏）
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    const getTableData = () => {
        EntityGetList(pagination.current, pagination.size, pagination.name, pagination.entity_type).then((data) => {
            setEntityList(data.list)
            setPagination((pagination) => ({...pagination, total: data.total}))
        })
    }

    useEffect(() => {
        getTableData()
    }, [
        pagination.current,
        pagination.size,
        pagination.name,
        pagination.entity_type,
        pagination.random
    ])

    return <div className={"p-2"}>
        <Form className={"pb-2"} layout={"horizontal"} labelPosition={"left"} onSubmit={(data: any) => {
            setPagination((pagination) => ({
                ...pagination,
                name: data.name,
                entity_type: data.entity_type,
                random: Math.random()
            }))
            getTableData()
        }}>
            <Form.Input field='name' label={"关键词"} placeholder={"请输入关键词"} showClear/>
            <Form.Select field='entity_type' className="w-40" showClear label={"实体类型"} placeholder={"选择实体类型"}>
                {Array.from(entityTypeMap.entries()).map(([key, value]) =>
                    <Form.Select.Option key={key} value={key}><Space>{value.icon}<span>{value.label}</span></Space></Form.Select.Option>
                )}
            </Form.Select>
            <Button htmlType={"submit"}>搜索</Button>
        </Form>
        <Table
            bordered
            columns={[
                {title: '名称', dataIndex: 'name' },
                {title: '实体类型', dataIndex: 'entity_type', render: (text: number) => <Space>{entityTypeMap.get(text)?.icon || ''}{entityTypeMap.get(text)?.label || '未知'}</Space> },
                {title: '描述', dataIndex: 'desc' },
                {title: '更新时间', dataIndex: 'update_time', render: (t: number) => dayjs(t).format('YYYY-MM-DD HH:mm:ss') },
                {title: '操作', dataIndex: 'option', render: (_, data: EntityInfo) => <Space>
                    <EntityOpenButton id={data.id}  />
                    <EntityEditButton info={data} onEdit={getTableData} />
                    <EntityDeleteButton id={data.id} onDelete={getTableData} />
                </Space> },
            ]}
            dataSource={entityList}
            pagination={{currentPage: pagination.current, pageSize: pagination.size, total: pagination.total, onChange: (current, size) => {
                setPagination((pagination) => ({...pagination, current, size}))
            }}}
        />
        <CommandPalette
            onChangeSearch={(keyword) => {
                setSearchKeyword(keyword)
                if(keyword) {
                    keywordSearch(keyword)
                } else {
                    setSearchEntityList([])
                }
            }}
            onChangeOpen={setDialogOpen}
            search={searchKeyword}
            isOpen={dialogOpen}
            placeholder={"输入关键词搜索"}
        >
            <CommandPalette.List>
                {searchEntityList.map((item, idx) =>  <CommandPalette.ListItem
                    onClick={() => {
                        // onNodeSelect(item.id)
                        setDialogOpen(false)
                    }}
                    children={item.name}
                    icon={entityConvert(item.entity_type)}
                    index={idx}
                />)}
            </CommandPalette.List>
        </CommandPalette>
    </div>
}
