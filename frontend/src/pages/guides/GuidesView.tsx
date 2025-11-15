import { useLocation, useParams } from "react-router-dom";
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

import { ArrowLeft } from "lucide-react";

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
import { Link } from "react-router-dom";

import dayjs from "dayjs";
import ProfilePicture from "@/components/ProfilePicture";

function GuidesView() {
    const { uuid } = useParams();
    const guide = useFetchGuide(uuid);
    const location = useLocation();

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
        <div className="flex flex-col items-center justify-center gap-10 p-3 sm:p-10 ">
            <Link
                to={
                    location.state?.from == "board"
                        ? "/guides/board"
                        : "/guides"
                }
                className="self-start w-fit"
            >
                <ArrowLeft size={32} />
            </Link>
            <div className="flex flex-col w-full gap-10">
                <div className="flex flex-col w-[50%] text-center gap-2 self-center">
                    <h1 className="text-4xl font-bold text-center wrap-anywhere">
                        {guide.title}
                    </h1>
                    <div className="flex gap-3 self-center items-center">
                        <p>by</p>

                        <Link
                            to={`/${guide.author.username}`}
                            className="h-fit w-fit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ProfilePicture src={guide.author.pfp_url} />
                        </Link>

                        <div>
                            <Link
                                to={`/${guide.author.username}`}
                                onClick={(e) => e.stopPropagation()}
                                className="h-fit w-fit"
                            >
                                <span className="font-[1000] h-fit hover:underline cursor-pointer">
                                    {guide.author.display_name ??
                                        guide.author.username}
                                </span>
                            </Link>
                            <Link
                                to={`/${guide.author.username}`}
                                onClick={(e) => e.stopPropagation()}
                                className="h-fit w-fit"
                            >
                                <p className="text-[#525252] hover:underline cursor-pointer">
                                    @{guide.author.username}
                                </p>
                            </Link>
                        </div>
                    </div>

                    <p className="text-center">
                        published on{" "}
                        {dayjs(guide.created_at).format("MMMM D, YYYY")}
                    </p>
                    {guide.created_at !== guide.last_edit_date && (
                        <p className="text-center">
                            updated on{" "}
                            {dayjs(guide.last_edit_date).format("MMMM D, YYYY")}
                        </p>
                    )}
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
