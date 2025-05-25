import {
    CheckSquare,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    List,
    ListOrdered,
    Text,
    TextQuote,
} from "lucide-react";
import { Command, createSuggestionItems, renderItems } from "novel";
import { uploadFn } from "./image-upload";

export const suggestionItems = createSuggestionItems([
    {
        title: "Text",
        description: "文本",
        searchTerms: ["p", "paragraph"],
        icon: <Text size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
        },
    },
    {
        title: "To-do List",
        description: "代办清单",
        searchTerms: ["todo", "task", "list", "check", "checkbox"],
        icon: <CheckSquare size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
    },
    {
        title: "Heading 1",
        description: "标题1",
        searchTerms: ["title", "big", "large"],
        icon: <Heading1 size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
        },
    },
    {
        title: "Heading 2",
        description: "标题2",
        searchTerms: ["subtitle", "medium"],
        icon: <Heading2 size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
        },
    },
    {
        title: "Heading 3",
        description: "标题3",
        searchTerms: ["subtitle", "small"],
        icon: <Heading3 size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
        },
    },
    {
        title: "Bullet List",
        description: "无序列表",
        searchTerms: ["unordered", "point"],
        icon: <List size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: "Numbered List",
        description: "有序列表",
        searchTerms: ["ordered"],
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: "Quote",
        description: "引用",
        searchTerms: ["blockquote"],
        icon: <TextQuote size={18} />,
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
    },
    {
        title: "Code",
        description: "代码",
        searchTerms: ["codeblock"],
        icon: <Code size={18} />,
        command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
        title: "Image",
        description: "图片",
        searchTerms: ["photo", "picture", "media"],
        icon: <ImageIcon size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
                if (input.files?.length) {
                    const file = input.files[0];
                    const pos = editor.view.state.selection.from;
                    uploadFn(file, editor.view, pos);
                }
            };
            input.click();
        },
    },
]);

export const slashCommand = Command.configure({
    suggestion: {
        items: () => suggestionItems,
        render: renderItems,
    },
});
