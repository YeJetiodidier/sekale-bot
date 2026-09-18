import ChatHeader from '../components/ChatHeader';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import PromptCard from '../components/PromptCard';

export default function Chat() {
  return (
    <section className="page chat">
      <ChatHeader />
      <div className="chat-log">
        <Message role="assistant" content="Hello! How can I help you?" />
      </div>
      <PromptCard title="Help" description="Get started" />
      <MessageInput />
    </section>
  );
}
