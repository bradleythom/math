/* ==========================================================================
   THE 115-MARK GAUNTLET - GAMEPLAY ENGINE & SYNTHESIZER
   ========================================================================== */

// 1. Question Bank Database
const QUESTIONS = [
  // ==================== SECTOR 1: BIOLOGY HUB (15 Marks) ====================
  {
    sector: 1,
    sectorName: "Biology Hub",
    marks: 5,
    question: "Euglena is a unicellular eukaryotic organism that shares characteristics with plants, but also differs significantly. Which of the following structures is present in Euglena but absent in a typical terrestrial plant cell?",
    options: [
      "Chloroplast",
      "Flagellum",
      "Nucleus",
      "Cell Membrane"
    ],
    correctIndex: 1,
    explanation: "Euglena is motile and possesses a whip-like flagellum for movement, whereas typical terrestrial plant cells are stationary and lack flagella. Both possess chloroplasts (for photosynthesis), nuclei, and cell membranes."
  },
  {
    sector: 1,
    sectorName: "Biology Hub",
    marks: 5,
    question: "Which of the following digestive organs is correctly matched with its primary physiological function in the human body?",
    options: [
      "Stomach - Main site of nutrient absorption into the blood",
      "Large Intestine - Absorption of water and mineral salts from undigested food residue",
      "Small Intestine - Storage of feces and production of concentrated hydrochloric acid",
      "Esophagus - Mechanical digestion of proteins using specialized protease enzymes"
    ],
    correctIndex: 1,
    explanation: "The large intestine primarily reabsorbs water and dissolved mineral salts from remaining undigested matter, converting it to solid feces. The small intestine is the main site of chemical digestion and nutrient absorption."
  },
  {
    sector: 1,
    sectorName: "Biology Hub",
    marks: 5,
    question: "To confirm the presence of starch in a green plant leaf during a laboratory investigation, which chemical reagent is used, and what is the exact color transition observed for a positive result?",
    options: [
      "Benedict's Solution; changes from light blue to a brick-red precipitate",
      "Biuret Reagent; changes from light blue to a deep violet-purple",
      "Iodine Solution; changes from yellow-brown (amber) to deep blue-black",
      "Ethanol Emulsion; changes from clear to a cloudy white suspension"
    ],
    correctIndex: 2,
    explanation: "A positive starch test is confirmed when Iodine solution shifts from its native yellow-brown/amber color to a distinct dark blue-black. Benedict's tests for reducing sugars, Biuret for proteins, and Ethanol for lipids."
  },
  // ==================== SECTOR 2: CHEMISTRY PLAYGROUND (25 Marks) ====================
  {
    sector: 2,
    sectorName: "Chemistry Playground",
    marks: 8,
    question: "What is the correct electron shell configuration for a neutral Calcium atom (atomic number 20) in its stable ground state?",
    options: [
      "2, 8, 10",
      "2, 8, 8, 2",
      "2, 8, 6, 4",
      "2, 2, 8, 8"
    ],
    correctIndex: 1,
    explanation: "Calcium has 20 electrons. The energy levels fill sequentially: the first shell holds a maximum of 2, the second holds 8, the third holds 8, and the final two valence electrons occupy the fourth shell, yielding: 2, 8, 8, 2."
  },
  {
    sector: 2,
    sectorName: "Chemistry Playground",
    marks: 8,
    isHydrogenPop: true,
    question: "A student performs a gas confirmation test. When a lit wooden splint is placed at the mouth of the test tube, a distinct 'squeaky pop' sound is heard. What reaction causes this sound signature, and which gas is present?",
    options: [
      "Carbon dioxide gas extinguishing the flame",
      "Oxygen gas accelerating the combustion of the wood",
      "Hydrogen gas rapidly reacting with atmospheric oxygen in an explosive combustion",
      "Nitrogen gas reacting with carbon to produce nitrogen dioxide"
    ],
    correctIndex: 2,
    explanation: "The 'squeaky pop' test is the classic confirmation for hydrogen gas (H₂). The pop is a miniature explosion resulting from the rapid, exothermic combustion of hydrogen gas reacting with oxygen: 2H₂ + O₂ -> 2H₂O."
  },
  {
    sector: 2,
    sectorName: "Chemistry Playground",
    marks: 9,
    question: "Which of the following statements correctly describes and explains the vertical periodic trend in reactivity down Group 1 (alkali metals) compared to Group 17 (halogens)?",
    options: [
      "Group 1 reactivity decreases down the group; Group 17 reactivity increases down the group",
      "Group 1 reactivity increases down the group because valence electrons are further from the nucleus and more easily lost; Group 17 reactivity decreases down the group because increased shielding makes it harder to attract an incoming electron",
      "Both Group 1 and Group 17 reactivity increase down their respective groups due to increasing atomic mass and neutron numbers",
      "Group 1 reactivity increases down the group because electronegativity increases; Group 17 reactivity increases because atomic radius decreases"
    ],
    correctIndex: 1,
    explanation: "Down Group 1, outer electrons are further from the positive nucleus, shielded by more electron shells, reducing electrostatic attraction and making the valence electron easier to lose (increasing reactivity). Down Group 17, increased shielding reduces the nucleus's ability to attract an incoming electron, decreasing reactivity."
  },
  // ==================== SECTOR 3: PHYSICS LAB (35 Marks) ====================
  {
    sector: 3,
    sectorName: "Physics Lab",
    marks: 10,
    question: "During a physics lab session, a model rocket is launched and travels a distance of 288 meters in exactly 18 seconds at a constant speed. What is its average velocity (v)?",
    options: [
      "16 m/s",
      "5,184 m/s",
      "0.0625 m/s",
      "18 m/s"
    ],
    correctIndex: 0,
    explanation: "Velocity is calculated using the formula v = d / t. Substituting the given values: v = 288 meters / 18 seconds = 16 meters per second."
  },
  {
    sector: 3,
    sectorName: "Physics Lab",
    marks: 12,
    question: "An electrical circuit features a power source connected to Bulb A in series with a parallel combination of two identical bulbs (Bulb B and Bulb C). Assuming all bulbs are identical and the power source has negligible internal resistance, which statement is true regarding their brightness?",
    options: [
      "Bulb A is dimmer than Bulbs B and C",
      "All three bulbs (A, B, and C) glow with identical brightness",
      "Bulb A is the brightest, while Bulbs B and C are equally bright but dimmer than A",
      "Bulb B and C are brighter than Bulb A because they are in parallel"
    ],
    correctIndex: 2,
    explanation: "The full circuit current must flow through Bulb A before splitting equally at the parallel junction between Bulb B and Bulb C. Since electrical power (and thus brightness) depends on current, Bulb A is the brightest, and Bulbs B and C are equally dim."
  },
  {
    sector: 3,
    sectorName: "Physics Lab",
    marks: 13,
    question: "To correctly measure the electric current flowing through a resistor and the potential difference across it, how must an ammeter and a voltmeter be connected, and what is the direction of conventional current in the external circuit?",
    options: [
      "Ammeter in parallel, voltmeter in series, current flows from negative to positive",
      "Ammeter in series, voltmeter in parallel, current flows from positive to negative",
      "Both meters in series, current flows from positive to negative",
      "Ammeter in series, voltmeter in parallel, current flows from negative to positive"
    ],
    correctIndex: 1,
    explanation: "Ammeters have near-zero resistance and must be connected in series to measure current. Voltmeters have extremely high resistance and must be connected in parallel to measure voltage. Conventional current is defined as flowing from the positive terminal to the negative terminal."
  },
  // ==================== SECTOR 4: METHODOLOGY SKILLS (40 Marks) ====================
  {
    sector: 4,
    sectorName: "Methodology Skills",
    marks: 12,
    question: "A student sets up an investigation to see how the volume of water added daily (20 mL, 50 mL, 100 mL) affects the growth height of sunflower plants over a 3-week period. She keeps soil type, pot size, and sunlight exposure identical for all plants. What are the independent and dependent variables in this study?",
    options: [
      "Independent variable: Height of the plant; Dependent variable: Volume of water",
      "Independent variable: Volume of water; Dependent variable: Height of the plant",
      "Independent variable: Soil type; Dependent variable: Sunlight exposure",
      "Independent variable: Height of the plant; Dependent variable: Duration of the experiment (3 weeks)"
    ],
    correctIndex: 1,
    explanation: "The independent variable is the factor deliberately manipulated by the experimenter (volume of water). The dependent variable is the factor being measured or observed in response (plant growth height). Soil, pot size, and sunlight are controlled variables."
  },
  {
    sector: 4,
    sectorName: "Methodology Skills",
    marks: 13,
    question: "You need to transfer exactly 25.0 mL of a liquid reactant into a conical flask for a precise neutralization reaction. Which of the following apparatus is designed to deliver a single, highly precise fixed volume of liquid, rather than variable or approximate volumes?",
    options: [
      "Beaker",
      "Graduated Measuring Cylinder",
      "Volumetric Pipette",
      "Conical Flask"
    ],
    correctIndex: 2,
    explanation: "A volumetric pipette is calibrated to dispense a single, extremely precise volume (e.g. exactly 25.0 mL) with very low uncertainty. Measuring cylinders measure variable volumes with lower precision, while beakers and conical flasks only provide rough approximations."
  },
  {
    sector: 4,
    sectorName: "Methodology Skills",
    marks: 15,
    question: "During an investigation on reaction rates, a student records the time taken for a magnesium ribbon to fully dissolve in various concentrations of hydrochloric acid (0.5 M, 1.0 M, 2.0 M). The measured times are 180 s, 90 s, and 45 s respectively. Which scientific conclusion is best supported by this quantitative dataset?",
    options: [
      "Increasing acid concentration decreases the overall rate of reaction",
      "The dissolution time is directly proportional to the acid concentration",
      "Doubling the concentration of hydrochloric acid halves the reaction time, indicating the rate of reaction is directly proportional to concentration",
      "Temperature is the primary variable controlling this reaction rate"
    ],
    correctIndex: 2,
    explanation: "Doubling concentration (0.5M -> 1.0M -> 2.0M) halves the time (180s -> 90s -> 45s). Since rate is inversely proportional to time (Rate = 1/time), halving the reaction time means the reaction rate is doubled. Thus, the rate of reaction is directly proportional to the concentration."
  }
];

