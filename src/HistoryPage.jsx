import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { Trash2, Download, ArrowLeft, Search, ChevronDown, ChevronUp, Calendar, User, Star } from 'lucide-react';

export default function HistoryPage({ currentUser }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser?.id) { navigate('/login'); return; }
    loadHistory();
  }, [currentUser?.id]);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(
        collection(db, 'interviews'),
        where('userId', '==', currentUser.id)
      );
      const snapshot = await getDocs(q);
      const entries = snapshot.docs
        .map(d => ({ firestoreId: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
      setHistory(entries);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Failed to load history. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entry, idx) => {
    if (!confirm('Delete this entry?')) return;
    try {
      if (entry.firestoreId) await deleteDoc(doc(db, 'interviews', entry.firestoreId));
      setHistory(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      setError('Failed to delete entry.');
    }
  };

  const clearAll = async () => {
    if (!confirm(`Delete all ${history.length} interview entries? This cannot be undone.`)) return;
    try {
      await Promise.all(
        history.filter(e => e.firestoreId).map(e => deleteDoc(doc(db, 'interviews', e.firestoreId)))
      );
      setHistory([]);
    } catch (err) {
      setError('Failed to clear history.');
    }
  };

  const downloadCSV = () => {
    if (history.length === 0) return;
    const headers = ['Date', 'Question', 'Your Answer', 'Score', 'Strengths', 'Areas to Improve', 'Emotion', 'Overall Body Language', 'Skills'];
    const rows = history.map(e => [
      e.timestamp || '',
      `"${(e.question || '').replace(/"/g, '""')}"`,
      `"${(e.answer || '').replace(/"/g, '""')}"`,
      e.feedback?.score || 0,
      `"${(e.feedback?.positive || []).join('; ')}"`,
      `"${(e.feedback?.negative || []).join('; ')}"`,
      e.bodyLanguage?.emotions?.primary || '',
      e.bodyLanguage?.scores?.overall || 0,
      `"${(e.skills || []).join('; ')}"`
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_history_${currentUser.name}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = history.filter(e =>
    !searchTerm ||
    e.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgScore = history.length > 0
    ? (history.reduce((sum, e) => sum + (e.feedback?.score || 0), 0) / history.length).toFixed(1)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getEmotionEmoji = (emotion) => ({
    happy: '😊', calm: '😌', focused: '🎯', neutral: '😐',
    nervous: '😬', sad: '😢', surprised: '😲', angry: '😠'
  })[emotion] || '😐';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/bot')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-semibold text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Interview
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📜 Interview History
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <User className="w-4 h-4" /> {currentUser?.name} · {currentUser?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {history.length > 0 && (
              <>
                <button onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl font-semibold transition-all">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl font-semibold transition-all">
                  <Trash2 className="w-4 h-4" /> Clear All
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
            {error}
          </div>
        )}

        {/* Stats Bar */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Sessions', value: history.length, icon: '📋', color: 'blue' },
              { label: 'Avg Score', value: `${avgScore}/10`, icon: '⭐', color: 'yellow' },
              { label: 'Best Score', value: `${Math.max(...history.map(e => e.feedback?.score || 0))}/10`, icon: '🏆', color: 'green' },
              { label: 'Skills Practiced', value: [...new Set(history.flatMap(e => e.skills || []))].length, icon: '🧠', color: 'purple' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl shadow-md p-5 text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        {history.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg font-semibold">Loading your history from cloud...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">{history.length === 0 ? '📭' : '🔍'}</div>
            <p className="text-xl font-bold text-gray-600 mb-2">
              {history.length === 0 ? 'No interview history yet' : 'No results found'}
            </p>
            <p className="text-gray-400">
              {history.length === 0
                ? 'Complete an interview to see your history here'
                : 'Try a different search term'}
            </p>
            {history.length === 0 && (
              <button onClick={() => navigate('/bot')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                Start an Interview
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Showing {filtered.length} of {history.length} entries</p>
            {filtered.map((entry, idx) => (
              <div key={entry.firestoreId || idx}
                className="bg-white rounded-2xl shadow-md border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden">

                {/* Entry Header — always visible */}
                <div
                  className="flex items-start justify-between p-5 cursor-pointer"
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Q{history.length - history.indexOf(entry)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{entry.timestamp}
                      </span>
                      {entry.bodyLanguage?.emotions?.primary && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                          {getEmotionEmoji(entry.bodyLanguage.emotions.primary)} {entry.bodyLanguage.emotions.primary}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-gray-800 text-base leading-snug line-clamp-2">{entry.question}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1 italic">"{entry.answer}"</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getScoreColor(entry.feedback?.score || 0)}`}>
                      {entry.feedback?.score || 0}/10
                    </span>
                    {expandedIdx === idx
                      ? <ChevronUp className="w-5 h-5 text-gray-400" />
                      : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {expandedIdx === idx && (
                  <div className="border-t-2 border-gray-100 p-5 space-y-4">

                    {/* Question */}
                    <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                      <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Question Asked</p>
                      <p className="text-gray-800 font-semibold">{entry.question}</p>
                    </div>

                    {/* User's Answer */}
                    <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-gray-400">
                      <p className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Your Answer</p>
                      <p className="text-gray-800 leading-relaxed">{entry.answer}</p>
                    </div>

                    {/* Score + Feedback row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {entry.feedback?.positive?.length > 0 && (
                        <div className="p-4 bg-green-50 rounded-xl">
                          <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">✅ Strengths</p>
                          <ul className="space-y-1">
                            {entry.feedback.positive.map((p, i) => (
                              <li key={i} className="text-sm text-green-800 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {entry.feedback?.negative?.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-xl">
                          <p className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wide">⚠️ Areas to Improve</p>
                          <ul className="space-y-1">
                            {entry.feedback.negative.map((n, i) => (
                              <li key={i} className="text-sm text-red-800 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>{n}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Body Language */}
                    {entry.bodyLanguage?.scores && (
                      <div className="p-4 bg-indigo-50 rounded-xl">
                        <p className="text-xs font-bold text-indigo-700 mb-3 uppercase tracking-wide">📊 Body Language Analysis</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          {[
                            { label: 'Posture', val: entry.bodyLanguage.scores.posture },
                            { label: 'Eye Contact', val: entry.bodyLanguage.scores.eyeContact },
                            { label: 'Confidence', val: entry.bodyLanguage.scores.confidence },
                            { label: 'Overall', val: entry.bodyLanguage.scores.overall },
                          ].map(s => (
                            <div key={s.label} className="bg-white rounded-lg p-2 text-center shadow-sm">
                              <div className={`text-lg font-bold ${s.val >= 7 ? 'text-green-600' : s.val >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {s.val}/10
                              </div>
                              <div className="text-xs text-gray-500">{s.label}</div>
                            </div>
                          ))}
                        </div>
                        {entry.bodyLanguage.posture && (
                          <div className="space-y-1 text-sm text-indigo-800">
                            <p>• {entry.bodyLanguage.posture}</p>
                            <p>• {entry.bodyLanguage.engagement}</p>
                            <p>• {entry.bodyLanguage.confidence}</p>
                          </div>
                        )}
                        {entry.bodyLanguage.emotions?.primary && (
                          <div className="mt-2 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm text-sm font-semibold text-indigo-700">
                            {getEmotionEmoji(entry.bodyLanguage.emotions.primary)}
                            {entry.bodyLanguage.emotions.primary} ({entry.bodyLanguage.emotions.confidence}% confidence)
                          </div>
                        )}
                      </div>
                    )}

                    {/* Model Answer */}
                    {entry.feedback?.correctAnswer && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-400">
                        <p className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">✨ Model Answer</p>
                        <p className="text-sm text-purple-900 leading-relaxed">{entry.feedback.correctAnswer}</p>
                      </div>
                    )}

                    {/* Skills + Delete */}
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                      <div className="flex flex-wrap gap-2">
                        {(entry.skills || []).map((skill, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold capitalize">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button onClick={() => deleteEntry(entry, idx)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}