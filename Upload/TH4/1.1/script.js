const hoTenInput = document.getElementById("hoTen");
const diemInput = document.getElementById("diem");
const btnThem = document.getElementById("btnThem");
const tableBody = document.getElementById("tableBody");
const thongKe = document.getElementById("thongKe");

const searchInput = document.getElementById("searchInput");
const filterXeploai = document.getElementById("filterXeploai");
const colDiem = document.getElementById("colDiem");
const sortIcon = document.getElementById("sortIcon");

let danhSachSinhVien = [];
let kieuSapXep = ''; // '', 'asc', 'desc'

function layDuLieuHienThi() {
  // 1. Lọc theo tìm kiếm
  let ketQua = danhSachSinhVien.filter(function (sv) {
    const tuKhoa = searchInput.value.toLowerCase();
    return sv.hoTen.toLowerCase().includes(tuKhoa);
  });

  // 2. Lọc theo xếp loại
  ketQua = ketQua.filter(function (sv) {
    const loai = xepLoai(sv.diem);
    const giaTriLoc = filterXeploai.value;
    if (giaTriLoc === "all") return true;
    return loai === giaTriLoc;
  });

  // 3. Sắp xếp
  if (kieuSapXep === 'asc') {
    ketQua.sort(function (a, b) { return a.diem - b.diem; });
  } else if (kieuSapXep === 'desc') {
    ketQua.sort(function (a, b) { return b.diem - a.diem; });
  }

  return ketQua;
}

function xepLoai(diem) {
  if (diem >= 8.5) return "Giỏi";
  if (diem >= 7.0) return "Khá";
  if (diem >= 5.0) return "Trung bình";
  return "Yếu";
}

function renderTable() {
  let html = "";
  const duLieuGiaoDien = layDuLieuHienThi();

  if (duLieuGiaoDien.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">Không có kết quả</td></tr>`;
    capNhatThongKe();
    return;
  }

  for (let i = 0; i < duLieuGiaoDien.length; i++) {
    const sv = duLieuGiaoDien[i];
    const loai = xepLoai(sv.diem);

    html += `
      <tr class="${sv.diem < 5 ? "yeu" : ""}">
        <td>${i + 1}</td>
        <td>${sv.hoTen}</td>
        <td>${sv.diem}</td>
        <td>${loai}</td>
        <td>
          <button class="btn-xoa" data-id="${sv.id}">Xóa</button>
        </td>
      </tr>
    `;
  }

  tableBody.innerHTML = html;
  capNhatThongKe();
}

function capNhatThongKe() {
  const tongSV = danhSachSinhVien.length;
  let tongDiem = 0;

  for (let i = 0; i < danhSachSinhVien.length; i++) {
    tongDiem += danhSachSinhVien[i].diem;
  }

  const diemTB = tongSV > 0 ? (tongDiem / tongSV).toFixed(2) : "0.00";

  thongKe.textContent = `Tổng số sinh viên: ${tongSV} | Điểm trung bình: ${diemTB}`;
}

function themSinhVien() {
  const hoTen = hoTenInput.value.trim();
  const diem = parseFloat(diemInput.value);

  if (hoTen === "") {
    alert("Họ tên không được để trống!");
    hoTenInput.focus();
    return;
  }

  if (isNaN(diem) || diem < 0 || diem > 10) {
    alert("Điểm phải là số từ 0 đến 10!");
    diemInput.focus();
    return;
  }

  danhSachSinhVien.push({
    id: Date.now().toString(), // Tạo id nhận diện
    hoTen: hoTen,
    diem: diem
  });

  renderTable();

  hoTenInput.value = "";
  diemInput.value = "";
  hoTenInput.focus();
}

btnThem.addEventListener("click", themSinhVien);

diemInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    themSinhVien();
  }
});

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-xoa")) {
    const idXoa = e.target.getAttribute("data-id");

    // Tìm index thật trong mảng gốc
    let indexGoc = -1;
    for (let i = 0; i < danhSachSinhVien.length; i++) {
      if (danhSachSinhVien[i].id === idXoa) {
        indexGoc = i;
        break;
      }
    }

    if (indexGoc !== -1) {
      danhSachSinhVien.splice(indexGoc, 1);
      renderTable();
    }
  }
});

// Sự kiện Tìm kiếm & Lọc
searchInput.addEventListener("input", renderTable);
filterXeploai.addEventListener("change", renderTable);

// Sự kiện sắp xếp điểm
colDiem.addEventListener("click", function () {
  if (kieuSapXep === '') {
    kieuSapXep = 'asc';
    sortIcon.textContent = ' ▲';
  } else if (kieuSapXep === 'asc') {
    kieuSapXep = 'desc';
    sortIcon.textContent = ' ▼';
  } else {
    kieuSapXep = '';
    sortIcon.textContent = '';
  }
  renderTable();
});

/* =========================================
   BÀI 2.1: JS FORM VALIDATION ĐĂNG KÝ
   ========================================= */
const registerForm = document.getElementById("registerForm");
const regFullName = document.getElementById("regFullName");
const regEmail = document.getElementById("regEmail");
const regPhone = document.getElementById("regPhone");
const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const genderRadios = document.getElementsByName("regGender");
const regTerms = document.getElementById("regTerms");

function hienThiLoi(inputElement, errorId, thongBao) {
  const errorSpan = document.getElementById(errorId);
  if (errorSpan) {
    errorSpan.textContent = thongBao;
    errorSpan.style.display = "block";
  }
  if (inputElement && (inputElement.type === "text" || inputElement.type === "password" || inputElement.type === "email")) {
    inputElement.classList.add("input-error");
    inputElement.classList.remove("input-success");
  }
}

function xoaLoi(inputElement, errorId) {
  const errorSpan = document.getElementById(errorId);
  if (errorSpan) {
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
  }
  if (inputElement && (inputElement.type === "text" || inputElement.type === "password" || inputElement.type === "email")) {
    inputElement.classList.remove("input-error");
    inputElement.classList.add("input-success");
  }
}

function normalizeInput(inputElement) {
  if (!inputElement.classList.contains("input-error") && !inputElement.classList.contains("input-success")) return;
  inputElement.classList.remove("input-error");
}

function checkFullName() {
  const val = regFullName.value;
  if (val.trim() === "") {
    hienThiLoi(regFullName, "err-regFullName", "Họ tên không được để trống");
    return false;
  }
  if (val.length < 3) {
    hienThiLoi(regFullName, "err-regFullName", "Họ tên phải từ 3 ký tự trở lên");
    return false;
  }
  const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!regex.test(val)) {
    hienThiLoi(regFullName, "err-regFullName", "Họ tên chỉ chứa chữ cái và khoảng trắng");
    return false;
  }
  xoaLoi(regFullName, "err-regFullName");
  return true;
}

function checkEmail() {
  const val = regEmail.value.trim();
  if (val === "") {
    hienThiLoi(regEmail, "err-regEmail", "Email không được để trống");
    return false;
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(val)) {
    hienThiLoi(regEmail, "err-regEmail", "Email không hợp lệ (VD: abc@domain.com)");
    return false;
  }
  xoaLoi(regEmail, "err-regEmail");
  return true;
}

function checkPhone() {
  const val = regPhone.value.trim();
  if (val === "") {
    hienThiLoi(regPhone, "err-regPhone", "Số điện thoại không được để trống");
    return false;
  }
  const regex = /^0[0-9]{9}$/;
  if (!regex.test(val)) {
    hienThiLoi(regPhone, "err-regPhone", "Số điện thoại gồm 10 chữ số và bắt đầu bằng số 0");
    return false;
  }
  xoaLoi(regPhone, "err-regPhone");
  return true;
}

