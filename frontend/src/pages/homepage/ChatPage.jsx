import React from 'react';
import cn from 'classnames';

import ChannelList from '../../components/ChannelList/ChannelList.jsx';
import ChatArea from '../../components/ChatArea/ChatArea.jsx';
import styles from '../homepage/ChatPage.module.scss';

const Chat = () => (
  <div className="custom-container container h-100 my-4 overflow-hidden rounded shadow">
    <div className="row h-100 bg-white flex-md-row fixed">
      <ChannelList />
      <ChatArea />
    </div>
  </div>
);

export default Chat;
