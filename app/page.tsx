"use client";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [userName, setUserName] = useState("");
  const [clientInfo, setClientInfo] = useState({
    ip: "",
    city: "",
    region: "",
    country: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    const fetchClientInfo = async () => {
      const response = await fetch("/api/getClientInfo");
      const data = await response.json();
      setClientInfo(data);
    };

    fetchClientInfo();
  }, []);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setClientInfo((prev) => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            }));

            // Enviar a localização para o backend
            fetch("/api/saveLocation", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ latitude, longitude }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Success:", data);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocalização não é suportada por este navegador.");
      }
    };

    getLocation();
  }, []);

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", data);
  };

  const googleMapsLink = `https://www.google.com/maps?q=${clientInfo.latitude},${clientInfo.longitude}`;

  return (
    <div style={{ color: "#195D5B" }}>
      <header className="flex max-w-lg justify-center items-center mx-auto">
        <Image
          src="/logo-via-SP-Serra.png"
          alt="Logo Via Appia"
          width={1000}
          height={200}
          className="w-full"
        />
      </header>
      <main className="flex w-full max-w-3xl mx-auto flex-col items-center">
        <h1 className="mb-4 text-2xl font-bold">
          Bem-vindo ao SOS via SP SERRA
        </h1>
        <p>
          Estamos aqui para ajudá-lo em emergências no trecho atendido pela
          concessão via SP SERRA.
        </p>
        <p id="ip-address">IP: {clientInfo.ip}</p>
        
        <p> 📍 Sua localização: 
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
            Ver no Google Maps
          </a>
        </p>
      </main>
      <div className="flex mt-2 justify-center w-full">
        {!joined ? (
          <div className="flex w-full max-w-3xl mx-auto flex-col items-center">
            <h1 className="mb-4 text-2xl font-bold">Sala</h1>
            <input
              type="text"
              placeholder="Entre com o usuario"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="x-64 px-4 py-2 mb-4 border-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Entre com a Sala"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="x-64 px-4 py-2 mb-4 border-2 rounded-lg"
            />
            <button
              onClick={handleJoinRoom}
              className="px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: "#195D5B" }}
            >
              Entrar
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto">
            <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>
            <div className="h-[300px] overflow-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  sender={msg.sender}
                  message={msg.message}
                  isOwnMessage={msg.sender === userName}
                />
              ))}
            </div>
            <ChatForm onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
