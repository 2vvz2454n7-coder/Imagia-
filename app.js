const form = document.querySelector('#creator-form');
const ideaInput = document.querySelector('#idea');
const charCount = document.querySelector('#char-count');
const durationSelect = document.querySelector('#duration');
const platformSelect = document.querySelector('#platform');
const previewDuration = document.querySelector('#preview-duration');
const previewPlatform = document.querySelector('#preview-platform');
const stageContent = document.querySelector('#stage-content');
const resultArea = document.querySelector('#result-area');
const projectList = document.querySelector('#project-list');
const projectsSection = document.querySelector('#projects');
const projectCount = document.querySelector('#project-count');
const toast = document.querySelector('#toast');
let selectedTone = 'Dynamique';
let creations = [];
let toastTimer;

ideaInput.addEventListener('input', () => {
  charCount.textContent = `${ideaInput.value.length} / 500`;
});

durationSelect.addEventListener('change', () => {
  previewDuration.textContent = `${durationSelect.value} sec`;
});
platformSelect.addEventListener('change', () => {
  previewPlatform.textContent = platformSelect.value;
});

document.querySelectorAll('.tone-option').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.tone-option.selected')?.classList.remove('selected');
    button.classList.add('selected');
    selectedTone = button.dataset.tone;
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function cleanTopic(text) {
  return text.trim().replace(/[.!?]+$/, '').replace(/^\p{L}/u, (letter) => letter.toLocaleUpperCase('fr'));
}

function createConcept(topic, duration, platform, tone) {
  const hooks = {
    Dynamique: `Tu veux découvrir ${topic.toLocaleLowerCase('fr')} ? Reste jusqu'à la fin !`,
    Éducative: `Voici ce qu'il faut savoir sur ${topic.toLocaleLowerCase('fr')}.`,
    Inspirante: `Et si ${topic.toLocaleLowerCase('fr')} changeait ta façon de voir les choses ?`,
    Humoristique: `On parle de ${topic.toLocaleLowerCase('fr')}… et ça va être plus simple que prévu !`
  };
  const seconds = Number(duration);
  const beats = seconds <= 15
    ? [['0–3 s', 'Accroche', hooks[tone]], ['3–11 s', 'Idée clé', `Présentez une idée concrète autour de : ${topic}.`], ['11–15 s', 'Conclusion', 'Terminez par une question et invitez à s’abonner.']]
    : seconds <= 30
      ? [['0–3 s', 'Accroche', hooks[tone]], ['3–10 s', 'Mise en contexte', `Posez le décor : pourquoi ${topic.toLocaleLowerCase('fr')} mérite votre attention.`], ['10–24 s', 'Valeur', `Développez deux ou trois conseils simples et concrets sur ${topic.toLocaleLowerCase('fr')}.`], ['24–30 s', 'Conclusion', 'Résumez le point essentiel et invitez les spectateurs à réagir.']]
      : [['0–4 s', 'Accroche', hooks[tone]], ['4–14 s', 'Mise en contexte', `Expliquez en une phrase pourquoi ${topic.toLocaleLowerCase('fr')} est intéressant.`], ['14–36 s', 'Développement', `Partagez trois idées ou exemples faciles à retenir autour de : ${topic}.`], ['36–52 s', 'À retenir', 'Reformulez le conseil le plus utile avec un exemple rapide.'], [`${seconds - 8}–${seconds} s`, 'Conclusion', 'Terminez avec un appel à l’action simple et naturel.']];
  return { hook: hooks[tone], script: beats.map(([time, title, line]) => `${time} · ${title}\n${line}`).join('\n\n'), beats, topic, duration, platform, tone };
}

function renderConcept(concept) {
  stageContent.innerHTML = `<div class="play-orb"><span>✦</span></div><p class="stage-title">${escapeHtml(concept.topic)}</p><p class="stage-subtitle">Concept prêt · ${escapeHtml(concept.tone)} · ${escapeHtml(concept.platform)}</p><div class="stage-decoration"><span>✳</span><span>✦</span><span>✧</span></div>`;
  resultArea.hidden = false;
  resultArea.innerHTML = `<div class="result-header"><strong>Le concept est prêt</strong><span>✦ ${concept.duration} SEC</span></div><p class="result-hook">« ${escapeHtml(concept.hook)} »</p><p class="result-script">${escapeHtml(concept.script)}</p><button class="copy-button" type="button" id="copy-script">Copier le script</button>`;
  document.querySelector('#copy-script').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`${concept.hook}\n\n${concept.script}`);
      showToast('Script copié dans le presse-papiers.');
    } catch {
      showToast('La copie n’est pas disponible dans ce navigateur.');
    }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function addProject(concept) {
  creations.unshift({ ...concept, createdAt: new Date() });
  projectCount.textContent = String(creations.length);
  projectsSection.hidden = false;
  projectList.innerHTML = creations.map((item) => `<article class="project-card"><strong>${escapeHtml(item.topic)}</strong><span>${escapeHtml(item.platform)} · ${item.duration} sec · ${escapeHtml(item.tone)}</span></article>`).join('');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const topic = cleanTopic(ideaInput.value);
  if (!topic) {
    ideaInput.focus();
    return;
  }
  const button = form.querySelector('.generate-button');
  const label = document.querySelector('#button-label');
  button.disabled = true;
  label.textContent = 'On imagine…';
  resultArea.hidden = true;
  setTimeout(() => {
    const concept = createConcept(topic, durationSelect.value, platformSelect.value, selectedTone);
    renderConcept(concept);
    addProject(concept);
    button.disabled = false;
    label.textContent = 'Imaginer ma vidéo';
    showToast('Votre concept vidéo est prêt !');
  }, 650);
});

document.querySelector('#idea-suggestion').addEventListener('click', () => {
  const ideas = [
    '3 astuces pour rendre son quotidien plus créatif',
    'Pourquoi prendre une pause peut aider à mieux travailler',
    'Une recette rapide à préparer avec seulement 3 ingrédients',
    'Les petits gestes qui rendent une routine matinale plus agréable'
  ];
  ideaInput.value = ideas[Math.floor(Math.random() * ideas.length)];
  ideaInput.dispatchEvent(new Event('input'));
  ideaInput.focus();
  showToast('Une idée pour vous lancer. À vous de la personnaliser !');
});

document.querySelector('#upgrade-button').addEventListener('click', () => showToast('Les offres Imagia arrivent bientôt.'));
document.querySelector('.help-button').addEventListener('click', () => showToast('Décrivez une idée, choisissez votre format, puis créez votre concept.'));