// 2. Sound Effects Engine (Web Audio API Synthesizer)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Synthesize pleasant correct chime
function playCorrectSound() {
  initAudio();
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  // Nice high chord chime (E5 -> A5)
  osc1.frequency.setValueAtTime(659.25, now); // E5
  osc2.frequency.setValueAtTime(880.00, now + 0.08); // A5

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.5);
  osc2.stop(now + 0.5);
}

// Synthesize squeaky pop sound (special hydrogen effect)
function playSqueakyPopSound() {
  initAudio();
  const now = audioCtx.currentTime;
  
  // Part 1: The Squeak (rapid upward pitch sweep)
  const oscSqueak = audioCtx.createOscillator();
  const gainSqueak = audioCtx.createGain();
  
  oscSqueak.type = 'sine';
  oscSqueak.frequency.setValueAtTime(300, now);
  oscSqueak.frequency.exponentialRampToValueAtTime(900, now + 0.08);
  
  gainSqueak.gain.setValueAtTime(0, now);
  gainSqueak.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gainSqueak.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  
  oscSqueak.connect(gainSqueak);
  gainSqueak.connect(audioCtx.destination);
  
  oscSqueak.start(now);
  oscSqueak.stop(now + 0.1);
  
  // Part 2: The Pop (low frequency pulse/noise burst)
  const oscPop = audioCtx.createOscillator();
  const gainPop = audioCtx.createGain();
  
  oscPop.type = 'triangle';
  oscPop.frequency.setValueAtTime(120, now + 0.07);
  oscPop.frequency.exponentialRampToValueAtTime(40, now + 0.18);
  
  gainPop.gain.setValueAtTime(0, now + 0.07);
  gainPop.gain.linearRampToValueAtTime(0.3, now + 0.08);
  gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  
  oscPop.connect(gainPop);
  gainPop.connect(audioCtx.destination);
  
  oscPop.start(now + 0.07);
  oscPop.stop(now + 0.25);
}

