// 방문 내역 관리 유틸리티
const VISIT_HISTORY_KEY = 'when_bored_visit_history';
const LAST_VISIT_KEY = 'when_bored_last_visit';

export const visitHistoryManager = {
  // 사이트 방문 기록 저장
  recordVisit: (siteId, siteName) => {
    try {
      const history = visitHistoryManager.getHistory();
      const timestamp = new Date().toISOString();
      
      history[siteId] = {
        name: siteName,
        lastVisit: timestamp,
        visitCount: (history[siteId]?.visitCount || 0) + 1,
        firstVisit: history[siteId]?.firstVisit || timestamp
      };
      
      localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(history));
      localStorage.setItem(LAST_VISIT_KEY, timestamp);
      
      return true;
    } catch (error) {
      console.error('방문 기록 저장 실패:', error);
      return false;
    }
  },

  // 전체 방문 내역 가져오기
  getHistory: () => {
    try {
      const history = localStorage.getItem(VISIT_HISTORY_KEY);
      return history ? JSON.parse(history) : {};
    } catch (error) {
      console.error('방문 기록 불러오기 실패:', error);
      return {};
    }
  },

  // 특정 사이트 방문 여부 확인
  hasVisited: (siteId) => {
    const history = visitHistoryManager.getHistory();
    return !!history[siteId];
  },

  // 특정 사이트 방문 정보 가져오기
  getVisitInfo: (siteId) => {
    const history = visitHistoryManager.getHistory();
    return history[siteId] || null;
  },

  // 마지막 방문 시간 가져오기
  getLastVisitTime: () => {
    return localStorage.getItem(LAST_VISIT_KEY);
  },

  // 특정 사이트 방문 기록 삭제
  clearSiteHistory: (siteId) => {
    try {
      const history = visitHistoryManager.getHistory();
      delete history[siteId];
      localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('방문 기록 삭제 실패:', error);
      return false;
    }
  },

  // 전체 방문 기록 삭제
  clearAllHistory: () => {
    try {
      localStorage.removeItem(VISIT_HISTORY_KEY);
      localStorage.removeItem(LAST_VISIT_KEY);
      return true;
    } catch (error) {
      console.error('전체 기록 삭제 실패:', error);
      return false;
    }
  },

  // 방문 통계
  getStats: () => {
    const history = visitHistoryManager.getHistory();
    const sites = Object.keys(history);
    
    return {
      totalSites: sites.length,
      totalVisits: sites.reduce((sum, siteId) => sum + history[siteId].visitCount, 0),
      mostVisited: sites.sort((a, b) => 
        history[b].visitCount - history[a].visitCount
      )[0],
      lastVisit: visitHistoryManager.getLastVisitTime()
    };
  }
};

// 게시글 URL 방문 기록 관리
const POST_HISTORY_KEY = 'when_bored_post_history';

export const postHistoryManager = {
  // 게시글 URL 저장 (iframe 내 탐색 추적)
  recordPostVisit: (url) => {
    try {
      const posts = postHistoryManager.getPostHistory();
      const urlHash = btoa(url).substring(0, 50); // URL을 해시로 저장
      
      posts[urlHash] = {
        url: url,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(POST_HISTORY_KEY, JSON.stringify(posts));
      return true;
    } catch (error) {
      console.error('게시글 기록 저장 실패:', error);
      return false;
    }
  },

  // 게시글 방문 내역 가져오기
  getPostHistory: () => {
    try {
      const posts = localStorage.getItem(POST_HISTORY_KEY);
      return posts ? JSON.parse(posts) : {};
    } catch (error) {
      return {};
    }
  },

  // 게시글 방문 여부 확인
  hasVisitedPost: (url) => {
    try {
      const urlHash = btoa(url).substring(0, 50);
      const posts = postHistoryManager.getPostHistory();
      return !!posts[urlHash];
    } catch (error) {
      return false;
    }
  },

  // 오래된 기록 정리 (30일 이상)
  cleanOldPosts: () => {
    try {
      const posts = postHistoryManager.getPostHistory();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const cleaned = {};
      Object.keys(posts).forEach(hash => {
        const postDate = new Date(posts[hash].timestamp);
        if (postDate > thirtyDaysAgo) {
          cleaned[hash] = posts[hash];
        }
      });
      
      localStorage.setItem(POST_HISTORY_KEY, JSON.stringify(cleaned));
      return true;
    } catch (error) {
      return false;
    }
  }
};
