interface IMailConfig {
  driver: "ethereal" | "ses";

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || "ethereal",

  defaults: {
    from: {
      email: "lucas.cruz@agenciaroad.tech",
      name: "Lucas da Road",
    },
  },
} as IMailConfig;
