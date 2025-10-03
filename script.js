// --- EVENT LISTENER UTAMA ---
document.addEventListener('DOMContentLoaded', () => {

    // --- INISIALISASI & KONFIGURASI AWAL ---
    const usersDB = 'users_db';
    const pklDataDB = 'pkl_data_db';
    
    // Fungsi untuk inisialisasi data dummy jika belum ada
    const initializeData = () => {
        // Inisialisasi Akun Pengguna
        if (!localStorage.getItem(usersDB)) {
            const initialUsers = [
                { username: 'admin', password: '123', role: 'admin' },
                { username: 'user', password: '123', role: 'user' },
                { username: 'pembimbing', password: '123', role: 'pembimbing' },
                { username: 'wakementi', password: '123', role: 'wakementi' }
            ];
            localStorage.setItem(usersDB, JSON.stringify(initialUsers));
        }

        // Inisialisasi Data Tabel PKL
        if (!localStorage.getItem(pklDataDB)) {
            const initialPklData = [
                { id: 1, name: 'Budi Santoso', class: 'XII RPL 1', company: 'PT. Teknologi Maju', status: 'Aktif' },
                { id: 2, name: 'Citra Lestari', class: 'XII RPL 2', company: 'Startup Ceria', status: 'Aktif' },
                { id: 3, name: 'Doni Firmansyah', class: 'XII TKJ 1', company: 'Jaringan Nusantara', status: 'Selesai' }
            ];
            localStorage.setItem(pklDataDB, JSON.stringify(initialPklData));
        }
    };

    initializeData();

    // --- DATA & STATUS PENGGUNA SAAT INI ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userRole = localStorage.getItem('userRole');

    // --- FUNGSI GLOBAL ---
    
    // Fungsi untuk menampilkan Toast Notification
    const showToast = (message, type = 'success') => {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = 'toast'; // Reset class
        toast.classList.add('show');
        if (type === 'error') {
            toast.classList.add('error');
        }

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // --- BAGIAN 1: LOGIKA YANG BERJALAN DI SEMUA HALAMAN ---
    
    // 1.1. Pengaturan Navigasi Berdasarkan Status Login
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        let navHTML = '';
        if (isLoggedIn) {
            // Pengguna sudah login
            navHTML = `
                <li><a href="index.html" class="${location.pathname.endsWith('index.html') || location.pathname === '/' ? 'active' : ''}"><i class="fas fa-chart-bar"></i> Dashboard</a></li>
                <li><a href="about.html" class="${location.pathname.endsWith('about.html') ? 'active' : ''}"><i class="fas fa-info-circle"></i> About</a></li>
                <li><a href="journal.html" class="${location.pathname.endsWith('journal.html') ? 'active' : ''}"><i class="fas fa-book"></i> Journal</a></li>
                <li><a href="data.html" class="${location.pathname.endsWith('data.html') ? 'active' : ''}"><i class="fas fa-table"></i> Data PKL</a></li>
                <li><a href="contact.html" class="${location.pathname.endsWith('contact.html') ? 'active' : ''}"><i class="fas fa-envelope"></i> Contact</a></li>
                <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            `;
        } else {
            // Pengguna belum login
            navHTML = `
                <li><a href="home.html" class="${location.pathname.endsWith('home.html') ? 'active' : ''}"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="login.html" class="${location.pathname.endsWith('login.html') ? 'active' : ''}"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                <li><a href="register.html" class="${location.pathname.endsWith('register.html') ? 'active' : ''}"><i class="fas fa-user-plus"></i> Register</a></li>
            `;
        }
        navLinksContainer.innerHTML = navHTML;
    }

    // 1.2. Logika Redirect Halaman Terproteksi
    const protectedPages = ['index.html', 'about.html', 'journal.html', 'data.html', 'contact.html'];
    const isProtectedPage = protectedPages.some(page => window.location.pathname.endsWith(page));
    
    if (isProtectedPage && !isLoggedIn) {
        window.location.href = 'login.html';
    }

    // 1.3. Logika Tombol Logout
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('userRole');
            showToast('Anda berhasil logout.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }

    // --- BAGIAN 2: LOGIKA SPESIFIK PER HALAMAN ---

    // 2.1. Halaman Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            const users = JSON.parse(localStorage.getItem(usersDB)) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', user.username);
                localStorage.setItem('userRole', user.role);
                showToast(`Selamat datang kembali, ${user.username}!`);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showToast('Username atau password salah!', 'error');
            }
        });
    }

    // 2.2. Halaman Register
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value.trim();
            const confirmPassword = document.getElementById('reg-confirm').value.trim();

            if (password !== confirmPassword) {
                showToast("Password tidak sama!", 'error');
                return;
            }

            let users = JSON.parse(localStorage.getItem(usersDB)) || [];
            if (users.find(u => u.username === username)) {
                showToast("Username sudah terdaftar, gunakan nama lain.", 'error');
                return;
            }

            // User baru selalu memiliki role 'user'
            users.push({ username, password, role: 'user' });
            localStorage.setItem(usersDB, JSON.stringify(users));

            showToast("Registrasi berhasil! Silakan login.", 'success');
            setTimeout(() => {
                 window.location.href = 'login.html';
            }, 1500);
        });
    }
    
    // 2.3. Halaman Dashboard (index.html)
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Selamat datang, ${loggedInUser} (Role: ${userRole})!`;
    }

    // 2.4. Halaman Journal
    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
        const journalList = document.getElementById('journal-list');
        const getJournals = () => JSON.parse(localStorage.getItem('journals')) || [];
        const saveJournals = (journals) => localStorage.setItem('journals', JSON.stringify(journals));
        
        const renderJournals = () => {
            const journals = getJournals();
            journalList.innerHTML = '';
            journals.forEach(journal => {
                const journalCard = document.createElement('div');
                journalCard.className = 'journal-card animate-fade-up';
                const formattedDate = new Date(journal.id).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
                
                // Tombol hapus hanya ditambahkan jika role adalah 'admin'
                const deleteButtonHTML = userRole === 'admin' 
                    ? `<button class="delete-btn" data-id="${journal.id}">Hapus</button>` 
                    : '';

                journalCard.innerHTML = `
                    <div class="journal-header"><h3>${journal.name}</h3><span>Kelas: ${journal.class}</span></div>
                    <p class="journal-content">${journal.content}</p>
                    <div class="journal-footer">
                        <span class="journal-date">${formattedDate}</span>
                        ${deleteButtonHTML}
                    </div>
                `;
                journalList.appendChild(journalCard);
            });
        };

        journalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('nama').value.trim();
            const studentClass = document.getElementById('kelas').value.trim();
            const content = document.getElementById('isi-jurnal').value.trim();
            if (!name || !studentClass || !content) { showToast('Semua kolom harus diisi!', 'error'); return; }
            
            const newJournal = { id: Date.now(), name, class: studentClass, content };
            const journals = getJournals();
            journals.unshift(newJournal);
            saveJournals(journals);
            journalForm.reset();
            renderJournals();
            showToast('Jurnal berhasil disimpan!', 'success');
        });

        journalList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const journalId = e.target.getAttribute('data-id');
                if (confirm('Anda yakin ingin menghapus jurnal ini? Aksi ini tidak bisa dibatalkan.')) {
                    let journals = getJournals();
                    journals = journals.filter(journal => journal.id != journalId);
                    saveJournals(journals);
                    renderJournals();
                    showToast('Jurnal berhasil dihapus.', 'success');
                }
            }
        });

        renderJournals();
    }
    
   // GANTI SELURUH BLOK // 2.5 DI script.js DENGAN YANG INI

// 2.5 Halaman Data PKL (data.html)
const dataTable = document.getElementById('data-table');
if (dataTable) {
    const adminControls = document.getElementById('admin-controls');
    const addRowBtn = document.getElementById('add-row-btn');
    const tableBody = dataTable.querySelector('tbody');

    const getData = () => JSON.parse(localStorage.getItem(pklDataDB)) || [];
    const saveData = (data) => localStorage.setItem(pklDataDB, JSON.stringify(data));

    const renderTable = () => {
        const data = getData();
        tableBody.innerHTML = '';
        const canEdit = userRole === 'admin';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            
            // Kolom aksi hanya untuk admin
            const actionButtons = canEdit ? `
                <button class="delete-row-btn" title="Hapus Baris"><i class="fas fa-trash"></i></button>
            ` : 'Read-only';
            
            row.innerHTML = `
                <td>${item.id}</td>
                <td data-field="name" contenteditable="${canEdit}">${item.name}</td>
                <td data-field="class" contenteditable="${canEdit}">${item.class}</td>
                <td data-field="company" contenteditable="${canEdit}">${item.company}</td>
                <td data-field="status" contenteditable="${canEdit}">${item.status}</td>
                <td class="actions-column">${actionButtons}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Sembunyikan/tampilkan seluruh kolom "Aksi" berdasarkan role
        const actionHeader = dataTable.querySelector('th.actions-column');
        const actionCells = dataTable.querySelectorAll('td.actions-column');
        if (!canEdit) {
            if(actionHeader) actionHeader.style.display = 'none';
            actionCells.forEach(cell => cell.style.display = 'none');
        } else {
            if(actionHeader) actionHeader.style.display = '';
            actionCells.forEach(cell => cell.style.display = '');
        }
    };

    // Tampilkan kontrol (tombol "Tambah Data") jika admin
    if (userRole === 'admin') {
        adminControls.style.display = 'block';
    }

    // Event listener untuk tombol di dalam tabel (Hapus)
    tableBody.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-row-btn');
        if (deleteButton) {
            const row = deleteButton.closest('tr');
            if (confirm('Yakin ingin menghapus data ini?')) {
                const id = parseInt(row.dataset.id, 10);
                let data = getData();
                data = data.filter(item => item.id !== id);
                saveData(data);
                renderTable();
                showToast('Data berhasil dihapus', 'success');
            }
        }
    });

    // Event listener untuk tombol Tambah Data
    if(addRowBtn){
        addRowBtn.addEventListener('click', () => {
            let data = getData();
            const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
            const newItem = { id: newId, name: 'Nama Baru', class: 'Kelas Baru', company: 'Perusahaan Baru', status: 'Baru' };
            data.push(newItem);
            saveData(data);
            renderTable();
            showToast('Baris baru ditambahkan. Silakan edit isinya.', 'success');
        });
    }
    
    // Event Listener untuk menyimpan perubahan setelah edit (saat fokus keluar dari sel)
    tableBody.addEventListener('blur', (e) => {
        const cell = e.target;
        if (cell.hasAttribute('contenteditable') && cell.getAttribute('contenteditable') === 'true') {
            const row = cell.closest('tr');
            const id = parseInt(row.dataset.id, 10); // Pastikan ID adalah angka
            const field = cell.dataset.field;
            const newValue = cell.textContent.trim();

            let data = getData();
            const itemIndex = data.findIndex(item => item.id === id);
            
            if (itemIndex > -1 && data[itemIndex][field] !== newValue) {
                data[itemIndex][field] = newValue;
                saveData(data);
                showToast('Data berhasil diperbarui', 'success');
            }
        }
    }, true); // Gunakan event capturing

    renderTable();
}

    // 2.6. Efek Parallax di Halaman Home
    if (document.querySelector('.parallax-bg')) {
        document.addEventListener('mousemove', function(e) {
            const layers = document.querySelectorAll('.parallax-bg .layer, .moon');
            const x = (window.innerWidth - e.pageX * 2) / window.innerWidth;
            const y = (window.innerHeight - e.pageY * 2) / window.innerHeight;
            layers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                const xMove = x * speed * 20;
                const yMove = y * speed * 20;
                layer.style.transform = `translateX(${xMove}px) translateY(${yMove}px)`;
            });
        });
    }

});