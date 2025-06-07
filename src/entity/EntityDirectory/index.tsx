import {
    Button,
    Form,
    Modal,
    ResizeGroup,
    ResizeHandler,
    ResizeItem, Space,
    Tree
} from '@douyinfe/semi-ui';
import {useEffect, useRef, useState} from "react";
import {
    EntityAdd,
    EntityGet,
    RelationAdd,
    RelationGet, RelationUpdate
} from "../../api/api.ts";
import {EntityInfo} from "../../api/model.ts";
import {
    CircleHelp,
    FilePlus2,
} from "lucide-react";
import Entity from "../Entity.tsx";
import {EntityProps} from "../common/types.ts";
import {TreeNodeData} from "@douyinfe/semi-ui/lib/es/tree";
import {entityTypeMap} from "../common/types.tsx";
import {EntityDeleteButton, EntityEditButton, EntityOpenButton} from "../../components/EntityEdit.tsx";

interface TreeData  {
    id: string
    name: string
    entity_type: number
    children: TreeData[]
}

export const EntityIcon = (props: { entity_type: number}) =>
    entityTypeMap.has(props.entity_type) ? entityTypeMap.get(props.entity_type)?.icon : <CircleHelp />

export default function EntityDirectory(props: EntityProps<null>) {
    const [treeViewData, setTreeViewData] = useState<any[]>([])
    const treeData = useRef<TreeData[]>([])
    // 新增节点是否可见
    const [addVisible, setAddVisible] = useState(false)
    // 待编辑或新增的节点id
    const [nodeId, setNodeId] = useState('')
    // 默认展开的key
    const [expandedKeys, setExpandedKeys] = useState<string[]>([])
    // 节点信息
    const [entityInfo, setEntityInfo] = useState<EntityInfo>()

    // 递归添加单个或者多个节点
    const addDeep = (nodes: TreeData[], newNode: TreeData | TreeData[], parent: string = "") => {
        nodes.forEach((node) => {
            if (node.id == parent) {
                if (Array.isArray(newNode)) {
                    node.children = [...newNode, ...node.children]
                } else {
                    node.children = [newNode, ...node.children]
                }
            }
            if (node.children) {
                addDeep(node.children, newNode, parent)
            }
        })
    }

    // 递归删除某个节点
    const deleteDeep = (nodes: TreeData[], id: string) => {
        return nodes.filter((node) => {
            if (node.id == id) {
                return false
            }
            if (node.children) {
                node.children = deleteDeep(node.children, id)
            }
            return true
        })
    }

    // 递归修改节点
    const editDeep = (nodes: TreeData[], id: string, name: string) => {
        nodes.forEach((node) => {
            if (node.id == id) {
                node.name = name
            }
            if (node.children) {
                editDeep(node.children, id, name)
            }
        })
    }

    // 添加一个节点
    const addNode = (info: EntityInfo, parent: string = "") => {
        console.log('add node', info)
        const node: TreeData = { id: info.id, name: info.name, entity_type: info.entity_type, children: []}
        if(parent) {
            addDeep(treeData.current, node, nodeId)
        } else {
            treeData.current.push(node)
        }
        setTreeViewData(genNode(treeData.current))
        setAddVisible(false)
    }

    // 根据节点数据生成新的树形图
    const genNode = (data: TreeData[], parent?: string) : any[] => {
        console.log('genNode', data)
        return data.map((node) => {
            return {
                icon: <EntityIcon entity_type={node.entity_type} />,
                label: (
                    <div className="flex justify-between items-center">
                        <span>{node.name}</span>
                        <Space>
                            {node.entity_type == 0?<Button size={"small"} onClick={() => {
                                setAddVisible(true)
                                setNodeId(node.id)
                            }} icon={<FilePlus2 />} type="primary" />:null}
                            <EntityEditButton info={node} onEdit={(info: EntityInfo) => {
                                editDeep(treeData.current, nodeId, info.name)
                                setTreeViewData(genNode(treeData.current))
                            }} />
                            <EntityDeleteButton id={node.id} onDelete={() => {
                                deleteDeep(treeData.current, node.id)
                                setTreeViewData(genNode(treeData.current))
                            }} />
                            <EntityOpenButton id={node.id} />
                        </Space>
                    </div>
                ),
                key: node.id,
                children: genNode(node.children, node.id),
                isLeaf: node.entity_type != 0,
                parent: parent,
                info: node,
            }
        })
    }

    // 创建节点
    const createNode = async (data: any) => {
        const entity_id = await EntityAdd(data)
        await RelationAdd(nodeId, entity_id)
        addNode({id: entity_id, ...data}, nodeId)
        console.log('data', data)
    }

    // 节点选中事件(目录节点点击无响应)
    const onNodeSelect = (id: string) => {
        EntityGet(id).then((info) => {
            if (info.entity_type != 0) {
                setEntityInfo(info)
            }
        })
    }

    // 节点展开事件
    const onLoadData = async (data?: TreeNodeData) => {
        console.log('onLoadData', data)
        if(data) {
            const relationInfo = await RelationGet(data.key!)
            addDeep(treeData.current, relationInfo.children.map((relation) => ({
                id: relation.id,
                name: relation.name,
                entity_type: relation.entity_type,
                children: []
            })), relationInfo.info.id)
            setTreeViewData(genNode(treeData.current))
        }
    }

    // 节点拖动事件
    const onNodeDrag = async (data: any) => {
        const source = data.dragNode.parent
        const info = data.dragNode.info
        const target = data.node.key
        deleteDeep(treeData.current, info.id)
        addDeep(treeData.current, info, target)
        await RelationUpdate(info.id, source, target)
        setTreeViewData(genNode(treeData.current))
    }

    // 构建初始节点
    useEffect(() => {
        RelationGet(props.id).then((data) => {
            setExpandedKeys([data.info.id])
            treeData.current = [{
                id: data.info.id,
                name: data.info.name,
                entity_type: data.info.entity_type,
                children: data.children.map((relation) => ({
                    id: relation.id,
                    name: relation.name,
                    entity_type: relation.entity_type,
                    children: []
                }))
            }]
            setTreeViewData(genNode(treeData.current))
        })
    }, [props.id])

    return <>
        <ResizeGroup direction="horizontal">
            <ResizeItem className={"pr-2"} min={'10%'} defaultSize={"20%"}>
                <Tree
                    draggable
                    onExpand={setExpandedKeys}
                    onDrop={onNodeDrag}
                    loadData={onLoadData}
                    expandedKeys={expandedKeys}
                    treeData={treeViewData}
                    onSelect={onNodeSelect}
                />
            </ResizeItem>
            <ResizeHandler />
            <ResizeItem defaultSize={"80%"}>
                <Entity info={entityInfo} />
            </ResizeItem>
        </ResizeGroup>
        <Modal
            style={{width: 350}}
            visible={addVisible}
            title={"新增节点"}
            onCancel={() => setAddVisible(false)}
            footer={null}
        >
            <Form onSubmit={createNode}>
                <Form.Input field='name' label='节点名称' style={{width: 300}}/>
                <Form.Select field='entity_type' label='节点类型' style={{width: 300}}>
                    {Array.from(entityTypeMap.entries()).map(([key, value]) =>
                        <Form.Select.Option key={key} value={key}><Space>{value.icon}<span>{value.label}</span></Space></Form.Select.Option>
                    )}
                </Form.Select>
                <Button block style={{marginBottom: 20}} htmlType="submit">创建</Button>
            </Form>
        </Modal>
    </>
}
