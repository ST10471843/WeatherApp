import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const API_KEY = "3779dd0ae5fea606b18243e69b4fc3ed"; // OpenWeatherMap key
const CITY = "Johannesburg";

export default function App() {
  const [weather, setWeather] = useState<any>(null); // current weather
  const [forecast, setForecast] = useState<any[]>([]); // 5-day forecast
  const [loading, setLoading] = useState(true);

  // Function to load weather data
  const fetchWeather = async () => {
    try {
      setLoading(true);

      // Get current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentRes.json();

      // Get 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      // Pick 1 forecast per day (every 8th item)
      const daily = forecastData.list.filter((_: any, index: number) => index % 8 === 0);

      setWeather(currentData);
      setForecast(daily);
    } catch (err) {
      console.error("Error fetching weather:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load once when app starts
  useEffect(() => {
    fetchWeather();
  }, []);

  // Loading screen
  if (loading || !weather) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6A0DAD" />
        <Text style={{ marginTop: 20, color: "#4B0082" }}>
          Loading weather...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* City and Date */}
      <Text style={styles.city}>{weather.name}</Text>
      <Text style={styles.date}>{new Date().toLocaleString()}</Text>

      {/* Current weather */}
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>

      {/* 5-day forecast stacked vertically */}
      <FlatList
        data={forecast}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.day}>
              {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </Text>
            <Text style={styles.cardTemp}>
              {Math.round(item.main.temp)}°C
            </Text>
            <Text style={styles.cardDesc}>{item.weather[0].main}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E6E6FA", // light lilac
    padding: 20,
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082", // dark purple for contrast
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#4B0082",
    marginBottom: 10,
  },
  temp: {
    fontSize: 48,
    fontWeight: "300",
    color: "#4B0082",
    marginVertical: 10,
  },
  desc: {
    fontSize: 18,
    color: "#6A0DAD", // medium purple
    marginBottom: 20,
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#D8BFD8", // thistle lilac
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  day: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E0854", // deep purple
  },
  cardTemp: {
    fontSize: 22,
    color: "#4B0082",
    marginVertical: 5,
  },
  cardDesc: {
    fontSize: 16,
    color: "#2E0854",
  },
});

