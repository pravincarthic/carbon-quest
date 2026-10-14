(() => {
  "use strict";

  /* ---------- molecule builders (bond length = 1 unit) ---------- */
  const S3 = Math.sqrt(3) / 2;

  function chain(n, o = {}) {
    const lab = o.lab || {}, ord = o.ord || {}, sub = o.sub || [];
    const a = [], b = [];
    for (let i = 0; i < n; i++) {
      a.push([i * S3, i % 2 ? -0.5 : 0, lab[i] || ""]);
      if (i) b.push([i - 1, i, ord[i - 1] || 1]);
    }
    sub.forEach(([i, l, k]) => {
      const [x, y] = a[i];
      a.push([x, y + (i % 2 ? -1 : 1), l]);
      b.push([i, a.length - 1, k || 1]);
    });
    return { a, b };
  }

  function line(labels, ord = {}) {
    const a = labels.map((l, i) => [i, 0, l]);
    const b = [];
    for (let i = 1; i < labels.length; i++) b.push([i - 1, i, ord[i - 1] || 1]);
    return { a, b };
  }

  function ring(o = {}) {
    const a = [], b = [];
    for (let k = 0; k < 6; k++) {
      const t = (-90 + 60 * k) * Math.PI / 180;
      a.push([Math.cos(t), Math.sin(t), ""]);
    }
    for (let k = 0; k < 6; k++) b.push([k, (k + 1) % 6, o.arom && k % 2 === 0 ? 2 : 1, true]);
    (o.sub || []).forEach(([k, l, ord]) => {
      const [x, y] = a[k];
      a.push([x * 2, y * 2, l]);
      b.push([k, a.length - 1, ord || 1]);
    });
    return { a, b, rc: [0, 0] };
  }

  const MOL = {
    ethanol: chain(3, { lab: { 2: "OH" } }),
    propanal: chain(4, { lab: { 3: "O" }, ord: { 2: 2 } }),
    propanone: chain(3, { sub: [[1, "O", 2]] }),
    ethanoicAcid: chain(3, { lab: { 2: "OH" }, sub: [[1, "O", 2]] }),
    ethylEthanoate: chain(5, { lab: { 2: "O" }, sub: [[1, "O", 2]] }),
    ethanamine: chain(3, { lab: { 2: "NH₂" } }),
    ethanamide: chain(3, { lab: { 2: "NH₂" }, sub: [[1, "O", 2]] }),
    ethoxyethane: chain(5, { lab: { 2: "O" } }),
    propene: chain(3, { ord: { 0: 2 } }),
    but2yne: line(["", "", "", ""], { 1: 3 }),
    chloroethane: chain(3, { lab: { 2: "Cl" } }),
    phenol: ring({ arom: true, sub: [[0, "OH"]] }),
    benzene: ring({ arom: true }),
    ethanenitrile: line(["", "", "N"], { 1: 3 }),
    ethanoylChloride: chain(3, { lab: { 2: "Cl" }, sub: [[1, "O", 2]] }),
    ethanethiol: chain(3, { lab: { 2: "SH" } }),
    butan2ol: chain(4, { sub: [[1, "OH"]] }),
    methylpropane: chain(3, { sub: [[1, ""]] }),
    pentan3one: chain(5, { sub: [[2, "O", 2]] }),
    but1ene: chain(4, { ord: { 0: 2 } }),
    but2ene: chain(4, { ord: { 1: 2 } }),
    methylbutane: chain(4, { sub: [[1, ""]] }),
    butanoicAcid: chain(5, { lab: { 4: "OH" }, sub: [[3, "O", 2]] }),
    methylPropanoate: chain(5, { lab: { 3: "O" }, sub: [[2, "O", 2]] }),
    methylpentane3: chain(5, { sub: [[2, ""]] }),
    chloropropane2: chain(3, { sub: [[1, "Cl"]] }),
    cyclohexanol: ring({ sub: [[0, "OH"]] }),
    propan1amine: chain(4, { lab: { 3: "NH₂" } }),
    pent2ene: chain(5, { ord: { 1: 2 } }),
    propan1ol: chain(4, { lab: { 3: "OH" } }),
    tBuBr: { a: [[0, 0, ""], [-1, 0, ""], [1, 0, ""], [0, 1, ""], [0, -1, "Br"]], b: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
    cyclohexanone: ring({ sub: [[0, "O", 2]] })
  };

  /* ---------- question banks ---------- */
  const GROUP_WHY = {
    "Alcohol": "An OH group on an sp3 carbon makes an alcohol. Suffix: -ol.",
    "Aldehyde": "A C=O at the end of a chain, carrying one H, is an aldehyde. Suffix: -al.",
    "Ketone": "A C=O flanked by two carbons is a ketone. Suffix: -one.",
    "Carboxylic acid": "C=O and OH on the same carbon form a carboxyl group. Suffix: -oic acid.",
    "Ester": "C=O bonded to an O that leads to another carbon is an ester, RCOOR'. Suffix: -oate.",
    "Amine": "Nitrogen on an sp3 carbon with no adjacent C=O is an amine. Suffix: -amine.",
    "Amide": "Nitrogen bonded directly to a C=O carbon is an amide. Suffix: -amide.",
    "Ether": "Oxygen bridging two carbons, with no C=O, is an ether, R-O-R'.",
    "Alkene": "A carbon to carbon double bond marks an alkene. Suffix: -ene.",
    "Alkyne": "A carbon to carbon triple bond marks an alkyne. Its carbons are sp hybridized and linear.",
    "Alkyl halide": "A halogen (F, Cl, Br, I) on an sp3 carbon is an alkyl halide. Prefix: chloro-, bromo-.",
    "Phenol": "OH bonded directly to a benzene ring is a phenol. It is far more acidic than an alcohol (pKa about 10).",
    "Arene": "A planar six membered ring with six pi electrons is aromatic. Benzene is the parent arene.",
    "Nitrile": "A carbon triple bonded to nitrogen is a nitrile, R-C≡N. Suffix: -nitrile.",
    "Acyl chloride": "C=O with Cl on the same carbon is an acyl chloride, the most reactive acid derivative.",
    "Thiol": "SH on carbon is a thiol, the sulfur analogue of an alcohol. Suffix: -thiol."
  };
  const CONFUSE = {
    "Aldehyde": ["Ketone"], "Ketone": ["Aldehyde", "Ester"], "Carboxylic acid": ["Ester", "Alcohol"],
    "Ester": ["Ether", "Carboxylic acid", "Ketone"], "Amine": ["Amide"], "Amide": ["Amine", "Ketone"],
    "Ether": ["Ester", "Alcohol"], "Alkene": ["Alkyne", "Arene"], "Alkyne": ["Alkene", "Nitrile"],
    "Phenol": ["Alcohol", "Arene"], "Arene": ["Alkene"], "Nitrile": ["Alkyne", "Amine"],
    "Acyl chloride": ["Alkyl halide", "Carboxylic acid"], "Alcohol": ["Ether", "Phenol"],
    "Alkyl halide": ["Acyl chloride"], "Thiol": ["Alcohol"]
  };

  const FG = [
    ["ethanol", "Alcohol"], ["propanal", "Aldehyde"], ["propanone", "Ketone"], ["ethanoicAcid", "Carboxylic acid"],
    ["ethylEthanoate", "Ester"], ["ethanamine", "Amine"], ["ethanamide", "Amide"], ["ethoxyethane", "Ether"],
    ["propene", "Alkene"], ["but2yne", "Alkyne"], ["chloroethane", "Alkyl halide"], ["phenol", "Phenol"],
    ["benzene", "Arene"], ["ethanenitrile", "Nitrile"], ["ethanoylChloride", "Acyl chloride"], ["ethanethiol", "Thiol"]
  ];

  const NAMES = [
    ["butan2ol", "butan-2-ol", ["butan-1-ol", "butan-3-ol", "butan-2-one"], "Number from the end nearest the OH: it sits on C2. Never use the higher locant (3)."],
    ["methylpropane", "2-methylpropane", ["butane", "1-methylpropane", "2-methylbutane"], "Longest chain is 3 carbons with a methyl on C2. Four carbons total, but branched, so not butane."],
    ["pentan3one", "pentan-3-one", ["pentan-2-one", "pentanal", "pentan-3-ol"], "Five carbons, C=O in the middle at C3. A mid-chain C=O is a ketone, so -one."],
    ["but1ene", "but-1-ene", ["but-2-ene", "butane", "but-1-yne"], "Four carbons with the double bond starting at C1."],
    ["methylbutane", "2-methylbutane", ["3-methylbutane", "pentane", "2-methylpentane"], "Main chain of 4 carbons, numbered so the methyl gets locant 2, not 3."],
    ["butanoicAcid", "butanoic acid", ["propanoic acid", "butanal", "butan-1-ol"], "Count the carboxyl carbon: four carbons in total, so butanoic acid."],
    ["methylPropanoate", "methyl propanoate", ["propyl methanoate", "methyl ethanoate", "ethyl propanoate"], "Esters are named alkyl alkanoate. The O-side group is methyl, the C=O side has 3 carbons: propanoate."],
    ["methylpentane3", "3-methylpentane", ["2-ethylbutane", "3-methylbutane", "hexane"], "Longest chain is 5 carbons. The branch on C3 is a methyl. 2-ethylbutane picks a shorter chain."],
    ["chloropropane2", "2-chloropropane", ["1-chloropropane", "2-chloroethane", "2-chloropropene"], "Three carbon chain, Cl on the middle carbon, C2."],
    ["cyclohexanol", "cyclohexanol", ["phenol", "cyclohexanone", "hexan-1-ol"], "A saturated six membered ring with OH. No alternating double bonds, so not phenol."],
    ["propan1amine", "propan-1-amine", ["propanamide", "ethanamine", "propan-2-amine"], "Three carbons with NH2 on the terminal carbon. No C=O, so not an amide."],
    ["pent2ene", "pent-2-ene", ["pent-3-ene", "pent-1-ene", "pentane"], "Number from the end nearest the double bond: it starts at C2."]
  ];

  const RXN = [
    ["propene", ["HBr"], "2-bromopropane", ["1-bromopropane", "1,2-dibromopropane", "propan-2-ol"], "Markovnikov addition: H adds to the CH2 end, giving the more stable secondary carbocation, which Br traps."],
    ["propene", ["HBr", "ROOR, light"], "1-bromopropane", ["2-bromopropane", "1,2-dibromopropane", "propane"], "Peroxides start a radical chain. Br radical adds to the terminal carbon first, giving anti-Markovnikov product."],
    ["propene", ["1. BH₃·THF", "2. H₂O₂, NaOH"], "propan-1-ol", ["propan-2-ol", "propanal", "propane-1,2-diol"], "Hydroboration-oxidation: boron goes to the less hindered carbon, then is replaced by OH. Anti-Markovnikov, syn."],
    ["propene", ["Br₂", "CH₂Cl₂"], "1,2-dibromopropane", ["1-bromopropane", "2-bromopropane", "3-bromopropene"], "Halogen addition through a cyclic bromonium ion. Two Br add anti across the double bond."],
    ["propene", ["H₂", "Pd/C"], "propane", ["propyne", "propan-1-ol", "cyclopropane"], "Catalytic hydrogenation adds H2 across the C=C on the metal surface (syn addition)."],
    ["propan1ol", ["PCC", "CH₂Cl₂"], "propanal", ["propanoic acid", "propanone", "propene"], "PCC is a mild oxidant. It stops a primary alcohol at the aldehyde because no water is present."],
    ["propan1ol", ["H₂CrO₄", "(Jones)"], "propanoic acid", ["propanal", "propanone", "propyl chromate"], "Strong aqueous oxidants take a primary alcohol through the aldehyde hydrate to the carboxylic acid."],
    ["butan2ol", ["Na₂Cr₂O₇", "H₂SO₄"], "butan-2-one", ["butanal", "butanoic acid", "but-2-ene"], "Secondary alcohols oxidize to ketones and stop there. No C-H remains on the carbonyl carbon."],
    ["propanone", ["1. NaBH₄", "2. H₃O⁺"], "propan-2-ol", ["propan-1-ol", "propanal", "propane"], "Hydride adds to the carbonyl carbon. Protonation gives a secondary alcohol."],
    ["ethylEthanoate", ["1. LiAlH₄", "2. H₃O⁺"], "ethanol (two equivalents)", ["ethanoic acid + ethanol", "ethanal + ethanol", "ethoxyethane"], "LiAlH4 reduces the ester carbonyl twice. The acyl side becomes ethanol and the alkoxy side leaves as ethanol."],
    ["ethanoicAcid", ["CH₃OH", "H₂SO₄, heat"], "methyl ethanoate", ["ethyl methanoate", "methoxyethane", "ethanoic anhydride"], "Fischer esterification: acid catalysed, reversible. The methanol oxygen ends up in the ester."],
    ["benzene", ["Br₂", "FeBr₃"], "bromobenzene", ["1,2-dibromocyclohexane", "bromocyclohexane", "phenol"], "Electrophilic aromatic substitution. FeBr3 activates Br2. Aromaticity is restored, so no addition product."],
    ["benzene", ["HNO₃", "H₂SO₄"], "nitrobenzene", ["aniline", "phenol", "benzoic acid"], "Sulfuric acid generates the nitronium ion NO2+, which attacks the ring in an EAS reaction."],
    ["chloroethane", ["NaOH (aq)"], "ethanol", ["ethene", "ethoxyethane", "chloroethanol"], "Primary halide with a good nucleophile: SN2. Hydroxide attacks from the back and Cl leaves."],
    ["tBuBr", ["KOtBu", "heat"], "2-methylpropene", ["2-methylpropan-2-ol", "tert-butyl tert-butyl ether", "2-methylpropane"], "A bulky strong base on a tertiary halide: E2 elimination wins over substitution."],
    ["tBuBr", ["H₂O", "warm"], "2-methylpropan-2-ol", ["2-methylpropan-1-ol", "2-methylbutan-2-ol", "butan-2-ol"], "Tertiary halide in a polar protic solvent: SN1 through a tertiary carbocation that water traps."],
    ["but2yne", ["H₂", "Lindlar cat."], "cis-but-2-ene", ["trans-but-2-ene", "butane", "but-1-ene"], "Lindlar's poisoned catalyst stops at the alkene and adds both H on the same face: cis."],
    ["but2yne", ["Na", "NH₃ (l)"], "trans-but-2-ene", ["cis-but-2-ene", "butane", "butan-2-amine"], "Dissolving metal reduction goes through a radical anion that prefers the trans geometry."],
    ["propanal", ["1. CH₃MgBr", "2. H₃O⁺"], "butan-2-ol", ["butan-1-ol", "butan-2-one", "propan-1-ol"], "The Grignard carbon attacks the aldehyde carbonyl. A new C-C bond forms and an aldehyde gives a secondary alcohol."],
    ["ethanenitrile", ["H₃O⁺", "heat"], "ethanoic acid", ["ethanamine", "ethanal", "ethanol"], "Acid hydrolysis converts the nitrile to an amide and then to the carboxylic acid plus NH4+."],
    ["but2ene", ["1. O₃", "2. (CH₃)₂S"], "ethanal (two equivalents)", ["ethanoic acid", "butane-2,3-diol", "propanone"], "Ozonolysis cleaves the C=C. Each half becomes a carbonyl. Reductive workup stops at the aldehyde."],
    ["ethanoylChloride", ["NH₃ (excess)"], "ethanamide", ["ethanamine", "ethanoic acid", "chloroethane"], "Nucleophilic acyl substitution: NH3 adds to C=O, then chloride, a good leaving group, departs."]
  ];

  const MODES = {
    groups: { name: "Functional Groups", formula: "R–OH  R–CHO  R–NH₂", blurb: "Spot the group that sets a molecule's reactivity.", tint: "var(--oxygen)" },
    naming: { name: "Name It", formula: "but-2-ene", blurb: "Pick the correct IUPAC name for each skeletal structure.", tint: "var(--nitrogen)" },
    reactions: { name: "Reactions", formula: "A  →  B", blurb: "Read the reagents over the arrow and predict the major product.", tint: "var(--chlorine)" },
    mixed: { name: "Mixed Mastery", formula: "all of it", blurb: "A shuffled round drawn from every bank. Exam warmup.", tint: "var(--gold)" }
  };

  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  function buildFG([key, ans]) {
    const pool = shuffle(Object.keys(GROUP_WHY).filter(g => g !== ans));
    const picks = (CONFUSE[ans] || []).slice(0, 2);
    for (const g of pool) { if (picks.length >= 3) break; if (!picks.includes(g)) picks.push(g); }
    return { type: "Functional Groups", prompt: "Which functional group is this?", mol: MOL[key], options: shuffle([ans, ...picks]), answer: ans, why: GROUP_WHY[ans] };
  }
  const buildName = ([key, ans, d, why]) => ({ type: "Name It", prompt: "What is the IUPAC name?", mol: MOL[key], options: shuffle([ans, ...d]), answer: ans, why });
  const buildRxn = ([key, reagent, ans, d, why]) => ({ type: "Reactions", prompt: "Predict the major organic product.", mol: MOL[key], reagent, options: shuffle([ans, ...d]), answer: ans, why });

  function makeRound(mode) {
    if (mode === "groups") return shuffle(FG).slice(0, 10).map(buildFG);
    if (mode === "naming") return shuffle(NAMES).slice(0, 10).map(buildName);
    if (mode === "reactions") return shuffle(RXN).slice(0, 10).map(buildRxn);
    return shuffle([
      ...shuffle(FG).slice(0, 4).map(buildFG),
      ...shuffle(NAMES).slice(0, 3).map(buildName),
      ...shuffle(RXN).slice(0, 5).map(buildRxn)
    ]).slice(0, 10);
  }

  /* ---------- drawing ---------- */
  const $ = id => document.getElementById(id);
  const canvas = $("stage");
  const ctx = canvas.getContext("2d");
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function atomColor(l) {
    if (l.startsWith("Cl")) return css("--chlorine");
    if (l.startsWith("Br")) return css("--bromine");
    if (l.startsWith("O")) return css("--oxygen");
    if (l.startsWith("N")) return css("--nitrogen");
    if (l.startsWith("S")) return css("--sulfur");
    return css("--ink");
  }

  function drawMol(mol, box, p) {
    const xs = mol.a.map(a => a[0]), ys = mol.a.map(a => a[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const bw = Math.max(maxX - minX, 0.01), bh = Math.max(maxY - minY, 0.01);
    const sc = Math.min(48, (box.w - 56) / bw, (box.h - 56) / bh);
    const ox = box.x + box.w / 2 - (minX + bw / 2) * sc;
    const oy = box.y + box.h / 2 - (minY + bh / 2) * sc;
    const P = mol.a.map(([x, y, l]) => ({ x: ox + x * sc, y: oy + y * sc, l }));
    const rc = mol.rc ? { x: ox + mol.rc[0] * sc, y: oy + mol.rc[1] * sc } : null;

    ctx.lineCap = "round";
    ctx.strokeStyle = css("--bond");
    ctx.lineWidth = 2.6;
    const shown = Math.ceil(mol.b.length * Math.min(1, p / 0.75));
    mol.b.slice(0, shown).forEach(([i, j, ord, inRing]) => {
      let A = P[i], B = P[j];
      const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      const cutA = A.l ? 12 + A.l.length * 2 : 0, cutB = B.l ? 12 + B.l.length * 2 : 0;
      const a = { x: A.x + ux * cutA, y: A.y + uy * cutA }, b = { x: B.x - ux * cutB, y: B.y - uy * cutB };
      const nx = -uy, ny = ux;
      const seg = (o, shrink = 0) => {
        ctx.beginPath();
        ctx.moveTo(a.x + nx * o + ux * shrink, a.y + ny * o + uy * shrink);
        ctx.lineTo(b.x + nx * o - ux * shrink, b.y + ny * o - uy * shrink);
        ctx.stroke();
      };
      if (ord === 1) seg(0);
      else if (ord === 2 && inRing && rc) {
        seg(0);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const side = ((rc.x - mx) * nx + (rc.y - my) * ny) > 0 ? 1 : -1;
        seg(side * 7, len * 0.14);
      } else if (ord === 2) { seg(-3.6); seg(3.6); }
      else { seg(0); seg(-5); seg(5); }
    });

    if (p > 0.55) {
      ctx.globalAlpha = Math.min(1, (p - 0.55) / 0.3);
      ctx.font = "700 19px 'JetBrains Mono', ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      P.forEach(pt => {
        if (!pt.l) return;
        ctx.fillStyle = atomColor(pt.l);
        ctx.fillText(pt.l, pt.x, pt.y + 1);
      });
      ctx.globalAlpha = 1;
    }
  }

  function drawReaction(q, W, H, p) {
    const narrow = W < 520;
    const leftW = W * (narrow ? 0.46 : 0.5), arrowW = W * (narrow ? 0.26 : 0.22);
    drawMol(q.mol, { x: 0, y: 0, w: leftW, h: H }, p);
    const ax = leftW + 6, bx = leftW + arrowW - 6, ay = H / 2;
    ctx.strokeStyle = css("--gold");
    ctx.fillStyle = css("--gold");
    ctx.lineWidth = 2.4;
    const t = Math.min(1, p * 1.4);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + (bx - ax) * t, ay); ctx.stroke();
    if (t >= 1) {
      ctx.beginPath(); ctx.moveTo(bx, ay); ctx.lineTo(bx - 11, ay - 6); ctx.lineTo(bx - 11, ay + 6); ctx.closePath(); ctx.fill();
    }
    const fs = narrow ? 11 : 13;
    ctx.font = `600 ${fs}px 'JetBrains Mono', ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = css("--ink");
    const mid = (ax + bx) / 2;
    q.reagent.forEach((r, i) => {
      const above = i === 0 || q.reagent.length === 1;
      ctx.fillText(r, mid, above ? ay - 12 : ay + 12 + fs * (i - 0.2) + 4, arrowW - 4);
    });
    const px = leftW + arrowW + 8, pw = W - px - 10, ph = Math.min(H - 40, 140);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = css("--muted");
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(px, ay - ph / 2, pw, ph, 12) : ctx.rect(px, ay - ph / 2, pw, ph);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "800 48px 'Bricolage Grotesque', system-ui, sans-serif";
    ctx.fillStyle = css("--muted");
    ctx.textBaseline = "middle";
    ctx.fillText("?", px + pw / 2, ay + 2);
  }

  let anim = null;
  function render(q, animate) {
    cancelAnimationFrame(anim);
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const start = performance.now(), dur = animate && !reduceMotion ? 650 : 0;
    const frame = now => {
      const p = dur ? Math.min(1, (now - start) / dur) : 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (q.reagent) drawReaction(q, W, H, p); else drawMol(q.mol, { x: 0, y: 0, w: W, h: H }, p);
      if (p < 1) anim = requestAnimationFrame(frame);
    };
    anim = requestAnimationFrame(frame);
  }

  /* ---------- game state ---------- */
  const TIME = 20;
  let S = null;

  const store = {
    get(k) { try { return Number(localStorage.getItem("cq-" + k)) || 0; } catch (e) { return 0; } },
    set(k, v) { try { localStorage.setItem("cq-" + k, String(v)); } catch (e) { /* storage unavailable */ } }
  };

  function show(id) {
    ["home", "play", "end"].forEach(s => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function renderModes() {
    $("modes").innerHTML = "";
    Object.entries(MODES).forEach(([key, m]) => {
      const b = document.createElement("button");
      b.className = "mode";
      b.type = "button";
      b.style.setProperty("--tint", m.tint);
      const best = store.get(key);
      b.innerHTML = `<span class="formula">${m.formula}</span><h3>${m.name}</h3><p>${m.blurb}</p><span class="best">${best ? "Best " + best : "Not played yet"}</span>`;
      b.addEventListener("click", () => start(key));
      $("modes").appendChild(b);
    });
  }

  function start(mode) {
    S = { mode, qs: makeRound(mode), i: 0, score: 0, streak: 0, bestStreak: 0, lives: 3, right: 0, answered: 0, missed: [], locked: false };
    $("hudMode").textContent = MODES[mode].name;
    show("play");
    ask();
  }

  function hud() {
    $("hudQ").textContent = `Q ${S.i + 1}/${S.qs.length}`;
    $("score").textContent = S.score;
    $("streak").textContent = S.streak > 1 ? `×${S.streak}` : "";
    $("lives").innerHTML = [0, 1, 2].map(k => `<span class="life${k >= S.lives ? " lost" : ""}"></span>`).join("");
  }

  let timerRAF = null, deadline = 0;
  function runTimer() {
    cancelAnimationFrame(timerRAF);
    deadline = performance.now() + TIME * 1000;
    const tick = now => {
      const left = Math.max(0, deadline - now) / 1000;
      const fill = $("timerFill");
      fill.style.width = (left / TIME * 100) + "%";
      fill.classList.toggle("low", left < 5);
      if (left <= 0) { answer(null); return; }
      if (!S.locked) timerRAF = requestAnimationFrame(tick);
    };
    timerRAF = requestAnimationFrame(tick);
  }

  function ask() {
    const q = S.qs[S.i];
    S.locked = false;
    hud();
    $("prompt").textContent = q.prompt;
    $("feedback").hidden = true;
    const box = $("options");
    box.innerHTML = "";
    q.options.forEach((o, k) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.type = "button";
      b.id = "opt" + k;
      b.innerHTML = `<span class="k">${k + 1}</span><span class="t"></span>`;
      b.querySelector(".t").textContent = o;
      b.addEventListener("click", () => answer(o));
      box.appendChild(b);
    });
    render(q, true);
    runTimer();
  }

  function answer(choice) {
    if (S.locked) return;
    S.locked = true;
    cancelAnimationFrame(timerRAF);
    const q = S.qs[S.i];
    const left = Math.max(0, deadline - performance.now()) / 1000;
    const ok = choice === q.answer;
    S.answered++;
    [...$("options").children].forEach(b => {
      const t = b.querySelector(".t").textContent;
      b.disabled = true;
      if (t === q.answer) b.classList.add("right");
      else if (t === choice) b.classList.add("wrong");
      else b.classList.add("dim");
    });
    const v = $("verdict");
    if (ok) {
      S.right++;
      S.streak++;
      S.bestStreak = Math.max(S.bestStreak, S.streak);
      const mult = Math.min(1 + (S.streak - 1) * 0.25, 2);
      const pts = Math.round((100 + left * 5) * mult);
      S.score += pts;
      v.textContent = `Correct  +${pts}` + (mult > 1 ? `  (streak ×${mult})` : "");
      v.className = "verdict good";
    } else {
      S.streak = 0;
      S.lives--;
      S.missed.push(q);
      v.textContent = choice === null ? `Time's up. Answer: ${q.answer}` : `Not quite. Answer: ${q.answer}`;
      v.className = "verdict bad";
    }
    $("why").textContent = q.why;
    const last = S.lives <= 0 || S.i >= S.qs.length - 1;
    $("next").textContent = last ? "See results" : "Next question";
    $("feedback").hidden = false;
    hud();
    $("next").focus({ preventScroll: true });
  }

  function next() {
    if (!S || !S.locked) return;
    if (S.lives <= 0 || S.i >= S.qs.length - 1) return finish();
    S.i++;
    ask();
  }

  function finish() {
    const acc = Math.round(S.right / Math.max(1, S.answered) * 100);
    const tier = S.lives > 0 && acc >= 90 ? "gold" : acc >= 70 ? "silver" : "bronze";
    const titles = { gold: "Reaction master", silver: "Solid synthesis", bronze: S.lives > 0 ? "Keep titrating" : "Out of lives" };
    const prev = store.get(S.mode);
    if (S.score > prev) store.set(S.mode, S.score);
    $("medal").src = `assets/medal-${tier}.png`;
    $("medal").alt = tier + " medal";
    $("endMode").textContent = MODES[S.mode].name;
    $("endTitle").textContent = titles[tier];
    $("endScore").textContent = S.score;
    $("endAcc").textContent = acc + "%";
    $("endStreak").textContent = S.bestStreak;
    $("endBest").textContent = Math.max(prev, S.score);
    const list = $("review");
    list.innerHTML = "";
    S.missed.forEach(q => {
      const li = document.createElement("li");
      const head = q.reagent ? `${q.type}: ${q.reagent.join(", ")}` : q.type;
      li.innerHTML = `<span></span> → <b></b><small></small>`;
      li.querySelector("span").textContent = head;
      li.querySelector("b").textContent = q.answer;
      li.querySelector("small").textContent = q.why;
      list.appendChild(li);
    });
    $("reviewWrap").hidden = S.missed.length === 0;
    show("end");
  }

  /* ---------- wiring ---------- */
  $("next").addEventListener("click", next);
  $("again").addEventListener("click", () => start(S.mode));
  $("menu").addEventListener("click", () => { renderModes(); show("home"); });
  $("quit").addEventListener("click", () => { cancelAnimationFrame(timerRAF); renderModes(); show("home"); });
  document.addEventListener("keydown", e => {
    if ($("play").hidden || !S) return;
    if (!S.locked && /^[1-4]$/.test(e.key)) {
      const b = $("opt" + (Number(e.key) - 1));
      if (b) b.click();
    } else if (S.locked && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      next();
    }
  });
  window.addEventListener("resize", () => { if (S && !$("play").hidden) render(S.qs[S.i], false); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (S && !$("play").hidden) render(S.qs[S.i], false); });

  renderModes();
})();
