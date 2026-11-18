/* =========================================================
   FibStudio — Chatbot de preguntas frecuentes
   Widget flotante con respuestas rápidas y accesos directos
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Configuración
     --------------------------------------------------------- */
  const WHATSAPP_NUMERO = '593962377437';
  const WHATSAPP_MENSAJE = 'Hola FibStudio, tengo una pregunta sobre sus servicios.';
  const CORREO = 'fibstudio.of@gmail.com';
  const INSTAGRAM = 'https://www.instagram.com/fib.studio.oc';

  const enlaceWhatsApp = (mensaje) =>
    'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensaje || WHATSAPP_MENSAJE);

  /* ---------------------------------------------------------
     Preguntas frecuentes
     --------------------------------------------------------- */
  const FAQ = [
    {
      id: 'precios',
      chip: 'Precios',
      pregunta: '¿Cuánto cuesta una sesión o un evento?',
      claves: [
        'precio', 'precios', 'cuanto cuesta', 'cuanto cuestan', 'cuanto sale',
        'cuanto vale', 'cuesta', 'cuestan', 'sale', 'salen', 'vale', 'valen',
        'tarifa', 'tarifas', 'costo', 'costos', 'cotizacion', 'cotizar',
        'cotizo', 'presupuesto', 'barato', 'economico', 'caro', 'cuanto'
      ],
      respuesta: 'Cada proyecto se cotiza a medida: no es lo mismo una sesión de una hora que una boda de jornada completa. El valor depende de:\n\n- La duración de la cobertura o sesión\n- La locación y los traslados\n- Si necesitas segundo fotógrafo\n- Los entregables que quieras\n\nCuéntanos **qué, cuándo y dónde** quieres fotografiar y te enviamos una propuesta clara, sin compromiso.',
      enlaces: [
        { texto: 'Pedir cotización', url: '#contacto' },
        { texto: 'Cotizar por WhatsApp', whatsapp: 'Hola FibStudio, quiero cotizar una sesión o un evento.' }
      ],
      sugiere: ['reservar', 'que-incluye', 'entrega', 'contacto']
    },
    {
      id: 'reservar',
      chip: 'Reservar',
      pregunta: '¿Cómo reservo una fecha?',
      claves: [
        'reservar', 'reserva', 'reservas', 'reservo', 'agendar', 'agenda',
        'agendo', 'cita', 'citas', 'contratar', 'contrato', 'apartar',
        'aparto', 'separar', 'separo', 'como reservo', 'quiero reservar',
        'como agendo', 'fecha', 'fechas'
      ],
      respuesta: 'Es muy simple:\n\n1. Nos cuentas tu idea, la fecha y la ciudad.\n2. Te enviamos disponibilidad y una propuesta a tu medida.\n3. Confirmas la fecha y planeamos los detalles.\n\nRespondemos en menos de 24 horas. Puedes escribirnos por el formulario o directamente por WhatsApp.',
      enlaces: [
        { texto: 'Ir al formulario', url: '#contacto' },
        { texto: 'Reservar por WhatsApp', whatsapp: 'Hola FibStudio, quiero reservar una fecha.' }
      ],
      sugiere: ['precios', 'disponibilidad', 'pago', 'contacto']
    },
    {
      id: 'disponibilidad',
      chip: 'Disponibilidad',
      pregunta: '¿Tienen disponibilidad en mi fecha?',
      claves: [
        'disponible', 'disponibilidad', 'disponibles', 'cupo', 'cupos',
        'hay espacio', 'estan disponibles', 'libre', 'ocupados', 'agenda abierta'
      ],
      respuesta: 'Trabajamos con una agenda limitada para cuidar cada proyecto. Escríbenos con la **fecha y la ciudad** de tu evento o sesión y te confirmamos disponibilidad en menos de 24 horas.\n\nEn temporada de bodas y fin de año conviene reservar con anticipación.',
      enlaces: [
        { texto: 'Consultar mi fecha', whatsapp: 'Hola FibStudio, quiero consultar disponibilidad para mi fecha.' }
      ],
      sugiere: ['reservar', 'precios', 'contacto']
    },
    {
      id: 'adelanto',
      chip: 'Adelanto',
      pregunta: '¿Entregan un adelanto de las fotos?',
      claves: [
        'adelanto', 'adelantos', 'avance', 'preview', 'previa',
        'primeras fotos', 'fotos adelanto', '48 horas',
        'cuarenta y ocho horas', 'rapido', 'rapida'
      ],
      respuesta: 'Sí. En la cobertura de eventos entregamos un **adelanto en las primeras 48 horas** para que puedas compartirlo mientras trabajamos el resto del material.\n\nEn las sesiones personalizadas acordamos contigo el momento de la primera entrega.',
      sugiere: ['entrega', 'fotos-cantidad', 'que-incluye']
    },
    {
      id: 'entrega',
      chip: 'Entrega',
      pregunta: '¿Cuándo entregan las fotos finales?',
      claves: [
        'entrega', 'entregas', 'entregan', 'entregar', 'demora', 'demoran',
        'demoras', 'cuanto tarda', 'cuanto tardan', 'tarda', 'tardan',
        'plazo', 'plazos', 'dias', 'semanas', 'cuando estan',
        'cuando estaran', 'galeria', 'listas', 'listo', 'tiempo'
      ],
      respuesta: 'La galería final se entrega editada, en alta resolución y organizada por momentos. El plazo depende del volumen de fotos y del tipo de cobertura; lo dejamos **por escrito al reservar** para que no haya sorpresas.\n\nEn eventos, el adelanto llega en las primeras 48 horas.',
      sugiere: ['adelanto', 'fotos-cantidad', 'derechos']
    },
    {
      id: 'fotos-cantidad',
      chip: 'Cuántas fotos',
      pregunta: '¿Cuántas fotos entregan?',
      claves: [
        'cuantas fotos', 'cuantas imagenes', 'cantidad de fotos',
        'numero de fotos', 'fotos incluidas', 'cuantas fotos entregan',
        'cuantas', 'cantidad', 'minimo de fotos', 'cuantas son'
      ],
      respuesta: 'No trabajamos con un número fijo: la cantidad depende de la duración, el tipo de evento y los momentos que haya que cubrir. Nuestra prioridad es la calidad de cada imagen, no llenar una cifra.\n\nAntes de reservar acordamos un **mínimo de fotos entregadas** para que sepas qué esperar.',
      sugiere: ['entrega', 'que-incluye', 'derechos']
    },
    {
      id: 'que-incluye',
      chip: 'Qué incluye',
      pregunta: '¿Qué incluye el servicio?',
      claves: [
        'incluye', 'incluyen', 'que incluye', 'que llevan', 'paquete',
        'paquetes', 'plan', 'planes', 'todo incluido', 'que ofrecen',
        'que ofrece'
      ],
      respuesta: 'Depende del servicio, pero en general incluye:\n\n- Conversación previa para entender qué quieres recordar\n- Planeación de locación, horarios y guía visual\n- Cobertura fotográfica el día acordado\n- Edición cuidada de las imágenes seleccionadas\n- Galería digital en alta resolución\n\nEn eventos sumamos la opción de segundo fotógrafo y un adelanto a las 48 horas.',
      enlaces: [
        { texto: 'Ver servicios', url: '#servicios' }
      ],
      sugiere: ['precios', 'sesiones', 'eventos']
    },
    {
      id: 'edicion',
      chip: 'Edición',
      pregunta: '¿Cómo editan las fotos?',
      claves: [
        'edicion', 'ediciones', 'editan', 'editar', 'retoque', 'retocan',
        'retocar', 'photoshop', 'filtros', 'color', 'revelado', 'look'
      ],
      respuesta: 'Editamos una por una: color, luz y detalle, manteniendo un look natural. No usamos filtros automáticos ni cambios que te hagan ver distinto.\n\nSi tienes una referencia o un estilo que te guste, compártelo antes de la sesión y lo tomamos en cuenta.',
      sugiere: ['derechos', 'estilo', 'entrega']
    },
    {
      id: 'derechos',
      chip: 'Uso de fotos',
      pregunta: '¿Puedo imprimir y compartir las fotos?',
      claves: [
        'derechos', 'imprimir', 'impresion', 'imprimir fotos',
        'uso personal', 'uso comercial', 'compartir', 'publicar', 'redes',
        'descargar', 'alta resolucion', 'archivos', 'originales', 'raw',
        'usar las fotos', 'usar fotos', 'negocio', 'comercial', 'vender'
      ],
      respuesta: 'Recibes las imágenes editadas en alta resolución para uso personal: imprimir, compartir y publicar en tus redes. Te pedimos mencionar a FibStudio cuando las publiques.\n\nPara uso comercial o publicitario lo acordamos antes de la sesión.',
      sugiere: ['entrega', 'edicion', 'contacto']
    },
    {
      id: 'bodas',
      chip: 'Bodas',
      pregunta: '¿Cubren bodas?',
      claves: [
        'boda', 'bodas', 'casamiento', 'casarme', 'matrimonio', 'civil',
        'ceremonia', 'novios', 'novia', 'novio', 'me caso', 'nos casamos',
        'casar', 'casamos'
      ],
      respuesta: 'Cubrimos la boda completa o desde el punto que necesites: preparativos, ceremonia, recepción y esos momentos que suelen pasar desapercibidos. Trabajamos sin interrumpir, atentos a los gestos reales.\n\nIncluye adelanto en 48 horas y galería digital editada. Cuéntanos fecha, lugar y número de invitados para enviarte una propuesta.',
      enlaces: [
        { texto: 'Cotizar mi boda', url: '#contacto' }
      ],
      sugiere: ['eventos', 'que-incluye', 'reservar']
    },
    {
      id: 'eventos',
      chip: 'Eventos',
      pregunta: '¿Qué eventos cubren?',
      claves: [
        'evento', 'eventos', 'cumpleanos', 'fiesta', 'fiestas',
        'corporativo', 'empresa', 'lanzamiento', 'bautizo', 'graduacion',
        'celebracion', 'reunion', 'conferencia', 'congreso'
      ],
      respuesta: 'Cubrimos cumpleaños, celebraciones familiares, bautizos, graduaciones, lanzamientos de marca y eventos corporativos. Desde 4 horas hasta jornada completa, con opción de segundo fotógrafo.\n\nEl objetivo es entregarte el evento tal como se sintió, no solo la lista de momentos oficiales.',
      enlaces: [
        { texto: 'Cotizar mi evento', url: '#contacto' }
      ],
      sugiere: ['bodas', 'sesiones', 'que-incluye']
    },
    {
      id: 'sesiones',
      chip: 'Sesiones',
      pregunta: '¿Qué tipo de sesiones hacen?',
      claves: [
        'sesion', 'sesiones', 'retrato', 'retratos', 'pareja', 'parejas',
        'familia', 'familias', 'book', 'books', 'marca personal',
        'embarazo', 'newborn', 'recien nacido', 'preboda', 'postboda',
        'fotos personales'
      ],
      respuesta: 'Hacemos retratos, parejas, familias, embarazo, marca personal y books. La sesión se diseña alrededor de una idea o emoción concreta, no de poses genéricas.\n\nIncluye guía de vestuario, moodboard previo y una locación a tu elección o una propuesta nuestra.',
      enlaces: [
        { texto: 'Agendar mi sesión', url: '#contacto' }
      ],
      sugiere: ['eventos', 'vestuario', 'locacion']
    },
    {
      id: 'vestuario',
      chip: 'Vestuario',
      pregunta: '¿Qué ropa llevo a la sesión?',
      claves: [
        'ropa', 'vestuario', 'que me pongo', 'outfit', 'colores',
        'llevar', 'preparar', 'maquillaje', 'vestido', 'traje',
        'look para la sesion'
      ],
      respuesta: 'Antes de la sesión te enviamos una guía breve. Como punto de partida:\n\n- Colores neutros o tierra, que combinan con la luz natural\n- Evita logos grandes y estampados muy cargados\n- Trae dos opciones para cambiar de look\n- Prioriza ropa con la que te sientas tú\n\nSi es un evento, elige comodidad: vas a moverte mucho.',
      sugiere: ['sesiones', 'locacion', 'estilo']
    },
    {
      id: 'locacion',
      chip: 'Locación',
      pregunta: '¿Dónde hacen las sesiones?',
      claves: [
        'lugar', 'lugares', 'locacion', 'locaciones', 'donde hacen',
        'donde toman', 'estudio', 'exterior', 'exteriores', 'playa',
        'ciudad', 'traslado', 'viaje', 'movilizacion', 'donde son',
        'donde se hacen'
      ],
      respuesta: 'Puedes elegir la locación o nosotros proponerte una según la historia que quieras contar: exteriores naturales, ciudad o estudio. Para eventos nos desplazamos al lugar de la celebración.\n\nSi es fuera de la ciudad, coordinamos traslado y tiempos contigo antes de cotizar.',
      sugiere: ['sesiones', 'duracion', 'precios']
    },
    {
      id: 'ubicacion',
      chip: 'Ubicación',
      pregunta: '¿Dónde están ubicados?',
      claves: [
        'ubicados', 'ubicacion', 'donde estan', 'donde quedan',
        'donde estan ubicados', 'direccion', 'oficina', 'pais',
        'donde trabajan', 'donde atienden'
      ],
      respuesta: 'Coordinamos sesiones y coberturas según la ciudad y la fecha de tu proyecto. Escríbenos con tu ubicación y te confirmamos disponibilidad, traslados y tiempos.\n\nSi tu evento es fuera de la ciudad, lo evaluamos juntos antes de cotizar.',
      enlaces: [
        { texto: 'Consultar por WhatsApp', whatsapp: 'Hola FibStudio, quiero consultar por mi ciudad y fecha.' }
      ],
      sugiere: ['locacion', 'contacto', 'disponibilidad']
    },
    {
      id: 'duracion',
      chip: 'Duración',
      pregunta: '¿Cuánto dura una sesión o evento?',
      claves: [
        'cuanto dura', 'cuanto duran', 'cuanto tiempo', 'duracion',
        'dura', 'duran', 'horas', 'hora', 'jornada', 'media jornada',
        'tiempo de sesion'
      ],
      respuesta: 'Las sesiones personalizadas suelen durar entre una y tres horas, según el concepto y las locaciones. La cobertura de eventos va desde 4 horas hasta jornada completa.\n\nSiempre definimos el tiempo contigo antes de reservar para que no falte ni sobre.',
      sugiere: ['sesiones', 'precios', 'reservar']
    },
    {
      id: 'video',
      chip: 'Video',
      pregunta: '¿Ofrecen video?',
      claves: ['video', 'videos', 'reel', 'clips', 'detras de camaras', 'making of'],
      respuesta: 'Sí, como opción adicional en sesiones podemos incluir un video corto detrás de cámaras. En eventos, cuéntanos qué tipo de pieza necesitas y lo cotizamos aparte.',
      sugiere: ['sesiones', 'eventos', 'precios']
    },
    {
      id: 'pago',
      chip: 'Pagos',
      pregunta: '¿Cómo se paga?',
      claves: [
        'pago', 'pagos', 'pagar', 'formas de pago', 'transferencia',
        'tarjeta', 'efectivo', 'deposito', 'anticipo', 'senal', 'cuotas',
        'financiamiento', 'como pago'
      ],
      respuesta: 'Al confirmar la fecha se acuerda un **anticipo**, y el saldo se paga antes de la entrega final. Coordinamos el medio de pago directamente contigo por WhatsApp según tu ciudad.\n\nTodo queda por escrito en la propuesta para que tengas claridad desde el inicio.',
      enlaces: [
        { texto: 'Coordinar pago por WhatsApp', whatsapp: 'Hola FibStudio, quiero consultar las formas de pago.' }
      ],
      sugiere: ['reservar', 'cancelacion', 'contacto']
    },
    {
      id: 'cancelacion',
      chip: 'Cambios',
      pregunta: '¿Puedo cambiar o cancelar la fecha?',
      claves: [
        'cancelar', 'cancelacion', 'cambiar fecha', 'cambiar la fecha',
        'cambio de fecha', 'reprogramar', 'reagendar', 'devolucion',
        'reembolso', 'mover la fecha', 'cambio'
      ],
      respuesta: 'Si necesitas cambiar la fecha, avísanos lo antes posible y buscamos un nuevo espacio en la agenda. Las condiciones del anticipo y de una eventual cancelación se acuerdan **por escrito al reservar**.\n\nSi es por una emergencia, escríbenos: siempre buscamos una solución razonable.',
      enlaces: [
        { texto: 'Hablar por WhatsApp', whatsapp: 'Hola FibStudio, necesito cambiar la fecha de mi reserva.' }
      ],
      sugiere: ['reservar', 'pago', 'contacto']
    },
    {
      id: 'estilo',
      chip: 'Estilo',
      pregunta: '¿Cómo es su estilo de fotografía?',
      claves: [
        'estilo', 'estilos', 'fotografia', 'fotografian', 'natural',
        'espontaneo', 'poses', 'posar', 'incomodo', 'incomoda', 'camara',
        'direccion', 'verguenza'
      ],
      respuesta: 'Nuestro estilo es natural, cálido y espontáneo: dirigimos cuando hace falta, pero no forzamos poses. Buscamos los gestos reales y la luz que sostiene la escena.\n\nSi no te sientes cómodo frente a la cámara, no te preocupes: la mayoría de las fotos salen de conversar y dejarse llevar.',
      sugiere: ['sesiones', 'portafolio', 'edicion']
    },
    {
      id: 'portafolio',
      chip: 'Portafolio',
      pregunta: '¿Dónde puedo ver su trabajo?',
      claves: [
        'portafolio', 'trabajos', 'ver fotos', 'fotos', 'ejemplos',
        'muestras', 'instagram', 'redes sociales', 'fotos de ejemplo',
        'trabajo anterior'
      ],
      respuesta: 'Puedes ver una muestra en la sección **Portafolio** del sitio y en nuestro Instagram: @fib.studio.oc. Cada foto tiene su historia detrás.\n\nSi quieres ver un trabajo completo parecido a lo que imaginas, escríbenos y te compartimos una galería de referencia.',
      enlaces: [
        { texto: 'Ver portafolio', url: '#portafolio' },
        { texto: 'Abrir Instagram', url: INSTAGRAM }
      ],
      sugiere: ['sesiones', 'eventos', 'contacto']
    },
    {
      id: 'contacto',
      chip: 'Hablar con una persona',
      pregunta: '¿Cómo los contacto?',
      claves: [
        'hablar con una persona', 'hablar con alguien', 'persona', 'humano',
        'contacto', 'contactar', 'whatsapp', 'telefono', 'correo', 'email',
        'llamar', 'escribir', 'asesor', 'asesoria', 'atencion', 'comunicarme',
        'numero', 'numero de telefono', 'celular', 'movil'
      ],
      respuesta: 'La forma más rápida es **WhatsApp: +593 96 237 7437**. También puedes escribirnos a fibstudio.of@gmail.com o dejar tu mensaje en el formulario del sitio.\n\nRespondemos en menos de 24 horas.',
      enlaces: [
        { texto: 'Escribir por WhatsApp', whatsapp: WHATSAPP_MENSAJE },
        { texto: 'Enviar correo', url: 'mailto:' + CORREO },
        { texto: 'Ir al formulario', url: '#contacto' }
      ],
      sugiere: ['reservar', 'precios', 'horarios']
    },
    {
      id: 'horarios',
      chip: 'Horarios',
      pregunta: '¿Cuándo responden?',
      claves: [
        'horario', 'horarios', 'atienden', 'abierto', 'abren', 'responden',
        'contestan', 'cuando responden', 'a que hora', 'dias de atencion'
      ],
      respuesta: 'Respondemos en menos de 24 horas. Las sesiones y los eventos se agendan según disponibilidad, incluidos fines de semana.\n\nPara una respuesta más rápida, escríbenos por WhatsApp.',
      enlaces: [
        { texto: 'Escribir por WhatsApp', whatsapp: WHATSAPP_MENSAJE }
      ],
      sugiere: ['contacto', 'disponibilidad', 'reservar']
    },
    {
      id: 'estudio',
      chip: 'El estudio',
      pregunta: '¿Quiénes son FibStudio?',
      claves: [
        'fibstudio', 'fib studio', 'fibonacci', 'quienes son',
        'quienes somos', 'estudio', 'nombre', 'espiral', 'historia',
        'sobre ustedes', 'que es fibstudio'
      ],
      respuesta: 'FibStudio nace de Fibonacci: la espiral áurea que guía la mirada hacia lo que importa. Trasladamos esa idea a la fotografía: cada evento y cada sesión tiene un punto de atención emocional —una mirada, un abrazo, un silencio— y nuestro trabajo es encontrarlo y encuadrarlo.\n\nNo fotografiamos solo lo que pasó; fotografiamos lo que se sintió.',
      enlaces: [
        { texto: 'Conocer el estudio', url: '#estudio' }
      ],
      sugiere: ['portafolio', 'sesiones', 'contacto']
    },
    {
      id: 'saludo',
      chip: 'Saludar',
      cortesia: true,
      pregunta: 'Hola',
      claves: [
        'hola', 'holaa', 'buenas', 'buenos dias', 'buenas tardes',
        'buenas noches', 'saludos', 'hey', 'que tal', 'holi'
      ],
      respuesta: '¡Hola! ¿En qué puedo ayudarte? Puedes preguntarme por precios, reservas, entregas, sesiones o eventos.',
      sugiere: ['precios', 'reservar', 'entrega', 'contacto']
    },
    {
      id: 'despedida',
      chip: 'Despedirse',
      cortesia: true,
      pregunta: 'Adiós',
      claves: [
        'adios', 'chao', 'hasta luego', 'nos vemos', 'bye',
        'hasta pronto', 'me voy'
      ],
      respuesta: '¡Gracias por escribirnos! Si necesitas algo más, aquí estaré. También puedes contactarnos por WhatsApp cuando quieras.',
      enlaces: [
        { texto: 'Escribir por WhatsApp', whatsapp: WHATSAPP_MENSAJE }
      ],
      sugiere: ['contacto', 'reservar', 'precios']
    },
    {
      id: 'agradecimiento',
      chip: 'Agradecer',
      cortesia: true,
      pregunta: 'Gracias',
      claves: [
        'gracias', 'muchas gracias', 'genial', 'perfecto', 'excelente',
        'buenisimo', 'buenismo', 'listo gracias', 'ok gracias'
      ],
      respuesta: '¡Con gusto! Si te surge otra duda, escríbeme cuando quieras. Y si quieres avanzar con tu reserva, el formulario de contacto está abierto.',
      enlaces: [
        { texto: 'Ir al formulario', url: '#contacto' }
      ],
      sugiere: ['reservar', 'precios', 'contacto']
    },
    {
      id: 'menu',
      chip: 'Qué puedes hacer',
      pregunta: '¿Qué puedo preguntarte?',
      claves: [
        'ayuda', 'opciones', 'menu', 'que puedes hacer',
        'en que puedes ayudar', 'en que me puedes ayudar', 'que sabes',
        'que preguntas', 'temas', 'informacion', 'info'
      ],
      respuesta: 'Puedo ayudarte con estos temas:\n\n- Precios y cotizaciones\n- Reservas y disponibilidad\n- Entrega y cantidad de fotos\n- Qué incluye cada servicio\n- Sesiones, eventos y bodas\n- Formas de pago y cambios de fecha\n\nEscribe tu pregunta o toca una sugerencia.',
      sugiere: ['precios', 'reservar', 'entrega', 'contacto']
    }
  ];

  /* ---------------------------------------------------------
     Motor de respuestas (palabras clave, sin IA)
     --------------------------------------------------------- */
  const CHIPS_INICIALES = ['precios', 'reservar', 'entrega', 'que-incluye', 'contacto'];

  const SIN_RESPUESTA = {
    id: 'sin-respuesta',
    chip: 'Otra pregunta',
    pregunta: '',
    claves: [],
    respuesta: 'No tengo una respuesta exacta para eso todavía. Puedo ayudarte con precios, reservas, entregas, sesiones, eventos y pagos.\n\nSi tu pregunta es más específica, escríbenos por WhatsApp y te responde una persona del estudio. También puedes usar el formulario de contacto.',
    enlaces: [
      { texto: 'Escribir por WhatsApp', whatsapp: 'Hola FibStudio, tengo una pregunta sobre sus servicios.' },
      { texto: 'Ir al formulario', url: '#contacto' }
    ],
    sugiere: CHIPS_INICIALES
  };

  const PALABRAS_VACIAS = new Set([
    'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que',
    'en', 'y', 'e', 'o', 'u', 'a', 'al', 'del', 'por', 'para', 'con',
    'sin', 'sobre', 'entre', 'hasta', 'desde', 'mi', 'mis', 'tu', 'tus',
    'su', 'sus', 'se', 'es', 'son', 'ser', 'soy', 'esta', 'este', 'esto',
    'estas', 'estos', 'lo', 'le', 'les', 'me', 'te', 'nos', 'os', 'ya',
    'mas', 'pero', 'si', 'no', 'muy', 'tambien', 'hay', 'tienen', 'tiene',
    'tengo', 'quiero', 'quisiera', 'necesito', 'puedo', 'podria', 'puede',
    'hacen', 'hacer', 'tal'
  ]);

  const normalizar = (texto) =>
    String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const raiz = (palabra) => {
    if (palabra.length > 5 && palabra.endsWith('es')) return palabra.slice(0, -2);
    if (palabra.length > 4 && palabra.endsWith('s')) return palabra.slice(0, -1);
    return palabra;
  };

  const palabrasDe = (texto) =>
    normalizar(texto)
      .split(' ')
      .filter((palabra) => palabra && !PALABRAS_VACIAS.has(palabra))
      .map(raiz);

  function puntuar(entrada, textoNormalizado, palabras) {
    let puntaje = 0;
    const vistas = new Set();

    for (const clave of entrada.claves) {
      const limpia = normalizar(clave);
      if (!limpia) continue;

      if (limpia.includes(' ')) {
        const marca = 'frase:' + limpia;
        if (vistas.has(marca)) continue;
        vistas.add(marca);
        // Las frases ("cuanto cuesta") pesan más que una palabra suelta.
        if (textoNormalizado.includes(limpia)) puntaje += 3;
      } else {
        const marca = 'raiz:' + raiz(limpia);
        if (vistas.has(marca)) continue;
        vistas.add(marca);
        if (palabras.has(raiz(limpia))) puntaje += 2;
      }
    }


    let coincidencias = 0;
    for (const palabra of new Set(palabrasDe(entrada.pregunta))) {
      if (palabras.has(palabra)) coincidencias += 1;
    }

    return puntaje + Math.min(coincidencias, 3);
  }

  function sugerenciasDe(entrada) {
    if (entrada === SIN_RESPUESTA) return CHIPS_INICIALES.slice();

    const ids = (entrada.sugiere || []).filter((id) => id !== entrada.id);
    for (const id of CHIPS_INICIALES) {
      if (ids.length >= 4) break;
      if (id !== entrada.id && !ids.includes(id)) ids.push(id);
    }
    return ids.slice(0, 4);
  }

  function buscar(texto) {
    const limpio = normalizar(texto);

    if (!limpio) {
      return { entrada: SIN_RESPUESTA, puntaje: 0, sugerencias: CHIPS_INICIALES };
    }

    const exacta = FAQ.find((entrada) => normalizar(entrada.pregunta) === limpio);
    if (exacta) {
      return { entrada: exacta, puntaje: 99, sugerencias: sugerenciasDe(exacta) };
    }

    const palabras = new Set(
      limpio.split(' ').filter((palabra) => palabra && !PALABRAS_VACIAS.has(palabra)).map(raiz)
    );

    let mejor = null;
    let mejorPuntaje = 0;
    let mejorTema = null;
    let mejorTemaPuntaje = 0;

    for (const entrada of FAQ) {
      const puntaje = puntuar(entrada, limpio, palabras);
      if (puntaje > mejorPuntaje) {
        mejor = entrada;
        mejorPuntaje = puntaje;
      }
      if (!entrada.cortesia && puntaje > mejorTemaPuntaje) {
        mejorTema = entrada;
        mejorTemaPuntaje = puntaje;
      }
    }

    if (mejor && mejor.cortesia && mejorTema && mejorTemaPuntaje >= 2) {
      mejor = mejorTema;
      mejorPuntaje = mejorTemaPuntaje;
    }

    if (!mejor || mejorPuntaje < 2) {
      return { entrada: SIN_RESPUESTA, puntaje: mejorPuntaje, sugerencias: CHIPS_INICIALES };
    }

    return { entrada: mejor, puntaje: mejorPuntaje, sugerencias: sugerenciasDe(mejor) };
  }

  
  globalThis.FibStudioChat = { faq: FAQ, buscar, normalizar };

  /* ---------------------------------------------------------
     Widget
     --------------------------------------------------------- */
  const ICONO_CHAT =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8l-4 3v-4.4A8.5 8.5 0 1 1 21 11.5Z"/></svg>';

  const ICONO_CERRAR =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  const ICONO_ENVIAR =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12 16-7-7 16-2.2-6.8L4 12Z"/></svg>';

  const ICONO_ESPIRAL =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 12c0-2 1.5-3.5 3.5-3.5S19 10.5 19 13c0 3.5-3 6-6.5 6C8 19 5 15.5 5 11.5 5 6.5 9 3 14 3"/></svg>';

  function iniciar() {
    if (document.getElementById('fs-chat')) return;

    const root = document.createElement('div');
    root.id = 'fs-chat';
    root.className = 'fs-chat';
    root.dataset.open = 'false';
    root.dataset.visto = 'false';
    root.innerHTML = `
      <section class="fs-chat__panel" id="fs-chat-panel" role="dialog" aria-modal="false" aria-labelledby="fs-chat-titulo" hidden>
        <header class="fs-chat__header">
          <div class="fs-chat__identidad">
            <span class="fs-chat__avatar">${ICONO_ESPIRAL}</span>
            <div>
              <p class="fs-chat__titulo" id="fs-chat-titulo">Asistente FibStudio</p>
              <p class="fs-chat__estado"><span class="fs-chat__punto" aria-hidden="true"></span>Respuestas automáticas</p>
            </div>
          </div>
          <button type="button" class="fs-chat__cerrar" aria-label="Cerrar asistente">${ICONO_CERRAR}</button>
        </header>

        <div class="fs-chat__log" role="log" aria-live="polite" aria-relevant="additions"></div>

        <div class="fs-chat__sugerencias" role="group" aria-label="Preguntas sugeridas"></div>

        <form class="fs-chat__form" autocomplete="off">
          <label class="fs-chat__sr" for="fs-chat-input">Escribe tu pregunta</label>
          <input class="fs-chat__input" id="fs-chat-input" type="text" placeholder="Escribe tu pregunta…" maxlength="220" />
          <button type="submit" class="fs-chat__enviar" aria-label="Enviar pregunta">${ICONO_ENVIAR}</button>
        </form>

        <p class="fs-chat__nota">Respuestas automáticas · <a href="${enlaceWhatsApp()}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></p>
      </section>

      <button type="button" class="fs-chat__toggle" aria-expanded="false" aria-controls="fs-chat-panel" aria-label="Abrir preguntas frecuentes">
        <span class="fs-chat__toggle-icono">${ICONO_CHAT}${ICONO_CERRAR}</span>
        <span class="fs-chat__toggle-texto">Preguntas frecuentes</span>
        <span class="fs-chat__badge" aria-hidden="true">1</span>
      </button>
    `;

    document.body.appendChild(root);

    const panel = root.querySelector('.fs-chat__panel');
    const log = root.querySelector('.fs-chat__log');
    const form = root.querySelector('.fs-chat__form');
    const input = root.querySelector('.fs-chat__input');
    const enviarBtn = root.querySelector('.fs-chat__enviar');
    const toggle = root.querySelector('.fs-chat__toggle');
    const toggleTexto = root.querySelector('.fs-chat__toggle-texto');
    const cerrarBtn = root.querySelector('.fs-chat__cerrar');
    const sugerencias = root.querySelector('.fs-chat__sugerencias');

    let abierto = false;
    let ocupado = false;
    let iniciado = false;

    function alFinal() {
      window.requestAnimationFrame(() => {
        log.scrollTop = log.scrollHeight;
      });
    }

    function crearBurbuja(quien) {
      const fila = document.createElement('div');
      fila.className = 'fs-chat__msg fs-chat__msg--' + quien;
      const burbuja = document.createElement('div');
      burbuja.className = 'fs-chat__bubble';
      fila.appendChild(burbuja);
      return { fila, burbuja };
    }

    function escribirConNegritas(destino, texto) {
      const partes = String(texto).split(/(\*\*[^*]+\*\*)/g);
      for (const parte of partes) {
        if (!parte) continue;
        if (parte.startsWith('**') && parte.endsWith('**')) {
          const strong = document.createElement('strong');
          strong.textContent = parte.slice(2, -2);
          destino.appendChild(strong);
        } else {
          destino.appendChild(document.createTextNode(parte));
        }
      }
    }

    function renderizarRespuesta(destino, texto) {
      const bloques = String(texto).split(/\n{2,}/);

      for (const bloque of bloques) {
        const lineas = bloque.split('\n').map((linea) => linea.trim()).filter(Boolean);
        if (!lineas.length) continue;

        const esLista = lineas.every((linea) => /^-\s+/.test(linea));
        const esNumerada = lineas.every((linea) => /^\d+[.)]\s+/.test(linea));

        if (esLista || esNumerada) {
          const lista = document.createElement(esNumerada ? 'ol' : 'ul');
          for (const linea of lineas) {
            const item = document.createElement('li');
            escribirConNegritas(item, linea.replace(/^-\s+/, '').replace(/^\d+[.)]\s+/, ''));
            lista.appendChild(item);
          }
          destino.appendChild(lista);
        } else {
          const parrafo = document.createElement('p');
          escribirConNegritas(parrafo, lineas.join(' '));
          destino.appendChild(parrafo);
        }
      }
    }

    function agregarUsuario(texto) {
      const { fila, burbuja } = crearBurbuja('user');
      burbuja.textContent = texto;
      log.appendChild(fila);
      alFinal();
    }

    function agregarBot(entrada) {
      const { fila, burbuja } = crearBurbuja('bot');
      renderizarRespuesta(burbuja, entrada.respuesta);

      if (Array.isArray(entrada.enlaces) && entrada.enlaces.length) {
        const caja = document.createElement('div');
        caja.className = 'fs-chat__enlaces';

        for (const enlace of entrada.enlaces) {
          const a = document.createElement('a');
          a.className = 'fs-chat__enlace';
          a.textContent = enlace.texto;
          a.setAttribute('href', enlace.whatsapp ? enlaceWhatsApp(enlace.whatsapp) : enlace.url);

          if (enlace.whatsapp || /^https?:/i.test(enlace.url || '')) {
            a.target = '_blank';
            a.rel = 'noopener';
          } else if ((enlace.url || '').startsWith('#')) {
            a.addEventListener('click', () => cerrar(false));
          }

          caja.appendChild(a);
        }

        burbuja.appendChild(caja);
      }

      log.appendChild(fila);
      alFinal();
    }

    function mostrarEscribiendo() {
      const { fila, burbuja } = crearBurbuja('bot');
      fila.classList.add('fs-chat__msg--escribiendo');
      fila.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 3; i += 1) burbuja.appendChild(document.createElement('span'));
      log.appendChild(fila);
      alFinal();
      return fila;
    }

    function pintarSugerencias(ids) {
      sugerencias.replaceChildren();
      const vistos = new Set();

      for (const id of ids) {
        const entrada = FAQ.find((item) => item.id === id);
        if (!entrada || vistos.has(entrada.id)) continue;
        vistos.add(entrada.id);

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'fs-chat__sugerencia';
        boton.textContent = entrada.chip || entrada.pregunta;
        boton.addEventListener('click', () => preguntar(entrada.pregunta));
        sugerencias.appendChild(boton);
      }

      sugerencias.hidden = sugerencias.children.length === 0;
    }

    function responderCon(entrada, textoUsuario) {
      if (ocupado) return;

      ocupado = true;
      enviarBtn.disabled = true;
      agregarUsuario(textoUsuario);
      const escribiendo = mostrarEscribiendo();

      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const retraso = reducido ? 80 : 380 + Math.random() * 320;

      window.setTimeout(() => {
        escribiendo.remove();
        agregarBot(entrada);
        pintarSugerencias(sugerenciasDe(entrada));
        ocupado = false;
        enviarBtn.disabled = false;
      }, retraso);
    }

    function preguntar(texto) {
      if (ocupado) return;
      const limpio = String(texto || '').trim();
      if (!limpio) return;

      const resultado = buscar(limpio);
      responderCon(resultado.entrada, limpio);
      input.value = '';
    }

    function iniciarConversacion() {
      if (iniciado) return;
      iniciado = true;

      agregarBot({
        respuesta: '¡Hola! Soy el asistente de FibStudio. Te respondo al instante las dudas más comunes sobre sesiones, eventos, precios y entregas.\n\n¿Sobre qué te gustaría saber?'
      });
      pintarSugerencias(CHIPS_INICIALES);
    }

    function abrir() {
      if (abierto) return;
      abierto = true;

      iniciarConversacion();
      panel.hidden = false;
      root.dataset.open = 'true';
      root.dataset.visto = 'true';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar preguntas frecuentes');
      toggleTexto.textContent = 'Cerrar';
      alFinal();

      // En pantallas táctiles evitamos abrir el teclado automáticamente.
      if (window.matchMedia('(min-width: 521px)').matches) {
        window.setTimeout(() => input.focus({ preventScroll: true }), 70);
      }
    }

    function cerrar(devolverFoco = true) {
      if (!abierto) return;
      abierto = false;

      panel.hidden = true;
      root.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir preguntas frecuentes');
      toggleTexto.textContent = 'Preguntas frecuentes';

      if (devolverFoco) toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', () => {
      if (abierto) cerrar(false);
      else abrir();
    });

    cerrarBtn.addEventListener('click', () => cerrar());

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      preguntar(input.value);
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && abierto) cerrar();
    });

    Object.assign(globalThis.FibStudioChat, {
      abrir,
      cerrar,
      preguntar,
      estaAbierto: () => abierto
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', iniciar, { once: true });
    } else {
      iniciar();
    }
  }
})();
