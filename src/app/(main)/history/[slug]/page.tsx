import ChatInput from '@/components/input/inputArea'

interface PageProps {
  params: { id: string }
}

const HistoryPage = ({ params }: PageProps) => {
  const conversationId = parseInt(params.id);

  return (
    <div className="h-screen w-full">
        <ChatInput initialConvId={conversationId} />
    </div>
  )
}

export default HistoryPage