import {EntityProps} from "../common/types.ts";
import MarkDownEditor from "../../components/MarkDownEditor.tsx";

export default function EntityMarkdown(props: EntityProps<{content: string}>) {
    return <div className={"p-2 h-full w-full"}>
        <MarkDownEditor value={props.value.content || ""} onChange={(content) => props.onChange({content}, content)} />
    </div>
}
