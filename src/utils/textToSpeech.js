// Función para generar voz con control de velocidad y almacenamiento en localStorage
export async function generateSpeech(text, options = {}) {
  try {
    // Configuración predeterminada
    const defaultOptions = {
      language: 'es',
      speed: 0.75,        // Velocidad predeterminada (1.0 = normal)
      stability: 0.5,    // Estabilidad de la voz
      similarity: 0.5,    // Similitud de la voz
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      saveToLocalStorage: true, // Guardar en localStorage por defecto
    };

    // Combinar opciones predeterminadas con las proporcionadas
    const config = { ...defaultOptions, ...options };

    // Generar una clave única para el texto y las opciones
    const storageKey = `audio_${config.voiceId}_${text}_${config.speed}_${config.stability}_${config.similarity}`;

    // Verificar si el audio ya está en el localStorage
    if (config.saveToLocalStorage) {
      const storedAudio = localStorage.getItem(storageKey);
      if (storedAudio) {
        console.log("Audio recuperado del localStorage.");
        return storedAudio; // Retornar la URL del audio almacenado
      }
    }

    // La API key se toma de variables de entorno
    const API_KEY = sk_7c296aa4406cb1fc802a6e688dc90fab22f36135f23e7b2b;

    // ID de voz (Rachel por defecto)
    const VOICE_ID = config.voiceId;

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: config.stability,
          similarity_boost: config.similarity,
          speaking_rate: config.speed, // Configuración de velocidad
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    // Convertir la respuesta a blob para reproducirla en el navegador
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Guardar el audio en localStorage si está habilitado
    if (config.saveToLocalStorage) {
      localStorage.setItem(storageKey, audioUrl);
      console.log("Audio guardado en localStorage.");
    }

    return audioUrl; // Retornar la URL del audio generado
  } catch (error) {
    console.error('Error al generar audio:', error);
    return null;
  }
}