function checkPassword() {
  const val = regPassword.value;
  if (val === "") {
    hienThiLoi(regPassword, "err-regPassword", "Mật khẩu không được để trống");
    return false;
  }
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!regex.test(val)) {
    hienThiLoi(regPassword, "err-regPassword", "Mật khẩu ≥ 8 ký tự, gồm ít nhất 1 chữ hoa, 1 thường, 1 số");
    return false;
  }
  xoaLoi(regPassword, "err-regPassword");
  return true;
}

function checkConfirmPassword() {
  const val = regConfirmPassword.value;
  if (val === "") {
    hienThiLoi(regConfirmPassword, "err-regConfirmPassword", "Vui lòng xác nhận mật khẩu");
    return false;
  }
  if (val !== regPassword.value) {
    hienThiLoi(regConfirmPassword, "err-regConfirmPassword", "Mật khẩu không khớp");
    return false;
  }
  xoaLoi(regConfirmPassword, "err-regConfirmPassword");
  return true;
}

function checkGender() {
  let isChecked = false;
  for (let i = 0; i < genderRadios.length; i++) {
    if (genderRadios[i].checked) {
      isChecked = true;
      break;
    }
  }
  if (!isChecked) {
    hienThiLoi(null, "err-regGender", "Vui lòng chọn giới tính");
    return false;
  }
  xoaLoi(null, "err-regGender");
  return true;
}

function checkTerms() {
  if (!regTerms.checked) {
    hienThiLoi(null, "err-regTerms", "Vui lòng đồng ý với các điều khoản");
    return false;
  }
  xoaLoi(null, "err-regTerms");
  return true;
}

// Sự kiện Blur
regFullName.addEventListener("blur", checkFullName);
regEmail.addEventListener("blur", checkEmail);
regPhone.addEventListener("blur", checkPhone);
regPassword.addEventListener("blur", checkPassword);
regConfirmPassword.addEventListener("blur", checkConfirmPassword);

// Sự kiện Input
regFullName.addEventListener("input", function () { normalizeInput(regFullName); if (document.getElementById("err-regFullName").style.display === "block") checkFullName(); });
regEmail.addEventListener("input", function () { normalizeInput(regEmail); if (document.getElementById("err-regEmail").style.display === "block") checkEmail(); });
regPhone.addEventListener("input", function () { normalizeInput(regPhone); if (document.getElementById("err-regPhone").style.display === "block") checkPhone(); });
regPassword.addEventListener("input", function () { normalizeInput(regPassword); if (document.getElementById("err-regPassword").style.display === "block") checkPassword(); if (regConfirmPassword.value !== "") checkConfirmPassword(); });
regConfirmPassword.addEventListener("input", function () { normalizeInput(regConfirmPassword); if (document.getElementById("err-regConfirmPassword").style.display === "block") checkConfirmPassword(); });
for (let i = 0; i < genderRadios.length; i++) {
  genderRadios[i].addEventListener("change", checkGender);
}
regTerms.addEventListener("change", checkTerms);

// Sự kiện Submit
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const isFNA = checkFullName();
  const isEMValid = checkEmail();
  const isPHValid = checkPhone();
  const isPWValid = checkPassword();
  const isCPValid = checkConfirmPassword();
  const isGNValid = checkGender();
  const isTRMValid = checkTerms();

  // Validate all the time so errors show up for everything
  if (isFNA && isEMValid && isPHValid && isPWValid && isCPValid && isGNValid && isTRMValid) {
    document.getElementById("registerFormContainer").style.display = "none";
    document.getElementById("successCustomerName").textContent = regFullName.value;
    document.getElementById("registerSuccessMsg").style.display = "block";
  }
});

/* =========================================
   BÀI 2.2: JS FORM VALIDATION ĐẶT HÀNG
   ========================================= */
const orderForm = document.getElementById("orderForm");
const ordProduct = document.getElementById("ordProduct");
const ordQuantity = document.getElementById("ordQuantity");
const ordDate = document.getElementById("ordDate");
const ordAddress = document.getElementById("ordAddress");
const ordNote = document.getElementById("ordNote");
const ordPaymentRadios = document.getElementsByName("ordPayment");
const ordTotalAmount = document.getElementById("ordTotalAmount");
const noteCounter = document.getElementById("noteCounter");

