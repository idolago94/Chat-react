import React, { Component } from 'react';
import './Chat.css';
import io from 'socket.io-client';

class Chat extends Component {

    socket = io('http://localhost:8888');

    componentDidMount() {
        this.openChannel.call(this);
    }

    componentDidUpdate(prevProps) {
        this.saveConvToLocalStorage.call(this, prevProps.talkWith);
        this.loadConversation.call(this);
        this.socket.emit('closeChannel', prevProps.talkWith);
        this.openChannel.call(this);
    }

    loadConversation() {
        let history = JSON.parse(localStorage.getItem(this.props.talkWith));
        if(history) {
            let chat = document.getElementById('chat');
            history.forEach((el) => {
                let msg = document.createElement('p');
                msg.className = el.className;
                msg.innerHTML = el.content;
                chat.append(msg);
            });
        }
        else {
            document.getElementById('chat').innerHTML = '';
        }
    }

    saveConvToLocalStorage(userConv) {
        let conversation = [];
        for(let i=0; i<document.getElementById('chat').children.length; i++) {
            conversation.push({
                content: document.getElementById('chat').children[i].innerHTML,
                className: document.getElementById('chat').children[i].className
            });
        }
        localStorage.setItem(userConv, JSON.stringify(conversation));
    }

    openChannel() {
        this.socket.emit('openChat', { channelToOpen: this.props.talkWith, currentUser: this.props.user});
        this.socket.on('receiveMsg', (message) => {
            if(message.channel == this.props.user && message.message.fromUser == this.props.talkWith) {
                let newMsg = document.createElement('p');
                newMsg.innerHTML = message.message.content;
                newMsg.className = 'msgReceive';
                document.getElementById('chat').append(newMsg);
            }
            
        });
    }

    sendMessage(e) {
        if(e.key == 'Enter') {
            let newMsg = document.createElement('p');
            newMsg.innerHTML = e.target.value;
            newMsg.className = 'msgSent';
            document.getElementById('chat').append(newMsg);
            this.socket.emit('sendMsg', { fromUser: this.props.user, content: e.target.value });
        }
    }

    render() {
        return (
            <div>
                <div id='chat'>
                    
                </div>
                <input className='messageArea' type='text' placeholder='Type a message' name='content' onKeyPress={this.sendMessage.bind(this)} />
            </div>           
        );
    }
}

export default Chat;

