import { ServerRail } from './components/ServerRail';
import { Sidebar } from './components/Sidebar';
import { ChannelHeader } from './components/ChannelHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { Modal } from './components/Modal';
import './styles.css';

function App() {
  return (
    <div className="app">
      <ServerRail />
      <Sidebar />
      <main className="chat-main">
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </main>
      <Modal />
    </div>
  );
}

export default App;
