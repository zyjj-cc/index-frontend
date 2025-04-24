import {Button, ButtonGroup, Form, Input, Modal, Toast, Tree} from '@douyinfe/semi-ui';
import {IconDelete, IconEdit, IconFile, IconFolder, IconHelpCircle, IconPlusCircle} from "@douyinfe/semi-icons";
import {useEffect, useRef, useState} from "react";
import {EntityAdd, EntityDelete, EntityUpdate, RelationAdd, RelationGetAll} from "../api/api.ts";
import {EntityInfo, RelationInfo} from "../api/model.ts";

const style = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

interface TreeData  {
    id: string
    name: string
    entity_type: number
    children: TreeData[]
}

export function EntityIcon(props: { entity_type: number})  {
    switch (props.entity_type) {
        case 0:
            return <IconFolder />
        case 1:
            return <IconFile />
        default:
            return <IconHelpCircle />
    }
}

export default function Directory(props: {
    onNodeSelect?: (id: string) => void
}) {
    const [treeViewData, setTreeViewData] = useState<any[]>([])
    const treeData = useRef<TreeData[]>([])
    // 修改节点名称
    const [nodeName, setNodeName] = useState('')
    // 修改节点是否可见
    const [editVisible, setEditVisible] = useState(false)
    // 新增节点是否可见
    const [addVisible, setAddVisible] = useState(false)
    // 待编辑或新增的节点id
    const [nodeId, setNodeId] = useState('')

    // 编辑节点
    const editNode = async () => {
        // 修改节点名称
        await EntityUpdate(nodeId, {name: nodeName})
        editDeep(treeData.current, nodeId, nodeName)
        setTreeViewData(genNode(treeData.current))
        setEditVisible(false)
        Toast.success('修改成功！')
    }

    // 删除节点
    const deleteNode = (id: string) => {
        Modal.confirm({
            title: '确定要删除该节点吗？',
            content: '删除后子节点联系都会消失（子节点不会删除）！',
            onOk: async () => {
                await EntityDelete(id)
                deleteDeep(treeData.current, id)
                setTreeViewData(genNode(treeData.current))
                Toast.success('删除成功！')
            }
        })
    }

    // 递归添加某个节点
    const addDeep = (nodes: TreeData[], newNode: TreeData, parent: string = "") => {
        nodes.forEach((node) => {
            if (node.id == parent) {
                node.children.push(newNode)
                return
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
    const genNode = (data: TreeData[]) : any[] => {
        return data.map((node) => {
            return {
                icon: <EntityIcon entity_type={node.entity_type} />,
                label: (
                    <div style={style}>
                        <span>{node.name}</span>
                        <ButtonGroup size="small" theme="borderless">
                            <Button onClick={() => {
                                setNodeName(node.name)
                                setNodeId(node.id)
                                setEditVisible(true)
                            }} icon={<IconEdit />} type="secondary" />
                            <Button onClick={() => {
                                setAddVisible(true)
                                setNodeId(node.id)
                            }} icon={<IconPlusCircle />} type="primary" />
                            <Button onClick={() => deleteNode(node.id)} icon={<IconDelete />} type="danger" />
                        </ButtonGroup>
                    </div>
                ),
                value: node.id,
                key: node.id,
                children: genNode(node.children)
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

    // 从所有联系中构建出目录树
    const constructTree = (relations: RelationInfo[]) => {
        const nodeMap = new Map<string, TreeData>();
        const rootNodes: TreeData[] = [];

        // 先创建所有节点
        relations.forEach(relation => {
            const inNode = relation.in;
            const outNode = relation.out;

            if (!nodeMap.has(inNode.id)) {
                nodeMap.set(inNode.id, {
                    id: inNode.id,
                    name: inNode.name,
                    entity_type: inNode.entity_type,
                    children: []
                });
            }

            if (!nodeMap.has(outNode.id)) {
                nodeMap.set(outNode.id, {
                    id: outNode.id,
                    name: outNode.name,
                    entity_type: outNode.entity_type,
                    children: []
                });
            }

            const parent = nodeMap.get(inNode.id)!;
            const child = nodeMap.get(outNode.id)!;

            parent.children.push(child);
        });

        // 找出根节点
        const allChildIds = new Set<string>();
        relations.forEach(relation => {
            allChildIds.add(relation.out.id);
        });

        nodeMap.forEach(node => {
            if (!allChildIds.has(node.id)) {
                rootNodes.push(node);
            }
        });

        treeData.current = rootNodes
        setTreeViewData(genNode(treeData.current))
    }

    useEffect(() => {
        // 初始化获取根节点
        RelationGetAll().then(constructTree)
    }, [])

    return <>
        <Tree
            treeData={treeViewData}
            onSelect={props.onNodeSelect}
        />
        <Modal
            visible={editVisible}
            title={"修改名称"}
            onCancel={() => setEditVisible(false)}
            onOk={editNode}
        >
            <Input value={nodeName} onChange={setNodeName} />
        </Modal>
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
                    <Form.Select.Option value={0}>空节点</Form.Select.Option>
                    <Form.Select.Option value={1}>文本</Form.Select.Option>
                </Form.Select>
                <Button block style={{marginBottom: 20}} htmlType="submit">创建</Button>
            </Form>
        </Modal>
    </>
}