function checkOrdProduct() {
  if (ordProduct.value === "") {
    hienThiLoi(ordProduct, "err-ordProduct", "Vui lòng chọn sản phẩm");
    return false;
  }
  xoaLoi(ordProduct, "err-ordProduct");
  return true;
}

function checkOrdQuantity() {
  const val = ordQuantity.value;
  if (val === "" || val < 1 || val > 99 || !Number.isInteger(Number(val))) {
    hienThiLoi(ordQuantity, "err-ordQuantity", "Số lượng phải là số nguyên từ 1 đến 99");
    return false;
  }
  xoaLoi(ordQuantity, "err-ordQuantity");
  return true;
}

function checkOrdDate() {
  const val = ordDate.value;
  if (!val) {
    hienThiLoi(ordDate, "err-ordDate", "Vui lòng chọn ngày giao hàng");
    return false;
  }

  const selectedDate = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    hienThiLoi(ordDate, "err-ordDate", "Ngày giao hàng không được trong quá khứ");
    return false;
  }

  const diffTime = selectedDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 30) {
    hienThiLoi(ordDate, "err-ordDate", "Ngày giao hàng không được quá 30 ngày kể từ hôm nay");
    return false;
  }

  xoaLoi(ordDate, "err-ordDate");
  return true;
}

function checkOrdAddress() {
  const val = ordAddress.value.trim();
  if (val.length < 10) {
    hienThiLoi(ordAddress, "err-ordAddress", "Địa chỉ giao hàng tối thiểu 10 ký tự");
    return false;
  }
  xoaLoi(ordAddress, "err-ordAddress");
  return true;
}

function checkOrdNote() {
  const val = ordNote.value;
  const len = val.length;
  noteCounter.textContent = `${len}/200`;

  if (len > 200) {
    noteCounter.style.color = "red";
    hienThiLoi(ordNote, "err-ordNote", "Ghi chú không quá 200 ký tự");
    return false;
  }
  noteCounter.style.color = "#666";
  xoaLoi(ordNote, "err-ordNote");
  return true;
}

function checkOrdPayment() {
  let isChecked = false;
  for (let i = 0; i < ordPaymentRadios.length; i++) {
    if (ordPaymentRadios[i].checked) {
      isChecked = true;
      break;
    }
  }
  if (!isChecked) {
    hienThiLoi(null, "err-ordPayment", "Vui lòng chọn phương thức thanh toán");
    return false;
  }
  xoaLoi(null, "err-ordPayment");
  return true;
}

// Tính tổng tiền
function calculateTotal() {
  if (ordProduct.value !== "") {
    const selectedOption = ordProduct.options[ordProduct.selectedIndex];
    const price = parseInt(selectedOption.getAttribute("data-price"));
    const qty = parseInt(ordQuantity.value) || 0;

    if (qty >= 1 && qty <= 99) {
      const total = price * qty;
      ordTotalAmount.textContent = total.toLocaleString("vi-VN");
      return total;
    }
  }
  ordTotalAmount.textContent = "0";
  return 0;
}

// Realtime validation & update
ordProduct.addEventListener("change", function () { checkOrdProduct(); calculateTotal(); });
ordQuantity.addEventListener("input", function () { checkOrdQuantity(); calculateTotal(); });
ordQuantity.addEventListener("blur", checkOrdQuantity);

ordDate.addEventListener("input", function () { normalizeInput(ordDate); if (document.getElementById("err-ordDate").style.display === "block") checkOrdDate(); });
ordDate.addEventListener("blur", checkOrdDate);

ordAddress.addEventListener("input", function () { normalizeInput(ordAddress); if (document.getElementById("err-ordAddress").style.display === "block") checkOrdAddress(); });
ordAddress.addEventListener("blur", checkOrdAddress);

ordNote.addEventListener("input", checkOrdNote);

