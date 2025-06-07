import {SquareArrowOutUpRight, SquarePen, Trash2} from "lucide-react";
import {Button, Input, Modal, Popconfirm, Toast} from "@douyinfe/semi-ui";
import {useState} from "react";
import {EntityInfo} from "../api/model.ts";
import {EntityDelete, EntityUpdate} from "../api/api.ts";

export const EntityEditButton = (props: {info: EntityInfo | any, onEdit?: (data: EntityInfo) => void}) => {
    const {info} = props;
    // 修改节点是否可见
    const [editVisible, setEditVisible] = useState(false)
    // 修改节点名称
    const [nodeName, setNodeName] = useState(info.name)

    const editNode = async () => {
        info.name = nodeName
        // 修改节点名称
        await EntityUpdate(info.id, {name: nodeName})
        setEditVisible(false)
        props.onEdit?.(info)
        Toast.success('修改成功！')
    }

    return <>
        <Button size={"small"} onClick={() => setEditVisible(true)} icon={<SquarePen />} type="secondary" />
        <Modal
            visible={editVisible}
            title={"修改名称"}
            onCancel={() => setEditVisible(false)}
            onOk={editNode}
        >
            <Input value={nodeName} onChange={setNodeName} />
        </Modal>
    </>
}

export const EntityDeleteButton = (props: {id: string, onDelete?: () => void}) => {
    return <Popconfirm
        title="确定删除？"
        content="删除后不可恢复！"
        onConfirm={async () => {
            await EntityDelete(props.id)
            props.onDelete?.()
            Toast.success('删除成功！')
        }}
    >
        <Button size={"small"} icon={<Trash2 />} type="danger" />
    </Popconfirm>
}

export const EntityOpenButton = (props: {id: string}) => {
    return <Button size={"small"} onClick={() => window.open(`/entity/${props.id}`)} icon={<SquareArrowOutUpRight />}  />
}
