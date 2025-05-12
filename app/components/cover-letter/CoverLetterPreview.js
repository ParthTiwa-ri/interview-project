"use client";

import { useState, useRef } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Use standard PDF fonts
// No need to register external fonts as we'll use the standard PDF fonts

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman', // Standard PDF font
    fontSize: 12,
    lineHeight: 1.5
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Times-Bold', // Standard PDF font
    marginBottom: 10,
    textAlign: 'center',
  },
  contactInfo: {
    marginBottom: 5,
    textAlign: 'center',
  },
  date: {
    marginTop: 20,
    marginBottom: 20,
  },
  recipientInfo: {
    marginBottom: 20,
  },
  greeting: {
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  signature: {
    marginTop: 40,
    marginBottom: 10,
  },
  printedName: {
    fontFamily: 'Times-Bold', // Standard PDF font
  }
});

// PDF Document Component
const CoverLetterPDF = ({ coverLetterData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header / Personal Info */}
      <View style={styles.header}>
        <Text style={styles.name}>{coverLetterData.personalInfo.name}</Text>
        <Text style={styles.contactInfo}>{coverLetterData.personalInfo.address}</Text>
        <Text style={styles.contactInfo}>{coverLetterData.personalInfo.phone}</Text>
        <Text style={styles.contactInfo}>{coverLetterData.personalInfo.email}</Text>
        {coverLetterData.personalInfo.linkedin && (
          <Text style={styles.contactInfo}>{coverLetterData.personalInfo.linkedin}</Text>
        )}
      </View>
      
      {/* Date */}
      <View style={styles.date}>
        <Text>{new Date(coverLetterData.personalInfo.date).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}</Text>
      </View>
      
      {/* Recipient Info */}
      <View style={styles.recipientInfo}>
        {coverLetterData.recipientInfo.name && (
          <Text>{coverLetterData.recipientInfo.name}</Text>
        )}
        {coverLetterData.recipientInfo.title && (
          <Text>{coverLetterData.recipientInfo.title}</Text>
        )}
        {coverLetterData.recipientInfo.company && (
          <Text>{coverLetterData.recipientInfo.company}</Text>
        )}
        {coverLetterData.recipientInfo.address && (
          <Text>{coverLetterData.recipientInfo.address}</Text>
        )}
      </View>
      
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text>{coverLetterData.letterContent.greeting}</Text>
      </View>
      
      {/* Introduction */}
      <View style={styles.paragraph}>
        <Text>{coverLetterData.letterContent.introduction}</Text>
      </View>
      
      {/* Body Paragraphs */}
      {coverLetterData.letterContent.body.map((paragraph, index) => (
        <View style={styles.paragraph} key={paragraph.id || index}>
          <Text>{paragraph.paragraph}</Text>
        </View>
      ))}
      
      {/* Conclusion */}
      <View style={styles.paragraph}>
        <Text>{coverLetterData.letterContent.conclusion}</Text>
      </View>
      
      {/* Signature */}
      <View style={styles.signature}>
        <Text>{coverLetterData.letterContent.signature}</Text>
      </View>
      <View style={styles.printedName}>
        <Text>{coverLetterData.personalInfo.name}</Text>
      </View>
    </Page>
  </Document>
);

const CoverLetterPreview = ({ coverLetterData, onEdit }) => {
  const [isPdfReady, setIsPdfReady] = useState(false);
  const printRef = useRef(null);
  
  // Use browser's native print functionality instead of react-to-print
  const handlePrint = () => {
    // Store current page title
    const originalTitle = document.title;
    
    // Set a print-friendly title
    document.title = `${coverLetterData.personalInfo.name.replace(/\s+/g, '_')}_Cover_Letter`;
    
    // Print the document
    window.print();
    
    // Restore original title after printing
    document.title = originalTitle;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold">Cover Letter Preview</h2>
        <div className="flex space-x-4">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Print
          </button>
          <PDFDownloadLink
            document={<CoverLetterPDF coverLetterData={coverLetterData} />}
            fileName={`${coverLetterData.personalInfo.name.replace(/\s+/g, '_')}_Cover_Letter.pdf`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onLoadSuccess={() => setIsPdfReady(true)}
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Generating PDF...' : 'Download PDF'
            }
          </PDFDownloadLink>
        </div>
      </div>
      
      {/* Preview Content */}
      <div 
        ref={printRef}
        className="bg-white p-8 rounded shadow-sm border max-w-4xl mx-auto print:shadow-none print:border-0 print:p-0"
      >
        {/* Personal Info */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">{coverLetterData.personalInfo.name}</h1>
          <p>{coverLetterData.personalInfo.address}</p>
          <p>{coverLetterData.personalInfo.phone} | {coverLetterData.personalInfo.email}</p>
          {coverLetterData.personalInfo.linkedin && <p>{coverLetterData.personalInfo.linkedin}</p>}
        </div>
        
        {/* Date */}
        <div className="mb-6">
          <p>{new Date(coverLetterData.personalInfo.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
        </div>
        
        {/* Recipient Info */}
        <div className="mb-6">
          {coverLetterData.recipientInfo.name && <p>{coverLetterData.recipientInfo.name}</p>}
          {coverLetterData.recipientInfo.title && <p>{coverLetterData.recipientInfo.title}</p>}
          {coverLetterData.recipientInfo.company && <p>{coverLetterData.recipientInfo.company}</p>}
          {coverLetterData.recipientInfo.address && <p>{coverLetterData.recipientInfo.address}</p>}
        </div>
        
        {/* Letter Content */}
        <div className="space-y-4">
          <p>{coverLetterData.letterContent.greeting}</p>
          <p>{coverLetterData.letterContent.introduction}</p>
          
          {coverLetterData.letterContent.body.map((paragraph, index) => (
            <p key={paragraph.id || index}>{paragraph.paragraph}</p>
          ))}
          
          <p>{coverLetterData.letterContent.conclusion}</p>
          
          <div className="mt-8">
            <p>{coverLetterData.letterContent.signature}</p>
            <p className="font-medium">{coverLetterData.personalInfo.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
