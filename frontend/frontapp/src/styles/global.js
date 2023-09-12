import { createGlobalStyle } from "styled-components";

const GlobalVariableStyle = createGlobalStyle`
:root {
  // font size
  --mobile-h1: 42px; 
  --mobile-h2: 36px; 
  --mobile-h3: 24px;
  --mobile-h4: 20px;
  --mobile-h5: 16px;
  --mobile-h6: 12px;
  --mobile-p: 12px;
  --mobile-text: 14px;
  --mobile-label: 11px;

  // color
  --primary: #6F19FF;
  --secondary: #6850A4;
  --background: #030712;
  --starColor1:#f5fcfd;
  --starColor2:#fff5f5;
  --starColor3: #fffddd;
  --starColor4: #e8ffeb;
  --red: red;
  --blue: blue;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --gray-1000: #030712;

}
#root {
  font-family: "KIMM";
}

body {
  background: #030712;
}
`;

export default GlobalVariableStyle;