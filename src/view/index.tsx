import {Col, Row} from "@douyinfe/semi-ui";
import EntityDirectory from "../entity/EntityDirectory";
import Entity from "../entity/Entity.tsx";
import {EntityInfo} from "../api/model.ts";
import {useState} from "react";
import {EntityGet} from "../api/api.ts";


export default function Index() {
    const [entityInfo, setEntityInfo] = useState<EntityInfo>()

    const onNodeSelect = (id: string) => {
        EntityGet(id).then(setEntityInfo)
    }

    return <Row style={{margin: 5, height: 600}} gutter={16}>
        <Col span={6}>
            <EntityDirectory onNodeSelect={onNodeSelect} />
        </Col>
        <Col span={18} style={{padding: "8px 0", height: '100%'}}>
            <Entity info={entityInfo} />
        </Col>
    </Row>
}
