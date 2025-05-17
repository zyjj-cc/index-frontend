import {EntityInfo} from "../api/model.ts";
import EntityMarkDown from "./EntityMarkDown.tsx";
import {debounce} from "lodash-es";
import {EntityUpdate} from "../api/api.ts";
import EntityMindMap from "./EntityMindMap.tsx";
import EntityTable from "./EntityTable.tsx";
import EntityTodo from "./EntityTODO";
import EntityCode from "./EntityCode";
import EntityJson from "./EntityJson";

export default function Entity(props: {info?: EntityInfo}) {
    const data = props.info?.data || {}
    const id = props.info?.id || ''

    console.log('render')

    const onChange = debounce((value) => {
        EntityUpdate(props.info!.id, {data: value}).then(() => console.log('save change', value))
    }, 500);

    switch (props.info?.entity_type) {
    case 1:
        return <EntityMarkDown id={id} value={data} onChange={onChange}  />
    case 2:
        return <EntityMindMap id={id} value={data} onChange={onChange} />
    case 3:
        return <EntityTable id={id} value={data} onChange={onChange} />
    case 4:
        return <EntityTodo id={id} value={data} onChange={onChange} />
    case 5:
        return <EntityCode id={id} value={data} onChange={onChange} />
    case 6:
        return <EntityJson id={id} value={data} onChange={onChange} />
    default:
        return <></>
    }
}
