import { BRADEN, DOWNTON, GCS } from "./scales/definitions.js";
import { el, formatPercent, mapBadgeClass } from "./utils.js";

const SCALES = [BRADEN, DOWNTON, GCS];
const root = document.getElementById("app");

/* @tweakable Footer disclaimer text shown in app footer; set to empty string to hide */
const DISCLAIMER = "";

/* @tweakable Texto corto mostrado bajo el título en la cabecera */
const SUBTITLE = "Evaluaciones clínicas";

/** 
 * @tweakable Animation timing for UI microinteractions (ms)
 * Adjust to make option selection feel faster/slower.
 */
const UI_ANIMATION_MS = 150;

/* @tweakable Label for the button that returns to the home screen */
const RESTART_LABEL = "Volver al inicio";

/* @tweakable Class(es) applied to the restart button (make it blue) */
const RESTART_BTN_CLASS = "btn-ghost btn-link-blue";

/* @tweakable Class(es) applied to the 'Anterior' nav button (controls its color/appearance) */
const PREV_BTN_CLASS = "btn-ghost btn-link-blue";

/* @tweakable Margin-left (px) applied to print button to increase separation */
const PRINT_BTN_MARGIN_PX = 12;

/* @tweakable Enable persistence of theme (stores 'dark'|'light' in localStorage) */
const THEME_PERSIST = true;

/* @tweakable LocalStorage key used for theme persistence (Tailwind-style) */
const THEME_STORAGE_KEY = "carescale-theme";

/* @tweakable Path to footer logo image (relative to project root) */
const FOOTER_LOGO_SRC = "angio logo.png";
/* @tweakable Footer logo opacity (0-1) */
const FOOTER_LOGO_OPACITY = 0.85;

/* @tweakable SECOND footer logo path (Universidad de los Llanos) */
/* @tweakable Path to the secondary footer logo image (replace to switch logos) */
const SECOND_FOOTER_LOGO_SRC = "unillanos logo (1).png";
/* @tweakable SECOND footer logo opacity (0-1) */
const SECOND_FOOTER_LOGO_OPACITY = 0.9;

/* @tweakable Shared footer logo width in pixels — keeps both logos visually consistent */
const FOOTER_LOGO_COMMON_WIDTH_PX = 130;
/* @tweakable Shared footer logo max height in pixels to avoid cropping in short containers */
const FOOTER_LOGO_MAX_HEIGHT_PX = 56;

/* @tweakable Header logo path (used by the vanilla JS header renderer) */
const HEADER_LOGO_SRC = "logo app.png";
/* @tweakable Header logo size in pixels (keeps parity with React header) */
const HEADER_LOGO_SIZE_PX = 56;

/* @tweakable Size in pixels for the small badge shown on each scale card (was 56) */
const CARD_BADGE_SIZE_PX = 80;
/* @tweakable When true the badge will be circular; set to false to use a rounded-rectangle */
const CARD_BADGE_ROUNDED = false;

/* @tweakable Path to Braden badge image (replaces the letter shown on the Braden card) */
const BRADEN_BADGE_SRC = "braden logo.png";
/* @tweakable Width/height (px) used for the Braden badge image */
const BRADEN_BADGE_SIZE_PX = 80;

/* @tweakable Path to Downton badge image (replace to switch logos) */
const DOWNTON_BADGE_SRC = "62a60da5-9cd7-4c5d-bf73-d18b6277c5d2.png"; /* @tweakable Downton badge path */
/* @tweakable Width/height (px) used for the Downton badge image */
const DOWNTON_BADGE_SIZE_PX = 80;

/* @tweakable Path to GCS badge image (replaces the single-letter "E" on the GCS card) */
const GCS_BADGE_SRC = "d815bfe7-9762-4dd6-a29e-4e35457594e0.png";
/* @tweakable Width/height (px) used for the GCS badge image */
const GCS_BADGE_SIZE_PX = 80;

