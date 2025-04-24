import {EntityInfo} from "../api/model.ts";
import MarkDown from "./MarkDown.tsx";


export default function Entity(props: {info?: EntityInfo}) {
    const data = props.info?.data
    console.log('render')
    const onChange = (data: any) => {
        console.log('onChange', data)
    }

    switch (props.info?.entity_type) {
        case 1:
            return <MarkDown data={data} onChange={onChange}  />
        default:
            return <></>
    }
}
