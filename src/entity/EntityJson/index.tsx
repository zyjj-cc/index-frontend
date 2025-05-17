import {EntityProps} from "../common.ts";
import JsonEditor from "../../components/JsonEditor.tsx";

export default function EntityJson(props: EntityProps<any>) {

    return <JsonEditor value={props.value} onChange={props.onChange}/>
}
