import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
    {
        // 原：Default
        name: "默认",
        color: "var(--novel-black)",
    },
    {
        // 原：Purple
        name: "紫色",
        color: "#9333EA",
    },
    {
        // 原：Red
        name: "红色",
        color: "#E00000",
    },
    {
        // 原：Yellow
        name: "黄色",
        color: "#EAB308",
    },
    {
        // 原：Blue
        name: "蓝色",
        color: "#2563EB",
    },
    {
        // 原：Green
        name: "绿色",
        color: "#008A00",
    },
    {
        // 原：Orange
        name: "橙色",
        color: "#FFA500",
    },
    {
        // 原：Pink
        name: "粉色",
        color: "#BA4081",
    },
    {
        // 原：Gray
        name: "灰色",
        color: "#A8A29E",
    },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
    {
        // 原：Default
        name: "默认",
        color: "var(--novel-highlight-default)",
    },
    {
        // 原：Purple
        name: "紫色",
        color: "var(--novel-highlight-purple)",
    },
    {
        // 原：Red
        name: "红色",
        color: "var(--novel-highlight-red)",
    },
    {
        // 原：Yellow
        name: "黄色",
        color: "var(--novel-highlight-yellow)",
    },
    {
        // 原：Blue
        name: "蓝色",
        color: "var(--novel-highlight-blue)",
    },
    {
        // 原：Green
        name: "绿色",
        color: "var(--novel-highlight-green)",
    },
    {
        // 原：Orange
        name: "橙色",
        color: "var(--novel-highlight-orange)",
    },
    {
        // 原：Pink
        name: "粉色",
        color: "var(--novel-highlight-pink)",
    },
    {
        // 原：Gray
        name: "灰色",
        color: "var(--novel-highlight-gray)",
    },
];

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
    const { editor } = useEditor();

    if (!editor) return null;
    const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));

    const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));

    return (
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button size="sm" className="gap-2 rounded-none" variant="ghost">
                    <span
                        className="rounded-sm px-1"
                        style={{
                            color: activeColorItem?.color,
                            backgroundColor: activeHighlightItem?.color,
                        }}
                    >
            A
                    </span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                sideOffset={5}
                className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl "
                align="start"
            >
                <div className="flex flex-col">
                    <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">颜色</div>
                    {TEXT_COLORS.map(({ name, color }) => (
                        <EditorBubbleItem
                            key={name}
                            onSelect={() => {
                                editor.commands.unsetColor();
                                name !== "Default" &&
                  editor
                      .chain()
                      .focus()
                      .setColor(color || "")
                      .run();
                                onOpenChange(false);
                            }}
                            className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
                        >
                            <div className="flex items-center gap-2">
                                <div className="rounded-sm border px-2 py-px font-medium" style={{ color }}>
                  A
                                </div>
                                <span>{name}</span>
                            </div>
                        </EditorBubbleItem>
                    ))}
                </div>
                <div>
                    <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">背景</div>
                    {HIGHLIGHT_COLORS.map(({ name, color }) => (
                        <EditorBubbleItem
                            key={name}
                            onSelect={() => {
                                editor.commands.unsetHighlight();
                                name !== "Default" && editor.chain().focus().setHighlight({ color }).run();
                                onOpenChange(false);
                            }}
                            className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
                        >
                            <div className="flex items-center gap-2">
                                <div className="rounded-sm border px-2 py-px font-medium" style={{ backgroundColor: color }}>
                  A
                                </div>
                                <span>{name}</span>
                            </div>
                            {editor.isActive("highlight", { color }) && <Check className="h-4 w-4" />}
                        </EditorBubbleItem>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
