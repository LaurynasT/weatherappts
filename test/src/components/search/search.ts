
import axios from 'axios';
import { pagination } from '../pagination/pagination';
import { buildWeatherUrl } from '../utils/api';
import { showToast } from '../toast/toast';
 

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  icon: string;
  description: string;
}

export const Pagination = new pagination({
  itemsPerPage: 10,
  containerId: 'forecast-list',
  itemClass: 'forecast-item',
  paginationControlsId: 'pagination-controls',
});

export const search = () => {
  const addButton = document.getElementById('add-forecast-btn')!;
  const modal = document.getElementById('forecast-modal') as HTMLElement;
  const modalCloseButton = modal.querySelector('.modal-close')!;
  const citySearchInput = document.getElementById('city-search') as HTMLInputElement;
  const fetchForecastButton = document.getElementById('fetch-forecast-btn')!;
  const forecastList = document.getElementById('forecast-list')!;
  const searchInput = document.getElementById('search-bar') as HTMLInputElement;

  const showModal = () => {
    modal.classList.add('is-active');
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
  };

  const fetchWeatherData = async (query: string): Promise<WeatherData | null> => {
    try {
      const url = buildWeatherUrl(query);
      const response = await axios.get(url);
      const data = response.data;

      return {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        description: data.weather[0].description,
        icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  const displayForecast = (forecast: WeatherData) => {
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('box', 'forecast-item');

    forecastElement.innerHTML = `
      <div>
        <h3 class="title">${forecast.city}, ${forecast.country}</h3>
        <img src="${forecast.icon}" alt="Weather Icon" />
        <p><strong>Weather:</strong> ${forecast.description}</p>
        <p><strong>Temperature:</strong> ${forecast.temperature}°C</p>
        <p><strong>Humidity:</strong> ${forecast.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${forecast.windSpeed} m/s</p>
        <p><strong>Pressure:</strong> ${forecast.pressure} hPa</p>
        <p><strong>Sunrise:</strong> ${forecast.sunrise}</p>
        <p><strong>Sunset:</strong> ${forecast.sunset}</p>
        <button class="button remove-btn mt-4">
          <i class="fas fa-trash is-right"></i>
        </button>
      </div>
    `;

    forecastElement.querySelector('.remove-btn')!.addEventListener('click', () => {
      removeForecast(forecast.city);
      forecastElement.remove();
      Pagination.updateItems();
    });

    forecastList.appendChild(forecastElement);
  };

  const saveForecastToLocalStorage = (forecast: WeatherData) => {
    const forecasts = JSON.parse(localStorage.getItem('forecasts') || '[]');
    forecasts.push(forecast);
    localStorage.setItem('forecasts', JSON.stringify(forecasts));
  };

  const removeForecast = (city: string) => {
    const forecasts = JSON.parse(localStorage.getItem('forecasts') || '[]');
    const updatedForecasts = forecasts.filter(
      (forecast: WeatherData) => forecast.city !== city
    );
    localStorage.setItem('forecasts', JSON.stringify(updatedForecasts));
    showToast(`${city} forecast removed successfully!`, 'success');
  };

  const loadForecasts = () => {
    const forecasts = JSON.parse(localStorage.getItem('forecasts') || '[]');
    forecasts.forEach((forecast: WeatherData) => {
      displayForecast(forecast);
    });
    Pagination.updateItems();
  };

  addButton.addEventListener('click', showModal);
  modalCloseButton.addEventListener('click', closeModal);
  fetchForecastButton.addEventListener('click', async () => {
    const query = citySearchInput.value;
    if (query) {
      const forecast = await fetchWeatherData(query);
      if (forecast) {
        displayForecast(forecast);
        saveForecastToLocalStorage(forecast);
        Pagination.updateItems();
        closeModal();
        showToast('Weather data fetched successfully!', 'success');
      } else {
        showToast('Failed to fetch weather data. Try again.', 'error');
      }
    } else {
      showToast('Please enter a valid search query.', 'error');
    }
  });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const forecastItems = document.querySelectorAll('.forecast-item');
    forecastItems.forEach((item) => {
      const cityName =
        item.querySelector('h3')?.textContent?.toLowerCase() || '';
      if (cityName.includes(searchTerm)) {
        item.classList.remove('is-hidden');
      } else {
        item.classList.add('is-hidden');
      }
    });
  });

  loadForecasts();
};
