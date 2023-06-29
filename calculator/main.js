// 이자계산
// 정기예금 : 원금 x 연이율(%) x 기간(개월수)/12
// 정기적금 : 월 납입금 x 납입개월수 x (납입개월수 + 1)/2 x  이자율/12

// input에 세자리마다 콤마 붙이기
const monthlySave = document.querySelector("#monthlySave");
monthlySave.addEventListener("keyup", function (e) {
  let value = e.target.value;
  value = Number(value.replace(",", ""));
  const formatValue = value.toLocaleString("ko-KR");
  monthlySave.value = formatValue;
});

function valueMontlySavingAmount() {
  const monthlySavingAmount = Number(
    document.querySelector("#monthlySave").value,
  );
}

function valueSavingPeriod() {
  const savingPeriod = document.querySelector("#savingPeriod").value;
  const period = document.querySelector(
    'input[name="periodType"]:checked',
  ).value;
}

// 계산하기 버튼 클릭 -> 결과화면
function cal() {
  const monthlySavingAmount = document
    .querySelector("#monthlySave")
    .value.replace(/,/g, "");

  const savingPeriod = Number(document.querySelector("#savingPeriod").value);
  const period = document.querySelector(
    'input[name="periodType"]:checked',
  ).value;

  let realSavingPeriod;

  period == "year"
    ? (realSavingPeriod = Number(savingPeriod) * 12)
    : (realSavingPeriod = Number(savingPeriod));

  // 원금합계
  const tsa = monthlySavingAmount * realSavingPeriod;

  console.log("원금합계", tsa);
  console.log(
    "기간",
    period == "year" ? Number(savingPeriod) * 12 : Number(savingPeriod),
  );

  document.querySelector("#spanTsa").innerHTML = `
    ${tsa.toLocaleString()}
  `;

  // 세전이자
  // [1] 단리의 경우
  const interestRate =
    Number(document.querySelector("#interestRate").value) / 100;

  const interest = Math.round(
    ((monthlySavingAmount * realSavingPeriod * (realSavingPeriod + 1)) / 2) *
      (interestRate / 12),
  );

  console.log("이자금액", interest);

  document.querySelector("#interestBfrTax").innerHTML = `
    ${interest.toLocaleString()}
  `;

  // 세전수령액
  const depositBfrTaxing = tsa + interest;

  document.querySelector("#depositBfrTaxing").innerHTML = `
    ${depositBfrTaxing.toLocaleString()}
  `;

  // 이자과세 & 세후수령액
  // 일반과세: 15.4%, 비과세: 0, 세금우대인 경우 우대세율 작성

  const typeTax = document.querySelector('input[name="taxType"]:checked').value;

  switch (typeTax) {
    case "일반과세":
      console.log("일반과세", Math.round(interest * 0.154));
      const taxReg = Math.round(interest * 0.154);
      document.querySelector("#interestTaxing").innerHTML = `
        ${taxReg.toLocaleString()}
      `;

      // 세후수령액
      document.querySelector("#netDeposit").innerHTML = `
        ${(depositBfrTaxing - taxReg).toLocaleString()}
      `;
      break;

    case "비과세":
      console.log("비과세", Math.round(interest * 0));
      const taxNone = 0;
      document.querySelector("#interestTaxing").innerHTML = `
        ${taxNone.toLocaleString()}
      `;

      // 세후수령액
      document.querySelector("#netDeposit").innerHTML = `
        ${(depositBfrTaxing - taxNone).toLocaleString()}
      `;
      break;

    case "세금우대":
      const taxPreferentialRate = Number(
        document.querySelector("#preferentialRate").value,
      );
      console.log("우대세율", taxPreferentialRate);

      const taxPref = Math.round((interest * taxPreferentialRate) / 100);
      document.querySelector("#interestTaxing").innerHTML = `
        ${taxPref.toLocaleString()}
      `;

      // 세후수령액
      document.querySelector("#netDeposit").innerHTML = `
        ${(depositBfrTaxing - taxPref).toLocaleString()}
      `;
  }
}

// 세금우대 선택 시 우대율 적는 input 보여주기
// 세금우대가 아니라면 우대율 적는 input 숨기기
const typeTax = document.querySelectorAll(".radio-type_tax");

for (let i = 0; i < typeTax.length; i++) {
  typeTax[i].addEventListener("click", function (e) {
    // console.log(e.target.value);
    if (e.target.value == "세금우대") {
      document.querySelector(".item-preferential_rate").classList.add("on");
    } else {
      document.querySelector(".item-preferential_rate").classList.remove("on");
    }
  });
}

const 제곱 = Math.pow(2, 10);
console.log(제곱);

// 적금, 예금, 대출 탭 기능

const tabs = document.querySelectorAll(".type-saving li");
const forms = document.querySelectorAll("form");

for (let i = 0; i < tabs.length; i++) {
  tabs[i].querySelector(".tab").addEventListener("click", function (e) {
    e.preventDefault();
    const tabId = this.getAttribute("href");
    // console.log(forms[i]);

    for (let j = 0; j < tabs.length; j++) {
      tabs[j].classList.remove("on");
      forms[j].classList.remove("on");
    }
    this.parentNode.classList.add("on");
    forms[i].classList.add("on");
  });
}
