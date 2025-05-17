import {EntityProps} from "./common.ts";
import MindMap from "simple-mind-map";
import {useCallback, useEffect, useRef} from "react";
import {UploadFile} from "../api/api.ts";
// @ts-ignore
import {getImageSize} from 'simple-mind-map/src/utils'
// @ts-ignore
import NodeImgAdjust from 'simple-mind-map/src/plugins/NodeImgAdjust.js'

MindMap.usePlugin(NodeImgAdjust)

export default function EntityMindMap(props: EntityProps<any>) {
    const mindMap = useRef<MindMap>()

    const imageUpload = async (img: Blob) => {
        const url =await UploadFile(img, 'tmp.png')
        const { width, height } = await getImageSize(url)
        console.log('img size', width, height)
        return { url, size: {width, height} }
    }

    const graph = useCallback((graph: HTMLDivElement) => {
        if (!graph) {
            return
        }

        console.log('[mindMap] render')
        let data = props.value
        if (Object.keys(data).length == 0) {
            data = {"data": {"text": "根节点"}}
        }

        // @ts-ignore
        mindMap.current = new MindMap({
            el: graph,
            handleNodePasteImg: imageUpload,
            data,
        });
        mindMap.current.on('data_change', props.onChange)
    }, [])

    useEffect(() => {
        console.log('[mindMap] data change', props.value)
        mindMap.current?.setData(props.value)
    }, [props.value])

    return <div style={{ height: '100%' }} ref={graph}/>
}
