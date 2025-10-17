import ReactGA from "react-ga4";

const TRACKING_ID = "G-Z5K282BC5G"; // tumhara Google Analytics tracking ID

export const initGA = () => {
  ReactGA.initialize(TRACKING_ID);
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
