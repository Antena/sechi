var services = angular.module('sechi.services', []);

services.factory('Settlement', function() {
    return [
        {
            name : "Comuna 1 y 2",
            center:[-58.3772703,-34.5842539],
            barrios : [ 'Villa 31', 'Villa 31 Bis' ]
        },
        {
            name : "Comuna 4",
            center : [ -58.39825630187988, -34.65290913731696 ],
            barrios : [ 'Villa 21-24', 'CH Espora', 'NHT Zabaleta' ]
        },
        {
            name : "Comuna 8 norte",
            center : [ -58.45293045043945, -34.66392283606156 ],
            barrios : [ 'Barrio Piletones', 'Barrio Fátima', 'Calaza',
                'Calacita', 'Barrio Carrillo', 'CH Soldati',
                'CH Lacarra', 'CH Cruz y Lacarra', 'CH Portela',
                'A. Los Pinos', 'A. La Esperanza', 'A. La Paloma',
                'A. AU 7', 'Barrio Riestra', 'Barrio 26 de junio' ]
        },
        {
            name : "Comuna 8 sur",
            center : [ -58.473873138427734, -34.68919232823158 ],
            barrios : [ 'Villa 20', 'Villa 16', 'CH Lugano I y II',
                'CH Savio I y II', 'CH Parque de las Victorias' ]
        },
        {
            name : "Comuna 8 y 9 oeste",
            center : [ -58.49541664123535, -34.67084094948957 ],
            barrios : [ 'Villa 15 (Ciudad Oculta)', 'CH Piedrabuena',
                'CH Padre Mugica', 'CH M. Dorrego (Los Perales)', 'NHT del Trabajo',
                'Barrio Pirelli', 'Barrio INTA', 'A. Scapino',
                'A. Bermejo', 'A. San Pablo', 'A. Barrio Obrero',
                'A. María Auxiliadora' ]
        },
        {
            name : "Comuna 8 y 9 este",
            center : [ -58.47799301147461, -34.6638522400899 ],
            barrios : [ 'Barrio Cildáñez', 'CH Nágera', 'CH Samoré',
                'CH Castro', 'CH Copello' ]
        },
        {
            name : "Comuna 7",
            center : [ -58.43799591064453, -34.6510027716435 ],
            barrios : [ 'Villa 1-11-14', 'Villa 13 Bis',
                'CH Rivadavia I y II', 'CH Illia',
                'Barrio Charrúa (Gral. San Martín)' ]
        } ]
})

services.factory('OrganizationType', [function() {
    return {
        load: function() {
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
        }
    }
}])

services.factory('ActivityType', [function() {
    return {
        types: [
            {code: 1, topic: "Mejoramiento y mantenimiento habitacional", name: "Limpieza de calles"},
            {code: 2, topic: "Mejoramiento y mantenimiento habitacional", name: "Recolección de basura"},
            {code: 3, topic: "Mejoramiento y mantenimiento habitacional", name: "Servicio eléctrico"},
            {code: 4, topic: "Mejoramiento y mantenimiento habitacional", name: "Urgencias habitacionales (derrumbes, desagües pluviales, cloacas)"},
            {code: 5, topic: "Asistencia alimentaria", name: "Comedor"},
            {code: 6, topic: "Salud", name: "Servicios de salud en el barrio"},
            {code: 7, topic: "Salud", name: "Atención de complejidad"},
            {code: 8, topic: "Salud", name: "Emergencias"},
            {code: 9, topic: "Tercera edad", name: "Hogares para la tercera edad"},
            {code: 10, topic: "Tercera edad", name: "Asistencia tercera edad"},
            {code: 11, topic: "Adicciones", name: "Prevención"},
            {code: 12, topic: "Adicciones", name: "Asistencia"},
            {code: 13, topic: "Personas con discapacidad", name: "Gestión de certificado de discapacidad"},
            {code: 14, topic: "Personas con discapacidad", name: "Promoción de derechos e información"},
            {code: 15, topic: "Educación", name: "Primera infancia"},
            {code: 16, topic: "Educación", name: "Educación inicial"},
            {code: 17, topic: "Educación", name: "Educación primaria"},
            {code: 18, topic: "Educación", name: "Educación media, técnica, artística y superior"},
            {code: 19, topic: "Educación", name: "Apoyo escolar"},
            {code: 20, topic: "Educación", name: "Educación primaria para adultos"},
            {code: 21, topic: "Educación", name: "Educación secundaria para adultos"},
            {code: 22, topic: "Educación", name: "Orientación vocacional"},
            {code: 23, topic: "Educación", name: "Formación profesional"},
            {code: 24, topic: "Educación", name: "Educación no formal"},
            {code: 25, topic: "Educación", name: "Bachillerato Popular"},
            {code: 26, topic: "Servicios sociales", name: "Atención/Derivación casos de Violencia Familiar"},
            {code: 27, topic: "Servicios sociales", name: "Atención a la mujer"},
            {code: 28, topic: "Servicios sociales", name: "Documentos de Identidad"},
            {code: 29, topic: "Servicios sociales", name: "Atención personas en situación de calle"},
            {code: 30, topic: "Servicios sociales", name: "Hogares para niños y adolescentes"},
            {code: 31, topic: "Seguridad", name: "Servicios de Seguridad"},
            {code: 32, topic: "Acceso a la justicia", name: "Recepción de denuncias"},
            {code: 33, topic: "Acceso a la justicia", name: "Asistencia a la víctima"},
            {code: 34, topic: "Acceso a la justicia", name: "Asesoramiento Jurídico Gratuito"},
            {code: 35, topic: "Acceso a la justicia", name: "Patrocinio jurídico gratuito"},
            {code: 36, topic: "Promoción y defensa de derechos", name: "Promoción de derechos de niños, niñas y adolescentes"},
            {code: 37, topic: "Cultura", name: "Medios de comunicación barriales (radios y diarios del barrio)"},
            {code: 38, topic: "Cultura", name: "Bibliotecas y rincones de lectura"},
            {code: 39, topic: "Cultura", name: "Festivales y fiestas barriales"},
            {code: 40, topic: "Cultura", name: "Danza"},
            {code: 41, topic: "Cultura", name: "Programas y talleres culturales en el barrio de Artes Escénicas"},
            {code: 42, topic: "Cultura", name: "Programas y talleres culturales en el barrio de Artes Plásticas/Manualidades"},
            {code: 43, topic: "Cultura", name: "Programas y talleres culturales en el barrio de Audiovisual"},
            {code: 44, topic: "Cultura", name: "Programas y talleres culturales en el barrio de Música"},
            {code: 45, topic: "Deportes y recreación", name: "Práctica de deportes"},
            {code: 46, topic: "Deportes y recreación", name: "Actividades recreativas"},
            {code: 47, topic: "Desarrollo económico local", name: "Emprendimiento productivo"},
            {code: 48, topic: "Otros", name: "Otras"}
        ],
        topics: function() {
            var topics = [];
            this.types.map(function(type) {
                if (topics.indexOf(type.topic) < 0) {
                    topics.push(type.topic);
                }
            })
            return topics;
        }
    }
}])

services.factory('ActivityAges', [function() {
	return {
		ages:[{name:"A: 0-4",checked:false},{name:"B: 5-6",checked:false},{name:"C: 7-13",checked:false},{name:"D: 14-17",checked:false},{name:"E: Adultos",checked:false},{name:"F: Tercera Edad",checked:false},{name:"G: Todas las Edades",checked:false}]
	}
}])