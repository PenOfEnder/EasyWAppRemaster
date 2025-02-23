const form = document.querySelector("#buscar");

    form.addEventListener("submit", async (e) => {
        const inputBuscar = document.querySelector(
            "#search",
        ) as HTMLInputElement;

        const texto = inputBuscar.value;
        e.preventDefault();
        console.log(texto);

        try {
            
            const respuesta = await fetch(
                `http://localhost:8080/traducir/${texto}`,
            );
            let json = await respuesta.json();
            json["Palabra"] = texto;
            localStorage.setItem("traduccionData", JSON.stringify(json));
            // Opcional: disparar evento para notificar cambios
            window.dispatchEvent(new Event("traduccionActualizada"));
            let ancor = document.createElement("a");
            ancor.href = "/translate-page";
            ancor.click();
        } catch (error) {
            console.error("Error:", error);
        }
    });