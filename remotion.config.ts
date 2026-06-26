import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(null); // auto
Config.setOverwriteOutput(true);
// El environment de las routines enruta el egress por un proxy con MITM TLS (CA propia que el Chromium
// de Remotion no trae en su trust store) -> las fuentes de fonts.gstatic.com fallaban con
// ERR_CERT_AUTHORITY_INVALID y abortaban el render. Ignorar el error de certificado en el Chromium
// headless (sandbox efímero y privado) deja cargar las fuentes sin tocar la red ni el guion.
Config.setChromiumIgnoreCertificateErrors(true);
