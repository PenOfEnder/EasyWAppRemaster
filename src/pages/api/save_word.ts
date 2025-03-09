import type { APIRoute } from 'astro';

// Simulamos un almacenamiento en servidor
// En una aplicación real, esto podría ser una base de datos o alguna otra solución de almacenamiento persistente
let wordStorage: any = null;

export const post: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        
        // Guardamos los datos recibidos en nuestro almacenamiento simulado
        wordStorage = data;
        
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Datos guardados correctamente'
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error al procesar la solicitud'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

// Esta función permite a otras rutas obtener los datos almacenados
export const getWordData = () => {
    return wordStorage;
};