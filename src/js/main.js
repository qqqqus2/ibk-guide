// ============================================
// LNB
// ============================================
const initLnbAccordion = () => {
  // Depth-1 accordion
  const $depth1Items = document.querySelectorAll(".lnb .depth-1 > li");

  $depth1Items.forEach(($item) => {
    const $link = $item.querySelector(":scope > a");
    const $depth2 = $item.querySelector(".depth-2");

    if (!$link || !$depth2) return;

    $link.addEventListener("click", (e) => {
      e.preventDefault();

      // Toggle current item
      const isOpen = $item.classList.contains("on");

      // Close all depth-1 items
      $depth1Items.forEach(($otherItem) => {
        $otherItem.classList.remove("on");
        const $otherDepth2 = $otherItem.querySelector(".depth-2");
        if ($otherDepth2) {
          $otherDepth2.style.display = "none";
        }
      });

      // Open clicked item if it was closed
      if (!isOpen) {
        $item.classList.add("on");
        $depth2.style.display = "block";
      }
    });
  });

  // Depth-2 accordion
  const $depth2Items = document.querySelectorAll(".lnb .depth-2 > li");

  $depth2Items.forEach(($item) => {
    const $link = $item.querySelector(":scope > a");
    const $depth3 = $item.querySelector(".depth-3");

    if (!$link || !$depth3) return;

    $link.addEventListener("click", (e) => {
      // Don't prevent default - allow navigation
      // But toggle the accordion
      const $parentDepth2 = $item.closest(".depth-2");
      const isOpen = $item.classList.contains("on");

      // Close all depth-2 items in the same parent
      $parentDepth2.querySelectorAll(":scope > li").forEach(($otherItem) => {
        $otherItem.classList.remove("on");
        const $otherDepth3 = $otherItem.querySelector(".depth-3");
        if ($otherDepth3) {
          $otherDepth3.style.display = "none";
        }
      });

      // Open clicked item
      $item.classList.add("on");
      $depth3.style.display = "block";
    });
  });
};

const initLnbTabs = () => {
  const $lnbTabButtons = document.querySelectorAll("[data-tab-target]");

  if (!$lnbTabButtons.length) return;

  const syncLnbActive = (activeTabId) => {
    $lnbTabButtons.forEach(($button) => {
      const isActive = $button.dataset.tabTarget === activeTabId;

      $button.parentElement.classList.toggle("active", isActive);
    });
  };

  $lnbTabButtons.forEach(($button) => {
    $button.addEventListener("click", () => {
      const targetId = $button.getAttribute("data-tab-target");
      const $targetId = document.getElementById(targetId);

      if (!$targetId) return;

      $targetId.click();

      $lnbTabButtons.forEach(($item) => {
        $item.parentElement.classList.remove("active");
      });

      console.log($button.parentElement);
      $button.parentElement.classList.add("active");
    });

    document.addEventListener("tab:change", (event) => {
      syncLnbActive(event.detail.tabId);
    });
  });
};

// ============================================
// COMPONENTS
// ============================================
const initTabs = () => {
  const $tabLists = document.querySelectorAll('[role="tablist"]');

  if (!$tabLists.length) return;

  $tabLists.forEach(($tabList) => {
    const $tabs = [...$tabList.querySelectorAll('[role="tab"]')];

    if (!$tabs.length) return;

    const activateTab = ($currentTab) => {
      $tabs.forEach(($tab) => {
        const panelId = $tab.getAttribute("aria-controls");
        const $panel = panelId ? document.getElementById(panelId) : null;
        const isActive = $tab === $currentTab;

        $tab.setAttribute("aria-selected", String(isActive));

        if (isActive) {
          $tab.removeAttribute("tabindex");
        } else {
          $tab.setAttribute("tabindex", "-1");
        }

        if (!$panel) return;

        $panel.hidden = !isActive;
        $panel.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      // LNB에 탭 값 넘겨주기
      document.dispatchEvent(
        new CustomEvent("tab:change", {
          detail: {
            tabId: $currentTab.id,
          },
        }),
      );
    };

    $tabs.forEach(($tab) => {
      $tab.addEventListener("click", () => {
        activateTab($tab);

        if ($tabList.classList.contains("page__tab-list")) {
          const $scrollContainer = document.querySelector(".content");
          $scrollContainer.scrollTo({
            top: 0,
          });
        }
      });
    });
  });
};

const initSubTabs = () => {
  const $subTabLists = document.querySelectorAll('[role="sub-tablist"]');

  if (!$subTabLists.length) return;

  $subTabLists.forEach(($subTabList) => {
    const $subTabs = [...$subTabList.querySelectorAll('[role="sub-tab"]')];

    if (!$subTabs.length) return;

    const activateSubTab = ($currentSubTab) => {
      $subTabs.forEach(($subTab) => {
        const panelId = $subTab.getAttribute("aria-controls");
        const $panel = panelId ? document.getElementById(panelId) : null;
        const isActive = $subTab === $currentSubTab;

        $subTab.setAttribute("aria-selected", String(isActive));

        if (isActive) {
          $subTab.removeAttribute("tabindex");
        } else {
          $subTab.setAttribute("tabindex", "-1");
        }

        if (!$panel) return;

        $panel.hidden = !isActive;
        $panel.setAttribute("tabindex", isActive ? "0" : "-1");
      });
    };

    $subTabs.forEach(($subTab) => {
      $subTab.addEventListener("click", () => {
        activateSubTab($subTab);

        if ($subTabList.classList.contains("page__tab-sublist")) {
          const $scrollContainer = document.querySelector(".content");
          $scrollContainer.scrollTo({
            top: 0,
          });
        }
      });
    });
  });
};

// ============================================
// INIT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initLnbAccordion();
  initLnbTabs();
  initTabs();
  initSubTabs();
});
