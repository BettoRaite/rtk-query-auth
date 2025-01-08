import z from "zod";

const envSchema = z.object({
  VITE_AUTH_SERVER_URL: z.string({
    message: "Provide url to auth server",
  }),
  VITE_RESOURCE_SERVER_URL: z.string({
    message: "Provide url to res server",
  }),
});

const { data, error, success } = envSchema.safeParse(import.meta.env);

if (!success) {
  // biome-ignore lint/complexity/noForEach:
  error.errors.forEach(({ message, path }) => {
    console.log(`Bad env detected\nAt: ${path}\nError message: ${message}`);
  });
  throw new Error("Bad config");
}

const { VITE_RESOURCE_SERVER_URL, VITE_AUTH_SERVER_URL } = data;

const config = {
  server: {
    resource: VITE_RESOURCE_SERVER_URL,
    auth: VITE_AUTH_SERVER_URL,
  },
};

export default config;
