
document.getElementById("formLogin").addEventListener("submit", function(event) {

    // Mencegah halaman refresh ketika tombol Login ditekan
    event.preventDefault();

    // Mengambil email dan password yang diketik
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Mencari pengguna dalam data dari dosen
    const pengguna = dataPengguna.find(function(user) {
        return user.email === email && user.password === password;
    });

    // Memeriksa hasil Login
    if (pengguna) {

        // Menampilkan pesan jika Login berhasil
        alert("Login berhasil! Selamat datang, " + pengguna.nama);

        // Menyimpan nama pengguna untuk dashboard
        sessionStorage.setItem("namaPengguna", pengguna.nama);

        // Mengarahkan pengguna ke halaman dashboard
        window.location.href = "dashboard.html";

    } else {

        // Menampilkan pesan jika email atau password salah
        alert("email/password yang anda masukkan salah");
    }
});


// Pop-up Lupa Password
document.getElementById("btnLupa").addEventListener("click", function() {

    // Menampilkan kotak dialog Lupa Password
    document.getElementById("modalLupa").showModal();
});

// Mengatur tombol Tutup pada pop-up Lupa Password
document.getElementById("tutupLupa").addEventListener("click", function() {

    // Menutup kotak dialog Lupa Password
    document.getElementById("modalLupa").close();
});


// Pop-up Daftar
document.getElementById("btnDaftar").addEventListener("click", function() {

    // Menampilkan kotak dialog pendaftaran
    document.getElementById("modalDaftar").showModal();
});

// Mengatur tombol Tutup pada pop-up Daftar
document.getElementById("tutupDaftar").addEventListener("click", function() {

    // Menutup kotak dialog pendaftaran
    document.getElementById("modalDaftar").close();
});
