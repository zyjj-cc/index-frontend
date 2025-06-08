import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import {Api} from "index_common/index";
import Entity from "index_common/entity/Entity";
import {EntityInfo} from "index_common/api/model";

export default function EntityView() {
    // 获取路径参数
    const params = useParams();
    const [entityInfo, setEntityInfo] = useState<EntityInfo>()

    useEffect(() => {
        if (params.id) {
            Api.EntityGet(params.id).then((info) => {
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
