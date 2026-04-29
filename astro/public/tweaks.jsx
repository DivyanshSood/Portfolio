/* global React, ReactDOM, TweaksPanel, TweakSection, TweakColor, TweakSelect, TweakToggle, TweakText, useTweaks */
(function () {
  const { useEffect } = React;

  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "#F2D5A8",
    "heroHeadline": "Craft that",
    "heroAccent": "defies",
    "heroTail": "gravity.",
    "typeScale": "Default",
    "cursorStyle": "Difference dot",
    "grainOn": true
  }/*EDITMODE-END*/;

  function applyTweaks(t) {
    const root = document.documentElement;
    // Accent — convert hex to oklch-ish by setting raw hex; also update dim
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-dim', hexToRgba(t.accent, 0.14));

    // Type scale
    const scales = {
      'Compact':  { mega: '12vw', display: '7.5vw', h1: '4vw' },
      'Default':  { mega: '14vw', display: '9vw',   h1: '5vw' },
      'Editorial':{ mega: '16vw', display: '11vw',  h1: '6vw' },
    };
    const s = scales[t.typeScale] || scales['Default'];
    root.style.setProperty('--t-mega',    `clamp(80px, ${s.mega}, 240px)`);
    root.style.setProperty('--t-display', `clamp(56px, ${s.display}, 140px)`);
    root.style.setProperty('--t-h1',      `clamp(40px, ${s.h1}, 80px)`);

    // Hero copy — 2-line layout: [headline] / [accent tail]
    const h1 = document.querySelector('.hero h1');
    if (h1) {
      h1.innerHTML = `
        <span class="line"><span class="line-inner">${escape(t.heroHeadline)}</span></span>
        <span class="line"><span class="line-inner"><span class="accent-word">${escape(t.heroAccent)}</span> ${escape(t.heroTail)}</span></span>
      `;
      // Re-trigger the reveal on the fresh nodes
      h1.classList.remove('in');
      requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add('in')));
    }



    // Grain
    document.body.style.setProperty('--_grain-op', t.grainOn ? '0.035' : '0');
    const style = document.getElementById('grain-toggle-style') || (() => {
      const s = document.createElement('style'); s.id = 'grain-toggle-style'; document.head.appendChild(s); return s;
    })();
    style.textContent = `body::before{opacity:${t.grainOn ? 0.035 : 0} !important;}`;
  }

  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function escape(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function TweaksApp() {
    const [t, setT] = useTweaks(DEFAULTS);
    useEffect(() => { applyTweaks(t); }, [t]);

    return (
      <TweaksPanel title="Tweaks">
        <TweakSection title="Brand">
          <TweakColor label="Accent" value={t.accent} onChange={(v) => setT({ accent: v })} />
        </TweakSection>

        <TweakSection title="Hero copy">
          <TweakText label="Line 1" value={t.heroHeadline} onChange={(v) => setT({ heroHeadline: v })} />
          <TweakText label="Accent word" value={t.heroAccent} onChange={(v) => setT({ heroAccent: v })} />
          <TweakText label="Line 2 + 3" value={t.heroTail} onChange={(v) => setT({ heroTail: v })} />
        </TweakSection>

        <TweakSection title="Type">
          <TweakSelect label="Scale" value={t.typeScale} options={['Compact', 'Default', 'Editorial']} onChange={(v) => setT({ typeScale: v })} />
        </TweakSection>

        <TweakSection title="Feel">
          <TweakSelect label="Cursor" value={t.cursorStyle} options={['Difference dot', 'Amber dot']} onChange={(v) => setT({ cursorStyle: v })} />
          <TweakToggle label="Film grain" value={t.grainOn} onChange={(v) => setT({ grainOn: v })} />
        </TweakSection>
      </TweaksPanel>
    );
  }

  const root = document.getElementById('tweaks-root');
  if (root) ReactDOM.createRoot(root).render(<TweaksApp />);
})();
