import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Headphones, RotateCcw, Paperclip, Bot } from 'lucide-react';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { CustomerQuickPrompts } from '../components/CustomerQuickPrompts';
import { INITIAL_CHAT_MESSAGES } from '../data/customerData';
import { generateAiResponse } from '../services/customerAiService';
import type { ChatMessage } from '../types/customer.types';

export const CustomerChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasEscalated, setHasEscalated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isThinking) return;

    const userMsg: ChatMessage = {
      id: `CUST-${Date.now()}`,
      sender: 'customer',
      text: content,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const aiReplyData = generateAiResponse(content);
      const aiMsg: ChatMessage = {
        ...aiReplyData,
        id: `AI-${Date.now()}`,
        timestamp: 'Just now',
      };
      if (aiReplyData.isEscalated) {
        setHasEscalated(true);
      }
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 700);
  };

  const handleEscalateToHuman = () => {
    handleSendMessage('Connect me to a human support agent please.');
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
    setHasEscalated(false);
  };

  return (
    <div className="flex-1 flex flex-col rounded-3xl bg-surface border border-border shadow-card overflow-hidden">
      {/* 1. Chat Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-violet text-white flex items-center justify-center shrink-0 shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Acme Enterprise Support AI
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </div>
            <p className="text-xs text-foreground-muted">
              Private AI agent indexed with verified troubleshooting runbooks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!hasEscalated && (
            <button
              type="button"
              onClick={handleEscalateToHuman}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-all shadow-subtle"
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>Request Human Agent</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-all"
            title="Reset Chat Session"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-surface-subtle border border-border text-xs text-foreground-muted max-w-xs animate-pulse">
            <Sparkles className="h-4 w-4 text-brand-violet animate-spin" />
            <span>Resolyx AI is searching knowledge base...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 3. Footer Prompts & Input Box */}
      <div className="p-3 sm:p-4 border-t border-border bg-surface-subtle/30 space-y-2">
        <CustomerQuickPrompts onSelectPrompt={handleSendMessage} disabled={isThinking} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your issue, error code, or ask a technical question..."
              disabled={isThinking}
              className="w-full pl-4 pr-10 py-3 rounded-2xl border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo focus:outline-none shadow-subtle transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground p-1"
              title="Attach logs or screenshot"
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="px-4 py-3 rounded-2xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <p className="text-[10px] text-center text-foreground-muted">
          Protected by Resolyx Private AI Security • Zero data retention on public training models
        </p>
      </div>
    </div>
  );
};