// Synthesize incorrect buzzer
function playIncorrectSound() {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  // Descending buzz
  osc.frequency.setValueAtTime(130, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.35);

  osc.start(now);
  osc.stop(now + 0.4);
}

// Synthesize sector unlock fanfare
function playSectorUnlockedSound() {
  initAudio();
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
  
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + (index * 0.1));
    
    gainNode.gain.setValueAtTime(0, now + (index * 0.1));
    gainNode.gain.linearRampToValueAtTime(0.08, now + (index * 0.1) + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.1) + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now + (index * 0.1));
    osc.stop(now + (index * 0.1) + 0.45);
  });
}

// Synthesize sad game over tune
function playGameOverSound() {
  initAudio();
  const now = audioCtx.currentTime;
  const notes = [220.00, 207.65, 196.00, 164.81]; // A3, G#3, G3, E3 (sad descent)
  
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + (index * 0.25));
    
    gainNode.gain.setValueAtTime(0, now + (index * 0.25));
    gainNode.gain.linearRampToValueAtTime(0.1, now + (index * 0.25) + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.25) + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now + (index * 0.25));
    osc.stop(now + (index * 0.25) + 0.6);
  });
}

// Synthesize grand victory fanfare
function playVictorySound() {
  initAudio();
  const now = audioCtx.currentTime;
  
  // Celebratory chords and arpeggio (C4 -> E4 -> G4 -> C5 -> E5 -> G5 -> C6)
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = (index === notes.length - 1) ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now + (index * 0.08));
    
    gainNode.gain.setValueAtTime(0, now + (index * 0.08));
    gainNode.gain.linearRampToValueAtTime(0.1, now + (index * 0.08) + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.08) + 0.6);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now + (index * 0.08));
    osc.stop(now + (index * 0.08) + 0.75);
  });

  // Add a fat final sustained chord (C4 + G4 + C5 + E5)
  setTimeout(() => {
    const chord = [261.63, 392.00, 523.25, 659.25];
    chord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 1.8);
    });
  }, 600);
}


