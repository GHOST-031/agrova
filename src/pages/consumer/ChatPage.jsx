import React from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, ChevronLeft, Paperclip, Image, X } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const mockThreads = [
  {
    id: "t1",
    farmer: { name: "Ravi Kumar", avatar: "https://ui-avatars.com/api/?name=Ravi+Kumar&background=4a9a4a&color=fff" },
    lastMessage: "Your tomatoes will be delivered by 5 PM.",
    unread: 1,
  },
  {
    id: "t2",
    farmer: { name: "Sunita Devi", avatar: "https://ui-avatars.com/api/?name=Sunita+Devi&background=4a9a4a&color=fff" },
    lastMessage: "Sure, I can pack them without stems.",
    unread: 0,
  },
  {
    id: "t3",
    farmer: { name: "Amit Singh", avatar: "https://ui-avatars.com/api/?name=Amit+Singh&background=4a9a4a&color=fff" },
    lastMessage: "Fresh batch of eggs just arrived today!",
    unread: 0,
  },
];

const initialMessagesByThread = {
  t1: [
    { id: "m1", from: "farmer", text: "Hello! Your order has been picked.", time: "4:10 PM" },
    { id: "m2", from: "you", text: "Great, thanks!", time: "4:11 PM" },
    { id: "m3", from: "farmer", type: "image", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop", time: "4:11 PM" },
    { id: "m4", from: "farmer", text: "Your tomatoes will be delivered by 5 PM.", time: "4:12 PM" },
  ],
  t2: [
    { id: "m1", from: "you", text: "Can you remove stems from spinach?", time: "9:02 AM" },
    { id: "m2", from: "farmer", text: "Sure, I can pack them without stems.", time: "9:04 AM" },
  ],
  t3: [
    { id: "m1", from: "farmer", text: "Fresh batch of eggs just arrived today!", time: "7:30 AM" },
    { id: "m2", from: "farmer", type: "image", url: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=300&h=300&fit=crop", time: "7:31 AM" },
  ],
};

const ChatPage = () => {
  const [threads] = React.useState(mockThreads);
  const [activeThreadId, setActiveThreadId] = React.useState(threads[0]?.id);
  const [messagesByThread, setMessagesByThread] = React.useState(initialMessagesByThread);
  const [input, setInput] = React.useState("");
  const [attachedFiles, setAttachedFiles] = React.useState([]);
  const fileInputRef = React.useRef(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const messages = messagesByThread[activeThreadId] || [];

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedFiles((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: file.name,
            type: type,
            preview: event.target?.result,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = (id) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed && attachedFiles.length === 0) return;

    if (trimmed) {
      const newMessage = {
        id: `m-${Date.now()}`,
        from: "you",
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessagesByThread((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), newMessage],
      }));
    }

    // Send attachments
    attachedFiles.forEach((file) => {
      const attachmentMessage = {
        id: `m-${Date.now()}-${file.id}`,
        from: "you",
        type: file.type,
        url: file.preview,
        name: file.name,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessagesByThread((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), attachmentMessage],
      }));
    });

    setInput("");
    setAttachedFiles([]);

    // Simulate farmer reply
    setTimeout(() => {
      setMessagesByThread((prev) => ({
        ...prev,
        [activeThreadId]: [
          ...(prev[activeThreadId] || []),
          {
            id: `r-${Date.now()}`,
            from: "farmer",
            text: "Got it! Will do.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-6 flex items-center space-x-2">
          <MessageSquare className="w-7 h-7 text-forest-600 dark:text-forest-300" />
          <span>Chat</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-0 overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
            <div className="font-semibold text-forest-800 dark:text-forest-100">Conversations</div>
            <div className="text-sm text-forest-500 dark:text-forest-400">{threads.length} threads</div>
          </div>
          <div className="divide-y divide-forest-200 dark:divide-forest-700">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full text-left p-4 hover-forest flex items-center space-x-3 ${
                  t.id === activeThreadId ? "bg-forest-50 dark:bg-forest-800" : ""
                }`}
              >
                <img src={t.farmer.avatar} alt={t.farmer.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-forest-800 dark:text-forest-100">{t.farmer.name}</span>
                    {t.unread > 0 && (
                      <span className="text-xs bg-error-500 text-white rounded-full px-2 py-0.5">{t.unread}</span>
                    )}
                  </div>
                  <div className="text-sm text-forest-500 dark:text-forest-400 truncate">{t.lastMessage}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden lg:col-span-2">
          {activeThread ? (
            <div className="flex flex-col h-[65vh]">
              <div className="p-4 border-b border-forest-200 dark:border-forest-700 flex items-center space-x-3">
                <button className="lg:hidden p-1 rounded hover-forest">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <img src={activeThread.farmer.avatar} alt={activeThread.farmer.name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-medium text-forest-800 dark:text-forest-100">{activeThread.farmer.name}</div>
                  <div className="text-xs text-success-600">Online</div>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-forest">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${
                        m.from === "you"
                          ? "bg-forest-600 text-white"
                          : "bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-forest-100"
                      }`}
                    >
                      {m.type === "image" ? (
                        <div className="space-y-1">
                          <img src={m.url} alt="shared" className="rounded max-w-full h-auto" />
                          <div className={`text-[10px] opacity-75 ${m.from === "you" ? "text-white" : "text-forest-500 dark:text-forest-400"}`}>{m.time}</div>
                        </div>
                      ) : m.type === "file" ? (
                        <div className="space-y-1">
                          <a
                            href={m.url}
                            download={m.name}
                            className={`flex items-center gap-2 p-2 rounded ${
                              m.from === "you"
                                ? "bg-white/20 hover:bg-white/30"
                                : "bg-forest-200 dark:bg-forest-700 hover:bg-forest-300 dark:hover:bg-forest-600"
                            }`}
                          >
                            <Paperclip className="w-4 h-4" />
                            <span className="truncate flex-1">{m.name}</span>
                          </a>
                          <div className={`text-[10px] opacity-75 ${m.from === "you" ? "text-white" : "text-forest-500 dark:text-forest-400"}`}>{m.time}</div>
                        </div>
                      ) : (
                        <>
                          <div>{m.text}</div>
                          <div className={`mt-1 text-[10px] opacity-75 ${m.from === "you" ? "text-white" : "text-forest-500 dark:text-forest-400"}`}>{m.time}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-forest-200 dark:border-forest-700 space-y-2">
                {/* Attachments Preview */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-2">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="relative inline-block rounded-lg overflow-hidden bg-forest-100 dark:bg-forest-800"
                      >
                        {file.type === "image" ? (
                          <img
                            src={file.preview}
                            alt="preview"
                            className="w-16 h-16 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center">
                            <Paperclip className="w-6 h-6 text-forest-600 dark:text-forest-400" />
                          </div>
                        )}
                        <button
                          onClick={() => removeAttachment(file.id)}
                          className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e, "image")}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="p-2 text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-800 rounded-lg transition-colors"
                    title="Attach image"
                  >
                    <Image className="w-5 h-5" />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e, "file")}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setAttachedFiles((prev) => [
                              ...prev,
                              {
                                id: Date.now(),
                                name: file.name,
                                type: "file",
                                preview: event.target?.result,
                                size: file.size,
                              },
                            ]);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="p-2 text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-800 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border border-forest-300 dark:border-forest-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-400"
                  />
                  <Button onClick={sendMessage} icon={Send} iconPosition="right">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[65vh] flex items-center justify-center text-forest-500 dark:text-forest-400">
              Select a conversation to start chatting
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;


