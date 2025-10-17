import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Props {
  humidity?: number;
  wind?: number; // m/s
  pressure?: number; // hPa
  feelsLike?: number; // °C
  precipitation?: number; // mm in last 1h
  sunset?: number; // unix timestamp
  visibility?: number; // meters
}

export default function WeatherAttributes({ humidity, wind, pressure, feelsLike, precipitation, sunset, visibility }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        <View style={styles.cell}>
          <Text style={styles.label}>Wind</Text>
          <Text style={styles.value}>{wind != null ? `${wind} m/s` : '--'}</Text>
        </View>

        <View style={styles.cell}>
          <Text style={styles.label}>Precipitation</Text>
          <Text style={styles.value}>{typeof precipitation === 'number' ? `${precipitation} mm` : '0 mm'}</Text>
        </View>

        <View style={styles.cell}>
          <Text style={styles.label}>Sunset</Text>
          <Text style={styles.value}>{sunset ? new Date(sunset * 1000).toLocaleTimeString() : '--'}</Text>
        </View>

        <View style={styles.cell}>
          <Text style={styles.label}>Pressure</Text>
          <Text style={styles.value}>{pressure ?? '--'} hPa</Text>
        </View>

        <View style={styles.cell}>
          <Text style={styles.label}>Humidity</Text>
          <Text style={styles.value}>{humidity ?? '--'}%</Text>
        </View>

        <View style={styles.cell}>
          <Text style={styles.label}>Visibility</Text>
          <Text style={styles.value}>{visibility ? `${Math.round(visibility/1000)} km` : '--'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#f2f4f6',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  icon: { fontSize: 26, marginBottom: 4 },
  label: { fontSize: 12, color: '#666', marginBottom: 6 },
  value: { fontSize: 16, fontWeight: '700', color: '#111' },
});

// Usage:
// <WeatherAttributes
//   humidity={weather.main.humidity}
//   wind={weather.wind?.speed}
//   pressure={weather.main.pressure}
//   feelsLike={weather.main.feels_like}
//   precipitation={weather.rain?.['1h']}
//   sunset={weather.sys?.sunset}
//   visibility={weather.visibility}
// />