function header() {
  const h = el("div", {classes:"header topbar"},
    el("div",{classes:"brand"}, 
      el("div",{classes:"logo"}, el("img",{src:HEADER_LOGO_SRC, alt:"CareScale", style:`width:${HEADER_LOGO_SIZE_PX}px;height:${HEADER_LOGO_SIZE_PX}px;border-radius:999px;object-fit:cover;`})), 
      el("div",{classes:"",}, el("div",{classes:"title"},"CareScale"), el("div",{classes:"subtitle"}, SUBTITLE))),
    el("div",{classes:"controls"},
      (function(){
        const btn = el("button",{classes:"btn-toggle", onclick:toggleTheme, title:"Modo oscuro (alternar)", "aria-label":"Alternar modo oscuro"}, el("span",{html:"🌗"}), el("span",{classes:"visually-hidden"},"Modo oscuro"));
        return btn;
      })()
    )
  );
  return h;
}

function toggleTheme(){
  // toggle using documentElement.classList for Tailwind dark mode
  const isDarkNow = document.documentElement.classList.toggle("dark");
  if (THEME_PERSIST) try { localStorage.setItem(THEME_STORAGE_KEY, isDarkNow ? "dark" : "light"); } catch(e){}
}

// apply saved theme on load (respects THEME_PERSIST)
// migrated to use documentElement.classList and THEME_STORAGE_KEY (Tailwind 'dark' strategy)
if (THEME_PERSIST) {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark") document.documentElement.classList.add("dark");
    else if (saved === "light") document.documentElement.classList.remove("dark");
  } catch(e){}
}

function homeView(){
  const container = el("div", {},
    header(),
    el("div",{classes:"hero"},
      el("h1",{}, "Evalúa escalas clínicas en segundos"),
      el("p",{}, "Braden, Downton y Glasgow con explicaciones por ítem y resultados inmediatos.")
    ),
    el("section",{classes:"grid", role:"list", "aria-label":"Escalas disponibles"}, ...SCALES.map(sc => cardForScale(sc))),
    // footer disclaimer (render only if present)
    DISCLAIMER ? el("div",{classes:"footer"}, el("div",{classes:"help"}, DISCLAIMER)) : null,
    // footer logo (always render, tweakable via constants)
    el("div",{classes:"footer footer-logo-wrap"}, 
      el("img",{src:FOOTER_LOGO_SRC, style:`width:${FOOTER_LOGO_COMMON_WIDTH_PX}px;max-height:${FOOTER_LOGO_MAX_HEIGHT_PX}px;object-fit:contain;opacity:${FOOTER_LOGO_OPACITY};`, alt:"Avidanti Angiografía de Colombia"}),
      el("img",{src:SECOND_FOOTER_LOGO_SRC, style:`width:${FOOTER_LOGO_COMMON_WIDTH_PX}px;max-height:${FOOTER_LOGO_MAX_HEIGHT_PX}px;object-fit:contain;opacity:${SECOND_FOOTER_LOGO_OPACITY};`, alt:"Universidad de los Llanos"})
    )
  );
  return container;
}

function cardForScale(scale){
  const t = document.getElementById("card-template");
  const node = t.content.cloneNode(true);
  const art = node.querySelector("article");
  art.querySelector(".card-title").textContent = scale.title;
  art.querySelector(".card-desc").textContent = scale.desc;
  // decorate card with subtle gradient badge and meta chips
  const badgeStyle = `width:${CARD_BADGE_SIZE_PX}px;height:${CARD_BADGE_SIZE_PX}px;display:flex;align-items:center;justify-content:center;font-weight:700;
    border-radius:${CARD_BADGE_ROUNDED ? "999px" : "12px"};font-size:1.05rem;
    background:transparent;color:var(--primary);border:1px solid rgba(14,165,233,0.12);box-shadow:none;`;
  let badge;
  if (scale.key === "BRADEN" && BRADEN_BADGE_SRC) {
    // use provided Braden logo image instead of single-letter badge
    badge = el("div",{classes:"scale-badge", style:badgeStyle},
      el("img",{src:BRADEN_BADGE_SRC, alt: scale.title + " logo", style:`width:${BRADEN_BADGE_SIZE_PX}px;height:${BRADEN_BADGE_SIZE_PX}px;object-fit:contain;border-radius:0;`} )
    );
  } else if (scale.key === "DOWNTON" && DOWNTON_BADGE_SRC) {
    // use provided Downton logo image instead of the leading "Í" letter
    badge = el("div",{classes:"scale-badge", style:badgeStyle},
      el("img",{src:DOWNTON_BADGE_SRC, alt: scale.title + " logo", style:`width:${DOWNTON_BADGE_SIZE_PX}px;height:${DOWNTON_BADGE_SIZE_PX}px;object-fit:contain;border-radius:8px;`} )
    );
  } else if (scale.key === "GCS" && GCS_BADGE_SRC) {
    // replace the "E" badge for GCS with the provided icon image
    badge = el("div",{classes:"scale-badge", style:badgeStyle},
      el("img",{src:GCS_BADGE_SRC, alt: scale.title + " icon", style:`width:${GCS_BADGE_SIZE_PX}px;height:${GCS_BADGE_SIZE_PX}px;object-fit:contain;border-radius:8px;`} )
    );
  } else {
    badge = el("div",{classes:"scale-badge", style:badgeStyle}, scale.title[0] || "–");
  }
  art.insertBefore(badge, art.firstElementChild);
  art.querySelector(".evaluate-btn").addEventListener("click", ()=> navigateToWizard(scale));
  art.addEventListener("keypress", (e)=> { if(e.key==="Enter") navigateToWizard(scale) });
  return node;
}

