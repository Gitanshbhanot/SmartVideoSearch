import mixpanel from "mixpanel-browser";
import { mixpanelToken } from "..";

// Initialize Mixpanel
export const mixpanelInit = () => {
  if (mixpanelToken) {
    mixpanel.init(mixpanelToken, {
      api_host: "https://drdun9bya6vw5.cloudfront.net",
      persistence: "localStorage",
      track_pageview: true,
    });
  }
};

// Identify user via email and register super property
export const mixpanelIdentify = async ({ email = "" }) => {
  if (mixpanelToken && email) {
    mixpanel.identify(email);
    mixpanel.register({
      email: email,
    });
  }
};

// Track user login and set people properties
export const mixpanelLoginFunction = async ({ email = "" }) => {
  if (mixpanelToken && email) {
    mixpanel.identify(email);
    mixpanel.people.set({
      email: email,
    });
    mixpanel.register({
      email: email,
    });
    mixpanel.track("User login", {
      email: email,
    });
  }
};

// Track logout
export const mixpanelTrackLogOut = () => {
  if (mixpanelToken) {
    mixpanel.track("Log out");
    mixpanel.reset();
  }
};

// Track landing page visit
export const mixpanelTrackLandingPage = () => {
  if (mixpanelToken) {
    mixpanel.track("Landing page visited");
  }
};

// Track permission details (audio, microphone, camera)
export const mixpanelTrackPermissionDetail = ({
  audio = false,
  microphone = false,
  camera = false,
  status = "unknown",
}) => {
  if (mixpanelToken) {
    mixpanel.track("Permission detail", {
      audio,
      microphone,
      camera,
      status,
    });
  }
};

// Track text query
export const mixpanelTrackQueryText = ({
  text = "",
  persona = "",
  response = "",
  voice = "",
}) => {
  if (mixpanelToken) {
    mixpanel.track("Query text", {
      text,
      persona,
      response,
      voice,
    });
  }
};

// Track voice query
export const mixpanelTrackQueryVoice = ({
  text = "",
  persona = "",
  response = "",
  voice = "",
}) => {
  if (mixpanelToken) {
    mixpanel.track("Query voice", {
      text,
      persona,
      response,
      voice,
    });
  }
};

// Track persona change
export const mixpanelTrackPersonaChange = ({
  oldPersona = "",
  newPersona = "",
}) => {
  if (mixpanelToken) {
    mixpanel.track("Persona change", {
      oldPersona,
      newPersona,
    });
  }
};

// Track voice change
export const mixpanelTrackVoiceChange = ({ oldVoice = "", newVoice = "" }) => {
  if (mixpanelToken) {
    mixpanel.track("Voice change", {
      oldVoice,
      newVoice,
    });
  }
};

// Track site shot actions (open, share, download)
export const mixpanelTrackSiteShot = ({
  action = "open",
  email = "",
  snapshotId = "",
}) => {
  if (mixpanelToken) {
    mixpanel.track("SiteShot", {
      action,
      email,
      snapshotId,
    });
  }
};

// Track AR feature usage
export const mixpanelTrackARUse = ({ feature = "" }) => {
  if (mixpanelToken) {
    mixpanel.track("AR use", {
      feature,
    });
  }
};
