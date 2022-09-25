module.exports = [
  {
    type: "input",
    message: "Pick the name of your project?",
    name: "projectName",
    initial: "my-lean-project",
  },
  {
    type: "input",
    message: "Pick the dev server port:",
    name: "devServerPort",
    initial: "33000",
  },
  {
    type: "input",
    message: "Pick the name of your micro-app:",
    name: "microFrontendName",
    required: true,
  },
];
