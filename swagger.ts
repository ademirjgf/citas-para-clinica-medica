import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Clínica Médica API",
    description: "API para gestión de pacientes, médicos, citas y recetas",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/index.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
