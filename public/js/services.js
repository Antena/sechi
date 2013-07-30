var services = angular.module('sechi.services', []);

services.factory('OrganizationType', [function() {
    return {
        State: [
            { label: "Hospital" },
            { label: "Escuela" },
            { label: "CESAC" },
            { label: "Policía" },
            { label: "Portal Inclusivo SECHI" },
            { label: "Prefectura" },
            { label: "Ministerio Público Fiscal" },
            { label: "Gendarmería" },
            { label: "Consejo de Niños, Niñas y Adolescentes" },
            { label: "Centreo Acceso a la Justicia (CAJ)" },
            { label: "UBA - Acción Comunitaria" },
            { label: "Juegotecta" },
            { label: "Servicio Social Zonal" },
            { label: "Centro de Primera Infancia" },
            { label: "Sede Comunal" },
            { label: "Asesoría General Tutelar" }
        ],
        StateOther: null,
        NonState: [
            { label: "Asociación Civil" },
            { label: "Polideportivo" },
            { label: "Fundación" },
            { label: "Club" },
            { label: "Cooperativa" },
            { label: "Canchas" },
            { label: "Mutual" },
            { label: "Iglesia" },
            { label: "Comedor" },
            { label: "Emprendimiento productivo" },
            { label: "Centro Cultural" },
            { label: "Juegoteca" },
            { label: "Hogar para niños y adolescentes" }
        ],
        NonStateOther: null
    }
}])