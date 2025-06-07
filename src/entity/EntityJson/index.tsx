import {EntityProps} from "../common/types.ts";
import JsonEditor from "../../components/JsonEditor.tsx";

export default function EntityJson(props: EntityProps<any>) {
    return <div className={"p-2 h-full w-full"}><JsonEditor
        value={props.value}
        onChange={(data) => props.onChange(data, JSON.stringify(data))}
    /></div>
}