for (let i = 0; i < ordPaymentRadios.length; i++) {
  ordPaymentRadios[i].addEventListener("change", checkOrdPayment);
}

// Thao tác form confirm
orderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const isPDValid = checkOrdProduct();
  const isQTValid = checkOrdQuantity();
  const isDTValid = checkOrdDate();
  const isADValid = checkOrdAddress();
  const isNTValid = checkOrdNote();
  const isPMValid = checkOrdPayment();

  if (isPDValid && isQTValid && isDTValid && isADValid && isNTValid && isPMValid) {
    // Show confirm dialog
    const selectedOption = ordProduct.options[ordProduct.selectedIndex].text;
    const qty = ordQuantity.value;
    const date = ordDate.value;
    const total = calculateTotal().toLocaleString("vi-VN");

    const summaryHtml = `
      <strong>Sản phẩm:</strong> ${selectedOption} <br>
      <strong>Số lượng:</strong> ${qty} <br>
      <strong>Ngày giao:</strong> ${date} <br>
      <strong>Tổng tiền:</strong> <span style="color:red; font-weight:bold;">${total} đ</span>
    `;

    document.getElementById("confirmDetails").innerHTML = summaryHtml;
    document.getElementById("confirmDialog").style.display = "flex";
  }
});

document.getElementById("btnCancelOrder").addEventListener("click", function () {
  document.getElementById("confirmDialog").style.display = "none";
});

  document.getElementById("btnConfirmOrder").addEventListener("click", function() {
  document.getElementById("confirmDialog").style.display = "none";
  document.getElementById("orderFormContainer").style.display = "none";
  document.getElementById("orderSuccessMsg").style.display = "block";
});

/* =========================================
   BTVN 2: MULTI-STEP FORM
   ========================================= */
let currentStep = 1;

const btnMsPrev = document.getElementById("btnMsPrev");
const btnMsNext = document.getElementById("btnMsNext");
const btnMsSubmit = document.getElementById("btnMsSubmit");
const msProgress = document.getElementById("msProgress");
const msStepText = document.getElementById("msStepText");

const msName = document.getElementById("msName");
const msDob = document.getElementById("msDob");
const msGenderRadios = document.getElementsByName("msGender");

const msEmail = document.getElementById("msEmail");
const msPassword = document.getElementById("msPassword");
const msConfirm = document.getElementById("msConfirm");

function validateStep1() {
  let valid = true;
  
  if (msName.value.trim() === "") {
    hienThiLoi(msName, "err-msName", "Họ tên không được để trống");
    valid = false;
  } else { xoaLoi(msName, "err-msName"); }

  if (msDob.value === "") {
    hienThiLoi(msDob, "err-msDob", "Vui lòng chọn ngày sinh");
    valid = false;
  } else { xoaLoi(msDob, "err-msDob"); }

  let genderChecked = false;
  for (let i=0; i<msGenderRadios.length; i++) {
    if (msGenderRadios[i].checked) genderChecked = true;
  }
  if (!genderChecked) {
    hienThiLoi(null, "err-msGender", "Vui lòng chọn giới tính");
    valid = false;
  } else { xoaLoi(null, "err-msGender"); }

  return valid;
}

function validateStep2() {
  let valid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (msEmail.value.trim() === "" || !emailRegex.test(msEmail.value.trim())) {
    hienThiLoi(msEmail, "err-msEmail", "Email không hợp lệ");
    valid = false;
  } else { xoaLoi(msEmail, "err-msEmail"); }

  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!pwdRegex.test(msPassword.value)) {
    hienThiLoi(msPassword, "err-msPassword", "Mật khẩu ≥ 8 ký tự, có chữ hoa, thường, số");
    valid = false;
  } else { xoaLoi(msPassword, "err-msPassword"); }

  if (msConfirm.value === "" || msConfirm.value !== msPassword.value) {
    hienThiLoi(msConfirm, "err-msConfirm", "Mật khẩu không khớp");
    valid = false;
  } else { xoaLoi(msConfirm, "err-msConfirm"); }

  return valid;
}

