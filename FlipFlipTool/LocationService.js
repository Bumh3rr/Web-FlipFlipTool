export class LocationService {
    constructor() {
        this.municipiosData = {};
    }

    async loadStates() {
        try {
            const response = await fetch('estados.json');
            return await response.json();
        } catch (error) {
            console.error('Error cargando los estados:', error);
            throw error;
        }
    }

    async loadMunicipalities() {
        try {
            const response = await fetch('estados-municipios.json');
            this.municipiosData = await response.json();
            return this.municipiosData;
        } catch (error) {
            console.error('Error cargando los municipios:', error);
            throw error;
        }
    }

    populateStatesSelect(selectId = 'address_state') {
        this.loadStates().then(estados => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Seleccione el Estado</option>';
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.clave;
                option.textContent = estado.nombre;
                option.setAttribute('data-nombre', estado.nombre);
                select.appendChild(option);
            });
        });
    }

    populateMunicipalitiesSelect(stateName, selectId = 'address_municipality') {
        const municipios = this.municipiosData[stateName] || [];
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Seleccione el Municipio</option>';
        municipios.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio;
            option.textContent = municipio;
            select.appendChild(option);
        });
    }

    setupStateChangeListener(stateSelectId = 'address_state', municipalitySelectId = 'address_municipality') {
        document.getElementById(stateSelectId).addEventListener('change', (event) => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            const nombreEstado = selectedOption.getAttribute('data-nombre');
            this.populateMunicipalitiesSelect(nombreEstado, municipalitySelectId);
        });
    }
}