import React, { useState } from "react";
import { Upload, Button, Form, Input, message, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

const { Dragger } = Upload;

const UploadPDF = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    executionDate: "",
    effectiveDate: "",
    terminationDate: "",
    partiesInvolved: "",
    titleOfContract: "",
    descriptionOfContract: "",
    renewalTime: "",
  });

//   const handleUpload = async (file) => {
//     const data = new FormData();
//     data.append("file", file);
  
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:8000/process-contract", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       console.log("Response from server:", response.data); // Debugging
//       const result = response.data;
  
//       setFormData({
//         executionDate: result.ExecutionDate || "",
//         effectiveDate: result.EffectiveDate || "",
//         terminationDate: result.TerminationDate || "",
//         partiesInvolved: result.PartiesInvolved?.join(", ") || "",
//         titleOfContract: result.TitleOfContract || "",
//         descriptionOfContract: result.DescriptionOfContract || "",
//         renewalTime: result.RenewalTime || "",
//       });
  
//       message.success("File processed successfully!");
//     } catch (error) {
//       console.error("Error during upload:", error); // Debugging
//       message.error("Failed to process the file. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
  
    setLoading(true);
    try {
      // Use fetch to send the file to the server
      const response = await fetch("http://localhost:8000/process-contract", {
        method: "POST",
        body: data, // Don't set "Content-Type" header manually
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      let result;

      if(response) result = await response.json(); // Parse the JSON response
  
      // Populate the form with results
      setFormData({
        executionDate: result.ExecutionDate || "",
        effectiveDate: result.EffectiveDate || "",
        terminationDate: result.TerminationDate || "",
        partiesInvolved: result.PartiesInvolved?.join(", ") || "",
        titleOfContract: result.TitleOfContract || "",
        descriptionOfContract: result.DescriptionOfContract || "",
        renewalTime: result.RenewalTime || "",
      });
  
    //   message.success("File processed successfully!");
    } catch (error) {
      console.error("Upload error:", error); // Debugging
      message.error("Failed to process the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleFormChange = (changedValues) => {
    setFormData((prev) => ({ ...prev, ...changedValues }));
  };

  const customRequest = ({ file, onSuccess }) => {
    // Use custom upload handler for Dragger
    setTimeout(() => onSuccess("ok"), 0);
    handleUpload(file);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Upload and Process PDF</h1>

      <Dragger
        name="file"
        accept=".pdf"
        customRequest={customRequest}
        showUploadList={false}
        disabled={loading}
        style={{
          borderRadius: "8px",
          borderColor: "#d9d9d9",
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
        </p>
        <p className="ant-upload-text">Click or drag a PDF file to this area to upload</p>
        <p className="ant-upload-hint">Supports single PDF file upload.</p>
      </Dragger>

      {loading ? (
        <Spin
          tip="Processing file..."
          style={{ display: "block", marginTop: "20px", textAlign: "center" }}
        />
      ) : (
        <Form
          layout="vertical"
          initialValues={formData}
          onValuesChange={(_, allValues) => handleFormChange(allValues)}
          style={{ marginTop: "20px" }}
        >
          <Form.Item label="Execution Date" name="executionDate">
            <Input value={formData.executionDate} />
          </Form.Item>
          <Form.Item label="Effective Date" name="effectiveDate">
            <Input value={formData.effectiveDate} />
          </Form.Item>
          <Form.Item label="Termination Date" name="terminationDate">
            <Input value={formData.terminationDate} />
          </Form.Item>
          <Form.Item label="Parties Involved" name="partiesInvolved">
            <Input.TextArea value={formData.partiesInvolved} rows={2} />
          </Form.Item>
          <Form.Item label="Title of Contract" name="titleOfContract">
            <Input value={formData.titleOfContract} />
          </Form.Item>
          <Form.Item label="Description of Contract" name="descriptionOfContract">
            <Input.TextArea value={formData.descriptionOfContract} rows={4} />
          </Form.Item>
          <Form.Item label="Renewal Time" name="renewalTime">
            <Input value={formData.renewalTime} />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UploadPDF;
