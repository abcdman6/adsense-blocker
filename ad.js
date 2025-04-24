
(function () {
  const MAX_CLICKS = 3;
  const REDIRECT_URL = "https://naver.com";
  const ALERT_MSG = "애드센스 연속 클릭 3회 감지됨. 무효 트래픽 공격하지 마세요!";
  let isInterstitialAdActive = false;

  function isAdsenseAd(el) {
    if (!el) return false;
    try {
      if (el.tagName === 'IFRAME' && el.src.includes("googleads.g.doubleclick.net")) return true;
      if (el.tagName === 'INS' && el.getAttribute('data-ad-client')?.includes('pub-')) return true;
      if (el.classList?.contains('adsbygoogle')) return true;
    } catch (_) {}
    return false;
  }

  function isInterstitialAd(el) {
    return el && (
      (el.tagName === 'IFRAME' && el.src.includes("google")) ||
      (el.classList?.contains('adsbygoogle-interstitial'))
    );
  }

  function isBlurBackground(el) {
    return el?.classList?.contains('blur-background');
  }

  function addClickCount() {
    let count = parseInt(localStorage.getItem("adsenseClickCount") || "0", 10);
    if (count < MAX_CLICKS) {
      count++;
      localStorage.setItem("adsenseClickCount", String(count));
    }
    if (count >= MAX_CLICKS) {
      if (!confirm(ALERT_MSG)) {
        setTimeout(() => location.href = REDIRECT_URL, 100);
      }
      localStorage.setItem("adsenseClickCount", "0");
    }
  }

  window.addEventListener("blur", () => {
    isInterstitialAdActive = isInterstitialAd(document.activeElement);
  });

  window.addEventListener("focus", () => {
    setTimeout(() => {
      const el = document.activeElement;
      if (isInterstitialAdActive || isBlurBackground(el)) return;
      if (isAdsenseAd(el) && !location.href.includes("#google_vignette")) {
        addClickCount();
        el?.focus?.();
      }
    }, 50);
  });
})();
;
