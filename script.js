
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".place-card");

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    const selected = button.dataset.filter;

    cards.forEach(card => {
      card.hidden = selected !== "all" &&
        card.dataset.category !== selected;
    });
  });
});

const surpriseButton = document.querySelector("#surprise-btn");
const surpriseResult = document.querySelector("#surprise-result");

surpriseButton.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * cards.length);
  const placeName = cards[randomIndex].querySelector("h3").textContent;
  surpriseResult.textContent = "Your next stop: " + placeName;
});
