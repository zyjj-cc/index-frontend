import {ResizeGroup, ResizeHandler, ResizeItem} from "@douyinfe/semi-ui";
import EntityDirectory, {EntityIcon} from "../entity/EntityDirectory";
import Entity from "../entity/Entity.tsx";
import {EntityInfo} from "../api/model.ts";
import {FC, useCallback, useEffect, useState} from "react";
import {EntityGet, EntitySearch} from "../api/api.ts";
import "react-cmdk/dist/cmdk.css";
import CommandPalette from "react-cmdk";
import {debounce} from "lodash-es";

const entityConvert = (entity_type: number) : FC => {
    return () => EntityIcon({entity_type})
}

export default function Index() {
    const [entityInfo, setEntityInfo] = useState<EntityInfo>()
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [searchKeyword, setSearchKeyword] = useState<string>('' )
    const [searchEntityList, setSearchEntityList] = useState<EntityInfo[]>([])

    const onNodeSelect = (id: string) => {
        EntityGet(id).then(setEntityInfo)
    }

    // 搜索防抖
    const keywordSearch = useCallback(debounce(
        (keyword: string) => EntitySearch(keyword).then(setSearchEntityList),
        500
    ), []);

    useEffect(() => {
        // 定义键盘事件处理函数
        const handleKeyDown = (event: KeyboardEvent) => {
            // 检查按下的是否是空格键
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                setDialogOpen(true)
            }
        };

        // 添加事件监听器到 document
        document.addEventListener('keydown', handleKeyDown);

        // 组件卸载时移除事件监听器（防止内存泄漏）
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    return <>
        <ResizeGroup direction="horizontal">
            <ResizeItem className={"p-2"} min={'10%'} defaultSize={"30%"}>
                <EntityDirectory onNodeSelect={onNodeSelect} />
            </ResizeItem>
            <ResizeHandler />
            <ResizeItem className={"p-2"} defaultSize={"70%"}>
                <Entity info={entityInfo} />
            </ResizeItem>
        </ResizeGroup>
        <CommandPalette
            onChangeSearch={(keyword) => {
                setSearchKeyword(keyword)
                if(keyword) {
                    keywordSearch(keyword)
                } else {
                    setSearchEntityList([])
                }
            }}
            onChangeOpen={setDialogOpen}
            search={searchKeyword}
            isOpen={dialogOpen}
            placeholder={"输入关键词搜索"}
        >
            <CommandPalette.List>
                {searchEntityList.map((item, idx) =>  <CommandPalette.ListItem
                    onClick={() => {
                        onNodeSelect(item.id)
                        setDialogOpen(false)
                    }}
                    children={item.name}
                    icon={entityConvert(item.entity_type)}
                    index={idx}
                />)}
            </CommandPalette.List>
        </CommandPalette>
    </>
}
