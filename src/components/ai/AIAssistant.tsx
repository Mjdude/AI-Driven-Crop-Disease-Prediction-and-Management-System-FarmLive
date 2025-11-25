import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MessageSquare,
  Search,
  Camera,
  Brain,
  Sparkles,
  Send,
  Image as ImageIcon,
  Upload,
  Download,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Mic,
  Settings,
  Clock,
  Zap,
  Lightbulb,
  FileText,
  Leaf,
  Droplet,
  CloudRain,
  Bug,
  Sprout,
  Share2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye
} from 'lucide-react';

import { toast } from 'sonner';

// Import Dialogs
import { VoiceListeningDialog } from './VoiceListeningDialog';
import { FileUploadDialog } from './FileUploadDialog';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  helpful?: boolean;
  attachment?: {
    type: 'image' | 'file';
    name: string;
  };
}

interface Recommendation {
  id: string;
  title: string;
  category: 'crop' | 'pest' | 'weather' | 'fertilizer' | 'irrigation';
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  createdAt: string;
  applied: boolean;
}

interface ImageAnalysis {
  id: string;
  imageUrl: string;
  analysisType: 'pest' | 'disease' | 'crop' | 'soil';
  result: {
    identified: string;
    confidence: number;
    severity?: string;
    recommendations: string[];
  };
  timestamp: string;
  saved: boolean;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: number;
  views: number;
  helpful: number;
  lastUpdated: string;
  bookmarked: boolean;
}

const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your AI Farm Assistant. How can I help you today?',
    timestamp: '2024-11-21T09:00:00Z'
  }
];

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Apply Nitrogen Fertilizer to Wheat Crop',
    category: 'fertilizer',
    description: 'Based on soil analysis and crop stage, your wheat crop requires nitrogen fertilization. Apply 50kg/acre of urea for optimal growth.',
    priority: 'high',
    confidence: 92,
    actionable: true,
    createdAt: '2024-11-21T08:00:00Z',
    applied: false
  },
  {
    id: '2',
    title: 'Pest Alert: Monitor for Aphids',
    category: 'pest',
    description: 'Weather conditions are favorable for aphid infestation. Inspect your crops regularly and consider preventive measures.',
    priority: 'high',
    confidence: 85,
    actionable: true,
    createdAt: '2024-11-21T07:30:00Z',
    applied: false
  },
  {
    id: '3',
    title: 'Optimize Irrigation Schedule',
    category: 'irrigation',
    description: 'Reduce irrigation frequency by 20% based on upcoming rainfall forecast and current soil moisture levels.',
    priority: 'medium',
    confidence: 88,
    actionable: true,
    createdAt: '2024-11-20T15:00:00Z',
    applied: true
  }
];

const mockImageAnalyses: ImageAnalysis[] = [
  {
    id: '1',
    imageUrl: '🐛',
    analysisType: 'pest',
    result: {
      identified: 'Aphids (Aphis gossypii)',
      confidence: 94,
      severity: 'Moderate',
      recommendations: [
        'Apply neem oil spray (5ml per liter of water)',
        'Introduce natural predators like ladybugs',
        'Remove heavily infested leaves',
        'Monitor daily for 7 days'
      ]
    },
    timestamp: '2024-11-21T10:30:00Z',
    saved: true
  }
];

const mockKnowledgeBase: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Complete Guide to Wheat Cultivation in North India',
    category: 'Crop Management',
    summary: 'Learn everything about wheat farming from soil preparation to harvesting, including best practices and common challenges.',
    readTime: 12,
    views: 2456,
    helpful: 234,
    lastUpdated: '2024-11-15',
    bookmarked: true
  },
  {
    id: '2',
    title: 'Integrated Pest Management Strategies',
    category: 'Pest Control',
    summary: 'Effective methods to control pests using biological, cultural, and chemical approaches while minimizing environmental impact.',
    readTime: 8,
    views: 1823,
    helpful: 189,
    lastUpdated: '2024-11-10',
    bookmarked: false
  }
];

import { useTranslation } from 'react-i18next';

