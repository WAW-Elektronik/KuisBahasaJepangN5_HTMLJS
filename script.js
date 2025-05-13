let currentQuestions = [];
let currentFileName = ""; // untuk menyimpan nama file soal saat ini

// Saat user memilih soal dari dropdown
document.getElementById("GrammardanPartikelN5-select").addEventListener("change", function () {
  const fileName = this.value;
  loadQuestions(fileName);
});
document.getElementById("KataHubungN5-select").addEventListener("change", function () {
  const fileName = this.value;
  loadQuestions(fileName);
});
document.getElementById("KataKerjaN5-select").addEventListener("change", function () {
  const fileName = this.value;
  loadQuestions(fileName);
});
document.getElementById("KataSifatN5-select").addEventListener("change", function () {
  const fileName = this.value;
  loadQuestions(fileName);
});
document.getElementById("KataBendaN5-select").addEventListener("change", function () {
  const fileName = this.value;
  loadQuestions(fileName);
});

// Fungsi untuk memuat soal dari file js dinamis
function loadQuestions(fileName) {
  currentFileName = fileName;

  // Hapus script sebelumnya jika ada
  const existingScript = document.getElementById("dynamic-question-script");
  if (existingScript) {
    existingScript.remove();
    delete window.questions;
  }

  document.getElementById("GrammardanPartikelN5-select").style.display = "none";
  document.getElementById("KataHubungN5-select").style.display = "none";
  document.getElementById("KataKerjaN5-select").style.display = "none";
  document.getElementById("KataSifatN5-select").style.display = "none";
  document.getElementById("KataBendaN5-select").style.display = "none";
  document.getElementById("quiz-container").innerHTML = "";

  const script = document.createElement("script");
  script.src = `questions/${fileName}.js`;
  script.id = "dynamic-question-script";
  script.onload = () => {
    if (!window.questions) {
      alert("File soal tidak mengandung variabel `questions`!");
      return;
    }

    currentQuestions = JSON.parse(JSON.stringify(window.questions));
    shuffle(currentQuestions);
    renderQuestions();
  };
  document.body.appendChild(script);
}

// Render semua soal ke halaman
function renderQuestions() {
  document.getElementById("quiz-container").innerHTML = "";
  document.getElementById("reload-button").style.display = "inline-block";
  document.querySelector("button[onclick='goBack()']").style.display = "inline-block";

  currentQuestions.forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<h2>${idx + 1}. ${q.pertanyaan}</h2>`;

    const opsiTeracak = q.opsi.map((label, i) => ({ label, originalIndex: i }));
    shuffle(opsiTeracak);
    q.shuffledJawabanIndex = opsiTeracak.findIndex(opt => opt.originalIndex === q.jawaban_index);

    opsiTeracak.forEach((opt, i) => {
      div.innerHTML += `
        <label>
          <input type="radio" name="q${idx}" value="${i}">
          ${opt.label}
        </label><br>
      `;
    });

    document.getElementById("quiz-container").appendChild(div);
  });
}

// Periksa semua jawaban
function checkAnswers() {
  currentQuestions.forEach((q, idx) => {
    const radios = document.getElementsByName(`q${idx}`);
    const result = document.createElement("p");

    let selected = -1;
    radios.forEach((r, i) => {
      if (r.checked) selected = parseInt(r.value);
    });

    if (selected === q.shuffledJawabanIndex) {
      result.textContent = "✓ Benar!";
      result.className = "correct";
    } else {
      result.textContent = `✗ Salah. Jawaban benar: ${q.opsi[q.jawaban_index]}`;
      result.className = "wrong";
    }

    const container = document.querySelector(`#quiz-container .question:nth-child(${idx + 1})`);
    const existing = container.querySelector("p");
    if (existing) {
      existing.replaceWith(result);
    } else {
      container.appendChild(result);
    }
  });
}

// Kembali ke menu awal
function goBack() {
  document.getElementById("GrammardanPartikelN5-select").style.display = "block";
  document.getElementById("KataHubungN5-select").style.display = "block";
  document.getElementById("KataKerjaN5-select").style.display = "block";
  document.getElementById("KataSifatN5-select").style.display = "block";
  document.getElementById("KataBendaN5-select").style.display = "block";
  document.getElementById("quiz-container").innerHTML = "";
  document.querySelector("button[onclick='goBack()']").style.display = "none";
  document.getElementById("reload-button").style.display = "none";
  currentQuestions = [];
  currentFileName = "";
}

// Memuat ulang soal yang sedang aktif
function reloadCurrentQuestions() {
  if (currentFileName) {
    loadQuestions(currentFileName);
  }
}

// Fungsi acak array (digunakan untuk mengacak soal dan jawaban)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
