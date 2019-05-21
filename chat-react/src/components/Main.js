import React, { Component } from 'react';
import Chat from './Chat';
import io from 'socket.io-client';

class Main extends Component {

    socket = io('http://localhost:8888');

    constructor(props){
        super(props);
        this.state = {
            users: [],
            openChat: {
                user: ''
            }
        }
    }

    componentDidMount() {
        this.socket.emit('userConnect', this.props.match.params.user);
        this.socket.on('loadUsers', () => {
            this.loadUsers.call(this);
        });
        this.loadUsers.call(this);
    }

    loadUsers() {
        fetch('http://localhost:3000/users/allusers')
        .then(response => response.json()).then((data) =>{
            this.setState((prevState) => {
                return {
                    ...prevState,
                    users: data,
                    openChat: {
                        user: ''
                    }
                }
            })
        });
    }

    logout() {
        localStorage.clear();
        fetch('http://localhost:3000/users/logout', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({user: this.props.match.params.user})
          })
        .then(response => response.json()).then((data) =>{
            if(data == 1) {
                this.socket.emit('userLogout', this.props.match.params.user);
                this.props.history.push(`/`);
            }
        });
    }

    startChat(user) {
        this.setState((prevState) => {
            return {
                ...prevState,
                openChat: {
                    user: user
                }
            }
        })
    }

    render() {
        return (
            <div>
                <span onClick={this.logout.bind(this)}>Log out</span>
                <div  className='row'>
                    <div className='col-sm-4'>
                        <ul>
                        {
                            this.state.users.map((user, key) => {
                                if(user != this.props.match.params.user){
                                    return (
                                    <li key={key} onClick={this.startChat.bind(this, user)}>{ user }</li>
                                    )
                                }
                            })
                        }
                        </ul>
                    </div>
                    <div className='col-sm-8'>
                        <h1>{ this.state.openChat.user }</h1>
                        { this.state.openChat.user ? (<Chat user={this.props.match.params.user} talkWith={this.state.openChat.user}/>):(<div></div>) }
                    </div>
                </div>
            </div>
        
        );
    }
}

export default Main;

