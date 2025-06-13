chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const url = window.location.href;

      const titleSelectors = [
        'bdi[data-testid="issue-title"]', // Issueのbdi要素
        "bdi.js-issue-title", // Pull Requestのbdi要素
      ];

      let title = "No Title";
      let titleEl = null;

      for (const selector of titleSelectors) {
        titleEl = document.querySelector(selector);
        if (titleEl) {
          title = titleEl.textContent?.trim();
          if (title && title !== "") {
            break;
          }
        }
      }

      if (!title || title === "No Title") {
        const pageTitle = document.title;
        const match = pageTitle.match(
          /^(.+?)\s*·\s*(Issue|Pull Request)\s*#\d+/
        );
        if (match) {
          title = match[1].trim();
        } else {
          title = pageTitle;
        }
      }

      const markdownLink = `[${title}](${url})`;

      navigator.clipboard
        .writeText(markdownLink)
        .then(() => {
          alert(`クリップボードにコピーしました:\n${markdownLink}`);
        })
        .catch((err) => {
          alert("コピーに失敗しました: " + err);
        });
    },
  });
});
