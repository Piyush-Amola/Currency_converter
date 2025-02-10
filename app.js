const BASE_URL =
  "https://v6.exchangerate-api.com/v6/1f4578869d34c701a8c4ea7f/latest"; // Your API key in the URL

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  console.log("From Currency:", fromCurr.value);
  console.log("To Currency:", toCurr.value);

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}`;
  console.log("Requesting URL:", URL);

  try {
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    console.log("API Response:", data);
    if (!data || !data.conversion_rates) {
      msg.innerText = "Unable to fetch exchange rate data.";
      return;
    }

    let rate = data.conversion_rates[toCurr.value.toUpperCase()];
    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${
      toCurr.value
    }`;
  } catch (error) {
    console.error("Error fetching or parsing exchange rates:", error); // Log detailed error
    msg.innerText = `Error: ${error.message}`; // Show a user-friendly error message
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  if (countryCode) {
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  } else {
    console.error("No country code found for currency:", currCode);
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
