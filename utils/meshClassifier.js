// Define keywords for anatomical systems to help classify meshes based on their names
export const SYSTEM_KEYWORDS = {
  // Respiratory system terms (e.g., lung, trachea, etc.)
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

  // Digestive system terms (e.g., stomach, intestine, pancreas, etc.)
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

  // Skeletal system terms (includes bones and skeleton-related terms)
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

  // Muscular system terms (muscles, tendons, ligaments)
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

  // Cardiovascular system terms (heart, arteries, veins)
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

  // Nervous system terms (brain, spinal cord, nerves)
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

  // Lymphatic system terms (lymph, spleen, thymus)
  lymphatic: [
    'lymph',
    'spleen',
    'thymus',
    'tonsil',
    'node',
    'lymphatic',
    'immune'
  ],

  // Integumentary system terms (skin, hair, nails)
  integumentary: [
    'skin',
    'epidermis',
    'dermis',
    'subcutaneous',
    'hair',
    'nail',
    'integumentary'
  ],

  // Urinary system terms (kidney, bladder, urethra)
  urinary: [
    'kidney',
    'ureter',
    'bladder',
    'urethra',
    'renal',
    'urinary'
  ],

  // Endocrine system terms (glands like thyroid, adrenal, pituitary)
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

  // Sensory system terms (eyes, ears, nose, tongue)
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

// Function to classify a mesh based on its name by checking against predefined keywords
function classifyMesh(meshName) {
  const name = meshName.toLowerCase();  // Convert mesh name to lowercase for case-insensitive comparison
  const classifications = [];  // Array to store matched systems
  
  // Iterate through each system and its associated keywords
  Object.entries(SYSTEM_KEYWORDS).forEach(([system, keywords]) => {
    if (keywords.include && keywords.exclude) {  // If include and exclude lists exist for the system
      const isExcluded = keywords.exclude.some(term => name.includes(term));  // Check for excluded terms
      if (!isExcluded) {  // If no excluded terms are found, check for included terms
        const isIncluded = keywords.include.some(term => name.includes(term));
        if (isIncluded) {
          classifications.push(system);  // Add the system to the classifications array
        }
      }
    } else {  // If no exclude list exists, just check for included terms
      const terms = Array.isArray(keywords) ? keywords : keywords.include;
      if (terms.some(term => name.includes(term))) {
        classifications.push(system);
      }
    }
  });
  
  // Log the classifications or a message if no classifications are found
  if (classifications.length > 0) {
    console.log(`Classified ${meshName} as:`, classifications);
  } else {
    console.log(`Could not classify mesh: ${meshName}`);
  }
  
  return classifications;  // Return the list of classifications
}

// Function to classify multiple meshes and group them by anatomical system
export function classifyMeshesToSystems(meshes) {
  const classification = {};  // Initialize an empty object to hold the classification result
  
  // Initialize empty arrays for each system in the classification object
  Object.keys(SYSTEM_KEYWORDS).forEach(system => {
    classification[system] = [];
  });

  // For each mesh, classify it and assign it to the corresponding systems
  meshes.forEach(mesh => {
    const systems = classifyMesh(mesh);  // Get the systems the mesh belongs to
    systems.forEach(system => {
      classification[system].push(mesh);  // Add mesh to the appropriate system's array
    });
  });

  return classification;  // Return the classification object
}