function updateMsUI() {
  // Hide all
  document.getElementById("msStep1").style.display = "none";
  document.getElementById("msStep2").style.display = "none";
  document.getElementById("msStep3").style.display = "none";

  // Show current
  document.getElementById(`msStep${currentStep}`).style.display = "block";

  // Buttons
  if (currentStep === 1) {
    btnMsPrev.style.display = "none";
    btnMsNext.style.display = "inline-block";
    btnMsNext.style.marginLeft = "auto";
    btnMsSubmit.style.display = "none";
  } else if (currentStep === 2) {
    btnMsPrev.style.display = "inline-block";
    btnMsNext.style.display = "inline-block";
    btnMsNext.style.marginLeft = "";
    btnMsSubmit.style.display = "none";
  } else if (currentStep === 3) {
    btnMsPrev.style.display = "inline-block";
    btnMsNext.style.display = "none";
    btnMsSubmit.style.display = "inline-block";

    // Build summary
    document.getElementById("lblMsName").textContent = msName.value;
    document.getElementById("lblMsDob").textContent = msDob.value;
    
    let gen = "";
    for (let i=0; i<msGenderRadios.length; i++) {
        if (msGenderRadios[i].checked) gen = msGenderRadios[i].value;
    }
    document.getElementById("lblMsGender").textContent = gen;
    document.getElementById("lblMsEmail").textContent = msEmail.value;
  }

  // Progress Bar & Indicators
  if (currentStep === 1) msProgress.style.width = "0%";
  else if (currentStep === 2) msProgress.style.width = "50%";
  else if (currentStep === 3) msProgress.style.width = "100%";

  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`ind-step${i}`);
    if (i <= currentStep) {
      ind.style.background = "#007bff";
      ind.style.color = "white";
    } else {
      ind.style.background = "#eee";
      ind.style.color = "#666";
    }
  }

  msStepText.textContent = `Bước ${currentStep} / 3`;
}

btnMsNext.addEventListener("click", function() {
  if (currentStep === 1) {
    if (validateStep1()) currentStep++;
  } else if (currentStep === 2) {
    if (validateStep2()) currentStep++;
  }
  updateMsUI();
});

btnMsPrev.addEventListener("click", function() {
  if (currentStep > 1) {
    currentStep--;
    updateMsUI();
  }
});

document.getElementById("multiStepForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (currentStep === 3) {
    document.getElementById("multiStepContainer").style.display = "none";
    document.getElementById("msSuccessMsg").style.display = "block";
  }
});

// Event listeners to remove error on input
msName.addEventListener("input", function() { normalizeInput(msName); if(document.getElementById("err-msName").style.display === "block") validateStep1(); });
msDob.addEventListener("input", function() { normalizeInput(msDob); if(document.getElementById("err-msDob").style.display === "block") validateStep1(); });
for(let i=0; i<msGenderRadios.length;i++){ msGenderRadios[i].addEventListener("change", function(){ validateStep1() }); }

msEmail.addEventListener("input", function() { normalizeInput(msEmail); if(document.getElementById("err-msEmail").style.display === "block") validateStep2(); });
msPassword.addEventListener("input", function() { normalizeInput(msPassword); if(document.getElementById("err-msPassword").style.display === "block") validateStep2(); });
msConfirm.addEventListener("input", function() { normalizeInput(msConfirm); if(document.getElementById("err-msConfirm").style.display === "block") validateStep2(); });

// Reset MultiStep Form function attached to global window for button use
window.resetMultiStepForm = function() {
  document.getElementById("multiStepForm").reset();
  currentStep = 1;
  const inputs = document.querySelectorAll("#multiStepForm input");
  inputs.forEach(input => {
    input.classList.remove("input-error");
    input.classList.remove("input-success");
  });
  const spans = document.querySelectorAll("#multiStepForm span.error");
  spans.forEach(span => { span.style.display = "none"; });
  updateMsUI();
};