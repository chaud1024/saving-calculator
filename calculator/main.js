// 이자계산
// 정기적금 : 월 납입금 x 납입개월수 x (납입개월수 + 1)/2 x  이자율/12
// 정기예금 :
// 단리식(매월이자지급) simple interest
// ◎ 월단위 이자계산 : 원금x연이율x월수/12
// ◎ 일단위 이자계산 : 원금x연이율x일수/365
// 복리식(만기일시지급) compound interest
// ◎ 월복리 이자계산 : 원금 x｛（1＋연이율/12)ⁿ-1｝ⁿ = 경과일수
// ◎ 잔여일수이자계산 : 원금＋월복리이자)x연이율x경과일수/365

// =========================================
// 적금, 예금, 대출 탭 기능
// =========================================

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

// =========================================
// input에 세자리마다 콤마 붙이기
// =========================================

// [1] 적금
const monthlySave = document.querySelector("#monthlySave");

monthlySave.addEventListener("keyup", function (e) {
  let value = e.target.value;
  value = Number(value.replace(",", ""));
  const formatValue = value.toLocaleString("ko-KR");
  monthlySave.value = formatValue;
});

// [2] 예금
const depositPrincipal = document.querySelector("#principal");

depositPrincipal.addEventListener("keyup", function (e) {
  let value = e.target.value;
  value = Number(value.replace(",", ""));
  const formatValue = value.toLocaleString("ko-KR");
  depositPrincipal.value = formatValue;
});

const valueSavingAmount = () => {
  Number(document.querySelector("#monthlySave").value);
};

// =========================================
// 세금우대 선택 시 우대율 적는 input 보여주기
// 세금우대가 아니라면 우대율 적는 input 숨기기
// =========================================

const typeTax = document.querySelectorAll(".radio-type_tax");

for (let i = 0; i < typeTax.length; i++) {
  typeTax[i].addEventListener("click", function (e) {
    const typeTaxPref = document.querySelectorAll(".item-preferential_rate");
    if (e.target.value == "세금우대") {
      typeTaxPref.forEach((item) => item.classList.add("on"));
    } else {
      typeTaxPref.forEach((item) => item.classList.remove("on"));
    }
  });
}

// =========================================
// 적금 계산하기 버튼 클릭 -> 결과화면
// =========================================

function cal() {
  // 매월적립금
  const monthlySavingAmount = document
    .querySelector("#monthlySave")
    .value.replace(/,/g, "");

  // 적립기간 개월<->연
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

// =========================================
// 예금 계산하기 버튼 클릭 -> 결과화면
// =========================================

function calDeposit() {
  // 원금합계
  const principal = Number(
    document.querySelector("#principal").value.replace(/,/g, ""),
  );

  document.querySelector("#spanTsa").innerHTML = `
    ${depositPrincipal.value}
  `;

  // 예치기간 개월<->연
  const savingPeriod = document.querySelector("#depositSavingPeriod").value;
  const period = document.querySelector(
    "input[name='depositPeriodType']:checked",
  ).value;

  let realSavingPeriod;

  period == "year"
    ? (realSavingPeriod = Number(savingPeriod) * 12)
    : (realSavingPeriod = Number(savingPeriod));

  // 세전이자
  const interestRate =
    Number(document.querySelector("#depositInterestRate").value) / 100;

  const interest = Math.round(
    principal * interestRate * (realSavingPeriod / 12),
  );
  document.querySelector("#interestBfrTax").innerHTML = `
    ${interest.toLocaleString()}
  `;

  // 세전수령액
  const depositBfrTaxing = principal + interest;
  document.querySelector("#depositBfrTaxing").innerHTML = `
    ${depositBfrTaxing.toLocaleString()}
  `;

  // 이자과세 & 세후수령액
  // 일반과세: 15.4%, 비과세: 0, 세금우대인 경우 우대세율 작성

  const depositTypeTax = document.querySelector(
    'input[name="depositTaxType"]:checked',
  ).value;
  console.log("depositTaxType", depositTypeTax);

  switch (depositTypeTax) {
    case "일반과세":
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
      const taxNone = 0;
      document.querySelector("#interestTaxing").innerHTML = `
      ${taxNone}
    `;

      // 세후수령액
      document.querySelector("#netDeposit").innerHTML = `
      ${(depositBfrTaxing - 0).toLocaleString()}
    `;

      break;

    case "세금우대":
      const taxPreferentialRate = Number(
        document.querySelector("#depositPreferentialRate").value,
      );

      const taxPref = Math.round((interest * taxPreferentialRate) / 100);
      document.querySelector("#interestTaxing").innerHTML = `
      ${taxPref.toLocaleString()}
      `;

      // 세후수령액
      document.querySelector("#netDeposit").innerHTML = `
        ${(depositBfrTaxing - taxPref).toLocaleString()}
      `;
      break;
  }
}

const 제곱 = Math.pow(2, 10);
// console.log(제곱);
