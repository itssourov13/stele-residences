import { PROJECT as C } from '../content/project.js';
import { StatBlock } from '../components/stat-block.js';
import { T } from '../i18n/index.js';

export function render() {
  return `<section class="figures section" id="figures" aria-label="${C.schedule.label.en}">
  <div class="wrap">
    <div class="figures__grid">${C.figures.map((f) => StatBlock({ value: f.value, unit: f.unit, label: f.label })).join('')}</div>
    <p class="plate figures__plate"><span class="plate__rule" aria-hidden="true"></span><span class="plate__label">${T(C.schedule.label)}</span></p>
    <ol class="schedule">${C.schedule.steps.map((s) => `<li class="schedule__step${s.done ? ' is-done' : ''}"><b class="mono">${s.when}</b><span>${T(s.title)}</span><em>${T(s.status)}</em></li>`).join('')}</ol>
  </div>
</section>`;
}
