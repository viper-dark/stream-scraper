import common from './constants.common.js';
import  devs  from './constants.dev.js'
import prods from './constants.prod.js'




const getEnvironmentSpecificConstants =  (env) => {
  switch (env) {
    case 'development': {
      return devs
    }
    case 'production': {
      return prods
    }
    default: {
      throw new Error(`no matching constants file found for env '${env}'`);
    }
  }
};

const getMergedConstants =  () => {
  try {
    const environmentConstantsModule = getEnvironmentSpecificConstants(process.env.NODE_ENV);
    const environmentConstants = environmentConstantsModule.default;
    const mergedConstants = { ...common, ...environmentConstants };
    return mergedConstants;
  } catch (error) {
    console.error(error);
    return null; // Return a default value or handle the error as needed
  }
};


export default getMergedConstants();