// Active questions list and shuffling logic
let activeQuestions = [];

function shuffleQuestions() {
  const sector1 = QUESTIONS.filter(q => q.sector === 1);
  const sector2 = QUESTIONS.filter(q => q.sector === 2);
  const sector3 = QUESTIONS.filter(q => q.sector === 3);
  const sector4 = QUESTIONS.filter(q => q.sector === 4);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  shuffle(sector1);
  shuffle(sector2);
  shuffle(sector3);
  shuffle(sector4);

  activeQuestions = [...sector1, ...sector2, ...sector3, ...sector4];
}

// 3. Game State Variables
let gameState = {
  score: 0,
  lives: 3,
  currentQuestionIdx: 0, // 0 to 11 absolute
  timeLeft: 720,        // 12 minutes (720 seconds) per sector
  timerInterval: null,
  sectorTimes: {
    1: 0, // cumulative time spent per sector
    2: 0,
    3: 0,
    4: 0
  },
  sectorStartTime: 0
};

// 4. Cache DOM Elements
const bodyEl = document.body;
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const feedbackPanel = document.getElementById('feedback-panel');
const gameOverScreen = document.getElementById('game-over-screen');
const victoryScreen = document.getElementById('victory-screen');

const gameHeader = document.getElementById('game-header');
const sectorBadge = document.getElementById('sector-badge');
const countdownTimer = document.getElementById('countdown-timer');
const scoreDisplay = document.getElementById('score-display');
const progressBarFill = document.getElementById('progress-bar-fill');
const livesDisplay = document.getElementById('lives-display');