function navigateToWizard(scale){
  history.pushState({view:"wizard", scale:scale.key}, "", `#${scale.key.toLowerCase()}`);
  renderWizard(scale);
}

function renderWizard(scale){
  root.innerHTML = "";
  root.appendChild(header());
  const wizard = el("div",{classes:"wizard", role:"form", "aria-label":`${scale.title} — evaluador`});
  const totalSteps = scale.items.length;
  const state = { step:0, answers:{} };

  const progressWrap = el("div",{classes:"progress", "aria-hidden":"false"}, el("i",{}));
  const stepTitle = el("h2",{classes:"step-title"},"");
  const stepDesc = el("p",{classes:"step-desc"},"");
  const optionsWrap = el("div",{classes:"options", role:"radiogroup"});
  const nav = el("div",{classes:"nav"},
    el("div",{}, el("button",{classes:PREV_BTN_CLASS, onclick:()=> prevStep(), "aria-label":"Anterior"}, "Anterior")),
    el("div",{}, el("button",{classes:"btn primary", onclick:()=> nextStep(), "aria-label":"Siguiente"}, "Siguiente"))
  );

  wizard.appendChild(progressWrap);
  wizard.appendChild(stepTitle);
  wizard.appendChild(stepDesc);
  wizard.appendChild(optionsWrap);
  wizard.appendChild(nav);

  root.appendChild(wizard);

  function renderStep(){
    const i = scale.items[state.step];
    progressWrap.firstElementChild.style.width = formatPercent(((state.step)/totalSteps)*100);
    stepTitle.textContent = `${state.step+1}. ${i.title}`;
    stepDesc.textContent = i.desc;
    optionsWrap.innerHTML = "";
    i.options.forEach((opt, idx)=>{
      const optEl = el("button",{classes:"option", role:"radio", "aria-checked":"false", tabindex:"0"});
      const left = el("div",{classes:"left"}, el("div",{classes:"opt-label"}, opt.label), el("div",{classes:"help"}, opt.help || ""));
      const right = el("div",{}, el("div",{classes:"badge"} , String(opt.score)));
      optEl.appendChild(left); optEl.appendChild(right);
      optEl.addEventListener("click", ()=> selectOption(i.key, opt.score, opt.label));
      optEl.addEventListener("keypress", (e)=> { if(e.key==="Enter") selectOption(i.key,opt.score,opt.label) });
      // reflect selection state
      const selected = state.answers[i.key] && state.answers[i.key].score === opt.score;
      if(selected) optEl.setAttribute("aria-checked","true");
      optionsWrap.appendChild(optEl);
    });
    // update nav buttons
    nav.querySelectorAll("button")[0].disabled = state.step===0;
    nav.querySelectorAll("button")[1].textContent = (state.step===totalSteps-1) ? "Finalizar" : "Siguiente";
  }

  function selectOption(itemKey, score, label){
    state.answers[itemKey] = {score, label};
    // mark radio states
    [...optionsWrap.children].forEach(btn=>{
      const badge = btn.querySelector(".badge").textContent;
      btn.setAttribute("aria-checked", badge==String(score) ? "true" : "false");
    });
    // auto advance after small delay for faster workflow
    setTimeout(()=> {
      if(state.step < totalSteps-1) { state.step++; renderStep(); }
      else finalize();
    }, UI_ANIMATION_MS);
  }

  function prevStep(){ if(state.step>0){ state.step--; renderStep(); } }
  function nextStep(){ 
    // require answer for current step before next
    const curKey = scale.items[state.step].key;
    if(!state.answers[curKey]) { alert("Seleccione una opción para continuar."); return; }
    if(state.step<totalSteps-1){ state.step++; renderStep(); } else finalize();
  }

  function finalize(){
    // compute totals using provided computeTotal
    const detailScores = {};
    for(const k in state.answers) detailScores[k] = state.answers[k].score;
    const total = scale.computeTotal(detailScores);
    const cls = scale.classify(total, detailScores);
    renderResult(scale, total, cls, state.answers);
  }

  renderStep();
}

