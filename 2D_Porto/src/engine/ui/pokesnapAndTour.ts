import type { TownEngine } from '../TownEngine';
import { sfx } from '../../game/sfx';
import { navigateWithMapTransition } from '../../lib/mapTransition';

export interface PokeSnapAndTourDeps {
  engine: TownEngine | null;
  canvas: HTMLCanvasElement;
  showToast: (msg: string) => void;
  closeBurgerMenu: () => void;
  hideBubble: () => void;
}

export function initPokeSnapAndTourUi(deps: PokeSnapAndTourDeps): void {
  const { engine, canvas, showToast, closeBurgerMenu, hideBubble } = deps;

  // ─── 🎬 Guided Auto-Pilot Tour Controller ───
  const tourBanner = document.getElementById('town-tour-banner');
  const tourIconEl = document.getElementById('tour-stop-icon');
  const tourStepBadge = document.getElementById('tour-step-badge');
  const tourTitleEl = document.getElementById('tour-stop-title');
  const tourDescEl = document.getElementById('tour-stop-desc');
  const tourProgressEl = document.getElementById('tour-progress-bar') as HTMLElement | null;
  const tourVisitLink = document.getElementById('tour-visit-link') as HTMLAnchorElement | null;
  const tourNextBtn = document.getElementById('tour-next-btn');
  const tourStopBtn = document.getElementById('tour-stop-btn');

  const TOUR_STOPS = [
    {
      x: 42,
      y: 12,
      icon: '💻',
      title: 'Dev Center · Mission Control',
      desc: 'AeroScan YOLOv11-OBB (1.8ms TensorRT), FoodLink Cloud-Native (Kafka/PostGIS), Stack Radar & Timeline.',
      route: '/dev',
    },
    {
      x: 53,
      y: 8,
      icon: '🔬',
      title: 'Research Lab · Applied AI',
      desc: 'Skripsi deteksi spam judi online 99.56% F1, Computer Vision OMR, dan AI Micro-Sandbox interaktif.',
      route: '/lab',
    },
    {
      x: 65,
      y: 9,
      icon: '🏢',
      title: 'Tech Tower · Robotics, IoT & Cloud',
      desc: 'Koordinator Asisten Lab Robotik, ESP32 RC Tank, dan sertifikasi jaringan Huawei HCIA-Security.',
      route: '/tower',
    },
    {
      x: 42,
      y: 29,
      icon: '👑',
      title: 'Hall of Legends · Tech Guardians',
      desc: 'Koridor 35+ Pokémon Legendaris yang memetakan pilar rekayasa sistem, cloud, dan AI Zulfan.',
      route: '',
    },
    {
      x: 64,
      y: 18,
      icon: '🤖',
      title: 'Poké Center & AI Digital Twin',
      desc: 'Tanya jawab interaktif seputar pengalaman Zulfan atau buka Job-Fit Analyzer & unduh CV PDF.',
      route: '/twin',
    },
  ];

  let tourActive = false;
  let tourIdx = 0;
  let tourTimer: number | null = null;

  const stopAutoTour = (silent = false) => {
    if (!tourActive) return;
    tourActive = false;
    if (tourTimer !== null) {
      window.clearTimeout(tourTimer);
      tourTimer = null;
    }
    tourBanner?.classList.add('hidden');
    if (!silent) {
      showToast('⏹️ Tur otomatis selesai. Selamat menjelajah bebas!');
    }
  };

  const runTourStep = (idx: number) => {
    if (!tourActive || !engine) return;
    if (idx >= TOUR_STOPS.length) {
      sfx.catchSuccess();
      stopAutoTour(true);
      showToast('🎉 Tur 5 landmark selesai! Buka 🎯 Job Fit atau /twin untuk info lanjut.');
      return;
    }
    tourIdx = idx;
    const stop = TOUR_STOPS[idx];
    if (tourIconEl) tourIconEl.textContent = stop.icon;
    if (tourStepBadge) tourStepBadge.textContent = `STOP ${idx + 1}/${TOUR_STOPS.length}`;
    if (tourTitleEl) tourTitleEl.textContent = stop.title;
    if (tourDescEl) tourDescEl.textContent = stop.desc;
    if (tourProgressEl) tourProgressEl.style.width = `${Math.round(((idx + 1) / TOUR_STOPS.length) * 100)}%`;
    if (tourVisitLink) {
      if (stop.route) {
        tourVisitLink.href = stop.route;
        tourVisitLink.classList.remove('hidden');
      } else {
        tourVisitLink.classList.add('hidden');
      }
    }

    engine.flyTo(stop.x, stop.y, stop.title);
    if (tourTimer !== null) window.clearTimeout(tourTimer);
    tourTimer = window.setTimeout(() => runTourStep(tourIdx + 1), 8000);
  };

  const startAutoTour = () => {
    if (!engine || engine.getScene() !== 'town') {
      sessionStorage.setItem('town:start_tour', '1');
      navigateWithMapTransition('/');
      return;
    }
    if (!engine.getActiveFollower()) {
      engine.setActiveFollower('lugia', false);
    }
    if (!engine.isRiding()) {
      engine.setPokeRide(true);
    }
    tourActive = true;
    tourBanner?.classList.remove('hidden');
    sfx.fly();
    showToast('🎬 Guided Auto-Tour dimulai! Tekan WASD / klik peta kapan saja untuk berhenti.');
    runTourStep(0);
  };

  tourNextBtn?.addEventListener('click', () => {
    sfx.select();
    if (tourActive) runTourStep(tourIdx + 1);
  });
  tourStopBtn?.addEventListener('click', () => {
    sfx.select();
    stopAutoTour(false);
  });

  window.addEventListener('town:start-tour', startAutoTour);

  // Auto-cancel tour if visitor takes manual control via keyboard or canvas click
  window.addEventListener('keydown', (e) => {
    if (!tourActive) return;
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
      stopAutoTour(false);
    }
  });
  canvas?.addEventListener('pointerdown', () => {
    if (tourActive) stopAutoTour(false);
  });

  if (engine && sessionStorage.getItem('town:start_tour') === '1') {
    sessionStorage.removeItem('town:start_tour');
    window.setTimeout(startAutoTour, 450);
  }

  // ─── 🌟 Legendary Resonance Pill & Hotkey (G) ───
  const resonancePill = document.getElementById('town-resonance-pill');
  const resonanceText = document.getElementById('town-resonance-text');

  const updateResonancePill = (res: { label: string; followerId: string; nearbyId: string } | null) => {
    if (!resonancePill || !resonanceText) return;
    if (res) {
      resonanceText.textContent = `${res.label}: ${res.followerId.toUpperCase()} × ${res.nearbyId.toUpperCase()}`;
      resonancePill.classList.remove('hidden');
    } else {
      resonancePill.classList.add('hidden');
    }
  };

  const fireResonanceBurst = () => {
    if (!engine) return;
    const fired = engine.triggerResonanceBurst();
    if (fired) {
      showToast(`🌟 ${fired.label}: ${fired.comboTitle}`);
    } else {
      showToast('💡 Dekati Pokémon pasangan dengan Follower aktif untuk memicu Resonance Burst!');
    }
  };

  window.addEventListener('town:resonance-available', (e: Event) => {
    updateResonancePill((e as CustomEvent).detail);
  });
  window.addEventListener('town:trigger-resonance', fireResonanceBurst);
  resonancePill?.addEventListener('click', fireResonanceBurst);

  // ─── 📸 PokéSnap Studio (In-Game Photo Mode & Postcard PNG) ───
  const snapTownSection = document.querySelector<HTMLElement>('[data-town]');
  const pokesnapDock = document.getElementById('town-pokesnap-dock');
  const burgerItemPokesnap = document.getElementById('burger-item-pokesnap');
  const pokesnapCloseBtn = document.getElementById('pokesnap-close-btn');
  const pokesnapPoseBtn = document.getElementById('pokesnap-pose-btn');
  const pokesnapZoomBtn = document.getElementById('pokesnap-zoom-btn');
  const pokesnapCaptureBtn = document.getElementById('pokesnap-capture-btn');
  const pokesnapFilterBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.pokesnap-filter-btn'));

  let isPokeSnapOpen = false;
  let activeSnapFilter = 'normal';

  const FILTER_CSS_MAP: Record<string, string> = {
    normal: 'none',
    gameboy: 'grayscale(1) sepia(1) hue-rotate(55deg) saturate(2.1) contrast(1.15)',
    crt: 'contrast(1.18) saturate(1.25) brightness(0.96)',
    sunset: 'sepia(0.38) saturate(1.45) contrast(1.08) hue-rotate(-8deg)',
    cyber: 'contrast(1.22) saturate(1.6) hue-rotate(15deg)',
  };

  const applySnapFilterPreview = () => {
    if (!canvas) return;
    canvas.style.filter = isPokeSnapOpen ? (FILTER_CSS_MAP[activeSnapFilter] || 'none') : '';
  };

  const togglePokeSnap = (force?: boolean) => {
    isPokeSnapOpen = typeof force === 'boolean' ? force : !isPokeSnapOpen;
    if (snapTownSection) {
      if (isPokeSnapOpen) snapTownSection.setAttribute('data-pokesnap', 'true');
      else snapTownSection.removeAttribute('data-pokesnap');
    }
    pokesnapDock?.classList.toggle('hidden', !isPokeSnapOpen);
    if (isPokeSnapOpen) {
      closeBurgerMenu();
      hideBubble();
      sfx.select();
      showToast('📸 PokéSnap Studio aktif! Atur filter lalu klik Jepret PNG.');
    } else {
      sfx.select();
    }
    applySnapFilterPreview();
  };

  burgerItemPokesnap?.addEventListener('click', () => togglePokeSnap(true));
  pokesnapCloseBtn?.addEventListener('click', () => togglePokeSnap(false));
  window.addEventListener('town:toggle-pokesnap', () => togglePokeSnap());

  pokesnapFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeSnapFilter = btn.dataset.snapFilter || 'normal';
      sfx.select();
      pokesnapFilterBtns.forEach((b) => {
        const active = b === btn;
        b.className = active
          ? 'pokesnap-filter-btn px-2 py-1 rounded-lg border border-amber-400 bg-amber-400/20 text-amber-200 font-mono text-[10px] font-bold cursor-pointer'
          : 'pokesnap-filter-btn px-2 py-1 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 font-mono text-[10px] cursor-pointer';
      });
      applySnapFilterPreview();
    });
  });

  pokesnapPoseBtn?.addEventListener('click', () => {
    if (!engine) return;
    const res = engine.getActiveResonance();
    if (res) {
      fireResonanceBurst();
      return;
    }
    const follower = engine.getActiveFollower();
    if (follower) {
      engine.triggerSignatureMove(follower.id);
    } else {
      engine.setActiveFollower('lugia', false);
      engine.triggerSignatureMove('lugia');
    }
    sfx.confirm();
  });

  pokesnapZoomBtn?.addEventListener('click', () => {
    if (!engine) return;
    sfx.select();
    const nextZ = engine.getZoom() >= 3.2 ? 2 : engine.getZoom() + 0.6;
    engine.setZoom(nextZ);
  });

  pokesnapCaptureBtn?.addEventListener('click', () => {
    if (!canvas) return;
    sfx.catchSuccess();
    const pad = 18;
    const footerH = 44;
    const out = document.createElement('canvas');
    out.width = canvas.width + pad * 2;
    out.height = canvas.height + pad + footerH;
    const octx = out.getContext('2d');
    if (!octx) return;

    // Polaroid retro frame
    octx.fillStyle = '#fcf8ef';
    octx.fillRect(0, 0, out.width, out.height);
    octx.strokeStyle = '#1c1726';
    octx.lineWidth = 4;
    octx.strokeRect(2, 2, out.width - 4, out.height - 4);

    octx.save();
    octx.filter = FILTER_CSS_MAP[activeSnapFilter] || 'none';
    octx.drawImage(canvas, pad, pad);
    octx.restore();

    // Optional CRT scanline overlay for CRT / Cyber modes
    if (activeSnapFilter === 'crt' || activeSnapFilter === 'cyber') {
      octx.fillStyle = activeSnapFilter === 'crt' ? 'rgba(0,0,0,0.22)' : 'rgba(56,189,248,0.08)';
      for (let y = pad; y < pad + canvas.height; y += 4) {
        octx.fillRect(pad, y, canvas.width, 1.5);
      }
    }

    octx.strokeStyle = '#1c1726';
    octx.lineWidth = 2;
    octx.strokeRect(pad, pad, canvas.width, canvas.height);

    // Postcard caption
    const partner = engine?.getActiveFollower();
    const partnerNote = partner ? ` · ${partner.icon} Partner: ${partner.name}` : '';
    octx.fillStyle = '#1c1726';
    octx.font = 'bold 14px monospace';
    octx.fillText(`Zulfan's Town · mzulfan.dev${partnerNote}`, pad, canvas.height + pad + 26);

    const link = document.createElement('a');
    link.download = `zulfan-town-pokesnap-${activeSnapFilter}.png`;
    link.href = out.toDataURL('image/png');
    link.click();
    showToast('📸 Postcard PNG berhasil diunduh!');
  });

  // Global hotkeys G (Resonance Burst) & O (PokéSnap Studio)
  window.addEventListener('keydown', (e) => {
    const tag = (document.activeElement as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'g') {
      if (engine?.getActiveResonance()) {
        e.preventDefault();
        fireResonanceBurst();
      }
    } else if (k === 'o') {
      e.preventDefault();
      togglePokeSnap();
    } else if (e.key === 'Escape' && isPokeSnapOpen) {
      togglePokeSnap(false);
    }
  });
}