const questionNumEl = document.getElementById('current-question-num');
const questionValueEl = document.getElementById('question-value-badge');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const feedbackStatusIcon = document.getElementById('feedback-status-icon');
const feedbackStatusTitle = document.getElementById('feedback-status-title');
const feedbackScoreNotice = document.getElementById('feedback-score-notice');
const feedbackExplanation = document.getElementById('feedback-explanation');

const goScoreEl = document.getElementById('go-score');
const goSectorEl = document.getElementById('go-sector');
const goReasonEl = document.getElementById('game-over-reason');

const vicScoreEl = document.getElementById('vic-score');
const vicLivesEl = document.getElementById('vic-lives');
const vicTimeEl = document.getElementById('vic-time');
const vicCommentEl = document.getElementById('vic-feedback-comment');

const btnBegin = document.getElementById('btn-begin');
const btnFeedbackContinue = document.getElementById('btn-feedback-continue');
const btnRestartGo = document.getElementById('btn-restart-go');
const btnRestartVic = document.getElementById('btn-restart-vic');


// 5. Game Engine Methods

// Initialize/Reset State
function initGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.currentQuestionIdx = 0;
  gameState.timeLeft = 720;
  gameState.sectorTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };
  
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }

  // Set default theme class
  bodyEl.className = 'theme-biology';

  // Render original hearts
  updateLivesUI();

  // Reset displays
  scoreDisplay.innerHTML = `0 <span class="score-total">/ 115</span>`;
  progressBarFill.style.width = '0%';
  countdownTimer.textContent = "12:00";
  countdownTimer.classList.remove('urgent');

  // Show welcome, hide others
  welcomeScreen.classList.remove('hidden');
  questionScreen.classList.add('hidden');
  feedbackPanel.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  victoryScreen.classList.add('hidden');
  gameHeader.classList.add('hidden');
}

// Start Gameplay
function startGame() {
  initAudio();
  
  // Reset game state completely
  gameState.score = 0;
  gameState.lives = 3;
  gameState.currentQuestionIdx = 0;
  gameState.timeLeft = 720;
  gameState.sectorTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };

  // Shuffle questions for this run
  shuffleQuestions();

  // Reset UI elements
  updateLivesUI();
  scoreDisplay.innerHTML = `0 <span class="score-total">/ 115</span>`;
  progressBarFill.style.width = '0%';
  countdownTimer.textContent = "12:00";
  countdownTimer.classList.remove('urgent');

  welcomeScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  victoryScreen.classList.add('hidden');
  questionScreen.classList.remove('hidden');
  gameHeader.classList.remove('hidden');
  
  startSectorTimer();
  loadQuestion(0);
}

// Start Timer for a sector
function startSectorTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  gameState.timeLeft = 720; // 12 minutes
  gameState.sectorStartTime = Date.now();
  countdownTimer.classList.remove('urgent');
  updateTimerDisplay();

  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--;
    updateTimerDisplay();

    // Visual warning when under 60 seconds
    if (gameState.timeLeft <= 60) {
      countdownTimer.classList.add('urgent');
    }

    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.timerInterval);
      gameState.timerInterval = null;
      triggerGameOver("Time Expired! The sector countdown reached zero.");
    }
  }, 1000);
}

