document.addEventListener("DOMContentLoaded", function () {
    const takimlar = [
        "Manchester City", "Manchester United", "Arsenal", "Chelsea", "Liverpool",
        "Benfica", "Juventus", "Milan", "İnter", "Real Madrid",
        "Barcelona", "Atalanta", "Napoli", "Ajax", "Feyenoord",
        "Newcastle United", "Leverkusen", "Roma", "Porto", "Santos"
    ];

    // Başlangıçta tüm takımların verilerini sıfırlıyoruz ve son 5 maçları takip ediyoruz
    let ligVerileri = takimlar.map((takim) => ({
        takim: takim,
        OM: 0, G: 0, B: 0, M: 0, // Oynanan, Galibiyet, Beraberlik, Mağlubiyet
        AG: 0, YG: 0, A: 0, P: 0, // Atılan, Yedilen, Averaj, Puan
        son5Mac: [] // Son 5 maç verileri
    }));

    const tbody = document.querySelector("#ligTablosu tbody");
    const takim1Select = document.getElementById("takim1");
    const takim2Select = document.getElementById("takim2");
    const skor1Input = document.getElementById("gol1");
    const skor2Input = document.getElementById("gol2");
    const sonucEkleButton = document.getElementById("sonucEkle");

    // Tabloyu güncelleyip takımları ekle
    function tabloyuGuncelle() {
        tbody.innerHTML = ""; // Önceki tabloyu temizle
        ligVerileri.sort((a, b) => b.P - a.P || b.A - a.A); // Önce puana, sonra averaja göre sırala

        ligVerileri.forEach((takim, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${takim.takim}</td>
                <td>${takim.OM}</td>
                <td>${takim.G}</td>
                <td>${takim.B}</td>
                <td>${takim.M}</td>
                <td>${takim.AG}</td>
                <td>${takim.YG}</td>
                <td>${takim.A}</td>
                <td>${takim.P}</td>
                <td>${takim.son5Mac.join(" ")}</td> <!-- Son 5 maç verilerini burada göster -->
            `;
            tbody.appendChild(row);
        });
    }

    // Takım seçeneklerini doldur
    function dropdownDoldur() {
        takimlar.forEach(takim => {
            const option1 = document.createElement("option");
            option1.value = takim;
            option1.textContent = takim;
            takim1Select.appendChild(option1);

            const option2 = option1.cloneNode(true);
            takim2Select.appendChild(option2);
        });
    }

    // Maç sonucu ekle
    function macEkle() {
        const takim1 = takim1Select.value;
        const takim2 = takim2Select.value;
        const skor1 = parseInt(skor1Input.value);
        const skor2 = parseInt(skor2Input.value);

        // Geçerli maç ve skor kontrolü
        if (takim1 === takim2 || isNaN(skor1) || isNaN(skor2)) {
            alert("Lütfen farklı takımlar seçin ve geçerli skorlar girin!");
            return;
        }

        let t1 = ligVerileri.find(t => t.takim === takim1);
        let t2 = ligVerileri.find(t => t.takim === takim2);

        t1.OM += 1;
        t2.OM += 1;
        t1.AG += skor1;
        t1.YG += skor2;
        t2.AG += skor2;
        t2.YG += skor1;

        t1.A = t1.AG - t1.YG;
        t2.A = t2.AG - t2.YG;

        if (skor1 > skor2) {
            t1.G += 1;
            t1.P += 3;
            t2.M += 1;
            t1.son5Mac.push("✅");
            t2.son5Mac.push("❌");
        } else if (skor1 < skor2) {
            t2.G += 1;
            t2.P += 3;
            t1.M += 1;
            t1.son5Mac.push("❌");
            t2.son5Mac.push("✅");
        } else {
            t1.B += 1;
            t2.B += 1;
            t1.P += 1;
            t2.P += 1;
            t1.son5Mac.push("–");
            t2.son5Mac.push("–");
        }

        // Son 5 maç kaydını sınırlı tutmak
        if (t1.son5Mac.length > 5) t1.son5Mac.shift();
        if (t2.son5Mac.length > 5) t2.son5Mac.shift();

        tabloyuGuncelle();
    }

    // Sayfa tamamen yüklendikten sonra işlemleri başlat
    dropdownDoldur();
    tabloyuGuncelle();

    // Maç sonucu eklemek için butona tıklama olayını bağlayalım
    sonucEkleButton.addEventListener("click", macEkle);
});
