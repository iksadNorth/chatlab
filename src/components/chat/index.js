import React, { useState, useEffect } from "react";
import * as StompJs from "@stomp/stompjs";
import { useParams } from 'react-router-dom';

export default function Chat(props) {
    const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiYXV0aCI6IlVTRVIiLCJleHAiOjMyNTA2MzU4NDAwLCJpYXQiOjE2OTgwNDc2Njl9.7YN9lWI72OsbN6snZXopTsiXWAdTBZzn6zRDk-_UA0Q";

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

    const callbackPub = function (type) {
        if (chat === "") {
            return;
        }
    
        client.publish({
            destination: "/pub/chat/message",
            headers: {
                Authorization: token
            },
            body: JSON.stringify({
                "chat_type": type,
                "chat_room_id": params.roomId,
                "chat_message": chat,
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

            {chatList.map((element, index) => {
                if (element['chat_type'] == "TEXT") {
                    return (
                        <div key={index}>
                            <p>작성 시간: {element['chat_created_at']}</p>
                            <p>보낸이: {element['chat_sender_id']}</p>
                            <p>{element['chat_message']}</p>
                        </div>
                    )
                } else if (element['chat_type'] == "IMAGE") {
                    return (
                        <div key={index}>
                            <p>작성 시간: {element['chat_created_at']}</p>
                            <p>보낸이: {element['chat_sender_id']}</p>
                            <img
                                src={element['chat_message']} 
                                width="200" height="200"
                            />
                        </div>
                    )
                }
            })}

            <br/>
            <br/>

            <input type="text" onChange={handleChatInput}/>
            <p>{chat}</p>

            <button onClick={() => callbackPub("TEXT")}>
                텍스트 전송
            </button>
            <button onClick={() => callbackPub("IMAGE")}>
                이미지 전송
            </button>
        </div>
    );
  }