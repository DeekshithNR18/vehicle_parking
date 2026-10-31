import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

const KNOWLEDGE_BASE = [
  { keywords: ["register", "registration", "signup", "login", "account", "create"], answer: "To register, click 'Select Role' on the login screen, choose Resident, and enter any email/password. You can now book slots!" },
  { keywords: ["security", "safe", "cctv", "guard"], answer: "Our society is monitored 24/7 by CCTV and security guards. All entry/exit passes are verified via QR code." },
  { keywords: ["maintenance", "broken", "fix", "repair", "complaint"], answer: "Please go to the 'Maintenance' tab in the sidebar to file a complaint. You can attach a photo and track the status." },
  { keywords: ["price", "cost", "fee", "payment", "money", "rate", "much"], answer: "Current Rates: Car = Rs.25/hr, Bike = Rs.15/hr, EV = Rs.40/hr. You can top up your wallet from the 'Wallet' tab." },
  { keywords: ["ev", "charging", "electric", "battery"], answer: "We have dedicated EV charging bays marked in Blue on the Parking Map. Rate is Rs.40/hr." },
  { keywords: ["visitor", "guest", "friend", "family"], answer: "Go to the 'Visitors' tab to generate a one-time QR pass for your guest. It expires automatically." },
  { keywords: ["cancel", "refund"], answer: "You can cancel an active booking from 'My Bookings'. Refunds are processed instantly to your wallet." },
  { keywords: ["offline", "internet", "network"], answer: "Our app supports offline mode! You can still view the map and make a booking; it will sync when you reconnect." },
  { keywords: ["car", "suv", "sedan"], answer: "We have plenty of car slots available at Rs.25/hr. Head over to the 'Parking Map' to book one!" },
  { keywords: ["bike", "motorcycle", "scooter"], answer: "Bike parking is available at Rs.15/hr. Check the 'Parking Map' for green slots!" },
  { keywords: ["hello", "hi", "hey"], answer: "Hello! How can I assist you with your parking needs today?" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Smart Parking Assistant. Ask me about registration, prices, EV charging, or security.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = userMsg.text.toLowerCase();
      let matchedAnswer = null;
      
      for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some(kw => lowerInput.includes(kw))) {
          matchedAnswer = item.answer;
          break;
        }
      }

      let botResponse = matchedAnswer 
        ? matchedAnswer 
        : "I'm not exactly sure about that. Could you rephrase? You can also contact the society office at +91 98765 43210.";

      setMessages((prev) => [...prev, { id: Date.now() + 1, text: botResponse, sender: "bot" }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-mint text-deep rounded-full shadow-[0_0_20px_rgba(0,229,160,0.4)] flex items-center justify-center z-50 hover:bg-mint/90 transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-deep border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-panel p-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 bg-mint/20 rounded-full flex items-center justify-center text-mint">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-textp">Parking Assistant</h3>
                <p className="text-xs text-mint flex items-center gap-1">
                  <span className="w-2 h-2 bg-mint rounded-full animate-pulse"></span> AI Online
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-panel/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-azure/20 text-azure" : "bg-mint/20 text-mint"}`}>
                      {msg.sender === "user" ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-azure text-white rounded-tr-sm" : "bg-elevated text-textp rounded-tl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="w-6 h-6 rounded-full bg-mint/20 text-mint flex items-center justify-center shrink-0">
                      <Bot size={12} />
                    </div>
                    <div className="p-3 rounded-2xl bg-elevated text-textp rounded-tl-sm flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-panel">
              <div className="flex items-center gap-2 bg-deep rounded-xl border border-white/10 p-1 focus-within:border-mint/50 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about prices, car, bike..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-textp focus:outline-none placeholder-muted/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-mint text-deep rounded-lg hover:bg-mint/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
