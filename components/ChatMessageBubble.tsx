import markdownToHtml from "@/utils/markdownToHTML";
import type { Message } from "ai/react";
import { useMemo } from "react";

export function ChatMessageBubble(props: { message: Message; sources: any[] }) {
  const colorClassName =
    props.message.role === "user"
      ? "bg-[#2D3D0A] text-white"
      : "text-[#AEFF00]";
  const alignmentClassName =
    props.message.role === "user" ? "ml-auto" : "mr-auto";

  const content = useMemo(() => {
    return markdownToHtml(props.message.content);
  }, [props.message.content]);

  return (
    <div
      className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex`}
    >
      <div className="flex flex-col">
        <div
          className="prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        {props.sources && props.sources.length ? (
          <>
            <code className="mt-4 mr-auto bg-slate-600 px-2 py-1 rounded">
              <h2>🔍 Sources:</h2>
            </code>
            <code className="mt-1 mr-2 bg-slate-600 px-2 py-1 rounded text-xs">
              {props.sources?.map((source, i) => (
                <div className="mt-2" key={"source:" + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{" "}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </code>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
