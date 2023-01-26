let a = new Date();
let currentTime = a.getHours();
let currentYear = a.getFullYear();
let currentMonth = a.getMonth() + 1;
let sunriseSpan = document.querySelector(".rowTop div:last-child div:first-child");
let sunsetSpan = document.querySelector(".rowBottom div:last-child div:first-child");
console.log(currentTime);
let key = `48eb388ddf744839be24db836a47c5ff`;
if ((currentTime > 0 && currentTime < 7) || (currentTime >= 18 && currentTime <= 24)) {
    document.querySelector(".container").classList.add("bg-night");
}
else if (currentTime >= 7 && currentTime < 16) {
    document.querySelector(".container").classList.add("bg-morning");

}
else if (currentTime >= 16 && currentTime < 18) {
    document.querySelector(".container").classList.add("bg-sunset");
}


document.querySelector(".btn").addEventListener("click", async function () {
    let cityName = await document.querySelector("#txtCity").value;
    let cityReq = new XMLHttpRequest();
    cityReq.open("GET", `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${key}`);
    cityReq.send();
    cityReq.addEventListener("load", () => {
        const cityData = cityReq.responseText;
        let jsonCityData = JSON.parse(cityData);
        let request = new XMLHttpRequest();
        let long = jsonCityData.results[0].geometry.lat;
        let lat = jsonCityData.results[0].geometry.lng;
        document.querySelector(".cityName").textContent = cityName.toUpperCase();
        request.open("GET", `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=windspeed_10m&hourly=weathercode&hourly=temperature_2m&hourly=rain`);
        request.send();
        request.addEventListener("load", () => {
            const data = request.responseText;
            let ndata = JSON.parse(data);
            let napi = new XMLHttpRequest();
            napi.open("GET", `https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}&timezone=UTC&date=today`);
            napi.send();
            napi.addEventListener("load", () => {
                const sdata = napi.responseText;
                let nsdata = JSON.parse(sdata);
                let sunriseh = " ", sunseth = " ";
                sunriseh = ((nsdata.results.sunrise).slice(0, 2));
                sunseth = (nsdata.results.sunset).slice(0, 2);
                sunrisem = ((nsdata.results.sunrise).slice(2, 4))//09
                sunsutm = ((nsdata.results.sunset).slice(2, 4))//48
                sunriseh = parseInt(sunriseh) + 3;//7
                sunseth = parseInt(sunseth) + 15;//17
                let sunrise = `${sunriseh}.${sunrisem}`;
                let sunset = `${sunseth}.${sunsutm}`;
                sunriseSpan.textContent = sunrise;
                sunsetSpan.textContent = sunset;
            })
            if (currentMonth < 10) {
                currentMonth = `0${currentMonth}`;
            }
            else currentMonth = currentMonth;
            let currentDay = a.getDate();
            document.querySelector(".cityDate .date").textContent =
                `${currentDay} / ${currentMonth} / ${currentYear}`;
            document.querySelector(".numeric").textContent = `${getAverage(ndata.hourly.temperature_2m)}°`;
            document.querySelector(".rowTop .alignment:first-child div:first-child").textContent = `${getMax(ndata.hourly.temperature_2m)}°`;
            document.querySelector(".rowBottom .alignment:first-child div:first-child").textContent = `${getMin(ndata.hourly.temperature_2m)}°`;
            document.querySelector(".rowTop .alignment:nth-child(2) div:first-child").textContent = `${getAverageWind(ndata.hourly.windspeed_10m)}k/h`;
            let timeSpans = document.querySelectorAll(".footer .cards .card span:first-child");
            let clockSpans = document.querySelectorAll(".footer .cards .card span:nth-child(2)");
            let degreeSpans = document.querySelectorAll(".footer .cards .card span:last-child");
            let wheaterSitSpans = document.querySelectorAll(".footer .cards .card span:nth-child(3)");
            let mainWeatherIcon = document.querySelector(".cloud ");
            getTodayDate(timeSpans, currentTime, currentMonth, currentDay);
            getClocks(currentTime, ndata.hourly.time, clockSpans);
            getDegree(currentTime, currentDay, ndata.hourly.time, ndata.hourly.temperature_2m, degreeSpans);
            getWheaterSituation(currentTime, currentDay, ndata.hourly.time, ndata.hourly.weathercode, wheaterSitSpans);
            let averageWheaterCode = getAverageWheaterCode(currentTime, currentDay, ndata.hourly.time, ndata.hourly.weathercode, mainWeatherIcon);
            getMainWeahterIcon(averageWheaterCode, mainWeatherIcon);
            document.querySelector(".rowBottom div:nth-child(2) div:first-child").textContent = getRainPossibility(currentTime, currentDay, ndata.hourly.time, ndata.hourly.rain);
        })
    })
})
function GetToday(dizi, a) {
    for (let i = 0; i < dizi.length; i++) {
        if (dizi[i] == a) {
            return i;
        }
    }
}
function getAverage(dizi) {
    let toplam = 0;
    let average = 0;
    for (let i = 0; i < 23; i++) {
        toplam += dizi[i];
    }
    average = toplam / 23;
    return average.toFixed(1);
}
function getMax(dizi) {
    let max = 0;
    for (let i = 0; i < 23; i++) {
        if (max <= dizi[i]) {
            max = dizi[i];
        }
    }
    return max;
}
function getMin(dizi) {
    let min = 100;
    for (let i = 0; i < 23; i++) {
        if (min >= dizi[i]) {
            min = dizi[i];
        }
    }
    return min;
}
function getAverageWind(dizi) {
    let toplam = 0;
    let average = 0;
    for (let i = 0; i < 23; i++) {
        toplam += dizi[i];
    }
    average = toplam / 23;
    return average.toFixed(1);
}
function getTodayDate(timeSpans, saat, ay, gün) {
    let nTarih = "";
    for (let i = 0; i < timeSpans.length; i++) {
        if (saat > 23) {
            saat = 0;
            gün++;
            timeSpans[i].textContent = nTarih;
        }
        nTarih = `${gün}.${ay} `;
        timeSpans[i].textContent = nTarih;
        saat++;
    }
}
function getClocks(saat, dizi, timeSpans) {
    let d = 0;
    vakit = saat;
    if (saat < 10) {
        saat = `0${vakit}:00`;
    }
    else {
        saat = `${vakit}:00`;
    }
    for (let i = 0; i < 9; i++) {
        vakit++;
        dizi[i] = String(dizi[i]).slice(11);
        timeSpans[d].textContent = saat;
        if (vakit == 24) {
            vakit = 0;
        }
        if (vakit < 10) {
            saat = `0${vakit}:00`;
        }
        else {
            saat = `${vakit}:00`;
        }
        d++;
    }
}
function getDegree(a, currentDay, tarihDizisi, dizi, degreeSpans) {
    let c = 0;
    let d = 0;
    if (a < 10) {
        a = `${currentDay}T0${a}:00`;
    }
    else {
        a = `${currentDay}T${a}:00`;
    }

    for (let i = 0; i < tarihDizisi.length; i++) {
        if (tarihDizisi[i].slice(8) == a) {
            c = i;
        }
    }
    for (let i = c; i < c + 9; i++) {
        degreeSpans[d].textContent = dizi[i];
        d++;
    }
}
function getWheaterSituation(a, currentDay, tarihDizisi, codes, degreeSpans) {
    let c = 0;
    if (a < 10) {
        a = `${currentDay}T0${a}:00`;
    }
    else {
        a = `${currentDay}T${a}:00`;
    }

    for (let i = 0; i < tarihDizisi.length; i++) {
        if (tarihDizisi[i].slice(8) == a) {
            c = i;
        }
    }
    let q = 0;
    a = (Number(a.slice(3).slice(0, 2)));
    for (let i = c; i < c + 9; i++) {
        switch (codes[i]) {
            case 0:
                if (a < 7 || a >= 19) {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-moon"></i>`; break;
                }
                else {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-sun"></i>`; break;
                }
            case 1: case 2: case 3: case 45: case 48: case 51: case 53:
                if (a < 7 || a >= 19) {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud-moon"></i>`; break;
                }
                else {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud-sun"></i>`; break;
                }
            case 55: case 56: case 57:
                if (a < 7 || a >= 19) {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud-moon"></i>`; break;
                }
                else {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud"></i>`; break;
                }
            case 61: case 63: case 65:
                if (a < 7 || a >= 19) {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud-moon-rain"></i>`; break;
                }
                else {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud-showers"></i>`; break;
                }
            case 66: case 67:
                if (a < 7 || a >= 19) {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud-moon-rain"></i>`; break;
                }
                else {
                    degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud-showers-heavy"></i>`; break;
                }
            case 71: case 73: case 75: degreeSpans[q].innerHTML = `<i class="fa-solid fa-snowflake"></i>`; break;
            case 77: degreeSpans[q].innerHTML = `<i class="fa-solid fa-snowflakes"></i>`; break;
            default: degreeSpans[q].innerHTML = `<i class="fa-solid fa-cloud"></i>`; break;
        }
        if (a == 24) {
            a = 0;
        }
        q++; a++;
    }
}
function getAverageWheaterCode(a, currentDay, tarihDizisi, codeDizisi) {
    let c = 0;
    if (a < 10) {
        a = `${currentDay}T0${a}:00`;
    }
    else {
        a = `${currentDay}T${a}:00`;
    }
    for (let i = 0; i < tarihDizisi.length; i++) {
        if (tarihDizisi[i].slice(8) == a) {
            c = i;
        }
    }
    let sum = 0;
    for (let i = c; i < c + 24; i++) {
        sum += codeDizisi[i];
    }
    return parseInt(sum / 24);
}
function getMainWeahterIcon(ortalamaKod, Icon) {
    switch (ortalamaKod) {
        case 0:
            if (a < 7 || a >= 19) {
                Icon.innerHTML = `<i class="fa-solid fa-moon"></i>`; break;
            }
            else {
                Icon.innerHTML = `<i class="fa-solid fa-sun"></i>`; break;
            }
        case 1: case 2: case 3: case 45: case 48: case 51: case 53:
            if (a < 7 || a >= 19) {
                Icon.innerHTML = `<i class="fa-solid fa-cloud-moon"></i>`; break;
            }
            else {
                Icon.innerHTML = `<i class="fa-solid fa-cloud-sun"></i>`; break;
            }
        case 55: case 56: case 57:
            if (a < 7 || a >= 19) {
                Icon.innerHTML = `<i class="fa-solid fa-cloud-moon"></i>`; break;
            }
            else {
                Icon.innerHTML = `<i class="fa-solid fa-cloud"></i>`; break;
            }
        case 61: case 63: case 65:
            if (a < 7 || a >= 19) {
                Icon.innerHTML = `<i class="fa-solid fa-cloud-moon-rain"></i>`; break;
            }
            else {
                Icon.innerHTML = `<i class="fa-solid fa-cloud-showers"></i>`; break;
            }
        case 66: case 67:
            if (a < 7 || a >= 19) {
                Icon.innerHTML = `<i class="fa-solid fa-cloud-moon-rain"></i>`; break;
            }
            else {
                Icon.innerHTML = `<i class="fa-solid fa-cloud-showers-heavy"></i>`; break;
            }
        case 71: case 73: case 75: Icon.innerHTML = `<i class="fa-solid fa-snowflake"></i>`; break;
        case 77: Icon.innerHTML = `<i class="fa-solid fa-snowflakes"></i>`; break;
        default: Icon.innerHTML = `<i class="fa-solid fa-cloud"></i>`; break;
    }
}
function getRainPossibility(a, currentDay, tarihDizisi, yagmurDizisi) {
    let c = 0;
    if (a < 10) {
        a = `${currentDay}T0${a}:00`;
    }
    else {
        a = `${currentDay}T${a}:00`;
    }

    for (let i = 0; i < tarihDizisi.length; i++) {
        if (tarihDizisi[i].slice(8) == a) {
            c = i;
        }
    }
    let rainSum = 0;
    for (let i = c; i < c + 24; i++) {
        rainSum += yagmurDizisi[i];
    }
    rainSum = (rainSum / 24);
    if (rainSum < 20) {
        return "% 20"
    }
    else if (rainSum > 20 & rainSum <= 50) {
        return `% 50`
    }
    else if (rainSum > 50 & rainSum <= 75) {
        return `% 70`
    }
    else if (rainSum > 75 & rainSum <= 100) {
        return `% 100`
    }
}
