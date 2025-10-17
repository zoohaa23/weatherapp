import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import WeatherAttributes from '../../components/ui/weather-attributes';
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure?: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind?: {
    speed?: number;
  };
  visibility?: number; // meters
  sys?: {
    sunset?: number; // unix timestamp
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
}


export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const apiKey = "11caa159dd2f89be7b3ceea39f2be22f"; // Replace with your OpenWeatherMap API key

  const getWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (!response.ok) {
        // API returned an error (404, 401, etc.)
        const message = data?.message ?? 'City not found!';
        alert(message);
        setWeather(null);
        return;
      }

      // normalize and pick expected fields so the UI always has the properties we rely on
      const normalized: WeatherData = {
        name: data.name ?? city,
        main: {
          temp: data.main?.temp ?? 0,
          humidity: data.main?.humidity ?? 0,
          pressure: data.main?.pressure ?? 0,
          feels_like: data.main?.feels_like ?? 0,
          temp_min: data.main?.temp_min ?? data.main?.temp ?? 0,
          temp_max: data.main?.temp_max ?? data.main?.temp ?? 0,
        },
        weather: Array.isArray(data.weather) && data.weather.length ? data.weather : [{ main: data.weather?.main ?? '', description: data.weather?.description ?? '', icon: data.weather?.icon ?? '' }],
        wind: { speed: data.wind?.speed ?? 0 },
        visibility: data.visibility ?? 0,
        sys: { sunset: data.sys?.sunset ?? 0 },
        rain: data.rain ?? {},
      };
      console.log('normalized weather:', normalized);
      setWeather(normalized);
    } catch (error) {
      console.error('getWeather error', error);
      alert("Error fetching weather");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤 Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Search city"
        value={city}
        onChangeText={setCity}
        onSubmitEditing={() => { setCity(city.trim()); getWeather(); }}
        returnKeyType="search"
      />

  {/* Press Enter in the input to fetch weather */}

      {weather && (
        <View style={styles.result}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.sectionTitle}>Zoha Imran</Text>
            <Text style={styles.bigTemp}>{Math.round(weather.main.temp)}°</Text>
            <Text style={styles.conditionText}>☁️ {weather.weather[0].main}</Text>
            <Text style={styles.minMax}>H: {weather.main.temp_max != null ? Math.round(weather.main.temp_max) + '°' : '--'}  L: {weather.main.temp_min != null ? Math.round(weather.main.temp_min) + '°' : '--'}</Text>
          {/* Grid card showing humidity, wind, pressure, feels-like */}
          <WeatherAttributes
            humidity={weather.main.humidity}
            wind={weather.wind?.speed}
            pressure={weather.main.pressure}
            feelsLike={weather.main.feels_like}
            precipitation={weather.rain?.['1h'] ?? weather.rain?.['3h']}
            sunset={weather.sys?.sunset}
            visibility={weather.visibility}
          />
          <Image
            style={styles.icon}
            source={{
              uri:`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 25,
    backgroundColor: "#e6f0ff",
  },
  title: { fontSize: 30, fontWeight: "bold", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    width: "100%",
    marginBottom: 15,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  city: { fontSize: 20, fontWeight: "bold" },
  sectionTitle: { alignSelf: 'center', marginTop: 10, marginBottom: 6, fontWeight: '600', color: '#666' },
  icon: { width: 100, height: 100, marginTop: 10 },
  bigTemp: { fontSize: 120, fontWeight: '900', color: '#111', lineHeight: 120 },
  conditionText: { fontSize: 18, marginTop: 6, fontWeight: '600' },
  minMax: { fontSize: 12, color: '#666', marginTop: 6 },
  dateText: { color: '#666', marginTop: 6 },
} as any);
