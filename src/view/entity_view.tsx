import { useParams } from 'react-router-dom';
import {EntityInfo} from "../api/model.ts";
import {useEffect, useState} from "react";
import Entity from "../entity/Entity.tsx";
import {EntityGet} from "../api/api.ts";

export default function EntityView() {
    // 获取路径参数
    const params = useParams();
    const [entityInfo, setEntityInfo] = useState<EntityInfo>()

    useEffect(() => {
        if (params.id) {
            EntityGet(params.id).then((info) => {
                setEntityInfo(info)
                document.title = info.name
            })
        }
    }, [])

    return (
        <div className="flex justify-center items-center h-full">
            <Entity info={entityInfo}/>
        </div>
    );
}
