import ReactJson from "react-json-view";
import {Toast} from "@douyinfe/semi-ui";

export default function JsonView (props: {
    value: any
}) {
    return <ReactJson
        enableClipboard={(text) => {
            console.log(text)
            navigator.clipboard.writeText(JSON.stringify(text.src)).then(() => {
                Toast.success('拷贝成功')
            })
        }}
        iconStyle={"circle"}
        displayDataTypes={false}
        name={null}
        src={props.value}
    />
}
