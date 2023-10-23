import React, { useState, useEffect } from "react";
import * as StompJs from "@stomp/stompjs";
import { useParams } from 'react-router-dom';

export default function Chat(props) {
    let [client, changeClient] = useState(null);

    const params = useParams();

    const [chatList, setChatList] = useState([]);
    const [chat, setChat] = useState("");

    // 요소 콜백
    const handleChatInput = (event) => {
        setChat(event.target.value);
    };
    
    // Pub/Sub
    const callbackSub = function (message) {
        if (message.body) {
            let msg = JSON.parse(message.body);
            setChatList((chats) => [...chats, msg]);
        }
    };

    const callbackPub = function () {
        if (chat === "") {
            return;
        }
    
        client.publish({
        destination: "/pub/chat/message",
            body: JSON.stringify({
                messageType: "TALK",
                sender: "userId",
                roomId: params.roomId,
                message: chat,
            }),
        });
    
        setChat("");
    };

    // Connect, DisConnect
    const connect = () => {
    // 소켓 연결
        try {
            const clientdata = new StompJs.Client({
                brokerURL: "ws://localhost:8080/ws-stomp"
            });

            // 구독
            clientdata.onConnect = function () {
                clientdata.subscribe(`/sub/chat/room/${params.roomId}`, callbackSub);
            };

            clientdata.activate(); // 클라이언트 활성화
            changeClient(clientdata); // 클라이언트 갱신
        } catch (err) {
            console.log(err);
        }
    };
    
    const disConnect = () => {
        // 연결 끊기
        if (client === null) {
            return;
        }
        client.deactivate();
    };

    // 컴포넌트 생성 시, 접속
    // 컴포넌트 파괴 시, 접속 끊기.
    useEffect(() => {
        connect();
        return () => disConnect();
    }, []);

    return (
        <div>
            chat

            <br/>
            <br/>

            {chatList.map((element, index) => (
                <p key={index}>{element.message}</p>
            ))}

            <input type="text" onChange={handleChatInput}/>
            <p>{chat}</p>

            <button onClick={callbackPub}>
                전송
            </button>
        </div>
    );
  }