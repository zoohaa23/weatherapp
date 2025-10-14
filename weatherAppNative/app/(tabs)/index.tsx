import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const apiKey = "e345f5cc0ea48cd7ca92b61b254117f0"; // Replace with your OpenWeatherMap API key

  const getWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        alert("City not found!");
        setWeather(null);
      }
    } catch (error) {
      alert("Error fetching weather");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤 Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
        onSubmitEditing={getWeather} // Press Enter to fetch
      />

      <Button title="Get Weather" onPress={getWeather} />

      {weather && (
        <View style={styles.result}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text>🌡 Temperature: {weather.main.temp}°C</Text>
          <Text>☁️ Condition: {weather.weather[0].main}</Text>
          <Text>💧 Humidity: {weather.main.humidity}%</Text>
          <Image
            style={styles.icon}
            source={{
              uri:`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png,`
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
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#e6f0ff",
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  city: { fontSize: 20, fontWeight: "bold" },
  icon: { width: 100, height: 100, marginTop: 10 },
});