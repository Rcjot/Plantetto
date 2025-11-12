import { useParams } from "react-router-dom";
import useFetchGuide from "@/features/guides/hooks/useFetchGuide";
import { EditorContent } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

// --- Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";
import { Editor } from "@tiptap/core";

import content from "@/components/tiptap-templates/simple/data/content.json";

function GuidesView() {
    const { uuid } = useParams();
    const guide = useFetchGuide(uuid);

    const editor = new Editor({
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
        ],
        content: guide?.content ?? content,
    });

    if (!guide) return <div>loading..</div>;

    return (
        <div className="flex flex-col items-center justify-center gap-10 p-10 ">
            <div className="flex flex-col max-w-fit gap-10">
                <div className="flex flex-col gap-2 self-center">
                    <h1 className="text-4xl font-bold text-center">
                        {guide.title}
                    </h1>
                    <p className="text-center">
                        {guide.author.display_name ?? guide.author.username}
                    </p>
                    <p className="text-center">{guide.created_at}</p>{" "}
                </div>

                <EditorContent
                    editor={editor}
                    role="presentation"
                    className="simple-editor-content"
                />
            </div>
        </div>
    );
}

export default GuidesView;
