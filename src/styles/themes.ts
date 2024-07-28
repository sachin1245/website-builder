import {
  Open_Sans,
  Poppins,
  Roboto,
  Montserrat,
  Lato,
  Raleway,
} from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "700"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["500", "700"] });

export interface Theme {
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    border: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
}

export const lightTheme: Theme = {
  name: "Light",
  colors: {
    background: "#f8f9fa",
    text: "#212529",
    primary: "#007bff",
    secondary: "#6c757d",
    accent: "#28a745",
    surface: "#ffffff",
    border: "#dee2e6",
  },
  fonts: {
    body: openSans.style.fontFamily,
    heading: poppins.style.fontFamily,
  },
};

export const darkTheme: Theme = {
  name: "Dark",
  colors: {
    background: "#121212",
    text: "#e0e0e0",
    primary: "#bb86fc",
    secondary: "#03dac6",
    accent: "#cf6679",
    surface: "#1e1e1e",
    border: "#333333",
  },
  fonts: {
    body: roboto.style.fontFamily,
    heading: montserrat.style.fontFamily,
  },
};

export const vibrantTheme: Theme = {
  name: "Vibrant",
  colors: {
    background: "#2c3e50",
    text: "#ecf0f1",
    primary: "#3498db",
    secondary: "#e74c3c",
    accent: "#f1c40f",
    surface: "#34495e",
    border: "#7f8c8d",
  },
  fonts: {
    body: lato.style.fontFamily,
    heading: raleway.style.fontFamily,
  },
};

export const themes: Theme[] = [lightTheme, darkTheme, vibrantTheme];
