import { ResizeGroup, ResizeHandler, ResizeItem } from "@douyinfe/semi-ui";
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

    return <ResizeGroup direction="horizontal">
        <ResizeItem className={"m-2"} min={'10%'} defaultSize={"30%"}>
            <EntityDirectory onNodeSelect={onNodeSelect} />
        </ResizeItem>
        <ResizeHandler />
        <ResizeItem className={"m-2"} defaultSize={"70%"}>
            <Entity info={entityInfo} />
        </ResizeItem>
    </ResizeGroup>
}