function renderResult(scale, total, cls, answers){
  root.innerHTML = "";
  root.appendChild(header());
  const container = el("div",{},
    el("h2",{}, scale.title),
    el("p",{classes:"left-compact"}, scale.desc)
  );

  // result header emphasis
  const summaryWrap = el("div",{classes:"summary"});
  const left = el("div",{},
    el("div",{classes:"card"}, el("h3",{}, "Resultado"), el("div",{classes:"kv"}, el("div",{classes:"badge "+mapBadgeClass(cls.level)}, cls.label), el("div", {classes:"kv"}, el("strong",{}, `Puntaje total: ${total}`)))),
    el("div",{classes:"breakdown"}, el("h4",{}, "Desglose por ítem"), ...scale.items.map(it=>{
      const sel = answers[it.key] ? `${answers[it.key].label} — ${answers[it.key].score}` : "No evaluado";
      return el("div", {classes:"card"}, el("strong",{}, it.title), el("div",{classes:"help"}, it.desc), el("div",{classes:"left-compact"}, sel));
    }))
  );

  const right = el("div",{classes:"card"},
    el("h4",{}, "Recomendaciones orientativas"),
    el("p",{classes:"help"}, scale.recommendations ? (scale.recommendations[cls.level] || "") : ""),
    el("div",{classes:"print-actions"},
      el("button",{classes:RESTART_BTN_CLASS, onclick:()=> restart()}, RESTART_LABEL),
      el("button",{classes:"btn primary", onclick:()=> window.print(), style:`margin-left:${PRINT_BTN_MARGIN_PX}px`}, "Imprimir / Guardar PDF")
    )
  );

  summaryWrap.appendChild(left);
  summaryWrap.appendChild(right);
  container.appendChild(summaryWrap);
  // add footer only when DISCLAIMER is non-empty
  if (DISCLAIMER) container.appendChild(el("div",{classes:"footer"}, el("div",{classes:"help"}, DISCLAIMER)));
  // footer logo for result page as well
  container.appendChild(el("div",{classes:"footer footer-logo-wrap"}, 
    el("img",{src:FOOTER_LOGO_SRC, style:`width:${FOOTER_LOGO_COMMON_WIDTH_PX}px;max-height:${FOOTER_LOGO_MAX_HEIGHT_PX}px;object-fit:contain;opacity:${FOOTER_LOGO_OPACITY};`, alt:"Avidanti Angiografía de Colombia"}),
    el("img",{src:SECOND_FOOTER_LOGO_SRC, style:`width:${FOOTER_LOGO_COMMON_WIDTH_PX}px;max-height:${FOOTER_LOGO_MAX_HEIGHT_PX}px;object-fit:contain;opacity:${SECOND_FOOTER_LOGO_OPACITY};`, alt:"Universidad de los Llanos"})
  ));
  root.appendChild(container);
}

function restart(){
  history.pushState({}, "", "#");
  renderHome();
}

function renderHome(){
  root.innerHTML = "";
  root.appendChild(homeView());
}

window.addEventListener("popstate", (e)=>{
  const s = location.hash.replace("#","");
  if(!s) renderHome();
  else {
    const found = SCALES.find(x=> x.key.toLowerCase()===s);
    if(found) renderWizard(found);
    else renderHome();
  }
});

renderHome();