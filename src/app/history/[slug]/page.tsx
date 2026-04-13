import ChatInput from '@/components/input/inputArea'
import React from 'react'

interface PageProps {
  params: { id: string }
}

const HistoryPage = ({ params }: PageProps) => {
  // URL'dagi ID ni raqamga o'tkazib ChatInput-ga beramiz
  const conversationId = parseInt(params.id);

  return (
    <div className="h-screen w-full">
        <ChatInput initialConvId={conversationId} />
    </div>
  )
}

export default HistoryPage