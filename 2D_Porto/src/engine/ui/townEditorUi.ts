import type { TownEngine } from '../TownEngine';
import { sfx } from '../../game/sfx';
import {
  townConfig,
  type TileTypeKey,
  SPAWNABLE_TEMPLATES,
  CATALOG_THEME_BUNDLES,
  WORLD_BIOME_LABELS,
  getRecommendedBiomesForTemplate,
  getTemplateUnlockStatus,
  getCatalogUnlockSummary,
  type CatalogProgressSnapshot,
} from '../townConfig';
import { countSkyPlumes } from '../skyInteriorShared';
import { countRoyalCrests } from '../kingdomInteriorShared';
import { countMaritimeSeals } from '../harbourInteriorShared';
import { countAbyssalSeals } from '../darkInteriorShared';
import { PMD_POKEMON_CONFIGS } from '../pokemonPMDAnimator';
import { requestDigimonSprites } from '../digiSpriteLoader';
import { gameStore } from '../../game/store';

type ThumbDataUrlFn = typeof import('../townBackground').getTemplateThumbnailDataUrl;
let cachedThumbDataUrlFn: ThumbDataUrlFn | null = null;
let thumbFnPromise: Promise<ThumbDataUrlFn | null> | null = null;
function loadTemplateThumbFn(): Promise<ThumbDataUrlFn | null> {
  if (cachedThumbDataUrlFn) return Promise.resolve(cachedThumbDataUrlFn);
  thumbFnPromise ??= import('../townBackground')
    .then((m) => {
      cachedThumbDataUrlFn = m.getTemplateThumbnailDataUrl;
      return cachedThumbDataUrlFn;
    })
    .catch(() => {
      thumbFnPromise = null;
      return null;
    });
  return thumbFnPromise;
}

export interface TownEditorUiDeps {
  engine: TownEngine;
  showToast: (msg: string) => void;
  isVisitorRadarOpen: () => boolean;
}

