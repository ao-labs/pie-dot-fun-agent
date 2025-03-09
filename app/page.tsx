import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="w-full overflow-hidden text-center mb-[50vh]">
      <div
        className="w-[800px] h-[200px] mx-auto mt-[-100px] mb-[20px]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, #AEFF00 0%, rgba(174, 255, 0, 0) 100%)",
        }}
      ></div>
      <h1 className="text-5xl mb-2">Pie.Fun Super Smart AI Agent</h1>
      <p className="text-sm text-[#9BAE73]">
        Ask me anything about Pie.Fun. I&apos;m your friendly Pie.Fun agent!
      </p>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat"
      placeholder="Ask me anything."
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
