import React, { useState, useEffect } from 'react';
import { visitHistoryManager } from '../utils/visitHistory';

const VisitStats = () => {
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const statsData = visitHistoryManager.getStats();
    setStats(statsData);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('모든 방문 기록을 삭제하시겠습니까?')) {
      visitHistoryManager.clearAllHistory();
      window.location.reload();
    }
  };

  if (!stats || stats.totalSites === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowStats(!showStats)}
        className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-full hover:bg-white/15 transition-all"
      >
        <div className="flex items-center justify-between text-white">
          <span className="font-bold">📊 내 활동 통계</span>
          <span>{showStats ? '▲' : '▼'}</span>
        </div>
      </button>

      {showStats && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mt-2 text-white">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.totalSites}</div>
              <div className="text-sm text-white/70">방문한 사이트</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.totalVisits}</div>
              <div className="text-sm text-white/70">총 방문 횟수</div>
            </div>
          </div>
          
          <button
            onClick={handleClearHistory}
            className="w-full bg-red-500/80 hover:bg-red-600 text-white py-2 rounded-lg transition-all text-sm"
          >
            🗑️ 방문 기록 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default VisitStats;
