"use client";

const SYSTEM_KEYWORDS = {
  respiratory: [
    'lung', 'lungs',
    'bronchi', 'bronchus',
    'trachea',
    'larynx',
    'pharynx',
    'diaphragm',
    'pleura',
    'respiratory',
    'airways',
    'breathing',
    'pulmonary'
  ],
  
  digestive: [
    'stomach',
    'intestine',
    'liver',
    'pancreas',
    'esophagus',
    'gallbladder',
    'colon',
    'rectum',
    'appendix',
    'cecum',
    'duodenum',
    'ileum',
    'jejunum',
    'digestive',
    'buccal'
  ],

  skeletal: {
    include: [
      '_bone_', 
      'skull',
      'cranium',
      'mandible',
      'maxilla',
      'vertebra',
      'rib_',
      'spine_',
      'femur_',
      'tibia_',
      'fibula_',
      'humerus_',
      'radius_',
      'ulna_',
      'pelvis_',
      'ilium_',
      'ischium_',
      'pubis_',
      'clavicle_',
      'scapula_',
      'sternum_',
      'hyoid_',
      'carpal_',
      'metacarpal_',
      'tarsal_',
      'metatarsal_',
      'phalange_',
      'sacrum_',
      'coccyx_'
    ],
    exclude: [
      'muscle',
      'tendon',
      'ligament',
      'fascia',
      'tissue',
      'membrane',
      'cartilage'
    ]
  },

  muscular: [
    'muscle',
    'tendon',
    'ligament',
    'biceps',
    'triceps',
    'deltoid',
    'pectoral',
    'trapezius',
    'latissimus',
    'rectus',
    'oblique',
    'quadriceps',
    'hamstring',
    'gastrocnemius',
    'soleus',
    'muscular',
    'myofascial'
  ],

  cardiovascular: [
    'heart',
    'aorta',
    'artery',
    'vein',
    'ventricle',
    'atrium',
    'valve',
    'coronary',
    'vena_cava',
    'pulmonary_artery',
    'pulmonary_vein',
    'cardiovascular',
    'cardiac'
  ],

  nervous: [
    'brain',
    'nerve',
    'spinal_cord',
    'cerebrum',
    'cerebellum',
    'brainstem',
    'thalamus',
    'hypothalamus',
    'pituitary',
    'neural',
    'nervous'
  ],

  lymphatic: [
    'lymph',
    'spleen',
    'thymus',
    'tonsil',
    'node',
    'lymphatic',
    'immune'
  ],

  integumentary: [
    'skin',
    'epidermis',
    'dermis',
    'subcutaneous',
    'hair',
    'nail',
    'integumentary'
  ],

  urinary: [
    'kidney',
    'ureter',
    'bladder',
    'urethra',
    'renal',
    'urinary'
  ],

  endocrine: [
    'thyroid',
    'adrenal',
    'pituitary',
    'pancreas',
    'pineal',
    'parathyroid',
    'endocrine',
    'gland'
  ],

  sensory: [
    'eye',
    'ear',
    'nose',
    'tongue',
    'retina',
    'cochlea',
    'vestibular',
    'olfactory',
    'sensory'
  ]
};

function classifyMesh(meshName) {
  const name = meshName.toLowerCase();
  const classifications = [];
  
  Object.entries(SYSTEM_KEYWORDS).forEach(([system, keywords]) => {
    if (keywords.include && keywords.exclude) {
      const isExcluded = keywords.exclude.some(term => name.includes(term));
      if (!isExcluded) {
        const isIncluded = keywords.include.some(term => name.includes(term));
        if (isIncluded) {
          classifications.push(system);
        }
      }
    } else {
      const terms = Array.isArray(keywords) ? keywords : keywords.include;
      if (terms.some(term => name.includes(term))) {
        classifications.push(system);
      }
    }
  });
  
  if (classifications.length > 0) {
    console.log(`Classified ${meshName} as:`, classifications);
  } else {
    console.log(`Could not classify mesh: ${meshName}`);
  }
  
  return classifications;
}

export function classifyMeshesToSystems(meshes) {
  const classification = {};
  
  Object.keys(SYSTEM_KEYWORDS).forEach(system => {
    classification[system] = [];
  });

  meshes.forEach(mesh => {
    const systems = classifyMesh(mesh);
    systems.forEach(system => {
      classification[system].push(mesh);
    });
  });

  return classification;
}