/* ==========================================================================
   ds / ds.js
   Vanilla behaviour for the design system (all generic; there is no
   per-page script). Self-initialising from classes and data attributes;
   any number of instances per page. Documented in docs/ (one page per
   component); COMPONENTS.md is generated from it.

   Modules: galleries (paddles), highlights (timed dot nav), tab galleries,
   modals, FAQ accordion, inline video UI + on-screen playback, HLS streams
   (data-hls), video art direction (<source media>, data-poster-small),
   local nav, in-page anchor scrolling, scroll reveal,
   work-index filter, code-block tab stops.

   ?shot in the URL = static mode (no reveal, no autoplay) for screenshots.
   ?theme=light or ?theme=dark = data-theme on <html>, set first thing
   (no parameter, no change).
   Hashes that are not element ids (e.g. #shot-y=600) are ignored.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  // ?theme=light | ?theme=dark sets data-theme on <html> before anything else
  // runs, so before first paint as far as a deferred script allows. No
  // parameter (or any other value) leaves the page as written.
  try {
    var themeParam = new URLSearchParams(location.search).get('theme');
    if (themeParam === 'light' || themeParam === 'dark') root.setAttribute('data-theme', themeParam);
  } catch (e) { /* no URLSearchParams: leave the page as written */ }
  root.classList.add('js');

  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function reduced() { return !!mqReduce.matches; }

  var STATIC = false;
  try { STATIC = new URLSearchParams(location.search).has('shot'); } catch (e) { STATIC = false; }
  var hasIO = 'IntersectionObserver' in window;
  var hasRO = 'ResizeObserver' in window;

  // run fn at most once per frame (scroll / resize fallbacks)
  function perFrame(fn) {
    var r = 0;
    return function () { if (r) return; r = requestAnimationFrame(function () { r = 0; fn(); }); };
  }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function byId(id) {
    if (!id) return null;
    try { return doc.getElementById(decodeURIComponent(id)); } catch (e) { return doc.getElementById(id); }
  }
  function behavior() { return reduced() ? 'auto' : 'smooth'; }
  function safePlay(v) {
    v._wantPlay = true;      // kept while a stream loads or falls back (hlsResume)
    // a data-hls video attaches its stream on the first play; until hls.js is
    // ready, play() would start the fallback <source> instead, so wait
    if (hlsUrl(v)) {
      if (!v._hlsState) attachHls(v);
      if (v._hlsState === 'loading') return;
    }
    try { var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* no source, autoplay blocked */ }
  }
  var uid = 0;
  function nextId(prefix) { uid += 1; return prefix + '-' + uid; }

  var ICON = {
    prev: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M21 11.5 14.5 18l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M15 11.5 21.5 18 15 24.5" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play36: '<svg class="icon-play" viewBox="0 0 36 36" aria-hidden="true"><path d="M14 11.9v12.2c0 .8.9 1.3 1.6.9l9.8-6.1c.6-.4.6-1.4 0-1.8l-9.8-6.1c-.7-.4-1.6.1-1.6.9z"/></svg>',
    pause36: '<svg class="icon-pause" viewBox="0 0 36 36" aria-hidden="true"><rect x="12.5" y="11.5" width="3.8" height="13" rx="1.3"/><rect x="19.7" y="11.5" width="3.8" height="13" rx="1.3"/></svg>',
    play56: '<svg class="icon-play" viewBox="0 0 56 56" aria-hidden="true"><path d="M23 20.4v15.2c0 1 1.1 1.6 1.9 1.1l12.2-7.6c.8-.5.8-1.7 0-2.2l-12.2-7.6c-.8-.5-1.9.1-1.9 1.1z"/></svg>',
    pause56: '<svg class="icon-pause" viewBox="0 0 56 56" aria-hidden="true"><rect x="20.5" y="20" width="4.6" height="16" rx="1.5"/><rect x="30.9" y="20" width="4.6" height="16" rx="1.5"/></svg>',
    replay56: '<svg class="icon-replay" viewBox="0 0 56 56" aria-hidden="true"><path d="M27.4 19.4H28a9.2 9.2 0 1 1-8.9 6.9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M22.4 19.4 28.2 15v8.8z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>',
    volume36: '<svg class="icon-volume" viewBox="0 0 36 36" aria-hidden="true"><path d="M9.5 14.5h3.6l5.4-4.6c.5-.4 1.3 0 1.3.6v15c0 .6-.8 1-1.3.6l-5.4-4.6H9.5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1z"/><path d="M23.2 14.4a5 5 0 0 1 0 7.2M26 11.6a9 9 0 0 1 0 12.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    muted36: '<svg class="icon-muted" viewBox="0 0 36 36" aria-hidden="true"><path d="M9.5 14.5h3.6l5.4-4.6c.5-.4 1.3 0 1.3.6v15c0 .6-.8 1-1.3.6l-5.4-4.6H9.5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1z"/><path d="M23.5 15.2l5.6 5.6M29.1 15.2l-5.6 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    cc36: '<svg class="icon-cc" viewBox="0 0 36 36" aria-hidden="true"><rect x="8.5" y="11" width="19" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.4 16.3a2.5 2.5 0 1 0 0 3.4M22.6 16.3a2.5 2.5 0 1 0 0 3.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    fs36: '<svg class="icon-fs" viewBox="0 0 36 36" aria-hidden="true"><path d="M10.5 15v-4.5H15M21 10.5h4.5V15M25.5 21v4.5H21M15 25.5h-4.5V21" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fsExit36: '<svg class="icon-fs-exit" viewBox="0 0 36 36" aria-hidden="true"><path d="M15 10.5V15h-4.5M25.5 15H21v-4.5M21 25.5V21h4.5M10.5 21H15v4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function ready(fn) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ------------------------------------------------------------------------
     Videos: play only on screen, inline play/pause control
     ------------------------------------------------------------------------ */
  var videos = [];
  var highlightLoops = [];   // each highlights' loop(), re-run when a modal opens or closes
  var videoIO = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.target.isConnected) { videoIO.unobserve(en.target); return; }
      en.target._onScreen = en.isIntersecting && en.intersectionRatio >= 0.2;
      evaluateVideo(en.target);
    });
  }, { threshold: [0, 0.2, 0.5] }) : null;

  function evaluateVideo(v) {
    if (v._managed) return;            // highlights drive their own videos
    var inactivePanel = v.closest('.tabgallery-panel') && !v.closest('.tabgallery-panel.is-active') &&
      v.closest('.tabgallery[data-ready]');
    var inClosedModal = v.closest('.modal') && !v.closest('.modal.is-open');
    var behindModal = openModal && !openModal.contains(v);
    var should = v._onScreen && !v._userPaused && !doc.hidden && !inactivePanel && !inClosedModal && !behindModal;
    if (should && v.paused) safePlay(v);
    else if (!should && !v.paused) v.pause();
  }

  function syncVideoButton(v) {
    var b = v._ui; if (!b) return;
    var paused = v.paused;
    b.setAttribute('data-state', paused ? 'paused' : 'playing');
    b.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
  }

  // the poster painted as the video's own background, framed like the video
  // (ds.css): WebKit hides a poster once a stream attaches, so until the
  // first frame the panel would show bare
  function posterBehind(v) {
    var p = v.getAttribute('poster');
    v.style.backgroundImage = p ? 'url("' + p.replace(/"/g, '%22') + '")' : '';
  }

  // data-start="<s>": the first play begins there, on the poster's frame, so a
  // poster taken mid-clip doesn't jump back to frame 0; loops then run whole.
  // hls.js gets it as startPosition (attachHls); files and native HLS seek once
  function startAt(v) { var s = parseFloat(v.getAttribute('data-start')); return s > 0 ? s : 0; }
  function initStart(v) {
    if (!startAt(v)) return;
    v.addEventListener('loadedmetadata', function () {
      if (v._startDone) return;
      v._startDone = true;
      if (v._hlsState === 'hlsjs') return;
      try { if (v.currentTime < startAt(v)) v.currentTime = Math.min(startAt(v), (v.duration || Infinity) - 0.05); } catch (e) {}
    });
  }

  // a video in a padded panel (.media-pad) is sized by its own pixels, which a
  // stream attaching resets in WebKit: the card flashed empty, then a 300px
  // default, then full size. Hold its box at the clip's ratio, fitted into the
  // panel and never past its own pixels, from width/height attributes, else
  // the poster's size, else the video's
  function padFit(v) {
    var box = v.parentElement;
    if (!box || !box.classList.contains('media-pad')) return;
    var r = 0, nw = 0;
    var fit = function () {
      if (!r) return;
      var cs = getComputedStyle(box);
      var w = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var h = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (w <= 0 || h <= 0) return;
      var vw = Math.min(w, h * r, nw || Infinity);
      v.style.width = vw + 'px';
      v.style.height = (vw / r) + 'px';
    };
    var set = function (w, h) { if (!r && w > 0 && h > 0) { r = w / h; nw = w; fit(); } };
    set(+v.getAttribute('width'), +v.getAttribute('height'));
    v.addEventListener('loadedmetadata', function () { set(v.videoWidth, v.videoHeight); });
    var p = v.getAttribute('poster');
    if (p && !r) { var im = new Image(); im.onload = function () { set(im.naturalWidth, im.naturalHeight); }; im.src = p; }
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(box);
    else window.addEventListener('resize', fit);
  }

  function initVideo(v) {
    if (v._init) return; v._init = true;
    posterBehind(v);
    padFit(v);
    initStart(v);
    if (v.hasAttribute('data-film')) {
      // a film with sound: native controls, no forced mute, no overlay button,
      // no viewport-driven playback. Plays when its modal opens, pauses on close.
      v._film = true;
      v.controls = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      if (v.hasAttribute('autoplay')) { v.removeAttribute('autoplay'); v.autoplay = false; }
      if (!v.hasAttribute('preload')) v.preload = hlsUrl(v) ? 'none' : 'metadata';
      // outside a modal nothing calls play, so the native controls need the stream now
      if (hlsUrl(v) && !v.closest('.modal')) attachHls(v);
      if (!v.hasAttribute('data-native-controls') && v.closest('.media')) {
        try { initFilmUI(v); } catch (err) {
          // never leave a film without controls: back to the browser's own
          console.warn('film controls', err);
          var broken = v.closest('.media').querySelector(':scope > .film-ui');
          if (broken) broken.remove();
          v.controls = true;
        }
      }
      return;
    }
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('muted', '');
    if (v.hasAttribute('autoplay')) { v.removeAttribute('autoplay'); v.autoplay = false; }
    if (!v.hasAttribute('preload')) v.preload = hlsUrl(v) ? 'none' : 'metadata';
    v._userPaused = reduced() || STATIC || v.hasAttribute('data-paused');
    v._onScreen = !hasIO;
    if (v.closest('[data-highlights]')) { v._managed = true; return; }

    var holder = v.closest('.media');
    if (holder && !v.hasAttribute('data-no-ui')) {
      var b = holder.querySelector(':scope > .media-ui');
      if (!b) {
        b = doc.createElement('button');
        b.type = 'button';
        b.className = 'media-ui';
        b.innerHTML = ICON.pause36 + ICON.play36;
        holder.appendChild(b);
      }
      v._ui = b;
      b.addEventListener('click', function () {
        if (v.paused) { v._userPaused = false; safePlay(v); }
        else { v._userPaused = true; v.pause(); }
      });
    }
    v.addEventListener('play', function () { syncVideoButton(v); });
    v.addEventListener('pause', function () { syncVideoButton(v); });
    v.addEventListener('ended', function () { syncVideoButton(v); });
    syncVideoButton(v);
    videos.push(v);
    if (videoIO) videoIO.observe(v); else evaluateVideo(v);
  }

  function evaluateAllVideos() { videos.forEach(evaluateVideo); }

  /* ------------------------------------------------------------------------
     Film controls: a video[data-film] in a .media gets ds controls with a
     mouse (no browser controls, so a paused film is never tinted); on touch,
     ds's start button over the poster, then the browser's own controls.
     data-native-controls keeps the browser's controls everywhere.
     ------------------------------------------------------------------------ */
  var mqFine = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : { matches: true };
  function filmStore(k, val) {
    try {
      if (val === undefined) return localStorage.getItem('ds-film-' + k);
      localStorage.setItem('ds-film-' + k, String(val));
    } catch (e) { /* storage blocked: settings last for the page only */ }
    return null;
  }
  function filmClock(s) {
    s = Math.max(0, Math.floor(s || 0));
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (x < 10 ? '0' : '') + x;
  }
  function filmSpoken(s) {
    s = Math.max(0, Math.floor(s || 0));
    var m = Math.floor(s / 60), x = s % 60;
    return (m ? m + ' min ' : '') + x + ' s';
  }
  function fsElement() { return doc.fullscreenElement || doc.webkitFullscreenElement || null; }
  function fsEnter(el, v) {
    var p;
    if (el.requestFullscreen) p = el.requestFullscreen();
    else if (el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    if (p && p.catch) p.catch(function () {});
  }
  function fsExit() {
    var p;
    if (doc.exitFullscreen) p = doc.exitFullscreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    if (p && p.catch) p.catch(function () {});
  }

  function initFilmUI(v) {
    var holder = v.closest('.media');
    if (!holder || holder.querySelector(':scope > .film-ui')) return;

    var ui = doc.createElement('div');
    ui.className = 'film-ui';
    ui.innerHTML =
      '<button class="film-center" type="button">' + ICON.play56 + ICON.replay56 + '</button>' +
      '<div class="film-spinner" aria-hidden="true"></div>' +
      '<div class="film-bar">' +
        '<button class="film-btn film-play" type="button">' + ICON.play36 + ICON.pause36 + '</button>' +
        '<span class="film-time film-elapsed" aria-hidden="true">0:00</span>' +
        '<div class="film-scrub"><input class="film-range" type="range" min="0" max="1000" step="1" value="0" aria-label="Seek"></div>' +
        '<span class="film-time film-left" aria-hidden="true">0:00</span>' +
        '<div class="film-vol">' +
          '<button class="film-btn film-mute" type="button">' + ICON.volume36 + ICON.muted36 + '</button>' +
          '<input class="film-range" type="range" min="0" max="100" step="1" value="100" aria-label="Volume">' +
        '</div>' +
        '<button class="film-btn film-cc" type="button" aria-label="Captions" aria-pressed="false" hidden>' + ICON.cc36 + '</button>' +
        '<button class="film-btn film-fs" type="button">' + ICON.fs36 + ICON.fsExit36 + '</button>' +
      '</div>' +
      '<div class="film-status" role="status"></div>';
    holder.appendChild(ui);

    var center = ui.querySelector('.film-center');
    var bar = ui.querySelector('.film-bar');
    var playBtn = ui.querySelector('.film-play');
    var elapsed = ui.querySelector('.film-elapsed');
    var left = ui.querySelector('.film-left');
    var scrub = ui.querySelector('.film-scrub .film-range');
    var muteBtn = ui.querySelector('.film-mute');
    var vol = ui.querySelector('.film-vol .film-range');
    var ccBtn = ui.querySelector('.film-cc');
    var fsBtn = ui.querySelector('.film-fs');
    var status = ui.querySelector('.film-status');

    var mode = '', started = false, active = false, overBar = false, dragging = false;
    var activeTimer = 0, loadTimer = 0, raf = 0;

    function dur() { return isFinite(v.duration) ? v.duration : 0; }
    function state() { return v.ended ? 'ended' : !v.paused ? 'playing' : started ? 'paused' : 'start'; }
    function step() { var d = dur(); return d >= 60 ? 10 : d >= 20 ? 5 : 1; }

    function paint() {
      var st = state();
      ui.setAttribute('data-state', st);
      var hideCenter = !(st === 'start' || st === 'ended');
      // the centre disc hides once playing: keep keyboard focus in the player, on Play/Pause
      if (hideCenter && doc.activeElement === center && mode === 'custom') playBtn.focus({ preventScroll: true });
      var focusIn = bar.contains(doc.activeElement);
      // the bar: whenever focus is in it (a focused control is never invisible), always while
      // paused, and while playing for 3 s after any activity or under the pointer
      var on = mode === 'custom' && (focusIn || st === 'paused' || (st === 'playing' && (active || overBar)));
      ui.setAttribute('data-bar', on ? 'on' : 'off');
      center.hidden = hideCenter;
      center.setAttribute('aria-label', st === 'ended' ? 'Replay film' : 'Play film');
      playBtn.setAttribute('aria-label', st === 'playing' ? 'Pause' : 'Play');
    }
    function paintTime() {
      var d = dur(), t = v.currentTime || 0, pos = d ? Math.min(1, t / d) : 0, buf = pos;
      for (var i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= t + 0.5 && v.buffered.end(i) >= t) { buf = d ? v.buffered.end(i) / d : 0; break; }
      }
      if (!dragging) scrub.value = Math.round(pos * 1000);
      scrub.style.setProperty('--pos', (pos * 100) + '%');
      scrub.style.setProperty('--buf', (Math.max(buf, pos) * 100) + '%');
      scrub.setAttribute('aria-valuetext', d ? filmSpoken(t) + ' of ' + filmSpoken(d) : filmSpoken(t));
      elapsed.textContent = filmClock(t);
      left.textContent = '-' + filmClock(d - t);
    }
    function paintVolume() {
      var level = v.muted ? 0 : Math.round(v.volume * 100);
      vol.value = level;
      vol.style.setProperty('--pos', level + '%');
      vol.style.setProperty('--buf', level + '%');
      vol.setAttribute('aria-valuetext', level + '%');
      if (v.muted || !v.volume) ui.setAttribute('data-muted', ''); else ui.removeAttribute('data-muted');
      muteBtn.setAttribute('aria-label', v.muted || !v.volume ? 'Unmute' : 'Mute');
    }
    function paintFs() {
      var on = fsElement() === holder;
      if (on) ui.setAttribute('data-fs', ''); else ui.removeAttribute('data-fs');
      fsBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    }
    function captionTrack() {
      for (var i = 0; i < v.textTracks.length; i++) {
        var k = v.textTracks[i].kind;
        if (k === 'captions' || k === 'subtitles') return v.textTracks[i];
      }
      return null;
    }
    function paintCaptions() {
      var tr = captionTrack();
      ccBtn.hidden = !tr;
      ccBtn.setAttribute('aria-pressed', tr && tr.mode === 'showing' ? 'true' : 'false');
    }

    function poke() {
      active = true;
      clearTimeout(activeTimer);
      activeTimer = setTimeout(function () { active = false; paint(); }, 3000);
      paint();
    }
    function play() {
      if (v.ended) { try { v.currentTime = 0; } catch (e) {} }
      v._userPaused = false;
      safePlay(v);
    }
    function toggle() {
      if (v.paused || v.ended) play(); else { v._userPaused = true; v._wantPlay = false; v.pause(); }
    }
    function seekBy(s) {
      var d = dur(); if (!d) return;
      v.currentTime = Math.max(0, Math.min(d, (v.currentTime || 0) + s));
      paintTime();
    }
    function setVolume(level) {
      level = Math.round(Math.max(0, Math.min(1, level || 0)) * 100) / 100;
      v.volume = level;
      v.muted = level === 0;
    }
    function nudgeVolume(by) { setVolume((v.muted ? 0 : v.volume) + by); }
    function toggleMute() {
      if (v.muted || !v.volume) { if (!v.volume) v.volume = 0.5; v.muted = false; }
      else v.muted = true;
    }
    function toggleCaptions() {
      var tr = captionTrack(); if (!tr) return;
      tr.mode = tr.mode === 'showing' ? 'hidden' : 'showing';
      paintCaptions();
    }
    function toggleFs() { if (fsElement() === holder) fsExit(); else fsEnter(holder, v); }
    function tick() {
      paintTime();
      unstick();
      raf = v.paused ? 0 : requestAnimationFrame(tick);
    }
    // the spinner shows only while playback is really held up: 'stalled' (an idle download)
    // and 'waiting' can fire while a buffered film plays on, with no 'playing' to follow
    function held() { return !v.paused && !v.ended && (v.seeking || v.readyState < 3); }
    function unstick() { if (ui.hasAttribute('data-loading') && !held()) setLoading(false); }
    function setLoading(on) {
      clearTimeout(loadTimer);
      if (on) {
        loadTimer = setTimeout(function () {
          if (!held()) return;
          ui.setAttribute('data-loading', ''); status.textContent = 'Loading';
        }, 500);
      } else if (ui.hasAttribute('data-loading')) {
        ui.removeAttribute('data-loading');
        status.textContent = '';
      }
    }

    // custom: ds controls; touch: ds's start button, then the browser's controls
    function setMode() {
      mode = mqFine.matches ? 'custom' : 'touch';
      ui.setAttribute('data-mode', mode);
      var native = mode === 'touch' && started;
      v.controls = native;
      ui.hidden = native;
      if (mode === 'custom' && !v.paused && !raf) raf = requestAnimationFrame(tick);
      paint();
    }

    // saved volume and mute (the first play is unmuted unless the viewer muted last time)
    var savedVol = parseFloat(filmStore('volume'));
    if (isFinite(savedVol)) v.volume = Math.max(0, Math.min(1, savedVol));
    if (filmStore('muted') === '1') v.muted = true;

    center.addEventListener('click', play);
    playBtn.addEventListener('click', toggle);
    muteBtn.addEventListener('click', toggleMute);
    ccBtn.addEventListener('click', toggleCaptions);
    fsBtn.addEventListener('click', toggleFs);
    // a click on the picture: play from the start screen, then play / pause
    ui.addEventListener('click', function (e) {
      if (e.target !== ui || mode !== 'custom' || ui.hasAttribute('data-error')) return;
      if (started || !v.paused) toggle(); else play();   // a second click before 'play' arrives pauses
    });
    ui.addEventListener('dblclick', function (e) { if (e.target === ui && mode === 'custom') toggleFs(); });

    scrub.addEventListener('pointerdown', function () { dragging = true; });
    scrub.addEventListener('input', function () {
      var d = dur(); if (!d) return;
      v.currentTime = scrub.value / 1000 * d;
      paintTime();
    });
    scrub.addEventListener('change', function () { dragging = false; paintTime(); });
    var endDrag = function () { if (dragging) { dragging = false; paintTime(); } };
    doc.addEventListener('pointerup', endDrag);
    doc.addEventListener('pointercancel', endDrag);
    vol.addEventListener('input', function () { setVolume(vol.value / 100); });

    holder.addEventListener('pointermove', function (e) { if (mode === 'custom' && e.pointerType !== 'touch') poke(); });
    holder.addEventListener('pointerleave', function () { clearTimeout(activeTimer); active = false; paint(); });
    bar.addEventListener('pointerenter', function () { overBar = true; paint(); });
    bar.addEventListener('pointerleave', function () { overBar = false; paint(); });
    holder.addEventListener('focusin', function () { if (mode === 'custom') poke(); });
    holder.addEventListener('focusout', function () { setTimeout(paint, 100); });

    // keys act while focus is in the player, or on the open modal around it
    doc.addEventListener('keydown', function (e) {
      if (mode !== 'custom' || !v.isConnected || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target, m = v.closest('.modal');
      var inside = t instanceof Node && holder.contains(t);
      if (!inside) {
        if (!m || openModal !== m || !(t === m || t === doc.body || (t.classList && t.classList.contains('modal-sheet')))) return;
        if (m.querySelector('.media > .film-ui') !== ui) return;   // several films: the first one takes the keys
      }
      var k = e.key, onButton = t.tagName === 'BUTTON', onVol = t === vol, onScrub = t === scrub;
      if (k === ' ' || k === 'k' || k === 'K') {
        if (onButton && k === ' ') return;
        e.preventDefault(); if (!e.repeat) toggle();
      } else if (k === 'ArrowLeft' || k === 'ArrowRight') {
        if (onVol) return;
        e.preventDefault(); seekBy(k === 'ArrowLeft' ? -step() : step());
      } else if (k === 'ArrowUp' || k === 'ArrowDown') {
        if (onVol) return;
        e.preventDefault(); nudgeVolume(k === 'ArrowUp' ? 0.1 : -0.1);
      } else if (k === 'm' || k === 'M') { e.preventDefault(); toggleMute(); }
      else if (k === 'f' || k === 'F') { e.preventDefault(); toggleFs(); }
      else if (k === 'c' || k === 'C') { e.preventDefault(); toggleCaptions(); }
      else return;
      poke();
    });

    v.addEventListener('play', function () {
      started = true;
      if (mode === 'touch') { setMode(); return; }
      if (!raf) raf = requestAnimationFrame(tick);
      poke();
    });
    v.addEventListener('pause', function () { paintTime(); paint(); setLoading(false); });
    v.addEventListener('ended', function () {
      var hadFocus = holder.contains(doc.activeElement);
      setLoading(false);
      paint();
      if (v.hasAttribute('data-close-on-end') && openModal && openModal.contains(v)) { closeModal(); return; }
      // focus moves to the replay disc, unless the viewer is on the scrubber (they seeked to the end)
      if (hadFocus && mode === 'custom' && doc.activeElement !== scrub) center.focus({ preventScroll: true });
    });
    ['timeupdate', 'durationchange', 'loadedmetadata', 'progress', 'seeked'].forEach(function (ev) {
      v.addEventListener(ev, paintTime);
    });
    v.addEventListener('volumechange', function () {
      paintVolume();
      filmStore('volume', v.volume);
      filmStore('muted', v.muted ? 1 : 0);
    });
    v.addEventListener('waiting', function () { setLoading(true); });
    v.addEventListener('stalled', function () { if (!v.paused) setLoading(true); });
    ['playing', 'canplay', 'canplaythrough', 'seeked'].forEach(function (ev) { v.addEventListener(ev, function () { setLoading(false); }); });
    v.addEventListener('timeupdate', unstick);   // touch mode has no frame loop
    // nothing left to play (HLS and every <source> failed): say so, keep the poster
    function showError() {
      ui.setAttribute('data-error', '');
      status.textContent = 'The film could not be played.';
      paint();
    }
    // nothing to play: no source was usable, or a failed stream left nothing to fall back to.
    // Checked 300 ms after an error, so a fallback mid-way through source selection isn't flagged.
    var errTimer = 0;
    function nothingToPlay() {
      if (v._hls || v.readyState > 0) return false;
      if (v.networkState === 3) return true;
      return v._hlsState === 'failed' && !v.getAttribute('src') && !v.querySelector(':scope > source');
    }
    function checkSoon() {
      clearTimeout(errTimer);
      errTimer = setTimeout(function () { if (nothingToPlay()) showError(); }, 300);
    }
    v.addEventListener('error', checkSoon, true);
    v.addEventListener('emptied', checkSoon);
    // a fast 404 can fail before ds.js runs. Only a MediaError is trusted at setup: WebKit
    // reports "no source" before it starts loading, so that case re-runs source selection
    // and lets a real failure report itself through the listener above.
    function checkErrorAtSetup() {
      if (v.error) showError();
      else if (v.networkState === 3 && !hlsUrl(v)) { try { v.load(); } catch (e) {} }
    }
    ['loadstart', 'loadedmetadata', 'loadeddata', 'playing'].forEach(function (ev) {
      v.addEventListener(ev, function () {
        if (!ui.hasAttribute('data-error')) return;
        ui.removeAttribute('data-error');
        status.textContent = '';
        paint();
      });
    });
    if (v.textTracks && v.textTracks.addEventListener) {
      v.textTracks.addEventListener('addtrack', paintCaptions);
      v.textTracks.addEventListener('change', paintCaptions);
    }
    doc.addEventListener('fullscreenchange', paintFs);
    doc.addEventListener('webkitfullscreenchange', paintFs);
    if (mqFine.addEventListener) mqFine.addEventListener('change', setMode);
    else if (mqFine.addListener) mqFine.addListener(setMode);

    // the modal closing rewinds the film: back to the start screen
    v._filmReset = function () { started = false; active = false; setLoading(false); setMode(); paintTime(); };

    setMode();
    paintTime();
    paintVolume();
    paintCaptions();
    paintFs();
    checkErrorAtSetup();
  }

  /* Art direction for video: <source media="(max-width: 734px)" src="x-small.mp4">
     before a plain <source src="x.mp4"> (no src attribute on the <video>) lets
     the browser pick the phone cut at load; ds.js re-picks when a breakpoint
     flips. data-poster-small swaps the poster at 734px and below. Pictures use
     <picture><source media srcset> natively and need nothing here. */
  function pickSource(v) {
    var ss = $$(':scope > source', v);
    for (var j = 0; j < ss.length; j++) {
      var m = ss[j].getAttribute('media');
      try { if (!m || window.matchMedia(m).matches) return ss[j].src; } catch (e) { return ss[j].src; }
    }
    return '';
  }
  function artDirect(v) {
    if (v.hasAttribute('data-poster-small') && window.matchMedia) {
      if (!v.hasAttribute('data-poster-large')) v.setAttribute('data-poster-large', v.getAttribute('poster') || '');
      var small = window.matchMedia('(max-width: 734px)').matches;
      var want = small ? v.getAttribute('data-poster-small') : v.getAttribute('data-poster-large');
      if (want && v.getAttribute('poster') !== want) { v.setAttribute('poster', want); posterBehind(v); }
    }
    if (v.hasAttribute('src') || !v.querySelector(':scope > source[media]')) return;
    if (v._hlsState && v._hlsState !== 'failed') return;   // the stream adapts by itself
    var src = pickSource(v);
    if (!src || !v.currentSrc || src === v.currentSrc) return;
    var playing = !v.paused;
    v.load();                            // re-runs source selection
    if (playing) safePlay(v);
  }
  function initArtDirection() {
    if (!window.matchMedia) return;
    var vids = $$('video').filter(function (v) { return v.hasAttribute('data-poster-small') || v.querySelector(':scope > source[media]'); });
    if (!vids.length) return;
    var queries = { '(max-width: 734px)': true };
    vids.forEach(function (v) {
      $$(':scope > source[media]', v).forEach(function (so) { queries[so.getAttribute('media')] = true; });
      artDirect(v);
    });
    Object.keys(queries).forEach(function (q) {
      var mq; try { mq = window.matchMedia(q); } catch (e) { return; }
      var run = function () { vids.forEach(artDirect); };
      if (mq.addEventListener) mq.addEventListener('change', run); else if (mq.addListener) mq.addListener(run);
    });
  }

  /* ------------------------------------------------------------------------
     HLS: <video data-hls="…m3u8"> streams the playlist, attached on the
     video's first play (safePlay), so nothing streams until it would show.
     hls.js plays it wherever Media Source runs (Safari and iOS 17.1+ through
     ManagedMediaSource), loaded once from cdnjs (pinned, SRI): ds.js's only
     request to another host. The browsers' own players open a clip on their
     lowest rung and step up slowly, so a short loop never got sharp; hls.js
     opens on the rung that fits the panel. Native HLS is the fallback where
     hls.js can't run (iOS before 17.1, or the script fails), and the video's
     <source> children after that.
     _hlsState: 'native' | 'loading' | 'hlsjs' | 'failed'; _hls: the instance.
     ------------------------------------------------------------------------ */
  var HLS_JS = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.6.15/hls.min.js';
  var HLS_SRI = 'sha512-CSVqc4a7tn+tizDNt+eDoVn2fXYAwMDpCLrwGlWrOktNfZQ9gp4dKKScElMeRlrIifhliXs0a06BLaUgmMlCUw==';
  var hlsLib = 0;          // 0 not requested, 1 loading, 2 ready, 3 failed
  var hlsWaiting = [];
  var hlsLive = null;      // videos with an hls.js instance, watched for removal
  function loadHls(cb) {
    if (hlsLib >= 2) { cb(hlsLib === 2); return; }
    hlsWaiting.push(cb);
    if (hlsLib === 1) return;
    hlsLib = 1;
    var settle = function (ok) {
      hlsLib = ok && window.Hls ? 2 : 3;
      var q = hlsWaiting; hlsWaiting = [];
      q.forEach(function (fn) { fn(hlsLib === 2); });
    };
    var s = doc.createElement('script');
    s.src = HLS_JS;
    s.integrity = HLS_SRI;
    s.crossOrigin = 'anonymous';
    s.onload = function () { settle(true); };
    s.onerror = function () { settle(false); };
    doc.head.appendChild(s);
  }
  function hlsNative(v) {
    try { return !!v.canPlayType('application/vnd.apple.mpegurl'); } catch (e) { return false; }
  }
  // hls.js runs on Media Source Extensions, or ManagedMediaSource on iOS 17.1+
  function hlsMse() {
    var M = window.ManagedMediaSource || window.MediaSource || window.WebKitMediaSource;
    try { return !!M && M.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'); } catch (e) { return false; }
  }
  // the smallest rung at least as wide as the panel in device pixels (hls.js
  // sorts levels low to high), or the top one; a hidden panel gets the top.
  // The panel, not the video: a padded video has no width until its poster
  // or first frame loads, and would open on a rung for 300px
  function hlsFit(h, v) {
    var box = v.closest('.media') || v;
    var levels = h.levels || [], px = Math.max(v.clientWidth || 0, box.clientWidth || 0) * (window.devicePixelRatio || 1);
    for (var i = 0; px && i < levels.length; i++) if (levels[i].width >= px) return i;
    return Math.max(0, levels.length - 1);
  }
  function attachNative(v, url) {
    v._hlsState = 'native';
    v.addEventListener('error', function () { if (v._hlsState === 'native') hlsFallback(v); });
    v.src = url;
  }
  // the stream is ready (or gone): play it if the page wants it playing
  function hlsResume(v) {
    // a film resumes in its open modal, or wherever the viewer pressed play
    if (v._film) { if ((openModal && openModal.contains(v)) || v._wantPlay) safePlay(v); }
    else if (v._managed) highlightLoops.forEach(function (fn) { fn(); });
    else evaluateVideo(v);
  }
  function hlsDestroy(v) {
    if (v._hls) { try { v._hls.destroy(); } catch (e) {} v._hls = null; }
  }
  // a video taken out of the page frees its hls.js instance (buffers, workers)
  function hlsWatch(v) {
    if (!hlsLive) {
      hlsLive = [];
      if ('MutationObserver' in window) new MutationObserver(function () {
        hlsLive = hlsLive.filter(function (x) { if (x.isConnected && x._hls) return true; hlsDestroy(x); return false; });
      }).observe(doc.body, { childList: true, subtree: true });
    }
    hlsLive.push(v);
  }
  function hlsFallback(v) {
    if (!v.paused) v._wantPlay = true;   // load() below pauses it; hlsResume plays it again
    hlsDestroy(v);
    v._hlsState = 'failed';
    // back to the video's own file (src="…mp4" beside data-hls-small), else its <source> children
    if (v._srcFile) v.setAttribute('src', v._srcFile); else v.removeAttribute('src');
    // hls.js on ManagedMediaSource (WebKit) swaps the <source> children for its own; put them back
    if (v._hlsSources && !v.querySelector(':scope > source')) v._hlsSources.forEach(function (x) { v.appendChild(x); });
    try { v.load(); } catch (e) {}       // re-runs source selection: the <source> children
    hlsResume(v);
  }
  // the stream this video plays, or '' for none. data-hls-small is the phone
  // cut's stream, used at 734px and below; beside data-hls or a plain file
  // (src="…mp4"). Picked once, the first time it's asked (as Apple picks its
  // video file once, at load)
  function hlsUrl(v) {
    if (v._hlsUrl === undefined) {
      var small = v.getAttribute('data-hls-small');
      var phone = small && window.matchMedia && window.matchMedia('(max-width: 734px)').matches;
      v._hlsUrl = (phone ? small : v.getAttribute('data-hls')) || '';
    }
    return v._hlsUrl;
  }
  function attachHls(v) {
    var url = hlsUrl(v);
    if (v._srcFile === undefined) v._srcFile = v.getAttribute('src');
    if (!hlsMse()) {
      if (hlsNative(v)) attachNative(v, url); else hlsFallback(v);
      return;
    }
    v._hlsState = 'loading';
    loadHls(function (ok) {
      var Hls = window.Hls;
      if (!ok || !Hls.isSupported()) {
        if (hlsNative(v)) { attachNative(v, url); hlsResume(v); } else hlsFallback(v);
        return;
      }
      var h = new Hls({
        capLevelToPlayerSize: true,      // never fetch more pixels than the panel shows
        abrEwmaDefaultEstimate: 3e6,     // first guess ~3 Mbps, so clips don't open on the lowest rung
        autoStartLoad: !v._film,         // a film fetches segments only once it plays
        startPosition: startAt(v) || -1  // data-start: open on the poster's frame
      });
      var recovered = false;
      h.on(Hls.Events.ERROR, function (ev, d) {
        if (!d.fatal) return;
        if (d.type === Hls.ErrorTypes.MEDIA_ERROR && !recovered) { recovered = true; h.recoverMediaError(); }
        else hlsFallback(v);
      });
      // open on the rung that fills the panel, not the playlist's first entry
      // (often its lowest): a short loop is over before hls.js would step up
      h.on(Hls.Events.MANIFEST_PARSED, function () { h.startLevel = hlsFit(h, v); hlsResume(v); });
      if (v._film) v.addEventListener('play', function () { if (v._hls === h) h.startLoad(); }, { once: true });
      v._hlsSources = $$(':scope > source', v).map(function (x) { return x.cloneNode(true); });
      v._hls = h;
      v._hlsState = 'hlsjs';
      hlsWatch(v);
      h.loadSource(url);
      h.attachMedia(v);
    });
  }

  /* ------------------------------------------------------------------------
     Galleries: [data-gallery] with a .track, paddle buttons, keyboard
     ------------------------------------------------------------------------ */
  function padStart(track) { return parseFloat(getComputedStyle(track).paddingLeft) || 0; }
  function itemLeft(track, item) { return item.offsetLeft - padStart(track); }
  function nearestIndex(track, items) {
    var x = track.scrollLeft, best = 0, bestD = Infinity;
    items.forEach(function (it, k) {
      var d = Math.abs(itemLeft(track, it) - x);
      if (d < bestD) { bestD = d; best = k; }
    });
    return best;
  }
  function maxScroll(track) { return track.scrollWidth - track.clientWidth; }

  function makePaddles(g, track) {
    var wrap = doc.createElement('div');
    wrap.className = 'paddles';
    wrap.innerHTML =
      '<button class="paddle paddle-prev" type="button" aria-label="Previous">' + ICON.prev + '</button>' +
      '<button class="paddle paddle-next" type="button" aria-label="Next">' + ICON.next + '</button>';
    g.appendChild(wrap);
    return wrap;
  }

  function initGallery(g) {
    var track = g.querySelector('.track');
    if (!track) return;
    // items are read live, so tiles added or resized after load still count
    function list() { return Array.prototype.slice.call(track.children); }
    if (!track.id) track.id = nextId('track');
    var addedTab = !track.hasAttribute('tabindex');
    if (addedTab) track.tabIndex = 0;
    // the wrapper is the named region (it holds the paddles too); the track
    // keeps list semantics (list-style:none strips them in Safari otherwise)
    if (!g.hasAttribute('role')) g.setAttribute('role', 'region');
    if (!g.hasAttribute('aria-label') && !g.hasAttribute('aria-labelledby')) {
      g.setAttribute('aria-label', track.getAttribute('aria-label') || g.getAttribute('data-label') || 'Gallery');
    }
    if (/^(UL|OL)$/.test(track.tagName) && !track.hasAttribute('role')) track.setAttribute('role', 'list');

    var paddles = g.querySelector('.paddles');
    if (!paddles && !g.hasAttribute('data-no-paddles')) paddles = makePaddles(g, track);
    var prev = paddles && paddles.querySelector('.paddle-prev');
    var next = paddles && paddles.querySelector('.paddle-next');
    if (prev) { prev.innerHTML = prev.innerHTML.trim() || ICON.prev; prev.setAttribute('aria-controls', track.id); prev.type = 'button'; }
    if (next) { next.innerHTML = next.innerHTML.trim() || ICON.next; next.setAttribute('aria-controls', track.id); next.type = 'button'; }

    // target = the item a paddle/key last asked for, kept while its smooth
    // scroll runs, so quick repeated clicks keep advancing
    var target = -1, targetTimer = 0;
    function snapLeft(k) { return Math.min(maxScroll(track), Math.max(0, itemLeft(track, list()[k]))); }
    function holdTarget(ms) {
      clearTimeout(targetTimer);
      targetTimer = setTimeout(function () { target = -1; }, ms);
    }
    function go(k) {
      var n = track.children.length;
      if (!n) return;
      k = Math.max(0, Math.min(n - 1, k));
      target = k;
      holdTarget(400);                     // cleared sooner/later by the scroll events
      track.scrollTo({ left: snapLeft(k), behavior: behavior() });
    }
    function step(dir) {
      var n = track.children.length;
      if (target >= n) target = -1;
      var x = target >= 0 ? snapLeft(target) : track.scrollLeft;
      var k = -1, j;
      if (dir > 0) { for (j = 0; j < n; j++) { if (snapLeft(j) > x + 2) { k = j; break; } } }
      else { for (j = n - 1; j >= 0; j--) { if (snapLeft(j) < x - 2) { k = j; break; } } }
      if (k >= 0) go(k);
    }
    var raf = 0;
    function update() {
      raf = 0;
      var max = maxScroll(track), x = track.scrollLeft;
      var isStatic = max <= 2;
      g.classList.toggle('is-static', isStatic);
      if (addedTab) track.tabIndex = isStatic ? -1 : 0;   // nothing to scroll, no tab stop
      if (prev) {
        var pd = x <= 2;
        if (pd && doc.activeElement === prev && next) next.focus({ preventScroll: true });
        prev.disabled = pd;
      }
      if (next) {
        var nd = x >= max - 2;
        if (nd && doc.activeElement === next && prev && !prev.disabled) prev.focus({ preventScroll: true });
        next.disabled = nd;
      }
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(update); }

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', function () {
      schedule();
      if (target >= 0) holdTarget(150);
    }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(track.children.length - 1); }
    });
    // re-measure when the track or any item changes size, and when items are added
    if (hasRO) {
      var ro = new ResizeObserver(schedule);
      var observeItems = function () { list().forEach(function (it) { ro.observe(it); }); };
      ro.observe(track);
      observeItems();
      if ('MutationObserver' in window) new MutationObserver(function () { observeItems(); schedule(); }).observe(track, { childList: true });
    } else window.addEventListener('resize', schedule);
    update();
    g.setAttribute('data-ready', '');
    g._gallery = { go: go, items: list, track: track };
  }

  /* ------------------------------------------------------------------------
     Highlights: [data-highlights] gallery with timed autoplay + dot nav
     ------------------------------------------------------------------------ */
  function initHighlights(g) {
    var track = g.querySelector('.track');
    if (!track) return;
    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;
    if (!track.hasAttribute('tabindex')) track.tabIndex = 0;
    // WAI-ARIA carousel: named region on the wrapper, slides are groups
    if (!g.hasAttribute('role')) g.setAttribute('role', 'region');
    g.setAttribute('aria-roledescription', 'carousel');
    if (!g.hasAttribute('aria-label') && !g.hasAttribute('aria-labelledby')) {
      g.setAttribute('aria-label', track.getAttribute('aria-label') || g.getAttribute('data-label') || 'Highlights');
    }
    // ul/ol track: stays a list (explicit role keeps it in Safari with list-style:none) and its
    // li slides keep their implicit listitem role, since li may not take role=group.
    // Any other track: the track and each slide are groups.
    var isList = /^(UL|OL)$/.test(track.tagName);
    if (isList) { if (!track.hasAttribute('role')) track.setAttribute('role', 'list'); }
    else track.setAttribute('role', 'group');
    if (!track.hasAttribute('aria-label')) track.setAttribute('aria-label', 'Slides');
    items.forEach(function (it, k) {
      if (!isList && !it.hasAttribute('role')) it.setAttribute('role', 'group');
      it.setAttribute('aria-roledescription', 'slide');
      it.setAttribute('aria-label', (k + 1) + ' of ' + items.length);
    });

    var interval = parseInt(g.getAttribute('data-interval'), 10) || 6000;
    var keep = g.hasAttribute('data-keep-playing');   // a slide's clip, once started, loops on
    var controls = g.querySelector('.highlights-controls');
    if (!controls) { controls = doc.createElement('div'); controls.className = 'highlights-controls'; g.appendChild(controls); }
    controls.innerHTML = '';
    var dotnav = doc.createElement('div');
    dotnav.className = 'dotnav';
    dotnav.setAttribute('role', 'group');
    dotnav.setAttribute('aria-label', 'Choose a highlight');
    var dots = items.map(function (it, k) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      var cap = it.querySelector('.media-overlay-caption');
      var label = 'Highlight ' + (k + 1) + ' of ' + items.length;
      if (cap) {
        // the label reads the caption without its footnote markers
        var c = cap.cloneNode(true);
        $$('sup, .fn', c).forEach(function (el) { el.remove(); });
        label += ': ' + c.textContent.replace(/\s+/g, ' ').trim().slice(0, 80);
      }
      b.setAttribute('aria-label', label);
      b.innerHTML = '<span class="dot-pill"><span class="dot-fill"></span></span>';
      b.addEventListener('click', function () {
        if (ended) { ended = false; playing = true; }
        go(k); setButton(); loop();
      });
      dotnav.appendChild(b);
      return b;
    });
    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'playpause';
    btn.innerHTML = ICON.pause56 + ICON.play56 + ICON.replay56;
    controls.appendChild(dotnav);
    controls.appendChild(btn);

    var i = 0, elapsed = 0, last = null, raf = 0;
    var playing = !reduced() && !STATIC;
    var ended = false, inView = false, programmatic = false, progTimer = 0, scrollTimer = 0;
    var hold = false;   // keyboard focus inside: the timer waits (WAI-ARIA carousel)

    function dur(k) { return parseInt(items[k].getAttribute('data-duration'), 10) || interval; }
    function videosOf(k) { return $$('video', items[k]); }
    // an open modal elsewhere on the page counts like a hidden tab
    function blockedByModal() { return !!openModal && !openModal.contains(g); }
    function canRun() { return playing && inView && !doc.hidden && !blockedByModal(); }
    function timerRuns() { return canRun() && !hold; }

    // the current slide's clips play while the carousel runs; with
    // data-keep-playing every clip that has started keeps looping, whichever
    // slide shows and after the last one, until the gallery leaves the view,
    // the tab hides, a modal opens or the viewer pauses
    function syncVideos() {
      var run = keep ? (playing || ended) && inView && !doc.hidden && !blockedByModal() : canRun();
      items.forEach(function (it, k) {
        videosOf(k).forEach(function (v) {
          if (run && (k === i || (keep && v._hlStarted))) { v._hlStarted = true; safePlay(v); }
          else if (!v.paused) v.pause();
        });
      });
    }
    // links inside slides (footnote refs in captions) are tab stops only on
    // the current slide, so Tab never jumps the carousel to an off-screen one
    var SLIDE_FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]';
    var slideStops = null;   // focusable elements per slide, built on first use
    function syncTabStops() {
      if (!slideStops) slideStops = items.map(function (it) { return $$(SLIDE_FOCUSABLE, it); });
      slideStops.forEach(function (list, k) {
        list.forEach(function (el) {
          var saved = el.hasAttribute('data-hl-tabindex');
          if (k === i) {
            if (!saved) return;
            var o = el.getAttribute('data-hl-tabindex');
            if (o === '') el.removeAttribute('tabindex'); else el.setAttribute('tabindex', o);
            el.removeAttribute('data-hl-tabindex');
          } else if (!saved) {
            el.setAttribute('data-hl-tabindex', el.getAttribute('tabindex') || '');
            el.setAttribute('tabindex', '-1');
          }
        });
      });
    }
    // a slide's videos start from their start (0, or data-start). They are
    // rewound once their slide has scrolled away, so a slide comes back
    // already on its first frame: rewinding on the way in showed the frame it
    // was left on until the seek landed, a stream fragment away
    function rewind(v) { try { if (Math.abs((v.currentTime || 0) - startAt(v)) > 0.05) v.currentTime = startAt(v); } catch (e) {} }
    function setActive(k) {
      if (k !== i && !keep) {
        var prev = i;
        videosOf(k).forEach(rewind);   // only if it wasn't rewound on the way out
        setTimeout(function () {
          if (i === prev) return;
          videosOf(prev).forEach(function (v) { if (!v.paused) v.pause(); rewind(v); });
        }, 1000);
      }
      i = k; elapsed = 0;
      dots.forEach(function (d, j) {
        if (j === k) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
        d.style.setProperty('--p', ended && j === k ? 1 : 0);
      });
      syncTabStops();
      syncVideos();
    }
    // when a programmatic scroll window ends, re-sync to wherever the track
    // actually is, so a swipe that started during it is never lost
    function endProg() {
      programmatic = false;
      var k = nearestIndex(track, items);
      if (k !== i) { if (ended) { ended = false; setButton(); } setActive(k); loop(); }
    }
    function go(k) {
      setActive(k);
      programmatic = true;
      clearTimeout(progTimer);
      progTimer = setTimeout(endProg, 900);
      var left = Math.min(maxScroll(track), Math.max(0, itemLeft(track, items[k])));
      track.scrollTo({ left: left, behavior: behavior() });
    }
    function setButton() {
      var state = ended ? 'ended' : (playing ? 'playing' : 'paused');
      btn.setAttribute('data-state', state);
      btn.setAttribute('aria-label', ended ? 'Replay highlights' : (playing ? 'Pause highlights' : 'Play highlights'));
      // WAI-ARIA carousel: slide changes are announced only while not rotating
      track.setAttribute('aria-live', (playing && !ended && !hold) ? 'off' : 'polite');
    }
    function tick(t) {
      if (!timerRuns()) { raf = 0; last = null; return; }
      raf = requestAnimationFrame(tick);
      var dt = last == null ? 0 : Math.min(100, t - last);
      last = t;
      elapsed += dt;
      var p = Math.min(1, elapsed / dur(i));
      dots[i].style.setProperty('--p', p.toFixed(4));
      if (elapsed >= dur(i)) {
        if (i < items.length - 1) go(i + 1);
        else { playing = false; ended = true; dots[i].style.setProperty('--p', 1); setButton(); syncVideos(); }
      }
    }
    function loop() {
      syncVideos();
      if (!raf && timerRuns()) { last = null; raf = requestAnimationFrame(tick); }
    }
    highlightLoops.push(loop);

    btn.addEventListener('click', function () {
      if (ended) { ended = false; playing = true; go(0); }
      else { playing = !playing; }
      setButton(); loop();
    });

    track.addEventListener('scroll', function () {
      if (programmatic) {
        clearTimeout(progTimer);
        progTimer = setTimeout(endProg, 160);
        return;
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var k = nearestIndex(track, items);
        if (k !== i) { if (ended) { ended = false; setButton(); } setActive(k); loop(); }
      }, 140);
    }, { passive: true });

    // real input ends the programmatic window at once: the user's scroll counts
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (t) {
      track.addEventListener(t, function () { programmatic = false; clearTimeout(progTimer); }, { passive: true });
    });

    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      var k = -1;
      if (e.key === 'ArrowRight' && i < items.length - 1) k = i + 1;
      else if (e.key === 'ArrowLeft' && i > 0) k = i - 1;
      if (k < 0) return;
      e.preventDefault();
      if (ended) { ended = false; setButton(); }   // leave the Replay state
      go(k);
    });

    // keyboard focus on the track or dots holds the timer; the play button
    // is excluded so pressing play still plays
    g.addEventListener('focusin', function (e) {
      if (e.target === btn) return;
      // focus that lands inside another slide (a screen reader, a script) brings that slide in
      var k = items.findIndex(function (it) { return it.contains(e.target); });
      if (k >= 0 && k !== i) { if (ended) { ended = false; setButton(); } go(k); }
      var kb = false;
      try { kb = e.target.matches(':focus-visible'); } catch (err) { kb = false; }
      if (kb && !hold) { hold = true; setButton(); loop(); }
    });
    g.addEventListener('focusout', function (e) {
      if (hold && (!e.relatedTarget || !g.contains(e.relatedTarget) || e.relatedTarget === btn)) { hold = false; setButton(); loop(); }
    });

    // turning reduced motion on mid-session stops the rotation
    if (mqReduce.addEventListener) mqReduce.addEventListener('change', function () {
      if (reduced() && playing) { playing = false; setButton(); loop(); }
    });

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var r = en.intersectionRatio;
          var vis = en.isIntersecting && (r >= 0.35 || en.intersectionRect.height >= window.innerHeight * 0.6);
          if (vis !== inView) { inView = vis; g.classList.toggle('is-inview', vis); loop(); }
        });
      }, { threshold: [0, 0.2, 0.35, 0.5, 0.75, 1] }).observe(g);
    } else { inView = true; g.classList.add('is-inview'); }

    doc.addEventListener('visibilitychange', loop);
    items.forEach(function (it) { $$('video', it).forEach(function (v) { initVideo(v); v.loop = true; }); });
    // slide content added or removed later: re-query once, then re-apply
    if ('MutationObserver' in window) {
      new MutationObserver(function () { slideStops = null; syncTabStops(); }).observe(track, { childList: true, subtree: true });
    }
    setActive(0);
    setButton();
    g.setAttribute('data-ready', '');
    loop();
  }

  /* ------------------------------------------------------------------------
     Tab gallery: [data-tabgallery]
     ------------------------------------------------------------------------ */
  function initTabgallery(tg) {
    var tabs = $$('.tabnav-tab', tg);
    var panels = $$('.tabgallery-panel', tg);
    var caps = $$('.tabgallery-caption', tg);
    var platter = tg.querySelector('.tabnav-platter');
    var nav = tg.querySelector('.tabnav');
    if (!tabs.length || !platter) return;
    if (nav) nav.setAttribute('data-allow-overflow', '');
    var base = tg.id || nextId('tabgallery');
    platter.setAttribute('role', 'tablist');
    platter.setAttribute('aria-orientation', 'horizontal');
    if (!platter.hasAttribute('aria-label')) platter.setAttribute('aria-label', tg.getAttribute('data-label') || 'Views');
    var ind = platter.querySelector('.tabnav-indicator');
    if (!ind) { ind = doc.createElement('span'); ind.className = 'tabnav-indicator'; ind.setAttribute('aria-hidden', 'true'); platter.insertBefore(ind, platter.firstChild); }
    var capWrap = tg.querySelector('.tabgallery-captions');
    if (capWrap) capWrap.setAttribute('aria-live', 'polite');

    tabs.forEach(function (t, k) {
      t.type = 'button';
      t.setAttribute('role', 'tab');
      if (!t.id) t.id = base + '-tab-' + k;
      var p = panels[k];
      if (p) {
        if (!p.id) p.id = base + '-panel-' + k;
        p.setAttribute('role', 'tabpanel');
        p.setAttribute('aria-labelledby', t.id);
        t.setAttribute('aria-controls', p.id);
        // a panel of pictures only is a tab stop (its ring is drawn inside it).
        // With .tabnav before .tabgallery-media in the DOM, Tab goes tab -> panel
        // (WAI-ARIA order); with media first, Shift+Tab from the tabs reaches it.
        if (!p.hasAttribute('tabindex') && !p.querySelector('a[href], button, input, select, textarea, video[controls], [tabindex]')) p.tabIndex = 0;
      }
      t.addEventListener('click', function () { select(k, true); });
    });

    var cur = Math.max(0, tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }));

    function place(animate) {
      var t = tabs[cur];
      if (!animate) ind.style.transition = 'none';
      ind.style.width = t.offsetWidth + 'px';
      ind.style.setProperty('--x', t.offsetLeft + 'px');
      if (!animate) { void ind.offsetWidth; ind.style.transition = ''; }
      if (nav) { nav.classList.toggle('is-overflowing', nav.scrollWidth > nav.clientWidth + 1); edges(); }
    }
    // which ends of an overflowing tab bar have hidden tabs (CSS fades only those)
    function edges() {
      if (!nav) return;
      var max = nav.scrollWidth - nav.clientWidth;
      nav.classList.toggle('is-at-start', nav.scrollLeft <= 1);
      nav.classList.toggle('is-at-end', nav.scrollLeft >= max - 1);
    }
    if (nav) nav.addEventListener('scroll', perFrame(edges), { passive: true });
    function reveal(t, instant) {
      if (!nav || nav.scrollWidth <= nav.clientWidth + 1) return;
      var target = t.offsetLeft + platter.offsetLeft - (nav.clientWidth - t.offsetWidth) / 2;
      nav.scrollTo({ left: Math.max(0, target), behavior: instant ? 'auto' : behavior() });
    }
    function select(k, user) {
      cur = k;
      tabs.forEach(function (t, j) {
        var on = j === k;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, j) { p.classList.toggle('is-active', j === k); });
      caps.forEach(function (c, j) { c.classList.toggle('is-active', j === k); });
      place(!!user);
      if (user) reveal(tabs[k]);
      panels.forEach(function (p) { $$('video', p).forEach(function (v) { if (v._init) evaluateVideo(v); }); });
      // restart the newly shown video from the top
      if (user && panels[k]) $$('video', panels[k]).forEach(function (v) { try { v.currentTime = 0; } catch (e) {} });
    }
    platter.addEventListener('keydown', function (e) {
      var k = cur;
      if (e.key === 'ArrowRight') k = (cur + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') k = (cur - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') k = 0;
      else if (e.key === 'End') k = tabs.length - 1;
      else return;
      e.preventDefault();
      select(k, true);
      tabs[k].focus({ preventScroll: true });   // reveal() already scrolls the platter
    });
    tg.setAttribute('data-ready', '');
    select(cur, false);
    function relayout() { place(false); reveal(tabs[cur], true); }
    if (hasRO) { var ro = new ResizeObserver(relayout); ro.observe(platter); if (nav) ro.observe(nav); }
    else window.addEventListener('resize', perFrame(relayout));
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { place(false); });
  }

  /* ------------------------------------------------------------------------
     Modal: [data-modal-open="id"] opens .modal#id
     ------------------------------------------------------------------------ */
  var openModal = null, lastFocus = null, closeTimer = 0;
  var FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, video[controls], [tabindex]';
  var inerted = [];          // page siblings made inert while a modal is open

  // real tab stops only: roving-tabindex tabs (tabindex -1) are skipped
  function focusables(m) {
    return $$(FOCUSABLE, m).filter(function (el) {
      return el.tabIndex >= 0 && !el.closest('[inert]') && el.getClientRects().length &&
        getComputedStyle(el).visibility !== 'hidden';
    });
  }
  function setPageInert(m, on) {
    if (on) {
      Array.prototype.forEach.call(doc.body.children, function (el) {
        if (el === m || el.contains(m) || el.tagName === 'SCRIPT' || el.hasAttribute('inert')) return;
        el.setAttribute('inert', '');
        inerted.push(el);
      });
    } else {
      inerted.forEach(function (el) { el.removeAttribute('inert'); });
      inerted = [];
    }
  }
  function modalsChanged() {
    highlightLoops.forEach(function (fn) { fn(); });
    evaluateAllVideos();
  }
  function prepModal(m) {
    if (m._prepped) return; m._prepped = true;
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    if (!m.hasAttribute('aria-labelledby')) {
      var h = m.querySelector('.modal-headline, h2, h3');
      if (h) { if (!h.id) h.id = (m.id || nextId('modal')) + '-title'; m.setAttribute('aria-labelledby', h.id); }
    }
    var sheet = m.querySelector('.modal-sheet');
    if (sheet && !sheet.hasAttribute('tabindex')) sheet.tabIndex = -1;
  }
  function openModalById(id, trigger) {
    var m = byId(id);
    if (!m || !m.classList.contains('modal')) return false;
    if (openModal && openModal !== m) closeModal(true);
    clearTimeout(closeTimer);
    prepModal(m);
    lastFocus = trigger || doc.activeElement;
    var sbw = window.innerWidth - root.clientWidth;
    if (sbw > 0) doc.body.style.paddingRight = sbw + 'px';
    root.classList.add('has-modal');
    m.hidden = false;
    void m.offsetWidth;
    m.classList.add('is-open');
    m.scrollTop = 0;
    openModal = m;
    setPageInert(m, true);
    var first = m.querySelector('.modal-close') || m.querySelector('.modal-sheet') || m;
    first.focus({ preventScroll: true });
    modalsChanged();                     // pause highlights + page videos behind, start ones inside
    $$('video[data-film]', m).forEach(function (v) { safePlay(v); });
    return true;
  }
  function closeModal(instant) {
    var m = openModal;
    if (!m) return;
    openModal = null;
    m.classList.remove('is-open');
    root.classList.remove('has-modal');
    doc.body.style.paddingRight = '';
    setPageInert(m, false);
    $$('video', m).forEach(function (v) {
      if (!v.paused) v.pause();
      v._wantPlay = false;
      if (v._film) { try { v.currentTime = 0; } catch (e) {} if (v._filmReset) v._filmReset(); }
    });
    var done = function () { if (!m.classList.contains('is-open')) m.hidden = true; };
    if (instant || reduced()) done(); else closeTimer = setTimeout(done, 380);
    // a modal opened from a #hash: drop the hash so reload/back don't reopen it
    if (location.hash.slice(1) === m.id) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
    if (lastFocus && lastFocus.focus && doc.contains(lastFocus) && lastFocus !== doc.body) {
      lastFocus.focus({ preventScroll: true });
    } else if (!instant) {
      var h = doc.querySelector('main h1') || doc.getElementById('main');
      if (h) {
        if (!h.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(h.tagName)) h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
    }
    lastFocus = null;
    modalsChanged();
  }
  function initModals() {
    $$('.modal').forEach(function (m) {
      if (!m.classList.contains('is-open')) m.hidden = true;
      prepModal(m);
    });
    $$('[data-modal-open]').forEach(function (t) {
      t.setAttribute('aria-haspopup', 'dialog');
      if (t.tagName === 'A' && !t.hasAttribute('role')) t.setAttribute('role', 'button');
    });
  }

  /* ------------------------------------------------------------------------
     FAQ accordion: .faq details > summary.faq-question + .faq-answer
     ------------------------------------------------------------------------ */
  function initFaq(d) {
    var sum = d.querySelector(':scope > summary');
    var ans = d.querySelector(':scope > .faq-answer');
    if (!sum || !ans || !ans.animate) return;
    var anim = null;
    var EASE = 'cubic-bezier(0.4, 0, 0.25, 1)';
    sum.addEventListener('click', function (e) {
      if (reduced()) return;
      e.preventDefault();
      // start from wherever a running animation has got to (0 when closed),
      // so reversing mid-way doesn't jump
      // (a closed <details> may still report its content's size, so use 0)
      var from = d.open ? ans.getBoundingClientRect().height : 0;
      if (anim) { anim.onfinish = null; anim.cancel(); anim = null; }
      var full = ans.scrollHeight || 1;
      if (d.open && !d.classList.contains('is-closing')) {
        d.classList.add('is-closing');
        var a1 = ans.animate([{ height: from + 'px', opacity: Math.min(1, from / full) }, { height: '0px', opacity: 0 }],
          { duration: Math.max(120, 320 * from / full), easing: EASE, fill: 'forwards' });
        anim = a1;
        a1.onfinish = function () { d.open = false; d.classList.remove('is-closing'); a1.cancel(); if (anim === a1) anim = null; };
      } else {
        d.classList.remove('is-closing');
        d.open = true;
        var target = ans.scrollHeight;
        var a2 = ans.animate([{ height: from + 'px', opacity: Math.min(1, from / (target || 1)) }, { height: target + 'px', opacity: 1 }],
          { duration: Math.max(160, 420 * (1 - from / (target || 1))), easing: EASE });
        anim = a2;
        a2.onfinish = function () { if (anim === a2) anim = null; };
      }
    });
  }

  /* ------------------------------------------------------------------------
     Local nav: stuck state, current chapter, phone menu
     ------------------------------------------------------------------------ */
  function initLocalnav(ln) {
    var links = $$('.localnav-items a[href^="#"]', ln);
    var targets = links.map(function (a) { return byId(a.getAttribute('href').slice(1)); });
    var toggle = ln.querySelector('.localnav-toggle');
    var items = ln.querySelector('.localnav-items');
    if (toggle && items) {
      if (!items.id) items.id = nextId('localnav-items');
      toggle.setAttribute('aria-controls', items.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', function (e) {
        var open = !ln.classList.contains('is-open');
        ln.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        // opened from the keyboard: focus the first link, so Tab walks the menu
        if (open && e.detail === 0) {
          var f = items.querySelector('a');
          if (f) f.focus({ preventScroll: true });
        }
      });
      var shut = function () { ln.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
      items.addEventListener('click', function (e) { if (e.target.closest('a')) shut(); });
      // focus leaving the whole bar closes the menu (clicks elsewhere: see below)
      ln.addEventListener('focusout', function (e) {
        if (ln.classList.contains('is-open') && e.relatedTarget && !ln.contains(e.relatedTarget)) shut();
      });
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ln.classList.contains('is-open')) { shut(); toggle.focus(); } });
      doc.addEventListener('click', function (e) { if (!ln.contains(e.target)) shut(); });
    }
    var raf = 0;
    function update() {
      raf = 0;
      var top = ln.getBoundingClientRect().top;
      ln.classList.toggle('is-stuck', top <= 0.5 && window.scrollY > 0);
      if (!links.length) return;
      var line = ln.offsetHeight + window.innerHeight * 0.3;
      var cur = -1;
      targets.forEach(function (t, k) { if (t && t.getBoundingClientRect().top <= line) cur = k; });
      var se = doc.scrollingElement || root;
      if (se.scrollTop + window.innerHeight >= se.scrollHeight - 2 && targets[targets.length - 1]) {
        var lt = targets[targets.length - 1].getBoundingClientRect().top;
        if (lt < window.innerHeight) cur = targets.length - 1;
      }
      links.forEach(function (a, k) {
        if (k === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', function () { if (!raf) raf = requestAnimationFrame(update); });
    update();
  }

  /* ------------------------------------------------------------------------
     In-page anchors: smooth scroll under the sticky local nav
     ------------------------------------------------------------------------ */
  function onAnchorClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-modal-open')) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var t = byId(id);
    if (!t) return;                      // e.g. #shot-y=600: not an element, ignore
    if (t.classList.contains('modal')) { e.preventDefault(); openModalById(id, a); return; }
    e.preventDefault();
    if (openModal && openModal.contains(t)) {
      // a target inside the open sheet: scroll the sheet, not the locked page
      t.scrollIntoView({ block: 'start', behavior: behavior() });
    } else {
      // a link inside a sheet to something on the page (a footnote ref):
      // close the sheet first, so the reader sees where it goes
      if (openModal) closeModal(true);
      var ln = doc.querySelector('.localnav');
      var gn = doc.querySelector('.globalnav');
      var offset = ln ? ln.offsetHeight : 0;
      var top = t.getBoundingClientRect().top + window.scrollY;
      // the page's first section (#top, #main) sits under the bars at rest:
      // going there means the very top, not a spot under the stuck local nav
      var rest = (gn ? gn.offsetHeight : 0) + offset;
      var y = (id === 'top' || top <= rest + 1) ? 0 : top - offset - 8;
      // push first, so the entry being left keeps the scroll position it had
      // (an instant reduced-motion scroll would otherwise be saved into it)
      try { history.pushState(null, '', '#' + id); } catch (err) {}
      window.scrollTo({ top: Math.max(0, y), behavior: behavior() });
    }
    if (!t.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(t.tagName)) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
    // pushState doesn't update :target, so mark the target for CSS (footnotes)
    $$('.is-target').forEach(function (el) { el.classList.remove('is-target'); });
    t.classList.add('is-target');
  }

  /* ------------------------------------------------------------------------
     Scroll reveal: only elements below the fold at load get a one-time rise
     ------------------------------------------------------------------------ */
  var REVEAL = '[data-reveal], .chapter-head, .section-head, .gallery-header, .section-header, .reduced, .gallery, .tabgallery, .media-hero, .welcome-media, .stats, .callouts, .callout-row, .feature-list, .faq-list, .faq-headline, .banner-card, .quote, .facts, .owned, .prose, .next-project, .media-grid, .code, .code-figure, .work-grid';
  function initReveal() {
    if (STATIC || !hasIO || reduced()) return;
    var all = $$(REVEAL).filter(function (el) {
      if (el.getAttribute('data-reveal') === 'off') return false;
      if (el.closest('.modal')) return false;
      var p = el.parentElement && el.parentElement.closest(REVEAL);
      return !p;                          // outermost only
    });
    var vh = window.innerHeight;
    var pending = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        if (--pending <= 0) io.disconnect();
        el.classList.add('reveal-run');
        requestAnimationFrame(function () {
          el.classList.remove('reveal-pending');
          var clean = function () { el.classList.remove('reveal-run'); };
          el.addEventListener('transitionend', function te(ev) { if (ev.target === el) { el.removeEventListener('transitionend', te); clean(); } });
          setTimeout(clean, 1400);
        });
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    // all reads first, then all writes: one layout flush instead of one per element
    var tops = all.map(function (el) { return el.getBoundingClientRect().top; });
    all.forEach(function (el, k) {
      if (tops[k] > vh * 0.94) {
        el.classList.add('reveal-pending');
        io.observe(el);
        pending++;
      }
    });
    if (!pending) io.disconnect();
  }

  /* ------------------------------------------------------------------------
     Work index filter: [data-work-filter] buttons (data-filter="tag", "" = all)
     show only .work-grid items whose data-tags contain the tag
     ------------------------------------------------------------------------ */
  function initWorkFilter(bar) {
    var grid = bar.getAttribute('aria-controls') ? byId(bar.getAttribute('aria-controls')) : null;
    if (!grid) { var n = bar.nextElementSibling; grid = n && n.classList.contains('work-grid') ? n : doc.querySelector('.work-grid'); }
    if (!grid) return;
    if (!grid.id) grid.id = nextId('work');
    var btns = $$('[data-filter]', bar);
    function apply(tag) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === tag ? 'true' : 'false'); });
      $$(':scope > li', grid).forEach(function (li) {
        var tags = (li.getAttribute('data-tags') || '').split(/\s+/);
        li.hidden = !!tag && tags.indexOf(tag) === -1;
      });
    }
    btns.forEach(function (b) {
      if (b.tagName === 'BUTTON') b.type = 'button';
      b.setAttribute('aria-controls', grid.id);
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter') || ''); });
    });
    var start = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0];
    apply(start ? start.getAttribute('data-filter') || '' : '');
  }

  /* ------------------------------------------------------------------------
     Code blocks: a block that scrolls sideways is a keyboard tab stop
     ------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------
     Chiclet monogram: a letter beside a visible name is decoration
     ------------------------------------------------------------------------ */
  function initChiclets() {
    $$('.chiclet-fill > span').forEach(function (s) {
      var host = s.parentElement && s.parentElement.parentElement;
      if (!host || s.hasAttribute('aria-hidden')) return;
      var rest = (host.textContent || '').replace(s.textContent, '').replace(/\s+/g, '');
      if (rest || host.hasAttribute('aria-label')) s.setAttribute('aria-hidden', 'true');
    });
  }

  var codeCount = 0;
  function initCode(pre) {
    pre.setAttribute('data-allow-overflow', '');   // scrolls inside itself, by design
    if (pre.hasAttribute('tabindex')) return;
    var own = pre.hasAttribute('aria-label') || pre.hasAttribute('role');
    var name = pre.getAttribute('data-label') || ('Code ' + (++codeCount));
    function sync() {
      var scrolls = pre.scrollWidth > pre.clientWidth + 1;
      if (scrolls) pre.tabIndex = 0; else pre.removeAttribute('tabindex');
      if (own) return;
      // only a block that scrolls is a landmark
      if (scrolls) { pre.setAttribute('role', 'region'); pre.setAttribute('aria-label', name); }
      else { pre.removeAttribute('role'); pre.removeAttribute('aria-label'); }
    }
    sync();
    if (hasRO) new ResizeObserver(sync).observe(pre); else window.addEventListener('resize', perFrame(sync));
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    $$('[data-highlights]').forEach(function (g) { try { initHighlights(g); } catch (e) { console.warn('highlights', e); } });
    $$('[data-gallery]').forEach(function (g) { try { initGallery(g); } catch (e) { console.warn('gallery', e); } });
    $$('[data-tabgallery]').forEach(function (tg) { try { initTabgallery(tg); } catch (e) { console.warn('tabgallery', e); } });
    initModals();
    $$('.faq details').forEach(initFaq);
    $$('.media video, video[data-autoplay], video[data-film]').forEach(initVideo);
    initArtDirection();
    $$('[data-work-filter]').forEach(initWorkFilter);
    $$('pre.code, .prose pre, .modal-content pre').forEach(initCode);
    initChiclets();
    var ln = doc.querySelector('.localnav');
    if (ln) initLocalnav(ln);
    initReveal();

    doc.addEventListener('click', function (e) {
      var o = e.target.closest('[data-modal-open]');
      if (o) { if (openModalById(o.getAttribute('data-modal-open'), o)) e.preventDefault(); return; }
      var c = e.target.closest('[data-modal-close]');
      if (c && openModal && openModal.contains(c)) { e.preventDefault(); closeModal(); }
    });
    doc.addEventListener('click', onAnchorClick);
    doc.addEventListener('keydown', function (e) {
      if (!openModal) return;
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(openModal);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1], act = doc.activeElement;
      if (!openModal.contains(act)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && (act === first || act === openModal.querySelector('.modal-sheet'))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus(); }
    });
    doc.addEventListener('visibilitychange', evaluateAllVideos);
    if (mqReduce.addEventListener) mqReduce.addEventListener('change', function () {
      if (reduced()) videos.forEach(function (v) { v._userPaused = true; v.pause(); });
    });

    // deep link to a modal (#id of a .modal); any other hash is left to the browser
    var h = location.hash ? location.hash.slice(1) : '';
    if (h && h.indexOf('=') === -1) {
      var t = byId(h);
      if (t && t.classList.contains('modal')) {
        openModalById(h, null);
        // the browser's own fragment focus lands on the .modal just after
        // this runs; put focus back on the close button once it has
        var refocus = function () {
          if (openModal !== t) return;
          var c = t.querySelector('.modal-close') || t.querySelector('.modal-sheet');
          if (c && doc.activeElement !== c) c.focus({ preventScroll: true });
        };
        setTimeout(refocus, 0);
        window.addEventListener('load', function () { requestAnimationFrame(refocus); }, { once: true });
      }
    }
    // a same-document hash change to a modal id (location.hash = '#m-x') opens it too
    window.addEventListener('hashchange', function () {
      var id = location.hash.slice(1);
      if (!id || id.indexOf('=') !== -1) return;
      var m = byId(id);
      if (m && m.classList.contains('modal') && openModal !== m) openModalById(id, null);
    });
  }

  ready(init);
})();
