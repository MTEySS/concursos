app.value('quizzes',
  [
    {
      title: 'Empleo Público',
      code: 'empleo_publico',
      description: 'actividades de carácter transitorio o estacional actividades por tiempo determinado',
      moreInfo: 'http://concursos.js.org/#/capacitate',
      questions: [

        {
          description: 'Según la LEY MARCO DE REGULACION DE EMPLEO PUBLICO NACIONAL, decreto 1421/2002 ¿cómo deben ser las tareas que cumple el personal contratado?',
          mode: 'multiple_choice',
          options: [
            { description: 'actividades de carácter transitorio o estacional', value: true },
            { description: 'actividades por tiempo determinado', value: true },
            { description: 'propias del personal de planta permanente', value: false },
            { description: 'para proyectos especiales o para atender incrementos no permanentes de tareas', value: true },
            { description: 'necesarias para complementar el ejercicio de las acciones y competencias asignadas a cada jurisdicción', value: true },
            { description: 'que no puedan ser cubiertas por cada jurisdicción por falta de personal', value: false }
          ],
          explanation: 'Como figura en el artículo 9 de la ley marco de empleo público',
          links: [
            {
              title: 'LEY MARCO DE REGULACION DE EMPLEO PUBLICO NACIONAL, Decreto 1421/2002',
              url: 'http://mteyss.github.io/concursos/contenidos/contenidos_transversales/empleo_publico/dec_1421_2002-ley_marco_regulacion_empleo_publico_nacional.doc'
            }
          ]
        },

        {
          description: 'Quien debe regir en materia de empleo público y autoridad de aplicación e interpretación de las disposiciones de la Ley Nº 25.164 es:',
          mode: 'choice',
          options: [
            { description: 'la SUBSECRETARIA DE LA GESTION PUBLICA de la JEFATURA DE GABINETE DE MINISTROS', value: true },
            { description: 'el titular de la JEFATURA DE GABINETE DE MINISTROS'},
            { description: 'el titular de la jurisdicción u organismo descentralizado'},
            { description: 'el titular de las Unidades de Recursos Humanos de la jurisdicción u organismo descentralizado'}
          ],
          explanation: 'Como figura en el artículo 2 de la ley marco de empleo público...',
          links: [
            {
              title: 'LEY MARCO DE REGULACION DE EMPLEO PUBLICO NACIONAL, Decreto 1421/2002',
              url: 'http://mteyss.github.io/concursos/contenidos/contenidos_transversales/empleo_publico/dec_1421_2002-ley_marco_regulacion_empleo_publico_nacional.doc'
            }
          ]
        },

        {
          description: 'El régimen de contrataciones comprende la contratación por tiempo determinado y la designación en plantas permanente.',
          mode: 'true_false',
          value: false,
          explanation: 'Como figura en el artículo 9 de la ley marco de empleo público...',
          links: [
            {
              title: 'LEY MARCO DE REGULACION DE EMPLEO PUBLICO NACIONAL, Decreto 1421/2002',
              url: 'http://mteyss.github.io/concursos/contenidos/contenidos_transversales/empleo_publico/dec_1421_2002-ley_marco_regulacion_empleo_publico_nacional.doc'
            }
          ]
        }

      ], // questions
    }
  ]
);
