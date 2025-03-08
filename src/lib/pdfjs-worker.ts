import { pdfjs } from 'react-pdf';

// Use local worker files instead of CDN
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'; 