export const AIAssistant: React.FC = () => {
  const { t } = useTranslation();
  // State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aiChatHistory');
    return saved ? JSON.parse(saved) : mockChatHistory;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [imageAnalyses, setImageAnalyses] = useState<ImageAnalysis[]>(mockImageAnalyses);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeArticle[]>(mockKnowledgeBase);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Dialog States
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    localStorage.setItem('aiChatHistory', JSON.stringify(chatMessages));
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Derived State
  const totalRecommendations = recommendations.length;
  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
  const appliedCount = recommendations.filter(r => r.applied).length;
  const savedAnalysesCount = imageAnalyses.filter(a => a.saved).length;

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesCategory = filterCategory === 'all' || rec.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || rec.priority === filterPriority;
    return matchesCategory && matchesPriority;
  });

  // Handlers
  const handleSendMessage = async (text: string = currentMessage) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const API_KEY = 'AIzaSyC_oMgDNR5OXxCtitsFFpUYH8vdeEBo3pk';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: text }] }] })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Gemini API Error:', data);
        throw new Error(data.error?.message || 'API request failed');
      }

      if (!data.candidates || data.candidates.length === 0) {
        console.error('No candidates in response:', data);
        throw new Error('No response generated');
      }

      const aiText = data.candidates[0].content.parts[0].text;

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      toast.error(t('ai_assistant.chat.error', { message: error.message }));
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('ai_assistant.chat.default_error', { message: error.message }),
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }

  };


  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('weather')) return 'Based on the latest forecast, we expect light rain in the next 48 hours. It would be best to delay any planned irrigation.';
    if (lowerQuery.includes('pest') || lowerQuery.includes('disease')) return 'I can help identify pests or diseases. Please upload a photo using the "Upload Image" button for accurate analysis.';
    if (lowerQuery.includes('fertilizer')) return 'For your current wheat crop stage, a nitrogen-rich fertilizer is recommended. Ensure soil moisture is adequate before application.';
    return 'I understand your query. Could you provide more specific details so I can give you the best advice for your farm?';
  };

  const handleVoiceTranscript = (text: string) => {
    handleSendMessage(text);
  };

  const handleAnalysisComplete = (result: any) => {
    const analysisMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I've analyzed your ${result.type}. \n\n**Summary:** ${result.summary}\n\n**Confidence:** ${result.confidence}%\n\n**Recommendations:**\n${result.recommendations.map((r: string) => `- ${r}`).join('\n')}`,
      timestamp: new Date().toISOString(),
      attachment: {
        type: result.type === 'image' ? 'image' : 'file',
        name: result.fileName
      }
    };
    setChatMessages(prev => [...prev, analysisMessage]);
  };

  const handleExportChat = () => {
    const chatText = chatMessages.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-assistant-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t('ai_assistant.chat.exported'));
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setChatMessages([mockChatHistory[0]]);
      toast.success(t('ai_assistant.chat.cleared'));
    }
  };

  const handleMarkHelpful = (messageId: string, helpful: boolean) => {
    setChatMessages(chatMessages.map(msg =>
      msg.id === messageId ? { ...msg, helpful } : msg
    ));
    toast.success(helpful ? t('ai_assistant.chat.helpful') : t('ai_assistant.chat.feedback'));
  };

  const handleApplyRecommendation = (recId: string) => {
    setRecommendations(recommendations.map(rec =>
      rec.id === recId ? { ...rec, applied: true } : rec
    ));
    toast.success(t('ai_assistant.recommendations.marked_applied'));
  };

  const handleToggleSaveAnalysis = (analysisId: string) => {
    setImageAnalyses(imageAnalyses.map(analysis =>
      analysis.id === analysisId ? { ...analysis, saved: !analysis.saved } : analysis
    ));
    const analysis = imageAnalyses.find(a => a.id === analysisId);
    toast.success(analysis?.saved ? t('ai_assistant.image_analysis.removed') : t('ai_assistant.image_analysis.saved'));
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(t('ai_assistant.chat.copy'));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crop': return <Sprout className="h-4 w-4" />;
      case 'pest': return <Bug className="h-4 w-4" />;
      case 'weather': return <CloudRain className="h-4 w-4" />;
      case 'fertilizer': return <Leaf className="h-4 w-4" />;
      case 'irrigation': return <Droplet className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('ai_assistant.title')}</h1>
          <p className="text-gray-600 mt-2">{t('ai_assistant.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t('ai_assistant.settings')}
          </Button>
          <Button className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {t('ai_assistant.insights')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ai_assistant.summary.active')}</p>
                <p className="text-2xl font-bold">{totalRecommendations}</p>
              </div>
              <Brain className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ai_assistant.summary.high_priority')}</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ai_assistant.summary.applied')}</p>
                <p className="text-2xl font-bold text-green-600">{appliedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ai_assistant.summary.saved')}</p>
                <p className="text-2xl font-bold text-purple-600">{savedAnalysesCount}</p>
              </div>
              <Camera className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">{t('ai_assistant.tabs.chat')}</TabsTrigger>
          <TabsTrigger value="recommendations">{t('ai_assistant.tabs.recommendations')}</TabsTrigger>
          <TabsTrigger value="image">{t('ai_assistant.tabs.image')}</TabsTrigger>
          <TabsTrigger value="knowledge">{t('ai_assistant.tabs.knowledge')}</TabsTrigger>
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('ai_assistant.chat.title')}
                </CardTitle>
                <CardDescription>
                  {t('ai_assistant.chat.description')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportChat}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('ai_assistant.chat.export')}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearChat}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={message.role === 'user' ? 'bg-blue-100' : 'bg-indigo-100'}>
                          {message.role === 'user' ? '👤' : '🤖'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : ''}`}>
                        <div
                          className={`rounded-lg p-3 ${message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.attachment && (
                            <div className="mt-2 p-2 bg-white/20 rounded flex items-center gap-2 text-xs">
                              {message.attachment.type === 'image' ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                              <span>{message.attachment.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          {message.role === 'assistant' && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopyMessage(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${message.helpful === true ? 'text-green-600' : ''}`}
                                onClick={() => handleMarkHelpful(message.id, true)}
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${message.helpful === false ? 'text-red-600' : ''}`}
                                onClick={() => handleMarkHelpful(message.id, false)}
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-100">🤖</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowVoiceInput(true)}>
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder={t('ai_assistant.chat.placeholder')}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={() => handleSendMessage()} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setShowFileUpload(true)}>
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {t('ai_assistant.chat.upload_image')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowFileUpload(true)}>
                    <FileText className="h-3 w-3 mr-1" />
                    {t('ai_assistant.chat.share_report')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('ai_assistant.recommendations.title')}</h2>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('ai_assistant.recommendations.generate')}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('ai_assistant.recommendations.filters.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('ai_assistant.recommendations.filters.category')}</SelectItem>
                <SelectItem value="crop">{t('ai_assistant.recommendations.filters.crop')}</SelectItem>
                <SelectItem value="pest">{t('ai_assistant.recommendations.filters.pest')}</SelectItem>
                <SelectItem value="weather">{t('ai_assistant.recommendations.filters.weather')}</SelectItem>
                <SelectItem value="fertilizer">{t('ai_assistant.recommendations.filters.fertilizer')}</SelectItem>
                <SelectItem value="irrigation">{t('ai_assistant.recommendations.filters.irrigation')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('ai_assistant.recommendations.filters.priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('ai_assistant.recommendations.filters.priority')}</SelectItem>
                <SelectItem value="high">{t('ai_assistant.recommendations.filters.high')}</SelectItem>
                <SelectItem value="medium">{t('ai_assistant.recommendations.filters.medium')}</SelectItem>
                <SelectItem value="low">{t('ai_assistant.recommendations.filters.low')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.id} className={rec.applied ? 'bg-green-50/50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${rec.category === 'pest' ? 'bg-red-100' :
                          rec.category === 'fertilizer' ? 'bg-green-100' :
                            rec.category === 'irrigation' ? 'bg-blue-100' :
                              rec.category === 'weather' ? 'bg-purple-100' :
                                'bg-yellow-100'
                          }`}>
                          {getCategoryIcon(rec.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{rec.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {rec.confidence}% {t('ai_assistant.recommendations.confidence')}
                            </Badge>
                            {rec.applied && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('ai_assistant.recommendations.applied')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{rec.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(rec.createdAt)}
                        </span>
                        {rec.actionable && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Zap className="h-3 w-3 mr-1" />
                            {t('ai_assistant.recommendations.actionable')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!rec.applied && rec.actionable && (
                        <Button onClick={() => handleApplyRecommendation(rec.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t('ai_assistant.recommendations.mark_applied')}
                        </Button>
                      )}
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        {t('ai_assistant.recommendations.details')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('ai_assistant.recommendations.no_results')}</h3>
              <p className="text-gray-600">{t('ai_assistant.recommendations.adjust_filters')}</p>
            </div>
          )}
        </TabsContent>

        {/* Image Analysis Tab */}
        <TabsContent value="image" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('ai_assistant.image_analysis.title')}</h2>
            <Button onClick={() => setShowFileUpload(true)}>
              <Upload className="h-4 w-4 mr-2" />
              {t('ai_assistant.image_analysis.upload_new')}
            </Button>
          </div>

          <div className="space-y-4">
            {imageAnalyses.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    <div className="text-8xl">{analysis.imageUrl}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {analysis.analysisType}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              {analysis.result.confidence}% {t('ai_assistant.image_analysis.confidence')}
                            </Badge>
                            {analysis.result.severity && (
                              <Badge className={
                                analysis.result.severity === 'High' ? 'bg-red-100 text-red-800' :
                                  analysis.result.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                              }>
                                {analysis.result.severity} {t('ai_assistant.image_analysis.severity')}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-1">{analysis.result.identified}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {t('ai_assistant.image_analysis.analyzed_on')} {formatDate(analysis.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleSaveAnalysis(analysis.id)}
                        >
                          <Download className={`h-5 w-5 ${analysis.saved ? 'text-blue-600' : ''}`} />
                        </Button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          {t('ai_assistant.image_analysis.recommendations')}
                        </h4>
                        <ul className="space-y-2">
                          {analysis.result.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {t('ai_assistant.image_analysis.download_report')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          {t('ai_assistant.image_analysis.share')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('ai_assistant.knowledge.title')}</h2>
            <div className="flex gap-2">
              <Input placeholder={t('ai_assistant.knowledge.search')} className="w-64" />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {knowledgeBase.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                        {article.bookmarked && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('ai_assistant.knowledge.saved')}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                      <CardDescription>{article.summary}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime} {t('ai_assistant.knowledge.read_time')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views} {t('ai_assistant.knowledge.views')}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.helpful} {t('ai_assistant.knowledge.helpful')}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">{t('ai_assistant.knowledge.read_more')}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <VoiceListeningDialog
        open={showVoiceInput}
        onOpenChange={setShowVoiceInput}
        onTranscript={handleVoiceTranscript}
      />

      <FileUploadDialog
        open={showFileUpload}
        onOpenChange={setShowFileUpload}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  );
};
