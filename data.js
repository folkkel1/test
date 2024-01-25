// กำหนด URL ของ API ที่เราจะเชื่อมต่อ
const GET_NEWS_API_URL = 'http://dev-sw6-uapi.ecm.in.th/uapi/drt-ElectronicsDocument/ED-GetNews';
const UPDATE_STATUS_API_URL = 'http://dev-sw6-uapi.ecm.in.th/uapi/drt-ElectronicsDocument/ED-UpdateStatusNews';

let newsData = []; // ตัวแปรนี้จะเก็บข้อมูลข่าวทั้งหมดที่ดึงมาจาก API

// ฟังก์ชันสำหรับดึงข้อมูลข่าว
function fetchNews() {
  fetch(GET_NEWS_API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data fetched from the API:', data); // แสดงข้อมูลดึงจาก API ในคอนโซล
      newsData = data.data; // จัดเก็บข้อมูลข่าวในตัวแปร newsData
      displayNews(data.data); // ปรับตามโครงสร้างข้อมูลข่าว
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// ฟังก์ชันสำหรับแสดงข้อมูลในตาราง
function displayNews(newsData) {
    const tableBody = document.querySelector('table tbody');
    // ล้างข้อมูลเดิมในตาราง
    tableBody.innerHTML = '';
    
  
    newsData.forEach((news, index) => {
        const row = tableBody.insertRow(); // สร้าง row ใหม่ในตาราง

        // เพิ่ม toggle button ที่นี่
        const toggleCell = row.insertCell(0); // ใส่ toggle button ใน cell แรก
        const toggleButton = document.createElement('label');
        toggleButton.classList.add('switch');
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = news.Status === 1; // เปิดสถานะตามข้อมูล API
        checkbox.onchange = function() {
            updateNewsStatus(news.NewsId, this.checked ? 1 : 0);
        };
        const slider = document.createElement('span');
        slider.classList.add('slider');
        toggleButton.appendChild(checkbox);
        toggleButton.appendChild(slider);
        toggleCell.appendChild(toggleButton);

        // จากนั้นเพิ่ม cell สำหรับข้อมูลอื่นๆ
        const cellNumber = row.insertCell(1);
        cellNumber.textContent = index + 1;
        const cellTitle = row.insertCell(2);
        cellTitle.textContent = news.NameNews;
        const cellDate = row.insertCell(3);
        cellDate.textContent = formatDate(news.UpdatedDate);
        const cellActions = row.insertCell(4);
        cellActions.innerHTML = `
            ${news.ButtonView ? `<button class="icon-button view-icon" onclick="viewNews(${news.NewsId})"><i class="fas fa-eye"></i></button>` : ''}
            ${news.ButtonEdit ? `<button class="icon-button edit-icon" onclick="editNews(${news.NewsId})"><i class="fas fa-edit"></i></button>` : ''}
            ${news.ButtonDelete ? `<button class="icon-button delete-icon" onclick="deleteNews(${news.NewsId})"><i class="fas fa-trash-alt"></i></button>` : ''}
        `;
    });
}

  
  
  
  // ฟังก์ชันสำหรับรูปแบบวันที่
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  // เรียกใช้ฟังก์ชัน fetchNews ทันทีเมื่อโหลดหน้าเว็บ
  fetchNews();
  
// ฟังก์ชันสำหรับอัพเดตสถานะข่าว
function updateNewsStatus(newsId, newStatus) {
  fetch(UPDATE_STATUS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newsId, status: newStatus })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('News status updated:', data);
      fetchNews(); // รีเฟรชข้อมูลข่าว
    })
    .catch(error => {
      console.error('There has been a problem with your update operation:', error);
    });
}

// ฟังก์ชันสำหรับแสดงรายละเอียดข่าวใน modal
function viewNews(newsId) {
    const news = newsData.find(news => news.NewsId === newsId);
    if (news) {
      document.getElementById('modalNameNews').value = news.NameNews;
      document.getElementById('modalDetail').value = news.Detail;
      document.getElementById('modalStatus').checked = news.Status === 1;
      document.getElementById('newsDetailModal').style.display = 'block';
    } else {
      console.error('News not found');
    }
  }
  
  // ฟังก์ชันสำหรับปิด modal
  function closeModal() {
    document.getElementById('newsDetailModal').style.display = 'none';
  }
  
  


// เรียกใช้ฟังก์ชัน fetchNews ทันทีเมื่อโหลดหน้าเว็บ
fetchNews();