// Update clock text
function updateTimerDisplay() {
  const mins = Math.floor(gameState.timeLeft / 60);
  const secs = gameState.timeLeft % 60;
  countdownTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Load current question to UI
function loadQuestion(index) {
  const q = activeQuestions[index];
  
  // Set theme class on body for sector shifts
  if (q.sector === 1) bodyEl.className = 'theme-biology';
  else if (q.sector === 2) bodyEl.className = 'theme-chemistry';
  else if (q.sector === 3) bodyEl.className = 'theme-physics';
  else if (q.sector === 4) bodyEl.className = 'theme-methodology';

  // Update Sector Badge
  sectorBadge.textContent = `SECTOR ${q.sector}: ${q.sectorName.toUpperCase()}`;
  sectorBadge.className = `sector-badge sector-${q.sector}`;

  // Update Question Tracker
  const sectorQIndex = (index % 3) + 1;
  questionNumEl.textContent = sectorQIndex;
  questionValueEl.textContent = `+${q.marks} MARKS`;
  questionTextEl.textContent = q.question;

  // Clear and load option buttons
  optionsContainer.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  
  q.options.forEach((opt, oIdx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${letters[oIdx]}</span> <span class="option-text">${opt}</span>`;
    btn.addEventListener('click', () => selectOption(oIdx, btn));
    optionsContainer.appendChild(btn);
  });

  // Update Progress Bar: 12 questions total.
  // We represent progress as (currentQuestionIndex) / 12 * 100
  const progressPercent = (index / activeQuestions.length) * 100;
  progressBarFill.style.width = `${progressPercent}%`;
}

// Select an MCQ Option
function selectOption(selectedIdx, btnElement) {
  const q = activeQuestions[gameState.currentQuestionIdx];
  const allOptionButtons = optionsContainer.querySelectorAll('.option-btn');
  
  // Disable further clicks on option buttons
  allOptionButtons.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
  });

  const isCorrect = (selectedIdx === q.correctIndex);
  
  if (isCorrect) {
    // Answer is correct!
    gameState.score += q.marks;
    scoreDisplay.innerHTML = `${gameState.score} <span class="score-total">/ 115</span>`;
    btnElement.classList.add('correct-choice');

    // Play specific sound: Hydrogen Pop Test gets special Pop effect!
    if (q.isHydrogenPop) {
      playSqueakyPopSound();
    } else {
      playCorrectSound();
    }

    // Set feedback title and overlay classes
    feedbackPanel.className = 'feedback-panel correct';
    feedbackStatusTitle.textContent = "CORRECT!";
    feedbackScoreNotice.textContent = `+${q.marks} Marks Acquired`;
    feedbackScoreNotice.style.color = 'var(--color-success)';
    
    // Icon
    feedbackStatusIcon.innerHTML = `
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>`;
  } else {
    // Answer is incorrect!
    gameState.lives--;
    btnElement.classList.add('wrong-choice');
    
    // Highlight the correct one
    allOptionButtons[q.correctIndex].classList.add('correct-choice');

    // Trigger visual shake on Card
    questionScreen.classList.add('shake-element', 'flash-red');
    setTimeout(() => {
      questionScreen.classList.remove('shake-element', 'flash-red');
    }, 550);

    playIncorrectSound();
    updateLivesUI();

    // Set feedback title and overlay classes
    feedbackPanel.className = 'feedback-panel incorrect';
    feedbackStatusTitle.textContent = "INCORRECT";
    feedbackScoreNotice.textContent = `0 Marks (Lost 1 Life)`;
    feedbackScoreNotice.style.color = 'var(--color-danger)';

    // Icon
    feedbackStatusIcon.innerHTML = `
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
      </svg>`;
  }

  // Set Explanation text
  feedbackExplanation.textContent = q.explanation;

  // Slide open Feedback Panel
  feedbackPanel.classList.remove('hidden');
}

// Update visual representation of lives
function updateLivesUI() {
  for (let i = 1; i <= 3; i++) {
    const heart = document.getElementById(`heart-${i}`);
    if (i <= gameState.lives) {
      heart.className = 'heart-icon active';
    } else {
      if (heart.classList.contains('active')) {
        heart.className = 'heart-icon lost';
      } else {
        heart.className = 'heart-icon';
      }
    }
  }
}

// Proceed after clicking Continue on feedback screen
function continueGame() {
  feedbackPanel.classList.add('hidden');

  // 1. Check if dead
  if (gameState.lives <= 0) {
    triggerGameOver("No Lives Remaining! You depleted your lives pool.");
    return;
  }

  // 2. Track sector times
  const q = activeQuestions[gameState.currentQuestionIdx];
  const sectorTimeElapsed = Math.floor((Date.now() - gameState.sectorStartTime) / 1000);
  gameState.sectorTimes[q.sector] += sectorTimeElapsed;

  // 3. Check if all questions are finished
  if (gameState.currentQuestionIdx >= activeQuestions.length - 1) {
    // Victory! Set progress bar fill to 100%
    progressBarFill.style.width = '100%';
    triggerVictory();
    return;
  }

  // 4. Move to next question
  const nextIdx = gameState.currentQuestionIdx + 1;
  const nextQ = activeQuestions[nextIdx];
  gameState.currentQuestionIdx = nextIdx;

  // If entering a new sector, reset sector timer & play sector unlocked fanfare
  if (nextQ.sector !== q.sector) {
    playSectorUnlockedSound();
    startSectorTimer();
  } else {
    // Reset timer start point for current sector question
    gameState.sectorStartTime = Date.now();
  }

  loadQuestion(gameState.currentQuestionIdx);
}

// Trigger Game Over Screen
function triggerGameOver(reason) {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }

  playGameOverSound();

  // Hide header and normal card panels
  gameHeader.classList.add('hidden');
  questionScreen.classList.add('hidden');
  feedbackPanel.classList.add('hidden');

  // Set values on Game Over Screen
  goReasonEl.textContent = reason;
  goScoreEl.textContent = gameState.score;
  
  const reachedQ = activeQuestions[gameState.currentQuestionIdx];
  goSectorEl.textContent = `Sector ${reachedQ.sector}: ${reachedQ.sectorName}`;

  // Show Game Over card
  gameOverScreen.classList.remove('hidden');
}

// Trigger Victory Screen
function triggerVictory() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }

  playVictorySound();

  // Hide header and normal card panels
  gameHeader.classList.add('hidden');
  questionScreen.classList.add('hidden');
  feedbackPanel.classList.add('hidden');

  // Compute stats
  vicScoreEl.textContent = gameState.score;
  vicLivesEl.textContent = `${gameState.lives} / 3`;

  // Calculate average time per sector
  const totalSecs = Object.values(gameState.sectorTimes).reduce((a, b) => a + b, 0);
  const avgSecs = Math.floor(totalSecs / 4);
  const avgMins = Math.floor(avgSecs / 60);
  const avgRemainSecs = avgSecs % 60;
  vicTimeEl.textContent = `${avgMins.toString().padStart(2, '0')}:${avgRemainSecs.toString().padStart(2, '0')}`;

  // Tailored final comment
  if (gameState.score === 115) {
    vicCommentEl.textContent = "Flawless Conquest! You achieved a perfect score of 115. Your mastery of cell structures, chemical configurations, circuit theory, and methodology parameters is exceptional. You are fully prepared for academic success!";
  } else if (gameState.score >= 90) {
    vicCommentEl.textContent = `Excellent work! You scored ${gameState.score} marks out of 115. You have a solid command of Year 9 general science. Review the few questions you missed to lock in a perfect score next time!`;
  } else {
    vicCommentEl.textContent = `Congratulations on completing the Gauntlet with ${gameState.score} marks! You survived, but there is room to sharpen your skills. Re-enter the Gauntlet to practice cell differences, electron shells, speed maths, and lab variables.`;
  }

  // Show Victory card
  victoryScreen.classList.remove('hidden');
}


// 6. Bind Event Listeners
btnBegin.addEventListener('click', startGame);
btnFeedbackContinue.addEventListener('click', continueGame);
btnRestartGo.addEventListener('click', startGame);
btnRestartVic.addEventListener('click', startGame);

// Initialize game on load
window.addEventListener('DOMContentLoaded', () => {
  shuffleQuestions();
  initGame();
});
