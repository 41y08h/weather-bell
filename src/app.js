const form = document.querySelector("form");
const infoContainer = document.querySelector("#infoContainer");

const API_URL =
  "http://api.openweathermap.org/data/2.5/weather?q=city&appid=8008bcf0e10d9ad68ab28560b9dc6b49&units=metric";

form.addEventListener("submit", getWeatherInfo);
async function getWeatherInfo(e) {
  e.preventDefault();
  const city = form.querySelector("input").value;
  infoContainer.innerHTML = ". . .";
  const data = await api(city);
  if (data === 400)
    return (infoContainer.innerHTML = `<p class="text-center mt-5">Something went wrong!</p>`);
  if (data != 404) {
    const { weather, main, sys } = data;

    const description = capitalize(weather[0].description);
    const icon_url = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const temp = main.temp;
    const feels_like = main.feels_like;
    const temp_min = main.temp_min;
    const temp_max = main.temp_max;
    const sunrise = sys.sunrise;
    const sunset = sys.sunset;
    const name = data.name;

    let info = `
  <div
  class="py-3 px-4 pl-0 bg-gray-50 bg-opacity-10 mt-3 rounded-xl flex items-center"
>
  <img
    class="h-16 w-16"
    src="${icon_url}"
    alt="weather icon"
  />
  <div class="pr-2">
    <h2 class="text-2xl font-liht">${name}</h2>
    <p>${description}</p>
  </div>
  <div class="ml-auto">
    <p class="text-xl text-center">${temp} ° C</p>
  </div>
</div>
<div
  class="flex flex-col py-3 px-4 bg-gray-50 bg-opacity-10 mt-3 rounded-xl items-center text-center"
>
  <div class="flex items-center text-center w-full">
    <p class="w-full">Min. ${temp_min} ° C</p>
    <p class="w-full">Max. ${temp_max} ° C</p>
  </div>
  <p class="mt-3 pt-2 border-t border-gray-50 border-opacity-20 w-full">
    Feels like ${feels_like} ° C
  </p>
</div>
<div
  class="flex text-center py-3 px-4 bg-gray-50 bg-opacity-10 mt-3 rounded-xl"
>
  <p class="w-full">🌄 ${new Date(sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}</p>
  <p class="w-full">🌆 ${new Date(sunset * 100).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}</p>
</div>
<p class="text-center text-xs mt-1">Time is shown in your local time.</p>
  `;

    infoContainer.innerHTML = info;
  } else {
    infoContainer.innerHTML = `
    <img src="./error.png" alt="error"/>
    <p class="text-center">City not found!</p>
    `;
  }
}

async function api(city) {
  try {
    const t = await fetch(API_URL.replace("city", city));
    if (t.status != 200) return 404;
    return await t.json();
  } catch {
    return 400;
  }
}

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
