import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#D16E1033] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        Pie.Fun Super Smart AI Agent
      </h1>
      <p>
        Ask me anything about Pie.Fun. I&apos;m your friendly Pie.Fun agent!
      </p>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat"
      emoji="🥧"
      titleText="Pie.Fun Super Smart AI Agent"
      placeholder="I'm your friendly Pie.Fun agent! Ask me anything..."
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
