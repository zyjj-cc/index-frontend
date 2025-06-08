import {FC, useCallback, useEffect, useState} from "react";
import "react-cmdk/dist/cmdk.css";
import CommandPalette from "react-cmdk";
import {debounce} from "lodash-es";
import {EntityInfo} from "index_common/api/model";
import {Api} from "index_common/index";
import EntityManage from "index_common/page/EntityManage";
import EntityIcon from "index_common/components/EntityIcon";

const entityConvert = (entity_type: number) : FC => {
    return () => EntityIcon({entity_type})
}

export default function Index() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [searchKeyword, setSearchKeyword] = useState<string>('' )
    const [searchEntityList, setSearchEntityList] = useState<EntityInfo[]>([])

    // 搜索防抖
    const keywordSearch = useCallback(debounce(
        (keyword: string) => Api.EntitySearch(keyword).then(setSearchEntityList),
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

    return <div className={"p-2"}>
        <EntityManage />
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
                        // onNodeSelect(item.id)
                        setDialogOpen(false)
                    }}
                    children={item.name}
                    icon={entityConvert(item.entity_type)}
                    index={idx}
                />)}
            </CommandPalette.List>
        </CommandPalette>
    </div>
}