export function initTownEditorUi(deps: TownEditorUiDeps): void {
  const { engine, showToast, isVisitorRadarOpen } = deps;
  const btnToggleDevMenu = document.getElementById('btn-toggle-dev-menu');
  const burgerItemEditor = document.getElementById('burger-item-editor');
  const minimapWidget = document.getElementById('town-editor-minimap');
  const minimapCanvas = document.getElementById('town-minimap-canvas') as HTMLCanvasElement | null;

    const editorToolbar = document.getElementById('town-editor-toolbar');
    const editorStatus = document.getElementById('town-editor-status');
    const toolBtnMove = document.getElementById('tool-btn-move');
    const toolBtnBrush = document.getElementById('tool-btn-brush');
    const toolBtnErase = document.getElementById('tool-btn-erase');
    const toolBtnDeleteObject = document.getElementById('tool-btn-delete-object');
    const toolBtnLine = document.getElementById('tool-btn-line');
    const toolBtnRect = document.getElementById('tool-btn-rect');
    const toolBtnBucket = document.getElementById('tool-btn-bucket');
    const toolBtnEyedropper = document.getElementById('tool-btn-eyedropper');
    const toolBtnCollision = document.getElementById('tool-btn-collision');
    const toolBtnPlaytest = document.getElementById('tool-btn-playtest');
    const toolBtnGrid = document.getElementById('tool-btn-grid');
    const btnBrush1 = document.getElementById('btn-brush-1');
    const btnBrush2 = document.getElementById('btn-brush-2');
    const btnBrush3 = document.getElementById('btn-brush-3');
    const btnTransformRotLeft = document.getElementById('btn-transform-rot-left');
    const btnTransformRotRight = document.getElementById('btn-transform-rot-right');
    const btnTransformApply = document.getElementById('btn-transform-apply');
    const btnTransformCancel = document.getElementById('btn-transform-cancel');
    const playtestBar = document.getElementById('town-playtest-bar');
    const btnExitPlaytest = document.getElementById('btn-exit-playtest');
    const tileBtns = document.querySelectorAll<HTMLButtonElement>('.town-tile-btn');
    const btnEditorSave = document.getElementById('btn-editor-save');
    const btnEditorExport = document.getElementById('btn-editor-export');
    const btnEditorReset = document.getElementById('btn-editor-reset');
    const btnEditorClose = document.getElementById('btn-editor-close');
    const exportModal = document.getElementById('town-editor-export-modal') as HTMLDialogElement | null;
    const btnCloseExportModal = document.getElementById('btn-close-export-modal');
    const btnCopyCode = document.getElementById('btn-copy-code');
    const codeOutput = document.getElementById('town-editor-code-output');


      const editor = engine.getEditor();

      if (sessionStorage.getItem('town:open-editor') === 'true' && engine.isWorldScene()) {
        sessionStorage.removeItem('town:open-editor');
        setTimeout(() => {
          if (!editor.isEnabled()) {
            editor.toggleEnabled();
          }
        }, 250);
      }

      const btnEditorMinimize = document.getElementById('btn-editor-minimize');
      const iconEditorMinimize = document.getElementById('icon-editor-minimize');
      const studioContextRow = document.getElementById('town-studio-context-row');
      const btnEditorValidate = document.getElementById('btn-editor-validate') as HTMLButtonElement | null;
      const btnEditorUndo = document.getElementById('btn-editor-undo') as HTMLButtonElement | null;
      const btnEditorRedo = document.getElementById('btn-editor-redo') as HTMLButtonElement | null;
      const toolBtnSpawn = document.getElementById('tool-btn-spawn');
      const spawnModal = document.getElementById('town-editor-spawn-modal') as HTMLDialogElement | null;
      const btnCloseSpawnModal = document.getElementById('btn-close-spawn-modal');
      const spawnCatalog = document.getElementById('town-spawn-catalog');
      let isMinimized = false;

      // Mode Tabs & Contextual Panels
      type EditorModeTab = 'object' | 'paint' | 'check';
      let currentModeTab: EditorModeTab = 'object';
      const tabModeObject = document.getElementById('tab-mode-object');
      const tabModePaint = document.getElementById('tab-mode-paint');
      const tabModeCheck = document.getElementById('tab-mode-check');
      const ctxPanelObject = document.getElementById('ctx-panel-object');
      const ctxPanelPaint = document.getElementById('ctx-panel-paint');
      const ctxPanelCheck = document.getElementById('ctx-panel-check');

      const switchEditorModeTab = (mode: EditorModeTab, syncTool = true) => {
        currentModeTab = mode;
        tabModeObject?.classList.toggle('is-active', mode === 'object');
        tabModePaint?.classList.toggle('is-active', mode === 'paint');
        tabModeCheck?.classList.toggle('is-active', mode === 'check');
        tabModeObject?.setAttribute('aria-selected', String(mode === 'object'));
        tabModePaint?.setAttribute('aria-selected', String(mode === 'paint'));
        tabModeCheck?.setAttribute('aria-selected', String(mode === 'check'));
        ctxPanelObject?.classList.toggle('hidden', mode !== 'object');
        ctxPanelPaint?.classList.toggle('hidden', mode !== 'paint');
        ctxPanelCheck?.classList.toggle('hidden', mode !== 'check');
        if (syncTool) {
          if (mode === 'object') editor.setTool('move');
          else if (mode === 'paint') editor.setTool('brush');
          else if (mode === 'check') editor.setTool('collision');
        }
      };

      tabModeObject?.addEventListener('click', () => {
        switchEditorModeTab('object', true);
        sfx.select();
      });
      tabModePaint?.addEventListener('click', () => {
        switchEditorModeTab('paint', true);
        sfx.select();
      });
      tabModeCheck?.addEventListener('click', () => {
        switchEditorModeTab('check', true);
        sfx.select();
      });

      // Tile Carousel Horizontal Scroll (Zero OS Scrollbar)
      const tileCarousel = document.getElementById('town-tile-carousel');
      document.getElementById('btn-tile-scroll-left')?.addEventListener('click', () => {
        tileCarousel?.scrollBy({ left: -200, behavior: 'smooth' });
        sfx.select();
      });
      document.getElementById('btn-tile-scroll-right')?.addEventListener('click', () => {
        tileCarousel?.scrollBy({ left: 200, behavior: 'smooth' });
        sfx.select();
      });
      tileCarousel?.addEventListener(
        'wheel',
        (e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            tileCarousel.scrollLeft += e.deltaY;
          }
        },
        { passive: false }
      );

      // Diagnostic Quick Brushes
      document.getElementById('btn-diag-solid-brush')?.addEventListener('click', () => {
        editor.setBrushTile('solid_override');
        if (!editor.isCollisionOverlayVisible()) editor.toggleCollisionOverlay();
        sfx.select();
        showToast('🛑 Mode Kuas Solid Override aktif.');
      });
      document.getElementById('btn-diag-walk-brush')?.addEventListener('click', () => {
        editor.setBrushTile('walkable_override');
        if (!editor.isCollisionOverlayVisible()) editor.toggleCollisionOverlay();
        sfx.select();
        showToast('🟢 Mode Kuas Walkable Override aktif.');
      });

      // Quick Stamp Strip (8 Recent / Favorite Templates)
      const QUICK_STAMP_STORAGE_KEY = 'town_editor_quick_stamps_v1';
      const DEFAULT_QUICK_STAMPS = [
        'tree_green',
        'tree_sakura',
        'lamp_classic',
        'bench_wood',
        'pikachu',
        'bulbasaur',
        'server_rack',
        'sign_post',
      ];
      let quickStampIds: string[] = [...DEFAULT_QUICK_STAMPS];
      try {
        const rawStamps = localStorage.getItem(QUICK_STAMP_STORAGE_KEY);
        if (rawStamps) {
          const parsed = JSON.parse(rawStamps);
          if (Array.isArray(parsed) && parsed.length > 0) {
            quickStampIds = parsed.slice(0, 8);
          }
        }
      } catch {}

      const pushQuickStamp = (tplId: string) => {
        quickStampIds = [tplId, ...quickStampIds.filter((id) => id !== tplId)].slice(0, 8);
        try {
          localStorage.setItem(QUICK_STAMP_STORAGE_KEY, JSON.stringify(quickStampIds));
        } catch {}
        renderQuickStampStrip();
      };

      const quickStampStrip = document.getElementById('town-quick-stamp-strip');
      const renderQuickStampStrip = () => {
        if (!quickStampStrip) return;
        quickStampStrip.innerHTML = '';
        const activeStamp = editor.getTool() === 'stamp' ? editor.getStampTemplate() : null;
        const validIds = quickStampIds
          .map((id) => SPAWNABLE_TEMPLATES.find((t) => t.id === id))
          .filter((t): t is (typeof SPAWNABLE_TEMPLATES)[number] => Boolean(t));
        const fallbackList =
          validIds.length >= 4
            ? validIds
            : SPAWNABLE_TEMPLATES.slice(0, 8);

        for (const tpl of fallbackList) {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = `town-quick-stamp-chip${activeStamp === tpl.id ? ' is-active' : ''}`;
          chip.title = `Cap Cepat: ${tpl.name} (${tpl.w}×${tpl.h}) — Klik di peta untuk menaruh`;
          const shortName = tpl.name.split(' ')[0];
          chip.innerHTML = `<span>${tpl.icon}</span><span class="truncate max-w-[68px]">${shortName}</span>`;
          chip.addEventListener('click', () => {
            if (activeStamp === tpl.id) {
              editor.setStampTemplate(null);
              editor.setTool('move');
            } else {
              editor.setStampTemplate(tpl.id);
              showToast(`🎯 Cap Cepat aktif: ${tpl.name}! Klik di peta untuk menaruh.`);
            }
            sfx.select();
          });
          quickStampStrip.appendChild(chip);
        }
      };

      // ==========================================
      // SEARCHABLE SCENE OUTLINER POPOVER
      // ==========================================
      const outlinerPopover = document.getElementById('town-outliner-popover');
      const btnOpenOutliner = document.getElementById('btn-open-outliner');
      const outlinerTriggerLabel = document.getElementById('outliner-trigger-label');
      const outlinerCountBadge = document.getElementById('outliner-count-badge');
      const outlinerSearch = document.getElementById('town-outliner-search') as HTMLInputElement | null;
      const outlinerList = document.getElementById('town-outliner-list');
      const outlinerTabs = document.querySelectorAll<HTMLButtonElement>('.town-outliner-tab');
      let outlinerCat = 'all';
      let isOutlinerOpen = false;

      const getEntityEmoji = (b: { id: string; kind?: string; subType?: string }) => {
        if (b.kind === 'building') return '🏢';
        if (b.kind === 'tree') {
          if (b.subType === 'tree_sakura') return '🌸';
          if (b.subType === 'tree_pine') return '🌲';
          if (b.subType === 'tree_autumn') return '🍁';
          if (b.subType === 'tree_berry') return '🍒';
          if (b.subType === 'tree_palm') return '🌴';
          if (b.subType === 'tree_willow') return '🌿';
          if (b.subType === 'tree_bamboo') return '🎋';
          if (b.subType === 'tree_dead') return '🥀';
          if (b.subType === 'tree_golden') return '✨';
          return '🌳';
        }
        if (b.kind === 'bush') return '🌿';
        if (b.kind === 'flowerbed') {
          if (b.subType === 'sunflower_bed') return '🌻';
          if (b.subType === 'lavender_bed') return '💜';
          if (b.subType === 'rose_bed') return '🌹';
          return '🌺';
        }
        if (b.kind === 'lamp') return '💡';
        if (b.kind === 'bench') return '🪑';
        if (b.kind === 'npc') return '⚡';
        if (b.kind === 'digimon') return '👾';
        if (b.kind === 'sign') return '🪧';
        if (b.subType === 'rock_boulder' || b.subType === 'mossy_rock') return '🪨';
        if (b.subType === 'lily_pond') return '🪷';
        if (b.subType === 'natural_spring') return '♨️';
        if (b.subType === 'crystal_cluster') return '💎';
        if (b.subType === 'mushroom_patch') return '🍄';
        if (b.subType === 'tree_stump' || b.subType === 'fallen_log') return '🪵';
        if (b.subType === 'reeds_clump') return '🌾';
        if (b.subType === 'cactus_saguaro') return '🌵';
        if (b.subType === 'bush_flower') return '🌺';
        if (b.subType === 'berry_pot') return '🫐';
        if (b.id === 'fountain') return '⛲';
        if (b.id === 'campfire' || b.subType === 'campfire') return '🔥';
        if (b.id === 'vending' || b.subType === 'vending') return '🥤';
        if (b.id === 'statue' || b.subType === 'statue') return '🗿';
        return '📦';
      };

      const renderOutlinerList = () => {
        if (!outlinerList) return;
        const buildings = townConfig.getBuildings();
        const q = (outlinerSearch?.value || '').trim().toLowerCase();
        const selectedIds = new Set(editor.getSelectedBuildings().map((b) => b.id));

        const filtered = buildings.filter((b) => {
          if (outlinerCat === 'building' && b.kind !== 'building') return false;
          if (outlinerCat === 'npc' && b.kind !== 'npc' && b.kind !== 'digimon') return false;
          if (outlinerCat === 'nature' && (b.kind === 'building' || b.kind === 'npc' || b.kind === 'digimon')) return false;
          if (q && !b.name.toLowerCase().includes(q) && !b.id.toLowerCase().includes(q)) return false;
          return true;
        });

        outlinerList.innerHTML = '';
        if (filtered.length === 0) {
          outlinerList.innerHTML = `<div class="p-4 text-center text-[10px] font-mono text-slate-400">Tidak ada entitas cocok dengan "${q}".</div>`;
          return;
        }
        for (const b of filtered) {
          const item = document.createElement('button');
          item.type = 'button';
          item.className = `town-outliner-item${selectedIds.has(b.id) ? ' is-selected' : ''}`;
          item.innerHTML = `
            <span class="shrink-0">${getEntityEmoji(b)}</span>
            <span class="flex-1 text-left truncate font-medium">${b.name}</span>
            ${b.locked ? '<span class="text-[9px]" title="Terkunci">🔒</span>' : ''}
            <span class="text-[9px] font-mono text-slate-400 shrink-0">(${b.x},${b.y})</span>
          `;
          item.addEventListener('click', () => {
            editor.focusBuilding(b.id);
            isOutlinerOpen = false;
            if (outlinerPopover) {
              outlinerPopover.classList.add('hidden');
              outlinerPopover.style.display = 'none';
            }
            sfx.select();
          });
          outlinerList.appendChild(item);
        }
      };

      const toggleOutliner = (force?: boolean) => {
        isOutlinerOpen = force !== undefined ? force : !isOutlinerOpen;
        if (outlinerPopover) {
          if (isOutlinerOpen) {
            renderOutlinerList();
            outlinerPopover.classList.remove('hidden');
            outlinerPopover.style.display = 'flex';
            setTimeout(() => outlinerSearch?.focus(), 40);
          } else {
            outlinerPopover.classList.add('hidden');
            outlinerPopover.style.display = 'none';
          }
        }
      };

      btnOpenOutliner?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleOutliner();
        sfx.select();
      });
      document.getElementById('btn-close-outliner')?.addEventListener('click', () => toggleOutliner(false));
      outlinerSearch?.addEventListener('input', renderOutlinerList);
      outlinerTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          outlinerCat = tab.getAttribute('data-ocat') || 'all';
          outlinerTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
          renderOutlinerList();
          sfx.select();
        });
      });

      const refreshObjectPicker = () => {
        const buildings = townConfig.getBuildings();
        const selected = editor.getSelectedBuilding();
        const selectedBuildings = editor.getSelectedBuildings();
        if (outlinerCountBadge) {
          outlinerCountBadge.textContent = String(buildings.length);
        }
        if (outlinerTriggerLabel) {
          if (selectedBuildings.length > 1) {
            outlinerTriggerLabel.textContent = `${selectedBuildings.length} Objek Terpilih`;
          } else if (selected) {
            outlinerTriggerLabel.textContent = selected.name;
          } else {
            outlinerTriggerLabel.textContent = 'Cari Objek';
          }
        }
        if (isOutlinerOpen) {
          renderOutlinerList();
        }
      };

      // Overflow Utilities Popover
      const btnEditorMore = document.getElementById('btn-editor-more');
      const morePopover = document.getElementById('town-editor-more-popover');
      let isMoreOpen = false;
      const toggleMorePopover = (force?: boolean) => {
        isMoreOpen = force !== undefined ? force : !isMoreOpen;
        if (morePopover) {
          if (isMoreOpen) {
            morePopover.classList.remove('hidden');
            morePopover.style.display = 'flex';
          } else {
            morePopover.classList.add('hidden');
            morePopover.style.display = 'none';
          }
        }
        btnEditorMore?.setAttribute('aria-expanded', String(isMoreOpen));
      };
      btnEditorMore?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMorePopover();
        sfx.select();
      });
      document.addEventListener('click', (e) => {
        const tgt = e.target as Node;
        if (isMoreOpen && !morePopover?.contains(tgt) && !btnEditorMore?.contains(tgt)) {
          toggleMorePopover(false);
        }
        if (isOutlinerOpen && !outlinerPopover?.contains(tgt) && !btnOpenOutliner?.contains(tgt)) {
          toggleOutliner(false);
        }
      });

      // Shortcuts Cheat Sheet & Zen Controls
      const shortcutsModal = document.getElementById('town-editor-shortcuts-modal') as HTMLDialogElement | null;
      const openShortcutsModal = () => {
        toggleMorePopover(false);
        shortcutsModal?.showModal();
        sfx.select();
      };
      document.getElementById('btn-telemetry-shortcuts')?.addEventListener('click', openShortcutsModal);
      document.getElementById('btn-more-shortcuts')?.addEventListener('click', openShortcutsModal);
      document.getElementById('btn-close-shortcuts-modal')?.addEventListener('click', () => shortcutsModal?.close());

      document.getElementById('btn-telemetry-zen')?.addEventListener('click', () => {
        editor.toggleZenMode();
        sfx.select();
      });
      document.getElementById('btn-more-zen')?.addEventListener('click', () => {
        toggleMorePopover(false);
        editor.toggleZenMode();
        sfx.select();
      });
      document.getElementById('btn-zen-exit')?.addEventListener('click', () => {
        editor.toggleZenMode();
        sfx.select();
      });
      document.getElementById('btn-zen-undo')?.addEventListener('click', () => {
        if (townConfig.undo()) {
          sfx.select();
          showToast('↩ Perubahan dibatalkan (Undo)');
          engine?.invalidateBackgroundCanvas();
          engine?.wake();
        }
      });
      document.getElementById('btn-zen-save')?.addEventListener('click', async () => {
        await editor.save();
        sfx.heal();
      });

      // ==========================================
      // UPGRADED SPAWNER MODAL CATALOG & STAMP MODE
      // ==========================================
      const spawnSearch = document.getElementById('town-spawn-search') as HTMLInputElement | null;
      const spawnSearchClear = document.getElementById('town-spawn-search-clear');
      const spawnTabButtons = document.querySelectorAll<HTMLButtonElement>('.town-spawn-tab');

      let activeSpawnCategory = 'all';
      let spawnSearchQuery = '';
      let activeSizeFilter: 'all' | '1x1' | '2x1' | '2x2' | 'large' = 'all';
      let activeColFilter: 'all' | 'canopy' | 'solid' = 'all';
      let activeSortMode: 'biome' | 'name' | 'size' | 'placed' = 'biome';
      let onlyRecommendedBiome = false;
      let spawnFlipMode = false;
      let lastInspectedTemplate: (typeof SPAWNABLE_TEMPLATES)[number] | null = null;
      let kbdFocusedCardIdx = -1;
      const placedJumpIndex = new Map<string, number>();
      const scatterPool = new Set<string>();
      let spawnThumbObserver: IntersectionObserver | null = null;
      const FAVORITES_STORAGE_KEY = 'zulfan_town_catalog_favorites_v1';
      const SANDBOX_UNLOCK_KEY = 'zulfan_town_catalog_sandbox_v1';
      let sandboxUnlockAll = false;
      try {
        sandboxUnlockAll = localStorage.getItem(SANDBOX_UNLOCK_KEY) === 'true';
      } catch {}
      const pmdThumbCache = new Map<string, string | null>();
      const templatesById = new Map(SPAWNABLE_TEMPLATES.map((t) => [t.id, t]));

      const readCatalogProgress = (): CatalogProgressSnapshot => ({
        badges: gameStore.getBadges().length,
        sky_plumes: countSkyPlumes(),
        royal_crests: countRoyalCrests(),
        maritime_seals: countMaritimeSeals(),
        abyssal_seals: countAbyssalSeals(),
      });

      const syncSandboxChip = (progress: CatalogProgressSnapshot) => {
        const btnSandbox = document.getElementById('btn-spawn-sandbox-toggle');
        const progEl = document.getElementById('spawn-unlock-progress');
        const labelEl = document.getElementById('spawn-sandbox-label');
        const summary = getCatalogUnlockSummary(progress);
        if (progEl) progEl.textContent = `${summary.unlocked}/${summary.total}`;
        if (labelEl) labelEl.textContent = sandboxUnlockAll ? 'Mode Kreatif ON' : 'Progres Aktif';
        btnSandbox?.classList.toggle('is-active', sandboxUnlockAll);
      };

      const loadCatalogFavorites = (): Set<string> => {
        try {
          const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
          if (!raw) return new Set();
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? new Set(parsed.filter((v): v is string => typeof v === 'string')) : new Set();
        } catch {
          return new Set();
        }
      };

      const favoriteIds = loadCatalogFavorites();
      const saveCatalogFavorites = () => {
        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteIds)));
        } catch {}
      };

      const toggleCatalogFavorite = (tplId: string) => {
        const nextFav = !favoriteIds.has(tplId);
        if (nextFav) favoriteIds.add(tplId);
        else favoriteIds.delete(tplId);
        saveCatalogFavorites();
        return nextFav;
      };

      const applyThumbImg = (iconEl: HTMLElement, dataUrl: string | null, label: string) => {
        if (!dataUrl) return;
        iconEl.innerHTML = `<img src="${dataUrl}" alt="${label}" style="width:32px;height:32px;image-rendering:pixelated;object-fit:contain;" />`;
      };

      const hydrateSpawnThumb = (iconEl: HTMLElement | null, digiSub: string, label: string) => {
        if (!iconEl || iconEl.dataset.thumbHydrated === 'true') return;
        iconEl.dataset.thumbHydrated = 'true';
        const cachedDigi = requestDigimonSprites(digiSub, () => {
          const loaded = requestDigimonSprites(digiSub);
          if (loaded?.iconDataUrl) applyThumbImg(iconEl, loaded.iconDataUrl, label);
        });
        if (cachedDigi?.iconDataUrl) {
          applyThumbImg(iconEl, cachedDigi.iconDataUrl, label);
        }
      };

      const hydratePmdThumb = (iconEl: HTMLElement, pmdKey: string, label: string) => {
        if (iconEl.dataset.thumbHydrated === 'true') return;
        iconEl.dataset.thumbHydrated = 'true';
        if (pmdThumbCache.has(pmdKey)) {
          applyThumbImg(iconEl, pmdThumbCache.get(pmdKey) ?? null, label);
          return;
        }
        const cfg = PMD_POKEMON_CONFIGS[pmdKey];
        if (!cfg) {
          pmdThumbCache.set(pmdKey, null);
          return;
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.onload = () => {
          const fw = cfg.idle.frameWidth;
          const fh = cfg.idle.frameHeight;
          const scratch = document.createElement('canvas');
          scratch.width = fw;
          scratch.height = fh;
          const sctx = scratch.getContext('2d', { willReadFrequently: true });
          if (!sctx) {
            pmdThumbCache.set(pmdKey, null);
            return;
          }
          sctx.imageSmoothingEnabled = false;
          sctx.drawImage(img, 0, 0, fw, fh, 0, 0, fw, fh);
          const data = sctx.getImageData(0, 0, fw, fh).data;
          let minX = fw, minY = fh, maxX = -1, maxY = -1;
          for (let y = 0; y < fh; y++) {
            for (let x = 0; x < fw; x++) {
              if (data[(y * fw + x) * 4 + 3] > 8) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          if (maxX < minX || maxY < minY) {
            pmdThumbCache.set(pmdKey, null);
            return;
          }
          const bw = maxX - minX + 1;
          const bh = maxY - minY + 1;
          const out = document.createElement('canvas');
          out.width = 36;
          out.height = 36;
          const octx = out.getContext('2d');
          if (!octx) {
            pmdThumbCache.set(pmdKey, null);
            return;
          }
          octx.imageSmoothingEnabled = false;
          const scale = Math.min(32 / bw, 32 / bh);
          const dw = Math.max(1, Math.round(bw * scale));
          const dh = Math.max(1, Math.round(bh * scale));
          octx.drawImage(scratch, minX, minY, bw, bh, Math.floor((36 - dw) / 2), Math.floor((36 - dh) / 2), dw, dh);
          try {
            const url = out.toDataURL();
            pmdThumbCache.set(pmdKey, url);
            applyThumbImg(iconEl, url, label);
          } catch {
            pmdThumbCache.set(pmdKey, null);
          }
        };
        img.onerror = () => pmdThumbCache.set(pmdKey, null);
        img.src = cfg.idle.src;
      };

      const hydrateTemplateThumb = (
        iconEl: HTMLElement | null,
        item: (typeof SPAWNABLE_TEMPLATES)[0],
        thumbSize = 36
      ) => {
        if (!iconEl || iconEl.dataset.thumbHydrated === 'true') return;
        if (item.kind === 'digimon' && item.subType) {
          hydrateSpawnThumb(iconEl, item.subType, item.name);
          return;
        }
        if (item.kind === 'npc' && item.subType) {
          const cleanKey = (
            item.subType === 'blastoise'
              ? 'tyranitar'
              : item.subType.replace('_gmax', '').replace('_dusk_mane', '')
          ).toLowerCase();
          if (PMD_POKEMON_CONFIGS[cleanKey]) {
            hydratePmdThumb(iconEl, cleanKey, item.name);
            return;
          }
        }
        iconEl.dataset.thumbHydrated = 'true';
        loadTemplateThumbFn().then((fn) => {
          const url = fn ? fn(item, thumbSize) : null;
          if (url) applyThumbImg(iconEl, url, item.name);
        });
      };

      const updateSpawnInspector = (tpl: (typeof SPAWNABLE_TEMPLATES)[number] | null) => {
        lastInspectedTemplate = tpl;
        const inspThumb = document.getElementById('spawn-insp-thumb');
        const inspName = document.getElementById('spawn-insp-name');
        const inspSize = document.getElementById('spawn-insp-size');
        const inspCol = document.getElementById('spawn-insp-col');
        const inspBiomes = document.getElementById('spawn-insp-biomes');
        const inspDialogue = document.getElementById('spawn-insp-dialogue');
        const inspUnlock = document.getElementById('spawn-insp-unlock');
        if (!inspThumb || !inspName || !inspSize || !inspCol || !inspBiomes || !inspDialogue) return;

        inspThumb.classList.toggle('is-flipped', spawnFlipMode);
        if (!tpl) {
          inspThumb.innerHTML = '✨';
          inspName.textContent = 'Arahkan kursor atau tekan ↑↓ pada kartu objek';
          inspSize.textContent = '—';
          inspCol.textContent = '—';
          inspBiomes.innerHTML = '';
          inspDialogue.textContent =
            'Pratinjau ukuran petak, aturan kolisi, kecocokan bioma, dan dialog interaktif akan muncul di sini.';
          if (inspUnlock) {
            inspUnlock.classList.add('hidden');
            inspUnlock.classList.remove('is-unlocked');
            inspUnlock.textContent = '';
          }
          return;
        }

        inspThumb.innerHTML = tpl.icon;
        delete inspThumb.dataset.thumbHydrated;
        hydrateTemplateThumb(inspThumb, tpl, 52);

        inspName.textContent = tpl.name;
        inspSize.textContent = `${tpl.w}×${tpl.h} petak`;
        inspCol.textContent =
          tpl.kind === 'tree'
            ? '🌳 Kanopi tembus · batang padat'
            : tpl.kind === 'digimon' || tpl.kind === 'npc'
              ? '🧑 Karakter · interaktif'
              : '🧱 Seluruh petak padat';

        const activeWorld = townConfig.getActiveWorld();
        const biomes = getRecommendedBiomesForTemplate(tpl);
        inspBiomes.innerHTML = '';
        for (const b of biomes) {
          const tag = document.createElement('span');
          tag.className = `town-spawn-inspector__biome-tag ${b === activeWorld ? 'is-current' : ''}`;
          tag.textContent = WORLD_BIOME_LABELS[b] || b;
          inspBiomes.appendChild(tag);
        }
        inspDialogue.textContent = tpl.defaultDialogue ? `💬 "${tpl.defaultDialogue}"` : tpl.desc;

        if (inspUnlock) {
          const status = getTemplateUnlockStatus(tpl, readCatalogProgress(), sandboxUnlockAll);
          if (status.rule) {
            inspUnlock.classList.remove('hidden');
            inspUnlock.classList.toggle('is-unlocked', status.unlocked);
            if (!status.unlocked) {
              inspUnlock.textContent = `🔒 Terkunci (${status.current}/${status.required} · ${status.rule.label}) — ${status.rule.hint}`;
            } else if (sandboxUnlockAll && status.current < status.required) {
              inspUnlock.textContent = `🔓 Terbuka via Mode Kreatif (Progres asli: ${status.current}/${status.required} · ${status.rule.label})`;
            } else {
              inspUnlock.textContent = `🏆 Terbuka (${status.current}/${status.required} · ${status.rule.label})`;
            }
          } else {
            inspUnlock.classList.add('hidden');
            inspUnlock.classList.remove('is-unlocked');
            inspUnlock.textContent = '';
          }
        }
      };

      const renderScatterTray = () => {
        const tray = document.getElementById('town-spawn-scatter-tray');
        const itemsWrap = document.getElementById('scatter-tray-items');
        if (!tray || !itemsWrap) return;
        if (scatterPool.size === 0) {
          tray.classList.add('hidden');
          itemsWrap.innerHTML = '';
          return;
        }
        tray.classList.remove('hidden');
        itemsWrap.innerHTML = '';
        for (const tid of scatterPool) {
          const tpl = templatesById.get(tid);
          if (!tpl) continue;
          const pill = document.createElement('span');
          pill.className = 'town-spawn-scatter-pill';
          pill.textContent = `${tpl.icon} ${tpl.name}`;
          itemsWrap.appendChild(pill);
        }
      };

      const renderSpawnCatalog = () => {
        if (!spawnCatalog) return;
        if (spawnThumbObserver) {
          spawnThumbObserver.disconnect();
          spawnThumbObserver = null;
        }
        spawnCatalog.innerHTML = '';
        const spawnRoot = spawnCatalog.closest('.town-spawn-modal__body') || spawnCatalog;
        if (typeof IntersectionObserver !== 'undefined') {
          spawnThumbObserver = new IntersectionObserver(
            (entries) => {
              for (const ent of entries) {
                if (!ent.isIntersecting) continue;
                const el = ent.target as HTMLElement;
                const tplId = el.getAttribute('data-tpl-thumb');
                const tplItem = tplId ? templatesById.get(tplId) : undefined;
                if (tplItem) hydrateTemplateThumb(el, tplItem);
                spawnThumbObserver?.unobserve(el);
              }
            },
            { root: spawnRoot, rootMargin: '80px' }
          );
        }

        const q = spawnSearchQuery.trim().toLowerCase();
        const activeWorld = townConfig.getActiveWorld();
        const catalogProgress = readCatalogProgress();
        syncSandboxChip(catalogProgress);
        const biomeWorldNameEl = document.getElementById('spawn-biome-world-name');
        const biomeCountEl = document.getElementById('spawn-biome-count');
        if (biomeWorldNameEl) {
          biomeWorldNameEl.textContent = WORLD_BIOME_LABELS[activeWorld] || activeWorld;
        }

        const isRecommendedHere = (t: (typeof SPAWNABLE_TEMPLATES)[0]) =>
          getRecommendedBiomesForTemplate(t).includes(activeWorld);

        const matchesQuery = (t: (typeof SPAWNABLE_TEMPLATES)[0]) => {
          if (!q) return true;
          return (
            t.name.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            (t.subType && t.subType.toLowerCase().includes(q)) ||
            t.category.toLowerCase().includes(q) ||
            (t.defaultDialogue && t.defaultDialogue.toLowerCase().includes(q))
          );
        };

        const matchesSizeAndCol = (t: (typeof SPAWNABLE_TEMPLATES)[0]) => {
          if (activeSizeFilter === '1x1' && !(t.w === 1 && t.h === 1)) return false;
          if (activeSizeFilter === '2x1' && !((t.w === 2 && t.h === 1) || (t.w === 1 && t.h === 2))) return false;
          if (activeSizeFilter === '2x2' && !(t.w === 2 && t.h === 2)) return false;
          if (activeSizeFilter === 'large' && !(t.w >= 3 || t.h >= 3)) return false;
          if (activeColFilter === 'canopy' && t.kind !== 'tree') return false;
          if (activeColFilter === 'solid' && t.kind === 'tree') return false;
          return true;
        };

        const matchesFilters = (t: (typeof SPAWNABLE_TEMPLATES)[0]) => {
          if (!matchesQuery(t) || !matchesSizeAndCol(t)) return false;
          if (onlyRecommendedBiome && !isRecommendedHere(t)) return false;
          return true;
        };

        const baseMatching = SPAWNABLE_TEMPLATES.filter((t) => matchesQuery(t) && matchesSizeAndCol(t));
        if (biomeCountEl) {
          biomeCountEl.textContent = String(baseMatching.filter(isRecommendedHere).length);
        }

        // Map placed instances in current world per template
        const visiblePlaced = townConfig.getBuildings().filter((b) => !b.hidden);
        const getPlacedForTemplate = (item: (typeof SPAWNABLE_TEMPLATES)[0]) =>
          visiblePlaced.filter((b) => {
            if (item.kind === 'digimon') return b.kind === 'digimon' && b.subType === item.subType;
            if (item.subType === 'flowerbed') {
              return b.kind === 'flowerbed' && (b.subType === 'flowerbed' || !b.subType) && b.w === item.w && b.h === item.h;
            }
            if (item.subType) return b.subType === item.subType && b.kind === item.kind;
            return b.id === item.id;
          });

        // Update counts
        const allMatching = SPAWNABLE_TEMPLATES.filter(matchesFilters);
        const countAll = document.getElementById('cat-count-all');
        const countFav = document.getElementById('cat-count-fav');
        const countBundles = document.getElementById('cat-count-bundles');
        const countAlam = document.getElementById('cat-count-alam');
        const countPerabot = document.getElementById('cat-count-perabot');
        const countPokemon = document.getElementById('cat-count-pokemon');
        const countDigimon = document.getElementById('cat-count-digimon');
        const countTech = document.getElementById('cat-count-tech');
        const countFasilitas = document.getElementById('cat-count-fasilitas');

        const matchingBundles = CATALOG_THEME_BUNDLES.filter((b) => {
          if (q) {
            const hit =
              b.name.toLowerCase().includes(q) ||
              b.desc.toLowerCase().includes(q) ||
              b.items.some((it) => templatesById.get(it.templateId)?.name.toLowerCase().includes(q));
            if (!hit) return false;
          }
          if (onlyRecommendedBiome && !b.biomes.includes(activeWorld)) return false;
          return true;
        });

        if (countAll) countAll.textContent = String(allMatching.length);
        if (countFav) countFav.textContent = String(allMatching.filter((t) => favoriteIds.has(t.id)).length);
        if (countBundles) countBundles.textContent = String(matchingBundles.length);
        if (countAlam) countAlam.textContent = String(allMatching.filter((t) => t.category === 'Foliage & Alam').length);
        if (countPerabot) countPerabot.textContent = String(allMatching.filter((t) => t.category === 'Perabot & Lampu').length);
        if (countPokemon) countPokemon.textContent = String(allMatching.filter((t) => t.category === 'Dunia Pokémon').length);
        if (countDigimon) countDigimon.textContent = String(allMatching.filter((t) => t.category === 'Dunia Digimon').length);
        if (countTech) countTech.textContent = String(allMatching.filter((t) => t.category === 'Tech & AI').length);
        if (countFasilitas) countFasilitas.textContent = String(allMatching.filter((t) => t.category === 'Fasilitas & Kota').length);

        const sortCatalogItems = (list: (typeof SPAWNABLE_TEMPLATES)[number][]) => {
          return list
            .map((tpl, idx) => ({
              tpl,
              idx,
              rec: isRecommendedHere(tpl) ? 0 : 1,
              placedCount: getPlacedForTemplate(tpl).length,
            }))
            .sort((a, b) => {
              if (activeSortMode === 'name') {
                return a.tpl.name.localeCompare(b.tpl.name, 'id');
              }
              if (activeSortMode === 'size') {
                return a.tpl.w * a.tpl.h - b.tpl.w * b.tpl.h || a.idx - b.idx;
              }
              if (activeSortMode === 'placed') {
                return b.placedCount - a.placedCount || a.rec - b.rec || a.idx - b.idx;
              }
              return a.rec - b.rec || a.idx - b.idx;
            })
            .map((entry) => entry.tpl);
        };

        if (activeSpawnCategory === 'bundles') {
          const sortedBundles = matchingBundles
            .map((b, idx) => ({ b, idx, rec: b.biomes.includes(activeWorld) ? 0 : 1 }))
            .sort((x, y) => {
              if (activeSortMode === 'name') return x.b.name.localeCompare(y.b.name, 'id');
              if (activeSortMode === 'size') return x.b.w * x.b.h - y.b.w * y.b.h || x.idx - y.idx;
              return x.rec - y.rec || x.idx - y.idx;
            })
            .map((e) => e.b);

          if (sortedBundles.length > 0) {
            const bundleSection = document.createElement('div');
            bundleSection.className = 'town-spawn-cat-section';
            const bundleTitle = document.createElement('h4');
            bundleTitle.className = 'town-spawn-cat-title';
            bundleTitle.textContent = `🎁 Paket Tema Siap Pakai (${sortedBundles.length})`;
            bundleSection.appendChild(bundleTitle);

            const grid = document.createElement('div');
            grid.className = 'town-spawn-grid';

            for (const bundle of sortedBundles) {
              const recommended = bundle.biomes.includes(activeWorld);
              const lockedEntries = bundle.items
                .map((it) => templatesById.get(it.templateId))
                .filter((t): t is (typeof SPAWNABLE_TEMPLATES)[number] => Boolean(t))
                .map((t) => ({ tpl: t, status: getTemplateUnlockStatus(t, catalogProgress, sandboxUnlockAll) }))
                .filter((entry) => !entry.status.unlocked);
              const uniqueLockedNames = Array.from(new Set(lockedEntries.map((e) => e.tpl.name)));
              const isBundleLocked = uniqueLockedNames.length > 0;

              const card = document.createElement('div');
              card.className = `town-spawn-card${isBundleLocked ? ' is-locked' : ''}`;

              const thumbsHtml = bundle.items
                .map((it) => {
                  const subTpl = templatesById.get(it.templateId);
                  if (!subTpl) return '';
                  const url = cachedThumbDataUrlFn ? cachedThumbDataUrlFn(subTpl, 24) : null;
                  return url
                    ? `<span class="town-spawn-bundle-thumb" title="${subTpl.name}"><img src="${url}" alt="${subTpl.name}" style="width:22px;height:22px;image-rendering:pixelated;object-fit:contain;" /></span>`
                    : `<span class="town-spawn-bundle-thumb" title="${subTpl.name}" data-bundle-tpl="${subTpl.id}">${subTpl.icon}</span>`;
                })
                .join('');
              if (!cachedThumbDataUrlFn) {
                loadTemplateThumbFn().then((fn) => {
                  if (!fn) return;
                  card.querySelectorAll<HTMLElement>('[data-bundle-tpl]').forEach((el) => {
                    const tid = el.getAttribute('data-bundle-tpl');
                    const st = tid ? templatesById.get(tid) : null;
                    const u = st ? fn(st, 24) : null;
                    if (u && st) {
                      el.innerHTML = `<img src="${u}" alt="${st.name}" style="width:22px;height:22px;image-rendering:pixelated;object-fit:contain;" />`;
                    }
                  });
                });
              }

              card.innerHTML = `
                <div class="town-spawn-card__header">
                  <span class="town-spawn-card__icon">${bundle.icon}</span>
                  <span class="town-spawn-card__tag">Paket Tema</span>
                  <span class="town-spawn-card__size">${bundle.w}×${bundle.h}</span>
                </div>
                <strong class="town-spawn-card__title">${bundle.name}</strong>
                ${
                  recommended || isBundleLocked
                    ? `<div class="town-spawn-card__badges">
                        ${recommended ? `<span class="town-spawn-card__biome">✨ Cocok di ${WORLD_BIOME_LABELS[activeWorld]}</span>` : ''}
                        ${isBundleLocked ? `<span class="town-spawn-card__unlock" title="Item terkunci: ${uniqueLockedNames.join(', ')}">🔒 ${uniqueLockedNames.length} item terkunci</span>` : ''}
                      </div>`
                    : ''
                }
                <div class="town-spawn-bundle-thumbs">${thumbsHtml}</div>
                <p class="town-spawn-card__desc">${bundle.desc}</p>
                <div class="town-spawn-card__actions">
                  <button type="button" class="town-editor-btn town-spawn-card__btn town-spawn-card__btn--place" data-bundle-id="${bundle.id}" ${isBundleLocked ? 'disabled' : ''}>
                    ${isBundleLocked ? '🔒 Paket Terkunci' : '🎁 Pasang Paket'}
                  </button>
                </div>
              `;

              if (isBundleLocked) {
                card.addEventListener('click', () => {
                  const firstReq = lockedEntries[0]?.status.rule;
                  sfx.select();
                  showToast(
                    `🔒 Paket "${bundle.name}" butuh membuka ${uniqueLockedNames.join(', ')}${firstReq ? ` (${firstReq.label})` : ''}. Atau aktifkan Mode Kreatif.`
                  );
                });
              }

              const btnBundlePlace = card.querySelector('.town-spawn-card__btn--place') as HTMLButtonElement | null;
              btnBundlePlace?.addEventListener('click', () => {
                if (!engine) return;
                const centerX = Math.floor(engine.getCameraX() / 16) - Math.floor(bundle.w / 2);
                const centerY = Math.floor(engine.getCameraY() / 16) - Math.floor(bundle.h / 2);
                const placed = townConfig.spawnThemeBundle(bundle.id, centerX, centerY);
                if (placed.length > 0) {
                  editor.setTool('move');
                  editor.selectBuilding(placed[0].id);
                  refreshObjectPicker();
                  engine.invalidateBackgroundCanvas();
                  engine.wake();
                  showToast(`🎁 Paket "${bundle.name}" (${placed.length} objek) berhasil dipasang! Tekan Ctrl+Z jika ingin membatalkan.`);
                  sfx.select();
                }
                spawnModal?.close();
              });

              grid.appendChild(card);
            }
            bundleSection.appendChild(grid);
            spawnCatalog.appendChild(bundleSection);
          } else {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'town-spawn-empty';
            emptyMsg.innerHTML = `<p>🔍 Tidak ditemukan paket tema yang cocok dengan filter aktif.</p>`;
            spawnCatalog.appendChild(emptyMsg);
          }

          renderScatterTray();
          updateSpawnInspector(null);
          kbdFocusedCardIdx = -1;
          return;
        }

        const sections = activeSpawnCategory === 'favorites'
          ? [{ title: '⭐ Objek Favorit', items: sortCatalogItems(allMatching.filter((t) => favoriteIds.has(t.id))) }]
          : (activeSpawnCategory === 'all'
              ? (['Foliage & Alam', 'Perabot & Lampu', 'Dunia Pokémon', 'Dunia Digimon', 'Tech & AI', 'Fasilitas & Kota'] as const)
              : ([activeSpawnCategory] as const)
            ).map((cat) => {
              let catIcon = '📦';
              if (cat === 'Foliage & Alam') catIcon = '🌳';
              else if (cat === 'Perabot & Lampu') catIcon = '🪑';
              else if (cat === 'Dunia Pokémon') catIcon = '⚡';
              else if (cat === 'Dunia Digimon') catIcon = '👾';
              else if (cat === 'Tech & AI') catIcon = '💻';
              else if (cat === 'Fasilitas & Kota') catIcon = '⛲';
              return {
                title: `${catIcon} ${cat}`,
                items: sortCatalogItems(allMatching.filter((t) => t.category === cat)),
              };
            });

        let totalDisplayed = 0;

        for (const sec of sections) {
          const items = sec.items;
          if (items.length === 0) continue;

          totalDisplayed += items.length;

          const catSection = document.createElement('div');
          catSection.className = 'town-spawn-cat-section';

          const catTitle = document.createElement('h4');
          catTitle.className = 'town-spawn-cat-title';
          catTitle.textContent = `${sec.title} (${items.length})`;
          catSection.appendChild(catTitle);

          const grid = document.createElement('div');
          grid.className = 'town-spawn-grid';

          for (const item of items) {
            const isFav = favoriteIds.has(item.id);
            const recommended = isRecommendedHere(item);
            const placedList = getPlacedForTemplate(item);
            const unlockStatus = getTemplateUnlockStatus(item, catalogProgress, sandboxUnlockAll);
            const isLocked = !unlockStatus.unlocked;
            const unlockBadgeHtml = unlockStatus.rule
              ? isLocked
                ? `<span class="town-spawn-card__unlock" title="${unlockStatus.rule.hint}">🔒 ${unlockStatus.current}/${unlockStatus.required} · ${unlockStatus.rule.label}</span>`
                : `<span class="town-spawn-card__unlock is-unlocked" title="${unlockStatus.rule.label}">${sandboxUnlockAll && unlockStatus.current < unlockStatus.required ? '🔓 Kreatif' : '🏆 Terbuka'}</span>`
              : '';

            const card = document.createElement('div');
            card.className = `town-spawn-card${isLocked ? ' is-locked' : ''}`;
            card.dataset.tplId = item.id;
            card.addEventListener('mouseenter', () => updateSpawnInspector(item));
            if (isLocked && unlockStatus.rule) {
              const lockRule = unlockStatus.rule;
              card.addEventListener('click', (e) => {
                const target = e.target as HTMLElement | null;
                if (target?.closest('.town-spawn-card__fav') || target?.closest('.town-spawn-card__placed')) return;
                sfx.select();
                showToast(
                  `🔒 ${item.name} terkunci (${unlockStatus.current}/${unlockStatus.required} · ${lockRule.label}). ${lockRule.hint} Atau aktifkan Mode Kreatif.`
                );
              });
            }
            card.innerHTML = `
              <div class="town-spawn-card__header">
                <span class="town-spawn-card__icon">${item.icon}</span>
                <span class="town-spawn-card__tag">${item.category}</span>
                <span class="town-spawn-card__size">${item.w}×${item.h}</span>
                <button type="button" class="town-spawn-card__fav ${isFav ? 'is-fav' : ''}" data-fav-id="${item.id}" title="${isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}" aria-pressed="${isFav}">★</button>
              </div>
              <strong class="town-spawn-card__title">${item.name}</strong>
              ${
                recommended || placedList.length > 0 || unlockBadgeHtml
                  ? `<div class="town-spawn-card__badges">
                      ${unlockBadgeHtml}
                      ${recommended ? `<span class="town-spawn-card__biome" title="Direkomendasikan untuk ${WORLD_BIOME_LABELS[activeWorld]}">✨ Cocok</span>` : ''}
                      ${placedList.length > 0 ? `<button type="button" class="town-spawn-card__placed" title="Terpasang ${placedList.length}× di peta ini — klik untuk melompat ke objek">📍×${placedList.length}</button>` : ''}
                    </div>`
                  : ''
              }
              <p class="town-spawn-card__desc">${item.desc}</p>
              ${item.defaultDialogue ? `<div class="town-spawn-card__dialogue-preview">💬 "<em>${item.defaultDialogue}</em>"</div>` : ''}
              <div class="town-spawn-card__actions">
                <button type="button" class="town-editor-btn town-spawn-card__btn town-spawn-card__btn--place" data-tpl-id="${item.id}" ${isLocked ? 'disabled' : ''} title="${isLocked && unlockStatus.rule ? unlockStatus.rule.hint : 'Letakkan di tengah layar peta (Tekan Shift+Klik untuk mode cap)'}">
                  ${isLocked ? '🔒 Terkunci' : '➕ Pasang'}
                </button>
                <button type="button" class="town-editor-btn town-spawn-card__btn town-spawn-card__btn--stamp" data-tpl-id="${item.id}" ${isLocked ? 'disabled' : ''} title="Aktifkan mode cap untuk menaruh berkali-kali di peta!">
                  🎯 Cap
                </button>
                <button type="button" class="town-editor-btn town-spawn-card__btn town-spawn-card__scatter ${scatterPool.has(item.id) ? 'is-selected' : ''}" data-scatter-id="${item.id}" ${isLocked ? 'disabled' : ''} title="Tambahkan ke Kuas Acak (Scatter Brush)">
                  🎲
                </button>
              </div>
            `;

            const iconEl = card.querySelector('.town-spawn-card__icon') as HTMLElement | null;
            if (iconEl) {
              iconEl.setAttribute('data-tpl-thumb', item.id);
              if (spawnThumbObserver) {
                spawnThumbObserver.observe(iconEl);
              } else {
                hydrateTemplateThumb(iconEl, item);
              }
            }

            const btnFav = card.querySelector('.town-spawn-card__fav') as HTMLButtonElement | null;
            btnFav?.addEventListener('click', (e) => {
              e.stopPropagation();
              const nowFav = toggleCatalogFavorite(item.id);
              sfx.select();
              showToast(nowFav ? `⭐ "${item.name}" disimpan ke Favorit.` : `☆ "${item.name}" dihapus dari Favorit.`);
              renderSpawnCatalog();
            });

            const btnPlaced = card.querySelector('.town-spawn-card__placed') as HTMLButtonElement | null;
            btnPlaced?.addEventListener('click', (e) => {
              e.stopPropagation();
              if (placedList.length === 0) return;
              const idx = (placedJumpIndex.get(item.id) ?? 0) % placedList.length;
              placedJumpIndex.set(item.id, (idx + 1) % placedList.length);
              const target = placedList[idx];
              editor.setTool('move');
              editor.selectBuilding(target.id);
              editor.focusBuilding(target.id);
              refreshObjectPicker();
              spawnModal?.close();
              showToast(`📍 Menuju ${target.name} (${idx + 1}/${placedList.length}) di (${target.x}, ${target.y})`);
              sfx.select();
            });

            const btnPlace = card.querySelector('.town-spawn-card__btn--place') as HTMLButtonElement | null;
            const btnStamp = card.querySelector('.town-spawn-card__btn--stamp') as HTMLButtonElement | null;

            btnPlace?.addEventListener('click', (e) => {
              if (!engine) return;
              pushQuickStamp(item.id);
              if (e.shiftKey) {
                editor.setStampFlipped(spawnFlipMode);
                editor.setStampTemplate(item.id);
                spawnModal?.close();
                showToast(`🎯 Mode Cap aktif: ${item.name}! Klik bebas di peta untuk menaruh berturut-turut (R: Balik arah, ESC: Selesai).`);
                sfx.select();
                return;
              }
              const camX = engine.getCameraX();
              const camY = engine.getCameraY();
              const centerX = Math.floor(camX / 16);
              const centerY = Math.floor(camY / 16);
              const newObj = townConfig.spawnObject(item.id, centerX, centerY, spawnFlipMode ? 'W' : undefined);
              if (newObj) {
                editor.setTool('move');
                editor.selectBuilding(newObj.id);
                refreshObjectPicker();
                engine.invalidateBackgroundCanvas();
                engine.wake();
                showToast(`✨ ${newObj.name} berhasil dipasang${spawnFlipMode ? ' (⇄ Arah Balik)' : ''}! Tarik kursor untuk memindahkan posisinya.`);
                sfx.select();
              }
              spawnModal?.close();
            });

            btnStamp?.addEventListener('click', () => {
              pushQuickStamp(item.id);
              editor.setStampFlipped(spawnFlipMode);
              editor.setStampTemplate(item.id);
              spawnModal?.close();
              showToast(`🎯 Mode Cap aktif: ${item.name}! Klik bebas di peta (R: Balik arah, ESC: Selesai).`);
              sfx.select();
            });

            const btnScatterToggle = card.querySelector('.town-spawn-card__scatter') as HTMLButtonElement | null;
            btnScatterToggle?.addEventListener('click', (e) => {
              e.stopPropagation();
              if (scatterPool.has(item.id)) {
                scatterPool.delete(item.id);
              } else {
                scatterPool.add(item.id);
              }
              btnScatterToggle.classList.toggle('is-selected', scatterPool.has(item.id));
              renderScatterTray();
              sfx.select();
            });

            grid.appendChild(card);
          }
          catSection.appendChild(grid);
          spawnCatalog.appendChild(catSection);
        }

        if (totalDisplayed === 0) {
          const emptyMsg = document.createElement('div');
          emptyMsg.className = 'town-spawn-empty';
          emptyMsg.innerHTML =
            activeSpawnCategory === 'favorites'
              ? `<p>⭐ Belum ada objek favorit${q ? ` yang cocok dengan "<strong>${q}</strong>"` : ''}. Klik ikon <strong>★</strong> pada kartu objek untuk menyimpannya di sini!</p>`
              : `<p>🔍 Tidak ditemukan objek yang cocok dengan filter aktif${q ? ` ("<strong>${q}</strong>")` : ''}.</p>`;
          spawnCatalog.appendChild(emptyMsg);
        }

        kbdFocusedCardIdx = -1;
        renderScatterTray();
        if (totalDisplayed > 0) {
          const visibleTplIds = new Set(
            Array.from(spawnCatalog.querySelectorAll<HTMLElement>('.town-spawn-card'))
              .map((c) => c.dataset.tplId)
              .filter((v): v is string => Boolean(v))
          );
          const nextInsp =
            lastInspectedTemplate && visibleTplIds.has(lastInspectedTemplate.id)
              ? lastInspectedTemplate
              : (() => {
                  const firstId = Array.from(visibleTplIds)[0];
                  return firstId ? templatesById.get(firstId) ?? null : null;
                })();
          updateSpawnInspector(nextInsp);
        } else {
          updateSpawnInspector(null);
        }
      };

      const applyKbdFocus = (nextIdx: number) => {
        if (!spawnCatalog) return;
        const cards = Array.from(spawnCatalog.querySelectorAll<HTMLElement>('.town-spawn-card'));
        cards.forEach((c) => c.classList.remove('is-kbd-focus'));
        if (cards.length === 0) {
          kbdFocusedCardIdx = -1;
          return;
        }
        const clamped = Math.max(0, Math.min(cards.length - 1, nextIdx));
        kbdFocusedCardIdx = clamped;
        const targetCard = cards[clamped];
        targetCard.classList.add('is-kbd-focus');
        targetCard.scrollIntoView({ block: 'nearest' });
        const tplId = targetCard.dataset.tplId;
        if (tplId) {
          updateSpawnInspector(templatesById.get(tplId) ?? null);
        }
      };

      spawnSearch?.addEventListener('input', () => {
        spawnSearchQuery = spawnSearch.value;
        renderSpawnCatalog();
        applyKbdFocus(0);
      });

      spawnSearchClear?.addEventListener('click', () => {
        if (spawnSearch) {
          spawnSearch.value = '';
          spawnSearchQuery = '';
          renderSpawnCatalog();
          spawnSearch.focus();
        }
      });

      spawnTabButtons.forEach((tab) => {
        tab.addEventListener('click', () => {
          const cat = tab.getAttribute('data-cat') || 'all';
          activeSpawnCategory = cat;
          spawnTabButtons.forEach((t) => t.classList.toggle('is-active', t === tab));
          renderSpawnCatalog();
          sfx.select();
        });
      });

      const btnBiomeFilter = document.getElementById('btn-spawn-biome-filter');
      const sizeFilterChips = document.querySelectorAll<HTMLButtonElement>('[data-size-filter]');
      const colFilterChips = document.querySelectorAll<HTMLButtonElement>('[data-col-filter]');

      btnBiomeFilter?.addEventListener('click', () => {
        onlyRecommendedBiome = !onlyRecommendedBiome;
        btnBiomeFilter.classList.toggle('is-active', onlyRecommendedBiome);
        renderSpawnCatalog();
        sfx.select();
      });

      sizeFilterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const val = (chip.getAttribute('data-size-filter') || 'all') as typeof activeSizeFilter;
          activeSizeFilter = val;
          sizeFilterChips.forEach((c) => c.classList.toggle('is-active', c === chip));
          renderSpawnCatalog();
          sfx.select();
        });
      });

      colFilterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const val = (chip.getAttribute('data-col-filter') || 'all') as typeof activeColFilter;
          activeColFilter = val;
          colFilterChips.forEach((c) => c.classList.toggle('is-active', c === chip));
          renderSpawnCatalog();
          sfx.select();
        });
      });

      const btnSpawnFlipToggle = document.getElementById('btn-spawn-flip-toggle');
      const spawnFlipLabel = document.getElementById('spawn-flip-label');
      btnSpawnFlipToggle?.addEventListener('click', () => {
        spawnFlipMode = !spawnFlipMode;
        editor.setStampFlipped(spawnFlipMode);
        btnSpawnFlipToggle.classList.toggle('is-active', spawnFlipMode);
        if (spawnFlipLabel) {
          spawnFlipLabel.textContent = spawnFlipMode ? 'Balik (W)' : 'Normal';
        }
        document.getElementById('spawn-insp-thumb')?.classList.toggle('is-flipped', spawnFlipMode);
        sfx.select();
      });

      const btnSpawnSandboxToggle = document.getElementById('btn-spawn-sandbox-toggle');
      btnSpawnSandboxToggle?.addEventListener('click', () => {
        sandboxUnlockAll = !sandboxUnlockAll;
        try {
          localStorage.setItem(SANDBOX_UNLOCK_KEY, String(sandboxUnlockAll));
        } catch {}
        renderSpawnCatalog();
        sfx.select();
        showToast(
          sandboxUnlockAll
            ? '🔓 Mode Kreatif aktif — semua item eksklusif katalog kini bebas dipasang!'
            : '🏆 Mode Progres aktif — item eksklusif terbuka sesuai koleksi Plume/Crest/Seal/Badge.'
        );
      });

      for (const evName of [
        'town:badge-unlocked',
        'sky:plume-updated',
        'kingdom:crest-updated',
        'harbour:seal-updated',
        'abyssal-seal-unlocked',
      ]) {
        window.addEventListener(evName, () => {
          if (spawnModal?.open) {
            renderSpawnCatalog();
          } else {
            syncSandboxChip(readCatalogProgress());
          }
        });
      }

      const spawnSortSelect = document.getElementById('town-spawn-sort') as HTMLSelectElement | null;
      spawnSortSelect?.addEventListener('change', () => {
        activeSortMode = (spawnSortSelect.value || 'biome') as typeof activeSortMode;
        renderSpawnCatalog();
        sfx.select();
      });

      const btnStartScatterBrush = document.getElementById('btn-start-scatter-brush');
      const btnClearScatterPool = document.getElementById('btn-clear-scatter-pool');
      const scatterRadiusSelect = document.getElementById('scatter-radius-select') as HTMLSelectElement | null;
      const scatterDensitySelect = document.getElementById('scatter-density-select') as HTMLSelectElement | null;

      btnStartScatterBrush?.addEventListener('click', () => {
        if (scatterPool.size === 0) return;
        const r = (Number(scatterRadiusSelect?.value || 3) as 2 | 3 | 4) || 3;
        const d = Number(scatterDensitySelect?.value || 3) || 3;
        editor.setScatterTemplates(Array.from(scatterPool), r, d);
        spawnModal?.close();
        showToast(`🎲 Mode Kuas Acak aktif (${scatterPool.size} jenis · R${r})! Klik/seret di peta untuk menyebar, ESC untuk selesai.`);
        sfx.select();
      });

      btnClearScatterPool?.addEventListener('click', () => {
        scatterPool.clear();
        renderSpawnCatalog();
        sfx.select();
      });

      renderSpawnCatalog();

      let hasOpenedDigiSpawner = false;
      const openSpawnCatalogModal = (focusSearch = false) => {
        spawnFlipMode = editor.isStampFlipped();
        btnSpawnFlipToggle?.classList.toggle('is-active', spawnFlipMode);
        if (spawnFlipLabel) {
          spawnFlipLabel.textContent = spawnFlipMode ? 'Balik (W)' : 'Normal';
        }
        if (!hasOpenedDigiSpawner && engine?.getScene() === 'digimon' && activeSpawnCategory === 'all') {
          hasOpenedDigiSpawner = true;
          activeSpawnCategory = 'Dunia Digimon';
          spawnTabButtons.forEach((t) =>
            t.classList.toggle('is-active', t.getAttribute('data-cat') === 'Dunia Digimon')
          );
        }
        renderSpawnCatalog();
        if (!spawnModal?.open) {
          spawnModal?.showModal();
        }
        if (focusSearch) {
          requestAnimationFrame(() => {
            spawnSearch?.focus();
            spawnSearch?.select();
            applyKbdFocus(0);
          });
        }
        sfx.select();
      };

      toolBtnSpawn?.addEventListener('click', () => {
        openSpawnCatalogModal(false);
      });

      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          if (!engine || !engine.isWorldScene()) return;
          e.preventDefault();
          if (!editor.isEnabled()) {
            editor.toggleEnabled();
          }
          openSpawnCatalogModal(true);
        }
      });

      spawnModal?.addEventListener('keydown', (e) => {
        if (!spawnCatalog) return;
        const cards = spawnCatalog.querySelectorAll<HTMLElement>('.town-spawn-card');
        if (cards.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          applyKbdFocus(kbdFocusedCardIdx < 0 ? 0 : kbdFocusedCardIdx + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          applyKbdFocus(kbdFocusedCardIdx <= 0 ? 0 : kbdFocusedCardIdx - 1);
        } else if (e.key === 'Enter') {
          const activeEl = document.activeElement as HTMLElement | null;
          if (activeEl && activeEl !== spawnSearch && activeEl.tagName === 'BUTTON') return;
          const idx = kbdFocusedCardIdx >= 0 && kbdFocusedCardIdx < cards.length ? kbdFocusedCardIdx : 0;
          const card = cards[idx];
          if (!card) return;
          e.preventDefault();
          const targetBtn = card.querySelector(
            e.shiftKey ? '.town-spawn-card__btn--stamp' : '.town-spawn-card__btn--place'
          ) as HTMLButtonElement | null;
          if (targetBtn?.disabled) {
            card.click();
            return;
          }
          targetBtn?.click();
        }
      });

      btnCloseSpawnModal?.addEventListener('click', () => {
        spawnModal?.close();
      });

      // ==========================================
      // LIVE RIGHT SIDE-DRAWER INSPECTOR
      // ==========================================
      const inspectorDrawer = document.getElementById('town-editor-inspector-drawer');
      const inspectorSinglePanel = document.getElementById('inspector-single-panel');
      const inspectorMultiPanel = document.getElementById('inspector-multi-panel');
      const inspectorHeaderTitle = document.getElementById('inspector-header-title');
      const inspectorEntityIcon = document.getElementById('inspector-entity-icon');
      const inspectorName = document.getElementById('town-inspector-name') as HTMLInputElement | null;
      const inspectorLink = document.getElementById('town-inspector-link') as HTMLInputElement | null;
      const inspectorPosX = document.getElementById('town-inspector-x') as HTMLInputElement | null;
      const inspectorPosY = document.getElementById('town-inspector-y') as HTMLInputElement | null;
      const inspectorPosZ = document.getElementById('town-inspector-z') as HTMLInputElement | null;
      const inspectorScale = document.getElementById('town-inspector-scale') as HTMLInputElement | null;
      const inspectorScaleVal = document.getElementById('town-inspector-scale-val');
      const inspectorOrientLabel = document.getElementById('inspector-orient-label');
      const inspectorBehavior = document.getElementById('town-inspector-behavior') as HTMLSelectElement | null;
      const inspectorDialogue = document.getElementById('town-dialogue-input') as HTMLTextAreaElement | null;
      const btnInspectorPreview = document.getElementById('btn-inspector-preview-move');
      const btnInspLock = document.getElementById('btn-insp-lock');
      const orientBtns = document.querySelectorAll<HTMLButtonElement>('.town-insp-orient-btn');
      let isInspectorDrawerDismissed = false;
      let lastInspectedId = '';
      let scaleDragSnapshot: ReturnType<typeof townConfig.captureSnapshot> | null = null;

      const commitLivePatch = (
        patch: Parameters<typeof townConfig.updateObjectProperties>[1],
        recordHistory = true
      ) => {
        const selected = editor.getSelectedBuilding();
        if (!selected) return;
        townConfig.updateObjectProperties(selected.id, patch, recordHistory);
        engine?.invalidateBackgroundCanvas();
        engine?.wake();
      };

      inspectorScale?.addEventListener('pointerdown', () => {
        scaleDragSnapshot = townConfig.captureSnapshot();
      });
      inspectorScale?.addEventListener('input', () => {
        if (!scaleDragSnapshot) scaleDragSnapshot = townConfig.captureSnapshot();
        const val = Number(inspectorScale.value);
        if (inspectorScaleVal) inspectorScaleVal.textContent = `${val.toFixed(2)}×`;
        commitLivePatch({ scaleMultiplier: val }, false);
      });
      inspectorScale?.addEventListener('change', () => {
        if (scaleDragSnapshot) {
          townConfig.pushSnapshot(scaleDragSnapshot);
          scaleDragSnapshot = null;
        }
        sfx.select();
      });

      inspectorName?.addEventListener('change', () => {
        commitLivePatch({ name: inspectorName.value }, true);
        sfx.select();
      });
      inspectorLink?.addEventListener('change', () => {
        commitLivePatch({ link: inspectorLink.value }, true);
        sfx.select();
      });
      inspectorPosX?.addEventListener('change', () => {
        commitLivePatch({ x: Number(inspectorPosX.value) }, true);
        sfx.select();
      });
      inspectorPosY?.addEventListener('change', () => {
        commitLivePatch({ y: Number(inspectorPosY.value) }, true);
        sfx.select();
      });
      inspectorPosZ?.addEventListener('change', () => {
        commitLivePatch({ zIndex: Number(inspectorPosZ.value) }, true);
        sfx.select();
      });
      inspectorBehavior?.addEventListener('change', () => {
        commitLivePatch(
          { behavior: inspectorBehavior.value as 'stationary' | 'look_around' | 'patrol_small' },
          true
        );
        sfx.select();
      });
      inspectorDialogue?.addEventListener('change', () => {
        commitLivePatch({ dialogue: inspectorDialogue.value.trim() }, true);
        sfx.select();
      });

      orientBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const o = btn.getAttribute('data-orient') as 'N' | 'E' | 'S' | 'W' | null;
          if (o) {
            editor.setSelectedOrientation(o);
            sfx.select();
          }
        });
      });

      btnInspLock?.addEventListener('click', () => {
        editor.toggleSelectedLock();
        sfx.select();
      });
      document.getElementById('btn-insp-dup')?.addEventListener('click', () => {
        editor.duplicateSelected();
        sfx.select();
      });
      document.getElementById('btn-insp-layer-down')?.addEventListener('click', () => {
        editor.adjustSelectedZIndex(-1);
        sfx.select();
      });
      document.getElementById('btn-insp-layer-up')?.addEventListener('click', () => {
        editor.adjustSelectedZIndex(1);
        sfx.select();
      });
      document.getElementById('btn-insp-delete')?.addEventListener('click', () => {
        editor.deleteSelected();
        sfx.select();
      });
      document.getElementById('btn-inspector-focus')?.addEventListener('click', () => {
        const sel = editor.getSelectedBuilding();
        if (sel) {
          editor.focusBuilding(sel.id);
          sfx.select();
        }
      });
      document.getElementById('btn-inspector-close')?.addEventListener('click', () => {
        isInspectorDrawerDismissed = true;
        updateEditorUI();
        sfx.select();
      });

      btnInspectorPreview?.addEventListener('click', () => {
        const selected = editor.getSelectedBuilding();
        if (!selected || !engine) return;
        const pokeKey = selected.subType || selected.id.split('_')[0] || 'pikachu';
        engine.triggerSignatureMove(pokeKey, selected.x, selected.y);
        sfx.confirm();
        showToast(`⚡ Preview Signature Move: ${selected.name}`);
      });

      // Multi-select alignment buttons
      document.querySelectorAll<HTMLButtonElement>('[data-align]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-align') as Parameters<typeof editor.alignSelected>[0];
          if (mode) {
            editor.alignSelected(mode);
            sfx.select();
          }
        });
      });
      document.getElementById('btn-multi-dup')?.addEventListener('click', () => {
        editor.duplicateSelected();
        sfx.select();
      });
      document.getElementById('btn-multi-lock')?.addEventListener('click', () => {
        editor.toggleSelectedLock();
        sfx.select();
      });
      document.getElementById('btn-multi-delete')?.addEventListener('click', () => {
        editor.deleteSelected();
        sfx.select();
      });
      document.getElementById('btn-multi-prefab')?.addEventListener('click', () => {
        renderPrefabsList();
        prefabsModal?.showModal();
        sfx.select();
      });

      // Floating Transform Bubble quick buttons
      document.getElementById('btn-transform-dup')?.addEventListener('click', () => {
        editor.duplicateSelected();
        sfx.select();
      });
      document.getElementById('btn-transform-lock')?.addEventListener('click', () => {
        editor.toggleSelectedLock();
        sfx.select();
      });
      document.getElementById('btn-transform-del')?.addEventListener('click', () => {
        editor.deleteSelected();
        sfx.select();
      });
      document.getElementById('btn-transform-inspect')?.addEventListener('click', () => {
        isInspectorDrawerDismissed = !isInspectorDrawerDismissed;
        updateEditorUI();
        sfx.select();
      });

      // Telemetry Pill Live Listener
      const telemetryPill = document.getElementById('town-editor-telemetry-pill');
      const telemetryCoords = document.getElementById('town-telemetry-coords');
      const telemetryTool = document.getElementById('town-telemetry-tool');
      const zenPill = document.getElementById('town-editor-zen-pill');

      const toolLabelMap: Record<string, string> = {
        move: '🖐️ Pilih',
        brush: '🖌️ Kuas',
        erase: '🧹 Hapus',
        delete_object: '🗑️ Hapus Objek',
        line: '📏 Garis',
        rect: '⬛ Kotak',
        bucket: '🪣 Ember',
        eyedropper: '💧 Pipet',
        collision: '🛡️ Tabrakan',
        stamp: '🎯 Cap',
      };

      window.addEventListener('town:editor-telemetry', ((e: CustomEvent<{ x: number; y: number; tool: string; brushSize: number }>) => {
        const d = e.detail;
        if (!d) return;
        if (telemetryCoords) telemetryCoords.textContent = `X: ${d.x}, Y: ${d.y}`;
        if (telemetryTool) {
          const base = toolLabelMap[d.tool] || d.tool;
          const sz = d.tool === 'brush' || d.tool === 'erase' ? ` (${d.brushSize}×${d.brushSize})` : '';
          telemetryTool.textContent = `${base}${sz}`;
        }
      }) as EventListener);

      const updateEditorUI = () => {
        const isEnabled = editor.isEnabled();
        const isPlay = editor.isPlaytesting();
        const isZen = editor.isZenMode();

        btnToggleDevMenu?.classList.toggle('is-active', isEnabled || (engine?.isXray() ?? false));
        burgerItemEditor?.classList.toggle('is-active', isEnabled);

        if (editorToolbar) {
          if (isEnabled && !isPlay && !isZen) {
            editorToolbar.classList.remove('hidden');
            editorToolbar.removeAttribute('hidden');
            editorToolbar.style.display = 'flex';
          } else {
            editorToolbar.classList.add('hidden');
            editorToolbar.setAttribute('hidden', '');
            editorToolbar.style.display = 'none';
          }
        }
        if (telemetryPill) {
          if (isEnabled && !isPlay && !isZen) {
            telemetryPill.classList.remove('hidden');
            telemetryPill.style.display = 'inline-flex';
          } else {
            telemetryPill.classList.add('hidden');
            telemetryPill.style.display = 'none';
          }
        }
        if (zenPill) {
          if (isEnabled && !isPlay && isZen) {
            zenPill.classList.remove('hidden');
            zenPill.style.display = 'inline-flex';
          } else {
            zenPill.classList.add('hidden');
            zenPill.style.display = 'none';
          }
        }

        if (!isEnabled) {
          if (inspectorDrawer) {
            inspectorDrawer.classList.add('hidden');
            inspectorDrawer.style.display = 'none';
          }
          if (minimapWidget) {
            minimapWidget.classList.remove('has-inspector-open');
          }
          return;
        }

        if (studioContextRow) {
          studioContextRow.style.display = isMinimized ? 'none' : 'flex';
        }

        const diffPill = document.getElementById('town-editor-diff-pill');
        const dirtyDot = document.getElementById('btn-save-dirty-dot');
        const diff = townConfig.getDiffSummaryVsCanonical();
        if (diffPill) {
          if (diff.totalChanges === 0) {
            diffPill.textContent = '✓ Synced';
            diffPill.className = 'px-2 py-0.5 rounded bg-slate-800 border border-slate-600 font-mono text-[9px] text-emerald-300 hidden lg:inline-block shrink-0';
          } else {
            diffPill.textContent = `● +${diff.added} ~${diff.moved} -${diff.removed} · ${diff.tileDiff}T`;
            diffPill.className = 'px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 font-mono text-[9px] text-amber-200 hidden lg:inline-block shrink-0';
          }
        }
        dirtyDot?.classList.toggle('hidden', diff.totalChanges === 0);

        const tool = editor.getTool();
        // Auto-sync Mode Tab with active tool
        let desiredMode: EditorModeTab = currentModeTab;
        if (tool === 'move' || tool === 'delete_object' || tool === 'stamp') {
          desiredMode = 'object';
        } else if (tool === 'collision') {
          desiredMode = 'check';
        } else if (
          tool === 'brush' ||
          tool === 'erase' ||
          tool === 'line' ||
          tool === 'rect' ||
          tool === 'bucket' ||
          tool === 'eyedropper'
        ) {
          if (desiredMode !== 'check') desiredMode = 'paint';
        }
        if (desiredMode !== currentModeTab) {
          switchEditorModeTab(desiredMode, false);
        }

        if (telemetryTool) {
          const base = toolLabelMap[tool] || tool;
          const sz = tool === 'brush' || tool === 'erase' ? ` (${editor.getBrushSize()}×${editor.getBrushSize()})` : '';
          telemetryTool.textContent = `${base}${sz}`;
        }

        toolBtnMove?.classList.toggle('is-active', tool === 'move');
        toolBtnBrush?.classList.toggle('is-active', tool === 'brush');
        toolBtnErase?.classList.toggle('is-active', tool === 'erase');
        toolBtnDeleteObject?.classList.toggle('is-active', tool === 'delete_object');
        toolBtnLine?.classList.toggle('is-active', tool === 'line');
        toolBtnRect?.classList.toggle('is-active', tool === 'rect');
        toolBtnBucket?.classList.toggle('is-active', tool === 'bucket');
        toolBtnEyedropper?.classList.toggle('is-active', tool === 'eyedropper');
        toolBtnCollision?.classList.toggle('is-active', tool === 'collision' || editor.isCollisionOverlayVisible());
        toolBtnPlaytest?.classList.toggle('is-active', isPlay);
        toolBtnGrid?.classList.toggle('is-active', editor.isGridVisible());
        const moreGridState = document.getElementById('more-grid-state');
        if (moreGridState) {
          moreGridState.textContent = editor.isGridVisible() ? 'ON' : 'OFF';
          moreGridState.className = `text-[9px] font-bold ${editor.isGridVisible() ? 'text-emerald-300' : 'text-slate-400'}`;
        }

        const brushSize = editor.getBrushSize();
        btnBrush1?.classList.toggle('is-active', brushSize === 1);
        btnBrush2?.classList.toggle('is-active', brushSize === 2);
        btnBrush3?.classList.toggle('is-active', brushSize === 3);

        btnEditorUndo?.toggleAttribute('disabled', !townConfig.canUndo());
        btnEditorRedo?.toggleAttribute('disabled', !townConfig.canRedo());

        const brushTile = editor.getBrushTile();
        tileBtns.forEach((btn) => {
          const isCurrent = btn.getAttribute('data-tile') === brushTile;
          btn.classList.toggle(
            'is-active',
            isCurrent && (tool === 'brush' || tool === 'line' || tool === 'rect' || tool === 'bucket')
          );
        });

        renderQuickStampStrip();

        const selected = editor.getSelectedBuilding();
        const selectedBuildings = editor.getSelectedBuildings();
        refreshObjectPicker();

        if (!selected && selectedBuildings.length === 0) {
          isInspectorDrawerDismissed = false;
          lastInspectedId = '';
        } else if (selected && selected.id !== lastInspectedId) {
          isInspectorDrawerDismissed = false;
          lastInspectedId = selected.id;
        }

        // Sync Live Side-Drawer Inspector
        const showInspector =
          isEnabled && !isPlay && !isZen && selectedBuildings.length > 0 && !isInspectorDrawerDismissed;
        if (inspectorDrawer) {
          if (showInspector) {
            inspectorDrawer.classList.remove('hidden');
            inspectorDrawer.style.display = 'flex';
          } else {
            inspectorDrawer.classList.add('hidden');
            inspectorDrawer.style.display = 'none';
          }
        }
        minimapWidget?.classList.toggle('has-inspector-open', showInspector);

        if (showInspector) {
          if (selectedBuildings.length > 1) {
            inspectorSinglePanel?.classList.add('hidden');
            inspectorMultiPanel?.classList.remove('hidden');
            if (inspectorEntityIcon) inspectorEntityIcon.textContent = '📚';
            if (inspectorHeaderTitle) inspectorHeaderTitle.textContent = `${selectedBuildings.length} Objek Terpilih`;
            const multiCount = document.getElementById('multi-sel-count');
            if (multiCount) multiCount.textContent = String(selectedBuildings.length);
          } else if (selected) {
            inspectorSinglePanel?.classList.remove('hidden');
            inspectorMultiPanel?.classList.add('hidden');
            if (inspectorEntityIcon) inspectorEntityIcon.textContent = getEntityEmoji(selected);
            if (inspectorHeaderTitle) inspectorHeaderTitle.textContent = selected.name;
            if (inspectorName && document.activeElement !== inspectorName) {
              inspectorName.value = selected.name || '';
            }
            if (inspectorLink && document.activeElement !== inspectorLink) {
              inspectorLink.value = selected.link || '';
            }
            if (inspectorPosX && document.activeElement !== inspectorPosX) {
              inspectorPosX.value = String(selected.x);
            }
            if (inspectorPosY && document.activeElement !== inspectorPosY) {
              inspectorPosY.value = String(selected.y);
            }
            if (inspectorPosZ && document.activeElement !== inspectorPosZ) {
              inspectorPosZ.value = String(selected.zIndex ?? 0);
            }
            const sc = selected.scaleMultiplier ?? 1;
            if (inspectorScale && document.activeElement !== inspectorScale) {
              inspectorScale.value = String(sc);
            }
            if (inspectorScaleVal) inspectorScaleVal.textContent = `${sc.toFixed(2)}×`;
            const curOrient = selected.orientation || 'N';
            if (inspectorOrientLabel) inspectorOrientLabel.textContent = curOrient;
            orientBtns.forEach((b) =>
              b.classList.toggle('is-active', b.getAttribute('data-orient') === curOrient)
            );
            if (inspectorBehavior && document.activeElement !== inspectorBehavior) {
              inspectorBehavior.value = selected.behavior || 'stationary';
            }
            if (inspectorDialogue && document.activeElement !== inspectorDialogue) {
              const tpl = SPAWNABLE_TEMPLATES.find((t) => t.id === selected.id || t.subType === selected.subType);
              inspectorDialogue.value =
                selected.dialogue !== undefined ? selected.dialogue : tpl?.defaultDialogue || '';
            }
            if (btnInspectorPreview) {
              btnInspectorPreview.style.display = selected.kind === 'npc' ? 'inline-flex' : 'none';
            }
            if (btnInspLock) {
              btnInspLock.textContent = selected.locked ? '🔓' : '🔒';
              btnInspLock.classList.toggle('is-active', !!selected.locked);
            }
            const subPinsInfo = document.getElementById('town-insp-subpins-info');
            if (subPinsInfo) {
              const dX = selected.doorX !== undefined ? selected.doorX : selected.x + Math.floor(selected.w / 2);
              const dY = selected.doorY !== undefined ? selected.doorY : selected.y + selected.h;
              const lX = selected.labelX !== undefined ? selected.labelX : selected.x + selected.w / 2;
              const lY = selected.labelY !== undefined ? selected.labelY : selected.y;
              subPinsInfo.textContent = `🟣 Label (${lX}, ${lY}) • 🟡 Pintu (${dX}, ${dY}) — Seret pin langsung di kanvas`;
            }
          }
        }

        // Update Floating Transform Action Bubble
        const transformBubble = document.getElementById('town-transform-bubble');
        if (transformBubble) {
          if (isEnabled && !isPlay && selected) {
            transformBubble.classList.remove('hidden');
            transformBubble.style.display = 'block';
            const titleEl = document.getElementById('transform-bubble-title');
            const badgeEl = document.getElementById('transform-bubble-orient-badge');
            const iconEl = document.getElementById('transform-bubble-icon');
            const lockBtn = document.getElementById('btn-transform-lock');
            if (titleEl) {
              titleEl.textContent =
                selectedBuildings.length > 1 ? `${selectedBuildings.length} Objek` : selected.name;
            }
            if (lockBtn) {
              lockBtn.textContent = editor.isSelectedLocked() ? '🔓' : '🔒';
            }
            if (iconEl) {
              iconEl.textContent = getEntityEmoji(selected);
            }
            if (badgeEl) {
              const orient = (selected.orientation || 'N') as 'N' | 'E' | 'S' | 'W';
              const orientLabels: Record<'N' | 'E' | 'S' | 'W', string> = {
                W: '⬅️ Kiri',
                E: '➡️ Kanan',
                S: '⬇️ Depan',
                N: '⬆️ Blkg',
              };
              badgeEl.textContent = orientLabels[orient] || orient;
            }
            const btnBehavior = document.getElementById('btn-transform-behavior');
            const behaviorLabel = document.getElementById('btn-transform-behavior-label');
            if (btnBehavior) {
              const isNpc = selected.kind === 'npc';
              btnBehavior.style.display = isNpc ? 'inline-flex' : 'none';
              if (behaviorLabel) {
                const bMode = selected.behavior || 'stationary';
                behaviorLabel.textContent =
                  bMode === 'patrol_small' ? 'Patroli' : bMode === 'look_around' ? 'Menoleh' : 'Diam';
              }
            }
            if (engine) {
              const pt = engine.worldToScreen((selected.x + selected.w / 2) * 16, selected.y * 16);
              const isTopClipped = pt.y < 85;
              const topPos = isTopClipped ? pt.y + 36 : pt.y - 14;
              transformBubble.style.left = `${Math.round(pt.x)}px`;
              transformBubble.style.top = `${Math.round(topPos)}px`;
            }
          } else {
            transformBubble.classList.add('hidden');
            transformBubble.style.display = 'none';
          }
        }

        // Update Mini-Map Radar widget & Zoom Badge
        const zoomResetLabel = document.getElementById('btn-minimap-zoom-reset');
        if (zoomResetLabel && engine) {
          zoomResetLabel.textContent = `${Math.round(engine.getZoom() * 100)}%`;
        }
        if (minimapWidget) {
          if ((isEnabled && !isPlay && !isZen) || isVisitorRadarOpen()) {
            minimapWidget.classList.remove('hidden');
            minimapWidget.style.display = 'flex';
            if (minimapCanvas) {
              editor.renderMinimap(minimapCanvas);
            }
          } else {
            minimapWidget.classList.add('hidden');
            minimapWidget.style.display = 'none';
          }
        }

        if (editorStatus) {
          editorStatus.textContent = `Mode: ${toolLabelMap[tool] || tool}`;
        }
      };

      editor.subscribe(updateEditorUI);
      updateEditorUI();



      btnTransformRotLeft?.addEventListener('click', () => {
        editor.rotateSelectedDirection('left');
        sfx.select();
      });
      btnTransformRotRight?.addEventListener('click', () => {
        editor.rotateSelectedDirection('right');
        sfx.select();
      });
      btnTransformApply?.addEventListener('click', () => {
        editor.applySelectedTransform();
        sfx.heal();
      });
      btnTransformCancel?.addEventListener('click', () => {
        editor.cancelSelectedTransform();
        sfx.select();
      });

      document.getElementById('btn-transform-behavior')?.addEventListener('click', () => {
        const sel = editor.getSelectedBuilding();
        if (!sel) return;
        const next = townConfig.cycleBuildingBehavior(sel.id);
        sfx.select();
        if (next) {
          const textMap = {
            stationary: 'Diam (Stationary)',
            look_around: 'Menoleh Otomatis (Look Around)',
            patrol_small: 'Patroli Mikro (Micro-Patrol)',
          };
          showToast(`🐾 ${sel.name}: ${textMap[next]}`);
        }
      });

      // ─── 🧩 Prefab Blueprints Modal Handlers ───
      const prefabsModal = document.getElementById('town-editor-prefabs-modal') as HTMLDialogElement | null;
      const prefabsListEl = document.getElementById('town-prefabs-list');
      const prefabNameInput = document.getElementById('town-prefab-name-input') as HTMLInputElement | null;
      const prefabSelCount = document.getElementById('prefab-sel-count');

      const renderPrefabsList = () => {
        if (!prefabsListEl) return;
        const selCount = editor.getSelectedBuildings().length;
        if (prefabSelCount) prefabSelCount.textContent = String(selCount);
        const list = townConfig.getPrefabs();
        prefabsListEl.innerHTML = '';
        if (list.length === 0) {
          prefabsListEl.innerHTML =
            '<p class="text-xs font-mono text-slate-400 p-2 rounded border border-dashed border-slate-700">Belum ada Prefab tersimpan. Pilih 1 atau beberapa objek (Shift+Drag) lalu simpan sebagai Prefab.</p>';
          return;
        }
        for (const p of list) {
          const row = document.createElement('div');
          row.className = 'flex items-center justify-between gap-2 p-2 rounded border border-slate-700 bg-slate-900/90 text-xs font-mono';
          const info = document.createElement('div');
          info.className = 'min-w-0';
          info.innerHTML = `<div class="font-bold text-amber-300 truncate">${p.name}</div><div class="text-[10px] text-slate-400">${p.items.length} objek · ${p.createdAt}</div>`;
          const btns = document.createElement('div');
          btns.className = 'flex gap-1.5 shrink-0';

          const placeBtn = document.createElement('button');
          placeBtn.type = 'button';
          placeBtn.className = 'town-editor-btn town-editor-btn--save';
          placeBtn.textContent = '📌 Tempel';
          placeBtn.onclick = () => {
            const camTileX = engine ? Math.max(1, Math.min(40, Math.round(engine.getCameraX() / 16))) : 18;
            const camTileY = engine ? Math.max(1, Math.min(58, Math.round(engine.getCameraY() / 16))) : 25;
            const placed = townConfig.placePrefab(p.id, camTileX, camTileY);
            sfx.heal();
            prefabsModal?.close();
            showToast(`🧩 Prefab "${p.name}" (${placed.length} objek) ditempel di (${camTileX}, ${camTileY})!`);
          };

          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'town-editor-btn town-editor-btn--delete';
          delBtn.textContent = '🗑️';
          delBtn.onclick = () => {
            townConfig.deletePrefab(p.id);
            sfx.select();
            renderPrefabsList();
          };

          btns.appendChild(placeBtn);
          btns.appendChild(delBtn);
          row.appendChild(info);
          row.appendChild(btns);
          prefabsListEl.appendChild(row);
        }
      };

      document.getElementById('btn-editor-prefabs')?.addEventListener('click', () => {
        toggleMorePopover(false);
        renderPrefabsList();
        prefabsModal?.showModal();
        sfx.select();
      });
      document.getElementById('btn-close-prefabs-modal')?.addEventListener('click', () => prefabsModal?.close());
      document.getElementById('btn-save-selection-prefab')?.addEventListener('click', () => {
        const selectedList = editor.getSelectedBuildings();
        if (selectedList.length === 0) {
          showToast('⚠️ Pilih minimal 1 objek terlebih dahulu sebelum menyimpan Prefab!');
          return;
        }
        const saved = townConfig.savePrefab(
          prefabNameInput?.value || `Blueprint ${townConfig.getPrefabs().length + 1}`,
          selectedList.map((b) => b.id)
        );
        if (saved) {
          if (prefabNameInput) prefabNameInput.value = '';
          sfx.heal();
          renderPrefabsList();
          showToast(`🧩 Prefab "${saved.name}" tersimpan!`);
        }
      });

      // ─── 🕒 Layout Snapshots & Diff Modal Handlers ───
      const snapshotsModal = document.getElementById('town-editor-snapshots-modal') as HTMLDialogElement | null;
      const diffBox = document.getElementById('town-diff-summary-box');
      const snapListEl = document.getElementById('town-snapshots-list');
      const SNAPSHOT_SLOTS = ['A', 'B', 'C', 'D', 'E'];

      const renderSnapshotsModal = () => {
        const diff = townConfig.getDiffSummaryVsCanonical();
        if (diffBox) {
          diffBox.innerHTML = `
            <div class="font-bold text-amber-300 mb-1">Perbandingan Layout Saat Ini vs Canonical JSON:</div>
            <div class="flex flex-wrap gap-3 text-[11px]">
              <span class="text-emerald-300">+${diff.added} Baru</span>
              <span class="text-sky-300">~${diff.moved} Diubah/Digeser</span>
              <span class="text-rose-300">-${diff.removed} Terhapus</span>
              <span class="text-purple-300">${diff.tileDiff} Tile Diubah</span>
            </div>
          `;
        }
        if (!snapListEl) return;
        const savedList = townConfig.getNamedSnapshots();
        snapListEl.innerHTML = '';
        for (const slot of SNAPSHOT_SLOTS) {
          const found = savedList.find((s) => s.slot === slot);
          const row = document.createElement('div');
          row.className = 'flex items-center justify-between gap-2 p-2 rounded border border-slate-700 bg-slate-900/90 text-xs font-mono';
          const info = document.createElement('div');
          info.innerHTML = found
            ? `<div class="font-bold text-white">Slot ${slot} · ${found.savedAt}</div><div class="text-[10px] text-slate-400">${found.buildingCount} objek · ${found.tileCount} custom tile</div>`
            : `<div class="text-slate-400">Slot ${slot} (Kosong)</div>`;

          const btns = document.createElement('div');
          btns.className = 'flex gap-1.5 shrink-0';

          const saveSlotBtn = document.createElement('button');
          saveSlotBtn.type = 'button';
          saveSlotBtn.className = 'town-editor-btn town-editor-btn--save';
          saveSlotBtn.textContent = '💾 Simpan';
          saveSlotBtn.onclick = () => {
            townConfig.saveNamedSnapshot(slot);
            sfx.heal();
            renderSnapshotsModal();
            showToast(`🕒 Snapshot tersimpan di Slot ${slot}!`);
          };
          btns.appendChild(saveSlotBtn);

          if (found) {
            const loadSlotBtn = document.createElement('button');
            loadSlotBtn.type = 'button';
            loadSlotBtn.className = 'town-editor-btn';
            loadSlotBtn.textContent = '↩️ Pulihkan';
            loadSlotBtn.onclick = () => {
              townConfig.loadNamedSnapshot(slot);
              sfx.confirm();
              snapshotsModal?.close();
              showToast(`↩️ Layout dipulihkan dari Slot ${slot}! (Bisa di-Undo Ctrl+Z)`);
            };
            btns.appendChild(loadSlotBtn);
          }

          row.appendChild(info);
          row.appendChild(btns);
          snapListEl.appendChild(row);
        }
      };

      document.getElementById('btn-editor-snapshots')?.addEventListener('click', () => {
        toggleMorePopover(false);
        renderSnapshotsModal();
        snapshotsModal?.showModal();
        sfx.select();
      });
      document.getElementById('btn-close-snapshots-modal')?.addEventListener('click', () => snapshotsModal?.close());

      btnEditorValidate?.addEventListener('click', () => {
        editor.validateReachability();
        sfx.select();
      });



      let isMinimapDragging = false;
      const handleMinimapPan = (e: MouseEvent) => {
        if (!minimapCanvas) return;
        const rect = minimapCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        editor.panFromMinimap(mx, my, rect.width);
        editor.renderMinimap(minimapCanvas);
      };

      minimapCanvas?.addEventListener('mousedown', (e) => {
        if (!editor.isEnabled()) return;
        isMinimapDragging = true;
        handleMinimapPan(e);
      });
      window.addEventListener('mousemove', (e) => {
        if (isMinimapDragging) {
          handleMinimapPan(e);
        }
      });
      window.addEventListener('mouseup', () => {
        isMinimapDragging = false;
      });

      btnEditorUndo?.addEventListener('click', () => {
        if (townConfig.undo()) {
          sfx.select();
          showToast('↩ Perubahan dibatalkan (Undo)');
          engine?.invalidateBackgroundCanvas();
          engine?.wake();
        }
      });

      btnEditorRedo?.addEventListener('click', () => {
        if (townConfig.redo()) {
          sfx.select();
          showToast('↪ Perubahan diterapkan kembali (Redo)');
          engine?.invalidateBackgroundCanvas();
          engine?.wake();
        }
      });

      btnEditorMinimize?.addEventListener('click', () => {
        isMinimized = !isMinimized;
        updateEditorUI();
        if (iconEditorMinimize) {
          iconEditorMinimize.textContent = isMinimized ? '🔼' : '🔽';
        }
        sfx.select();
      });

      const closeEditor = () => {
        if (editor.isEnabled()) {
          editor.toggleEnabled();
          sfx.select();
        }
      };

      btnEditorClose?.addEventListener('click', closeEditor);

      toolBtnMove?.addEventListener('click', () => {
        editor.setTool('move');
        sfx.select();
      });

      toolBtnBrush?.addEventListener('click', () => {
        editor.setTool('brush');
        sfx.select();
      });

      toolBtnErase?.addEventListener('click', () => {
        editor.setTool('erase');
        sfx.select();
      });

      toolBtnDeleteObject?.addEventListener('click', () => {
        editor.setTool('delete_object');
        sfx.select();
      });

      toolBtnLine?.addEventListener('click', () => {
        editor.setTool('line');
        sfx.select();
      });

      toolBtnRect?.addEventListener('click', () => {
        editor.setTool('rect');
        sfx.select();
      });

      toolBtnBucket?.addEventListener('click', () => {
        editor.setTool('bucket');
        sfx.select();
      });

      toolBtnEyedropper?.addEventListener('click', () => {
        editor.setTool('eyedropper');
        sfx.select();
      });

      toolBtnCollision?.addEventListener('click', () => {
        editor.setTool('collision');
        sfx.select();
      });

      toolBtnPlaytest?.addEventListener('click', () => {
        editor.togglePlaytest();
        sfx.select();
      });

      toolBtnGrid?.addEventListener('click', () => {
        editor.toggleGrid();
        sfx.select();
      });

      btnBrush1?.addEventListener('click', () => {
        editor.setBrushSize(1);
        sfx.select();
      });

      btnBrush2?.addEventListener('click', () => {
        editor.setBrushSize(2);
        sfx.select();
      });

      btnBrush3?.addEventListener('click', () => {
        editor.setBrushSize(3);
        sfx.select();
      });

      btnExitPlaytest?.addEventListener('click', () => {
        editor.togglePlaytest();
        sfx.select();
      });

      window.addEventListener('town:playtest-toggle', ((e: CustomEvent<boolean>) => {
        const isPlay = e.detail;
        if (isPlay) {
          if (editorToolbar) editorToolbar.style.display = 'none';
          if (playtestBar) {
            playtestBar.classList.remove('hidden');
            playtestBar.style.display = 'flex';
          }
        } else {
          if (playtestBar) {
            playtestBar.classList.add('hidden');
            playtestBar.style.display = 'none';
          }
        }
        updateEditorUI();
      }) as EventListener);

      tileBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const tile = btn.getAttribute('data-tile') as TileTypeKey;
          if (tile) {
            editor.setBrushTile(tile);
            sfx.select();
          }
        });
      });

      btnEditorSave?.addEventListener('click', async () => {
        await editor.save();
        sfx.heal();
      });

      btnEditorExport?.addEventListener('click', () => {
        toggleMorePopover(false);
        if (codeOutput && exportModal) {
          codeOutput.textContent = townConfig.exportCode();
          exportModal.showModal();
          sfx.select();
        }
      });

      btnCloseExportModal?.addEventListener('click', () => {
        exportModal?.close();
      });

      btnCopyCode?.addEventListener('click', async () => {
        if (codeOutput?.textContent) {
          try {
            await navigator.clipboard.writeText(codeOutput.textContent);
            showToast('✓ Kode berhasil disalin ke clipboard!');
            sfx.heal();
          } catch {
            showToast('Pilih dan salin teks secara manual (Ctrl+C).');
          }
        }
      });

      btnEditorReset?.addEventListener('click', () => {
        toggleMorePopover(false);
        if (window.confirm('Kembalikan semua posisi bangunan & petak kustom ke tata letak awal?')) {
          townConfig.resetToDefaults();
          sfx.select();
          showToast('✓ Tata letak kota telah direset ke default.');
        }
      });
}
