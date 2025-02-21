import React from "react";

// Exemplo de tipagem do ChatOptions
interface ChatOptionsProps {
  onOptionSelect: (option: "Socorro" | "Pane Mecânica" | "Acidente" | "Animais na Pista") => void;
}


const ChatOptions: React.FC<ChatOptionsProps> = ({ onOptionSelect }) => {
  return (
    <div className="chat-options">
      <button onClick={() => onOptionSelect("Socorro")}>🚨 Socorro</button>
      <button onClick={() => onOptionSelect("Pane Mecânica")}>🔧 Pane Mecânica</button>
      <button onClick={() => onOptionSelect("Acidente")}>⚠️ Acidente</button>
      <button onClick={() => onOptionSelect("Animais na Pista")}>🐾 Animais na Pista</button>
    </div>
  );
};

export default ChatOptions;