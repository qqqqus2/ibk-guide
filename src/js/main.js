// ============================================
// LNB
// ============================================
const initLnbTabs = () => {
    const $lnbTabButtons = document.querySelectorAll('[data-tab-target]');

    if (!$lnbTabButtons.length) return;

    const syncLnbActive = (activeTabId) => {
        $lnbTabButtons.forEach(($button)=> {
            const isActive = $button.dataset.tabTarget === activeTabId;

            $button.parentElement.classList.toggle('active', isActive);
        })
    }

    $lnbTabButtons.forEach(($button) => {
        $button.addEventListener('click', () => {
            const targetId = $button.getAttribute('data-tab-target');
            const $targetId = document.getElementById(targetId);

            if (!$targetId) return;

            $targetId.click();

            $lnbTabButtons.forEach(($item) => {
                $item.parentElement.classList.remove('active');
            });

            console.log($button.parentElement);
            $button.parentElement.classList.add('active');
        });

        document.addEventListener('tab:change', (event) => {
            syncLnbActive(event.detail.tabId);
        });
    });
}

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
                const panelId = $tab.getAttribute('aria-controls');
                const $panel = panelId ? document.getElementById(panelId) : null;
                const isActive = $tab === $currentTab;

                $tab.setAttribute('aria-selected', String(isActive));

                if (isActive) {
                    $tab.removeAttribute('tabindex');
                } else {
                    $tab.setAttribute('tabindex', '-1');
                }

                if (!$panel) return;

                $panel.hidden = !isActive;
                $panel.setAttribute('tabindex', isActive ? '0' : '-1');

            });

            // LNB에 탭 값 넘겨주기
            document.dispatchEvent(new CustomEvent('tab:change', {
                detail: {
                    tabId: $currentTab.id
                },
            }));
        };

        $tabs.forEach(($tab) => {
            $tab.addEventListener('click', () => {
                activateTab($tab);
                
                if ($tabList.classList.contains('page__tab-list')) {
                    const $scrollContainer = document.querySelector('.content');
                    $scrollContainer.scrollTo({
                        top: 0,
                    })
                }
            });
        });
    });
}



// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLnbTabs();
    initTabs();
});